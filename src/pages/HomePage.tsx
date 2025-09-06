import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EventCard } from '@/components/events/EventCard';
import { mockEvents, getFeaturedEvents, categories } from '@/data/mockEvents';
import heroImage from '@/assets/hero-image.jpg';

interface HomePageProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function HomePage({ searchQuery, onSearchChange }: HomePageProps) {
  const featuredEvents = getFeaturedEvents();
  const upcomingEvents = mockEvents.slice(0, 6);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Pune meetup community"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero/80" />
        </div>
        
        <div className="relative container px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Discover Amazing{' '}
              <span className="bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
                Meetups
              </span>{' '}
              in Pune
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Connect with like-minded people, learn new skills, and be part of Pune's vibrant tech and business community.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for events, topics, or organizers..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="h-14 pl-12 pr-4 text-lg bg-background/90 backdrop-blur border-none shadow-elegant"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button variant="hero" size="lg" asChild>
                <Link to="/events">Explore All Events</Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-background/20 backdrop-blur border-primary-foreground/20 text-primary-foreground hover:bg-background/30">
                View Categories
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">{mockEvents.length}+</div>
                <div className="text-sm text-primary-foreground/80">Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">{categories.length}</div>
                <div className="text-sm text-primary-foreground/80">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">500+</div>
                <div className="text-sm text-primary-foreground/80">Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't miss these handpicked events that are making waves in Pune's community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/events">View All Featured Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find events that match your interests and professional goals
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase()}`}
                className="group"
              >
                <div className="bg-gradient-card rounded-lg p-6 text-center shadow-card hover:shadow-hover transition-all duration-300 border border-border/50">
                  <div className="flex justify-center mb-3">
                    {category === 'Tech' && <Calendar className="h-8 w-8 text-category-tech" />}
                    {category === 'Business' && <Users className="h-8 w-8 text-category-business" />}
                    {category === 'Arts' && <MapPin className="h-8 w-8 text-category-arts" />}
                    {category === 'Sports' && <Calendar className="h-8 w-8 text-category-sports" />}
                    {category === 'Networking' && <Users className="h-8 w-8 text-category-networking" />}
                    {category === 'Workshop' && <MapPin className="h-8 w-8 text-category-workshop" />}
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {mockEvents.filter(e => e.category === category).length} events
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-muted-foreground max-w-2xl">
                Stay ahead of the curve with these upcoming events in Pune
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:inline-flex">
              <Link to="/events">View All Events</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" size="lg" asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}