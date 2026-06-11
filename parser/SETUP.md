# CDN PvP Parser — Plain English Setup Guide

A small program that watches your DayZ server's log files and sends kill / connect data to the CDN website so it shows up on the live PvP scoreboard. Set it up once and forget it.

You do **not** need to know how to code.

---

## What you'll receive

Either a zip or a folder containing these files. Put them anywhere on the DayZ server PC — a fixed location like `C:\CDN-PvP-Parser\` is best so you can find it again:

| File | What it is |
|---|---|
| `cdn-pvp-parser.exe` | The program itself |
| `config.example.yaml` | A template for the settings file |
| `install-service.bat` | Optional — makes it run automatically when Windows starts |
| `uninstall-service.bat` | Optional — undoes the install above |
| `nssm.exe` | Helper used by the install script |

---

## What you need from the CDN team (one time)

Before you start, ask whoever runs CDN for **two things** and write them down:

1. **An "ingest key"** — a long secret password. Keep it private.
2. **Your server ID** — a short tag like `takistan-pvp` or `chernarus-hardcore`. It has to match exactly what CDN uses.

That's the whole list.

---

## Step 1 — Make your settings file

1. In the folder where you put `cdn-pvp-parser.exe`, find `config.example.yaml`.
2. **Right-click → Copy → Paste**. You now have `config.example - Copy.yaml`.
3. Rename that copy to **`config.yaml`** (delete the `.example` and the ` - Copy` bits).
4. Open `config.yaml` in **Notepad** (right-click → Open with → Notepad).
5. Replace the three highlighted things below:

```yaml
website:
  ingest_url: "https://cdndayz.com/api/pvp/ingest"
  ingest_key: "PASTE-THE-SECRET-KEY-HERE"

servers:
  - id: "PASTE-YOUR-SERVER-ID-HERE"
    name: "My DayZ Server"
    log_dir: 'C:\PATH\TO\YOUR\DAYZ\profiles'
```

> **About `log_dir`:** This is the folder where DayZ writes its `.ADM` log files. It's normally inside your DayZ server installation, in a folder called `profiles` (or whatever you set in your DayZ startup parameters). If you're not sure, look for any folder that contains files ending in `.ADM` — that's the one.

Save the file (Ctrl+S) and close Notepad.

> **Important:** keep the quote marks and the indentation (spaces at the start of lines) exactly as shown. YAML is fussy about spacing.

---

## Step 2 — Test that it works

1. In the parser folder, hold **Shift** and right-click on empty space in the folder window.
2. Click **"Open PowerShell window here"** (or "Open command window here").
3. Type this and press Enter:

```
cdn-pvp-parser.exe test-config
```

You should see something like:

```
[OK] takistan-pvp → C:\DayZ\profiles (3 .ADM files found)
```

If you see `[OK]`, your settings are good.

Then check that the secret key works:

```
cdn-pvp-parser.exe ping
```

You want to see the message **`auth OK, endpoint reachable.`** — that proves it can talk to the website with your key.

> If you see `401 Unauthorized` — the ingest key is wrong. Double-check it.
> If you see a network error — check your firewall isn't blocking outbound HTTPS.

---

## Step 3 — Run it

You have two ways to run the parser. **Pick one.**

### Option A: Run it manually (good for first-time testing)

In the same PowerShell window:

```
cdn-pvp-parser.exe run
```

Leave the window open. Every few seconds it will print a short line saying how many events it sent to the website. Kill events should start appearing on the PvP scoreboard within a minute.

To stop it: click on the window and press **Ctrl + C**.

This way works fine, but the parser stops if you close the window or restart the PC.

### Option B: Install as a Windows service (recommended for live servers)

This makes the parser start automatically when Windows boots and keep running in the background forever — even if nobody is logged in.

1. **Right-click `install-service.bat` → Run as administrator.**
2. Click **Yes** when Windows asks for permission.
3. You'll see a message saying the service was installed and started.

That's it. From now on:

- It runs in the background — you won't see a window.
- It auto-restarts if it ever crashes.
- It starts again every time you reboot.

To stop or remove it later: right-click **`uninstall-service.bat` → Run as administrator**.

---

## How to know it's working

Open the CDN website's PvP scoreboard page. Within a minute or two of a kill happening in-game, you should see:

- The kill appear in the **Engagement Log** feed.
- The kill counted in the **Operator Roster** table.
- The shooter's name showing **Active** if they're still in-game.

If nothing shows up after 5 minutes of activity, check the parser's log file (see below).

---

## Where to find things

The parser keeps a few files for its own use, in the same folder as the `.exe` by default:

| File | What it's for |
|---|---|
| `state.json` | Remembers where it left off in each log file, so it doesn't re-send events after a restart. |
| `queue.jsonl` | Holds events that haven't been sent yet (used when the website is briefly down). |
| `agent.log` | Plain-text log of what the parser is doing. Open this if something looks wrong. |

**Safe to delete?** Yes — but only if the parser isn't running. If you delete `state.json` it will re-read every `.ADM` file from the start (the website will just ignore duplicates).

---

## What it sends to the website

Only the things needed for the leaderboard:

- **Kills** — who killed whom, with what weapon, from how far, and whether it was a headshot.
- **AI kills** — kills involving bots (e.g. Mercenaries, Shamans). Bot names are stripped — only the faction name is sent.
- **Connects / disconnects** — used to show who's online and to count playtime.

It does **not** send:

- Chat messages
- Player positions / coordinates
- Zombie or animal deaths
- Anything else from the log

---

## Frequently asked

**Does this slow down my DayZ server?**
No. It reads the log files DayZ already writes — DayZ doesn't even know it's there.

**What if the website goes down?**
The parser stores events locally in `queue.jsonl` and sends them as soon as the website is back. Nothing is lost.

**What if I restart the DayZ server (new `.ADM` file)?**
The parser auto-detects the new file and starts reading it. No action needed from you.

**What if I want to add a second DayZ server?**
Open `config.yaml` and add another `- id: ...` block under `servers:` (copy the existing one and change the values). Save, then restart the parser (or the Windows service).

**Where do I get a new ingest key if I lose it?**
Ask the CDN team. The key lives in `config.yaml` next to the `.exe` — keep that file private and don't share screenshots of it.

---

## Need help?

Open `agent.log` in Notepad — the last 20 lines usually tell you exactly what's wrong (wrong key, wrong path, website unreachable, etc.). Copy those lines and send them to CDN support.
