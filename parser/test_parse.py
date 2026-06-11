"""Quick parse-only verification — no HTTP, just dumps what the parser extracts."""
import sys
sys.path.insert(0, '.')
from parser import AdmParser, ServerCfg, FileState

p = AdmParser(ServerCfg('chernarus-hardcore', 'Test', '.'), FileState(path='x'))
events = []
with open('test-logs/DayZServer_x64_test.ADM', 'r', encoding='utf-8') as f:
    for ln in f:
        ev = p.parse_line(ln)
        if ev:
            events.append(ev)

print(f"Parsed {len(events)} events from real DayZ log")
print()
print(f"{'KIND':11s} {'WHO':15s} {'->':3s} {'TARGET':15s} {'WEAPON':22s} {'DIST':>10s}  HS")
print("-" * 90)
for ev in events:
    who = ev.get('killerName', ev.get('playerName', '-'))
    tgt = ev.get('victimName', '-')
    wpn = ev.get('weapon', '-') or '-'
    dist = ev.get('distance')
    dist_s = f"{dist:.1f}m" if isinstance(dist, (int, float)) else '-'
    hs = ev.get('headshot', '')
    print(f"{ev['kind']:11s} {who:15s} {'->':3s} {tgt:15s} {wpn:22s} {dist_s:>10s}  {hs}")

print()
kills = [e for e in events if e['kind'] == 'kill']
connects = [e for e in events if e['kind'] == 'connect']
disconnects = [e for e in events if e['kind'] == 'disconnect']
print(f"Summary: {len(kills)} kills, {len(connects)} connects, {len(disconnects)} disconnects")
if kills:
    longest = max(kills, key=lambda e: e.get('distance') or 0)
    print(f"Longest shot: {longest.get('distance', 0):.1f}m  by {longest['killerName']}  with {longest['weapon']}")
    headshots = sum(1 for k in kills if k.get('headshot'))
    print(f"Headshots: {headshots}/{len(kills)}")
