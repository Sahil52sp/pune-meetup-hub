import { useState } from "react";
import { Box } from "@/components/ui/box";
import { EventCard } from "@/components/events/EventCard";
import { EventDetailPopup } from "@/components/events/EventDetailPopup";
import { mockEvents } from "@/data/mockEvents";
import { Event } from "@/types/event";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MeetupsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Filter events based on search term and featured filter
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFeatured = !showFeaturedOnly || event.isFeatured;
    
    return matchesSearch && matchesFeatured;
  });

  // Sort events: featured first, then by date
  const sortedEvents = filteredEvents.sort((a, b) => {
    // Featured events first
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;

    // Then sort by date (earliest first)
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <>
      <Box className="min-h-screen bg-background relative px-4 sm:px-8 md:mx-16 lg:mx-24 xl:mx-40 py-8">
        {/* Header Section */}
        <Box className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-ndot mb-4 text-foreground">
            All Meetups
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Discover and join meetups happening in your area. Connect with like-minded professionals and expand your network.
          </p>
        </Box>

        {/* Search and Filter Section */}
        <Box className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Box className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search meetups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </Box>
          <Button
            variant={showFeaturedOnly ? "default" : "outline"}
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFeaturedOnly ? "Show All" : "Featured Only"}
          </Button>
        </Box>

        {/* Events Count */}
        <Box className="mb-6">
          <p className="text-sm text-muted-foreground">
            {sortedEvents.length} meetup{sortedEvents.length !== 1 ? 's' : ''} found
            {searchTerm && ` for "${searchTerm}"`}
            {showFeaturedOnly && ' (featured only)'}
          </p>
        </Box>

        {/* Events Grid */}
        <Box className="mb-12">
          {sortedEvents.length > 0 ? (
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </Box>
          ) : (
            <Box className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No meetups found</h3>
                <p className="text-sm">
                  {searchTerm 
                    ? `No meetups match "${searchTerm}"`
                    : showFeaturedOnly 
                      ? "No featured meetups available"
                      : "No meetups available at the moment"
                  }
                </p>
              </div>
              {(searchTerm || showFeaturedOnly) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setShowFeaturedOnly(false);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </Box>
          )}
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
