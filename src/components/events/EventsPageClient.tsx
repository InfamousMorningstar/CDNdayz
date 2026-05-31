'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
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
    <div className="relative min-h-screen overflow-hidden bg-[#0E1116]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(194,155,64,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(158,58,58,0.08),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[length:100%_4px]" />

      <div className="container relative z-10 mx-auto px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto mb-10 max-w-6xl sm:mb-12">
          <Card className="overflow-hidden rounded-[28px] border border-white/10 bg-[#11161E]/88 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.38)] backdrop-blur-sm sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#C29B40]/35 bg-[#C29B40]/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#C29B40]">
                  <FileText className="h-3.5 w-3.5" />
                  Operations Dossier
                </div>
                <h1 className="text-3xl font-semibold uppercase tracking-[0.16em] text-[#E6E6E6] sm:text-4xl lg:text-5xl">
                  Mission Briefings
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9CA3AF] sm:text-base">
                  Review active deployment files, mission objectives, and archived operation summaries prepared for CDN field operators.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
                {[
                  ['Classification', 'Top Secret'],
                  ['Current File', activeEvent ? 'Live Dossier' : 'Standby'],
                  ['Archive Entries', String(pastEvents.length).padStart(2, '0')],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF]">{label}</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#E6E6E6]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-12 flex justify-center sm:mb-16">
          {activeEvent ? (
            <OperationsCard activeEvent={activeEvent} />
          ) : (
            <Card className="max-w-6xl w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#11161E]/90 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.38)] backdrop-blur-sm sm:p-10">
              <div className="flex flex-col gap-4">
                <span className="inline-flex w-fit items-center rounded-full border border-[#C29B40]/35 bg-[#C29B40]/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#C29B40]">
                  Standby File
                </span>
                <h2 className="text-2xl font-semibold uppercase tracking-[0.12em] text-[#E6E6E6] sm:text-3xl">
                  Next operation is being assembled
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-[#9CA3AF] sm:text-base">
                  Command is assembling the next operation package. Mission brief, target zone, and deployment window will be posted once planning is complete.
                </p>
              </div>
            </Card>
          )}
        </div>

        {pastEvents.length > 0 && (
          <div className="mx-auto max-w-6xl">
            <div className="mb-5 flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C29B40]">Archived Briefings</span>
              <div className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784]">After Action Reports</span>
            </div>
            <div className="space-y-3">
              {pastEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-2xl border border-white/10 bg-[#11161E]/82 p-4 backdrop-blur-sm sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9CA3AF]">
                        Status // Concluded
                      </div>
                      <p className="text-base font-semibold uppercase tracking-[0.08em] text-[#E6E6E6]">{ev.title}</p>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#9CA3AF]">{ev.description}</p>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C29B40]">{ev.date}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6F7784]">
                        Region // {(ev.map ?? 'UNKNOWN').toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
