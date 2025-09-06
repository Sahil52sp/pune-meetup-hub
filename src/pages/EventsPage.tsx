import { useState, useMemo } from 'react';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { EventCard } from '@/components/events/EventCard';
import { mockEvents, categories, searchEvents, getEventsByCategory } from '@/data/mockEvents';

interface EventsPageProps {
  searchQuery: string;
}

export default function EventsPage({ searchQuery }: EventsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEvents = useMemo(() => {
    let events = mockEvents;

    // Apply search filter
    if (searchQuery.trim()) {
      events = searchEvents(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      events = events.filter(event => event.category.toLowerCase() === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        events = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'category':
        events = [...events].sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'featured':
        events = [...events].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
      default:
        break;
    }

    return events;
  }, [searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('date');
  };

  return (
    <div className="container px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Events</h1>
        <p className="text-muted-foreground text-lg">
          Discover all upcoming meetups and events in Pune
        </p>
        {searchQuery && (
          <div className="mt-4">
            <Badge variant="outline" className="text-sm">
              Search results for: "{searchQuery}"
            </Badge>
          </div>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex flex-wrap gap-3 flex-1">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="category">Sort by Category</SelectItem>
              <SelectItem value="featured">Featured First</SelectItem>
            </SelectContent>
          </Select>

          {(selectedCategory !== 'all' || sortBy !== 'date') && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredEvents.length} of {mockEvents.length} events
        </p>
      </div>

      {/* Events Grid/List */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria to find more events.
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Load More Button (for future pagination) */}
      {filteredEvents.length >= 12 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Events
          </Button>
        </div>
      )}
    </div>
  );
}