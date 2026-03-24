"use client";

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Map, Users, Copy, Activity, Signal } from 'lucide-react';
import { useState } from 'react';

interface ServerRowProps {
  name: string;
  map: string;
  players: number;
  maxPlayers: number;
  status: 'online' | 'offline' | 'restarting' | 'maintenance';
  ping?: number;
  connect?: string;
}

export function ServerRow({ name, map, players, maxPlayers, status, ping, connect }: ServerRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!connect) return;
    navigator.clipboard.writeText(connect);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const percentage = maxPlayers > 0 ? Math.min((players / maxPlayers) * 100, 100) : 0;
  const isOnline = status === 'online';
  
  // Status colors
  const statusColor = isOnline ? 'bg-green-500' : 'bg-red-500';
  const glowColor = isOnline ? 'shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'shadow-[0_0_10px_rgba(239,68,68,0.3)]';

  return (
    <div className="group relative overflow-hidden rounded-lg bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 p-4 flex flex-col md:flex-row md:items-center gap-4">
       
       {/* Status Indicator Strip */}
       <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusColor} ${glowColor}`} />

       {/* Info Section */}
       <div className="flex-1 pl-3">
          <div className="flex items-center gap-3 mb-1">
             <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors">{name}</h3>
             {isOnline ? (
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-mono text-green-400 uppercase tracking-wider">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    Online
                </div>
             ) : (
                <Badge variant="destructive" className="h-5 text-[10px] px-2 uppercase">OFFLINE</Badge>
             )}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
             <Map className="w-3.5 h-3.5" />
             <span>{map}</span>
          </div>
       </div>

       {/* Survivors Section */}
       <div className="w-full md:w-48 flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium">
             <span className="text-neutral-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Survivors
             </span>
             <span className="text-white font-mono">{players} <span className="text-neutral-600">/ {maxPlayers}</span></span>
          </div>
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
             <motion.div 
                className={`h-full rounded-full ${isOnline ? 'bg-red-600' : 'bg-neutral-700'}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
             />
          </div>
       </div>

       {/* Action Section */}
       <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/5 md:pl-4 md:border-l md:border-white/5">
          {connect && (
            <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopy}
                disabled={!isOnline}
                className={`w-full md:w-auto text-xs h-9 min-w-[100px] ${copied ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'hover:bg-white/5'}`}
            >
                {copied ? 'COPIED IP' : 'JOIN SERVER'}
                {!copied && <Copy className="ml-2 w-3 h-3 opacity-70" />}
            </Button>
          )}
       </div>
    </div>
  );
}
