import { X, Calendar, MapPin, Clock, User } from 'lucide-react';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';

interface EventDetailPopupProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailPopup({ event, isOpen, onClose }: EventDetailPopupProps) {
  if (!isOpen || !event) return null;

  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Box className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <Box 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <Box className="relative backdrop-blur-lg bg-white/80 border border-white/40 rounded-lg shadow-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <Box className="flex flex-col md:flex-row max-h-[90vh] overflow-auto">
          {/* Left Side - Event Image and Basic Info */}
          <Box className="md:w-2/5 bg-muted p-8">
            <Box className="aspect-video bg-gradient-hero rounded-lg mb-6 flex items-center justify-center overflow-hidden">
              <Box className="text-primary-foreground text-lg font-semibold">
                {event.category} Event
              </Box>
            </Box>

            <Box className="space-y-4">
              <Box className="bg-background rounded-lg p-4">
                <Box className="flex items-start text-sm mb-2">
                  <Calendar className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <Box>
                    <Box className="font-medium">Date & Time</Box>
                    <Box className="text-muted-foreground">
                      {formatDate(event.date)} | {formatTime(event.time)}
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box className="bg-background rounded-lg p-4">
                <Box className="flex items-start text-sm">
                  <User className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <Box>
                    <Box className="font-medium">Organized by</Box>
                    <Box className="text-muted-foreground">{event.organizer.name}</Box>
                  </Box>
                </Box>
              </Box>

              <Box className="bg-background rounded-lg p-4">
                <Box className="flex items-start text-sm">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <Box>
                    <Box className="font-medium">Location</Box>
                    <Box className="text-muted-foreground">{event.venue.name}</Box>
                    <Box className="text-xs text-muted-foreground mt-1">
                      {event.venue.address}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Event Description */}
          <Box className="md:w-3/5 p-8">
            <h2 className="text-3xl font-bold mb-6">{event.title}</h2>
            
            <Box className="prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-4">{event.shortDescription}</p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">About this event</h3>
              <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>

              {event.tags && event.tags.length > 0 && (
                <Box className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <Box className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Box
                        key={tag}
                        className="px-3 py-1 bg-muted rounded-full text-sm"
                      >
                        {tag}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {event.externalLink && (
                <Box className="mt-8">
                  <Button asChild className="w-full md:w-auto">
                    <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
                      Register for Event
                    </a>
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
