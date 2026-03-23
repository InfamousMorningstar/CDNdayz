import { events } from '@/data/mock';
import { Card } from '@/components/ui/Card';
import { EventCard } from '@/components/events/EventCard';
import { Metadata } from 'next';
import { CalendarDays, Flag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Events Schedule | CDN',
  description: 'Participate in unique DayZ PvE events on the CDN network. View active and upcoming community events.',
};

export default function EventsPage() {
  const activeEvents = events.filter(e => e.status === 'active');
  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const completedEvents = events.filter(e => e.status === 'completed');

  return (
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
      <div className="relative mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Operations & <span className="text-red-500">Events</span></h1>
        <p className="text-neutral-400 max-w-2xl text-lg">
           Engage in server-wide operations, treasure hunts, and community challenges. Earn unique rewards and bragging rights.
        </p>
      </div>

      <div className="space-y-20">
        {/* Active Events */}
        {activeEvents.length > 0 && (
          <section>
             <div className="flex items-center gap-3 mb-8">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
               <h2 className="text-2xl font-bold text-white tracking-wider uppercase">Active Operations</h2>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {activeEvents.map(event => (
                 <EventCard key={event.id} event={event} />
               ))}
             </div>
          </section>
        )}

        {/* Upcoming Events */}
        <section>
           <div className="flex items-center gap-3 mb-8">
             <CalendarDays className="text-neutral-500" />
             <h2 className="text-2xl font-bold text-white tracking-wider uppercase">Incoming Transmissions</h2>
           </div>
           
           {upcomingEvents.length > 0 ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {upcomingEvents.map(event => (
                 <EventCard key={event.id} event={event} />
               ))}
             </div>
           ) : (
             <Card className="p-8 text-center border-dashed border-neutral-800 bg-transparent text-neutral-500">
               No upcoming operations scheduled. Check back later.
             </Card>
           )}
        </section>
      </div>
    </div>
  );
}
