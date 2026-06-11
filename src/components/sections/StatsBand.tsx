"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useReducedMotion, useSpring } from 'framer-motion';
import { Activity, Radio, Users, Server } from 'lucide-react';
import type { ServerStatus } from '@/lib/servers';

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const spring = useSpring(0, { stiffness: 55, damping: 18 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  useMotionValueEvent(spring, 'change', (v) => {
    setDisplay(Math.round(v).toLocaleString());
  });

  if (prefersReducedMotion) {
    return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {display}{suffix}
    </span>
  );
}

/**
 * Live network telemetry band: oversized counters that spool up when
 * scrolled into view, fed by the same /api/servers feed as the server list.
 */
export function StatsBand() {
  const [servers, setServers] = useState<ServerStatus[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/servers')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setServers(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const online = servers.filter((s) => s.status === 'online');
  const totalPlayers = online.reduce((sum, s) => sum + s.players, 0);
  const totalSlots = online.reduce((sum, s) => sum + (s.maxPlayers ?? 0), 0);

  const stats = [
    { label: 'Servers Online', value: online.length || 8, icon: Server, accent: 'text-emerald-400' },
    { label: 'Survivors Live', value: totalPlayers, icon: Users, accent: 'text-red-400' },
    { label: 'Network Slots', value: totalSlots || 480, icon: Radio, accent: 'text-amber-400' },
    { label: 'Uptime Watch', value: 24, suffix: '/7', icon: Activity, accent: 'text-sky-400' },
  ];

  return (
    <section aria-label="Network statistics" className="relative py-10 sm:py-12 bg-gray-100/80 dark:bg-black border-y border-gray-200 dark:border-white/5 overflow-hidden">
      {/* Static-noise band backdrop */}
      <div className="absolute inset-0 intel-static-overlay opacity-30" aria-hidden="true" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-gray-500 dark:text-neutral-500">
            Live Network Telemetry
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-white/10 border border-gray-200 dark:border-white/10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-gray-50 dark:bg-neutral-950 px-4 sm:px-8 py-6 sm:py-7 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-transparent transition-all duration-500" />
              <stat.icon className={`w-5 h-5 mb-4 ${stat.accent}`} />
              <div className="text-3xl sm:text-5xl font-bold font-mono tracking-tighter text-gray-900 dark:text-white leading-none mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-gray-500 dark:text-neutral-500">
                {stat.label}
              </div>
              {/* HUD corner tick */}
              <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-red-500/30 group-hover:border-red-500/80 transition-colors" aria-hidden="true" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
