import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Store, 
  ShieldCheck, 
  AlertTriangle, 
  Hammer, 
  ArrowLeft 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Building Rules | CDN',
  description: 'Detailed base building regulations, distances, and guidelines for the CDN DayZ PvE Network.',
};

export default function BuildingRulesPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
      <div className="mb-12">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-4 text-neutral-400 hover:text-white">
          <Link href="/rules">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to General Rules
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Building <span className="text-red-500">Protocol</span></h1>
            <p className="text-neutral-400 max-w-2xl text-lg">
              Strict construction guidelines to ensure server stability and fair play. 
              Violation of these zones may result in base deletion.
            </p>
          </div>
          
          <Badge variant="outline" className="h-fit py-2 px-4 border-red-500/30 text-red-400 bg-red-500/5">
            Updated: March 2026
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* District Zones */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Exclusion Zones</h2>
            </div>
            
            <Card className="p-6 bg-neutral-900/40 border-neutral-800 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Military Distances
                </h3>
                <ul className="space-y-3 pl-4 border-l border-white/5 ml-1">
                  <li className="text-neutral-300 text-sm">
                    <strong className="text-red-400">1000m radius</strong> from any Larger Military areas (2+ buildings or large tents).
                  </li>
                  <li className="text-neutral-300 text-sm">
                    <strong className="text-red-400">500m radius</strong> from Smaller Military areas (2 or fewer tents).
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Trader Distances
                </h3>
                <ul className="space-y-3 pl-4 border-l border-white/5 ml-1">
                  <li className="text-neutral-300 text-sm">
                    <strong className="text-red-400">1000m radius</strong> from any Trader.
                  </li>
                  <li className="text-neutral-300 text-sm">
                    <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-white mr-2">Namalsk Only</span>
                    <strong className="text-red-400">500m radius</strong> from any trader.
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded text-sm text-amber-200/80 flex gap-2">
                   <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                   <p>Note: Some maps can make this difficult. If your territory sits ~30m within that 1000m, you should be good. Do your best to stick to the 1000m radius.</p>
                </div>
              </div>
            </Card>
          </section>

          <section>
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Bunkers</h2>
            </div>
            
            <Card className="p-6 bg-neutral-900/40 border-neutral-800">
              <p className="text-neutral-400 mb-6">
                Bunkers can be purchased from the Supplies Trader. <span className="text-white font-medium">You will need 2 flags when using a bunker.</span>
              </p>
              
              <ol className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                <li className="pl-8 relative">
                   <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">1</span>
                   <p className="text-neutral-300 text-sm">
                     Place your <strong className="text-white">Main flag</strong> and make a territory, then you can place your bunker down.
                   </p>
                </li>
                <li className="pl-8 relative">
                   <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">2</span>
                   <p className="text-neutral-300 text-sm">
                     Ensure the bunker is placed on <strong className="text-white">solid ground</strong> or a ground floor to avoid falling under the structure when exiting.
                   </p>
                </li>
                 <li className="pl-8 relative">
                   <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">3</span>
                   <p className="text-neutral-300 text-sm">
                     Put a <strong className="text-white">Code Lock</strong> on the entrance immediately.
                   </p>
                </li>
                <li className="pl-8 relative">
                   <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">4</span>
                   <p className="text-neutral-300 text-sm">
                     Once inside, place down the <strong className="text-white">second flag</strong> and make a territory.
                     <br />
                     <span className="text-neutral-500 italic text-xs block mt-1">Tip: Use the same name as your main territory with a 1 or 2 added at the end.</span>
                   </p>
                </li>
              </ol>
            </Card>
          </section>
        </div>

        {/* General Guidelines */}
        <div className="space-y-8">
           <section className="h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <Building2 size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">General Guidelines</h2>
            </div>
            
            <Card className="p-8 bg-neutral-900/40 border-neutral-800 h-fit space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <div className="space-y-4">
                 <h3 className="text-white font-bold text-lg border-b border-white/5 pb-2">Clutter & Optimization</h3>
                 <div className="space-y-4 text-neutral-300 text-sm leading-relaxed">
                   <p>
                     Please only place items like tents etc that you are actively using. We ask this to avoid too much clutter on the server.
                   </p>
                   <p>
                     Keep the hoarding of gear, weapons and all of the things down to a minimum. Again this is to avoid clutter on the server which in turn helps with server lag.
                   </p>
                 </div>
              </div>

               <div className="space-y-4">
                 <h3 className="text-white font-bold text-lg border-b border-white/5 pb-2">Public Access & Griefing</h3>
                 <div className="space-y-4 text-neutral-300 text-sm leading-relaxed">
                   <p>
                     <strong className="text-rose-400">Do not block</strong> other players, player bases or any public access points/monuments.
                   </p>
                   <p>
                     Griefing is frowned upon. Basically, <span className="italic text-white">if it isn’t your base, do not obstruct it.</span>
                   </p>
                 </div>
              </div>

              <div className="p-4 rounded bg-neutral-950/50 border border-white/5 space-y-3">
                 <h4 className="text-red-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                   <Store size={14} /> Premade Bases
                 </h4>
                 <p className="text-neutral-400 text-xs leading-relaxed">
                   You may come across slightly larger, sometimes fancier “premade” bases, which have not been occupied/claimed. 
                   <strong className="text-white block mt-1">Do not move into them.</strong>
                   These are Donation bases and may already be pre-claimed.
                 </p>
                 <Button variant="link" className="px-0 text-red-500 h-auto text-xs">
                   Make a ticket in #support to inquire with staff &rarr;
                 </Button>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
