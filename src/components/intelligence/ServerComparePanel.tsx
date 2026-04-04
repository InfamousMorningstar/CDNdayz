"use client";

import { Medal, Signal, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CompareRow {
  serverId: string;
  serverName: string;
  avgPlayers: number;
  peakPlayers: number;
  reliabilityScore: number;
  trendDirection: 'up' | 'down' | 'stable' | 'insufficient';
  verdict: string;
}

interface ServerComparePanelProps {
  rows: CompareRow[];
  selectedServerId: string;
  loading?: boolean;
}

function TrendGlyph({ direction }: { direction: CompareRow['trendDirection'] }) {
  if (direction === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  if (direction === 'down') return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
  return <Minus className="w-3.5 h-3.5 text-neutral-500" />;
}

export function ServerComparePanel({ rows, selectedServerId, loading }: ServerComparePanelProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-neutral-200">
        <Signal className="w-4 h-4 text-cyan-400" />
        <p className="text-xs font-medium uppercase tracking-wide">Cross-Server Intelligence</p>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Building cross-server comparison...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-neutral-500">Not enough shared data yet to rank servers.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-white/5">
                <th className="py-2 pr-3 font-medium">Server</th>
                <th className="py-2 pr-3 font-medium">Avg</th>
                <th className="py-2 pr-3 font-medium">Peak</th>
                <th className="py-2 pr-3 font-medium">Reliability</th>
                <th className="py-2 pr-3 font-medium">Trend</th>
                <th className="py-2 font-medium">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const selected = row.serverId === selectedServerId;
                return (
                  <tr
                    key={row.serverId}
                    className={cn(
                      'border-b border-white/5 last:border-0',
                      selected && 'bg-red-950/15',
                    )}
                  >
                    <td className="py-2.5 pr-3 text-neutral-200">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Medal className="w-3.5 h-3.5 text-amber-400" />}
                        <span className={cn(selected && 'text-red-300 font-medium')}>{row.serverName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-white">{row.avgPlayers}</td>
                    <td className="py-2.5 pr-3 text-white">{row.peakPlayers}</td>
                    <td className="py-2.5 pr-3 text-emerald-300">{row.reliabilityScore}%</td>
                    <td className="py-2.5 pr-3">
                      <span className="inline-flex items-center gap-1 text-neutral-300">
                        <TrendGlyph direction={row.trendDirection} />
                        {row.trendDirection}
                      </span>
                    </td>
                    <td className="py-2.5 text-neutral-300">{row.verdict}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
