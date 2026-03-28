"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Calendar, Store, ArrowRight, Rss } from 'lucide-react';
import Link from 'next/link';
import { OfficialDayZNewsClient } from '@/components/news/OfficialDayZNewsClient';

export function QuickInfo() {
  const infoCards = [
    {
      title: "Server Rules",
      icon: <Shield className="w-8 h-8 text-red-500" />,
            description: "We enforce strict PvE rules as the network default. No raiding on standard PvE servers. Hardcore servers have clearly labeled exceptions.",
      link: "/rules",
      cta: "Full Ruleset"
    },
    {
      title: "Community Events",
      icon: <Calendar className="w-8 h-8 text-amber-500" />,
      description: "Community events are currently being planned and will be announced soon. Stay tuned for immersive operations.",
      link: "/events",
      cta: "Schedule TBA"
    },
    {
      title: "Support the Server",
      icon: <Store className="w-8 h-8 text-emerald-500" />,
      description: "Love the server? Check out our donation store for Custom Bases, Vehicles, and Loadout Kits to kickstart your wipe.",
      link: "/store",
      cta: "Visit Store"
    }
  ];

  return (
        <section aria-labelledby="essential-intel-heading" className="py-20 bg-neutral-900/50 border-t border-white/5 relative">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
                <h2 id="essential-intel-heading" className="text-3xl md:text-4xl font-bold text-white mb-2">Essential <span className="text-red-500">Intel</span></h2>
                <p className="text-neutral-400">Key information for new survivors.</p>
            </div>
            <div className="hidden md:flex gap-2">
                <Link href="/servers" className="flex items-center text-sm font-bold text-white hover:text-red-500 transition-colors gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80">
                    View Servers <ArrowRight size={16} />
                </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Quick Links Column (Span 3 on large screens) */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
                {infoCards.map((card, index) => (
                    <Card key={index} className="p-8 bg-neutral-950/50 border-neutral-800 hover:border-red-500/30 transition-all group relative overflow-hidden flex flex-col h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative z-10 flex-1">
                            <div className="bg-neutral-900/50 w-16 h-16 rounded-lg flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                {card.icon}
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">{card.title}</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                                {card.description}
                            </p>
                        </div>

                         <div className="relative z-10 mt-auto pt-6 border-t border-white/5">
                            <Link href={card.link} className="flex items-center text-sm font-bold text-white hover:text-red-500 transition-colors gap-2 group/link rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80">
                                {card.cta}
                                <ArrowRight size={16} className="transform group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Official News Feed Column (Span 1) */}
            <div className="lg:col-span-1 h-full">
                <Card className="h-full bg-neutral-950/80 border-neutral-800 p-6 relative overflow-hidden flex flex-col">
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="mb-4 pb-4 border-b border-white/5 flex items-center gap-2">
                             <Rss className="w-4 h-4 text-red-500 animate-pulse" />
                             <div>
                                          <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase block leading-none mb-1">Official Comms</span>
                                <h3 className="text-lg font-bold text-white leading-none">Global Intel</h3>
                             </div>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                           <OfficialDayZNewsClient />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
        
        <div className="mt-12 md:hidden">
            <Button variant="outline" className="w-full justify-center gap-2" asChild>
                <Link href="/join">
                    Read Full Join Guide <ArrowRight size={16} />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}