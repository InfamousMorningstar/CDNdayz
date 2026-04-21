import { ServerList } from '@/components/server/ServerList';
import { Metadata } from 'next';
import { CinematicBackground } from '@/components/features/CinematicBackground';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { ServerIntelligence } from '@/components/intelligence/ServerIntelligence';

export const metadata: Metadata = {
  title: 'Servers | CDN - DayZ PvE Network',
  description: 'View the status, player count, and details of all our active DayZ PvE servers.',
};

export default function ServersPage() {
  return (
    <CinematicBackground backgroundImageSrc="/Images/2.jpg">
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <Badge variant="outline" className="mb-4 border-red-500/35 text-red-700 dark:text-red-400 bg-red-500/12 dark:bg-red-900/10 backdrop-blur-sm px-4 py-1">
            Live Network
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Server Network <span className="text-red-500">Intelligence</span>
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 max-w-xl text-base sm:text-lg mb-5">
            Monitor live status, player patterns, and map activity with data-backed intelligence across the full network.
          </p>
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 max-w-xl w-full">
            <p className="text-sm md:text-base text-red-700 dark:text-red-100 font-semibold leading-relaxed">
              ⚠ HC Servers: No Donation Items/Gear | Raiding enabled | Territories = PvP zones
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link
              href="/new-player"
              className="px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/30 text-gray-700 dark:text-neutral-200 hover:text-gray-900 dark:hover:text-white hover:border-red-500/40 transition-colors"
            >
              New here? New Player Guide
            </Link>
            <Link
              href="/store"
              className="px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/30 text-gray-700 dark:text-neutral-200 hover:text-gray-900 dark:hover:text-white hover:border-amber-500/40 transition-colors"
            >
              Donation FAQ & Store
            </Link>
          </div>
        </div>

        <ServerIntelligence />
        <ServerList />
      </div>
    </CinematicBackground>
  );
}
