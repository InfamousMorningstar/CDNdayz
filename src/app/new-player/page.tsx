import { Card } from '@/components/ui/Card';
import { Metadata } from 'next';
import Link from 'next/link';
import { CinematicBackground } from '@/components/features/CinematicBackground';

export const metadata: Metadata = {
  title: 'Survival Guide | CDN',
  description: 'Learn the basics of survival, trading, and base building on CDN DayZ PvE servers.',
};

export default function NewPlayerPage() {
  return (
    <CinematicBackground backgroundImageSrc="/Images/2.jpg">
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 sm:mb-16 text-center">
            <span className="text-red-500 font-mono text-sm tracking-widest uppercase mb-4 block">New Recruit Induction</span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6">Survival <span className="text-neutral-500">Manual</span></h1>
            <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
              Welcome to Chernarus/Namalsk/Deer Isle. This guide will help you navigate your first hours and establish a foothold.
            </p>
        </header>
        
        <div className="space-y-8 sm:space-y-12">
           <section id="getting-started">
              <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">I. Initial Deployment</h2>
              <div className="prose prose-invert max-w-none text-neutral-300">
                <p>
                  Upon spawning, you will find basic starting gear. Check your inventory immediately.
                  Your first priority is securing a weapon and sustenance. Military zones offer better loot but higher risk from AI or rogue elements even in PvE (if enabled).
                </p>
                <div className="bg-neutral-900/50 p-6 rounded-lg border-l-4 border-amber-500 my-6">
                  <h4 className="text-amber-400 font-bold mb-2">Pro Tip: Check for Safe Zones</h4>
                  <p className="m-0 text-sm">Safe Zones appear as green circles on the map (Press M). No damage can be dealt or taken here.</p>
                </div>
              </div>
           </section>

           <section id="economy">
              <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-sky-500 pl-4">II. The Economy</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Earning Rubles</h3>
                    <ul className="list-disc list-inside text-neutral-400 space-y-2">
                        <li>Sell pelts and meat to the Hunter Trader.</li>
                        <li>Completing high-tier loot runs.</li>
                        <li>Participate in server events.</li>
                    </ul>
                </Card>
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Spending Rubles</h3>
                    <ul className="list-disc list-inside text-neutral-400 space-y-2">
                        <li>Buy vehicles from the Mechanic.</li>
                        <li>Purchase building supplies.</li>
                        <li>Acquire high-grade weaponry.</li>
                    </ul>
                </Card>
              </div>
           </section>
           
           <section id="base-building">
              <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-rose-500 pl-4">III. Establishing a Base</h2>
               <div className="prose prose-invert max-w-none text-neutral-300">
                  <p>
                    Once you have resources, build a territory flag. This protects your area from despawning and other survivors building nearby.
                    Use the custom building menu (default key: B) to access advanced structures.
                  </p>
               </div>
           </section>
        </div>

        <div className="mt-20 flex justify-center">
            <Link href="/join" className="text-red-500 hover:text-red-400 border-b border-red-500/30 hover:border-red-500 pb-1 transition-all">
                &larr; Back to Join Guide
            </Link>
        </div>
      </div>
    </div>
    </CinematicBackground>
  );
}
