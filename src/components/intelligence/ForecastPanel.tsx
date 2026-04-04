"use client";

import { AreaChart, Gauge } from 'lucide-react';
import { ServerAnalytics } from '@/types/intelligence';
import { cn } from '@/lib/utils';

interface ForecastPanelProps {
  analytics: ServerAnalytics;
}

function confidenceClass(confidence: 'low' | 'medium' | 'high') {
  if (confidence === 'high') return 'text-emerald-300 border-emerald-500/30 bg-emerald-950/20';
  if (confidence === 'medium') return 'text-amber-300 border-amber-500/30 bg-amber-950/20';
  return 'text-neutral-300 border-white/10 bg-neutral-900/60';
}

export function ForecastPanel({ analytics }: ForecastPanelProps) {
  const { forecast, forecastConfidence, anomalySummary, hasEnoughData } = analytics;

  return (
    <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-neutral-200">
          <AreaChart className="w-4 h-4 text-sky-400" />
          <p className="text-xs font-medium uppercase tracking-wide">Next 6h (Historical Data)</p>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide',
            confidenceClass(forecastConfidence),
          )}
        >
          <Gauge className="w-3 h-3" />
          {forecastConfidence} coverage
        </span>
      </div>

      {!hasEnoughData ? (
        <p className="text-sm text-neutral-500 leading-relaxed">
          More history is needed before this panel can show hour-by-hour historical expectations.
        </p>
      ) : forecast.length === 0 ? (
        <p className="text-sm text-neutral-500 leading-relaxed">
          Not enough hourly sample coverage yet for the next 6 hours.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {forecast.map((point) => (
            <div
              key={point.hourOffset}
              className="rounded-lg border border-white/5 bg-black/20 p-2.5 flex flex-col gap-1"
            >
              <p className="text-xs text-neutral-500">+{point.hourOffset}h</p>
              <p className="text-sm text-neutral-200 font-medium">{point.label}</p>
              <p className="text-lg leading-none text-white font-bold">{point.predictedPlayers}</p>
            </div>
          ))}
        </div>
      )}

      {anomalySummary && (
        <p className="text-sm text-amber-300/90 border-t border-white/5 pt-3">{anomalySummary}</p>
      )}
    </div>
  );
}
