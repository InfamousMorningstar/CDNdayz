/**
 * population-store.ts
 *
 * Stores population snapshots in Vercel KV (Redis-backed).
 * Falls back to in-memory storage when KV is not configured
 * (useful for local development).
 *
 * TO SWAP IN A DIFFERENT BACKEND (e.g. Supabase, Postgres):
 *   Implement the same three exported functions using your driver,
 *   and the rest of the app requires zero changes.
 */

import { PopulationSnapshot } from '@/types/intelligence';

// Maximum snapshots kept per server to prevent unbounded growth.
// At a 5-minute collection interval this gives ~60 days of raw data.
const MAX_SNAPSHOTS_PER_SERVER = 17_280;

const KV_KEY_PREFIX = 'cdn:pop:';

// ── In-memory fallback ────────────────────────────────────────────────────
// Used during local dev when KV env vars are absent.
const memoryStore = new Map<string, PopulationSnapshot[]>();

// ── KV client (lazily initialised) ────────────────────────────────────────
// We use `false` as a sentinel to avoid retrying bad configs on every call.
interface KVClient {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: string): Promise<unknown>;
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

function storeKey(serverId: string): string {
  return `${KV_KEY_PREFIX}${serverId}`;
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Persist a new snapshot for a server.
 * Older entries are trimmed automatically to stay within MAX_SNAPSHOTS_PER_SERVER.
 */
export async function saveSnapshot(snapshot: PopulationSnapshot): Promise<void> {
  const kv = await getKV();
  const key = storeKey(snapshot.serverId);

  if (kv) {
    try {
      const raw = await kv.get<string>(key);
      const existing: PopulationSnapshot[] = raw ? (JSON.parse(raw) as PopulationSnapshot[]) : [];
      existing.push(snapshot);
      const trimmed = existing.slice(-MAX_SNAPSHOTS_PER_SERVER);
      await kv.set(key, JSON.stringify(trimmed));
    } catch (err) {
      console.error(`[population-store] KV write failed for ${snapshot.serverId}:`, err);
    }
    return;
  }

  // In-memory fallback
  const existing = memoryStore.get(snapshot.serverId) ?? [];
  existing.push(snapshot);
  memoryStore.set(snapshot.serverId, existing.slice(-MAX_SNAPSHOTS_PER_SERVER));
}

/**
 * Retrieve all snapshots for a server recorded on or after `sinceTimestamp` (ms).
 * Results are sorted oldest-first.
 */
export async function getSnapshots(
  serverId: string,
  sinceTimestamp: number,
): Promise<PopulationSnapshot[]> {
  const kv = await getKV();
  const key = storeKey(serverId);

  if (kv) {
    try {
      const raw = await kv.get<string>(key);
      if (!raw) return [];
      const all = JSON.parse(raw) as PopulationSnapshot[];
      return all
        .filter((s) => s.timestamp >= sinceTimestamp)
        .sort((a, b) => a.timestamp - b.timestamp);
    } catch (err) {
      console.error(`[population-store] KV read failed for ${serverId}:`, err);
      return [];
    }
  }

  // In-memory fallback
  return (memoryStore.get(serverId) ?? [])
    .filter((s) => s.timestamp >= sinceTimestamp)
    .sort((a, b) => a.timestamp - b.timestamp);
}
