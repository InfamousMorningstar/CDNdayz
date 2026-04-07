"use client";

import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { ServerMiniCard } from '@/components/server/ServerMiniCard';
import { ServerStatus } from '@/lib/servers';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export function ServersList() {
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const summary = useMemo(() => {
    const online = servers.filter((server) => server.status === 'online');
    const restarting = servers.filter((server) => server.status === 'restarting').length;
    const totalPlayers = online.reduce((sum, server) => sum + server.players, 0);

    return {
      onlineCount: online.length,
      restartingCount: restarting,
      totalPlayers,
    };
  }, [servers]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('/api/servers');
        if (!response.ok) return;
        const data = await response.json();
        const fetchedAt = response.headers.get('x-server-fetched-at');
        setServers(data);
        if (fetchedAt) {
          setLastUpdated(
            new Intl.DateTimeFormat(undefined, {
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            }).format(new Date(Number(fetchedAt)))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
    const interval = setInterval(fetchServers, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section aria-labelledby="deployment-zones-heading" className="py-20 sm:py-28 bg-neutral-900/50 backdrop-blur-sm relative z-10" id="servers">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12 gap-3">
            <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-900/10 backdrop-blur-sm px-4 py-1">
              Deployment Zones
            </Badge>
            <h2 id="deployment-zones-heading" className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-white leading-tight">Choose Your <span className="text-neutral-500">Battleground</span></h2>
            <p className="text-neutral-400 text-base sm:text-lg max-w-2xl">
              Select from our network of high-performance servers. Each offers a unique gameplay experience tailored to different survival styles.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
              <Badge className="min-h-9 px-3 bg-emerald-500/15 border border-emerald-500/35 text-emerald-200 hover:bg-emerald-500/20">
                {summary.onlineCount} Online
              </Badge>
              <Badge className="min-h-9 px-3 bg-amber-500/15 border border-amber-500/35 text-amber-100 hover:bg-amber-500/20">
                {summary.restartingCount} Restarting
              </Badge>
              <Badge className="min-h-9 px-3 bg-sky-500/15 border border-sky-500/35 text-sky-100 hover:bg-sky-500/20">
                {summary.totalPlayers} Players Live
              </Badge>
            </div>
            {lastUpdated && (
              <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-neutral-500">
                Last status sweep {lastUpdated}
              </p>
            )}
            <Button variant="outline" size="lg" asChild className="mt-2 w-full sm:w-auto">
               <Link href="/servers">View Detailed Status</Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
           {loading ? (
             Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-36 w-full bg-neutral-800/30 rounded-xl animate-pulse" />
             ))
           ) : (
             servers.map((server) => (
               <ServerMiniCard 
                 key={server.id}
                 {...server}
               />
             ))
           )}
        </div>
      </div>
    </section>
  );
}
