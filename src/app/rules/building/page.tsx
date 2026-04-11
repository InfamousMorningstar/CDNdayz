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
    <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6">
      <div className="mb-12">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-4 text-neutral-400 hover:text-white">
          <Link href="/rules">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to General Rules
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">Building <span className="text-red-500">Protocol</span></h1>
            <p className="text-neutral-400 max-w-2xl text-base sm:text-lg">
              Strict construction guidelines to ensure server stability and fair play. 
              Violation of these zones may result in base deletion.
            </p>
            <div className="mt-4">
               <Link href="/features" className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 transition-colors underline decoration-red-500/30 underline-offset-4">
                 Check which building system applies to your server &rarr;
               </Link>
            </div>
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
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  AI Missions
                </h3>
                <ul className="space-y-3 pl-4 border-l border-white/5 ml-1">
                  <li className="text-neutral-300 text-sm">
                    <strong className="text-red-400">500m radius</strong> from any AI Mission.
                  </li>
                  <li className="text-neutral-400 text-xs italic">
                    We have seen too many bases being built on top of or too close to the missions, which then cause problems for other players trying to do said mission.
                  </li>
                </ul>
              </div>

              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded text-sm text-amber-200/80 flex gap-2">
                 <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                 <p>Note: Some maps can make this difficult. If your territory sits ~30m within that 1000m, you should be good. Do your best to stick to the 1000m radius.</p>
              </div>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Territory Setup</h2>
            </div>

            <Card className="p-6 bg-neutral-900/40 border-neutral-800">
              <div className="rounded border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100/90 flex gap-3">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-blue-300" />
                <p>
                  To create a territory, place a <strong className="text-white">Flag Kit</strong>. On some maps it is sold at the Trader, and on others you can craft one with <strong className="text-white">3 short sticks and rope</strong>. If you place your territory and want to move it, press <strong className="text-white">B</strong>, open <strong className="text-white">Manage Territory</strong>, and delete it. You will get the Flag Kit back so you can place it somewhere else. The <strong className="text-white">B</strong> menu also has other useful territory info and tips.
                </p>
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
            
            <div className="space-y-6">
              {/* Option 1: Purchasable */}
              <Card className="p-6 bg-neutral-900/40 border-neutral-800">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded uppercase tracking-wider">Option 1</span>
                  Purchasable Bunker
                </h3>
                <p className="text-neutral-400 mb-6 text-sm">
                  Buy the Kit and 2 territory flag kits from the Building Trader.
                </p>
                
                <ol className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                  <li className="pl-8 relative">
                     <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">1</span>
                     <p className="text-neutral-300 text-sm">
                       Place your <strong className="text-white">Main flag</strong> and create a territory, then place your bunker down.
                     </p>
                  </li>
                  <li className="pl-8 relative">
                     <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">2</span>
                     <p className="text-neutral-300 text-sm">
                       Ensure the bunker is placed on <strong className="text-white">solid ground</strong> or a ground floor.
                     </p>
                  </li>
                  <li className="pl-8 relative">
                     <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">3</span>
                     <p className="text-neutral-300 text-sm">
                       Open the bunker lid to attach your <strong className="text-white">Code Lock</strong>.
                     </p>
                  </li>
                  <li className="pl-8 relative">
                     <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">4</span>
                     <p className="text-neutral-300 text-sm">
                       Once inside, place down the <strong className="text-white">second flag</strong>.
                       <br />
                       <span className="text-neutral-500 italic text-xs block mt-1">Tip: Use the same name as your main territory with a 1 or 2 added.</span>
                     </p>
                  </li>
                </ol>
              </Card>

              {/* Option 2: Craftable */}
              <Card className="p-6 bg-neutral-900/40 border-neutral-800">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-500 text-xs px-2 py-1 rounded uppercase tracking-wider">Option 2</span>
                  Craftable Bunker (Shovel)
                </h3>
                
                <div className="mb-6 p-4 bg-neutral-950/50 rounded border border-white/5">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Required Equipment</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-neutral-300">
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full"/> Bunker Shovel</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full"/> Pickaxe (Digging)</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-neutral-500 rounded-full"/> Hammer (Supports)</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-neutral-500 rounded-full"/> Axe/Hatchet (Logs)</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-neutral-500 rounded-full"/> Saw (Planks)</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-neutral-500 rounded-full"/> Nails, Logs, Stone</span>
                    <span className="col-span-2 flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"/> H7 Headlights & Cable Reels</span>
                  </div>
                </div>

                <ol className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                  <li className="pl-8 relative">
                     <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">1</span>
                     <p className="text-neutral-300 text-sm">
                       Find your spot and use the <strong className="text-white">Bunker Shovel</strong> to dig out the entrance.
                     </p>
                  </li>
                  <li className="pl-8 relative">
                     <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">2</span>
                     <p className="text-neutral-300 text-sm">
                       Immediately put a <strong className="text-white">Code Lock</strong> on it.
                     </p>
                  </li>
                  <li className="pl-8 relative">
                     <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">3</span>
                     <p className="text-neutral-300 text-sm">
                       Go inside and place your <strong className="text-white">Territory Flag</strong> (50m radius).
                     </p>
                  </li>
                  <li className="pl-8 relative">
                     <span className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-mono">4</span>
                     <p className="text-neutral-300 text-sm">
                       Use your Inventory Key (Tab) to see required supplies for each section and expand as you like!
                     </p>
                  </li>
                </ol>
              </Card>
            </div>
          </section>
        </div>

        {/* General Guidelines - Column 2 */}
        <div className="space-y-8">
          
          {/* Enforcement / Grace Period */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Enforcement</h2>
            </div>
            <Card className="p-6 bg-red-900/10 border-red-500/30 text-neutral-300 space-y-4">
              <p>
                Those who do not adhere to the exclusion zone rules may find their base deleted after a grace period.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex gap-3">
                  <span className="font-bold text-white">1.</span>
                  <p>Admins will try to talk to you in person first if you are online.</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-white">2.</span>
                  <p>If offline, an admin will place a sign by your base. <span className="text-white font-medium">Please follow the sign{`'`}s instructions.</span></p>
                </div>
              </div>
              <p className="text-xs italic text-red-400">
                We want everyone to have an enjoyable time, and sticking to these rules makes everyone{`'`}s life easier :)
              </p>
            </Card>
          </section>

          {/* Housing Options */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Store size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Housing Options</h2>
            </div>
            
            <div className="space-y-6">
              {/* Portable Housing */}
              <Card className="p-6 bg-neutral-900/40 border-neutral-800">
                <h3 className="text-lg font-bold text-white mb-3">Portable Housing</h3>
                <div className="space-y-4 text-sm text-neutral-300">
                  <p>
                    There are nine options, all purchasable at the Build Trader. From a small 1-room “shack” to a 2-story multi-room “Mansion.” 
                    Each building comes with a working fireplace or stove.
                  </p>
                  <div className="bg-neutral-950/30 p-4 rounded border border-white/5 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold ring-1 ring-blue-500/20">1</span>
                      <p>Buy a house, find your awesome build location, and plop that building down.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold ring-1 ring-blue-500/20">2</span>
                      <p>Claim it as your own. Look at the door of the house to see scroll options.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold ring-1 ring-blue-500/20">3</span>
                      <p>Pick <strong className="text-white">“Claim House”</strong>. Boom, it{`'`}s yours. No one can enter unless you use the “Invite Members” option in the scroll menu.</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Rag Cabins */}
              <Card className="p-6 bg-neutral-900/40 border-neutral-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-neutral-950 text-xs font-bold font-mono rounded-bl-lg">
                  NOOB CHERNO ONLY
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Rag Cabins</h3>
                <p className="text-neutral-400 text-sm mb-3">
                  Available at the Building Trader. Place them anywhere within build rules.
                </p>
                <div className="flex items-center gap-2 text-amber-500 text-xs font-bold border border-amber-500/20 bg-amber-500/5 p-2 rounded">
                  <AlertTriangle size={12} />
                  <span>Be careful with placement - they do not break down well!</span>
                </div>
              </Card>
            </div>
          </section>

          {/* General Guidelines (Simplified) */}
           <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-neutral-500/10 text-neutral-400">
                <Building2 size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">General Guidelines</h2>
            </div>
            
            <Card className="p-8 bg-neutral-900/40 border-neutral-800 space-y-8 relative overflow-hidden">
               {/* Clutter & Optimization */}
              <div className="space-y-4">
                 <h3 className="text-white font-bold text-lg border-b border-white/5 pb-2">Clutter & Optimization</h3>
                 <div className="space-y-4 text-neutral-300 text-sm leading-relaxed">
                   <p>
                     Please only place items like tents etc that you are actively using. We ask this to prevent excessive clutter on the server.
                   </p>
                   <p>
                     Keep the hoarding of gear, weapons and all of the things down to a minimum. Again this is to avoid clutter on the server which in turn helps with server lag.
                   </p>
                 </div>
              </div>

               {/* Base Spacing & Public Access */}
               <div className="space-y-4">
                 <h3 className="text-white font-bold text-lg border-b border-white/5 pb-2">Base Spacing & Public Access</h3>
                 <div className="space-y-4 text-neutral-300 text-sm leading-relaxed">
                   <p>
                     <strong className="text-rose-400">Do not block</strong> other survivors, bases or any public access points/monuments.
                   </p>
                   <p>
                     Griefing is frowned upon. Basically, <span className="italic text-white">if it isn’t your base, do not obstruct it.</span>
                   </p>
                   <div className="bg-neutral-950/50 p-3 rounded border border-white/5 mt-2">
                     <span className="text-amber-500 font-bold block mb-1 text-xs uppercase tracking-wider">Rendering Distance</span>
                     <p>Please do not build within the rendering distance of another base; we don’t need to be on top of each other.</p>
                   </div>
                 </div>
              </div>

              {/* Dono Bases */}
              <div className="p-4 rounded bg-neutral-950/50 border border-white/5 space-y-3">
                 <h4 className="text-neutral-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                   <Store size={14} /> Dono Bases
                 </h4>
                 <div className="text-neutral-400 text-xs leading-relaxed space-y-2">
                   <p>
                     You may come across slightly larger, sometimes fancier “premade” bases, which have not been occupied/claimed. 
                     <strong className="text-white"> Do not move into them.</strong> These are donation-based and may already be pre-claimed.
                   </p>
                   <p>
                     If you are interested, please make a ticket to chat with an Admin/Mod.
                   </p>
                 </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
