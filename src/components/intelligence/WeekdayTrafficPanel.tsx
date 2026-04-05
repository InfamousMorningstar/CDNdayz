"use client";

import { CalendarDays } from 'lucide-react';
import { ServerAnalytics } from '@/types/intelligence';
import { DAY_NAMES } from '@/lib/population-analytics';

interface WeekdayTrafficPanelProps {
  analytics: ServerAnalytics;
}

export function WeekdayTrafficPanel({ analytics }: WeekdayTrafficPanelProps) {
  const { weekdayTraffic, hasEnoughData } = analytics;
  const available = weekdayTraffic.filter((d) => d.avgPlayers !== null);
  const sorted = [...available].sort((a, b) => (b.avgPlayers ?? 0) - (a.avgPlayers ?? 0));
  const busiest = sorted[0] ?? null;
  const quietest = sorted.length > 0 ? sorted[sorted.length - 1] : null;
  const maxAvg = available.length > 0
    ? Math.max(...available.map((d) => d.avgPlayers ?? 0), 1)
    : 1;

  return (
    <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-neutral-200">
        <CalendarDays className="w-4 h-4 text-indigo-300" />
        <p className="text-xs font-medium uppercase tracking-wide">Traffic by Day</p>
      </div>

      {hasEnoughData && busiest && quietest && (
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-950/20 px-2.5 py-1 text-[11px] text-emerald-300">
            Most active: {DAY_NAMES[busiest.day]} ({busiest.avgPlayers})
          </span>
          <span className="inline-flex items-center rounded-full border border-sky-500/25 bg-sky-950/20 px-2.5 py-1 text-[11px] text-sky-300">
            Quietest: {DAY_NAMES[quietest.day]} ({quietest.avgPlayers})
          </span>
        </div>
      )}

      {!hasEnoughData ? (
        <p className="text-sm text-neutral-500">More snapshots are needed before weekday traffic trends are reliable.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
          {weekdayTraffic.map((point) => {
            const ratio = point.avgPlayers === null ? 0 : point.avgPlayers / maxAvg;
            const height = Math.max(8, Math.round(ratio * 64));
            const short = DAY_NAMES[point.day].slice(0, 3);
            const isBusiest = busiest ? point.day === busiest.day : false;
            const isQuietest = quietest ? point.day === quietest.day : false;

            return (
              <div
                key={point.day}
                className={
                  `rounded-lg border px-2 py-2 flex flex-col items-center gap-1 ` +
                  (isBusiest
                    ? 'border-emerald-500/35 bg-emerald-950/15'
                    : isQuietest
                    ? 'border-sky-500/35 bg-sky-950/15'
                    : 'border-white/5 bg-black/20')
                }
                title={DAY_NAMES[point.day]}
              >
                <p className="text-[11px] text-neutral-500 uppercase tracking-wide">{short}</p>
                <div className="h-16 w-full flex items-end justify-center">
                  <div
                    className={
                      `w-6 rounded-t-sm ` +
                      (isBusiest
                        ? 'bg-emerald-400/85'
                        : isQuietest
                        ? 'bg-sky-400/85'
                        : 'bg-indigo-400/80')
                    }
                    style={{ height }}
                    aria-hidden
                  />
                </div>
                <p className="text-sm font-semibold text-white leading-none">
                  {point.avgPlayers === null ? '—' : point.avgPlayers}
                </p>
                <p className="text-[11px] text-neutral-500 leading-none">
                  {point.sampleCount} sample{point.sampleCount === 1 ? '' : 's'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
