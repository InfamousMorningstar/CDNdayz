import { Copy, Signal, Users } from 'lucide-react';
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

export function ServerMiniCard({ name, map, players, maxPlayers, status, ping, connect }: ServerMiniCardProps) {
  const [copied, setCopied] = useState(false);
  const isOnline = status === 'online';

  const handleCopy = () => {
    navigator.clipboard.writeText(connect);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "relative flex flex-col items-start justify-between bg-neutral-900/70 border border-white/10 rounded-xl p-3 sm:p-4 w-full min-w-0 shadow-md hover:shadow-lg transition-all duration-200 group",
      !isOnline && "opacity-60 grayscale"
    )}>
      <div className="flex items-center gap-2 mb-2 w-full">
        <span className={cn(
          "w-2 h-2 rounded-full",
          isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
        )} />
        <span className="font-bold text-base text-white truncate min-w-0" title={name}>{name.replace('CDN ', '')}</span>
        <span className="ml-auto shrink-0 text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-widest">
          {map}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2 flex-wrap">
        <Signal className={cn("w-3 h-3", ping && ping < 100 ? "text-green-400" : "text-yellow-400")} />
        <span>{ping ?? '--'}ms</span>
        <Users className="w-3 h-3 ml-4" />
        <span>Survivors {players}/{maxPlayers}</span>
      </div>
      <div className="flex items-center gap-2 mt-2 w-full">
        <span className="text-xs font-mono text-neutral-400 bg-white/5 rounded px-2 py-1 min-w-0 flex-1 truncate sm:whitespace-normal sm:break-all">{connect}</span>
        <button
          onClick={handleCopy}
          aria-label={`Copy connect address for ${name}`}
          className={cn(
            "ml-auto h-9 px-3 rounded text-xs font-mono uppercase tracking-wider transition-colors border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80 shrink-0",
            copied
              ? "bg-green-500/20 border-green-500/40 text-green-400"
              : "text-neutral-300 hover:bg-white/10"
          )}
          title="Copy IP"
        >
          {copied ? 'Copied' : 'Copy IP'}
        </button>
      </div>
    </div>
  );
}
