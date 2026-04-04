"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ChevronRight, Footprints } from 'lucide-react';
import { NewsTicker } from '@/components/news/NewsTicker';
import { DISCORD_INVITE_URL } from '@/lib/links';

export function Hero() {
  return (
    <section className="relative h-screen min-h-[640px] sm:min-h-[760px] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10" />
        {/* Hero image */}
        <div className="w-full h-full bg-neutral-900 bg-[url('/Images/wp1886390-dayz-wallpapers.jpg')] bg-cover bg-center opacity-50" />
      </div>

      <div className="container relative z-20 px-4 sm:px-6 pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] sm:pt-0 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-500/30 backdrop-blur-md mb-2 animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
            </span>
            <span className="text-xs font-mono text-green-400 tracking-widest uppercase">CDN NETWORK ONLINE</span>
          </div>
          
          <h1 className="text-[2.15rem] sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight sm:tracking-tighter text-white max-w-5xl relative z-20 leading-[1.03] sm:leading-tight">
            <span className="inline-block drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              <span className="inline-block">S</span>
              <span className="inline-block animate-flicker-3 opacity-90">U</span>
              <span className="inline-block opacity-100 shadow-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">R</span>
              <span className="inline-block animate-flicker-1 text-white/80">V</span>
              <span className="inline-block opacity-50 text-neutral-500">I</span>
              <span className="inline-block animate-flicker-2">V</span>
              <span className="inline-block opacity-90">E</span>
            </span>{' '}
            <span className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.45)]">TOGETHER</span>
            <br />
            <span className="text-[1.35rem] sm:text-3xl md:text-5xl lg:text-6xl font-heading text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-600 tracking-[0.03em] sm:tracking-wide opacity-90">
              THRIVE FOREVER
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-xl leading-relaxed font-sans font-light tracking-wide px-1 sm:px-0">
            CDN is a premium DayZ PvE network built for immersion, community, and tactical gameplay. 
            Experience a curated survival journey without the toxicity.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5 sm:mt-6 w-full sm:w-auto">
            <Button size="lg" className="h-12 px-6 text-base gap-2 font-heading tracking-wider w-full sm:w-auto" asChild>
              <Link href="/servers">
                View Servers <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base font-heading tracking-wider border-neutral-500/30 hover:border-red-500/50 hover:bg-red-900/20 hover:text-red-400 transition-all w-full sm:w-auto" onClick={() => window.open(DISCORD_INVITE_URL, '_blank')}>
              Join Comms
            </Button>
          </div>
        </motion.div>

        {/* Tactical News Ticker - Placed for visibility without scrolling */}
        <NewsTicker />

      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 text-neutral-500 flex-col items-center gap-2"
      >
    <span className="text-xs tracking-wide font-sans font-medium">Yeah, you gotta scroll.</span>
    <Footprints className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
