import { events } from '@/data/mock';
import { Card } from '@/components/ui/Card';
import { Metadata } from 'next';
import { CalendarDays, Flag, Radio } from 'lucide-react';
import { CinematicBackground } from '@/components/features/CinematicBackground';

export const metadata: Metadata = {
  title: 'Events Schedule | CDN',
  description: 'Participate in unique DayZ PvE events on the CDN network. View active and upcoming community events.',
};

export default function EventsPage() {
  // Events are currently disabled/TBA
  const activeEvents: any[] = []; 
  const upcomingEvents: any[] = [];
  const completedEvents: any[] = [];

  return (
    <CinematicBackground backgroundImageSrc="/Images/3.jpg">
      <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 relative z-10">
        <div className="relative mb-20 text-center flex flex-col items-center">
          <div className="mb-6 inline-flex p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
             <Radio className="w-12 h-12 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Operations & <span className="text-red-500">Events</span></h1>
          <p className="text-neutral-400 max-w-2xl text-lg mb-8">
             Engage in server-wide operations, treasure hunts, and community challenges.
          </p>
          
          <Card className="max-w-3xl w-full p-12 bg-neutral-900/60 border-neutral-800 backdrop-blur-md text-center">
             <h2 className="text-2xl font-bold text-white mb-4">Transmission Incoming...</h2>
             <p className="text-neutral-300 text-lg mb-6">
               Command is currently planning the next phase of operations. 
               New community events and challenges will be announced shortly.
             </p>
             <div className="inline-flex items-center gap-2 text-amber-500 font-mono tracking-widest text-sm uppercase px-4 py-2 bg-amber-500/10 rounded border border-amber-500/20">
                <CalendarDays size={16} />
                Schedule: TBA
             </div>
          </Card>
        </div>
      </div>
    </CinematicBackground>
  );
}
