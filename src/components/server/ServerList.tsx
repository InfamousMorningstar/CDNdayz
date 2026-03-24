"use client";

import { useEffect, useState } from 'react';
import ServerCardTactical from '@/components/server/ServerCardTactical';
import { ServerStatus } from '@/lib/servers'; // Importing shared type

export function ServerList() {
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers');
      if (!response.ok) throw new Error('API Error');
      const data: ServerStatus[] = await response.json();
      setServers(data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && servers.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-neutral-900/50 rounded-xl border border-neutral-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (error && servers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-neutral-900/40 rounded-xl border border-red-900/30 text-center w-full">
        <div className="text-red-500 mb-2 font-bold text-lg">Unable to load server status</div>
        <p className="text-neutral-400">Please check our <a href="https://discord.gg/sBPzcjzBcT" target="_blank" className="text-red-400 hover:underline">Discord</a> for live updates.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {servers.map((server) => (
        <ServerCardTactical 
          key={server.id}
          name={server.name}
          map={server.map}
          players={server.players}
          maxPlayers={server.maxPlayers}
          status={server.status}
          ping={server.ping}
          connect={server.connect}
        />
      ))}
    </div>
  );
}
