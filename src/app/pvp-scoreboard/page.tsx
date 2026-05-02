"use client";

import { useState } from 'react';
import { PvPScoreboard } from '@/components/pvp/PvPScoreboard';
import { generateMockPlayers } from '@/lib/pvp-mock-data';

type Period = 'daily' | 'weekly' | 'monthly' | 'alltime';

export default function PvPScoreboardPage() {
  const [period, setPeriod] = useState<Period>('weekly');
  const [players, setPlayers] = useState(() => generateMockPlayers(30));
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    setIsAnimating(true);
    setTimeout(() => {
      setPlayers(generateMockPlayers(30));
      setIsAnimating(false);
    }, 300);
  };

  const handleSortChange = (column: string, direction: 'asc' | 'desc') => {
    console.log(`Sorted by ${column} (${direction})`);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="mb-12">
          <div className="border-b border-gray-200 dark:border-white/10 pb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              PvP Leaderboard
            </h1>
            <p className="text-gray-600 dark:text-neutral-400">
              Top players across all PvP servers
            </p>
          </div>
        </div>

        {/* Scoreboard */}
        <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
          <PvPScoreboard
            players={players}
            period={period}
            onPeriodChange={handlePeriodChange}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-neutral-500">
          <p>Mockup preview — using sample data. Not yet live.</p>
        </div>
      </div>
    </main>
  );
}
