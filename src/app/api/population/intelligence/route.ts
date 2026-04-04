import { NextRequest, NextResponse } from 'next/server';
import { getSnapshots } from '@/lib/population-store';
import { servers } from '@/lib/servers';
import { computeAnalytics } from '@/lib/population-analytics';
import { TimeRange } from '@/types/intelligence';

const RANGE_DAYS: Record<TimeRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '6m': 182,
  '1y': 365,
};

export async function GET(request: NextRequest) {
  const selectedServerId = request.nextUrl.searchParams.get('serverId') ?? servers[0]?.id;
  const rawRange = request.nextUrl.searchParams.get('range') ?? '30d';
  const range = (rawRange in RANGE_DAYS ? rawRange : '30d') as TimeRange;

  if (!selectedServerId) {
    return NextResponse.json({ error: 'No servers configured' }, { status: 500 });
  }

  const days = RANGE_DAYS[range];
  const since = Date.now() - days * 24 * 60 * 60 * 1000;

  try {
    const analyticsByServer = await Promise.all(
      servers.map(async (server) => {
        const snapshots = await getSnapshots(server.id, since);
        const analytics = computeAnalytics(server.id, server.name, snapshots, range);
        return analytics;
      }),
    );

    const selectedAnalytics =
      analyticsByServer.find((a) => a.serverId === selectedServerId) ?? analyticsByServer[0] ?? null;

    const compareRows = analyticsByServer
      .filter((a) => a.hasEnoughData)
      .map((a) => ({
        serverId: a.serverId,
        serverName: a.serverName,
        avgPlayers: a.avgPlayers,
        peakPlayers: a.peakPlayers,
        reliabilityScore: a.reliabilityScore,
        trendDirection: a.trendDirection,
        verdict:
          a.reliabilityScore >= 80
            ? 'Most consistent PvE population'
            : a.trendDirection === 'up'
            ? 'Momentum is building'
            : a.trendDirection === 'down'
            ? 'Cooling off recently'
            : 'Stable day-to-day flow',
      }))
      .sort((a, b) => {
        if (b.reliabilityScore !== a.reliabilityScore) {
          return b.reliabilityScore - a.reliabilityScore;
        }
        return b.avgPlayers - a.avgPlayers;
      })
      .slice(0, 8);

    return NextResponse.json(
      {
        serverId: selectedAnalytics?.serverId ?? selectedServerId,
        range,
        analytics: selectedAnalytics,
        compareRows,
        generatedAt: Date.now(),
      },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
    );
  } catch (err) {
    console.error('[population/intelligence] Failed to build intelligence payload:', err);
    return NextResponse.json({ error: 'Failed to build intelligence payload' }, { status: 500 });
  }
}
