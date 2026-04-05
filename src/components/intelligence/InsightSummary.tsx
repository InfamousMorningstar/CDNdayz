"use client";

/**
 * InsightSummary.tsx
 *
 * Human-readable intelligence summary card derived from ServerAnalytics.
 * Includes the auto-generated insight text and the "best time to play" hint.
 */

import { Lightbulb, Target } from 'lucide-react';
import { ServerAnalytics } from '@/types/intelligence';

interface InsightSummaryProps {
  analytics: ServerAnalytics;
}

export function InsightSummary({ analytics }: InsightSummaryProps) {
  const { insightSummary, bestTimeToPlay, hasEnoughData } = analytics;

  return (
    <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-4 flex flex-col gap-3">
      {/* Main insight */}
      <div className="flex gap-3">
        <span className="shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-amber-400" />
        </span>
        <p className="text-sm text-neutral-300 leading-relaxed">
          {insightSummary}
        </p>
      </div>

      {/* Best time to play — only when there is enough data */}
      {hasEnoughData && bestTimeToPlay && (
        <div className="flex gap-3 pt-3 border-t border-white/5">
          <span className="shrink-0 mt-0.5">
            <Target className="w-4 h-4 text-green-400" />
          </span>
          <p className="text-sm text-neutral-400 leading-relaxed">
            <span className="text-green-400 font-medium">Tip — </span>
            {bestTimeToPlay}
          </p>
        </div>
      )}

      {/* Source note */}
      {hasEnoughData && (
        <p className="text-[11px] text-neutral-600 leading-none pt-1">
          Insights are derived automatically from recorded player-count snapshots.
          Samples are taken on a variable schedule based on GitHub Actions runs; chart values are time-weighted within each bucket for trend + historical expectation analysis.
        </p>
      )}

      <p className="text-[10px] text-neutral-700 leading-relaxed">
        Accuracy note: metrics are data-driven but not 100% exact. Delayed scheduler runs, temporary server-query/network failures, restart/offline periods, and low sample coverage can affect short-window precision.
      </p>
    </div>
  );
}
