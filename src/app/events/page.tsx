import { events } from '@/data/mock';
import { Card } from '@/components/ui/Card';
import { EventCard } from '@/components/events/EventCard';
import { Metadata } from 'next';
import { CalendarDays, Flag } from 'lucide-react';
import { CinematicBackground } from '@/components/features/CinematicBackground';

export const metadata: Metadata = {
  title: 'Events Schedule | CDN',
  description: 'Participate in unique DayZ PvE events on the CDN network. View active and upcoming community events.',
};

export default function EventsPage() {
  const activeEvents = events.filter(e => e.status === 'active');
  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const completedEvents = events.filter(e => e.status === 'completed');

  return (
    <CinematicBackground backgroundImageSrc="/Images/3.jpg">
      <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 relative z-10">
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
                  <div className="w-12 h-12 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center text-red-500">
                    <Flag size={24} />
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-white">Active Operations</h2>
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
               <div className="w-12 h-12 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center text-blue-500">
                 <CalendarDays size={24} />
               </div>
               <h2 className="text-3xl font-heading font-bold text-white">Upcoming Briefings</h2>
            </div>
            {upcomingEvents.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
               </div>
            ) : (
              <Card className="p-8 border-dashed border-neutral-800 bg-neutral-900/30 text-center">
                 <p className="text-neutral-500">No upcoming events scheduled. Check back soon!</p>
              </Card>
            )}
          </section>

          {/* Past Events */}
          {completedEvents.length > 0 && (
            <section className="opacity-60 hover:opacity-100 transition-opacity">
               <h2 className="text-2xl font-heading font-bold text-neutral-500 mb-6 border-b border-white/5 pb-4">
                 Mission Logs (Past Events)
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {completedEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
               </div>
            </section>
          )}
        </div>
      </div>
    </CinematicBackground>
  );
}
