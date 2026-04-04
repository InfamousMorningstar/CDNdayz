/**
 * query-servers.ts
 *
 * Shared server-query logic used by both:
 *   - /api/servers          (live status for the UI)
 *   - /api/population/snapshot  (cron snapshot collector)
 *
 * Extracted here so neither route duplicates GameDig logic and the snapshot
 * collector does NOT need to self-call /api/servers over HTTP.
 */

import { GameDig } from 'gamedig';
import { servers, ServerConfig, ServerStatus } from '@/lib/servers';

// ── Helpers ────────────────────────────────────────────────────────────────

const mapAliases: Record<string, string> = {
  chernarusplus: 'Chernarus',
  enoch: 'Livonia',
  deerisle: 'Deer Isle',
  hashima: 'Hashima',
  sakhal: 'Sakhal',
  namalsk: 'Namalsk',
  bitterroot: 'Bitterroot',
  banov: 'Banov',
};

export function normalizeMapName(mapValue: string): string {
  const normalized = mapValue.trim().toLowerCase();
  return mapAliases[normalized] || mapValue;
}

export function getLiveServerName(state: unknown, fallback: string): string {
  const candidate =
    (state as any)?.name ||
    (state as any)?.raw?.hostname ||
    (state as any)?.raw?.name ||
    fallback;
  const safe = typeof candidate === 'string' ? candidate.trim() : fallback;
  return safe || fallback;
}

export function getLiveServerMap(state: unknown, fallback: string): string {
  const candidate =
    (state as any)?.map ||
    (state as any)?.raw?.map ||
    (state as any)?.raw?.mission ||
    fallback;
  const safe = typeof candidate === 'string' ? candidate.trim() : fallback;
  return normalizeMapName(safe || fallback);
}

// ── Per-server restart tracking (module-level, shared across routes) ───────

const offlineStartTimes = new Map<string, number>();
const RESTART_WINDOW = 5 * 60 * 1000; // 5 minutes

// ── Core query ─────────────────────────────────────────────────────────────

/**
 * Query a single server via GameDig. Returns a ServerStatus object.
 * Never throws — offline/error state is returned as status 'offline' or 'restarting'.
 */
export async function queryServer(server: ServerConfig): Promise<ServerStatus> {
  try {
    let state;
    try {
      state = await GameDig.query({
        type: server.type as any,
        host: server.host,
        port: server.port,
        maxAttempts: 2,
        socketTimeout: 2000,
      } as any);
    } catch (initialError) {
      // Fallback: try the game port directly
      if (server.port !== server.gamePort) {
        state = await GameDig.query({
          type: server.type as any,
          host: server.host,
          port: server.gamePort,
          maxAttempts: 2,
          socketTimeout: 2000,
        } as any);
      } else {
        throw initialError;
      }
    }

    // Online — clear any offline tracking
    offlineStartTimes.delete(server.id);

    return {
      id: server.id,
      name: getLiveServerName(state, server.name),
      map: getLiveServerMap(state, server.map),
      players: state.players.length || (state.raw as any)?.numplayers || 0,
      maxPlayers: state.maxplayers,
      ping: state.ping,
      connect: `${server.host}:${server.gamePort || server.port}`,
      status: 'online',
    };
  } catch (error) {
    console.error(
      `Failed to query ${server.name} (${server.host}:${server.port}):`,
      error instanceof Error ? error.message : error,
    );

    const now = Date.now();
    let status: 'offline' | 'restarting' = 'offline';

    if (!offlineStartTimes.has(server.id)) {
      offlineStartTimes.set(server.id, now);
      status = 'restarting';
    } else {
      const downTime = now - (offlineStartTimes.get(server.id) ?? now);
      status = downTime < RESTART_WINDOW ? 'restarting' : 'offline';
    }

    return {
      id: server.id,
      name: server.name,
      map: server.map,
      players: 0,
      maxPlayers: 0,
      ping: 0,
      connect: `${server.host}:${server.gamePort || server.port}`,
      status,
    };
  }
}

/**
 * Query all configured servers in parallel.
 * Safe to call from any route or background job.
 */
export async function queryAllServers(): Promise<ServerStatus[]> {
  return Promise.all(servers.map(queryServer));
}
