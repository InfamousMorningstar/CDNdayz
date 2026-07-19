/**
 * GET /api/pvp/stats?period=daily|weekly|monthly|alltime&limit=20
 *
 * Returns the ranked PvP leaderboard.
 *
 * The roster is computed twice — `players` includes kills/deaths against AI,
 * `playersPvPOnly` counts only Player↔Player engagements. The client picks
 * which to render via a roster toggle.
 *
 * ── COST ──────────────────────────────────────────────────────────────────
 * Aggregating means loading and parsing every stored event across all
 * servers, which is pure active CPU and far too expensive to repeat per
 * request. Two caches sit in front of it:
 *
 *   1. Cache-Control / s-maxage — the CDN serves most reads with no function
 *      invocation at all.
 *   2. getCachedLeaderboard — a KV-backed read-through cache shared by every
 *      Fluid instance, so a miss recomputes at most once per TTL globally.
 *
 * The aggregation itself runs only on a miss in both.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getEvents,
  getCachedLeaderboard,
  setCachedLeaderboard,
} from '@/lib/pvp-store';
import { aggregate, periodCutoff, formatAIDisplayName } from '@/lib/pvp-aggregate';
import { LeaderboardPeriod, PvPEvent } from '@/types/pvp';
import { servers } from '@/lib/servers';

const VALID_PERIODS: LeaderboardPeriod[] = ['daily', 'weekly', 'monthly', 'alltime'];

// Rosters are cached at the maximum requestable size and sliced down per
// request, so every `limit` shares one cache entry.
const MAX_LIMIT = 200;

/** Shape stored in the leaderboard cache — the full response minus slicing. */
interface LeaderboardPayload {
  generatedAt: number;
  eventCount: number;
  players: ReturnType<typeof buildRoster>;
  playersPvPOnly: ReturnType<typeof buildRoster>;
  overall: {
    totalKills: number;
    totalKillsPvPOnly: number;
    playersOnline: number;
    longestShot: ReturnType<typeof aggregate>['longestShot'];
  };
  topMarksmen: unknown[];
  recentKills: unknown[];
}

function buildRoster(agg: ReturnType<typeof aggregate>) {
  return agg.players.slice(0, MAX_LIMIT).map((p, idx) => ({ ...p, rank: idx + 1 }));
}

/**
 * The expensive path: load every event, aggregate, and assemble the payload.
 * Only called on a cache miss.
 */
async function computeLeaderboard(
  period: LeaderboardPeriod,
  now: number,
): Promise<LeaderboardPayload> {
  const cutoff = periodCutoff(period, now);

  // Pull events for every known server in parallel.
  const perServer = await Promise.all(
    servers.map((s) => getEvents(s.id, cutoff)),
  );
  const allEvents: PvPEvent[] = perServer.flat();

  // Roster A: all kills (Player↔Player and Player↔AI).
  const agg = aggregate(allEvents, period, now);
  const ranked = buildRoster(agg);

  // Roster B: Player↔Player only. Strip AI-involved kills, keep
  // connect/disconnect events so playtime stays accurate.
  const pvpOnlyEvents = allEvents.filter(
    (e) => e.kind !== 'kill' || (!e.killerIsAI && !e.victimIsAI),
  );
  const aggPvPOnly = aggregate(pvpOnlyEvents, period, now);
  const rankedPvPOnly = buildRoster(aggPvPOnly);

  // Top marksmen by longestShot (separate ranking from kill leaderboard).
  const topMarksmen = [...agg.players]
    .filter((p) => p.longestShot > 0)
    .sort((a, b) => b.longestShot - a.longestShot)
    .slice(0, 10)
    .map((p, idx) => ({
      rank: idx + 1,
      playerId: p.playerId,
      playerName: p.playerName,
      distance: p.longestShot,
      weapon: p.longestShotWeapon ?? 'Unknown',
      victim: p.longestShotVictim ?? 'Unknown',
      ts: p.longestShotTs ?? p.lastSeenTs,
    }));

  // Most recent kills (newest first) — drives the live kill-feed panel.
  // Includes Player↔AI engagements (AI-vs-AI is filtered upstream by the parser).
  const recentKills = allEvents
    .filter((e) => e.kind === 'kill' && (e.killerName || e.killerIsAI) && (e.victimName || e.victimIsAI))
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 25)
    .map((e) => ({
      id: e.id,
      ts: e.ts,
      serverId: e.serverId,
      killerId: e.killerId ?? '',
      killerName: e.killerIsAI ? formatAIDisplayName(e.killerFaction) : (e.killerName ?? 'Unknown'),
      victimId: e.victimId ?? '',
      victimName: e.victimIsAI ? formatAIDisplayName(e.victimFaction) : (e.victimName ?? 'Unknown'),
      weapon: e.weapon ?? 'Unknown',
      distance: typeof e.distance === 'number' ? e.distance : null,
      headshot: e.headshot === true,
    }));

  return {
    generatedAt: now,
    eventCount: allEvents.length,
    players: ranked,
    playersPvPOnly: rankedPvPOnly,
    overall: {
      totalKills: agg.totalKills,
      totalKillsPvPOnly: aggPvPOnly.totalKills,
      playersOnline: agg.playersOnline,
      longestShot: agg.longestShot,
    },
    topMarksmen,
    recentKills,
  };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const periodParam = req.nextUrl.searchParams.get('period') ?? 'weekly';
  const period: LeaderboardPeriod = VALID_PERIODS.includes(periodParam as LeaderboardPeriod)
    ? (periodParam as LeaderboardPeriod)
    : 'weekly';

  const limitParam = Number(req.nextUrl.searchParams.get('limit') ?? 50);
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), MAX_LIMIT)
    : 50;

  let payload = await getCachedLeaderboard<LeaderboardPayload>(period);
  let cacheHit = true;

  if (!payload) {
    cacheHit = false;
    payload = await computeLeaderboard(period, Date.now());
    await setCachedLeaderboard(period, payload);
  }

  // Rosters are cached at MAX_LIMIT; narrow to what this request asked for.
  const body = {
    period,
    ...payload,
    players: payload.players.slice(0, limit),
    playersPvPOnly: payload.playersPvPOnly.slice(0, limit),
  };

  return NextResponse.json(body, {
    headers: {
      // Most reads should be served by the CDN without invoking a function.
      // stale-while-revalidate keeps the page instant while a refresh runs.
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'x-leaderboard-cache': cacheHit ? 'hit' : 'miss',
      'x-leaderboard-age': String(Math.max(0, Date.now() - payload.generatedAt)),
    },
  });
}
