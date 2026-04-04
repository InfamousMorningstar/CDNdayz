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

// Maximum raw snapshots kept per server to prevent unbounded growth.
// At a 5-minute collection interval this gives ~60 days of raw data.
const MAX_SNAPSHOTS_PER_SERVER = 17_280;
const MAX_HOURLY_AGG_PER_SERVER = 8_760; // 24 * 365

const KV_KEY_PREFIX = 'cdn:pop:';

// ── In-memory fallback ────────────────────────────────────────────────────
// Used during local dev when KV env vars are absent.
const memoryStore = new Map<string, PopulationSnapshot[]>();
const memoryHourlyStore = new Map<string, HourlyAggregate[]>();

// ── KV client (lazily initialised) ────────────────────────────────────────
// We use `false` as a sentinel to avoid retrying bad configs on every call.
interface KVClient {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<unknown>;
}

interface HourlyAggregate {
  hourStart: number;
  serverId: string;
  serverName: string;
  sumPlayers: number;
  sampleCount: number;
  maxPlayers: number;
  onlineCount: number;
  restartingCount: number;
  offlineCount: number;
}

let kvClient: KVClient | false | null = null;
let kvUnavailableReason: string | null = null;

export interface PopulationStoreInfo {
  backend: 'kv' | 'memory';
  kvConfigured: boolean;
  reason?: string;
}

async function getKV(): Promise<KVClient | false> {
  if (kvClient !== null) return kvClient;

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    kvUnavailableReason = 'KV_REST_API_URL or KV_REST_API_TOKEN is missing';
    kvClient = false;
    return false;
  }

  try {
    const { kv } = await import('@vercel/kv');
    kvUnavailableReason = null;
    kvClient = kv as unknown as KVClient;
    return kvClient;
  } catch (err) {
    kvUnavailableReason = err instanceof Error ? err.message : 'Failed to load @vercel/kv';
    kvClient = false;
    return false;
  }
}

function storeKey(serverId: string): string {
  return `${KV_KEY_PREFIX}${serverId}`;
}

function hourlyStoreKey(serverId: string): string {
  return `${KV_KEY_PREFIX}${serverId}:hourly`;
}

function getHourStart(timestamp: number): number {
  return Math.floor(timestamp / 3_600_000) * 3_600_000;
}

function updateHourlyAggregate(
  existing: HourlyAggregate[],
  snapshot: PopulationSnapshot,
): HourlyAggregate[] {
  const next = [...existing];
  const hourStart = getHourStart(snapshot.timestamp);
  const last = next[next.length - 1];

  if (!last || last.hourStart !== hourStart) {
    next.push({
      hourStart,
      serverId: snapshot.serverId,
      serverName: snapshot.serverName,
      sumPlayers: snapshot.playerCount,
      sampleCount: 1,
      maxPlayers: snapshot.maxPlayers,
      onlineCount: snapshot.status === 'online' ? 1 : 0,
      restartingCount: snapshot.status === 'restarting' ? 1 : 0,
      offlineCount: snapshot.status === 'offline' ? 1 : 0,
    });
  } else {
    last.serverName = snapshot.serverName;
    last.sumPlayers += snapshot.playerCount;
    last.sampleCount += 1;
    last.maxPlayers = Math.max(last.maxPlayers, snapshot.maxPlayers);
    if (snapshot.status === 'online') last.onlineCount += 1;
    if (snapshot.status === 'restarting') last.restartingCount += 1;
    if (snapshot.status === 'offline') last.offlineCount += 1;
  }

  return next.slice(-MAX_HOURLY_AGG_PER_SERVER);
}

function statusFromAggregate(agg: HourlyAggregate): PopulationSnapshot['status'] {
  if (agg.onlineCount >= agg.restartingCount && agg.onlineCount >= agg.offlineCount) {
    return 'online';
  }
  if (agg.restartingCount >= agg.offlineCount) {
    return 'restarting';
  }
  return 'offline';
}

function hourlyToSnapshots(hourly: HourlyAggregate[]): PopulationSnapshot[] {
  return hourly.map((agg) => ({
    serverId: agg.serverId,
    serverName: agg.serverName,
    timestamp: agg.hourStart,
    playerCount: Math.round(agg.sumPlayers / Math.max(agg.sampleCount, 1)),
    maxPlayers: agg.maxPlayers,
    status: statusFromAggregate(agg),
  }));
}

export async function getPopulationStoreInfo(): Promise<PopulationStoreInfo> {
  const kv = await getKV();
  const kvConfigured = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

  if (kv) {
    return { backend: 'kv', kvConfigured };
  }

  return {
    backend: 'memory',
    kvConfigured,
    reason: kvUnavailableReason ?? 'Falling back to memory store',
  };
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Persist a new snapshot for a server.
 * Older entries are trimmed automatically to stay within MAX_SNAPSHOTS_PER_SERVER.
 */
export async function saveSnapshot(snapshot: PopulationSnapshot): Promise<void> {
  const kv = await getKV();
  const rawKey = storeKey(snapshot.serverId);
  const hourlyKey = hourlyStoreKey(snapshot.serverId);
  const kvConfigured = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

  if (kv) {
    try {
      const [raw, hourly] = await Promise.all([
        kv.get<PopulationSnapshot[]>(rawKey),
        kv.get<HourlyAggregate[]>(hourlyKey),
      ]);

      const existingRaw: PopulationSnapshot[] = raw ?? [];
      existingRaw.push(snapshot);
      const trimmedRaw = existingRaw.slice(-MAX_SNAPSHOTS_PER_SERVER);

      const nextHourly = updateHourlyAggregate(hourly ?? [], snapshot);

      await Promise.all([
        kv.set(rawKey, trimmedRaw),
        kv.set(hourlyKey, nextHourly),
      ]);
    } catch (err) {
      console.error(`[population-store] KV write failed for ${snapshot.serverId}:`, err);
      throw new Error(
        `[population-store] KV write failed for ${snapshot.serverId}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
    return;
  }

  // In production, if KV is configured but unavailable, fail fast so schedulers
  // surface the issue instead of silently reporting successful in-memory writes.
  if (process.env.NODE_ENV === 'production' && kvConfigured) {
    throw new Error(
      `[population-store] KV is configured but unavailable. Reason: ${
        kvUnavailableReason ?? 'unknown'
      }`,
    );
  }

  // In-memory fallback
  const existingRaw = memoryStore.get(snapshot.serverId) ?? [];
  existingRaw.push(snapshot);
  memoryStore.set(snapshot.serverId, existingRaw.slice(-MAX_SNAPSHOTS_PER_SERVER));

  const existingHourly = memoryHourlyStore.get(snapshot.serverId) ?? [];
  memoryHourlyStore.set(snapshot.serverId, updateHourlyAggregate(existingHourly, snapshot));
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
  const rawKey = storeKey(serverId);
  const hourlyKey = hourlyStoreKey(serverId);

  if (kv) {
    try {
      const [raw, hourly] = await Promise.all([
        kv.get<PopulationSnapshot[]>(rawKey),
        kv.get<HourlyAggregate[]>(hourlyKey),
      ]);

      const rawSnapshots = [...(raw ?? [])].sort((a, b) => a.timestamp - b.timestamp);
      const oldestRawTs = rawSnapshots[0]?.timestamp ?? Number.POSITIVE_INFINITY;
      const rawFiltered = rawSnapshots.filter((s) => s.timestamp >= sinceTimestamp);

      const hourlySnapshots = hourlyToSnapshots(hourly ?? [])
        .filter((s) => s.timestamp >= sinceTimestamp && s.timestamp < oldestRawTs)
        .sort((a, b) => a.timestamp - b.timestamp);

      return [...hourlySnapshots, ...rawFiltered];
    } catch (err) {
      console.error(`[population-store] KV read failed for ${serverId}:`, err);
      return [];
    }
  }

  // In-memory fallback
  const rawSnapshots = [...(memoryStore.get(serverId) ?? [])].sort((a, b) => a.timestamp - b.timestamp);
  const oldestRawTs = rawSnapshots[0]?.timestamp ?? Number.POSITIVE_INFINITY;
  const rawFiltered = rawSnapshots.filter((s) => s.timestamp >= sinceTimestamp);
  const hourlySnapshots = hourlyToSnapshots(memoryHourlyStore.get(serverId) ?? [])
    .filter((s) => s.timestamp >= sinceTimestamp && s.timestamp < oldestRawTs)
    .sort((a, b) => a.timestamp - b.timestamp);

  return [...hourlySnapshots, ...rawFiltered];
}
