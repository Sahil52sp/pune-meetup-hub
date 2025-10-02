import { Calendar, MapPin, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Event, EventCategory } from '@/types/event';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const categoryVariantMap: Record<EventCategory, "tech" | "business" | "arts" | "sports" | "networking" | "workshop"> = {
  'Tech': 'tech',
  'Business': 'business',
  'Arts': 'arts',
  'Sports': 'sports',
  'Networking': 'networking',
  'Workshop': 'workshop'
};

export function EventCard({ event, onClick }: EventCardProps) {
  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
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
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-hover backdrop-blur-lg bg-white/60 border border-white/40 cursor-pointer hover:bg-white/70 hover:scale-[1.02]" onClick={onClick}>
      <CardHeader className="p-0">
        <Box className="relative overflow-hidden rounded-t-lg">
          <Box className="aspect-video bg-gradient-hero flex items-center justify-center">
            <Box className="text-primary-foreground text-lg font-semibold">
              {event.category} Event
            </Box>
          </Box>
          {event.isFeatured && (
            <Box className="absolute top-3 left-3">
              <Badge variant="default" className="bg-accent text-accent-foreground">
                Featured
              </Badge>
            </Box>
          )}
          <Box className="absolute top-3 right-3">
            <Badge variant={categoryVariantMap[event.category]}>
              {event.category}
            </Badge>
          </Box>
        </Box>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {event.shortDescription}
        </p>
        
        <Box className="space-y-2 text-sm">
          <Box className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(event.date)}
          </Box>
          <Box className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(event.time)}
          </Box>
        </Box>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <Box className="text-sm text-muted-foreground">
          {formatDate(event.date)} | {formatTime(event.time)}
        </Box>
        <Button variant="outline" size="icon" className="rounded-full">
          <Plus className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}