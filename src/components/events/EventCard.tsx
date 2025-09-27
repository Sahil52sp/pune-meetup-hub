import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Event, EventCategory } from '@/types/event';

interface EventCardProps {
  event: Event;
}

const categoryVariantMap: Record<EventCategory, "tech" | "business" | "arts" | "sports" | "networking" | "workshop"> = {
  'Tech': 'tech',
  'Business': 'business',
  'Arts': 'arts',
  'Sports': 'sports',
  'Networking': 'networking',
  'Workshop': 'workshop'
};

export function EventCard({ event }: EventCardProps) {
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
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-hover bg-gradient-card border-border/50">
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
          <Box className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="truncate">{event.venue.name}</span>
          </Box>
        </Box>

        <Box className="flex flex-wrap gap-1 mt-3">
          {event.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {event.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{event.tags.length - 3} more
            </Badge>
          )}
        </Box>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Box className="flex gap-2 w-full">
          <Button asChild variant="default" className="flex-1">
            <Link to={`/event/${event.id}`}>
              View Details
            </Link>
          </Button>
          {event.externalLink && (
            <Button variant="outline" size="icon" asChild>
              <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </Box>
      </CardFooter>
    </Card>
  );
}