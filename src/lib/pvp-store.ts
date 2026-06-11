// src/lib/pvp-store.ts
//
// Stores PvP events (kills + connect/disconnect) in Vercel KV.
// Falls back to in-memory storage for local dev — same pattern as
// population-store.ts.
//
// Events are partitioned by serverId and capped per server.
// Aggregation (kills, K/D, headshots, playtime) is computed on demand
// in src/lib/pvp-aggregate.ts.

import { PvPEvent } from '@/types/pvp';

const KV_KEY_PREFIX = 'cdn:pvp:events:';
// Holds ~3-10 days of events depending on server activity. Older events
// fall off the end. Bump if you need a longer history window.
const MAX_EVENTS_PER_SERVER = 25_000;
// Dedupe ring — last N event IDs seen per server. Anything older is
// assumed unique (cheap false-positive trade-off).
const DEDUPE_RING_SIZE = 2_000;

const memoryStore = new Map<string, PvPEvent[]>();

interface KVClient {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<unknown>;
}

let kvClient: KVClient | false | null = null;

async function getKV(): Promise<KVClient | false> {
  if (kvClient !== null) return kvClient;
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    kvClient = false;
    return false;
  }
  try {
    const { kv } = await import('@vercel/kv');
    kvClient = kv as unknown as KVClient;
    return kvClient;
  } catch {
    kvClient = false;
    return false;
  }
}

function eventsKey(serverId: string): string {
  return `${KV_KEY_PREFIX}${serverId}`;
}

async function loadEvents(serverId: string): Promise<PvPEvent[]> {
  const kv = await getKV();
  if (kv) {
    const list = await kv.get<PvPEvent[]>(eventsKey(serverId));
    return list ?? [];
  }
  return memoryStore.get(serverId) ?? [];
}

async function persistEvents(serverId: string, events: PvPEvent[]): Promise<void> {
  const trimmed = events.slice(-MAX_EVENTS_PER_SERVER);
  const kv = await getKV();
  if (kv) {
    await kv.set(eventsKey(serverId), trimmed);
    return;
  }
  memoryStore.set(serverId, trimmed);
}

export interface IngestResult {
  accepted: number;
  duplicates: number;
  rejected: number;
}

/**
 * Append a batch of events for a single server, dropping any whose id has
 * been seen within the dedupe ring.
 */
export async function ingestEvents(
  serverId: string,
  incoming: PvPEvent[],
): Promise<IngestResult> {
  const existing = await loadEvents(serverId);
  const recentIds = new Set(
    existing.slice(-DEDUPE_RING_SIZE).map((e) => e.id),
  );

  let accepted = 0;
  let duplicates = 0;
  let rejected = 0;

  const toAdd: PvPEvent[] = [];
  for (const ev of incoming) {
    if (!ev.id || !ev.serverId || !ev.ts || !ev.kind) {
      rejected += 1;
      continue;
    }
    if (ev.serverId !== serverId) {
      rejected += 1;
      continue;
    }
    if (recentIds.has(ev.id)) {
      duplicates += 1;
      continue;
    }
    recentIds.add(ev.id);
    toAdd.push(ev);
    accepted += 1;
  }

  if (toAdd.length > 0) {
    // Sort by timestamp before append so the rolling window stays ordered.
    toAdd.sort((a, b) => a.ts - b.ts);
    await persistEvents(serverId, [...existing, ...toAdd]);
  }

  return { accepted, duplicates, rejected };
}

/**
 * Read events for a server, optionally restricted to events newer than `sinceTs`.
 */
export async function getEvents(
  serverId: string,
  sinceTs?: number,
): Promise<PvPEvent[]> {
  const all = await loadEvents(serverId);
  if (sinceTs === undefined) return all;
  return all.filter((e) => e.ts >= sinceTs);
}

export async function getStoreInfo(): Promise<{ backend: 'kv' | 'memory' }> {
  const kv = await getKV();
  return { backend: kv ? 'kv' : 'memory' };
}
