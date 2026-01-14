/**
 * Ticketmaster Discovery API Client
 * Handles all interactions with the Ticketmaster API
 */

import cache from './cache';
import { Event, ResaleRules } from './types';

const API_KEY = process.env.TICKETMASTER_API_KEY;
const API_URL = process.env.TICKETMASTER_API_URL || 'https://app.ticketmaster.com/discovery/v2';

// Default resale rules for Ticketmaster events
const DEFAULT_RESALE_RULES: ResaleRules = {
  maxPriceMultiplier: 1.5,
  fanOnlyWindowHours: 48,
  transferDeadlineHours: 24,
  requiresIdMatch: true,
  charityPercentage: 10,
};

// Ticketmaster API response types
interface TicketmasterEvent {
  id: string;
  name: string;
  type?: string;
  url?: string;
  locale?: string;
  images?: Array<{
    url: string;
    ratio?: string;
    width?: number;
    height?: number;
  }>;
  sales?: {
    public?: {
      startDateTime?: string;
      endDateTime?: string;
    };
  };
  dates?: {
    start?: {
      dateTime?: string;
      localDate?: string;
      localTime?: string;
    };
    timezone?: string;
    status?: {
      code?: string;
    };
  };
  classifications?: Array<{
    primary?: boolean;
    segment?: {
      id?: string;
      name?: string;
    };
    genre?: {
      id?: string;
      name?: string;
    };
    subGenre?: {
      id?: string;
      name?: string;
    };
  }>;
  priceRanges?: Array<{
    type?: string;
    currency?: string;
    min?: number;
    max?: number;
  }>;
  _embedded?: {
    venues?: Array<{
      name?: string;
      type?: string;
      id?: string;
      url?: string;
      locale?: string;
      postalCode?: string;
      timezone?: string;
      city?: {
        name?: string;
      };
      state?: {
        name?: string;
        stateCode?: string;
      };
      country?: {
        name?: string;
        countryCode?: string;
      };
      address?: {
        line1?: string;
      };
      location?: {
        longitude?: string;
        latitude?: string;
      };
    }>;
    attractions?: Array<{
      name?: string;
      type?: string;
      id?: string;
      url?: string;
      locale?: string;
      images?: Array<{
        url: string;
        ratio?: string;
        width?: number;
        height?: number;
      }>;
      classifications?: Array<{
        primary?: boolean;
        segment?: {
          id?: string;
          name?: string;
        };
        genre?: {
          id?: string;
          name?: string;
        };
      }>;
    }>;
  };
}

interface TicketmasterSearchResponse {
  _embedded?: {
    events?: TicketmasterEvent[];
  };
  page?: {
    size?: number;
    totalElements?: number;
    totalPages?: number;
    number?: number;
  };
}

export interface SearchEventsParams {
  keyword?: string;
  location?: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
  startDateTime?: string;
  endDateTime?: string;
  classificationName?: string; // Music, Sports, Arts & Theatre, etc.
  classificationId?: string;
  page?: number;
  size?: number;
  sort?: 'date,asc' | 'date,desc' | 'name,asc' | 'name,desc' | 'relevance,desc';
}

/**
 * Transform Ticketmaster event to internal Event type
 */
function transformTicketmasterEvent(tmEvent: TicketmasterEvent): Event {
  const venue = tmEvent._embedded?.venues?.[0];
  const attraction = tmEvent._embedded?.attractions?.[0];
  const image = tmEvent.images?.[0] || attraction?.images?.[0];

  return {
    id: `tm-${tmEvent.id}`, // Prefix with 'tm-' to differentiate from our listings
    name: tmEvent.name,
    artist: attraction?.name || 'Various Artists',
    venue: venue?.name || 'TBA',
    city: venue?.city?.name || 'TBA',
    country: venue?.country?.countryCode || 'US',
    date: tmEvent.dates?.start?.dateTime || tmEvent.dates?.start?.localDate || new Date().toISOString(),
    imageUrl: image?.url,
    description: `${tmEvent.name} at ${venue?.name || 'TBA'}`,
    resaleRules: DEFAULT_RESALE_RULES,
  };
}

/**
 * Search for events using Ticketmaster Discovery API
 */
export async function searchEvents(params: SearchEventsParams): Promise<{
  events: Event[];
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}> {
  if (!API_KEY) {
    throw new Error('TICKETMASTER_API_KEY is not configured');
  }

  // Create cache key from params
  const cacheKey = `tm-search:${JSON.stringify(params)}`;

  // Check cache first
  const cached = cache.get<any>(cacheKey);
  if (cached) {
    return cached;
  }

  // Build query parameters
  const queryParams = new URLSearchParams({
    apikey: API_KEY,
    classificationName: params.classificationName || 'Music', // Default to music events
    size: String(params.size || 20),
    page: String(params.page || 0),
    sort: params.sort || 'date,asc',
  });

  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.city) queryParams.append('city', params.city);
  if (params.stateCode) queryParams.append('stateCode', params.stateCode);
  if (params.countryCode) queryParams.append('countryCode', params.countryCode);
  if (params.startDateTime) queryParams.append('startDateTime', params.startDateTime);
  if (params.endDateTime) queryParams.append('endDateTime', params.endDateTime);

  const url = `${API_URL}/events.json?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status} ${response.statusText}`);
    }

    const data: TicketmasterSearchResponse = await response.json();

    const events = (data._embedded?.events || []).map(transformTicketmasterEvent);

    const result = {
      events,
      page: {
        size: data.page?.size || 0,
        totalElements: data.page?.totalElements || 0,
        totalPages: data.page?.totalPages || 0,
        number: data.page?.number || 0,
      },
    };

    // Cache for 5 minutes
    cache.set(cacheKey, result, 300);

    return result;
  } catch (error) {
    console.error('Error searching Ticketmaster events:', error);
    throw error;
  }
}

/**
 * Get a single event by Ticketmaster ID
 */
export async function getEventById(eventId: string): Promise<Event | null> {
  if (!API_KEY) {
    throw new Error('TICKETMASTER_API_KEY is not configured');
  }

  // Remove 'tm-' prefix if present
  const tmId = eventId.startsWith('tm-') ? eventId.slice(3) : eventId;

  // Check cache first
  const cacheKey = `tm-event:${tmId}`;
  const cached = cache.get<Event>(cacheKey);
  if (cached) {
    return cached;
  }

  const url = `${API_URL}/events/${tmId}.json?apikey=${API_KEY}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Ticketmaster API error: ${response.status} ${response.statusText}`);
    }

    const data: TicketmasterEvent = await response.json();
    const event = transformTicketmasterEvent(data);

    // Cache for 30 minutes
    cache.set(cacheKey, event, 1800);

    return event;
  } catch (error) {
    console.error(`Error fetching Ticketmaster event ${tmId}:`, error);
    throw error;
  }
}

/**
 * Search for attractions (artists, bands, performers)
 */
export async function searchAttractions(keyword: string): Promise<Array<{
  id: string;
  name: string;
  imageUrl?: string;
}>> {
  if (!API_KEY) {
    throw new Error('TICKETMASTER_API_KEY is not configured');
  }

  const cacheKey = `tm-attractions:${keyword}`;
  const cached = cache.get<any>(cacheKey);
  if (cached) {
    return cached;
  }

  const url = `${API_URL}/attractions.json?apikey=${API_KEY}&keyword=${encodeURIComponent(keyword)}&size=10`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status} ${response.statusText}`);
    }

    const data: any = await response.json();

    const attractions = (data._embedded?.attractions || []).map((attraction: any) => ({
      id: attraction.id,
      name: attraction.name,
      imageUrl: attraction.images?.[0]?.url,
    }));

    // Cache for 1 hour
    cache.set(cacheKey, attractions, 3600);

    return attractions;
  } catch (error) {
    console.error('Error searching Ticketmaster attractions:', error);
    throw error;
  }
}
