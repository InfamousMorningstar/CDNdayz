import { ServerList } from '@/components/server/ServerList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servers | CDN - DayZ PvE Network',
  description: 'View the status, player count, and details of all our active DayZ PvE servers.',
};

export default function ServersPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Server <span className="text-red-500">Network</span></h1>
          <p className="text-neutral-400 max-w-xl text-lg">
            Monitor real-time status, player counts, and map rotation. All servers are hosted on dedicated high-performance hardware.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
           <div className="flex items-center gap-2 text-green-400">
             <div className="relative flex items-center justify-center w-3 h-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
             </div>
             <span className="font-mono text-sm tracking-wider uppercase">Systems Operational</span>
           </div>
           <div className="text-neutral-500 text-sm font-mono">
             AUTO-REFRESH: 30s
           </div>
        </div>
      </div>

      <ServerList />
    </div>
  );
}
