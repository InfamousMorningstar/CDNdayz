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
import { BarChart2, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { PopulationChart } from './PopulationChart';
import { StatCards, TrendBadge } from './StatCards';
import { InsightSummary } from './InsightSummary';
import { ForecastPanel } from './ForecastPanel';
import { CompareRow, ServerComparePanel } from './ServerComparePanel';
import { computeAnalytics } from '@/lib/population-analytics';
import {
  PopulationSnapshot,
  ServerAnalytics,
  TimeRange,
  TIME_RANGE_OPTIONS,
} from '@/types/intelligence';
import { servers } from '@/lib/servers';
import { cn } from '@/lib/utils';

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

// ── Main component ─────────────────────────────────────────────────────────

export function ServerIntelligence() {
  const [selectedServer, setSelectedServer] = useState<string>(servers[0]?.id ?? '');
  const [timeRange, setTimeRange]           = useState<TimeRange>('30d');
  const [fetchState, setFetchState]         = useState<FetchState>('idle');
  const [analytics, setAnalytics]           = useState<ServerAnalytics | null>(null);
  const [errorMsg, setErrorMsg]             = useState<string>('');
  const [lastUpdatedAt, setLastUpdatedAt]   = useState<number | null>(null);
  const [nowTick, setNowTick]               = useState<number>(Date.now());
  const [compareRows, setCompareRows]       = useState<CompareRow[]>([]);
  const [compareLoading, setCompareLoading] = useState<boolean>(false);

  const fetchHistory = useCallback(async () => {
    if (!selectedServer) return;
    setFetchState('loading');
    setErrorMsg('');

    try {
      const res = await fetch(
        `/api/population/history/${encodeURIComponent(selectedServer)}?range=${timeRange}`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const body: { serverId: string; range: TimeRange; snapshots: PopulationSnapshot[] } =
        await res.json();

      const server = servers.find((s) => s.id === selectedServer);
      const computed = computeAnalytics(
        body.serverId,
        server?.name ?? body.serverId,
        body.snapshots ?? [],
        body.range,
      );

      setAnalytics(computed);
      setLastUpdatedAt(Date.now());
      setFetchState('success');
    } catch (err) {
      console.error('[ServerIntelligence] fetch error:', err);
      setErrorMsg('Could not load server history. Please try again later.');
      setFetchState('error');
    }
  }, [selectedServer, timeRange]);

  const loadCompareRows = useCallback(async () => {
    setCompareLoading(true);

    try {
      const analyticsRows = await Promise.all(
        servers.map(async (s) => {
          const res = await fetch(
            `/api/population/history/${encodeURIComponent(s.id)}?range=${timeRange}`,
          );
          if (!res.ok) return null;

          const body: { serverId: string; range: TimeRange; snapshots: PopulationSnapshot[] } =
            await res.json();
          const a = computeAnalytics(s.id, s.name, body.snapshots ?? [], body.range);

          if (!a.hasEnoughData) return null;

          const verdict =
            a.reliabilityScore >= 80
              ? 'Most consistent PvE population'
              : a.trendDirection === 'up'
              ? 'Momentum is building'
              : a.trendDirection === 'down'
              ? 'Cooling off recently'
              : 'Stable day-to-day flow';

          return {
            serverId: s.id,
            serverName: s.name,
            avgPlayers: a.avgPlayers,
            peakPlayers: a.peakPlayers,
            reliabilityScore: a.reliabilityScore,
            trendDirection: a.trendDirection,
            verdict,
          } as CompareRow;
        }),
      );

      const ranked = analyticsRows
        .filter((row): row is CompareRow => row !== null)
        .sort((a, b) => {
          if (b.reliabilityScore !== a.reliabilityScore) {
            return b.reliabilityScore - a.reliabilityScore;
          }
          return b.avgPlayers - a.avgPlayers;
        })
        .slice(0, 8);

      setCompareRows(ranked);
    } catch (err) {
      console.error('[ServerIntelligence] compare error:', err);
      setCompareRows([]);
    } finally {
      setCompareLoading(false);
    }
  }, [timeRange]);

  // Fetch on mount and whenever the selection changes
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    loadCompareRows();
  }, [loadCompareRows]);

  // Auto-refresh every 60 seconds to pick up new snapshots (aligns with API cache TTL)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchHistory();
      loadCompareRows();
    }, 60_000);
    return () => clearInterval(interval);
  }, [fetchHistory, loadCompareRows]);

  useEffect(() => {
    const ticker = setInterval(() => setNowTick(Date.now()), 15_000);
    return () => clearInterval(ticker);
  }, []);

  return (
    <section
      id="server-intelligence"
      aria-labelledby="intelligence-heading"
      className="py-20 sm:py-28 bg-neutral-950/60 backdrop-blur-sm relative z-10"
    >
      <div className="container mx-auto px-4 sm:px-6">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-10 gap-3">
          <Badge
            variant="outline"
            className="border-sky-500/30 text-sky-400 bg-sky-900/10 backdrop-blur-sm px-4 py-1"
          >
            <BarChart2 className="w-3 h-3 mr-1.5 inline" />
            Server Intelligence
          </Badge>

          <h2
            id="intelligence-heading"
            className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-white"
          >
            When Are Servers{' '}
            <span className="text-neutral-500">Most Active?</span>
          </h2>

          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl">
            Historical population data helps you find the right time to play — whether
            you prefer a busy server or a quiet loot run.
          </p>
          {lastUpdatedAt && (
            <p className="text-xs text-neutral-500">
              Updated {Math.max(1, Math.floor((nowTick - lastUpdatedAt) / 1000))}s ago
            </p>
          )}
        </div>

        {/* ── Controls ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
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
              className="flex flex-col gap-5"
            >
              {/* Chart */}
              <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-4">
                <PopulationChart
                  snapshots={analytics.snapshots}
                  fallbackSummary={analytics.insightSummary}
                />
              </div>

              {/* Stat cards */}
              <StatCards analytics={analytics} />

              {/* Forecast + anomalies */}
              <ForecastPanel analytics={analytics} />

              {/* Insight */}
              <InsightSummary analytics={analytics} />

              {/* Cross-server comparison with verdicts */}
              <ServerComparePanel
                rows={compareRows}
                selectedServerId={selectedServer}
                loading={compareLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
