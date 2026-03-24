"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Calendar, Store, ArrowRight, Server } from 'lucide-react';
import Link from 'next/link';

export function QuickInfo() {
  const infoCards = [
    {
      title: "Server Rules",
      icon: <Shield className="w-8 h-8 text-red-500" />,
      description: "We enforce strict PvE rules. No Kill-on-Sight (KOS) outside designated zones. No base raiding allowed. Respect fellow survivors.",
      link: "/rules",
      cta: "Full Ruleset"
    },
    {
      title: "Community Events",
      icon: <Calendar className="w-8 h-8 text-amber-500" />,
      description: "Participate in daily automated events like Convoys and Keycard Bunkers, or join staff-hosted Boss Fights every weekend.",
      link: "/events",
      cta: "Event Schedule"
    },
    {
      title: "Support the Server",
      icon: <Store className="w-8 h-8 text-emerald-500" />,
      description: "Love the server? Check out our donation store for Priority Queue access, Custom Bases, and Loadout Kits to kickstart your wipe.",
      link: "/store",
      cta: "Visit Store"
    }
  ];

  return (
    <section className="py-20 bg-neutral-900/50 border-t border-white/5 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Essential <span className="text-red-500">Intel</span></h2>
                <p className="text-neutral-400">Key information for new survivors.</p>
            </div>
            <Button variant="outline" className="hidden md:flex gap-2" asChild>
                <Link href="/join">
                    Join Guide <ArrowRight size={16} />
                </Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {infoCards.map((card, index) => (
            <Card key={index} className="p-8 bg-neutral-950/50 border-neutral-800 hover:border-red-500/30 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="bg-neutral-900/50 w-16 h-16 rounded-lg flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">{card.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-8 h-20">
                  {card.description}
                </p>

                <Link href={card.link} className="flex items-center text-sm font-bold text-white hover:text-red-500 transition-colors gap-2 group/link">
                  {card.cta}
                  <ArrowRight size={16} className="transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
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