"use client";

import { useEffect, useState } from 'react';
import { ServerRow } from '@/components/server/ServerRow';
import { ServerStatus } from '@/lib/servers';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function ServersList() {
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('/api/servers');
        if (!response.ok) return;
        const data = await response.json();
        setServers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  return (
    <section className="py-24 bg-neutral-900/50 backdrop-blur-sm relative z-10" id="servers">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-red-500 font-mono text-sm tracking-widest uppercase mb-4 block">Deployment Zones</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Choose Your <span className="text-neutral-500">Battleground</span></h2>
              <p className="text-neutral-400 text-lg">
                Select from our network of high-performance servers. Each offers a unique gameplay experience tailored to different survival styles.
              </p>
            </div>
            
            <Button variant="outline" size="lg" asChild className="shrink-0">
               <Link href="/servers">View Detailed Status</Link>
            </Button>
        </div>

        {loading ? (
             <div className="space-y-4">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="h-20 bg-neutral-900/50 rounded-lg border border-neutral-800 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
                 </div>
               ))}
             </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
               {servers.map((server) => (
                 <ServerRow 
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
        )}
      </div>
    </section>
  );
}
