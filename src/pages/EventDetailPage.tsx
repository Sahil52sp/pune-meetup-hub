import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ExternalLink, Share2, Users, Globe, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EventCard } from '@/components/events/EventCard';
import { getEventById, mockEvents } from '@/data/mockEvents';
import { EventCategory } from '@/types/event';

const categoryVariantMap: Record<EventCategory, "tech" | "business" | "arts" | "sports" | "networking" | "workshop"> = {
  'Tech': 'tech',
  'Business': 'business',
  'Arts': 'arts',
  'Sports': 'sports',
  'Networking': 'networking',
  'Workshop': 'workshop'
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const event = id ? getEventById(id) : null;

  if (!event) {
    return (
      <div className="container px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The event you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild>
            <Link to="/events">Browse All Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const relatedEvents = mockEvents
    .filter(e => e.id !== event.id && e.category === event.category)
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.shortDescription,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-hero">
        <div className="container px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={categoryVariantMap[event.category]}>
                {event.category}
              </Badge>
              {event.isFeatured && (
                <Badge variant="default">Featured</Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              {event.title}
            </h1>
            
            <p className="text-lg text-primary-foreground/90 mb-6">
              {event.shortDescription}
            </p>
            
            <div className="flex flex-wrap gap-6 text-primary-foreground/90 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {formatTime(event.time)}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {event.venue.name}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {event.externalLink && (
                <Button variant="hero" size="lg" asChild>
                  <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Register Now
                  </a>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleShare}
                className="bg-background/20 backdrop-blur border-primary-foreground/20 text-primary-foreground hover:bg-background/30"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="whitespace-pre-line text-foreground">
                  {event.description}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{formatDate(event.date)}</p>
                    <p className="text-sm text-muted-foreground">{formatTime(event.time)}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{event.venue.name}</p>
                    <p className="text-sm text-muted-foreground">{event.venue.address}</p>
                    {event.venue.googleMapsLink && (
                      <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                        <a href={event.venue.googleMapsLink} target="_blank" rel="noopener noreferrer">
                          View on Google Maps
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Organized by</p>
                    <p className="text-sm">{event.organizer.name}</p>
                    {event.organizer.website && (
                      <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                        <a href={event.organizer.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-3 w-3 mr-1" />
                          Visit Website
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${event.organizer.contact}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {event.organizer.contact}
                    </a>
                  </div>
                  
                  {event.externalLink && (
                    <Button className="w-full" asChild>
                      <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Register for Event
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More {event.category} Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <EventCard key={relatedEvent.id} event={relatedEvent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}