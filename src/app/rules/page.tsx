import { Metadata } from 'next';
import { RulesClient } from '@/components/rules/RulesClient';
import { CinematicBackground } from '@/components/features/CinematicBackground';

export const metadata: Metadata = {
  title: 'Network Rules | CDN',
  description: 'Community guidelines, Discord rules, and server building regulations for the CDN DayZ PvE Network.',
};

export default function RulesPage() {
  return (
    <CinematicBackground backgroundImageSrc="/Images/2.jpg">
      <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Network <span className="text-red-500">Protocol</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-sans">
            Adhering to these guidelines ensures a fair and enjoyable experience for all survivors. 
            Please review both general conduct and specific building regulations.
          </p>
        </div>

        <RulesClient />
      </div>
    </CinematicBackground>
  );
}
