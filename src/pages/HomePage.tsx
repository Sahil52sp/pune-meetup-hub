import { useState } from 'react';
import { Box } from '@/components/ui/box';
import { EventCard } from '@/components/events/EventCard';
import { EventDetailPopup } from '@/components/events/EventDetailPopup';
import { mockEvents } from '@/data/mockEvents';
import { Event } from '@/types/event';
import bgOrange from '@/assets/bg-orange-1.png';

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const topEvents = mockEvents.slice(0, 6);

  return (
    <>
      <Box style={{ margin: "20px 160px" }} className="min-h-screen bg-background relative">

      {/* Background Image - Fixed to viewport */}
      <Box 
        className="fixed top-0 right-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${bgOrange})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          top: -700,
          right: -650,
          width: '75vw',
          height: '300vh',
          opacity: 0.8
        }}
      />
      
      {/* Hero Section */}
      <Box className="relative overflow-hidden py-28 z-10">
        <Box className=" max-w-4xl text-left">
          <h1 className="text-5xl text-left md:text-6xl nouvel-bold mb-6 text-foreground">
            Where Every Event Elevates{' '} <br />
            <span className="text-primary">Your Network</span>
          </h1>
          <p style={{ lineHeight: '1.3', fontSize: '20px' }} className="text-lg text-muted-foreground max-w-2xl text-left">
            Skip the small talk. Join meetups that matter and network with purpose at events curated for serious professionals
          </p>
        </Box>
      </Box>

      {/* Top Events Section */}
      <Box className="py-20 relative z-10">
        <Box className="container">
          <h2  className="text-lg font-ndot mb-8">Top Upcoming Events</h2>
          
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
    </>
  );
}