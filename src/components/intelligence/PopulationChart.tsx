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
import { PopulationSnapshot } from '@/types/intelligence';
import { downsample } from '@/lib/population-analytics';

interface PopulationChartProps {
  snapshots: PopulationSnapshot[];
}

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
  if (totalDays <= 7) {
    // Show weekday + time
    return d.toLocaleDateString(undefined, { weekday: 'short', hour: 'numeric' });
  }
  if (totalDays <= 90) {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
}

export function PopulationChart({ snapshots }: PopulationChartProps) {
  const data = useMemo(() => downsample(snapshots, MAX_CHART_POINTS), [snapshots]);

  if (data.length < MIN_VISUAL_POINTS) {
    return (
      <div className="flex items-center justify-center h-40 rounded-xl bg-neutral-900/60 border border-white/5">
        <p className="text-sm text-neutral-500 text-center px-6">
          {data.length === 0
            ? 'No data recorded yet for this time window.'
            : `Only ${data.length} snapshot${data.length === 1 ? '' : 's'} recorded so far — the chart will appear once more data is collected.`}
        </p>
      </div>
    );
  }

  // Compute Y domain — always start at 0, cap max slightly above peak for breathing room
  const maxPlayers = Math.max(...data.map((s) => s.playerCount), 1);
  const yMax = Math.ceil(maxPlayers * 1.15);

  // Map snapshots to SVG coordinates
  const tsMin = data[0].timestamp;
  const tsMax = data[data.length - 1].timestamp;
  const tsRange = tsMax - tsMin || 1;

  const pts = data.map((s) => ({
    x: PAD_LEFT + ((s.timestamp - tsMin) / tsRange) * PLOT_W,
    y: PAD_TOP  + (1 - s.playerCount / yMax) * PLOT_H,
    snap: s,
  }));

  const linePath = smoothPath(pts);

  // Close path for the gradient fill (go to bottom-right then bottom-left)
  const fillPath =
    linePath +
    ` L ${pts[pts.length - 1].x} ${PAD_TOP + PLOT_H}` +
    ` L ${pts[0].x} ${PAD_TOP + PLOT_H} Z`;

  // Y-axis gridlines (4 lines at 0%, 33%, 67%, 100% of yMax)
  const yTicks = [0, Math.round(yMax / 3), Math.round((2 * yMax) / 3), yMax];

  // X-axis labels (up to 6 evenly-spaced timestamps)
  const totalDays = (tsMax - tsMin) / (1000 * 60 * 60 * 24);
  const xLabelItems = sparseLabels(pts, 6);

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
        {xLabelItems.map(({ item: pt, index }) => (
          <text
            key={index}
            x={pt.x}
            y={H - 6}
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
          >
            {formatDateLabel(pt.snap.timestamp, totalDays)}
          </text>
        ))}
      </svg>
    </div>
  );
}
