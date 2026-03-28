"use client";

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Map, Users, Copy, Signal, Check, Calendar, Globe } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ServerRowProps {
  name: string;
  map: string;
  players: number;
  maxPlayers: number;
  status: 'online' | 'offline' | 'restarting' | 'maintenance';
  ping?: number;
  connect: string;
}

export function ServerRow({ name, map, players, maxPlayers, status, ping, connect }: ServerRowProps) {
  const [copied, setCopied] = useState(false);

  // Status Logic
  const isOnline = status === 'online';
  const isRestarting = status === 'restarting';
  const percentage = maxPlayers > 0 ? Math.min((players / maxPlayers) * 100, 100) : 0;
  
  // Visual Styles
  const statusColor = isOnline 
    ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' 
    : isRestarting 
      ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]' 
      : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]';

  const glowBorder = isOnline 
    ? 'group-hover:border-green-500/30' 
    : isRestarting 
      ? 'group-hover:border-amber-500/30' 
      : 'group-hover:border-red-500/30';

  const handleCopy = () => {
    if (!connect) return;
    navigator.clipboard.writeText(connect);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group relative flex flex-col md:flex-row items-center gap-6 p-5 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-md transition-all duration-300 hover:bg-neutral-900/60",
        glowBorder
      )}
    >
        {/* Animated Background Gradient on Hover */}
        <div className={cn(
            "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r via-transparent to-transparent",
            isOnline ? "from-green-500/5" : isRestarting ? "from-amber-500/5" : "from-red-500/5"
        )} />

        {/* Status Indicator Stripe */}
        <div className={cn(
            "absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all duration-300 group-hover:h-full group-hover:top-0 group-hover:bottom-0",
            statusColor.split(' ')[0] // Just the bg color
        )} />

        {/* Server Identity */}
        <div className="flex-1 min-w-0 flex flex-col items-center md:items-start text-center md:text-left pl-3 space-y-2">
            <div className="flex items-center gap-3">
                <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", statusColor, isOnline && "animate-pulse")} />
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                    {name.replace('CDN ', '')}
                </h3>
                {isRestarting && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
                        Restarting
                    </span>
                )}
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/5">
                    <Map className="w-3 h-3 text-neutral-500" />
                    <span>{map}</span>
                </div>
                {ping && (
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/5">
                       <Signal className={cn("w-3 h-3", ping < 60 ? "text-green-500" : ping < 150 ? "text-yellow-500" : "text-red-500")} />
                       <span>{ping}ms</span>
                   </div>
                )}
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/5">
                    <Globe className="w-3 h-3 text-neutral-500" />
                    <span>PvE</span>
                </div>
            </div>
        </div>

        {/* Population Stats */}
        <div className="w-full md:w-64 flex flex-col gap-2">
            <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> Survivors
                </span>
                <span className="font-mono text-sm text-white">
                    <span className={cn(
                        "font-bold",
                        percentage > 90 ? "text-red-500" : percentage > 50 ? "text-green-400" : "text-white"
                    )}>{players}</span>
                    <span className="text-neutral-600 mx-1">/</span>
                    <span className="text-neutral-500">{maxPlayers}</span>
                </span>
            </div>
            
            <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                 <div
                    className={cn(
                        "h-full relative transition-all duration-1000 ease-out",
                        isOnline ? "bg-gradient-to-r from-red-800 to-red-500" : "bg-neutral-800"
                    )}
                    style={{ width: `${percentage}%` }}
                 >
                    {isOnline && (
                         <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%,rgba(255,255,255,0.2)_100%)] bg-[length:10px_10px] opacity-30 animate-progress-stripes" />
                    )}
                 </div>
            </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
             <Button
                variant="outline"
                size="sm" 
                onClick={handleCopy}
                disabled={!isOnline}
                className={cn(
                    "min-w-[130px] h-10 border-white/10 hover:border-red-500/50 transition-all font-mono text-xs tracking-widest group/btn relative overflow-hidden",
                    copied ? "bg-green-500/10 text-green-400 border-green-500/50" : "bg-transparent hover:bg-red-950/20 text-neutral-300 hover:text-white"
                )}
             >
                 <span className="relative z-10 flex items-center gap-2">
                    {copied ? (
                         <>
                            <Check className="w-3.5 h-3.5" />
                            <span>COPIED</span>
                         </>
                    ) : (
                         <>
                            <Copy className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                            <span>COPY IP</span>
                         </>
                    )}
                 </span>
                 
                 {/* Shine Effect */}
                 {!copied && (
                    <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                 )}
             </Button>
        </div>

    </motion.div>
  );
}
