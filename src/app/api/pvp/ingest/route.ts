/**
 * POST /api/pvp/ingest
 *
 * Receives a batch of PvP events from the parser-agent and persists them
 * to the KV store with dedupe.
 *
 * Auth: parser must send `X-Ingest-Key: <PVP_INGEST_KEY>`.
 *
 * Request body:
 *   {
 *     "serverId": "chernarus-hardcore",
 *     "events": [PvPEvent, ...]
 *   }
 *
 * Response: { accepted, duplicates, rejected }
 */

import { NextRequest, NextResponse } from 'next/server';
import { ingestEvents, getStoreInfo } from '@/lib/pvp-store';
import { PvPEvent } from '@/types/pvp';
import { servers } from '@/lib/servers';

const MAX_BATCH = 1000;

const validServerIds = new Set(servers.map((s) => s.id));

export async function POST(req: NextRequest): Promise<NextResponse> {
  const expected = process.env.PVP_INGEST_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: 'PVP_INGEST_KEY is not configured on the server' },
      { status: 503 },
    );
  }
  const provided = req.headers.get('x-ingest-key');
  if (provided !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Body must be an object' }, { status: 400 });
  }
  const { serverId, events } = body as { serverId?: unknown; events?: unknown };

  if (typeof serverId !== 'string' || !validServerIds.has(serverId)) {
    return NextResponse.json(
      { error: 'Unknown serverId', validIds: [...validServerIds] },
      { status: 400 },
    );
  }
  if (!Array.isArray(events)) {
    return NextResponse.json({ error: 'events must be an array' }, { status: 400 });
  }
  if (events.length > MAX_BATCH) {
    return NextResponse.json(
      { error: `Batch too large (max ${MAX_BATCH})` },
      { status: 413 },
    );
  }

  const typedEvents = events as PvPEvent[];
  const result = await ingestEvents(serverId, typedEvents);
  const info = await getStoreInfo();

  return NextResponse.json({ ...result, backend: info.backend });
}
