import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Metadata } from 'next';
import { Hammer, Shield, Zap, Info } from 'lucide-react';
import { CinematicBackground } from '@/components/features/CinematicBackground';

export const metadata: Metadata = {
  title: 'Server Features | CDN',
  description: 'Detailed breakdown of building systems and features active on CDN DayZ servers.',
};

export default function FeaturesPage() {
  return (
    <CinematicBackground>
      <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="outline" className="mb-4 border-red-500/30 text-red-400 bg-red-900/10 backdrop-blur-sm px-4 py-1">
            System Configuration
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Server <span className="text-red-500">Systems</span>
          </h1>
        <p className="text-neutral-400 max-w-2xl text-lg font-sans">
          Different servers operate with different building rules and mods to cater to every playstyle. 
          Check which system is active on your favorite map below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Expansion Building */}
        <Card className="p-8 bg-neutral-900/40 border-neutral-800 hover:border-red-500/30 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Hammer size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded bg-red-900/20 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap size={24} />
            </div>
            
            <h2 className="text-2xl font-heading font-bold text-white mb-4">Expansion Building</h2>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              Advanced modular building system featuring snapping, territories, and a wide variety of custom base parts. Allows for precise and creative base construction.
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold border-b border-white/5 pb-2 mb-3">
                Active Servers
              </h3>
              <ul className="space-y-2">
                {[
                  'Deer Isle',
                  'Bitterroot',
                  'Sakhal',
                  'Hardcore Hashima',
                  'Noob Chernarus'
                ].map((server) => (
                  <li key={server} className="flex items-center gap-2 text-neutral-300 text-sm font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></span>
                    {server}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Base Building Plus (BBP) */}
        <Card className="p-8 bg-neutral-900/40 border-neutral-800 hover:border-orange-500/30 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Hammer size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded bg-orange-900/20 border border-orange-500/30 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Hammer size={24} />
            </div>
            
            <h2 className="text-2xl font-heading font-bold text-white mb-4">Base Building Plus</h2>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              Extensive base building mod offering distinct tiers of construction (Wood, Metal, Concrete) plus a variety of doors, windows, and decorative elements.
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold border-b border-white/5 pb-2 mb-3">
                Active Servers
              </h3>
              <ul className="space-y-2">
                {[
                  'Hardcore Livonia'
                ].map((server) => (
                  <li key={server} className="flex items-center gap-2 text-neutral-300 text-sm font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
                    {server}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Standard / Regular Building */}
        <Card className="p-8 bg-neutral-900/40 border-neutral-800 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded bg-emerald-900/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield size={24} />
            </div>
            
            <h2 className="text-2xl font-heading font-bold text-white mb-4">No Expansion or Base Building Plus</h2>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              Utilizes the default base building mechanics. No additional construction mods are enabled on these servers.
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold border-b border-white/5 pb-2 mb-3">
                Active Servers
              </h3>
              <ul className="space-y-2">
                {[
                  'Reg Livonia',
                  'Reg Chernarus',
                  'Banov',
                  'Scifi Banov',
                  'Namalsk'
                ].map((server) => (
                  <li key={server} className="flex items-center gap-2 text-neutral-300 text-sm font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    {server}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </CinematicBackground>
  );
}