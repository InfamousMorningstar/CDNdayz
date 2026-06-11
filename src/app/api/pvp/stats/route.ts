/**
 * GET /api/pvp/stats?period=daily|weekly|monthly|alltime&limit=20
 *
 * Returns the ranked PvP leaderboard, aggregated on demand from raw events.
 *
 * The roster is computed twice — `players` includes kills/deaths against AI,
 * `playersPvPOnly` counts only Player↔Player engagements. The client picks
 * which to render via a roster toggle.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/pvp-store';
import { aggregate, periodCutoff, formatAIDisplayName } from '@/lib/pvp-aggregate';
import { LeaderboardPeriod, PvPEvent } from '@/types/pvp';
import { servers } from '@/lib/servers';

const VALID_PERIODS: LeaderboardPeriod[] = ['daily', 'weekly', 'monthly', 'alltime'];

export async function GET(req: NextRequest): Promise<NextResponse> {
  const periodParam = req.nextUrl.searchParams.get('period') ?? 'weekly';
  const period: LeaderboardPeriod = VALID_PERIODS.includes(periodParam as LeaderboardPeriod)
    ? (periodParam as LeaderboardPeriod)
    : 'weekly';

  const limitParam = Number(req.nextUrl.searchParams.get('limit') ?? 50);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;

  const now = Date.now();
  const cutoff = periodCutoff(period, now);

  // Pull events for every known server in parallel.
  const perServer = await Promise.all(
    servers.map((s) => getEvents(s.id, cutoff)),
  );
  const allEvents: PvPEvent[] = perServer.flat();

  // Roster A: all kills (Player↔Player and Player↔AI).
  const agg = aggregate(allEvents, period, now);
  const ranked = agg.players.slice(0, limit).map((p, idx) => ({ ...p, rank: idx + 1 }));

  // Roster B: Player↔Player only. Strip AI-involved kills, keep
  // connect/disconnect events so playtime stays accurate.
  const pvpOnlyEvents = allEvents.filter(
    (e) => e.kind !== 'kill' || (!e.killerIsAI && !e.victimIsAI),
  );
  const aggPvPOnly = aggregate(pvpOnlyEvents, period, now);
  const rankedPvPOnly = aggPvPOnly.players
    .slice(0, limit)
    .map((p, idx) => ({ ...p, rank: idx + 1 }));

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

  return NextResponse.json({
    period,
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
  });
}
