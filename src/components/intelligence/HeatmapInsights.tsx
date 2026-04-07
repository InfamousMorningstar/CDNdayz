"use client";

/**
 * HeatmapInsights.tsx
 *
 * Displays 2–4 insight cards derived from heatmap and other analytics data.
 * Shows best time to join, quietest farming window, peak activity, and most active day.
 */

import { ServerAnalytics } from '@/types/intelligence';
import { DAY_NAMES, HOUR_LABELS } from '@/lib/population-analytics';
import { Lightbulb, Target, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeatmapInsightsProps {
  analytics: ServerAnalytics;
}

interface InsightCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  value: string;
  detail?: string;
}

export function HeatmapInsights({ analytics }: HeatmapInsightsProps) {
  const { heatmapData, quietestHour, busiestHour, quietestDayOfWeek, busiestDayOfWeek } = analytics;

  if (!heatmapData.hasEnoughData) {
    return null;
  }

  const cards: InsightCard[] = [];

  // Insight 1: Best time to join (quietest + lowest occupancy)
  if (quietestHour !== null && quietestDayOfWeek !== null) {
    const quietestCell = heatmapData.cells.find(
      (c) => c.day === quietestDayOfWeek && c.hour === quietestHour && c.avgPlayers !== null,
    );

    cards.push({
      id: 'best-join',
      title: 'Best Time to Join',
      subtitle: 'Lowest competition for loot',
      icon: <Lightbulb className="w-5 h-5" />,
      bgGradient: 'from-emerald-950/30 to-emerald-900/20',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-300',
      value: `${HOUR_LABELS[quietestHour]} on ${DAY_NAMES[quietestDayOfWeek]}`,
      detail: quietestCell?.avgPlayers
        ? `~${quietestCell.avgPlayers} avg players (${quietestCell.avgOccupancyPercent}% full)`
        : undefined,
    });
  }

  // Insight 2: Quietest farming window (daytime quiet window)
  if (quietestHour !== null) {
    const farmingHour = quietestHour >= 6 && quietestHour <= 18 ? quietestHour : 10; // Prefer daytime
    const daytimeQuiet = heatmapData.cells.find(
      (c) =>
        c.hour === farmingHour &&
        c.hour >= 6 &&
        c.hour <= 18 &&
        c.avgOccupancyPercent !== null &&
        c.sampleCount > 0,
    );

    if (daytimeQuiet?.avgOccupancyPercent) {
      cards.push({
        id: 'farming-window',
        title: 'Quietest Farming Window',
        subtitle: 'Peaceful looting in daylight',
        icon: <Target className="w-5 h-5" />,
        bgGradient: 'from-cyan-950/30 to-cyan-900/20',
        borderColor: 'border-cyan-500/30',
        textColor: 'text-cyan-300',
        value: `~${HOUR_LABELS[farmingHour]}`,
        detail: `${daytimeQuiet.avgOccupancyPercent}% server occupancy`,
      });
    }
  }

  // Insight 3: Peak activity period
  if (busiestHour !== null && busiestDayOfWeek !== null) {
    const peakCell = heatmapData.cells.find(
      (c) => c.day === busiestDayOfWeek && c.hour === busiestHour && c.avgPlayers !== null,
    );

    cards.push({
      id: 'peak-activity',
      title: 'Peak Activity Period',
      subtitle: 'When the server is most alive',
      icon: <Zap className="w-5 h-5" />,
      bgGradient: 'from-red-950/30 to-red-900/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-300',
      value: `${HOUR_LABELS[busiestHour]} on ${DAY_NAMES[busiestDayOfWeek]}`,
      detail: peakCell?.avgPlayers ? `~${peakCell.avgPlayers} avg players (${peakCell.avgOccupancyPercent}% full)` : undefined,
    });
  }

  // Insight 4: Most active day
  if (busiestDayOfWeek !== null) {
    const dayAvgOccupancies = Array.from({ length: 7 }, (_, day) => {
      const dayCells = heatmapData.cells.filter(
        (c) => c.day === day && c.avgOccupancyPercent !== null,
      );
      if (dayCells.length === 0) return { day, avg: 0 };
      const avg =
        dayCells.reduce((sum, c) => sum + (c.avgOccupancyPercent ?? 0), 0) /
        dayCells.length;
      return { day, avg };
    });

    const mostActiveDayData = dayAvgOccupancies.reduce((prev, curr) =>
      curr.avg > prev.avg ? curr : prev,
    );

    const quietestDayData = dayAvgOccupancies.reduce((prev, curr) =>
      curr.avg < prev.avg && curr.avg > 0 ? curr : prev,
    );

    cards.push({
      id: 'most-active-day',
      title: 'Most Active Day',
      subtitle: 'Peak weekly engagement',
      icon: <Trophy className="w-5 h-5" />,
      bgGradient: 'from-amber-950/30 to-amber-900/20',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-300',
      value: DAY_NAMES[mostActiveDayData.day],
      detail: `${Math.round(mostActiveDayData.avg)}% avg occupancy vs ${Math.round(quietestDayData.avg)}% on ${DAY_NAMES[quietestDayData.day]}`,
    });
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.id}
          className={cn(
            'rounded-xl border px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-2',
            'backdrop-blur-sm transition-all duration-200 hover:border-opacity-60 hover:scale-105',
            `bg-gradient-to-br ${card.bgGradient}`,
            card.borderColor,
          )}
        >
          {/* Icon + Header */}
          <div className="flex items-start justify-between">
            <div className={`${card.textColor} opacity-80`}>{card.icon}</div>
          </div>

          {/* Title */}
          <div>
            <h3 className={`text-xs sm:text-sm font-semibold uppercase tracking-wide ${card.textColor}`}>
              {card.title}
            </h3>
            <p className="text-[10px] sm:text-xs text-neutral-400 leading-tight">{card.subtitle}</p>
          </div>

          {/* Value + Detail */}
          <div className="mt-1">
            <p className="text-white font-bold text-sm sm:text-base leading-tight break-words">{card.value}</p>
            {card.detail && (
              <p className="text-[10px] sm:text-xs text-neutral-300 mt-1 leading-tight">{card.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
