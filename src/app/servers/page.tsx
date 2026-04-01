import { ServerList } from '@/components/server/ServerList';
import { Metadata } from 'next';
import { CinematicBackground } from '@/components/features/CinematicBackground';

export const metadata: Metadata = {
  title: 'Servers | CDN - DayZ PvE Network',
  description: 'View the status, player count, and details of all our active DayZ PvE servers.',
};

export default function ServersPage() {
  return (
    <CinematicBackground backgroundImageSrc="/Images/2.jpg">
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">Server <span className="text-red-500">Network</span></h1>
            <p className="text-neutral-400 max-w-xl text-base sm:text-lg">
              Monitor real-time status, player counts, and map rotation. All servers are hosted on dedicated high-performance hardware.
            </p>
            <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3">
              <p className="text-sm md:text-base text-red-100 font-semibold tracking-wide leading-relaxed">
                ⚠ HC Servers: No Donation Items/Gear | Raiding enabled | Territories = PvP zones
              </p>
            </div>
          </div>
        </div>

        <ServerList />
      </div>
    </CinematicBackground>
  );
}
