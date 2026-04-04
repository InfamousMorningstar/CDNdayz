"use client";

/**
 * StatCards.tsx
 *
 * Grid of quick-glance stat cards derived from ServerAnalytics.
 */

import { TrendingUp, TrendingDown, Minus, Users, Zap, Moon, Activity, Clock, ShieldCheck } from 'lucide-react';
import { ServerAnalytics } from '@/types/intelligence';
import { HOUR_LABELS, DAY_NAMES } from '@/lib/population-analytics';
import { cn } from '@/lib/utils';

interface StatCardsProps {
  analytics: ServerAnalytics;
}

function TrendIcon({ direction }: { direction: 'up' | 'down' | 'stable' | 'insufficient' }) {
  if (direction === 'up')   return <TrendingUp   className="w-4 h-4 text-green-400" />;
  if (direction === 'down') return <TrendingDown  className="w-4 h-4 text-rose-400" />;
  return <Minus className="w-4 h-4 text-neutral-400" />;
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={cn(
      "flex flex-col gap-2 rounded-xl p-4 border bg-neutral-900/60 backdrop-blur-sm transition-colors",
      accent
        ? "border-red-500/20 bg-red-950/10 hover:border-red-500/35"
        : "border-white/5 hover:border-white/10",
    )}>
      <div className="flex items-center gap-2 text-neutral-500">
        {icon}
        <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold text-white leading-none">{value}</p>
      {sub && <p className="text-xs text-neutral-500 leading-snug">{sub}</p>}
    </div>
  );
}

function formatHour(hour: number | null): string {
  if (hour === null) return '—';
  return HOUR_LABELS[hour] ?? '—';
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function StatCards({ analytics }: StatCardsProps) {
  const {
    avgPlayers,
    peakPlayers,
    lowestPlayers,
    trendDirection,
    trendPercent,
    busiestHour,
    quietestHour,
    busiestDayOfWeek,
    quietestDayOfWeek,
    peakTime,
    nextBestWindow,
    reliabilityScore,
    hasEnoughData,
    dataPointCount,
  } = analytics;

  // Placeholder values when data is insufficient
  const dash = '—';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        icon={<Users className="w-4 h-4" />}
        label="Average"
        value={hasEnoughData ? `${avgPlayers}` : dash}
        sub={hasEnoughData ? 'players online' : `${dataPointCount} snapshot${dataPointCount === 1 ? '' : 's'} recorded`}
      />

      <StatCard
        icon={<Zap className="w-4 h-4 text-amber-400" />}
        label="Peak"
        value={hasEnoughData ? `${peakPlayers}` : dash}
        sub={hasEnoughData && peakTime ? formatTimestamp(peakTime) : undefined}
        accent
      />

      <StatCard
        icon={<Activity className="w-4 h-4" />}
        label="Lowest"
        value={hasEnoughData ? `${lowestPlayers}` : dash}
        sub={hasEnoughData ? 'players (online only)' : undefined}
      />

      <StatCard
        icon={<Clock className="w-4 h-4 text-rose-400" />}
        label="Busiest time"
        value={hasEnoughData ? formatHour(busiestHour) : dash}
        sub={hasEnoughData && busiestDayOfWeek !== null
          ? `Often on ${DAY_NAMES[busiestDayOfWeek]}s`
          : undefined}
      />

      <StatCard
        icon={<Moon className="w-4 h-4 text-sky-400" />}
        label="Quietest time"
        value={hasEnoughData ? formatHour(quietestHour) : dash}
        sub={hasEnoughData && quietestDayOfWeek !== null
          ? `Often on ${DAY_NAMES[quietestDayOfWeek]}s`
          : undefined}
      />

      <StatCard
        icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
        label="Reliability"
        value={hasEnoughData ? `${reliabilityScore}%` : dash}
        sub={hasEnoughData ? nextBestWindow ?? 'More samples needed for next-window guidance' : undefined}
      />
    </div>
  );
}

/** Compact trend badge shown near the section header. */
export function TrendBadge({ analytics }: StatCardsProps) {
  const { trendDirection, trendPercent, hasEnoughData } = analytics;
  if (!hasEnoughData) return null;

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border',
      trendDirection === 'up'
        ? 'bg-green-900/20 border-green-500/25 text-green-400'
        : trendDirection === 'down'
        ? 'bg-rose-900/20 border-rose-500/25 text-rose-400'
        : trendDirection === 'insufficient'
        ? 'bg-neutral-800/40 border-white/10 text-neutral-500'
        : 'bg-neutral-800/50 border-white/10 text-neutral-400',
    )}>
      <TrendIcon direction={trendDirection} />
      {trendDirection === 'insufficient'
        ? 'Trend: insufficient data'
        : trendDirection === 'stable'
        ? 'Stable'
        : `${trendPercent}% ${trendDirection}`}
    </span>
  );
}
