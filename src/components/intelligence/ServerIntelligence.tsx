"use client";

/**
 * ServerIntelligence.tsx
 *
 * Homepage section that shows player population trends, quiet/busy times,
 * and human-readable insights for each CDN server.
 *
 * All analytics are computed client-side from raw snapshots fetched from
 * /api/population/history/[serverId].  The component handles its own
 * loading and error states so it degrades gracefully when no data exists.
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, ChevronDown, MoonStar, Sparkles, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { PopulationChart } from './PopulationChart';
import { StatCards, TrendBadge } from './StatCards';
import { InsightSummary } from './InsightSummary';
import { ForecastPanel } from './ForecastPanel';
import { CompareRow, ServerComparePanel } from './ServerComparePanel';
import { WeekdayTrafficPanel } from './WeekdayTrafficPanel';
import { ActivityHeatmap } from './ActivityHeatmap';
import { HeatmapInsights } from './HeatmapInsights';
import {
  ServerAnalytics,
  TimeRange,
  TIME_RANGE_OPTIONS,
} from '@/types/intelligence';
import { servers } from '@/lib/servers';
import { cn } from '@/lib/utils';
import { DAY_NAMES, HOUR_LABELS } from '@/lib/population-analytics';

// ── Types ──────────────────────────────────────────────────────────────────

type FetchState = 'idle' | 'loading' | 'success' | 'error';

// ── Sub-components ─────────────────────────────────────────────────────────

/** Skeleton placeholder shown while data is loading. */
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-xl bg-neutral-800/40', className)} />
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-[220px] w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-28 w-full" />
    </div>
  );
}

/** Styled server selector dropdown. */
function ServerSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'appearance-none cursor-pointer rounded-lg border border-white/10',
          'bg-neutral-900/80 text-sm text-white px-4 py-2 pr-9',
          'focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/40',
          'hover:border-white/20 transition-colors max-w-[280px] truncate',
        )}
        aria-label="Select server"
      >
        {servers.map((s) => (
          <option key={s.id} value={s.id} className="bg-neutral-900">
            {s.name}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none"
        aria-hidden
      />
    </div>
  );
}

/** Segmented time-range picker. */
function TimeRangePicker({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (r: TimeRange) => void;
}) {
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-neutral-900/70 border border-white/5">
      {TIME_RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 py-1 rounded-md text-xs font-medium transition-all duration-150',
            value === opt.value
              ? 'bg-red-600 text-white shadow'
              : 'text-neutral-400 hover:text-white hover:bg-white/5',
          )}
          aria-pressed={value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function TonightAtAGlance({ rows, loading }: { rows: CompareRow[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-4">
        <p className="text-sm text-neutral-500">Preparing tonight recommendations...</p>
      </div>
    );
  }

  if (rows.length === 0) return null;

  const topThree = rows.slice(0, 3);

  return (
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 backdrop-blur-sm p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-3">
        <MoonStar className="w-4 h-4 text-cyan-300" />
        <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-cyan-100">Tonight At A Glance</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {topThree.map((row, idx) => (
          <div
            key={row.serverId}
            className="rounded-lg border border-white/10 bg-black/25 p-2.5 flex flex-col gap-1"
          >
            <p className="text-[11px] uppercase tracking-wider text-neutral-500">
              #{idx + 1} recommendation
            </p>
            <p className="text-sm font-semibold text-white truncate" title={row.serverName}>
              {row.serverName}
            </p>
            <p className="text-xs text-neutral-400">Reliability {row.reliabilityScore}%~ · Avg {row.avgPlayers}</p>
            <p className="text-xs text-cyan-200 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {row.verdict}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickInterpretation({ analytics }: { analytics: ServerAnalytics }) {
  if (!analytics.hasEnoughData) return null;

  const busiestHourLabel = analytics.busiestHour !== null ? HOUR_LABELS[analytics.busiestHour] : '—';
  const quietestHourLabel = analytics.quietestHour !== null ? HOUR_LABELS[analytics.quietestHour] : '—';
  const busiestDayLabel = analytics.busiestDayOfWeek !== null ? DAY_NAMES[analytics.busiestDayOfWeek] : '—';
  const quietestDayLabel = analytics.quietestDayOfWeek !== null ? DAY_NAMES[analytics.quietestDayOfWeek] : '—';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
        <p className="text-[11px] uppercase tracking-widest text-emerald-200/80">Best Time To Play</p>
        <p className="text-sm font-semibold text-white mt-1">{analytics.bestTimeToPlay ?? 'More samples needed'}</p>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
        <p className="text-[11px] uppercase tracking-widest text-red-200/80">Peak Hour</p>
        <p className="text-base font-bold text-white mt-1">{busiestHourLabel}</p>
        <p className="text-xs text-neutral-300">Most active day: {busiestDayLabel}</p>
      </div>
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
        <p className="text-[11px] uppercase tracking-widest text-cyan-100/80">Quiet Hour</p>
        <p className="text-base font-bold text-white mt-1">{quietestHourLabel}</p>
        <p className="text-xs text-neutral-300">Quietest day: {quietestDayLabel}</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-black/25 p-3">
        <p className="text-[11px] uppercase tracking-widest text-neutral-400">Reliability</p>
        <p className="text-base font-bold text-white mt-1">{analytics.reliabilityScore}%~</p>
        <p className="text-xs text-neutral-300">{analytics.nextBestWindow ?? 'Building next-window guidance'}</p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function ServerIntelligence() {
  const [selectedServer, setSelectedServer] = useState<string>(servers[0]?.id ?? '');
  const [timeRange, setTimeRange]           = useState<TimeRange>('1d');
  const [fetchState, setFetchState]         = useState<FetchState>('idle');
  const [analytics, setAnalytics]           = useState<ServerAnalytics | null>(null);
  const [errorMsg, setErrorMsg]             = useState<string>('');
  const [lastUpdatedAt, setLastUpdatedAt]   = useState<number | null>(null);
  const [nowTick, setNowTick]               = useState<number>(Date.now());
  const [compareRows, setCompareRows]       = useState<CompareRow[]>([]);
  const [expandedDetails, setExpandedDetails] = useState<boolean>(false);

  const fetchHistory = useCallback(async () => {
    if (!selectedServer) return;
    setFetchState('loading');
    setErrorMsg('');

    try {
      const res = await fetch(
        `/api/population/intelligence?serverId=${encodeURIComponent(selectedServer)}&range=${timeRange}`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const body: {
        serverId: string;
        range: TimeRange;
        analytics: ServerAnalytics | null;
        compareRows: CompareRow[];
        generatedAt: number;
      } = await res.json();

      setAnalytics(body.analytics);
      setCompareRows(body.compareRows ?? []);
      setLastUpdatedAt(Date.now());
      setFetchState('success');
    } catch (err) {
      console.error('[ServerIntelligence] fetch error:', err);
      setErrorMsg('Could not load server history. Please try again later.');
      setFetchState('error');
    }
  }, [selectedServer, timeRange]);

  // Fetch on mount and whenever the selection changes
  useEffect(() => {
    fetchHistory();
    setExpandedDetails(false);
  }, [fetchHistory]);

  // Auto-refresh every 60 seconds to pick up new snapshots (aligns with API cache TTL)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchHistory();
    }, 60_000);
    return () => clearInterval(interval);
  }, [fetchHistory]);

  useEffect(() => {
    const ticker = setInterval(() => setNowTick(Date.now()), 15_000);
    return () => clearInterval(ticker);
  }, []);

  return (
    <section
      id="server-intelligence"
      aria-labelledby="intelligence-heading"
      className="py-8 sm:py-10 bg-neutral-950/50 backdrop-blur-sm rounded-2xl border border-white/5 relative z-10"
    >
      <div className="w-full px-4 sm:px-6">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-6 gap-1.5">
          <Badge
            variant="outline"
            className="border-sky-500/30 text-sky-400 bg-sky-900/10 backdrop-blur-sm px-4 py-1"
          >
            <BarChart2 className="w-3 h-3 mr-1.5 inline" />
            Population Intelligence
          </Badge>

          <h2
            id="intelligence-heading"
            className="sr-only"
          >
            Population Intelligence
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
            Premium activity analytics to help you pick the right server, right map, and right time window.
          </p>
          {lastUpdatedAt && (
            <p className="text-xs text-neutral-500">
              Updated {Math.max(1, Math.floor((nowTick - lastUpdatedAt) / 1000))}s ago
            </p>
          )}
        </div>

        {/* ── Controls ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <ServerSelector value={selectedServer} onChange={setSelectedServer} />
            {analytics && <TrendBadge analytics={analytics} />}
          </div>
          <TimeRangePicker value={timeRange} onChange={setTimeRange} />
        </div>

        {/* ── Content area ───────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {fetchState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingSkeleton />
            </motion.div>
          )}

          {fetchState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-3 py-20 text-center"
            >
              <p className="text-neutral-500 text-sm">{errorMsg}</p>
              <button
                onClick={fetchHistory}
                className="text-xs text-red-400 underline underline-offset-2 hover:text-red-300 transition-colors"
              >
                Retry
              </button>
            </motion.div>
          )}

          {fetchState === 'success' && analytics && (
            <motion.div
              key={`${selectedServer}-${timeRange}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col gap-4"
            >
              {/* Minimal view: Chart + Basic Stats */}
              <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-3 sm:p-4">
                <PopulationChart
                  snapshots={analytics.snapshots}
                  timeRange={timeRange}
                  fallbackSummary={analytics.insightSummary}
                />
              </div>

              <StatCards analytics={analytics} />

              {/* Expandable detailed analytics */}
              <button
                onClick={() => setExpandedDetails(!expandedDetails)}
                className="flex items-center justify-center gap-2 py-2 text-xs font-medium uppercase tracking-wide text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                {expandedDetails ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show More Analytics
                  </>
                )}
              </button>

              {expandedDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4"
                >
                  <QuickInterpretation analytics={analytics} />

                  {/* Tonight quick recommendations */}
                  <TonightAtAGlance rows={compareRows} loading={false} />

                  {/* Forecast + anomalies */}
                  <ForecastPanel analytics={analytics} />

                  {/* Weekday traffic breakdown */}
                  <WeekdayTrafficPanel analytics={analytics} />

                  {/* Activity Heatmap - premium tactical dashboard */}
                  <ActivityHeatmap heatmapData={analytics.heatmapData} />

                  {/* Heatmap-derived insights */}
                  <HeatmapInsights analytics={analytics} />

                  {/* Insight */}
                  <InsightSummary analytics={analytics} />

                  {/* Cross-server comparison with verdicts */}
                  <ServerComparePanel
                    rows={compareRows}
                    selectedServerId={selectedServer}
                    loading={false}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
