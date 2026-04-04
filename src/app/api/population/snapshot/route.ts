/**
 * GET /api/population/snapshot
 *
 * Records a live population snapshot for every server.
 * Calls GameDig directly (via shared query-servers lib) — no HTTP self-call needed.
 *
 * ── CRON JOB ──────────────────────────────────────────────────────────────
 * Triggered every 30 minutes via vercel.json crons config.
 * Vercel automatically forwards CRON_SECRET as Authorization: Bearer <secret>.
 *
 * To trigger manually:
 *   GET https://your-domain.com/api/population/snapshot
 *   Authorization: Bearer <CRON_SECRET>
 *
 * Environment variables:
 *   CRON_SECRET  — set in Vercel dashboard; protects this endpoint
 *                  Vercel cron runner sends it automatically.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryAllServers } from '@/lib/query-servers';
import { saveSnapshot } from '@/lib/population-store';
import { PopulationSnapshot } from '@/types/intelligence';

async function collectSnapshots(req: NextRequest): Promise<NextResponse> {
  // ── Auth check ──────────────────────────────────────────────────────────
  // Vercel automatically passes CRON_SECRET as Authorization: Bearer <secret>
  // for cron job requests. Same header works for manual triggers.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('Authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── Query all servers directly (no HTTP round-trip) ─────────────────────
  let serverStatuses: Awaited<ReturnType<typeof queryAllServers>>;
  try {
    serverStatuses = await queryAllServers();
  } catch (err) {
    console.error('[population/snapshot] queryAllServers failed:', err);
    return NextResponse.json({ error: 'Could not query servers' }, { status: 500 });
  }

  // ── Persist one snapshot per server ─────────────────────────────────────
  const timestamp = Date.now();
  const results = await Promise.allSettled(
    serverStatuses.map(async (server) => {
      const snapshot: PopulationSnapshot = {
        serverId: server.id,
        serverName: server.name,
        timestamp,
        playerCount: server.status === 'online' ? (server.players ?? 0) : 0,
        maxPlayers: server.maxPlayers ?? 0,
        status: server.status,
      };
      await saveSnapshot(snapshot);
      return server.id;
    }),
  );

  const summary = results.map((r, i) => ({
    id: serverStatuses[i].id,
    saved: r.status === 'fulfilled',
    reason: r.status === 'rejected' ? String((r as PromiseRejectedResult).reason) : undefined,
  }));

  return NextResponse.json({ timestamp, results: summary });
}

// Vercel cron always uses GET; POST is available for manual/external triggers
export const GET  = collectSnapshots;
export const POST = collectSnapshots;
