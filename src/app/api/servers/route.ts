// src/app/api/servers/route.ts
import { NextResponse } from 'next/server';
import { GameDig } from 'gamedig';
import { servers, ServerStatus } from '@/lib/servers';

// Simple in-memory cache
let cache: ServerStatus[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds

// Track when servers went offline (Server ID -> Timestamp)
const offlineStartTimes = new Map<string, number>();
const RESTART_WINDOW = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  const now = Date.now();

  // Return cached data if valid
  if (cache && (now - lastFetchTime < CACHE_DURATION)) {
    return NextResponse.json(cache);
  }

  try {
    const promises = servers.map(async (server) => {
      try {
        // Try querying with the config port first
        let state;
        try {
          state = await GameDig.query({
            type: server.type as any,
            host: server.host,
            port: server.port,
            maxAttempts: 2,
            socketTimeout: 2000
          } as any);
        } catch (initialError) {
          // Fallback: Try querying the game port directly if disjoint
          // Many DayZ servers respond to Steam query on the game port too
          if (server.port !== server.gamePort) {
             state = await GameDig.query({
                type: server.type as any,
                host: server.host,
                port: server.gamePort, // Try game port
                maxAttempts: 2,
                socketTimeout: 2000
             } as any);
          } else {
             throw initialError;
          }
        }

        // If we reach here, the server is ONLINE
        // Clear any offline tracking for this server
        if (offlineStartTimes.has(server.id)) {
             offlineStartTimes.delete(server.id);
        }

        return {
          id: server.id,
          name: server.name,
          map: server.map,
          players: state.players.length || (state.raw as any)?.numplayers || 0,
          maxPlayers: state.maxplayers,
          ping: state.ping,
          connect: `${server.host}:${server.gamePort || server.port}`,
          status: 'online' as const
        };
      } catch (error) {
        console.error(`Failed to query ${server.name} (${server.host}:${server.port}):`, error instanceof Error ? error.message : error);
        
        let status: 'offline' | 'restarting' = 'offline';
        const now = Date.now();

        if (!offlineStartTimes.has(server.id)) {
            // First time seeing it offline
            offlineStartTimes.set(server.id, now);
            status = 'restarting';
        } else {
            const downTime = now - (offlineStartTimes.get(server.id) || now);
            if (downTime < RESTART_WINDOW) {
                status = 'restarting';
            } else {
                status = 'offline';
            }
        }

        return {
          id: server.id,
          name: server.name,
          map: server.map,
          players: 0,
          maxPlayers: 0,
          ping: 0,
          connect: `${server.host}:${server.gamePort || server.port}`, // Fallback
          status: status
        };
      }
    });

    const results = await Promise.all(promises);
    
    // Update cache
    cache = results as ServerStatus[];
    lastFetchTime = now;

    return NextResponse.json(results);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch server status' }, { status: 500 });
  }
}
