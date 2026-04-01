"use client";

import { useEffect, useState } from 'react';
import { ServerMiniCard } from '@/components/server/ServerMiniCard';
import { ServerStatus } from '@/lib/servers';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function ServersList() {
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

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
    <section aria-labelledby="deployment-zones-heading" className="py-16 sm:py-24 bg-neutral-900/50 backdrop-blur-sm relative z-10" id="servers">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-red-500 font-mono text-sm tracking-widest uppercase mb-4 block">Deployment Zones</span>
              <h2 id="deployment-zones-heading" className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4">Choose Your <span className="text-neutral-500">Battleground</span></h2>
              <p className="text-neutral-400 text-base sm:text-lg">
                Select from our network of high-performance servers. Each offers a unique gameplay experience tailored to different survival styles.
              </p>
              {lastUpdated && (
                <p className="mt-4 text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-neutral-500">
                  Last status sweep {lastUpdated}
                </p>
              )}
            </div>
            
            <Button variant="outline" size="lg" asChild className="shrink-0 w-full sm:w-auto">
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
