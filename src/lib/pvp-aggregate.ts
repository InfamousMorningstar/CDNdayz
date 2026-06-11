// src/lib/pvp-aggregate.ts
//
// Pure aggregation of raw PvP events into per-player rollups for the
// leaderboard. No I/O — given a list of events, returns ranked players.

import { PvPEvent, PlayerAggregate, LeaderboardPeriod, LongestShotRecord } from '@/types/pvp';

export function periodCutoff(period: LeaderboardPeriod, now = Date.now()): number {
  switch (period) {
    case 'daily':   return now - 24 * 60 * 60 * 1000;
    case 'weekly':  return now - 7  * 24 * 60 * 60 * 1000;
    case 'monthly': return now - 30 * 24 * 60 * 60 * 1000;
    case 'alltime': return 0;
  }
}

/**
 * Render the display name used for an AI side in kill feeds and marksmanship
 * records. AI individual names are never shown — only the faction (if known).
 */
export function formatAIDisplayName(faction?: string): string {
  return faction ? `AI (${faction})` : 'AI';
}

/** Render either the player's real name or an AI faction label. */
function killerDisplay(ev: PvPEvent): string {
  if (ev.killerIsAI) return formatAIDisplayName(ev.killerFaction);
  return ev.killerName ?? 'Unknown';
}

function victimDisplay(ev: PvPEvent): string {
  if (ev.victimIsAI) return formatAIDisplayName(ev.victimFaction);
  return ev.victimName ?? 'Unknown';
}

// If a player has had no events for this long while *other* activity has
// been logged on the server, their disconnect line was likely missed
// (crash, server restart, log rotation, parser gap) and they are no longer
// actually online. Used to clear ghost "Active" rows.
const STALE_ONLINE_MS = 30 * 60 * 1000;

// Hard cap: any session open longer than this is treated as a missed
// disconnect regardless of recent activity, since real DayZ play sessions
// don't span half a day without at least one log line.
const MAX_SESSION_MS = 12 * 60 * 60 * 1000;

interface MutablePlayer {
  playerId: string;
  playerName: string;
  kills: number;
  deaths: number;
  headshots: number;
  playtimeMs: number;
  lastSeenTs: number;
  openSessionStart: number | null;
  longestShot: number;
  longestShotWeapon?: string;
  longestShotVictim?: string;
  longestShotTs?: number;
}

function ensure(map: Map<string, MutablePlayer>, id: string, name: string, ts: number): MutablePlayer {
  let p = map.get(id);
  if (!p) {
    p = {
      playerId: id,
      playerName: name,
      kills: 0,
      deaths: 0,
      headshots: 0,
      playtimeMs: 0,
      lastSeenTs: ts,
      openSessionStart: null,
      longestShot: 0,
    };
    map.set(id, p);
  }
  if (name && name !== p.playerName) p.playerName = name; // keep latest seen
  if (ts > p.lastSeenTs) p.lastSeenTs = ts;
  return p;
}

export interface AggregateResult {
  players: PlayerAggregate[];
  longestShot: LongestShotRecord | null;
  totalKills: number;
  playersOnline: number;
}

/**
 * Aggregate raw events into a ranked leaderboard plus marksmanship records.
 *
 * @param events  Events across one or more servers, in any order.
 * @param period  Time window — events older than the cutoff are ignored.
 * @param now     Override "now" for testing; defaults to Date.now().
 */
export function aggregate(
  events: PvPEvent[],
  period: LeaderboardPeriod,
  now: number = Date.now(),
): AggregateResult {
  const cutoff = periodCutoff(period, now);
  const sorted = events
    .filter((e) => e.ts >= cutoff)
    .sort((a, b) => a.ts - b.ts);

  const players = new Map<string, MutablePlayer>();
  let overallLongest: LongestShotRecord | null = null;

  for (const ev of sorted) {
    if (ev.kind === 'kill') {
      // Skip AI-vs-AI entirely (UI scope is player engagements only).
      if (ev.killerIsAI && ev.victimIsAI) continue;

      if (!ev.killerIsAI && ev.killerId && ev.killerName) {
        const killer = ensure(players, ev.killerId, ev.killerName, ev.ts);
        killer.kills += 1;
        if (ev.headshot) killer.headshots += 1;
        const dist = typeof ev.distance === 'number' ? ev.distance : 0;
        if (dist > killer.longestShot) {
          killer.longestShot = dist;
          killer.longestShotWeapon = ev.weapon;
          killer.longestShotVictim = victimDisplay(ev);
          killer.longestShotTs = ev.ts;
        }
        if (dist > 0 && (overallLongest === null || dist > overallLongest.distance)) {
          overallLongest = {
            distance: dist,
            killerId: ev.killerId,
            killerName: ev.killerName,
            victimName: victimDisplay(ev),
            weapon: ev.weapon ?? 'Unknown',
            ts: ev.ts,
            serverId: ev.serverId,
          };
        }
      }
      if (!ev.victimIsAI && ev.victimId && ev.victimName) {
        const victim = ensure(players, ev.victimId, ev.victimName, ev.ts);
        victim.deaths += 1;
      }
    } else if (ev.kind === 'connect') {
      if (!ev.playerId || !ev.playerName) continue;
      const p = ensure(players, ev.playerId, ev.playerName, ev.ts);
      // If a previous connect was never closed (parser missed the disconnect
      // due to a crash/restart), cap the orphaned session at the new connect.
      if (p.openSessionStart !== null) {
        p.playtimeMs += Math.max(0, ev.ts - p.openSessionStart);
      }
      p.openSessionStart = ev.ts;
    } else if (ev.kind === 'disconnect') {
      if (!ev.playerId || !ev.playerName) continue;
      const p = ensure(players, ev.playerId, ev.playerName, ev.ts);
      if (p.openSessionStart !== null) {
        p.playtimeMs += Math.max(0, ev.ts - p.openSessionStart);
        p.openSessionStart = null;
      }
    }
  }

  // Close any still-open sessions at `now` for playtime totals.
  for (const p of players.values()) {
    if (p.openSessionStart !== null) {
      p.playtimeMs += Math.max(0, now - p.openSessionStart);
    }
  }

  // Most recent event timestamp across all processed events. Used as the
  // "wall clock" for staleness so the leaderboard stays accurate even when
  // querying historical periods where `Date.now()` is far ahead of the data.
  const latestGlobalTs = sorted.length > 0 ? sorted[sorted.length - 1].ts : now;

  const result: PlayerAggregate[] = [];
  let totalKills = 0;
  let playersOnline = 0;
  for (const p of players.values()) {
    // Skip ghost players with no meaningful activity.
    if (p.kills === 0 && p.deaths === 0 && p.playtimeMs === 0) continue;
    totalKills += p.kills;

    // A session is "live" only if it is open AND the player has been seen
    // recently relative to other server activity AND has not exceeded the
    // absolute max-session cap. Anything else is a missed disconnect.
    let isLive = false;
    if (p.openSessionStart !== null) {
      const sessionAge = latestGlobalTs - p.openSessionStart;
      const idleFor = latestGlobalTs - p.lastSeenTs;
      isLive = sessionAge < MAX_SESSION_MS && idleFor < STALE_ONLINE_MS;
    }
    if (isLive) playersOnline += 1;

    result.push({
      playerId: p.playerId,
      playerName: p.playerName,
      kills: p.kills,
      deaths: p.deaths,
      headshots: p.headshots,
      playtime: Math.round(p.playtimeMs / 60_000),
      lastSeenTs: p.lastSeenTs,
      isOnline: isLive,
      longestShot: Math.round(p.longestShot * 10) / 10,
      longestShotWeapon: p.longestShotWeapon,
      longestShotVictim: p.longestShotVictim,
      longestShotTs: p.longestShotTs,
    });
  }

  // Rank by kills desc, then by K/D desc as tie-breaker.
  result.sort((a, b) => {
    if (b.kills !== a.kills) return b.kills - a.kills;
    const akd = a.deaths === 0 ? a.kills : a.kills / a.deaths;
    const bkd = b.deaths === 0 ? b.kills : b.kills / b.deaths;
    return bkd - akd;
  });

  return { players: result, longestShot: overallLongest, totalKills, playersOnline };
}
