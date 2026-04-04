"use client";

/**
 * PopulationChart.tsx
 *
 * Lightweight, dependency-free SVG line chart for player population over time.
 * Renders a smooth area chart with axis labels and an inline gradient fill.
 *
 * Falls back to a polished text message when there are fewer than MIN_VISUAL_POINTS
 * samples — this avoids a near-empty chart that would look broken.
 */

import { useMemo } from 'react';
import { PopulationSnapshot, TimeRange } from '@/types/intelligence';
import { downsample } from '@/lib/population-analytics';

interface PopulationChartProps {
  snapshots: PopulationSnapshot[];
  timeRange: TimeRange;
  fallbackSummary?: string;
}

const RANGE_DAYS: Record<TimeRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '6m': 182,
  '1y': 365,
};

const MIN_VISUAL_POINTS = 8;
const MAX_CHART_POINTS  = 120; // keep the SVG path manageable

// SVG coordinate space
const W  = 800;  // viewBox width
const H  = 220;  // viewBox height
const PAD_TOP    = 16;
const PAD_BOTTOM = 42;  // space for x-axis labels
const PAD_LEFT   = 44;  // space for y-axis labels
const PAD_RIGHT  = 12;
const PLOT_W = W - PAD_LEFT - PAD_RIGHT;
const PLOT_H = H - PAD_TOP  - PAD_BOTTOM;

/** Convert an array of {x,y} to a smooth SVG cubic bezier path string. */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const cpx = (p.x + c.x) / 2;
    d += ` C ${cpx} ${p.y}, ${cpx} ${c.y}, ${c.x} ${c.y}`;
  }
  return d;
}

/** Choose at most `n` evenly-spaced indices from an array for labelling. */
function sparseLabels<T>(arr: T[], n: number): { item: T; index: number }[] {
  if (arr.length === 0) return [];
  if (arr.length <= n)  return arr.map((item, index) => ({ item, index }));
  const step = (arr.length - 1) / (n - 1);
  return Array.from({ length: n }, (_, i) => {
    const index = Math.round(i * step);
    return { item: arr[index], index };
  });
}

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

function niceMax(value: number): number {
  if (value <= 10) return 10;
  if (value <= 20) return 20;
  if (value <= 50) return Math.ceil(value / 5) * 5;
  return Math.ceil(value / 10) * 10;
}

export function PopulationChart({ snapshots, timeRange, fallbackSummary }: PopulationChartProps) {
  const data = useMemo(() => downsample(snapshots, MAX_CHART_POINTS), [snapshots]);

  if (data.length < MIN_VISUAL_POINTS) {
    return (
      <div className="flex items-center justify-center h-40 rounded-xl bg-neutral-900/60 border border-white/5 px-6">
        <div className="text-center space-y-2 max-w-2xl">
          <p className="text-sm text-neutral-300 leading-relaxed">
            {fallbackSummary || 'Not enough data yet — keep checking back as more server activity is recorded.'}
          </p>
          <p className="text-xs text-neutral-500">
            {data.length === 0
              ? 'No valid online snapshots recorded for this time window yet.'
              : `Only ${data.length} valid snapshot${data.length === 1 ? '' : 's'} recorded. A trend chart appears at 8+ points.`}
          </p>
        </div>
      </div>
    );
  }

  // Compute Y domain from observed values + configured slot caps.
  const observedPlayers = Math.max(...data.map((s) => s.playerCount), 0);
  const configuredCap = Math.max(...data.map((s) => s.maxPlayers), 0);
  const yMax = niceMax(Math.max(observedPlayers, configuredCap, 1));

  // Always map X across the selected time range so axis matches 7d/30d/90d/etc.
  const totalDays = RANGE_DAYS[timeRange];
  const tsMax = Date.now();
  const tsMin = tsMax - totalDays * 24 * 60 * 60 * 1000;
  const tsRange = tsMax - tsMin;

  const pts = data.map((s) => ({
    x: PAD_LEFT + (Math.min(Math.max(s.timestamp, tsMin), tsMax) - tsMin) / tsRange * PLOT_W,
    y: PAD_TOP  + (1 - s.playerCount / yMax) * PLOT_H,
    snap: s,
  }));

  const linePath = smoothPath(pts);

  // Close path for the gradient fill (go to bottom-right then bottom-left)
  const fillPath =
    linePath +
    ` L ${pts[pts.length - 1].x} ${PAD_TOP + PLOT_H}` +
    ` L ${pts[0].x} ${PAD_TOP + PLOT_H} Z`;

  // Y-axis gridlines
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((i * yMax) / 4));

  // X-axis labels are generated from range domain, not sparse sample points.
  const xLabelItems = Array.from({ length: 6 }, (_, i) => {
    const ts = tsMin + (i / 5) * tsRange;
    const x = PAD_LEFT + (i / 5) * PLOT_W;
    return { x, ts, index: i };
  });

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: 220, minWidth: 320 }}
        aria-label="Player population over time"
        role="img"
      >
        <defs>
          <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#dc2626" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines + Y labels */}
        {yTicks.map((val) => {
          const cy = PAD_TOP + (1 - val / yMax) * PLOT_H;
          return (
            <g key={val}>
              <line
                x1={PAD_LEFT} y1={cy} x2={W - PAD_RIGHT} y2={cy}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <text
                x={PAD_LEFT - 6} y={cy + 4}
                textAnchor="end"
                fontSize="10"
                fill="#6b7280"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Gradient fill */}
        <path d={fillPath} fill="url(#popGradient)" />

        {/* Main line */}
        <path
          d={linePath}
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data point dots (only when there are few enough to be readable) */}
        {data.length <= 40 &&
          pts.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x} cy={pt.y} r="3"
              fill="#dc2626"
              stroke="#0a0a0a"
              strokeWidth="1.5"
            />
          ))}

        {/* X-axis date labels */}
        {xLabelItems.map((pt) => (
          <text
            key={pt.index}
            x={pt.x}
            y={H - 6}
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
          >
            {formatDateLabel(pt.ts, totalDays)}
          </text>
        ))}
      </svg>
    </div>
  );
}
