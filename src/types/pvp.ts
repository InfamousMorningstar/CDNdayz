// src/types/pvp.ts
//
// Canonical PvP event schema shared between the website ingest endpoint
// and the parser-agent that ships events from DayZ server boxes.
// Keep this file in sync with `parser/parser.py::Event` if you add fields.

export type PvPEventKind = 'kill' | 'connect' | 'disconnect';

export interface PvPEvent {
  /** sha1(serverId|ts|kind|killer|victim|weapon) — used for dedupe. */
  id: string;
  /** Server id from src/lib/servers.ts */
  serverId: string;
  /** Unix epoch milliseconds */
  ts: number;
  kind: PvPEventKind;

  // ── kill ────────────────────────────────────────────
  killerId?: string;
  killerName?: string;
  victimId?: string;
  victimName?: string;
  weapon?: string;
  /** meters */
  distance?: number;
  headshot?: boolean;
  /** True when the killer is an AI bot rather than a player. */
  killerIsAI?: boolean;
  /** True when the victim is an AI bot rather than a player. */
  victimIsAI?: boolean;
  /** Faction name for the AI killer (e.g. "Mercenaries"). Absent for humans. */
  killerFaction?: string;
  /** Faction name for the AI victim. Absent for humans. */
  victimFaction?: string;

  // ── connect / disconnect ────────────────────────────
  playerId?: string;
  playerName?: string;
}

export interface PlayerAggregate {
  playerId: string;
  playerName: string;
  kills: number;
  deaths: number;
  headshots: number;
  /** minutes */
  playtime: number;
  lastSeenTs: number;
  isOnline: boolean;
  /** meters — best confirmed kill distance for this player in the period */
  longestShot: number;
  /** weapon used for the longestShot, if known */
  longestShotWeapon?: string;
  /** victim of the longestShot, if known */
  longestShotVictim?: string;
  /** timestamp of the longestShot, if known */
  longestShotTs?: number;
}

export interface LongestShotRecord {
  distance: number;
  killerId: string;
  killerName: string;
  victimName: string;
  weapon: string;
  ts: number;
  serverId: string;
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'alltime';
