"use client";

/**
 * PopulationChart.tsx
 *
 * Business-intelligence style population chart.
 *
 * Uses bucketed time windows, trend modeling, baseline references, and
 * variance bands to produce a more decision-friendly view than a raw line.
 */

import { useMemo } from 'react';
import { PopulationSnapshot, TimeRange } from '@/types/intelligence';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
  ReferenceLine,
} from 'recharts';

interface PopulationChartProps {
  snapshots: PopulationSnapshot[];
  timeRange: TimeRange;
  fallbackSummary?: string;
}

const RANGE_DAYS: Record<TimeRange, number> = {
  '6h': 0.25,
  '1d': 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '6m': 182,
  '1y': 365,
};

const MIN_VISUAL_POINTS = 4;

type ChartRow = {
  ts: number;
  actual: number | null;
  trend: number | null;
  lower: number | null;
  band: number | null;
  sampleCount: number;
  coveragePct: number;
};

type BucketSample = {
  ts: number;
  players: number;
};

function formatDateLabel(ts: number, totalDays: number): string {
  const d = new Date(ts);
  if (totalDays <= 2) {
    return d.toLocaleString(undefined, { weekday: 'short', hour: 'numeric' });
  }
  if (totalDays <= 14) {
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
  }
  if (totalDays <= 90) {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
}

function bucketMsForRange(range: TimeRange): number {
  if (range === '6h') return 30 * 60 * 1000; // 30m
  if (range === '1d') return 60 * 60 * 1000; // 1h
  if (range === '7d') return 6 * 60 * 60 * 1000; // 6h
  if (range === '30d') return 12 * 60 * 60 * 1000; // 12h
  if (range === '90d') return 24 * 60 * 60 * 1000; // 1d
  if (range === '6m') return 2 * 24 * 60 * 60 * 1000; // 2d
  return 7 * 24 * 60 * 60 * 1000; // 1w
}

function niceMax(value: number): number {
  if (value <= 10) return 10;
  if (value <= 20) return 20;
  if (value <= 50) return Math.ceil(value / 5) * 5;
  return Math.ceil(value / 10) * 10;
}

function stddev(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function timeWeightedBucketAverage(
  samples: BucketSample[],
  bucketStart: number,
  bucketEnd: number,
): { value: number | null; coverageMs: number } {
  if (samples.length === 0 || bucketEnd <= bucketStart) {
    return { value: null, coverageMs: 0 };
  }

  let weighted = 0;
  let coverageMs = 0;

  for (let i = 0; i < samples.length; i++) {
    const current = samples[i];
    const nextTs = i + 1 < samples.length ? samples[i + 1].ts : bucketEnd;
    const segStart = Math.max(current.ts, bucketStart);
    const segEnd = Math.min(nextTs, bucketEnd);

    if (segEnd <= segStart) continue;

    const duration = segEnd - segStart;
    weighted += current.players * duration;
    coverageMs += duration;
  }

  if (coverageMs <= 0) {
    return { value: null, coverageMs: 0 };
  }

  return {
    value: Math.round(weighted / coverageMs),
    coverageMs,
  };
}

export function PopulationChart({ snapshots, timeRange, fallbackSummary }: PopulationChartProps) {
  const totalDays = RANGE_DAYS[timeRange];

  const { rows, benchmark, capacityLine, yMax } = useMemo(() => {
    const rangeEnd = Date.now();
    const rangeStart = rangeEnd - totalDays * 24 * 60 * 60 * 1000;
    const bucketMs = bucketMsForRange(timeRange);
    const bucketCount = Math.max(1, Math.ceil((rangeEnd - rangeStart) / bucketMs));

    const buckets: BucketSample[][] = Array.from({ length: bucketCount }, () => []);
    let maxPlayersSeen = 0;
    let maxCapacitySeen = 0;

    for (const s of snapshots) {
      if (s.timestamp < rangeStart || s.timestamp > rangeEnd) continue;
      const idx = Math.min(bucketCount - 1, Math.max(0, Math.floor((s.timestamp - rangeStart) / bucketMs)));
      buckets[idx].push({ ts: s.timestamp, players: s.playerCount });
      maxPlayersSeen = Math.max(maxPlayersSeen, s.playerCount);
      maxCapacitySeen = Math.max(maxCapacitySeen, s.maxPlayers);
    }

    const actualSeriesWithCoverage = buckets.map((samples, i) => {
      const bucketStart = rangeStart + i * bucketMs;
      const bucketEnd = Math.min(rangeEnd, bucketStart + bucketMs);
      const { value, coverageMs } = timeWeightedBucketAverage(samples, bucketStart, bucketEnd);
      return {
        actual: value,
        coveragePct: Math.max(0, Math.min(100, Math.round((coverageMs / Math.max(1, bucketMs)) * 100))),
      };
    });

    const actualSeries = actualSeriesWithCoverage.map((x) => x.actual);

    const nonNullActual = actualSeries.filter((v): v is number => v !== null);
    const volatility = stddev(nonNullActual.filter((v) => v > 0));
    const benchmark = nonNullActual.length > 0
      ? Math.round(nonNullActual.reduce((a, b) => a + b, 0) / nonNullActual.length)
      : 0;

    const rolling = actualSeries.map((_, i) => {
      const from = Math.max(0, i - 2);
      const slice = actualSeries.slice(from, i + 1).filter((v): v is number => v !== null);
      if (slice.length === 0) return null;
      return Math.round(slice.reduce((a, b) => a + b, 0) / slice.length);
    });

    const rows: ChartRow[] = actualSeries.map((actual, i) => {
      const trend = rolling[i];
      const lowerValue = trend === null ? null : Math.max(0, Math.round(trend - volatility));
      const upper = trend === null || lowerValue === null
        ? null
        : Math.max(lowerValue, Math.round(trend + volatility));
      const ts = rangeStart + i * bucketMs;
      return {
        ts,
        actual,
        trend,
        lower: lowerValue,
        band: upper === null || lowerValue === null ? null : upper - lowerValue,
        sampleCount: buckets[i].length,
        coveragePct: actualSeriesWithCoverage[i].coveragePct,
      };
    });

    const yMax = niceMax(Math.max(maxPlayersSeen, maxCapacitySeen, benchmark, 1));

    return {
      rows,
      benchmark,
      capacityLine: maxCapacitySeen > 0 ? maxCapacitySeen : null,
      yMax,
    };
  }, [snapshots, timeRange, totalDays]);

  if (rows.length < MIN_VISUAL_POINTS || rows.every((r) => r.sampleCount === 0)) {
    return (
      <div className="flex items-center justify-center h-40 rounded-xl bg-neutral-900/60 border border-white/5 px-6">
        <div className="text-center space-y-2 max-w-2xl">
          <p className="text-sm text-neutral-300 leading-relaxed">
            {fallbackSummary || 'Not enough data yet — keep checking back as more server activity is recorded.'}
          </p>
          <p className="text-xs text-neutral-500">
            {snapshots.length === 0
              ? 'No valid online snapshots recorded for this time window yet.'
              : `Only ${snapshots.length} valid snapshot${snapshots.length === 1 ? '' : 's'} recorded. Keep collecting data for clearer trends.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Observed players
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          Smoothed trend
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Range average
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          Server slot cap
        </span>
      </div>

      <div className="h-[260px] overflow-hidden rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={rows}
          margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
        >
          <defs>
            <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.03} />
            </linearGradient>
            <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.04} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3" />

          <XAxis
            dataKey="ts"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickCount={6}
            minTickGap={28}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickFormatter={(value) => formatDateLabel(Number(value), totalDays)}
          />
          <YAxis
            domain={[0, yMax]}
            tickCount={5}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            width={36}
          />

          <Tooltip
            contentStyle={{
              background: 'rgba(10,10,10,0.94)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              color: '#e5e7eb',
            }}
            formatter={(value: unknown, name: string | number | undefined) => {
              if (value === null || typeof value === 'undefined') {
                return ['No sample', String(name ?? '')];
              }
              const n = Number(value ?? 0);
              if (name === 'actual') return [`${n} players`, 'Observed players'];
              if (name === 'trend') return [`${n} players`, 'Smoothed trend'];
              return [`${n} players`, name];
            }}
            labelFormatter={(label, payload) => {
              const date = formatDateLabel(Number(label), totalDays);
              const row = (payload && payload.length > 0 ? payload[0].payload : null) as ChartRow | null;
              if (!row) return date;
              return `${date} • ${row.sampleCount} sample${row.sampleCount === 1 ? '' : 's'} • ${row.coveragePct}% bucket coverage`;
            }}
          />

          {/* Variance band around trend (control-band style). */}
          <Area type="monotone" dataKey="lower" stackId="band" fill="transparent" stroke="transparent" />
          <Area
            type="monotone"
            dataKey="band"
            stackId="band"
            fill="url(#bandFill)"
            fillOpacity={0.65}
            stroke="transparent"
            name="Expected range"
            isAnimationActive={false}
          />

          <Area
            type="monotone"
            dataKey="actual"
            stroke="#ef4444"
            fill="url(#actualFill)"
            strokeWidth={2}
            connectNulls={true}
            name="actual"
          />

          <Line
            type="monotone"
            dataKey="trend"
            stroke="#22d3ee"
            strokeWidth={2}
            connectNulls={true}
            dot={false}
            name="trend"
          />

          <ReferenceLine
            y={benchmark}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            ifOverflow="extendDomain"
          />

          {capacityLine && (
            <ReferenceLine
              y={capacityLine}
              stroke="rgba(255,255,255,0.45)"
              strokeDasharray="2 4"
              ifOverflow="extendDomain"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
