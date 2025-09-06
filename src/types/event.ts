export interface Venue {
  name: string;
  address: string;
  googleMapsLink?: string;
}

export interface Organizer {
  name: string;
  contact: string;
  website?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: 'Tech' | 'Business' | 'Arts' | 'Sports' | 'Networking' | 'Workshop';
  date: string;
  time: string;
  venue: Venue;
  organizer: Organizer;
  externalLink?: string;
  image: string;
  tags: string[];
  isFeatured: boolean;
}

export type EventCategory = Event['category'];