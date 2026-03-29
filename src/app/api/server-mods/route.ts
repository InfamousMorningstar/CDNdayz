import { NextResponse } from 'next/server';
import { servers } from '@/lib/servers';

interface DayzsaMod {
  name: string;
  steamWorkshopId?: string;
}

interface DayzsaResult {
  endpoint?: {
    ip?: string;
    port?: number;
  };
  name?: string;
  hostname?: string;
  map?: string;
  mission?: string;
  mods?: DayzsaMod[];
}

interface DayzsaResponse {
  status: number;
  result?: DayzsaResult;
  error?: string;
}

// In-memory cache to avoid hammering upstream endpoint.
let cache:
  | Array<{
      id: string;
      serverName: string;
      map: string;
      endpoint: string;
      modCount: number | null;
      mods: DayzsaMod[];
      source: string;
      lastVerified: string;
      error?: string;
    }>
  | null = null;
let lastFetch = 0;
const CACHE_MS = 60 * 1000;

function normalizeMapName(mapValue: string): string {
  const normalized = mapValue.trim().toLowerCase();

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

  return mapAliases[normalized] || mapValue;
}

function getLiveServerName(result: DayzsaResult | undefined, fallbackName: string): string {
  if (!result) return fallbackName;

  const raw = (result.name || result.hostname || '').trim();
  return raw || fallbackName;
}

function getLiveServerMap(result: DayzsaResult | undefined, fallbackMap: string): string {
  if (!result) return fallbackMap;

  const raw = (result.map || result.mission || '').trim();
  return normalizeMapName(raw || fallbackMap);
}

function getLiveEndpoint(result: DayzsaResult | undefined, fallbackEndpoint: string): string {
  if (!result?.endpoint?.ip || !result?.endpoint?.port) {
    return fallbackEndpoint;
  }

  return `${result.endpoint.ip}:${result.endpoint.port}`;
}

export async function GET() {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_MS) {
    return NextResponse.json(cache);
  }

  const records = await Promise.all(
    servers.map(async (server) => {
      const endpoint = `${server.host}:${server.port}`;
      const url = `https://dayzsalauncher.com/api/v1/query/${endpoint}`;

      try {
        const response = await fetch(url, {
          headers: {
            Accept: 'application/json',
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Upstream status ${response.status}`);
        }

        const data = (await response.json()) as DayzsaResponse;

        if (data.status !== 0 || !data.result) {
          throw new Error(data.error || 'Invalid launcher payload');
        }

        const mods = Array.isArray(data.result.mods) ? data.result.mods : [];
        const liveServerName = getLiveServerName(data.result, server.name);
        const liveServerMap = getLiveServerMap(data.result, server.map);
        const liveEndpoint = getLiveEndpoint(data.result, endpoint);

        return {
          id: server.id,
          serverName: liveServerName,
          map: liveServerMap,
          endpoint: liveEndpoint,
          modCount: mods.length,
          mods,
          source: 'dayzsalauncher.com/api/v1/query',
          lastVerified: new Date().toISOString(),
        };
      } catch (error) {
        return {
          id: server.id,
          serverName: server.name,
          map: server.map,
          endpoint,
          modCount: null,
          mods: [],
          source: 'dayzsalauncher.com/api/v1/query',
          lastVerified: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    })
  );

  cache = records;
  lastFetch = now;

  return NextResponse.json(records);
}
