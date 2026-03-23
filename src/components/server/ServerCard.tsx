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
    <Card className={`group flex flex-col h-full bg-neutral-900/40 backdrop-blur-sm border-neutral-800 transition-all duration-300 hover:bg-neutral-900/60 ${borderColor}`}>
      {/* Header Image */}
      <div className="h-40 w-full bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-300 group-hover:opacity-30" />
        
        {/* Map Background with Fallback */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${bgImage}'), url('/hero-placeholder.jpg')` }} 
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
            {isOnline && ping !== undefined && (
                <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-white/10 text-neutral-300">
                    <Signal className="w-3 h-3 mr-1" />
                    {ping}ms
                </Badge>
            )}
            <Badge 
                variant={badgeVariant} 
                className="shadow-lg backdrop-blur-md font-mono tracking-wider"
            >
                {status.toUpperCase()}
            </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors truncate">{name}</h3>
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <Map className="w-4 h-4 text-neutral-500" />
            <span>{map}</span>
          </div>
        </div>

        {/* Player Count Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm items-end">
            <div className="flex items-center gap-2 text-neutral-300 font-medium">
              <Users className="w-4 h-4 text-red-500" />
              <span>Players Online</span>
            </div>
            <span className="font-mono text-white text-lg leading-none">
                {players} <span className="text-neutral-600 text-sm">/ {maxPlayers}</span>
            </span>
          </div>
          
          <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden p-[1px]">
            <motion.div 
              className={`h-full rounded-full ${isOnline ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-neutral-700'}`}
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
