/**
 * GET /api/population/history/[serverId]?range=30d
 *
 * Returns raw snapshots for one server within the requested time window.
 * The analytics are computed client-side so the API stays thin and cacheable.
 *
 * Query params:
 *   range — one of: 7d | 30d | 90d | 6m | 1y   (default: 30d)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSnapshots } from '@/lib/population-store';
import { TimeRange } from '@/types/intelligence';

const RANGE_DAYS: Record<TimeRange, number> = {
  '7d':  7,
  '30d': 30,
  '90d': 90,
  '6m':  182,
  '1y':  365,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serverId: string }> },
) {
  const { serverId } = await params;
  const raw = request.nextUrl.searchParams.get('range') ?? '30d';
  const range = (raw in RANGE_DAYS ? raw : '30d') as TimeRange;

  const days = RANGE_DAYS[range];
  const since = Date.now() - days * 24 * 60 * 60 * 1000;

  try {
    const snapshots = await getSnapshots(serverId, since);
    return NextResponse.json(
      { serverId, range, snapshots },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
    );
  } catch (err) {
    console.error(`[population/history] Error for ${serverId}:`, err);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
