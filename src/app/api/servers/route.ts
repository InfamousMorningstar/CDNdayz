// src/app/api/servers/route.ts
import { NextResponse } from 'next/server';
import { GameDig } from 'gamedig';
import { servers, ServerStatus } from '@/lib/servers';

// Simple in-memory cache
let cache: ServerStatus[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds

export async function GET() {
  const now = Date.now();

  // Return cached data if valid
  if (cache && (now - lastFetchTime < CACHE_DURATION)) {
    return NextResponse.json(cache);
  }

  try {
    const promises = servers.map(async (server) => {
      try {
        const state = await GameDig.query({
          type: server.type,
          host: server.host,
          port: server.port
        });

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
        console.error(`Failed to query ${server.name}:`, error);
        return {
          id: server.id,
          name: server.name,
          map: server.map,
          players: 0,
          maxPlayers: 0,
          ping: 0,
          connect: `${server.host}:${server.gamePort || server.port}`, // Fallback
          status: 'offline' as const
        };
      }
    });

    const results = await Promise.all(promises);
    
    // Update cache
    cache = results;
    lastFetchTime = now;

    return NextResponse.json(results);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch server status' }, { status: 500 });
  }
}
