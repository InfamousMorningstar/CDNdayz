"""
CDN DayZ PvP log shipper.

Single-file agent that tails one or more DayZ server profile directories,
parses kill/connect/disconnect events from .ADM admin logs, and ships
them in batches to the CDN website's /api/pvp/ingest endpoint.

Design goals:
  - Single executable for Windows admins (PyInstaller).
  - One YAML config — log paths, server ids, ingest url + key.
  - Survives website outages: events queue to disk and replay on reconnect.
  - Survives game-server restarts: detects new .ADM file rotation and
    persists per-file byte offsets between runs.
  - Idempotent: every event has a stable sha1 id; the server dedupes.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import logging.handlers
import os
import re
import signal
import sys
import time
from collections import deque
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Deque, Dict, List, Optional, Tuple

# Third-party deps — listed in requirements.txt
import requests
import yaml

VERSION = "v0.1.0"

# ── Regexes for the .ADM log format ────────────────────────────────────────
# Date header at the top of every .ADM file gives us the base date,
# since individual log lines only carry HH:MM:SS.
RE_HEADER = re.compile(
    r"AdminLog started on (?P<y>\d{4})-(?P<mo>\d{2})-(?P<d>\d{2}) at (?P<h>\d{2}):(?P<mi>\d{2}):(?P<s>\d{2})"
)

# Kill: victim is dead, killer is a Player.
# Real DayZ variations: victim and/or killer may carry "(DEAD)" marker,
# and melee kills come through as "with (MeleeFist)" with no distance.
RE_KILL = re.compile(
    r'^(?P<h>\d{2}):(?P<mi>\d{2}):(?P<s>\d{2}) \| '
    r'Player "(?P<victim>[^"]+)"(?:\s+\(DEAD\))? \(id=(?P<vid>\S+) pos=<[^>]*>\)'
    r'(?:\s*\[HP: 0(?:\.\d+)?\])?'
    r' killed by Player "(?P<killer>[^"]+)"(?:\s+\(DEAD\))? \(id=(?P<kid>\S+) pos=<[^>]*>\)'
    r' with (?P<weapon>.+?)(?: from (?P<dist>[\d.]+) meters)?\s*$'
)

# Hit by a Player — used only to determine if a subsequent kill was a headshot.
# Real DayZ logs have no space between ")" and "[HP:".
RE_HIT = re.compile(
    r'^(?P<h>\d{2}):(?P<mi>\d{2}):(?P<s>\d{2}) \| '
    r'Player "(?P<victim>[^"]+)"(?:\s+\(DEAD\))? \(id=(?P<vid>\S+) pos=<[^>]*>\)'
    r'\s*\[HP: (?P<hp>[\d.]+)\] hit by Player "(?P<killer>[^"]+)"(?:\s+\(DEAD\))? \(id=(?P<kid>\S+) pos=<[^>]*>\)'
    r' into (?P<zone>\S+)'
)

# Connect: only "is connected" (post-handshake), not "is connecting".
# pos=<...> appears once the player has finished spawning in.
RE_CONNECT = re.compile(
    r'^(?P<h>\d{2}):(?P<mi>\d{2}):(?P<s>\d{2}) \| '
    r'Player "(?P<name>[^"]+)" \(id=(?P<id>\S+)(?: pos=<[^>]*>)?\) is connected'
)

RE_DISCONNECT = re.compile(
    r'^(?P<h>\d{2}):(?P<mi>\d{2}):(?P<s>\d{2}) \| '
    r'Player "(?P<name>[^"]+)"(?:\s+\(DEAD\))? \(id=(?P<id>\S+)(?: pos=<[^>]*>)?\) has been disconnected'
)

# How long after a hit we still consider it the "last hit" for headshot
# attribution on a subsequent kill of the same victim.
HEADSHOT_WINDOW_SEC = 30


# ── Data ───────────────────────────────────────────────────────────────────

@dataclass
class ServerCfg:
    id: str
    name: str
    log_dir: str


@dataclass
class AgentCfg:
    poll_interval_sec: int = 5
    batch_size: int = 200
    state_file: str = "state.json"
    queue_file: str = "queue.jsonl"
    log_file: str = "agent.log"
    request_timeout_sec: int = 15


@dataclass
class WebsiteCfg:
    ingest_url: str
    ingest_key: str


@dataclass
class Config:
    website: WebsiteCfg
    servers: List[ServerCfg]
    agent: AgentCfg = field(default_factory=AgentCfg)


@dataclass
class FileState:
    path: str
    offset: int = 0
    base_date: Optional[str] = None  # "YYYY-MM-DD"
    last_time: Optional[str] = None  # "HH:MM:SS" — to detect midnight rollover


@dataclass
class ParserState:
    """Persisted between runs. Keyed by absolute file path."""
    files: Dict[str, FileState] = field(default_factory=dict)


def event_id(server_id: str, ts_ms: int, kind: str,
             a: str = "", b: str = "", c: str = "") -> str:
    raw = f"{server_id}|{ts_ms}|{kind}|{a}|{b}|{c}"
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()


# ── Config loading ─────────────────────────────────────────────────────────

def load_config(path: Path) -> Config:
    with path.open("r", encoding="utf-8") as f:
        raw = yaml.safe_load(f)
    if not isinstance(raw, dict):
        raise ValueError(f"{path}: config root must be a mapping")

    web_raw = raw.get("website") or {}
    if not web_raw.get("ingest_url") or not web_raw.get("ingest_key"):
        raise ValueError("website.ingest_url and website.ingest_key are required")
    website = WebsiteCfg(
        ingest_url=str(web_raw["ingest_url"]).rstrip("/"),
        ingest_key=str(web_raw["ingest_key"]),
    )

    srv_raw = raw.get("servers") or []
    if not srv_raw:
        raise ValueError("at least one server must be configured")
    servers: List[ServerCfg] = []
    for s in srv_raw:
        if not (s.get("id") and s.get("name") and s.get("log_dir")):
            raise ValueError(f"server entry missing id/name/log_dir: {s!r}")
        servers.append(ServerCfg(id=str(s["id"]), name=str(s["name"]), log_dir=str(s["log_dir"])))

    agent_raw = raw.get("agent") or {}
    agent = AgentCfg(
        poll_interval_sec=int(agent_raw.get("poll_interval_sec", 5)),
        batch_size=int(agent_raw.get("batch_size", 200)),
        state_file=str(agent_raw.get("state_file", "state.json")),
        queue_file=str(agent_raw.get("queue_file", "queue.jsonl")),
        log_file=str(agent_raw.get("log_file", "agent.log")),
        request_timeout_sec=int(agent_raw.get("request_timeout_sec", 15)),
    )

    return Config(website=website, servers=servers, agent=agent)


# ── Parser state persistence ───────────────────────────────────────────────

def load_state(path: Path) -> ParserState:
    if not path.exists():
        return ParserState()
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        files = {k: FileState(**v) for k, v in data.get("files", {}).items()}
        return ParserState(files=files)
    except Exception as e:
        logging.warning("Failed to load state from %s, starting fresh: %s", path, e)
        return ParserState()


def save_state(path: Path, state: ParserState) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    payload = {"files": {k: asdict(v) for k, v in state.files.items()}}
    tmp.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    tmp.replace(path)


# ── ADM parser ─────────────────────────────────────────────────────────────

class AdmParser:
    """
    Parses one .ADM file incrementally. Tracks base date from the file
    header and handles midnight rollovers within a file.
    """

    def __init__(self, server: ServerCfg, file_state: FileState):
        self.server = server
        self.state = file_state
        # Recent hits keyed by (killer_id, victim_id) → (ts_ms, zone)
        # Used to mark kill events as headshots when the preceding hit was Head.
        self._recent_hits: Deque[Tuple[int, str, str, str]] = deque(maxlen=500)

    def _parse_time(self, h: str, mi: str, s: str) -> Optional[int]:
        if not self.state.base_date:
            return None
        try:
            y, mo, d = self.state.base_date.split("-")
            # Handle midnight rollover within the file.
            if self.state.last_time and f"{h}:{mi}:{s}" < self.state.last_time:
                base = datetime(int(y), int(mo), int(d), tzinfo=timezone.utc) + timedelta(days=1)
                self.state.base_date = base.strftime("%Y-%m-%d")
                y, mo, d = self.state.base_date.split("-")
            dt = datetime(int(y), int(mo), int(d), int(h), int(mi), int(s), tzinfo=timezone.utc)
            self.state.last_time = f"{h}:{mi}:{s}"
            return int(dt.timestamp() * 1000)
        except Exception:
            return None

    def _check_headshot(self, killer_id: str, victim_id: str, ts_ms: int) -> bool:
        key = (killer_id, victim_id)
        cutoff = ts_ms - HEADSHOT_WINDOW_SEC * 1000
        for ts, kid, vid, zone in reversed(self._recent_hits):
            if ts < cutoff:
                break
            if (kid, vid) == key:
                return zone.startswith("Head")
        return False

    def parse_line(self, line: str) -> Optional[dict]:
        line = line.rstrip("\r\n")
        if not line:
            return None

        m = RE_HEADER.search(line)
        if m:
            self.state.base_date = f"{m['y']}-{m['mo']}-{m['d']}"
            self.state.last_time = f"{m['h']}:{m['mi']}:{m['s']}"
            return None

        m = RE_HIT.match(line)
        if m:
            ts = self._parse_time(m["h"], m["mi"], m["s"])
            if ts is None:
                return None
            self._recent_hits.append((ts, m["kid"], m["vid"], m["zone"]))
            return None  # hits are not shipped

        m = RE_KILL.match(line)
        if m:
            ts = self._parse_time(m["h"], m["mi"], m["s"])
            if ts is None:
                return None
            distance = None
            if m["dist"]:
                try:
                    distance = float(m["dist"])
                except ValueError:
                    pass
            headshot = self._check_headshot(m["kid"], m["vid"], ts)
            return {
                "id": event_id(self.server.id, ts, "kill", m["kid"], m["vid"], m["weapon"]),
                "serverId": self.server.id,
                "ts": ts,
                "kind": "kill",
                "killerId": m["kid"],
                "killerName": m["killer"],
                "victimId": m["vid"],
                "victimName": m["victim"],
                "weapon": m["weapon"].strip(),
                "distance": distance,
                "headshot": headshot,
            }

        m = RE_CONNECT.match(line)
        if m:
            ts = self._parse_time(m["h"], m["mi"], m["s"])
            if ts is None:
                return None
            return {
                "id": event_id(self.server.id, ts, "connect", m["id"]),
                "serverId": self.server.id,
                "ts": ts,
                "kind": "connect",
                "playerId": m["id"],
                "playerName": m["name"],
            }

        m = RE_DISCONNECT.match(line)
        if m:
            ts = self._parse_time(m["h"], m["mi"], m["s"])
            if ts is None:
                return None
            return {
                "id": event_id(self.server.id, ts, "disconnect", m["id"]),
                "serverId": self.server.id,
                "ts": ts,
                "kind": "disconnect",
                "playerId": m["id"],
                "playerName": m["name"],
            }

        return None


# ── File watcher ───────────────────────────────────────────────────────────

def discover_adm_files(log_dir: Path) -> List[Path]:
    if not log_dir.is_dir():
        return []
    return sorted(log_dir.glob("*.ADM"), key=lambda p: p.stat().st_mtime)


def read_new_lines(path: Path, offset: int) -> Tuple[List[str], int]:
    """
    Read lines from `path` starting at byte offset `offset`.
    Returns (lines, new_offset). Handles file truncation.
    """
    try:
        size = path.stat().st_size
    except FileNotFoundError:
        return [], offset
    if size < offset:
        # File was truncated or rotated in place — start over.
        offset = 0
    if size == offset:
        return [], offset
    # Read in binary, then decode with latin-1 to tolerate any byte sequence.
    # DayZ writes UTF-8 but some mods can inject odd bytes.
    with path.open("rb") as f:
        f.seek(offset)
        chunk = f.read(size - offset)
    text = chunk.decode("utf-8", errors="replace")
    # If the last chunk doesn't end with newline, keep the partial line for
    # next pass by rolling back the offset to just before it.
    if text and not text.endswith("\n"):
        last_nl = text.rfind("\n")
        if last_nl == -1:
            # No newline at all — wait for more data.
            return [], offset
        complete = text[: last_nl + 1]
        new_offset = offset + len(complete.encode("utf-8"))
        return complete.splitlines(), new_offset
    return text.splitlines(), size


# ── Disk queue for offline buffering ───────────────────────────────────────

class DiskQueue:
    """
    Append-only JSONL queue. Drained by the shipper when the website is
    reachable. Each line is one batch: {"serverId": "...", "events": [...]}.
    """

    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def enqueue(self, server_id: str, events: List[dict]) -> None:
        if not events:
            return
        batch = {"serverId": server_id, "events": events}
        with self.path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(batch, separators=(",", ":")) + "\n")

    def drain(self):
        """Yield (batch, line_count_consumed) pairs; caller calls ack()."""
        if not self.path.exists():
            return
        with self.path.open("r", encoding="utf-8") as f:
            lines = f.readlines()
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line), i + 1
            except json.JSONDecodeError:
                logging.warning("Dropping malformed queue line %d", i + 1)

    def rewrite(self, remaining: List[str]) -> None:
        tmp = self.path.with_suffix(self.path.suffix + ".tmp")
        tmp.write_text("\n".join(remaining) + ("\n" if remaining else ""), encoding="utf-8")
        tmp.replace(self.path)


# ── Shipper ────────────────────────────────────────────────────────────────

class Shipper:
    def __init__(self, cfg: Config, queue: DiskQueue):
        self.cfg = cfg
        self.queue = queue
        self.session = requests.Session()
        self.session.headers.update({
            "X-Ingest-Key": cfg.website.ingest_key,
            "Content-Type": "application/json",
            "User-Agent": f"cdn-pvp-parser/{VERSION}",
        })
        self._consecutive_failures = 0

    def _post(self, server_id: str, events: List[dict]) -> bool:
        body = json.dumps({"serverId": server_id, "events": events}, separators=(",", ":"))
        try:
            r = self.session.post(
                self.cfg.website.ingest_url,
                data=body,
                timeout=self.cfg.agent.request_timeout_sec,
            )
        except requests.RequestException as e:
            logging.warning("ingest network error: %s", e)
            return False
        if r.status_code == 401:
            logging.error("ingest 401 — check website.ingest_key matches PVP_INGEST_KEY on the website")
            return False
        if r.status_code >= 500:
            logging.warning("ingest 5xx (%s): %s", r.status_code, r.text[:200])
            return False
        if r.status_code >= 400:
            # Client error — log and DROP, since retrying won't help.
            logging.error("ingest %s (dropping): %s", r.status_code, r.text[:200])
            return True
        try:
            payload = r.json()
            logging.info(
                "[%s] accepted=%s dup=%s rej=%s",
                server_id,
                payload.get("accepted"),
                payload.get("duplicates"),
                payload.get("rejected"),
            )
        except ValueError:
            pass
        return True

    def ship(self, server_id: str, events: List[dict]) -> None:
        # Always go through the queue so a transient failure between
        # "post" and "ack" doesn't lose events.
        self.queue.enqueue(server_id, events)
        self.flush()

    def flush(self) -> None:
        """Try to drain the disk queue. Stops at first failure."""
        if not self.queue.path.exists():
            return
        with self.queue.path.open("r", encoding="utf-8") as f:
            lines = f.readlines()
        remaining: List[str] = []
        sent_ok = True
        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue
            if not sent_ok:
                remaining.append(stripped)
                continue
            try:
                batch = json.loads(stripped)
            except json.JSONDecodeError:
                logging.warning("dropping malformed queue line")
                continue
            ok = self._post(batch["serverId"], batch["events"])
            if not ok:
                remaining.append(stripped)
                sent_ok = False
                self._consecutive_failures += 1
            else:
                self._consecutive_failures = 0
        self.queue.rewrite(remaining)
        if self._consecutive_failures and self._consecutive_failures % 10 == 0:
            logging.error("ingest has failed %d times in a row", self._consecutive_failures)


# ── Main loop ──────────────────────────────────────────────────────────────

class Agent:
    def __init__(self, cfg: Config):
        self.cfg = cfg
        self.state_path = Path(cfg.agent.state_file)
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        self.state = load_state(self.state_path)
        self.queue = DiskQueue(Path(cfg.agent.queue_file))
        self.shipper = Shipper(cfg, self.queue)
        self.parsers: Dict[str, AdmParser] = {}  # keyed by file path
        self._stop = False

    def stop(self, *_: object) -> None:
        logging.info("stop requested")
        self._stop = True

    def _get_parser(self, server: ServerCfg, path: Path) -> AdmParser:
        key = str(path)
        if key not in self.parsers:
            fs = self.state.files.get(key)
            if fs is None:
                fs = FileState(path=key, offset=0)
                self.state.files[key] = fs
            self.parsers[key] = AdmParser(server, fs)
        return self.parsers[key]

    def _scan_server(self, server: ServerCfg) -> None:
        log_dir = Path(server.log_dir)
        if not log_dir.is_dir():
            logging.warning("[%s] log_dir does not exist: %s", server.id, log_dir)
            return
        adm_files = discover_adm_files(log_dir)
        if not adm_files:
            return

        events: List[dict] = []
        for path in adm_files:
            fs = self.state.files.get(str(path))
            offset = fs.offset if fs else 0
            lines, new_offset = read_new_lines(path, offset)
            if not lines and offset == new_offset:
                continue
            parser = self._get_parser(server, path)
            for line in lines:
                ev = parser.parse_line(line)
                if ev:
                    events.append(ev)
            parser.state.offset = new_offset
            self.state.files[str(path)] = parser.state

            # Ship in chunks to keep batches under the server's MAX_BATCH (1000).
            while len(events) >= self.cfg.agent.batch_size:
                chunk = events[: self.cfg.agent.batch_size]
                events = events[self.cfg.agent.batch_size:]
                self.shipper.ship(server.id, chunk)

        if events:
            self.shipper.ship(server.id, events)

    def run(self) -> None:
        signal.signal(signal.SIGINT, self.stop)
        signal.signal(signal.SIGTERM, self.stop)
        logging.info("agent %s starting (%d servers)", VERSION, len(self.cfg.servers))
        # Drain any leftover queue from a previous crash before tailing.
        self.shipper.flush()
        while not self._stop:
            try:
                for server in self.cfg.servers:
                    if self._stop:
                        break
                    self._scan_server(server)
                save_state(self.state_path, self.state)
                self.shipper.flush()
            except Exception:
                logging.exception("scan cycle failed")
            for _ in range(self.cfg.agent.poll_interval_sec * 10):
                if self._stop:
                    break
                time.sleep(0.1)
        save_state(self.state_path, self.state)
        logging.info("agent stopped cleanly")


# ── Logging setup ──────────────────────────────────────────────────────────

def setup_logging(log_file: str, verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    root = logging.getLogger()
    root.setLevel(level)
    fmt = logging.Formatter("%(asctime)s %(levelname)-7s %(message)s",
                            datefmt="%Y-%m-%d %H:%M:%S")
    for h in list(root.handlers):
        root.removeHandler(h)

    stream = logging.StreamHandler(sys.stdout)
    stream.setFormatter(fmt)
    root.addHandler(stream)

    log_path = Path(log_file)
    log_path.parent.mkdir(parents=True, exist_ok=True)
    rotating = logging.handlers.RotatingFileHandler(
        log_path, maxBytes=5 * 1024 * 1024, backupCount=5, encoding="utf-8",
    )
    rotating.setFormatter(fmt)
    root.addHandler(rotating)


# ── CLI ────────────────────────────────────────────────────────────────────

def default_config_path() -> Path:
    """When frozen by PyInstaller, look next to the .exe; otherwise CWD."""
    if getattr(sys, "frozen", False):
        return Path(sys.executable).parent / "config.yaml"
    return Path("config.yaml")


def cmd_test_config(cfg_path: Path) -> int:
    try:
        cfg = load_config(cfg_path)
    except Exception as e:
        print(f"CONFIG ERROR: {e}", file=sys.stderr)
        return 2
    print(f"OK — {len(cfg.servers)} server(s) configured:")
    for s in cfg.servers:
        log_dir = Path(s.log_dir)
        adm = discover_adm_files(log_dir) if log_dir.is_dir() else []
        marker = "OK" if log_dir.is_dir() else "MISSING"
        print(f"  [{marker}] {s.id} ({s.name}) -> {s.log_dir}  ({len(adm)} .ADM files)")
    print(f"Ingest URL: {cfg.website.ingest_url}")
    return 0


def cmd_ping(cfg_path: Path) -> int:
    cfg = load_config(cfg_path)
    s = requests.Session()
    s.headers["X-Ingest-Key"] = cfg.website.ingest_key
    try:
        r = s.post(cfg.website.ingest_url, json={"serverId": "__ping__", "events": []},
                   timeout=cfg.agent.request_timeout_sec)
    except requests.RequestException as e:
        print(f"NETWORK ERROR: {e}", file=sys.stderr)
        return 3
    print(f"HTTP {r.status_code}: {r.text[:300]}")
    if r.status_code == 401:
        print("→ ingest_key does not match PVP_INGEST_KEY on the website.")
        return 4
    # 400 is expected here (unknown serverId) — that means auth worked.
    if r.status_code in (200, 400):
        print("→ auth OK, endpoint reachable.")
        return 0
    return 5


def main(argv: Optional[List[str]] = None) -> int:
    p = argparse.ArgumentParser(prog="cdn-pvp-parser", description="CDN DayZ PvP log shipper")
    p.add_argument("--config", "-c", type=Path, default=default_config_path(),
                   help="path to config.yaml (default: next to the .exe)")
    p.add_argument("--verbose", "-v", action="store_true")
    p.add_argument("--version", action="store_true", help="print version and exit")
    sub = p.add_subparsers(dest="cmd")
    sub.add_parser("run", help="run the agent (default)")
    sub.add_parser("test-config", help="validate config and list .ADM files found")
    sub.add_parser("ping", help="post an empty batch to confirm auth works")

    args = p.parse_args(argv)
    if args.version:
        print(VERSION)
        return 0

    if not args.config.exists():
        print(f"Config file not found: {args.config}", file=sys.stderr)
        print("Copy config.example.yaml to config.yaml and edit it.", file=sys.stderr)
        return 2

    if args.cmd == "test-config":
        return cmd_test_config(args.config)
    if args.cmd == "ping":
        try:
            cfg_for_log = load_config(args.config)
            setup_logging(cfg_for_log.agent.log_file, args.verbose)
        except Exception:
            pass
        return cmd_ping(args.config)

    # default: run
    cfg = load_config(args.config)
    setup_logging(cfg.agent.log_file, args.verbose)
    Agent(cfg).run()
    return 0


if __name__ == "__main__":
    sys.exit(main())
