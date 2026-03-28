import { Metadata } from 'next';
import { RulesClient } from '@/components/rules/RulesClient';
import { CinematicBackground } from '@/components/features/CinematicBackground';

export const metadata: Metadata = {
  title: 'Rules & FAQ | CDN',
  description: 'Community guidelines, Discord rules, building regulations, and frequently asked questions for CDN DayZ.',
};

export default function RulesPage() {
  return (
    <CinematicBackground backgroundImageSrc="/Images/2.jpg">
      <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Rules & <span className="text-red-500">FAQ</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-sans">
            Review community standards, hardcore exceptions, base-building requirements, and technical troubleshooting in one place.
          </p>
        </div>

        <RulesClient />
      </div>
    </CinematicBackground>
  );
}
