"use client";

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HeartPulse, Hammer } from 'lucide-react';
import { CinematicBackground } from '@/components/features/CinematicBackground';
import { TerjeWiki } from '@/components/wiki/TerjeWiki';
import { BoomlayWiki } from '@/components/wiki/BoomlayWiki';

type WikiTab = 'terje' | 'boomlay';

const tabs: { id: WikiTab; label: string; shortLabel: string; icon: typeof HeartPulse }[] = [
  { id: 'terje', label: 'Terje Medicine', shortLabel: 'Terje', icon: HeartPulse },
  { id: 'boomlay', label: "BoomLay's Things", shortLabel: 'BoomLay', icon: Hammer },
];

export function WikiExperience() {
  const [active, setActive] = useState<WikiTab>('terje');
  const reduceMotion = useReducedMotion();

  return (
    <CinematicBackground
      backgroundImageSrc="/Images/3.jpg"
      backgroundFit="cover"
      backgroundPosition="center top"
      backgroundParallax={false}
    >
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-7 sm:mb-9"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-neutral-400 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            CDN Wiki
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            Hashima{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Field Manuals
            </span>
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 max-w-2xl mx-auto text-base sm:text-[17px] leading-relaxed">
            Two cheat sheets in one place. Patch yourself up with the Terje Medicine guide, then build out your base
            with the BoomLay&apos;s Things crafting reference.
          </p>
        </motion.div>

        {/* iOS-style segmented control */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="inline-flex rounded-full border border-gray-200/70 dark:border-white/10 bg-gray-100/70 dark:bg-white/[0.06] backdrop-blur-2xl p-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  aria-pressed={isActive}
                  className="relative inline-flex items-center gap-2 rounded-full px-5 sm:px-7 py-2.5 text-sm font-semibold transition-colors duration-200"
                >
                  {isActive && (
                    <motion.span
                      layoutId="wiki-tab-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-white dark:bg-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                    />
                  )}
                  <span
                    className={`relative z-10 flex items-center gap-2 transition-colors duration-200 ${
                      isActive
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {active === 'terje' ? <TerjeWiki /> : <BoomlayWiki />}
          </motion.div>
        </AnimatePresence>
      </div>
    </CinematicBackground>
  );
}
