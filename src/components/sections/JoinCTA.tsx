"use client";

import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { DISCORD_INVITE_URL } from '@/lib/links';
import { openDiscordAppFirst } from '@/lib/discord';
import { Reveal3D } from '@/components/motion/Reveal3D';
import { TextReveal } from '@/components/motion/TextReveal';
import { Magnetic } from '@/components/motion/Magnetic';

export function JoinCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  // Depth-layered drift: grid sinks, glow rises, content floats gently
  const gridY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const glowY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.1, 0.9]);

  return (
    <section ref={sectionRef} aria-labelledby="join-cta-heading" className="py-14 sm:py-20 bg-gradient-to-br from-red-50 via-white to-gray-100 dark:from-red-900/10 dark:via-black dark:to-neutral-900/30 text-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0 opacity-20 bg-[url('/grid.svg')] bg-[length:40px_40px]"
        style={prefersReducedMotion ? undefined : { y: gridY }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.14),transparent_60%)] pointer-events-none z-0"
        style={prefersReducedMotion ? undefined : { y: glowY, scale: glowScale }}
      />

      <div className="container relative z-10 px-6 mx-auto flex flex-col items-center gap-8">
        <Reveal3D from="up" tilt={10} duration={0.6}>
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-red-500/80">06 // Enlist</span>
            <Badge variant="outline" className="border-red-500/35 text-red-700 dark:text-red-400 bg-red-500/12 dark:bg-red-900/10 backdrop-blur-sm px-4 py-1">
              CDN Operations
            </Badge>
          </div>
        </Reveal3D>

        <h2 id="join-cta-heading" className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white max-w-3xl">
          <TextReveal stagger={0.08}>
            Start Your <span className="text-red-500">Survival Story</span>
          </TextReveal>
        </h2>

        <Reveal3D from="up" delay={0.2} duration={0.7}>
          <p className="text-gray-600 dark:text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            The apocalypse waits for no one. Connect with thousands of other survivors, build your legacy, and dominate the wasteland.
          </p>
        </Reveal3D>

        <Reveal3D from="up" delay={0.35} tilt={20}>
          <div className="flex flex-col sm:flex-row gap-6 mt-8 w-full sm:w-auto">
            <Magnetic strength={0.3}>
              <Button size="lg" className="h-14 px-8 text-lg font-bold w-full shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] transition-shadow duration-500" onClick={() => openDiscordAppFirst(DISCORD_INVITE_URL)}>
                Join Discord Community
              </Button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800" asChild>
                <Link href="/new-player">New Player Guide</Link>
              </Button>
            </Magnetic>
          </div>
        </Reveal3D>
      </div>
    </section>
  );
}
