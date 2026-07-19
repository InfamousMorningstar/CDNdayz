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
// At a 5-minute collection interval this gives ~7 days of full-resolution
// data. Anything older is served from the hourly rollup below, which
// getSnapshots() splices in seamlessly — so longer ranges (30d/1y) still
// render, just at hourly granularity, which is all a chart that wide can
// show anyway.
//
// This cap is deliberately tight because every saveSnapshot() reads and
// rewrites the whole array: at the previous 60 days of retention that meant
// parsing and re-serialising ~17k objects per server per run, 288 runs a day.
// That JSON work is pure active CPU and was the dominant cost of the
// snapshot cron. Raising this back up re-inflates that cost linearly.
const MAX_SNAPSHOTS_PER_SERVER = 2_016;
const MAX_HOURLY_AGG_PER_SERVER = 8_760; // 24 * 365

const KV_KEY_PREFIX = 'cdn:pop:';

// ── In-memory fallback ────────────────────────────────────────────────────
// Used during local dev when KV env vars are absent.
const memoryStore = new Map<string, PopulationSnapshot[]>();
const memoryHourlyStore = new Map<string, HourlyAggregate[]>();
const memoryCurrentHourStore = new Map<string, HourlyAggregate>();

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

/** Sealed (completed) hourly buckets. Only rewritten on hour rollover. */
function hourlyStoreKey(serverId: string): string {
  return `${KV_KEY_PREFIX}${serverId}:hourly`;
}

/**
 * The single in-progress hourly bucket.
 *
 * Kept apart from the sealed array because only this bucket changes between
 * snapshots. Writing it alone means the common path touches one small object
 * instead of re-serialising up to 8,760 of them twelve times an hour.
 */
function currentHourKey(serverId: string): string {
  return `${KV_KEY_PREFIX}${serverId}:hourly:current`;
}

function getHourStart(timestamp: number): number {
  return Math.floor(timestamp / 3_600_000) * 3_600_000;
}

/** Start a fresh bucket seeded with one snapshot. */
function newBucket(snapshot: PopulationSnapshot): HourlyAggregate {
  return {
    hourStart: getHourStart(snapshot.timestamp),
    serverId: snapshot.serverId,
    serverName: snapshot.serverName,
    sumPlayers: snapshot.playerCount,
    sampleCount: 1,
    maxPlayers: snapshot.maxPlayers,
    onlineCount: snapshot.status === 'online' ? 1 : 0,
    restartingCount: snapshot.status === 'restarting' ? 1 : 0,
    offlineCount: snapshot.status === 'offline' ? 1 : 0,
  };
}

/** Fold a snapshot into an existing bucket, mutating it in place. */
function foldIntoBucket(bucket: HourlyAggregate, snapshot: PopulationSnapshot): void {
  bucket.serverName = snapshot.serverName;
  bucket.sumPlayers += snapshot.playerCount;
  bucket.sampleCount += 1;
  bucket.maxPlayers = Math.max(bucket.maxPlayers, snapshot.maxPlayers);
  if (snapshot.status === 'online') bucket.onlineCount += 1;
  if (snapshot.status === 'restarting') bucket.restartingCount += 1;
  if (snapshot.status === 'offline') bucket.offlineCount += 1;
}

/**
 * Merge the sealed array with the in-progress bucket for reads.
 *
 * Guards against the bucket's hour already being present in the sealed array,
 * which can happen transiently around a rollover or when migrating from the
 * older single-key layout.
 */
function mergeHourly(
  sealed: HourlyAggregate[],
  current: HourlyAggregate | null,
): HourlyAggregate[] {
  if (!current) return sealed;
  if (sealed.some((b) => b.hourStart === current.hourStart)) return sealed;
  return [...sealed, current];
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
  const currentKey = currentHourKey(snapshot.serverId);
  const kvConfigured = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

  if (kv) {
    try {
      // Read the raw window and the in-progress bucket only. The sealed
      // hourly array is deliberately NOT read here — it is needed just once
      // an hour, on rollover.
      const [raw, current] = await Promise.all([
        kv.get<PopulationSnapshot[]>(rawKey),
        kv.get<HourlyAggregate>(currentKey),
      ]);

      const existingRaw: PopulationSnapshot[] = raw ?? [];
      existingRaw.push(snapshot);
      const trimmedRaw = existingRaw.slice(-MAX_SNAPSHOTS_PER_SERVER);

      const hourStart = getHourStart(snapshot.timestamp);
      const writes: Promise<unknown>[] = [kv.set(rawKey, trimmedRaw)];

      if (current && current.hourStart === hourStart) {
        // Common path (11 of every 12 runs): fold into the open bucket and
        // write that one small object.
        foldIntoBucket(current, snapshot);
        writes.push(kv.set(currentKey, current));
      } else {
        // Rollover: seal the finished bucket into the historical array, then
        // open a new one. This is the only path that touches the big array.
        const sealed = (await kv.get<HourlyAggregate[]>(hourlyKey)) ?? [];
        if (current && !sealed.some((b) => b.hourStart === current.hourStart)) {
          sealed.push(current);
        }
        writes.push(kv.set(hourlyKey, sealed.slice(-MAX_HOURLY_AGG_PER_SERVER)));
        writes.push(kv.set(currentKey, newBucket(snapshot)));
      }

      await Promise.all(writes);
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

  // In-memory fallback — mirrors the sealed/current split above.
  const existingRaw = memoryStore.get(snapshot.serverId) ?? [];
  existingRaw.push(snapshot);
  memoryStore.set(snapshot.serverId, existingRaw.slice(-MAX_SNAPSHOTS_PER_SERVER));

  const hourStart = getHourStart(snapshot.timestamp);
  const current = memoryCurrentHourStore.get(snapshot.serverId);

  if (current && current.hourStart === hourStart) {
    foldIntoBucket(current, snapshot);
  } else {
    const sealed = memoryHourlyStore.get(snapshot.serverId) ?? [];
    if (current && !sealed.some((b) => b.hourStart === current.hourStart)) {
      sealed.push(current);
    }
    memoryHourlyStore.set(snapshot.serverId, sealed.slice(-MAX_HOURLY_AGG_PER_SERVER));
    memoryCurrentHourStore.set(snapshot.serverId, newBucket(snapshot));
  }
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
  const currentKey = currentHourKey(serverId);

  if (kv) {
    try {
      const [raw, sealed, current] = await Promise.all([
        kv.get<PopulationSnapshot[]>(rawKey),
        kv.get<HourlyAggregate[]>(hourlyKey),
        kv.get<HourlyAggregate>(currentKey),
      ]);

      const rawSnapshots = [...(raw ?? [])].sort((a, b) => a.timestamp - b.timestamp);
      const oldestRawTs = rawSnapshots[0]?.timestamp ?? Number.POSITIVE_INFINITY;
      const rawFiltered = rawSnapshots.filter((s) => s.timestamp >= sinceTimestamp);

      const hourlySnapshots = hourlyToSnapshots(mergeHourly(sealed ?? [], current ?? null))
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
  const hourlySnapshots = hourlyToSnapshots(
    mergeHourly(
      memoryHourlyStore.get(serverId) ?? [],
      memoryCurrentHourStore.get(serverId) ?? null,
    ),
  )
    .filter((s) => s.timestamp >= sinceTimestamp && s.timestamp < oldestRawTs)
    .sort((a, b) => a.timestamp - b.timestamp);

  return [...hourlySnapshots, ...rawFiltered];
}
