"use client";

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Event } from '@/data/mock';
import { Calendar, Gift, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isUpcoming = event.status === 'upcoming';
  const isActive = event.status === 'active';

  return (
    <Card className={cn(
        "group relative overflow-hidden transition-all duration-300",
        isActive ? "border-red-500/50 bg-red-950/10 shadow-[0_0_30px_rgba(220,38,38,0.1)]" : "border-neutral-800 bg-neutral-900/40"
    )}>
      <div className="absolute top-0 right-0 p-4 z-10">
        <Badge variant={isActive ? 'success' : 'secondary'}>
          {event.status.toUpperCase()}
        </Badge>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col h-full relative z-20">
        <div className="mb-4">
           <span className="text-xs font-mono text-red-500 uppercase tracking-widest mb-2 block">{event.type}</span>
           <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">{event.title}</h3>
        </div>
        
        <div className="flex flex-col gap-3 mb-6 text-sm text-neutral-400">
           <div className="flex items-center gap-2">
             <Calendar size={16} className="text-neutral-500" />
             <span>{event.date}</span>
           </div>
           
           <p className="line-clamp-3 leading-relaxed">
             {event.description}
           </p>
        </div>

        {event.rewards && (
            <div className="mt-auto pt-4 border-t border-white/5">
                <div className="flex items-start gap-2 text-sm text-neutral-300">
                    <Gift size={16} className="text-amber-400 mt-0.5" />
                    <span className="font-medium text-amber-400/90">Rewards: {event.rewards}</span>
                </div>
            </div>
        )}
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors" />
    </Card>
  );
}
