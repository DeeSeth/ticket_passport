/**
 * Custom hooks for fetching events from Ticketmaster API
 */

import { useState, useEffect } from 'react';
import { Event } from '../types';

export interface UseEventsSearchParams {
  keyword?: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
  startDateTime?: string;
  endDateTime?: string;
  classificationName?: string;
  page?: number;
  size?: number;
  sort?: 'date,asc' | 'date,desc' | 'name,asc' | 'name,desc' | 'relevance,desc';
}

export interface UseEventsResult {
  events: Event[];
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to search for events using Ticketmaster API
 */
export function useEventsSearch(params: UseEventsSearchParams): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState({
    size: 0,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      // Skip if Ticketmaster is not enabled
      if (process.env.NEXT_PUBLIC_ENABLE_TICKETMASTER !== 'true') {
        setEvents([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Build query string
        const queryParams = new URLSearchParams();
        if (params.keyword) queryParams.append('keyword', params.keyword);
        if (params.city) queryParams.append('city', params.city);
        if (params.stateCode) queryParams.append('stateCode', params.stateCode);
        if (params.countryCode) queryParams.append('countryCode', params.countryCode);
        if (params.startDateTime) queryParams.append('startDateTime', params.startDateTime);
        if (params.endDateTime) queryParams.append('endDateTime', params.endDateTime);
        if (params.classificationName) queryParams.append('classificationName', params.classificationName);
        if (params.page !== undefined) queryParams.append('page', String(params.page));
        if (params.size !== undefined) queryParams.append('size', String(params.size));
        if (params.sort) queryParams.append('sort', params.sort);

        const response = await fetch(`/api/events/search?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data.events || []);
        setPage(data.page || { size: 0, totalElements: 0, totalPages: 0, number: 0 });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [
    params.keyword,
    params.city,
    params.stateCode,
    params.countryCode,
    params.startDateTime,
    params.endDateTime,
    params.classificationName,
    params.page,
    params.size,
    params.sort,
    refetchTrigger,
  ]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return {
    events,
    page,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch a single event by ID
 */
export function useEvent(eventId: string | null): {
  event: Event | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setEvent(null);
        setLoading(false);
        return;
      }

      // Skip if Ticketmaster is not enabled
      if (process.env.NEXT_PUBLIC_ENABLE_TICKETMASTER !== 'true') {
        setEvent(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/events/${eventId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Event not found');
          }
          throw new Error(`Failed to fetch event: ${response.status}`);
        }

        const data = await response.json();
        setEvent(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch event');
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return {
    event,
    loading,
    error,
    refetch,
  };
}
