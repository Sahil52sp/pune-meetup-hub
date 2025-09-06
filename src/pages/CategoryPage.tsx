import { useParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventCard } from '@/components/events/EventCard';
import { getEventsByCategory, categories } from '@/data/mockEvents';
import { EventCategory } from '@/types/event';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  
  if (!category) {
    return <div>Category not found</div>;
  }

  const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const isValidCategory = categories.includes(normalizedCategory as EventCategory);
  
  if (!isValidCategory) {
    return (
      <div className="container px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Button asChild>
            <a href="/events">Browse All Events</a>
          </Button>
        </div>
      </div>
    );
  }

  const events = getEventsByCategory(normalizedCategory);

  const categoryDescriptions: Record<string, string> = {
    tech: 'Dive deep into the latest technologies, programming languages, and development practices with Pune\'s tech community.',
    business: 'Network with entrepreneurs, industry leaders, and business professionals to grow your career and business.',
    arts: 'Explore creativity, design, and artistic expression with like-minded artists and art enthusiasts.',
    sports: 'Stay active and competitive with various sports events, tournaments, and fitness activities.',
    networking: 'Build meaningful professional relationships and expand your network in Pune\'s business ecosystem.',
    workshop: 'Gain hands-on experience and learn new skills through interactive workshops and training sessions.'
  };

  return (
    <div className="container px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold">{normalizedCategory} Events</h1>
          <Badge variant={category.toLowerCase() as any}>
            {events.length} events
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl">
          {categoryDescriptions[category.toLowerCase()] || 'Discover amazing events in this category.'}
        </p>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              There are currently no events in the {normalizedCategory} category. Check back soon!
            </p>
            <Button asChild>
              <a href="/events">Browse All Events</a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Other Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Explore Other Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories
            .filter(cat => cat.toLowerCase() !== category.toLowerCase())
            .map((cat) => (
              <a
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="group bg-gradient-card rounded-lg p-4 text-center shadow-card hover:shadow-hover transition-all duration-300 border border-border/50"
              >
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {cat}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {getEventsByCategory(cat).length} events
                </p>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
