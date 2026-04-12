import { Metadata } from 'next';
import { CinematicBackground } from '@/components/features/CinematicBackground';
import { DayzErrorCodesClient } from '@/components/error-codes/DayzErrorCodesClient';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'DayZ Error Codes | CDN',
  description:
    'Search and troubleshoot DayZ warning and error codes with causes, recommended fixes, and documentation confidence levels.'
};

export default function DayzErrorCodesPage() {
  return (
    <CinematicBackground backgroundImageSrc="/Images/2.jpg">
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-10 sm:mb-14 flex flex-col items-center text-center">
          <Badge variant="outline" className="mb-4 border-red-500/35 text-red-700 dark:text-red-400 bg-red-500/12 dark:bg-red-900/10 backdrop-blur-sm px-4 py-1">
            Diagnostics Hub
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-5">
            DayZ <span className="text-red-500">Error Codes</span>
          </h1>
          <p className="mx-auto max-w-3xl text-base sm:text-lg text-gray-600 dark:text-neutral-400">
            Fast, readable reference for server and client warning codes. Search instantly, filter by category, and apply practical fixes without digging through noisy forum threads.
          </p>
        </div>

        <DayzErrorCodesClient />
      </div>
    </CinematicBackground>
  );
}