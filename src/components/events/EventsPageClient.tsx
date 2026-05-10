'use client';

import { useEffect, useMemo, useState } from 'react';
import { Radio } from 'lucide-react';
import { CinematicBackground } from '@/components/features/CinematicBackground';
import { Badge } from '@/components/ui/Badge';
import { OperationsCard } from '@/components/events/OperationsCard';
import { Card } from '@/components/ui/Card';
import type { Event } from '@/data/mock';
import { getComputedEventStatus } from '@/lib/event-status';

interface EventsPageClientProps {
  events: Event[];
}

export function EventsPageClient({ events }: EventsPageClientProps) {
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const computedEvents = useMemo(
    () => events.map((event) => ({ ...event, computedStatus: getComputedEventStatus(event, nowMs) })),
    [events, nowMs],
  );

  const activeEvent = useMemo(() => {
    const active = computedEvents.find((event) => event.computedStatus === 'active');
    if (active) {
      return active;
    }

    return computedEvents.find((event) => event.computedStatus === 'upcoming');
  }, [computedEvents]);

  const pastEvents = useMemo(
    () => computedEvents.filter((event) => event.computedStatus === 'completed'),
    [computedEvents],
  );

  return (
    <CinematicBackground backgroundImageSrc="/Images/3.jpg">
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">

        {/* Page header */}
        <div className="relative mb-10 sm:mb-14 text-center flex flex-col items-center">
          <Badge variant="outline" className="mb-6 border-red-500/35 text-red-700 dark:text-red-400 bg-red-500/10 dark:bg-red-950/20 backdrop-blur-sm px-4 py-1">
            Live Operations
          </Badge>
          <div className="mb-6 inline-flex p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
            <Radio className="w-12 h-12 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Operations & <span className="text-red-500">Events</span>
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 max-w-2xl text-base sm:text-lg">
            Engage in server-wide operations, treasure hunts, and community challenges.
          </p>
        </div>

        {/* Main operations card */}
        <div className="flex justify-center mb-12 sm:mb-16">
          {activeEvent ? (
            <OperationsCard activeEvent={activeEvent} />
          ) : (
            <Card className="max-w-5xl w-full border-zinc-700/60 bg-[#060809]/97 p-8 sm:p-10 text-left shadow-[0_24px_80px_rgba(0,0,0,0.72),0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="flex flex-col gap-4">
                <span className="inline-flex w-fit items-center rounded border border-zinc-700/90 bg-zinc-900/65 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-zinc-400 font-mono">
                  C:\CDN\OPS{'>'} STANDBY_BOARD
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono uppercase tracking-[0.1em] text-zinc-100">
                  NEXT EVENT CURRENTLY BEING PLANNED
                </h2>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl">
                  Command is assembling the next operation package. Mission brief, target zone, and deployment window will be posted once planning is complete.
                </p>
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
                  // CHECK BACK SOON FOR NEW ORDERS
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Past Operations — Event History */}
        {pastEvents.length > 0 && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">C:\CDN\OPS{'>'} AFTER_ACTION_REPORT</span>
              <div className="flex-1 h-px bg-zinc-700" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">ARCHIVED_LOG</span>
            </div>
            <div className="space-y-3">
              {pastEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-md border border-zinc-700/70 bg-zinc-950/65 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
                >
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 rounded border border-zinc-600/60 bg-zinc-900/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                      STATUS: CONCLUDED
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-300 font-mono uppercase tracking-[0.1em]">{ev.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{ev.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] font-mono text-zinc-500">{ev.date}</p>
                    <p className="text-[10px] font-mono text-zinc-600 mt-0.5">MAP: NOOB_CHERNARUS</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </CinematicBackground>
  );
}
