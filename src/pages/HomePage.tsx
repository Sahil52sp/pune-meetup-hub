import { useState } from 'react';
import { Box } from '@/components/ui/box';
import { EventCard } from '@/components/events/EventCard';
import { EventDetailPopup } from '@/components/events/EventDetailPopup';
import { mockEvents } from '@/data/mockEvents';
import { Event } from '@/types/event';

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const topEvents = mockEvents.slice(0, 3);

  return (
    <Box className="min-h-screen bg-background">
      {/* Hero Section */}
      <Box className="relative overflow-hidden py-20 px-4 bg-gradient-hero">
        <Box className="container max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Where Every Event Elevates{' '}
            <span className="text-primary">Your Network</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Skip the small talk. Join meetups that matter and network with purpose at events curated for serious professionals
          </p>
        </Box>
      </Box>

      {/* Top Events Section */}
      <Box className="py-16 px-4">
        <Box className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Top Events</h2>
          
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Event Detail Popup */}
      <EventDetailPopup
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </Box>
  );
}