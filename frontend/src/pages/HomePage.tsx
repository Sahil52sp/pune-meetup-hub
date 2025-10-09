import { useState } from "react";
import { Box } from "@/components/ui/box";
import { EventCard } from "@/components/events/EventCard";
import { EventDetailPopup } from "@/components/events/EventDetailPopup";
import { WelcomeBanner } from "@/components/onboarding/WelcomeBanner";
import { QuickActions } from "@/components/onboarding/QuickActions";
import { mockEvents } from "@/data/mockEvents";
import { Event } from "@/types/event";
import bgOrange from "@/assets/bg-orange-1.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { login } = useAuth();

  // Sort events: featured first, then by date, then take first 6
  const topEvents = mockEvents
    .sort((a, b) => {
      // Featured events first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // Then sort by date (earliest first)
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })
    .slice(0, 3);

  return (
    <>
      <Box className="min-h-screen bg-background relative px-4 sm:px-8 md:mx-16 lg:mx-24 xl:mx-40">
        {/* Background Image - Fixed to viewport */}
        <Box
          className="hidden xl:block fixed top-0 right-0 pointer-events-none z-0 overflow-hidden bg-image-responsive"
          style={{
            backgroundImage: `url(${bgOrange})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            top: -650,
            right: -320,
            width: "80vw",
            height: "210vh",
            opacity: 0.8,
            maxWidth: "800px",
          }}
        />

        {/* Hero Section */}
        <Box className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-28 z-10">
          <Box className="max-w-4xl text-center sm:text-left mx-auto sm:mx-0">
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl nouvel-bold mb-4 sm:mb-6 text-foreground leading-tight">
              Where Every Event Elevates <br />
              <span className="text-primary">Your Network</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl text-center sm:text-left leading-relaxed mx-auto sm:mx-0">
              Skip the small talk. Join meetups that matter and network with
              purpose at events curated for serious professionals
            </p>
            <Box className="mt-6">
              <Button onClick={login} variant={"tertiary"} size="md" className="mr-3">
                Let's Connect
              </Button>
              <Button onClick={login} variant={"outline"} size="md">
                Look for Meetups
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Welcome Banner for New Users */}
        <Box className="relative z-10 mb-8">
          <WelcomeBanner />
        </Box>

        {/* Quick Actions for Authenticated Users */}
        <Box className="relative z-10 mb-8">
          <QuickActions />
        </Box>

        {/* Top Events Section */}
        <Box className="py-10 sm:py-12 md:py-16 lg:py-20 relative z-10 mb-40">
          <Box>
            <h2 className="text-base sm:text-lg md:text-xl font-ndot mb-6 sm:mb-8 text-center sm:text-left">
              Top Upcoming Events
            </h2>

            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-6">
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
