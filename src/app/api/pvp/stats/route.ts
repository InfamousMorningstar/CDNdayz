/**
 * GET /api/pvp/stats?period=daily|weekly|monthly|alltime&limit=20
 *
 * Returns the ranked PvP leaderboard, aggregated on demand from raw events.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/pvp-store';
import { aggregate, periodCutoff } from '@/lib/pvp-aggregate';
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

  const agg = aggregate(allEvents, period, now);
  const ranked = agg.players.slice(0, limit).map((p, idx) => ({ ...p, rank: idx + 1 }));

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
  const recentKills = allEvents
    .filter((e) => e.kind === 'kill' && e.killerName && e.victimName)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 25)
    .map((e) => ({
      id: e.id,
      ts: e.ts,
      serverId: e.serverId,
      killerId: e.killerId ?? '',
      killerName: e.killerName ?? 'Unknown',
      victimId: e.victimId ?? '',
      victimName: e.victimName ?? 'Unknown',
      weapon: e.weapon ?? 'Unknown',
      distance: typeof e.distance === 'number' ? e.distance : null,
      headshot: e.headshot === true,
    }));

  return NextResponse.json({
    period,
    generatedAt: now,
    eventCount: allEvents.length,
    players: ranked,
    overall: {
      totalKills: agg.totalKills,
      playersOnline: agg.playersOnline,
      longestShot: agg.longestShot,
    },
    topMarksmen,
    recentKills,
  });
}
