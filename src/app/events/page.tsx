import { Card } from '@/components/ui/Card';
import { Metadata } from 'next';
import { CalendarDays, Radio, ArrowRight, Radar, MapPin, Gem, Biohazard, ShieldAlert, TriangleAlert } from 'lucide-react';
import { CinematicBackground } from '@/components/features/CinematicBackground';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { DISCORD_INVITE_URL } from '@/lib/links';
import { Badge } from '@/components/ui/Badge';
import { events } from '@/data/mock';
import { DiscordLink } from '@/components/ui/DiscordLink';

export const metadata: Metadata = {
  title: 'Events Schedule | CDN',
  description: 'Participate in unique DayZ PvE events on the CDN network. View active and upcoming community events.',
};

export default function EventsPage() {
  const rifyEvent = events.find((event) => event.id === 'noob-chernarus-rify-search-seizure');

  return (
    <CinematicBackground backgroundImageSrc="/Images/3.jpg">
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        <div className="relative mb-12 sm:mb-20 text-center flex flex-col items-center">
          <Badge variant="outline" className="mb-6 border-amber-500/35 text-amber-700 dark:text-amber-400 bg-amber-500/12 dark:bg-amber-900/10 backdrop-blur-sm px-4 py-1">
            Live Operations
          </Badge>
          <div className="mb-6 inline-flex p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
             <Radio className="w-12 h-12 animate-pulse" />
          </div>
           <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Operations & <span className="text-red-500">Events</span></h1>
           <p className="text-gray-600 dark:text-neutral-400 max-w-2xl text-base sm:text-lg mb-8">
             Engage in server-wide operations, treasure hunts, and community challenges.
          </p>
          
           <Card className="max-w-5xl w-full p-0 overflow-hidden text-left border-stone-700/80 bg-[#0b0806]/95 shadow-[0_28px_90px_rgba(0,0,0,0.68)]">
             <div className="relative">
               <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_15%,rgba(239,68,68,0.2),transparent_35%),radial-gradient(circle_at_80%_78%,rgba(245,158,11,0.15),transparent_42%)]" />
               <div className="absolute inset-0 pointer-events-none opacity-20 [background-image:repeating-linear-gradient(to_bottom,rgba(120,113,108,0.2)_0_1px,transparent_1px_5px)]" />
               <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none bg-[repeating-linear-gradient(45deg,#f59e0b_0_12px,#1c1917_12px_24px)]" />

               <div className="relative grid lg:grid-cols-[1.25fr_0.75fr]">
                 <div className="p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-stone-700/70">
                   {rifyEvent ? (
                     <>
                       <div className="flex flex-wrap items-center gap-2 mb-4">
                         <span className="inline-flex items-center gap-2 rounded-full border border-red-700/60 bg-red-950/50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-red-300">
                           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Incident
                         </span>
                         <span className="inline-flex items-center rounded-full border border-stone-600/80 bg-stone-900/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-300">
                           Survivor Intel Board
                         </span>
                       </div>

                       <h2 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-[0.16em] text-stone-100 mb-2">
                         CDN Dispatch
                       </h2>
                       <p className="text-stone-400 text-xs sm:text-sm font-mono uppercase tracking-[0.24em] mb-6">
                         Sector: Noob Chernarus
                       </p>

                       <div className="mb-6 rounded-2xl border border-stone-700/80 bg-stone-950/65 p-5">
                         <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-stone-400 mb-2">Operation Codename</p>
                         <p className="text-xl sm:text-2xl font-bold text-stone-100 mb-3">{rifyEvent.title}</p>
                         <p className="text-stone-300 text-sm sm:text-base leading-relaxed">{rifyEvent.description}</p>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                         <div className="rounded-xl border border-amber-700/45 bg-amber-900/25 p-4">
                           <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-amber-300 mb-1">Map</p>
                           <p className="font-semibold text-stone-100 flex items-center gap-2"><Radar className="w-4 h-4 text-amber-400" /> Noob Chernarus</p>
                         </div>
                         <div className="rounded-xl border border-orange-700/45 bg-orange-900/25 p-4">
                           <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-orange-300 mb-1">Target Zone</p>
                           <p className="font-semibold text-stone-100 flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-400" /> Rify</p>
                         </div>
                         <div className="rounded-xl border border-red-700/50 bg-red-950/35 p-4">
                           <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-red-300 mb-1">Mode</p>
                           <p className="font-semibold text-stone-100">Search and Seizure</p>
                         </div>
                       </div>

                       <div className="mb-5 rounded-xl border border-lime-700/50 bg-lime-950/25 p-4">
                         <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-lime-300 flex items-center gap-2">
                           <Biohazard className="w-4 h-4" /> Contaminated Zone Advisory
                         </p>
                       </div>

                       <div className="flex flex-wrap gap-2">
                         <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700/50 bg-emerald-900/30 px-3 py-1.5 text-xs sm:text-sm text-emerald-200">
                           <Gem className="w-4 h-4" /> Ant Miner
                         </span>
                         <span className="inline-flex items-center gap-2 rounded-full border border-violet-700/50 bg-violet-900/30 px-3 py-1.5 text-xs sm:text-sm text-violet-200">
                           <Gem className="w-4 h-4" /> One-time Loot-saving Armbands
                         </span>
                       </div>
                     </>
                   ) : (
                     <>
                       <h2 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-[0.16em] text-stone-100 mb-3">
                         CDN Dispatch
                       </h2>
                       <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
                         Field operators are assembling the next mission board. New directives will be posted shortly.
                       </p>
                     </>
                   )}
                 </div>

                 <div className="p-6 sm:p-8 lg:p-10 bg-black/35">
                   <div className="mb-4 inline-flex items-center rounded border border-amber-700/50 bg-amber-950/35 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.24em] text-amber-300 animate-flicker-2">
                     <TriangleAlert className="w-3.5 h-3.5 mr-2" /> Extreme Risk Window
                   </div>

                   <div className="space-y-3 mb-6">
                     <div className="rounded-xl border border-amber-700/45 bg-amber-900/22 p-4">
                       <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-amber-300 mb-2 flex items-center gap-2">
                         <CalendarDays className="w-3.5 h-3.5" /> Schedule
                       </p>
                       <p className="text-stone-100 font-bold font-mono text-sm mb-3">{rifyEvent?.date ?? 'TBA'}</p>
                       <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-mono">
                         <span className="text-stone-400 uppercase tracking-[0.14em]">Mountain</span>
                         <span className="text-stone-200 font-semibold">14:00 MDT</span>
                         <span className="text-stone-400 uppercase tracking-[0.14em]">Central</span>
                         <span className="text-stone-200 font-semibold">15:00 CDT</span>
                         <span className="text-stone-400 uppercase tracking-[0.14em]">Eastern</span>
                         <span className="text-stone-200 font-semibold">16:00 EDT</span>
                         <span className="text-stone-400 uppercase tracking-[0.14em]">Pacific</span>
                         <span className="text-stone-200 font-semibold">13:00 PDT</span>
                       </div>
                     </div>
                     <div className="rounded-xl border border-stone-600/75 bg-stone-900/50 p-4">
                       <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-stone-400 mb-1">Mission Length</p>
                       <p className="text-stone-100 flex items-center gap-2 font-semibold">
                         <ShieldAlert className="w-4 h-4 text-stone-300" /> {rifyEvent?.duration ?? 'TBA'}
                       </p>
                     </div>
                   </div>

                   <div className="rounded-xl border border-red-800/55 bg-red-950/35 p-4 mb-6">
                     <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-red-300 mb-2">Survivor Note</p>
                     <p className="text-sm text-stone-300 leading-relaxed">
                       Rare loot is present in the zone. Enter light, extract fast, and avoid loitering near hotspots.
                     </p>
                   </div>

                   <div className="flex flex-col gap-3">
                     <Button asChild>
                       <DiscordLink href={DISCORD_INVITE_URL}>
                         Join Discord Alerts <ArrowRight className="ml-2 w-4 h-4" />
                       </DiscordLink>
                     </Button>
                     <Button variant="outline" asChild>
                       <Link href="/servers">View Live Servers</Link>
                     </Button>
                   </div>
                 </div>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </CinematicBackground>
  );
}
