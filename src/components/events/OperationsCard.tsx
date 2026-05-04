"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  ArrowRight,
  Radar,
  ShieldAlert,
  TriangleAlert,
  Biohazard,
  Activity,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { DISCORD_INVITE_URL } from '@/lib/links';
import { DiscordLink } from '@/components/ui/DiscordLink';
import { Card } from '@/components/ui/Card';
import type { Event } from '@/data/mock';

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(targetDate: Date | null) {
  const compute = (d: Date | null) => {
    if (!d) return { days: '--', hours: '--', mins: '--', secs: '--' };
    const diff = d.getTime() - Date.now();
    if (diff <= 0) return { days: '00', hours: '00', mins: '00', secs: '00' };
    return {
      days: String(Math.floor(diff / 86400000)).padStart(2, '0'),
      hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
      mins: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
      secs: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
    };
  };

  const [timeLeft, setTimeLeft] = useState(compute(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(compute(targetDate)), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return timeLeft;
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface OperationsCardProps {
  activeEvent: Event | undefined;
}

export function OperationsCard({ activeEvent }: OperationsCardProps) {
  const targetDate = activeEvent?.startsAtUtc ? new Date(activeEvent.startsAtUtc) : null;
  const countdown = useCountdown(targetDate);
  const isPending = !targetDate || (activeEvent?.date === 'TBA');
  const [isLive, setIsLive] = useState(targetDate ? Date.now() >= targetDate.getTime() : false);

  useEffect(() => {
    if (!targetDate) return;
    if (Date.now() >= targetDate.getTime()) { setIsLive(true); return; }
    const id = setInterval(() => {
      if (Date.now() >= targetDate.getTime()) { setIsLive(true); clearInterval(id); }
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <Card className="max-w-5xl w-full p-0 overflow-hidden text-left border-zinc-700/60 bg-[#060809]/97 shadow-[0_24px_80px_rgba(0,0,0,0.72),0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="relative">

        {/* ── Scanline sweep ─────────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-x-0 h-24 pointer-events-none z-20"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.025) 50%, transparent 100%)',
          }}
          animate={{ y: ['-96px', '120%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
        />

        {/* ── Ambient smoke / glow ───────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle at 18% 14%, rgba(220,38,38,0.07) 0%, transparent 40%), radial-gradient(circle at 84% 80%, rgba(113,113,122,0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 22% 18%, rgba(220,38,38,0.10) 0%, transparent 44%), radial-gradient(circle at 80% 76%, rgba(113,113,122,0.10) 0%, transparent 52%)',
              'radial-gradient(circle at 18% 14%, rgba(220,38,38,0.07) 0%, transparent 40%), radial-gradient(circle at 84% 80%, rgba(113,113,122,0.08) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Grid overlay ───────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(161,161,170,0.2) 1px, transparent 1px), linear-gradient(to right, rgba(161,161,170,0.08) 1px, transparent 1px)',
            backgroundSize: '100% 28px, 28px 100%',
          }}
        />

        {/* ── Top accent line ────────────────────────────────────────────── */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent pointer-events-none" />

        {/* ── Split layout ───────────────────────────────────────────────── */}
        <div className="relative grid lg:grid-cols-[1.3fr_0.7fr]">

          {/* ════════════════════════ LEFT PANEL ════════════════════════ */}
          <div className="relative p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-zinc-700/60 overflow-hidden">

            {/* Background watermark */}
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none overflow-hidden">
              <span
                className="text-[80px] sm:text-[110px] font-black font-mono uppercase text-white/[0.018] tracking-[0.2em] whitespace-nowrap"
                style={{ transform: 'rotate(-12deg)' }}
              >
                CLASSIFIED
              </span>
            </div>

            {/* Ghost operation title behind content */}
            {activeEvent && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden">
                <span className="text-[52px] sm:text-[72px] font-black font-mono uppercase text-white/[0.022] tracking-[0.12em] whitespace-nowrap">
                  {activeEvent.title}
                </span>
              </div>
            )}

            {activeEvent ? (
              <>
                {/* Status badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4 font-mono">
                  <motion.span
                    className="inline-flex items-center gap-2 rounded border border-red-800/80 bg-red-950/40 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-red-300"
                    animate={{ boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 8px rgba(239,68,68,0.4)', '0 0 0px rgba(239,68,68,0)'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-red-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    STATUS: LIVE_INCIDENT
                  </motion.span>
                  <span className="inline-flex items-center rounded border border-zinc-700/90 bg-zinc-900/65 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-zinc-400 font-mono">
                    C:\CDN\OPS{'>'}&nbsp;INTEL_BOARD
                  </span>
                </div>

                {/* Metadata strip */}
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mb-4">
                  {[
                    ['NODE', 'CDN-OPS-04'],
                    ['AUTH', 'VERIFIED'],
                    ['UPLINK', 'SECURE'],
                    ['FEED', 'ACTIVE'],
                  ].map(([k, v]) => (
                    <span key={k} className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                      <span className="text-zinc-400">{k}:</span> {v}
                    </span>
                  ))}
                </div>

                {/* Dispatch heading + cursor */}
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-mono uppercase tracking-[0.10em] text-zinc-100 break-all">
                    C:\CDN\OPS{'>'}&nbsp;DISPATCH
                  </h2>
                  <motion.span
                    className="text-xl sm:text-3xl lg:text-4xl font-black font-mono text-red-400 leading-none"
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 1, repeat: Infinity, times: [0, 0.45, 0.5, 0.95] }}
                  >
                    █
                  </motion.span>
                </div>
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em] mb-6">
                  SECTOR:&nbsp;DEER_ISLE
                </p>

                {/* Operation codename box */}
                <div className="mb-5 rounded-sm border border-zinc-700/80 bg-zinc-950/80 p-5 sm:p-6">
                  <p className="text-xs font-mono uppercase tracking-[0.22em] text-zinc-400 mb-3 break-all">
                    C:\CDN\OPS{'>'}&nbsp;OPERATION_CODENAME
                  </p>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono uppercase tracking-[0.06em] text-zinc-100 mb-3 leading-tight">
                    {activeEvent.title}
                  </p>
                  <p className="text-zinc-400 text-base leading-relaxed">{activeEvent.description}</p>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
                  {([
                    ['MAP:', <span key="map" className="flex items-center gap-1.5"><Radar className="w-3.5 h-3.5 text-red-400" />Deer Isle</span>],
                    ['TARGET_ZONE:', isLive
                      ? <span key="tz" className="flex items-center gap-1.5 text-red-300"><Lock className="w-3 h-3" />CRATER <span className="text-zinc-400 text-xs ml-1">// GRID 7200:5100</span></span>
                      : <span key="tz" className="flex items-center gap-1.5 text-zinc-500"><Lock className="w-3 h-3" />COMMAND_SEALED</span>],
                    ['MODE:', 'Search and Seizure'],
                  ] as [string, React.ReactNode][]).map(([label, value]) => (
                    <div key={label} className="rounded-sm border border-zinc-800/90 bg-zinc-900/60 p-4">
                      <p className="text-xs font-mono uppercase tracking-[0.16em] text-zinc-400 mb-1.5">{label}</p>
                      <p className="font-semibold text-zinc-100 text-sm font-mono">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-5 rounded-sm border border-amber-700/40 bg-amber-950/20 px-4 py-3">
                  <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.16em] text-amber-300">
                    TARGET ZONE REVEALS HERE AT ZERO // NO DISCORD LOCATION CALL
                  </p>
                </div>

                {/* Classified asset chips */}
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2.5">
                    RECOVERED_ASSETS:&nbsp;CLASSIFIED_INVENTORY
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {([
                      ['ASSET_01', 'ANT_MINER'],
                      ['ASSET_02', 'LOOT-SAVE_ARMBAND (5 USES)'],
                      ['ASSET_03', 'SAFEHOUSE_KEYCARD'],
                      ['ASSET_04', 'DONATION_PACKAGE'],
                      ['ASSET_05', '[REDACTED]'],
                    ] as [string, string][]).map(([id, label]) => (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-red-900/50 bg-zinc-950/80 px-3 py-2 text-sm font-mono text-zinc-200"
                      >
                        <span className="text-red-500/80">◈</span>
                        <span className="text-zinc-500">{id}:</span>
                        &nbsp;{label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Survivor field briefing */}
                <div className="mt-5 rounded-sm border border-zinc-700/50 bg-zinc-900/40 p-4 space-y-2">
                  <p className="text-xs font-mono uppercase tracking-[0.22em] text-zinc-400 mb-3">
                    C:\CDN\OPS{'>'}&nbsp;FIELD_BRIEFING
                  </p>
                  <p className="text-sm font-mono text-zinc-300 leading-relaxed">
                    ALL UNITS — prepare to the best of your abilities before insertion. Intel on the target zone remains classified until zero-hour. Environmental conditions are <span className="text-amber-400 font-bold">UNKNOWN</span>. Operators should be equipped for all contingencies.
                  </p>
                  <div className="pt-2 grid grid-cols-2 gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-[0.1em]">
                    {[
                      '❄ FROZEN TERRAIN',
                      '🌲 DEEP WILDERNESS',
                      '☢ GAS_CONTAMINATION',
                      '⬛ UNDERGROUND_BUNKER',
                    ].map((hint) => (
                      <span key={hint} className="flex items-center gap-1.5 border border-zinc-800/80 bg-zinc-950/50 px-2 py-1.5 rounded-sm">
                        {hint}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs font-mono text-zinc-500 pt-1">
                    // PACK ACCORDINGLY. NO RESUPPLY. NO EXTRACTION GUARANTEE.
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-[0.12em] text-zinc-100 mb-3">
                  C:\CDN\OPS{'>'}&nbsp;DISPATCH
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Field operators are assembling the next mission board. New directives will be posted shortly.
                </p>
              </>
            )}
          </div>

          {/* ════════════════════════ RIGHT PANEL ════════════════════════ */}
          <div className="p-6 sm:p-8 lg:p-10 bg-black/25 border-t lg:border-t-0 lg:border-l border-zinc-700/60 flex flex-col gap-4">

            {/* Threat level stacked alert */}
            <motion.div
              className="rounded-sm border border-red-900/70 bg-red-950/20 p-4"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(239,68,68,0.0), inset 0 0 0px rgba(239,68,68,0.0)',
                  '0 0 14px rgba(239,68,68,0.22), inset 0 0 8px rgba(239,68,68,0.06)',
                  '0 0 0px rgba(239,68,68,0.0), inset 0 0 0px rgba(239,68,68,0.0)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                >
                  <TriangleAlert className="w-5 h-5 text-red-400" />
                </motion.div>
                <p className="text-sm font-mono uppercase tracking-[0.18em] text-red-300">
                  THREAT_ASSESSMENT
                </p>
              </div>
              <div className="space-y-2">
                {([
                  ['THREAT_LEVEL', 'DIABOLICAL', 'text-red-400'],
                  ['NBC_CONTAMINATION', 'ACTIVE', 'text-orange-400'],
                  ['HOSTILE_ACTIVITY', 'CRITICAL', 'text-red-500'],
                ] as [string, string, string][]).map(([k, v, color]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-[0.12em]">{k}:</span>
                    <span className={`text-sm font-mono font-bold uppercase tracking-[0.1em] ${isLive ? color : 'text-zinc-600'}`}>
                      {isLive ? v : '[REDACTED]'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Countdown / Deployment window */}
            <div className="rounded-sm border border-zinc-800/90 bg-zinc-900/60 p-5">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                INSERTION_T-MINUS:
              </p>
              {isPending ? (
                <p className="text-zinc-600 font-mono text-xs tracking-[0.2em] uppercase">
                  DEPLOYMENT_WINDOW_PENDING
                </p>
              ) : isLive ? (
                <motion.p
                  className="text-red-400 font-black font-mono text-sm tracking-[0.2em] uppercase"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  ◉ OPERATION_ACTIVE — UNITS_INSERTED
                </motion.p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-0 font-mono tabular-nums">
                    {([
                      [countdown.days, 'D'],
                      [countdown.hours, 'H'],
                      [countdown.mins, 'M'],
                      [countdown.secs, 'S'],
                    ] as [string, string][]).map(([val, unit], i) => (
                      <span key={i} className="flex items-baseline">
                        <span className="text-2xl font-black text-zinc-100 leading-none">{val}</span>
                        <span className="text-[10px] font-bold text-red-500/80 uppercase mr-2.5">{unit}</span>
                      </span>
                    ))}
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full relative overflow-hidden">
                    <motion.div
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '40%' }}
                    />
                  </div>
                  <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.18em]">
                    // STANDBY — AWAIT_COMMAND_SIGNAL
                  </p>
                </div>
              )}
            </div>

            {/* Schedule */}
            <div className="rounded-sm border border-zinc-800/90 bg-zinc-900/60 p-5">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500 mb-3 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                SCHEDULE:
              </p>
              <p className="text-zinc-100 font-black font-mono text-base mb-3">
                09 MAY 2026
              </p>
              <div className="space-y-1.5">
                {([
                  ['PDT', 'UTC−7', '18:00'],
                  ['MDT', 'UTC−6', '19:00'],
                  ['CDT', 'UTC−5', '20:00'],
                  ['EDT', 'UTC−4', '21:00'],
                  ['UTC', 'UTC+0', '01:00 (+1D)'],
                ] as [string, string, string][]).map(([zone, offset, time]) => (
                  <div key={zone} className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-[0.12em]">{zone} <span className="text-zinc-500">{offset}</span></span>
                    <span className="text-sm font-mono font-bold text-zinc-200">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission length */}
            <div className="rounded-sm border border-zinc-800/90 bg-zinc-900/60 p-5">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500 mb-2">
                MISSION_LENGTH:
              </p>
              <p className="text-zinc-100 font-semibold font-mono text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-zinc-400" />
                {activeEvent?.duration && activeEvent.duration !== 'TBA'
                  ? activeEvent.duration.toUpperCase()
                  : 'WINDOW_UNDISCLOSED'}
              </p>
            </div>

            {/* Survivor note */}
            <div className="rounded-sm border border-zinc-800/90 bg-zinc-900/60 p-5">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500 mb-2">
                SURVIVOR_NOTE:
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed font-mono">
                Rare loot confirmed in zone. Enter light. Extract fast. Avoid loitering near hotspots.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5 mt-auto pt-1">
              <Button
                asChild
                className="relative overflow-hidden group bg-red-700 hover:bg-red-600 border border-red-600/60 text-white font-mono text-sm uppercase tracking-[0.14em] transition-all duration-200 shadow-[0_0_0px_rgba(220,38,38,0)] hover:shadow-[0_0_20px_rgba(220,38,38,0.35)] active:scale-[0.98]"
              >
                <DiscordLink href={DISCORD_INVITE_URL}>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    ACCESS LIVE ALERTS
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </DiscordLink>
              </Button>
              <Button
                asChild
                variant="outline"
                className="font-mono text-sm uppercase tracking-[0.14em] border-zinc-700/80 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all duration-200 active:scale-[0.98]"
              >
                <Link href="/servers">CHECK LIVE SERVERS</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
