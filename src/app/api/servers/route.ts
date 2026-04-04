// src/app/api/servers/route.ts
import { NextResponse } from 'next/server';
import { ServerStatus } from '@/lib/servers';
import { queryAllServers } from '@/lib/query-servers';

// Simple in-memory cache
let cache: ServerStatus[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds

export async function GET() {
  const now = Date.now();

  // Return cached data if valid
  if (cache && now - lastFetchTime < CACHE_DURATION) {
    return NextResponse.json(cache, {
      headers: { 'x-server-fetched-at': String(lastFetchTime) },
    });
  }

  try {
    const results = await queryAllServers();
    cache = results;
    lastFetchTime = now;

    return NextResponse.json(results, {
      headers: { 'x-server-fetched-at': String(lastFetchTime) },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch server status' }, { status: 500 });
  }
}
