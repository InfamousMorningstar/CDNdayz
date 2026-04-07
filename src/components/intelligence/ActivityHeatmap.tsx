"use client";

/**
 * ActivityHeatmap.tsx
 *
 * Renders a 7x24 heatmap (days × hours) showing average server occupancy
 * across different times of week. Each cell's intensity represents activity
 * level from quiet (dark) to peak (intense).
 */

import { ActivityHeatmapData, HeatmapCell } from '@/types/intelligence';
import { DAY_NAMES, HOUR_LABELS } from '@/lib/population-analytics';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ActivityHeatmapProps {
  heatmapData: ActivityHeatmapData;
}

/**
 * Compute background color intensity for a cell based on occupancy percentage.
 * Returns a Tailwind class name for styling.
 */
function getOccupancyColor(occupancy: number | null, maxOccupancy: number): string {
  if (occupancy === null) {
    return 'bg-neutral-900/30 border-neutral-700/30';
  }

  const ratio = maxOccupancy > 0 ? occupancy / maxOccupancy : 0;

  // Color gradient from dark red (low) to bright red/orange (peak)
  // This matches the tactical/gritty DayZ theme
  if (ratio >= 0.85) return 'bg-red-600 border-red-500';      // Intense red
  if (ratio >= 0.70) return 'bg-red-500/90 border-red-400';   // Strong red
  if (ratio >= 0.55) return 'bg-red-500/70 border-red-400/70'; // Medium red
  if (ratio >= 0.40) return 'bg-orange-500/60 border-orange-400/60'; // Orange
  if (ratio >= 0.25) return 'bg-amber-600/50 border-amber-500/50'; // Amber
  if (ratio >= 0.10) return 'bg-amber-700/40 border-amber-600/40'; // Dark amber
  return 'bg-neutral-800/40 border-neutral-700/40';            // None/minimal
}

interface HeatmapTooltipState {
  cell: HeatmapCell;
  x: number;
  y: number;
}

export function ActivityHeatmap({ heatmapData }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<HeatmapTooltipState | null>(null);

  if (!heatmapData.hasEnoughData) {
    return (
      <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-4 text-center">
        <p className="text-sm text-neutral-500">
          More activity samples needed before heatmap patterns are reliable.
        </p>
      </div>
    );
  }

  // Map cells into grid: index = day * 24 + hour
  const cellsByDayHour = new Map<string, HeatmapCell>();
  heatmapData.cells.forEach((cell) => {
    cellsByDayHour.set(`${cell.day}:${cell.hour}`, cell);
  });

  const handleMouseEnter = (cell: HeatmapCell, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      cell,
      x: rect.left,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-neutral-200">
        <Calendar className="w-4 h-4 text-red-400" />
        <p className="text-xs font-medium uppercase tracking-wide">Activity Heatmap</p>
        <span className="text-[10px] text-neutral-500 ml-auto">See when each server is actually alive</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 px-2 py-1">
        <span>Intensity:</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-neutral-800/40 border border-neutral-700/40 rounded" />
          <span>Quiet</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-amber-600/50 border border-amber-500/50 rounded" />
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-red-500/70 border border-red-400/70 rounded" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-red-600 border border-red-500 rounded" />
          <span>Peak</span>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto -mx-2 px-2 pb-2">
        <div className="inline-block min-w-full">
          {/* Hour labels (top) */}
          <div className="flex mb-1">
            <div className="w-12 flex-shrink-0" />
            <div className="flex gap-0.5">
              {Array.from({ length: 24 }, (_, h) => (
                <div
                  key={`header-${h}`}
                  className="w-6 sm:w-7 text-center text-[8px] sm:text-[9px] text-neutral-500 leading-none py-0.5"
                  title={HOUR_LABELS[h]}
                >
                  {h % 2 === 0 ? Math.floor(h / 2) * 2 : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Day rows */}
          {Array.from({ length: 7 }, (_, day) => (
            <div key={`day-${day}`} className="flex gap-1 mb-1">
              {/* Day label */}
              <div className="w-12 flex-shrink-0 text-right text-[10px] sm:text-xs text-neutral-400 font-medium py-0.5 leading-none">
                {DAY_NAMES[day].slice(0, 3)}
              </div>

              {/* Hour cells */}
              <div className="flex gap-0.5">
                {Array.from({ length: 24 }, (_, hour) => {
                  const cell = cellsByDayHour.get(`${day}:${hour}`) || {
                    day,
                    hour,
                    avgPlayers: null,
                    avgOccupancyPercent: null,
                    sampleCount: 0,
                  };

                  const colorClass = getOccupancyColor(
                    cell.avgOccupancyPercent,
                    heatmapData.maxOccupancyPercent || 100,
                  );

                  return (
                    <div
                      key={`cell-${day}-${hour}`}
                      className={cn(
                        'w-6 sm:w-7 aspect-square rounded-sm border transition-all duration-150 cursor-pointer hover:ring-1 hover:ring-red-400/50',
                        colorClass,
                      )}
                      title={
                        cell.avgPlayers !== null
                          ? `${DAY_NAMES[day]} ${HOUR_LABELS[hour]}: ${cell.avgPlayers} avg players (${cell.avgOccupancyPercent}%)`
                          : `${DAY_NAMES[day]} ${HOUR_LABELS[hour]}: No data`
                      }
                      onMouseEnter={(e) => handleMouseEnter(cell, e)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-neutral-900 border border-red-500/40 rounded-lg p-2.5 shadow-2xl backdrop-blur-sm pointer-events-none text-xs"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 90}px`,
            minWidth: '160px',
          }}
        >
          <p className="font-semibold text-white mb-1 leading-none">
            {DAY_NAMES[tooltip.cell.day]} @ {HOUR_LABELS[tooltip.cell.hour]}
          </p>
          {tooltip.cell.avgPlayers !== null ? (
            <>
              <p className="text-neutral-300 mb-0.5">
                <span className="text-amber-300">⚔ </span>
                Avg: <span className="text-white font-medium">{tooltip.cell.avgPlayers} players</span>
              </p>
              <p className="text-neutral-300 mb-0.5">
                <span className="text-red-400">◆ </span>
                Occupancy: <span className="text-white font-medium">{tooltip.cell.avgOccupancyPercent}%</span>
              </p>
              <p className="text-neutral-400 text-[10px]">
                {tooltip.cell.sampleCount} sample{tooltip.cell.sampleCount === 1 ? '' : 's'}
              </p>
            </>
          ) : (
            <p className="text-neutral-400">Insufficient data</p>
          )}
        </div>
      )}

      {/* Responsive hint */}
      <p className="text-[10px] text-neutral-600 text-center mt-2">
        Hover over cells for details • Responsive grid automatically adjusts on mobile
      </p>
    </div>
  );
}
