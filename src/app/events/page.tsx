import { Card } from '@/components/ui/Card';
import { Metadata } from 'next';
import { CalendarDays, Radio, ArrowRight } from 'lucide-react';
import { CinematicBackground } from '@/components/features/CinematicBackground';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { DISCORD_INVITE_URL } from '@/lib/links';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Events Schedule | CDN',
  description: 'Participate in unique DayZ PvE events on the CDN network. View active and upcoming community events.',
};

export default function EventsPage() {
  return (
    <CinematicBackground backgroundImageSrc="/Images/3.jpg">
      <div className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4 sm:px-6 relative z-10">
        <div className="relative mb-12 sm:mb-20 text-center flex flex-col items-center">
          <Badge variant="outline" className="mb-6 border-amber-500/30 text-amber-400 bg-amber-900/10 backdrop-blur-sm px-4 py-1">
            Live Operations
          </Badge>
          <div className="mb-6 inline-flex p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
             <Radio className="w-12 h-12 animate-pulse" />
          </div>
           <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6">Operations & <span className="text-red-500">Events</span></h1>
           <p className="text-neutral-400 max-w-2xl text-base sm:text-lg mb-8">
             Engage in server-wide operations, treasure hunts, and community challenges.
          </p>
          
           <Card className="max-w-3xl w-full p-6 sm:p-12 bg-neutral-900/60 border-neutral-800 backdrop-blur-md text-center">
             <h2 className="text-2xl font-bold text-white mb-4">Transmission Incoming...</h2>
             <p className="text-neutral-300 text-lg mb-6">
               Command is currently planning the next phase of operations. 
               New community events and challenges will be announced shortly.
             </p>
             <div className="inline-flex items-center gap-2 text-amber-500 font-mono tracking-widest text-sm uppercase px-4 py-2 bg-amber-500/10 rounded border border-amber-500/20">
                <CalendarDays size={16} />
                Schedule: TBA
             </div>
             <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
                    Join Discord Alerts <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/servers">View Live Servers</Link>
                </Button>
             </div>
          </Card>
        </div>
      </div>
    </CinematicBackground>
  );
}
