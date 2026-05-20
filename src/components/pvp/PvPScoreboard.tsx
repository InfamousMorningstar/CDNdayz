"use client";

import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PlayerStat {
  rank: number;
  playerId: string;
  playerName: string;
  kills: number;
  deaths: number;
  headshots: number;
  playtime: number; // minutes
  lastSeen: string;
  isOnline: boolean;
  trend: 'up' | 'down' | 'stable';
  trendValue: number; // how many positions they moved
}

interface PvPScoreboardProps {
  players: PlayerStat[];
  period: 'daily' | 'weekly' | 'monthly' | 'alltime';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly' | 'alltime') => void;
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void;
}

type SortColumn = 'kills' | 'kd' | 'headshots' | 'playtime';
type SortDirection = 'asc' | 'desc';

const PERIOD_LABELS = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  alltime: 'All Time'
};

function TrendIndicator({ trend, value }: { trend: 'up' | 'down' | 'stable'; value: number }) {
  if (trend === 'up') {
    return <span className="text-xs text-red-600 dark:text-red-400">↑ {value}</span>;
  }
  if (trend === 'down') {
    return <span className="text-xs text-gray-500 dark:text-gray-400">↓ {value}</span>;
  }
  return <span className="text-xs text-gray-400 dark:text-neutral-500">—</span>;
}

export function PvPScoreboard({ 
  players, 
  period, 
  onPeriodChange,
  onSortChange 
}: PvPScoreboardProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('kills');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleColumnSort = (column: SortColumn) => {
    if (sortColumn === column) {
      const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
      setSortDirection(newDirection);
      onSortChange?.(column, newDirection);
    } else {
      setSortColumn(column);
      setSortDirection('desc');
      onSortChange?.(column, 'desc');
    }
  };

  const sortedPlayers = useMemo(() => {
    const sorted = [...players];
    sorted.sort((a, b) => {
      let aVal: number, bVal: number;

      if (sortColumn === 'kd') {
        aVal = a.deaths === 0 ? a.kills : a.kills / a.deaths;
        bVal = b.deaths === 0 ? b.kills : b.kills / b.deaths;
      } else if (sortColumn === 'headshots') {
        aVal = a.headshots;
        bVal = b.headshots;
      } else if (sortColumn === 'playtime') {
        aVal = a.playtime;
        bVal = b.playtime;
      } else {
        aVal = a.kills;
        bVal = b.kills;
      }

      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return sorted;
  }, [players, sortColumn, sortDirection]);

  const SortableHeader = ({ column, label }: { column: SortColumn; label: string }) => (
    <button
      onClick={() => handleColumnSort(column)}
      className="text-xs uppercase tracking-wider font-semibold text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
    >
      {label}
      {sortColumn === column && (sortDirection === 'desc' ? ' ↓' : ' ↑')}
    </button>
  );

  const stats = {
    avgKD: (sortedPlayers.reduce((sum, p) => sum + (p.deaths === 0 ? p.kills : p.kills / p.deaths), 0) / sortedPlayers.length).toFixed(2),
    totalKills: sortedPlayers.reduce((sum, p) => sum + p.kills, 0),
    playersOnline: sortedPlayers.filter(p => p.isOnline).length
  };

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-white/10 pb-4">
        {(Object.entries(PERIOD_LABELS) as Array<[keyof typeof PERIOD_LABELS, string]>).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onPeriodChange(key as any)}
            className={cn(
              "px-3 py-2 text-sm font-medium transition-colors",
              period === key
                ? "text-red-600 dark:text-red-400 border-b-2 border-red-500"
                : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 text-xs">
        <div>
          <p className="text-gray-500 dark:text-neutral-500 uppercase tracking-wider font-semibold mb-1">Avg K/D</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgKD}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-neutral-500 uppercase tracking-wider font-semibold mb-1">Total Kills</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalKills.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-neutral-500 uppercase tracking-wider font-semibold mb-1">Online</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.playersOnline}</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-white/10">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
              <th className="px-4 py-3 text-left"><SortableHeader column="kills" label="Rank" /></th>
              <th className="px-4 py-3 text-left"><SortableHeader column="kills" label="Player" /></th>
              <th className="px-4 py-3 text-right"><SortableHeader column="kills" label="Kills" /></th>
              <th className="px-4 py-3 text-right"><SortableHeader column="kd" label="K/D" /></th>
              <th className="px-4 py-3 text-right"><SortableHeader column="headshots" label="HS" /></th>
              <th className="px-4 py-3 text-right"><SortableHeader column="playtime" label="Hours" /></th>
              <th className="px-4 py-3 text-right">Trend</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.slice(0, 20).map((player, idx) => {
              const kd = player.deaths === 0 ? player.kills : player.kills / player.deaths;
              const isTop3 = idx < 3;
              const hsPercentage = player.kills > 0 ? ((player.headshots / player.kills) * 100).toFixed(0) : 0;

              return (
                <tr
                  key={player.playerId}
                  className={cn(
                    "border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors",
                    isTop3 && "bg-gray-50/60 dark:bg-red-500/5"
                  )}
                >
                  <td className="px-4 py-3">
                    <span className={cn(
                      "font-bold",
                      idx === 0 && "text-red-600 dark:text-red-400",
                      idx === 1 && "text-gray-500 dark:text-neutral-500",
                      idx === 2 && "text-amber-600 dark:text-amber-500"
                    )}>
                      #{player.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-white font-medium">{player.playerName}</span>
                      <span className="text-gray-400 dark:text-neutral-600 text-xs">{player.playerId.slice(0, 6)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{player.kills}</td>
                  <td className={cn(
                    "px-4 py-3 text-right font-bold",
                    kd >= 2 ? "text-red-600 dark:text-red-400" : kd >= 1 ? "text-amber-600 dark:text-amber-500" : "text-gray-700 dark:text-neutral-300"
                  )}>
                    {kd.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                    {player.headshots} <span className="text-gray-500 dark:text-neutral-500 text-xs">({hsPercentage}%)</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-neutral-300">{(player.playtime / 60).toFixed(1)}h</td>
                  <td className="px-4 py-3 text-right">
                    <TrendIndicator trend={player.trend} value={player.trendValue} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn(
                      "text-xs font-medium",
                      player.isOnline ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-neutral-500"
                    )}>
                      {player.isOnline ? "Online" : "Offline"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
