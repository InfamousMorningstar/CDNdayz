import { Signal, Users } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ServerMiniCardProps {
  name: string;
  map: string;
  players: number;
  maxPlayers: number;
  status: 'online' | 'offline' | 'restarting' | 'maintenance';
  ping?: number;
  connect: string;
}

interface Theme {
  bg: string;
  border: string;
  hoverShadow: string;
  topGlow: string;
  badge: string;
  accent: string;
  copyHover: string;
  focusRing: string;
}

function getTheme(name: string, map: string): Theme {
  const n = name.toLowerCase();
  const m = map.toLowerCase();

  // Arctic / cold maps
  if (m.includes('sakhal') || m.includes('namalsk') || n.includes('snow')) {
    return {
      bg: 'bg-sky-50/90 dark:bg-sky-950/70',
      border: 'border-sky-300/50 dark:border-sky-500/25',
      hoverShadow: 'hover:shadow-sky-400/15 dark:hover:shadow-sky-500/15 hover:border-sky-400/60 dark:hover:border-sky-400/50',
      topGlow: 'from-sky-400/10',
      badge: 'bg-sky-100 dark:bg-sky-500/10 border-sky-300/50 dark:border-sky-400/25 text-sky-700 dark:text-sky-300',
      accent: 'text-sky-600 dark:text-sky-300',
      copyHover: 'hover:bg-sky-100 dark:hover:bg-sky-500/15 hover:border-sky-400/40 hover:text-sky-700 dark:hover:text-sky-300',
      focusRing: 'focus-visible:ring-sky-400/60',
    };
  }

  // Hardcore servers
  if (n.includes('hardcore')) {
    return {
      bg: 'bg-red-50/90 dark:bg-red-950/70',
      border: 'border-red-300/50 dark:border-red-500/25',
      hoverShadow: 'hover:shadow-red-400/15 dark:hover:shadow-red-500/15 hover:border-red-400/60 dark:hover:border-red-400/50',
      topGlow: 'from-red-500/10',
      badge: 'bg-red-100 dark:bg-red-500/10 border-red-300/50 dark:border-red-400/25 text-red-700 dark:text-red-300',
      accent: 'text-red-600 dark:text-red-300',
      copyHover: 'hover:bg-red-100 dark:hover:bg-red-500/15 hover:border-red-400/40 hover:text-red-700 dark:hover:text-red-300',
      focusRing: 'focus-visible:ring-red-400/60',
    };
  }

  // Walking Dead / Hashima — dark industrial undead
  if (m.includes('hashima') || n.includes('walking dead')) {
    return {
      bg: 'bg-purple-50/90 dark:bg-purple-950/70',
      border: 'border-purple-300/50 dark:border-purple-500/25',
      hoverShadow: 'hover:shadow-purple-400/15 dark:hover:shadow-purple-500/15 hover:border-purple-400/60 dark:hover:border-purple-400/50',
      topGlow: 'from-purple-500/10',
      badge: 'bg-purple-100 dark:bg-purple-500/10 border-purple-300/50 dark:border-purple-400/25 text-purple-700 dark:text-purple-300',
      accent: 'text-purple-600 dark:text-purple-300',
      copyHover: 'hover:bg-purple-100 dark:hover:bg-purple-500/15 hover:border-purple-400/40 hover:text-purple-700 dark:hover:text-purple-300',
      focusRing: 'focus-visible:ring-purple-400/60',
    };
  }

  // SciFi servers
  if (n.includes('scifi') || n.includes('sci-fi')) {
    return {
      bg: 'bg-violet-50/90 dark:bg-violet-950/70',
      border: 'border-violet-300/50 dark:border-violet-500/25',
      hoverShadow: 'hover:shadow-violet-400/15 dark:hover:shadow-violet-500/15 hover:border-violet-400/60 dark:hover:border-violet-400/50',
      topGlow: 'from-violet-500/10',
      badge: 'bg-violet-100 dark:bg-violet-500/10 border-violet-300/50 dark:border-violet-400/25 text-violet-700 dark:text-violet-300',
      accent: 'text-violet-600 dark:text-violet-300',
      copyHover: 'hover:bg-violet-100 dark:hover:bg-violet-500/15 hover:border-violet-400/40 hover:text-violet-700 dark:hover:text-violet-300',
      focusRing: 'focus-visible:ring-violet-400/60',
    };
  }

  // Deer Isle — coastal / ocean
  if (m.includes('deer isle')) {
    return {
      bg: 'bg-blue-50/90 dark:bg-blue-950/70',
      border: 'border-blue-300/50 dark:border-blue-500/25',
      hoverShadow: 'hover:shadow-blue-400/15 dark:hover:shadow-blue-500/15 hover:border-blue-400/60 dark:hover:border-blue-400/50',
      topGlow: 'from-blue-500/10',
      badge: 'bg-blue-100 dark:bg-blue-500/10 border-blue-300/50 dark:border-blue-400/25 text-blue-700 dark:text-blue-300',
      accent: 'text-blue-600 dark:text-blue-300',
      copyHover: 'hover:bg-blue-100 dark:hover:bg-blue-500/15 hover:border-blue-400/40 hover:text-blue-700 dark:hover:text-blue-300',
      focusRing: 'focus-visible:ring-blue-400/60',
    };
  }

  // Bitterroot — rugged / amber
  if (m.includes('bitterroot')) {
    return {
      bg: 'bg-amber-50/90 dark:bg-amber-950/70',
      border: 'border-amber-300/50 dark:border-amber-500/25',
      hoverShadow: 'hover:shadow-amber-400/15 dark:hover:shadow-amber-500/15 hover:border-amber-400/60 dark:hover:border-amber-400/50',
      topGlow: 'from-amber-500/10',
      badge: 'bg-amber-100 dark:bg-amber-500/10 border-amber-300/50 dark:border-amber-400/25 text-amber-700 dark:text-amber-300',
      accent: 'text-amber-600 dark:text-amber-300',
      copyHover: 'hover:bg-amber-100 dark:hover:bg-amber-500/15 hover:border-amber-400/40 hover:text-amber-700 dark:hover:text-amber-300',
      focusRing: 'focus-visible:ring-amber-400/60',
    };
  }

  // Noob Friendly — welcoming emerald
  if (n.includes('noob')) {
    return {
      bg: 'bg-emerald-50/90 dark:bg-emerald-950/70',
      border: 'border-emerald-300/50 dark:border-emerald-500/25',
      hoverShadow: 'hover:shadow-emerald-400/15 dark:hover:shadow-emerald-500/15 hover:border-emerald-400/60 dark:hover:border-emerald-400/50',
      topGlow: 'from-emerald-500/10',
      badge: 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300/50 dark:border-emerald-400/25 text-emerald-700 dark:text-emerald-300',
      accent: 'text-emerald-600 dark:text-emerald-300',
      copyHover: 'hover:bg-emerald-100 dark:hover:bg-emerald-500/15 hover:border-emerald-400/40 hover:text-emerald-700 dark:hover:text-emerald-300',
      focusRing: 'focus-visible:ring-emerald-400/60',
    };
  }

  // Chernarus / Livonia — military teal/green
  if (m.includes('chernarus') || m.includes('livonia')) {
    return {
      bg: 'bg-teal-50/90 dark:bg-teal-950/70',
      border: 'border-teal-300/50 dark:border-teal-500/25',
      hoverShadow: 'hover:shadow-teal-400/15 dark:hover:shadow-teal-500/15 hover:border-teal-400/60 dark:hover:border-teal-400/50',
      topGlow: 'from-teal-500/10',
      badge: 'bg-teal-100 dark:bg-teal-500/10 border-teal-300/50 dark:border-teal-400/25 text-teal-700 dark:text-teal-300',
      accent: 'text-teal-600 dark:text-teal-300',
      copyHover: 'hover:bg-teal-100 dark:hover:bg-teal-500/15 hover:border-teal-400/40 hover:text-teal-700 dark:hover:text-teal-300',
      focusRing: 'focus-visible:ring-teal-400/60',
    };
  }

  // Banov / default — cyan
  return {
    bg: 'bg-cyan-50/90 dark:bg-cyan-950/70',
    border: 'border-cyan-300/50 dark:border-cyan-500/25',
    hoverShadow: 'hover:shadow-cyan-400/15 dark:hover:shadow-cyan-500/15 hover:border-cyan-400/60 dark:hover:border-cyan-400/50',
    topGlow: 'from-cyan-500/10',
    badge: 'bg-cyan-100 dark:bg-cyan-500/10 border-cyan-300/50 dark:border-cyan-400/25 text-cyan-700 dark:text-cyan-300',
    accent: 'text-cyan-600 dark:text-cyan-300',
    copyHover: 'hover:bg-cyan-100 dark:hover:bg-cyan-500/15 hover:border-cyan-400/40 hover:text-cyan-700 dark:hover:text-cyan-300',
    focusRing: 'focus-visible:ring-cyan-400/60',
  };
}

export function ServerMiniCard({ name, map, players, maxPlayers, status, ping, connect }: ServerMiniCardProps) {
  const [copied, setCopied] = useState(false);
  const isOnline = status === 'online';
  const statusText = status === 'restarting' ? 'Restarting' : isOnline ? 'Online' : 'Offline';
  const theme = getTheme(name, map);

  const handleCopy = () => {
    navigator.clipboard.writeText(connect);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "relative flex flex-col items-start justify-between rounded-xl p-4 sm:p-4 w-full min-w-0 border shadow-md transition-all duration-300 group overflow-hidden",
      theme.bg,
      theme.border,
      theme.hoverShadow,
      !isOnline && "opacity-50 grayscale"
    )}>
      {/* Subtle top-edge glow */}
      <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent")} />
      <div className={cn("absolute inset-x-0 top-0 h-16 bg-gradient-to-b to-transparent opacity-60 pointer-events-none", theme.topGlow)} />

      {/* Name + map badge */}
      <div className="relative flex flex-col gap-1.5 mb-3.5 w-full">
        <div className="flex items-center gap-2">
          <span className={cn(
            "w-2 h-2 rounded-full shrink-0",
            isOnline ? "bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.7)]" : "bg-red-500"
          )} />
          <span className="font-semibold text-sm text-gray-900 dark:text-white whitespace-normal break-words leading-snug min-w-0" title={name}>
            {name.replace('CDN ', '')}
          </span>
        </div>
        <span className={cn("self-start text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-widest", theme.badge)}>
          {map}
        </span>
        <span className={cn(
          "self-start text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-widest",
          isOnline ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-200' : 'border-gray-300 dark:border-white/15 bg-gray-100 dark:bg-black/25 text-gray-500 dark:text-neutral-300'
        )}>
          {statusText}
        </span>
      </div>

      {/* Stats row */}
      <div className="relative flex items-center gap-2.5 text-xs text-gray-500 dark:text-neutral-400 mb-3.5 flex-wrap">
        <Signal className={cn("w-3 h-3", ping && ping < 100 ? "text-green-400" : "text-yellow-400")} />
        <span className={cn(ping && ping < 100 ? "text-green-400" : "text-yellow-400")}>{ping ?? '--'}ms</span>
        <Users className={cn("w-3 h-3 ml-3", theme.accent)} />
        <span className="text-gray-700 dark:text-neutral-300">{players}<span className="text-gray-400 dark:text-neutral-600">/{maxPlayers}</span></span>
      </div>

      {/* Connect row */}
      <div className="relative flex items-center gap-2 w-full">
        <span className="text-xs font-mono text-gray-500 dark:text-neutral-400 bg-gray-100/80 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-md px-2.5 py-2 min-w-0 flex-1 truncate">
          {connect}
        </span>
        <button
          onClick={handleCopy}
          aria-label={`Copy connect address for ${name}`}
          className={cn(
            "shrink-0 min-h-10 px-4 rounded-full text-xs font-mono tracking-wider transition-all duration-200 border border-gray-200 dark:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
            theme.focusRing,
            copied
              ? "bg-green-500/20 border-green-400/40 text-green-600 dark:text-green-400"
              : cn("text-gray-500 dark:text-neutral-400", theme.copyHover)
          )}
        >
          {copied ? 'Copied' : 'Copy IP'}
        </button>
      </div>
    </div>
  );
}
