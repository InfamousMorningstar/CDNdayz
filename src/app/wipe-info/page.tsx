"use client";

import { CinematicBackground } from '@/components/features/CinematicBackground';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Flame, RefreshCw, Calendar, AlertTriangle, ArrowRight, Shield, Database } from 'lucide-react';
import Link from 'next/link';
import { DISCORD_INVITE_URL } from '@/lib/links';
import { useState, useEffect } from 'react';

interface WipeDates {
  nextWipeWindow: string;
  wipeCycleMonths: number;
  estimatedDaysUntilWipe: number;
  lastWipeDate: string;
  notes: string;
}

export default function WipeInfoPage() {
  const [wipeDates, setWipeDates] = useState<WipeDates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWipeDates = async () => {
      try {
        const response = await fetch('/api/wipe-dates');
        const data = await response.json();
        setWipeDates(data);
      } catch (error) {
        console.error('Failed to fetch wipe dates:', error);
        // Fall back to default values
        setWipeDates({
          nextWipeWindow: 'First Week of April 2026',
          wipeCycleMonths: 4,
          estimatedDaysUntilWipe: 120,
          lastWipeDate: '2025-12-15',
          notes: 'Subject to Change',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWipeDates();
  }, []);

  if (isLoading) {
    return (
      <CinematicBackground backgroundImageSrc="/Images/5.jpg">
        <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10 flex items-center justify-center">
          <div className="text-neutral-400">Loading wipe information...</div>
        </div>
      </CinematicBackground>
    );
  }

  if (!wipeDates) {
    return null;
  }

  // Parse the wipe window for display (e.g., "First Week of April 2026" -> parts for display)
  const wipeParts = wipeDates.nextWipeWindow.split(' ');
  const wipeDisplay = wipeParts.slice(0, -1).join(' '); // Remove year
  const wipeYear = wipeParts[wipeParts.length - 1];

  return (
    <CinematicBackground backgroundImageSrc="/Images/5.jpg">
            <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <Badge variant="outline" className="mb-4 border-red-500/30 text-red-400 bg-red-900/10 backdrop-blur-sm px-4 py-1">
            <Flame className="w-3 h-3 mr-2 fill-red-500" />
            Seasonal Reset Protocol
          </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Wipe <span className="text-red-500">Intelligence</span>
          </h1>
                    <p className="text-neutral-400 max-w-2xl text-base sm:text-lg font-sans">
            Understanding the lifecycle of our servers is key to your survival strategy. 
            Here is everything you need to know about map resets and progression.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">

            {/* Schedule / Status */}
            <Card className="p-5 sm:p-8 bg-neutral-900/60 border-neutral-800 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Database className="text-amber-500 w-6 h-6" />
                    Wipe Schedule
                </h2>
                
                <p className="text-neutral-300 mb-6">
                    Our 12 servers may not all wipe on the exact same day. Updates to mods (like Expansion or BBP) 
                    or major DayZ patches can sometimes trigger an early or delayed wipe for specific maps.
                </p>

                <div className="bg-neutral-950/50 p-6 rounded-xl border border-white/5 flex flex-col items-center text-center">
                    <span className="text-neutral-500 text-sm mb-2">Next Projected Wipe Window</span>
                    <span className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
                        {wipeDisplay} <span className="text-neutral-600">{wipeYear}</span>
                    </span>
                    <span className="text-xs text-red-500 uppercase tracking-widest font-bold bg-red-500/10 px-3 py-1 rounded-full">
                        {wipeDates.notes}
                    </span>
                    <p className="mt-4 text-xs text-neutral-500 max-w-lg">
                        Dates are estimates. Always check the <span className="text-white">#announcements</span> channel 
                        in Discord for the official 1-week warning.
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                            <Button variant="outline" asChild>
                                <Link href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
                           Check Discord for Live Updates <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                     </Button>
                </div>
            </Card>
            
            {/* The Cycle Card */}
            <Card className="p-5 sm:p-8 bg-neutral-900/60 border-neutral-800 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <RefreshCw size={120} />
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <Calendar className="text-red-500 w-8 h-8" />
                        The {wipeDates.wipeCycleMonths}-Month Cycle
                    </h2>
                    <div className="space-y-6 text-lg text-neutral-300 leading-relaxed">
                        <p>
                            To ensure server stability, introduce new content, and keep the economy fresh, 
                            all CDN servers undergo a full wipe approximately <strong className="text-white">every {wipeDates.wipeCycleMonths} months</strong>.
                        </p>
                        <p>
                            A wipe is a complete reset of the world. It clears all player bases, vehicles, stashed loot, 
                            and character data. It is the great equalizer, giving every survivor a fresh start.
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-neutral-950/50 p-4 rounded border border-white/5">
                            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-1">Current Frequency</span>
                            <span className="text-xl font-bold text-white">~{wipeDates.estimatedDaysUntilWipe} Days</span>
                        </div>
                        <div className="bg-neutral-950/50 p-4 rounded border border-white/5">
                            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-1">Impact</span>
                            <span className="text-xl font-bold text-red-400">Total Map Reset</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Rollover Policy */}
            <Card className="p-5 sm:p-8 bg-neutral-900/60 border-neutral-800 backdrop-blur-md relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
                 
                 <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Shield className="text-emerald-500 w-6 h-6" />
                    Donation Protection
                </h2>

                <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-xl mb-6">
                    <h3 className="text-xl font-bold text-emerald-400 mb-2">The 30-Day Safe Zone</h3>
                    <p className="text-neutral-300">
                        We value your support. If you donate for gear, bases, or vehicles within the 
                        <span className="text-white font-bold"> last month (30 days) before a scheduled wipe</span>, 
                        your items are safe.
                    </p>
                </div>

                <div className="space-y-4 text-neutral-300 text-sm">
                    <p>
                        <strong className="text-white">How it works:</strong>
                        <br />
                        Once the new season starts (post-wipe), simply open a ticket in our Discord. 
                        Our staff will verify your donation date and restore your purchased perks on the fresh server.
                    </p>
                    <p className="italic text-neutral-500">
                        Note: This applies to "permanent" store items like Custom Bases and Priority Queue. 
                        Consumables that were already used may not be eligible.
                    </p>
                </div>
            </Card>

        </div>
      </div>
    </CinematicBackground>
  );
}