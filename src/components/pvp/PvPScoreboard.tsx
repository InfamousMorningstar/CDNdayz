"use client";

import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Target, Crosshair, Skull, Clock, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatZuluStamp(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(d.getUTCDate());
  const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
}

export interface PlayerStat {
  rank: number;
  playerId: string;
  playerName: string;
  kills: number;
  deaths: number;
  headshots: number;
  /** minutes */
  playtime: number;
  /** meters */
  longestShot: number;
  longestShotWeapon?: string;
  lastSeen: string;
  isOnline: boolean;
}

export type Period = 'daily' | 'weekly' | 'monthly' | 'alltime';
export type RosterMode = 'all' | 'pvp-only';

interface PvPScoreboardProps {
  players: PlayerStat[];
  period: Period;
  onPeriodChange: (period: Period) => void;
  rosterMode?: RosterMode;
  onRosterModeChange?: (mode: RosterMode) => void;
}

type SortColumn = 'rank' | 'kills' | 'kd' | 'headshots' | 'longestShot' | 'playtime';
type SortDirection = 'asc' | 'desc';

const PERIOD_LABELS: Record<Period, string> = {
  daily: '24 HR',
  weekly: '7 DAY',
  monthly: '30 DAY',
  alltime: 'ALL TIME',
};

function fmtMeters(m: number): string {
  if (!m || m <= 0) return '—';
  return `${m.toFixed(1)} m`;
}

function fmtHours(min: number): string {
  if (!min) return '0.0 h';
  return `${(min / 60).toFixed(1)} h`;
}

function SortArrow({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return null;
  return direction === 'desc'
    ? <ChevronDown className="ml-1 inline h-3 w-3" />
    : <ChevronUp   className="ml-1 inline h-3 w-3" />;
}

export function PvPScoreboard({ players, period, onPeriodChange, rosterMode, onRosterModeChange }: PvPScoreboardProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('kills');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortColumn(col);
      setSortDirection('desc');
    }
  };

  const sortedPlayers = useMemo(() => {
    const sorted = [...players];
    sorted.sort((a, b) => {
      let av: number, bv: number;
      switch (sortColumn) {
        case 'rank':        av = a.rank;       bv = b.rank;       break;
        case 'kd':
          av = a.deaths === 0 ? a.kills : a.kills / a.deaths;
          bv = b.deaths === 0 ? b.kills : b.kills / b.deaths;
          break;
        case 'headshots':   av = a.headshots;   bv = b.headshots;   break;
        case 'longestShot': av = a.longestShot; bv = b.longestShot; break;
        case 'playtime':    av = a.playtime;    bv = b.playtime;    break;
        case 'kills':
        default:            av = a.kills;       bv = b.kills;
      }
      return sortDirection === 'desc' ? bv - av : av - bv;
    });
    return sorted;
  }, [players, sortColumn, sortDirection]);

  const SortHeader = ({ col, label, align }: { col: SortColumn; label: string; align?: 'left' | 'right' }) => (
    <button
      type="button"
      onClick={() => handleSort(col)}
      className={cn(
        "w-full font-mono text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF] transition-colors hover:text-[#C29B40]",
        align === 'right' ? 'text-right' : 'text-left',
        sortColumn === col && 'text-[#C29B40]'
      )}
    >
      {label}
      <SortArrow active={sortColumn === col} direction={sortDirection} />
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Period filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6F7784]">Reporting Window //</span>
        {(Object.entries(PERIOD_LABELS) as Array<[Period, string]>).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onPeriodChange(key)}
            className={cn(
              "rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition-all",
              period === key
                ? "border-[#C29B40]/55 bg-[#C29B40]/10 text-[#C29B40] shadow-[inset_0_0_0_1px_rgba(194,155,64,0.15)]"
                : "border-white/10 bg-white/[0.02] text-[#9CA3AF] hover:border-white/20 hover:text-[#E6E6E6]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Roster table */}
      <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#11161E]/85 backdrop-blur-sm">
        <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-3.5 w-3.5 text-[#C29B40]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Operator Roster</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {rosterMode && onRosterModeChange && (
              <div className="inline-flex items-center gap-1 rounded-sm border border-white/10 bg-white/[0.02] p-0.5">
                {(
                  [
                    ['all', 'AI + PVP'],
                    ['pvp-only', 'PVP Only'],
                  ] as Array<[RosterMode, string]>
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onRosterModeChange(key)}
                    className={cn(
                      "rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] transition-all",
                      rosterMode === key
                        ? "bg-[#C29B40]/15 text-[#C29B40] shadow-[inset_0_0_0_1px_rgba(194,155,64,0.35)]"
                        : "text-[#9CA3AF] hover:text-[#E6E6E6]"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784]">
              {sortedPlayers.length.toString().padStart(3, '0')} Subjects on File
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="w-16 px-4 py-3"><SortHeader col="rank"        label="No." /></th>
                <th className="px-4 py-3 text-left"><span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF]">Operator</span></th>
                <th className="px-4 py-3"><SortHeader col="kills"       label="Confirmed" align="right" /></th>
                <th className="px-4 py-3"><SortHeader col="kd"          label="K/D"       align="right" /></th>
                <th className="px-4 py-3"><SortHeader col="headshots"   label="HS"        align="right" /></th>
                <th className="px-4 py-3"><SortHeader col="longestShot" label="Longest"   align="right" /></th>
                <th className="px-4 py-3"><SortHeader col="playtime"    label="Field Time" align="right" /></th>
                <th className="px-4 py-3 text-right"><span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF]">Status</span></th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-[#6F7784]">
                    No operator activity recorded for this window.
                  </td>
                </tr>
              ) : (
                sortedPlayers.map((p, idx) => {
                  const kd = p.deaths === 0 ? p.kills : p.kills / p.deaths;
                  const hsPct = p.kills > 0 ? Math.round((p.headshots / p.kills) * 100) : 0;
                  const isTop3 = idx < 3 && sortColumn === 'kills' && sortDirection === 'desc';
                  return (
                    <tr
                      key={p.playerId}
                      className={cn(
                        "border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]",
                        isTop3 && "bg-[#C29B40]/[0.04]"
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className={cn(
                          "font-mono text-xs tracking-[0.12em]",
                          idx === 0 && sortColumn === 'kills' ? "text-[#C29B40]" :
                          idx === 1 && sortColumn === 'kills' ? "text-[#E6E6E6]" :
                          idx === 2 && sortColumn === 'kills' ? "text-[#D7B0B0]" :
                          "text-[#6F7784]"
                        )}>
                          #{String(p.rank).padStart(3, '0')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-sm border font-mono text-[10px] uppercase tracking-[0.12em]",
                            p.isOnline
                              ? "border-[#C29B40]/45 bg-[#C29B40]/10 text-[#C29B40]"
                              : "border-white/10 bg-white/[0.03] text-[#6F7784]"
                          )}>
                            {p.playerName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold uppercase tracking-[0.08em] text-[#E6E6E6]">{p.playerName}</p>
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6F7784]">ID // {p.playerId.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-sm font-semibold tracking-[0.06em] text-[#E6E6E6]">{p.kills}</span>
                        <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6F7784]">/{p.deaths}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn(
                          "font-mono text-sm font-semibold tracking-[0.06em]",
                          kd >= 2 ? "text-[#C29B40]" : kd >= 1 ? "text-[#E6E6E6]" : "text-[#9CA3AF]"
                        )}>
                          {kd.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-sm text-[#E6E6E6]">{p.headshots}</span>
                        <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6F7784]">/{hsPct}%</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn(
                          "font-mono text-sm tracking-[0.06em]",
                          p.longestShot >= 300 ? "text-[#C29B40]" : "text-[#E6E6E6]"
                        )}>
                          {fmtMeters(p.longestShot)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-sm text-[#9CA3AF]">{fmtHours(p.playtime)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.isOnline ? (
                          <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#C29B40]/45 bg-[#C29B40]/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#C29B40]">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C29B40]" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 bg-white/[0.02] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784]">
                            Off Net
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Supporting marksmanship panels ────────────────────────────────────────

export interface LongestShotInfo {
  distance: number;
  killerName: string;
  victimName: string;
  weapon: string;
  ts: number;
  serverId: string;
}

interface MarksmanRow {
  rank: number;
  playerId: string;
  playerName: string;
  distance: number;
  weapon: string;
  victim: string;
  ts: number;
}

export function MarksmanshipPanel({
  record,
  marksmen,
}: {
  record: LongestShotInfo | null;
  marksmen: MarksmanRow[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Hero record */}
      <div className="relative overflow-hidden rounded-[18px] border border-[#C29B40]/30 bg-[#11161E]/85 p-6 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,155,64,0.12),transparent_55%)]" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <Crosshair className="h-3.5 w-3.5 text-[#C29B40]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Longest Confirmed Engagement</span>
          </div>
          {record ? (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF]">Range</p>
              <p className="mt-1 font-mono text-5xl font-semibold tracking-[0.04em] text-[#E6E6E6] sm:text-6xl">
                {record.distance.toFixed(1)}
                <span className="ml-2 font-mono text-2xl uppercase tracking-[0.18em] text-[#C29B40]">m</span>
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  ['Operator', record.killerName],
                  ['Subject', record.victimName],
                  ['Weapon System', record.weapon],
                  ['Recorded', formatZuluStamp(record.ts)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-sm border border-white/10 bg-white/[0.03] px-3 py-2">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6F7784]">{label}</p>
                    <p className="mt-1 truncate text-sm font-semibold uppercase tracking-[0.06em] text-[#E6E6E6]">{value}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#6F7784]">
              No confirmed long-range engagements recorded for this window.
            </p>
          )}
        </div>
      </div>

      {/* Top marksmen list */}
      <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#11161E]/85 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-3">
            <Target className="h-3.5 w-3.5 text-[#C29B40]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Marksmanship Roll</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784]">Per Operator Best</span>
        </div>
        {marksmen.length === 0 ? (
          <div className="px-5 py-8 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-[#6F7784]">
            No marksman records available.
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {marksmen.map((m) => (
              <li key={m.playerId} className="grid grid-cols-[40px_1fr_auto] items-center gap-4 px-5 py-3 transition-colors hover:bg-white/[0.02]">
                <span className={cn(
                  "font-mono text-xs tracking-[0.12em]",
                  m.rank === 1 ? "text-[#C29B40]" : m.rank === 2 ? "text-[#E6E6E6]" : m.rank === 3 ? "text-[#D7B0B0]" : "text-[#6F7784]"
                )}>
                  #{String(m.rank).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold uppercase tracking-[0.08em] text-[#E6E6E6]">{m.playerName}</p>
                  <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-[#6F7784]">
                    {m.weapon} // vs {m.victim}
                  </p>
                </div>
                <span className="font-mono text-sm font-semibold tracking-[0.06em] text-[#C29B40]">
                  {m.distance.toFixed(1)} m
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function SummaryStrip({
  totalKills,
  playersOnline,
  avgKD,
  eventCount,
}: {
  totalKills: number;
  playersOnline: number;
  avgKD: string;
  eventCount: number;
}) {
  const stats: Array<[React.ComponentType<{ className?: string }>, string, string]> = [
    [Skull,    'Confirmed Kills',  totalKills.toLocaleString()],
    [Crosshair,'Mean K/D',         avgKD],
    [Activity, 'Active Operators', playersOnline.toString().padStart(2, '0')],
    [Clock,    'Logged Events',    eventCount.toLocaleString()],
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(([Icon, label, value]) => (
        <div key={label} className="rounded-sm border border-white/10 bg-white/[0.03] px-4 py-4">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 text-[#C29B40]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF]">{label}</p>
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold tracking-[0.04em] text-[#E6E6E6]">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Kill Feed ─────────────────────────────────────────────────────────────

export interface KillFeedEntry {
  id: string;
  ts: number;
  killerName: string;
  victimName: string;
  weapon: string;
  /** meters, or null for melee / no distance */
  distance: number | null;
  headshot: boolean;
}

function formatRelativeAge(ts: number, now: number): string {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function KillFeed({ entries }: { entries: KillFeedEntry[] }) {
  const now = Date.now();
  return (
    <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#11161E]/85 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-3">
          <Skull className="h-3.5 w-3.5 text-[#9E3A3A]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#C29B40]">Confirmed Engagements</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784]">
          {entries.length === 0 ? 'No Recent Activity' : `Last ${entries.length}`}
        </span>
      </div>
      {entries.length === 0 ? (
        <div className="px-5 py-8 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-[#6F7784]">
          No confirmed kills logged for this window.
        </div>
      ) : (
        <ul className="divide-y divide-white/[0.05]">
          {entries.map((k) => {
            const isMelee = k.distance === null || k.weapon.toLowerCase().includes('melee');
            const isSuicide = k.killerName === k.victimName;
            return (
              <li
                key={k.id}
                className="grid grid-cols-1 gap-2 px-5 py-3 transition-colors hover:bg-white/[0.02] sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
              >
                {/* Killer → Victim */}
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="truncate text-sm font-semibold uppercase tracking-[0.08em] text-[#E6E6E6]">
                    {k.killerName}
                  </span>

                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784]">
                    {isSuicide ? 'self-terminated with' : 'eliminated'}
                  </span>

                  {!isSuicide && (
                    <span className="truncate text-sm font-semibold uppercase tracking-[0.08em] text-[#D7B0B0]">
                      {k.victimName}
                    </span>
                  )}

                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784]">with</span>

                  <span className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-[#C29B40]">
                    {k.weapon}
                  </span>

                  {k.headshot && (
                    <span className="rounded-sm border border-[#9E3A3A]/40 bg-[#9E3A3A]/10 px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-[0.22em] text-[#D7B0B0]">
                      Headshot
                    </span>
                  )}
                  {isMelee && (
                    <span className="rounded-sm border border-white/15 bg-white/[0.04] px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-[0.22em] text-[#9CA3AF]">
                      Melee
                    </span>
                  )}
                </div>

                {/* Distance + age */}
                <div className="flex items-baseline gap-3 sm:justify-end">
                  <span className="font-mono text-sm font-semibold tabular-nums tracking-[0.06em] text-[#C29B40]">
                    {k.distance !== null ? `${k.distance.toFixed(1)} m` : '— m'}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784]">
                    {formatRelativeAge(k.ts, now)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
