import { Metadata } from 'next';
import { events } from '@/data/mock';
import { EventsPageClient } from '@/components/events/EventsPageClient';

export const metadata: Metadata = {
  title: 'Events Schedule | CDN',
  description: 'Participate in unique DayZ PvE events on the CDN network. View active and upcoming community events.',
};

export default function EventsPage() {
  return <EventsPageClient events={events} />;
}
