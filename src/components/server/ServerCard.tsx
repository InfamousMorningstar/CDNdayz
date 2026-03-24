"use client";

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Map, Users, Copy, Activity, Signal } from 'lucide-react';
import { useState } from 'react';

// Define the exact props needed for the server card
interface ServerCardProps {
  name: string;
  map: string;
  players: number;
  maxPlayers: number;
  status: 'online' | 'offline' | 'restarting' | 'maintenance';
  ping?: number;
  connect?: string;
}

export function ServerCard({ name, map, players, maxPlayers, status, ping, connect }: ServerCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!connect) return;
    navigator.clipboard.writeText(connect);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const percentage = maxPlayers > 0 ? Math.min((players / maxPlayers) * 100, 100) : 0;
  
  const isOnline = status === 'online';
  const isMaintenance = status === 'maintenance';
  const isRestarting = status === 'restarting';

  // Dynamic styles based on status
  let borderColor = "group-hover:border-red-500/30";
  if (isOnline) borderColor = "group-hover:border-green-500/30";
  if (isMaintenance) borderColor = "group-hover:border-amber-500/30";
  
  // badge variant mapping
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = 'destructive';
  if (isOnline) badgeVariant = 'success';
  if (isRestarting) badgeVariant = 'warning';
  if (isMaintenance) badgeVariant = 'secondary';
  
  // Map image handling
  // Fallback to a generic placeholder if map name isn't matched
  const mapSlug = map.toLowerCase().replace(/\s+/g, '-');
  const bgImage = `/maps/${mapSlug}.jpg`;

  return (
    <Card className={`group flex flex-col h-full bg-neutral-900/60 backdrop-blur-sm border-neutral-800 transition-all duration-300 hover:bg-neutral-900/80 hover:border-red-900/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] ${borderColor}`}>
      {/* Header Image */}
      <div className="h-40 w-full bg-neutral-950 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-black/50 z-10 transition-opacity duration-300 group-hover:opacity-30 mix-blend-multiply" />
        
        {/* Map Background with Fallback */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
          style={{ backgroundImage: `url('${bgImage}'), url('/hero-placeholder.jpg')` }} 
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
            <Badge 
                variant={badgeVariant} 
                className="shadow-lg backdrop-blur-md font-mono tracking-widest text-xs uppercase border border-white/10"
            >
                {status}
            </Badge>
            {isOnline && ping !== undefined && (
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/5 text-[10px] font-mono text-neutral-400">
                    <Signal className={`w-3 h-3 ${ping < 100 ? "text-green-500" : "text-amber-500"}`} />
                    {ping}ms
                </div>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col gap-6 relative">
        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/5 group-hover:border-red-500/30 transition-colors" />

        <div className="relative">
          <h3 className="text-2xl font-heading text-white mb-1 group-hover:text-red-500 transition-colors truncate tracking-wide">{name}</h3>
          <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-widest font-sans font-bold">
            <Map className="w-3 h-3 mb-0.5" />
            <span>{map}</span>
          </div>
        </div>

        {/* Player Count Bar - Sector usage */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs items-end font-mono">
            <div className="flex items-center gap-2 text-neutral-400 font-medium uppercase tracking-wider">
              <Users className="w-3 h-3 text-red-500" />
              <span>Survivors</span>
            </div>
            <span className="text-white text-base leading-none">
                {players}<span className="text-neutral-600 text-xs px-1">/</span>{maxPlayers}
            </span>
          </div>
          
          <div className="h-2 w-full bg-black/60 rounded-sm overflow-hidden border border-white/5">
            <motion.div 
              className={`h-full ${isOnline ? 'bg-red-600' : 'bg-neutral-800'}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Footer / Connect */}
        <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
            <div className={`flex items-center gap-2 text-xs font-mono tracking-wider ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
              <Activity className="w-3 h-3" />
              {isOnline ? 'SYSTEM OPERATIONAL' : 'SYSTEM OFFLINE'}
            </div>

            {connect && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs hover:bg-white/5 text-neutral-400 hover:text-white gap-2 transition-colors"
                onClick={handleCopy}
                disabled={!isOnline}
              >
                {copied ? "COPIED!" : "COPY IP"}
                <Copy className="w-3 h-3" />
              </Button>
            )}
        </div>
      </div>
    </Card>
  );
}
