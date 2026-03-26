"use client";

import { ServerList } from '@/components/server/ServerList';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function ServersList() {
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

        <ServerList />
      </div>
    </section>
  );
}
