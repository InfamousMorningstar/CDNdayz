"use client";

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function JoinCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-red-900/10 via-black to-neutral-900/30 text-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('/grid.svg')] bg-[length:40px_40px]" />
      
      <div className="container relative z-10 px-6 mx-auto flex flex-col items-center gap-8">
        <span className="text-red-500 font-mono text-sm tracking-widest uppercase rounded-full px-4 py-1 border border-red-500/20 bg-red-500/5">
          Join the Ranks
        </span>
        
        <h2 className="text-4xl md:text-6xl font-bold text-white max-w-3xl">
          Start Your <span className="text-red-500">Survival Story</span>
        </h2>
        
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed">
          The apocalypse waits for no one. Connect with thousands of other survivors, build your legacy, and dominate the wasteland.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mt-8 w-full sm:w-auto">
          <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] transition-shadow duration-500" onClick={() => window.open('https://discord.gg/sBPzcjzBcT', '_blank')}>
            Join Discord Community
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-neutral-700 hover:bg-neutral-800" asChild>
            <Link href="/join">Read Join Guide</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
