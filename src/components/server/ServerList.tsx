"use client";

import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import ServerCardTactical from '@/components/server/ServerCardTactical';
import { ServerStatus } from '@/lib/servers'; // Importing shared type
import { DISCORD_INVITE_URL } from '@/lib/links';
import { DiscordLink } from '@/components/ui/DiscordLink';
import { Badge } from '@/components/ui/Badge';

export function ServerList() {
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('cdn:favourite-servers');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setFavoriteIds(parsed.filter((item): item is string => typeof item === 'string'));
      }
    } catch {
      // Keep default favorites state when local storage is unavailable.
    }
  }, []);

  const toggleFavorite = (serverId: string) => {
    setFavoriteIds((current) => {
      const next = current.includes(serverId)
        ? current.filter((id) => id !== serverId)
        : [...current, serverId];

      try {
        window.localStorage.setItem('cdn:favourite-servers', JSON.stringify(next));
      } catch {
        // Ignore write failures (private mode / restricted browser environments).
      }

      return next;
    });
  };

  const summary = useMemo(() => {
    const online = servers.filter((server) => server.status === 'online');
    const restarting = servers.filter((server) => server.status === 'restarting').length;
    const offline = servers.filter((server) => server.status === 'offline').length;
    const totalPlayers = online.reduce((total, server) => total + server.players, 0);
    const mostPopulated = online.length > 0
      ? [...online].sort((a, b) => b.players - a.players)[0]
      : null;
    const easyStart = online.length > 0
      ? [...online]
          .filter((server) => server.maxPlayers > 0)
          .sort((a, b) => (a.players / a.maxPlayers) - (b.players / b.maxPlayers))[0]
      : null;

    return {
      onlineCount: online.length,
      restartingCount: restarting,
      offlineCount: offline,
      totalPlayers,
      mostPopulated,
      easyStart,
    };
  }, [servers]);

  const sortedServers = useMemo(() => {
    return [...servers].sort((a, b) => {
      const aFav = favoriteIds.includes(a.id) ? 1 : 0;
      const bFav = favoriteIds.includes(b.id) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav;
      if (a.status !== b.status) {
        if (a.status === 'online') return -1;
        if (b.status === 'online') return 1;
      }
      return b.players - a.players;
    });
  }, [servers, favoriteIds]);

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers');
      if (!response.ok) throw new Error('API Error');
      const data: ServerStatus[] = await response.json();
      const fetchedAt = response.headers.get('x-server-fetched-at');
      setServers(data);
      if (fetchedAt) {
        setLastUpdated(
          new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).format(new Date(Number(fetchedAt)))
        );
      }
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && servers.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 dark:bg-neutral-900/50 rounded-xl border border-gray-200 dark:border-neutral-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (error && servers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-neutral-900/40 rounded-xl border border-red-900/30 text-center w-full">
        <div className="text-red-500 mb-2 font-bold text-lg">Unable to load server status</div>
        <p className="text-gray-500 dark:text-neutral-400">Please check our <DiscordLink href={DISCORD_INVITE_URL} className="text-red-400 hover:underline">Discord</DiscordLink> for live updates.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-500/20 bg-emerald-100/80 dark:bg-emerald-500/10 p-3">
          <p className="text-[11px] uppercase tracking-widest text-emerald-800 dark:text-emerald-200/80">Online</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.onlineCount}</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
          <p className="text-[11px] uppercase tracking-widest text-amber-700 dark:text-amber-200/80">Restarting</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.restartingCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-black/25 p-3">
          <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-neutral-400">Offline</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.offlineCount}</p>
        </div>
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3">
          <p className="text-[11px] uppercase tracking-widest text-sky-700 dark:text-sky-100/80">Players Online</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalPlayers}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {summary.mostPopulated && (
          <Badge className="bg-red-500/12 dark:bg-red-500/20 text-red-700 dark:text-red-200 border border-red-500/35 hover:bg-red-500/20 dark:hover:bg-red-500/25">
            Most Populated Right Now: {summary.mostPopulated.name}
          </Badge>
        )}
        {summary.easyStart && (
          <Badge className="bg-cyan-500/12 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-100 border border-cyan-500/35 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/25">
            Low Population / Easy Start: {summary.easyStart.name}
          </Badge>
        )}
      </div>

      <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto ml-auto">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <div className="relative flex items-center justify-center w-3 h-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
          <span className="font-mono text-sm tracking-wider uppercase">Systems Operational</span>
        </div>
        <p className="text-gray-600 dark:text-neutral-500 text-sm font-mono">AUTO-REFRESH: 30s</p>
        {lastUpdated && (
          <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-gray-600 dark:text-neutral-500">
            Last status sweep {lastUpdated}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {sortedServers.map((server) => (
          <ServerCardTactical 
            key={server.id}
            serverId={server.id}
            name={server.name}
            map={server.map}
            players={server.players}
            maxPlayers={server.maxPlayers}
            status={server.status}
            ping={server.ping}
            connect={server.connect}
            isFavorite={favoriteIds.includes(server.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
