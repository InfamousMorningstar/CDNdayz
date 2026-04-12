import { CinematicBackground } from '@/components/features/CinematicBackground';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Crown, Zap, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';
import {
  DISCORD_STORE_CHANNEL_URL,
  DISCORD_SUPPORT_CHANNEL_URL,
} from '@/lib/links';
import { StoreCatalogTabs } from '@/components/store/StoreCatalogTabs';
import { DiscordLink } from '@/components/ui/DiscordLink';

export const metadata: Metadata = {
  title: 'Store | CDN',
  description: 'Support the server and get exclusive perks. All donations go directly to server upkeep and development.',
};

const DISCORD_LINK = DISCORD_STORE_CHANNEL_URL;

export default function StorePage() {
  return (
    <CinematicBackground>
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <Badge variant="outline" className="mb-4 border-amber-500/35 text-amber-700 dark:text-amber-400 bg-amber-500/12 dark:bg-amber-900/10 backdrop-blur-sm px-4 py-1">
            Server Support
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-6">
            Donation <span className="text-amber-500">Store</span>
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 max-w-2xl text-base sm:text-lg font-sans">
            Support the CDN community and receive exclusive in-game rewards. 
            All transactions are handled securely through our Discord ticket system to ensure you get exactly what you want.
          </p>
        </div>

        {/* HC Warning Banner */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300">
            <span className="text-xl">⚠</span>
            <p className="text-sm font-semibold tracking-wide">
              <span className="text-red-600 dark:text-red-400 font-bold">Hardcore Servers:</span> Donation items and spawned gear are <span className="text-red-900 dark:text-white">not available</span> on HC servers. Donations apply to standard servers only.
            </p>
          </div>
        </div>

        {/* Quick Start: How to Donate */}
        <div className="max-w-6xl mx-auto mb-10 sm:mb-12">
          <Card className="p-5 sm:p-8 bg-white/80 dark:bg-neutral-900/60 border-gray-200 dark:border-neutral-800 backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  How to Donate
                </h3>
                <p className="text-gray-600 dark:text-neutral-400 text-sm sm:text-base">
                  New here? Follow these quick steps first, then choose what you want from the store below.
                </p>
              </div>
              <DiscordLink href={DISCORD_LINK} className="block md:min-w-[260px]">
                <Button size="lg" className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white border-none py-6 text-lg font-bold shadow-xl shadow-indigo-500/10">
                  <span className="mr-2">Open Ticket on Discord</span>
                  <ExternalLink size={20} />
                </Button>
              </DiscordLink>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <li className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950/40 p-4 flex gap-3">
                <span className="font-mono text-gray-400 dark:text-neutral-500 font-bold">01</span>
                <span className="text-gray-700 dark:text-neutral-300">Join our Discord server</span>
              </li>
              <li className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950/40 p-4 flex gap-3">
                <span className="font-mono text-gray-400 dark:text-neutral-500 font-bold">02</span>
                <span className="text-gray-700 dark:text-neutral-300">
                  Open a ticket in{' '}
                  <DiscordLink href={DISCORD_STORE_CHANNEL_URL} className="text-amber-500 hover:underline">
                    your store channel
                  </DiscordLink>
                </span>
              </li>
              <li className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950/40 p-4 flex gap-3">
                <span className="font-mono text-gray-400 dark:text-neutral-500 font-bold">03</span>
                <span className="text-gray-700 dark:text-neutral-300">Mention your desired items and payment method</span>
              </li>
            </ol>

            <p className="text-center mt-5 text-xs text-gray-400 dark:text-neutral-600">
              Transactions handled securely via PayPal, Cash App, Zelle, Venmo & more
            </p>
          </Card>
        </div>

        <StoreCatalogTabs />

        {/* Donation Info & Payment Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-6xl mx-auto">
            
            {/* Info Card */}
            <Card className="p-5 sm:p-8 bg-white/80 dark:bg-neutral-900/60 border-gray-200 dark:border-neutral-800 flex flex-col backdrop-blur-md">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Shield className="text-red-500 w-6 h-6" />
                    Important Information
                </h3>
                
                <div className="space-y-8 text-gray-600 dark:text-neutral-300">
                    <div className="bg-gray-50 dark:bg-neutral-950/50 border border-gray-200 dark:border-neutral-800/50 p-5 rounded-xl">
                        <strong className="text-emerald-400 block mb-2 text-lg">Server Configuration</strong>
                        <p className="text-gray-700 dark:text-neutral-300 leading-relaxed">
                            <span className="text-gray-900 dark:text-white font-semibold">Player vs Environment (PvE) Only.</span> Player-to-player damage is globally disabled across all our servers. Equipment and vehicles purchased here are intended for use against environmental threats and AI challenges.
                        </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 p-5 rounded-xl">
                        <strong className="text-red-400 block mb-2 text-lg">Wipe Rollover Policy</strong>
                        <p className="text-gray-700 dark:text-neutral-300 leading-relaxed">
                            Donation items last a full wipe. If you donate for something in the <span className="text-gray-900 dark:text-white font-semibold">last month before a wipe</span>, 
                            it will roll over to the new wipe automatically.
                        </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/10 p-5 rounded-xl">
                        <strong className="text-amber-400 block mb-2 text-lg">One Donation, All Servers</strong>
                        <p className="text-gray-700 dark:text-neutral-300 leading-relaxed">
                            If you donate for items on one server, you can open a ticket to extend them to other CDN servers you play on at no extra cost. 
                            <span className="text-gray-900 dark:text-white font-semibold"> You do not need to donate multiple times.</span>
                        </p>
                    </div>

                    <div className="space-y-2">
                        <strong className="text-gray-900 dark:text-white block text-lg">Flexible Support</strong>
                        <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                            If you can't make a large donation, any small donation is appreciated! We can still offer you something, 
                            so just make a ticket in our{' '}
                            <DiscordLink href={DISCORD_SUPPORT_CHANNEL_URL} className="text-red-400 hover:text-red-300 underline">
                              support channel
                            </DiscordLink>{' '}
                            with what you want. Items can be claimed across all servers.
                        </p>
                    </div>
                    
                    <div className="space-y-2">
                        <strong className="text-gray-900 dark:text-white block text-lg">Server Maintenance</strong>
                        <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                            We want everyone to have fun and enjoy the server! All donations go directly back into 
                            keeping the server running, maintained, and funding new mods.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Payment & Steps Card */}
            <Card className="p-5 sm:p-8 bg-white/80 dark:bg-neutral-900/60 border-gray-200 dark:border-neutral-800 flex flex-col backdrop-blur-md">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Crown className="text-amber-500 w-6 h-6" />
                    Payment Methods
                </h3>

                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Zap size={48} />
                    </div>
                    <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                        <span className="animate-pulse w-2 h-2 rounded-full bg-amber-500"></span>
                        Proof of Purchase
                    </h4>
                    <p className="text-gray-600 dark:text-neutral-300 text-sm leading-relaxed mb-3">
                      <strong className="text-gray-900 dark:text-white">Always open a ticket when you purchase.</strong>
                        <br />
                        No matter which payment method you use, opening a ticket helps admins verify your transaction immediately.
                    </p>
                    <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-neutral-400 bg-gray-100 dark:bg-black/20 p-2 rounded">
                        <span className="text-amber-500 mt-0.5">ℹ</span>
                        <span>A screenshot of the transaction is highly encouraged to make the process smoother.</span>
                    </div>
                </div>

                <div className="space-y-6 mb-8">
                     <div className="p-5 bg-gray-100 dark:bg-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-bl-lg">Preferred</div>
                        <div className="text-xs uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-2">PayPal (Friends & Family)</div>
                        <div className="font-mono text-amber-400 text-lg md:text-xl select-all break-all cursor-pointer hover:text-amber-300 transition-colors">
                            Joelmarq1559@icloud.com
                        </div>
                     </div>

                     <div className="p-5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/30">
                        <div className="font-bold text-gray-900 dark:text-white mb-1">Other Options</div>
                        <p className="text-gray-600 dark:text-neutral-400 text-sm">
                            Cash App, Zelle, Venmo, etc. available upon request. Please open a ticket in our{' '}
                            <DiscordLink href={DISCORD_SUPPORT_CHANNEL_URL} className="text-red-400 hover:text-red-300 underline">
                              support channel
                            </DiscordLink>.
                        </p>
                     </div>
                </div>
            </Card>
        </div>

      </div>
    </CinematicBackground>
  );
}
