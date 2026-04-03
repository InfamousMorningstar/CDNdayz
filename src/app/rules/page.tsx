import { Metadata } from 'next';
import { RulesClient } from '@/components/rules/RulesClient';
import { CinematicBackground } from '@/components/features/CinematicBackground';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Rules & FAQ | CDN',
  description: 'Community guidelines, Discord rules, building regulations, and frequently asked questions for CDN DayZ.',
};

export default function RulesPage() {
  return (
    <CinematicBackground backgroundImageSrc="/Images/2.jpg">
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <Badge variant="outline" className="mb-4 border-red-500/30 text-red-400 bg-red-900/10 backdrop-blur-sm px-4 py-1">
            Community Standards
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Rules & <span className="text-red-500">FAQ</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-base sm:text-lg">
            Review community standards, hardcore exceptions, base-building requirements, and technical troubleshooting in one place.
          </p>
        </div>

        <RulesClient />
      </div>
    </CinematicBackground>
  );
}
