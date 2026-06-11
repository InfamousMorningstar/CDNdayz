"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Clock, FileLock2, ShieldAlert } from 'lucide-react';
import {
  PvPScoreboard,
  PlayerStat,
  MarksmanshipPanel,
  SummaryStrip,
  KillFeed,
  KillFeedEntry,
  LongestShotInfo,
} from '@/components/pvp/PvPScoreboard';
import type { LeaderboardPeriod, PlayerAggregate, LongestShotRecord } from '@/types/pvp';

interface MarksmanRow {
  rank: number;
  playerId: string;
  playerName: string;
  distance: number;
  weapon: string;
  victim: string;
  ts: number;
}

interface StatsResponse {
  period: LeaderboardPeriod;
  generatedAt: number;
  eventCount: number;
  players: Array<PlayerAggregate & { rank: number }>;
  overall: {
    totalKills: number;
    playersOnline: number;
    longestShot: LongestShotRecord | null;
  };
  topMarksmen: MarksmanRow[];
  recentKills: KillFeedEntry[];
}

function aggregateToStat(p: PlayerAggregate & { rank: number }): PlayerStat {
  return {
    rank: p.rank,
    playerId: p.playerId,
    playerName: p.playerName,
    kills: p.kills,
    deaths: p.deaths,
    headshots: p.headshots,
    playtime: p.playtime,
    longestShot: p.longestShot,
    longestShotWeapon: p.longestShotWeapon,
    lastSeen: new Date(p.lastSeenTs).toLocaleString(),
    isOnline: p.isOnline,
  };
}

function splitZulu(ts: number): { date: string; hh: string; mm: string; ss: string } {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(d.getUTCDate());
  const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  const year = d.getUTCFullYear();
  return {
    date: `${day} ${month} ${year}`,
    hh: pad(d.getUTCHours()),
    mm: pad(d.getUTCMinutes()),
    ss: pad(d.getUTCSeconds()),
  };
}

export default function PvPScoreboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const [players, setPlayers] = useState<PlayerStat[]>([]);
  const [marksmen, setMarksmen] = useState<MarksmanRow[]>([]);
  const [record, setRecord] = useState<LongestShotInfo | null>(null);
  const [recentKills, setRecentKills] = useState<KillFeedEntry[]>([]);
  const [eventCount, setEventCount] = useState(0);
  const [totalKills, setTotalKills] = useState(0);
  const [playersOnline, setPlayersOnline] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLiveData, setHasLiveData] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<number | null>(null);

  const loadStats = useCallback(async (p: LeaderboardPeriod) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/pvp/stats?period=${p}&limit=50`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data: StatsResponse = await res.json();
      setEventCount(data.eventCount);
      setTotalKills(data.overall.totalKills);
      setPlayersOnline(data.overall.playersOnline);
      setRecord(data.overall.longestShot);
      setMarksmen(data.topMarksmen);
      setRecentKills(data.recentKills ?? []);
      setPlayers(data.players.map(aggregateToStat));
      setHasLiveData(data.players.length > 0);
      setGeneratedAt(data.generatedAt);
    } catch (err) {
      console.error('[pvp-scoreboard] stats fetch failed:', err);
      setPlayers([]);
      setMarksmen([]);
      setRecord(null);
      setRecentKills([]);
      setEventCount(0);
      setTotalKills(0);
      setPlayersOnline(0);
      setHasLiveData(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats(period);
  }, [period, loadStats]);

  const avgKD = useMemo(() => {
    if (players.length === 0) return '—';
    const sum = players.reduce((acc, p) => acc + (p.deaths === 0 ? p.kills : p.kills / p.deaths), 0);
    return (sum / players.length).toFixed(2);
  }, [players]);

  // Live ZULU clock — ticks once per second.
  const [nowTs, setNowTs] = useState<number | null>(null);
  useEffect(() => {
    setNowTs(Date.now());
    const id = window.setInterval(() => setNowTs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const zulu = nowTs !== null ? splitZulu(nowTs) : null;
  void generatedAt;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0E1116]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(194,155,64,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(158,58,58,0.08),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[length:100%_4px]" />

      <div className="container relative z-10 mx-auto px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        {/* Header dossier card */}
        <div className="mx-auto mb-10 max-w-6xl sm:mb-12">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#11161E]/88 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.38)] backdrop-blur-sm sm:p-10">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#C29B40]/35 bg-[#C29B40]/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#C29B40]">
                <FileLock2 className="h-3.5 w-3.5" />
                TOP SECRET // CDN EYES ONLY
              </div>
              <h1 className="text-3xl font-semibold uppercase tracking-[0.16em] text-[#E6E6E6] sm:text-4xl lg:text-5xl">
                Engagement Dossier
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9CA3AF] sm:text-base">
                Live engagement telemetry from the <span className="text-[#C29B40]">Takistan PvP</span> theatre — currently the only active CDN PvP deployment. Roster, marksmanship records, and operator activity are compiled below.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-3 w-3 text-[#9E3A3A]" />
                <span>Handling // Internal Distribution</span>
              </div>

              {/* Chronometer — inline, matches the row's typography */}
              <div className="flex items-center gap-2 text-[#6F7784]">
                <Clock className="h-3 w-3 text-[#C29B40]" />
                <span className="tabular-nums text-[#9CA3AF]">{zulu?.date ?? '——'}</span>
                <span className="text-[#3A4150]">//</span>
                <span className="flex items-baseline tabular-nums text-[#C29B40]">
                  <span>{zulu?.hh ?? '--'}</span>
                  <span>:</span>
                  <span>{zulu?.mm ?? '--'}</span>
                  <span>:</span>
                  <span>{zulu?.ss ?? '--'}</span>
                  <span className="ml-1 text-[#9E3A3A]">Z</span>
                </span>
              </div>

              <div className="sm:text-right">
                Source // Field Telemetry Pipeline
              </div>
            </div>
          </div>
        </div>

        <div className={`mx-auto max-w-6xl space-y-10 transition-opacity duration-300 ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
          {/* Summary */}
          <SummaryStrip
            totalKills={totalKills}
            playersOnline={playersOnline}
            avgKD={avgKD}
            eventCount={eventCount}
          />

          {/* Marksmanship */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C29B40]">Marksmanship Records</span>
              <div className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784]">Long Range Engagements</span>
            </div>
            <MarksmanshipPanel record={record} marksmen={marksmen} />
          </div>

          {/* Kill Feed */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C29B40]">Engagement Log</span>
              <div className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784]">Most Recent First</span>
            </div>
            <KillFeed entries={recentKills} />
          </div>

          {/* Roster */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C29B40]">Operator Roster</span>
              <div className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784]">Ranked by Confirmed Kills</span>
            </div>
            <PvPScoreboard
              players={players}
              period={period}
              onPeriodChange={setPeriod}
            />
          </div>

          {/* Footer note */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6F7784] sm:flex-row sm:items-center sm:justify-between">
              <span>
                {hasLiveData
                  ? `Live telemetry // ${eventCount.toLocaleString()} events on file`
                  : 'No telemetry recorded for this window'}
              </span>
              <span>Document subject to revision without notice.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
