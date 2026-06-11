# CDN DayZ PvP Parser

Lightweight Windows agent that tails DayZ server `.ADM` admin logs, parses
kill / connect / disconnect events, and ships them in batches to the CDN
website's `/api/pvp/ingest` endpoint. The website aggregates these into
the PvP scoreboard.

```
[DayZ server box, Windows]                [cdndayz.com]
  *.ADM files                              POST /api/pvp/ingest
     |                                          ^
     v                                          |
  cdn-pvp-parser.exe  ---- HTTPS + key ---------'
     |
     v
  agent.log + disk queue (offline buffer)
```

---

## What the admin needs to do (5-minute install)

You will receive three files:

```
cdn-pvp-parser.exe
config.example.yaml
install-service.bat        (optional — to run as a Windows service)
nssm.exe                   (optional — bundled with install-service.bat)
```

### Step 1 — Put the files somewhere stable

Anywhere is fine, but a fixed path is best so the service points to the
same location forever. Recommended:

```
C:\CDN-PvP-Parser\
```

### Step 2 — Create `config.yaml`

Copy `config.example.yaml` to `config.yaml` in the same folder, then edit:

1. **`website.ingest_key`** — paste the secret you were given. Treat like
   a password.
2. **`servers`** — one entry per DayZ server hosted on this machine.
   - `id` must match exactly an id used on the CDN website
     (e.g. `chernarus-hardcore`, `livonia-snow`). Ask if unsure.
   - `log_dir` is the folder containing `*.ADM` files (usually the DayZ
     server's `profiles` folder).

Example:

```yaml
servers:
  - id: chernarus-hardcore
    name: "CDN Chernarus Hardcore"
    log_dir: 'C:\DayZServers\Chernarus\profiles'
```

### Step 3 — Verify the config and connection

Open PowerShell or CMD in the install folder and run:

```cmd
cdn-pvp-parser.exe test-config
```

You should see each server marked `[OK]` and a count of `.ADM` files found.

Then check the website is reachable and the key is correct:

```cmd
cdn-pvp-parser.exe ping
```

You want to see `auth OK, endpoint reachable.` (HTTP 400 is expected here —
it just means the test serverId is intentionally invalid, which proves auth
worked.)

### Step 4 — Run it

Two options.

**Option A — Foreground (for testing):**

```cmd
cdn-pvp-parser.exe run
```

Leave the window open. You'll see one log line per batch shipped.
Press `Ctrl+C` to stop cleanly.

**Option B — Windows Service (production, auto-starts on boot):**

1. Make sure `nssm.exe` (win64 build from <https://nssm.cc/download>) is
   in the same folder as `install-service.bat`.
2. Right-click `install-service.bat` → **Run as administrator**.

That's it. The service is named `CDN-PvP-Parser`, starts on boot, and
auto-restarts on crash. To stop or remove later, run `uninstall-service.bat`
as administrator.

---

## What gets shipped to the website

For every kill in the `.ADM` logs:

| field         | example                              |
|---------------|--------------------------------------|
| `serverId`    | `chernarus-hardcore`                 |
| `ts`          | unix epoch ms                        |
| `kind`        | `kill`                               |
| `killerName`  | `Bob`                                |
| `victimName`  | `Alice`                              |
| `weapon`      | `M4-A1`                              |
| `distance`    | `12.345` (meters)                    |
| `headshot`    | `true` / `false`                     |

Plus `connect` / `disconnect` events for playtime + online status.

**Hit events are NOT shipped** — they're noisy. The parser uses them only
locally to determine if a kill should be flagged `headshot:true` (i.e. the
last hit on that victim was a `Head(0)` hit within 30 seconds).

---

## What the parser does NOT collect

- No chat messages
- No positional data (coordinates are dropped before shipping)
- No raw player IDs beyond what's needed to dedupe a player across renames
- No info about non-PvP deaths (zombies, falls, infections)

---

## Files created at runtime

By default these live under `C:\ProgramData\CDN-PvP-Parser\` (change in
config if you prefer):

| file              | purpose                                          |
|-------------------|--------------------------------------------------|
| `state.json`      | Byte offsets per `.ADM` file — survives restart  |
| `queue.jsonl`     | Batches buffered while website was unreachable   |
| `agent.log`       | Rotating log (5 MB × 5 generations)              |

If you ever want a clean re-ingest from scratch, stop the service, delete
`state.json` and `queue.jsonl`, then start it again. The website will dedupe
any events it has already seen, so re-shipping is safe.

---

## Troubleshooting

| symptom                                              | what it means / fix                                      |
|------------------------------------------------------|----------------------------------------------------------|
| `ingest 401` in log                                  | `ingest_key` doesn't match `PVP_INGEST_KEY` on website   |
| `[chernarus-hardcore] log_dir does not exist`        | Wrong path in config, or DayZ hasn't created the profile dir yet |
| `Unknown serverId` HTTP 400                          | `id` in config doesn't match `src/lib/servers.ts`        |
| Service won't start                                  | Check `service-stderr.log` next to the .exe              |
| Events show up but `headshot` is always false        | DayZ is logging hits in a non-standard format — open an issue with a sample line |
| Scoreboard shows mock data                           | No events have been ingested yet for that period         |

---

## Building from source (developer only)

You only need this if you're modifying `parser.py`. The admin just gets the
prebuilt `.exe`.

```cmd
cd parser
build.bat
```

Output: `parser\dist\cdn-pvp-parser.exe`.

Requires Python 3.10+ on `PATH`. The script creates a local `.venv`,
installs deps, and runs PyInstaller.

---

## Website side (for the maintainer)

The agent POSTs to `/api/pvp/ingest` with header `X-Ingest-Key`. Two env
vars need to be set on Vercel:

| env var              | purpose                                          |
|----------------------|--------------------------------------------------|
| `PVP_INGEST_KEY`     | Shared secret. Generate with `openssl rand -hex 32` |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | Already set for population store; reused |

The scoreboard page (`/pvp-scoreboard`) calls `/api/pvp/stats?period=...`
and falls back to mock data when the store is empty.

---

## Version

Run `cdn-pvp-parser.exe --version` to print the agent version.
