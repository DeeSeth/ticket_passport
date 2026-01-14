'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button, Badge, Input } from '@/components/ui';
import EventCard from '@/components/EventCard';
import ListingCard from '@/components/ListingCard';
import { getActiveListings } from '@/lib/mock-data';
import { useEventsSearch } from '@/lib/hooks/use-events';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price_low' | 'price_high'>('date');
  const [viewMode, setViewMode] = useState<'all' | 'resale' | 'events'>('all');

  // Fetch Ticketmaster events
  const { events, loading: eventsLoading } = useEventsSearch({
    keyword: searchQuery || undefined,
    size: 10,
    sort: 'date,asc',
  });

  const listings = useMemo(() => {
    let results = getActiveListings();

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (listing) =>
          listing.event.artist.toLowerCase().includes(query) ||
          listing.event.name.toLowerCase().includes(query) ||
          listing.event.venue.toLowerCase().includes(query) ||
          listing.event.city.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        results.sort((a, b) => a.askingPrice - b.askingPrice);
        break;
      case 'price_high':
        results.sort((a, b) => b.askingPrice - a.askingPrice);
        break;
      case 'date':
      default:
        results.sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime());
        break;
    }

    return results;
  }, [searchQuery, sortBy]);

  // Filter events by search query
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;
    const query = searchQuery.toLowerCase();
    return events.filter(
      (event) =>
        event.artist.toLowerCase().includes(query) ||
        event.name.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.city.toLowerCase().includes(query)
    );
  }, [events, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Marketplace</h1>
        <p className="text-neutral-400">Browse verified resale tickets with Entry Guarantee</p>
      </div>

      {/* Trust banner */}
      <div className="bg-amber-200/10 rounded-xl p-4 border border-amber-200/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-amber-200">PASSPORT Protected</h3>
            <p className="text-sm text-neutral-400 mt-1">
              All tickets on this marketplace are cleared by PASSPORT. Your purchase is protected by our Entry Guarantee.
            </p>
          </div>
        </div>
      </div>

      {/* View mode tabs */}
      <div className="flex gap-2 border-b border-neutral-700">
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            viewMode === 'all'
              ? 'border-amber-200 text-amber-200'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setViewMode('resale')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            viewMode === 'resale'
              ? 'border-amber-200 text-amber-200'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Resale Tickets ({listings.length})
        </button>
        <button
          onClick={() => setViewMode('events')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            viewMode === 'events'
              ? 'border-amber-200 text-amber-200'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Upcoming Events ({filteredEvents.length})
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by artist, event, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            dark
          />
        </div>
        {viewMode !== 'events' && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2.5 rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="date">Sort by Date</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        )}
      </div>

      {/* Resale Listings Section */}
      {(viewMode === 'all' || viewMode === 'resale') && listings.length > 0 && (
        <>
          {viewMode === 'all' && (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Resale Tickets</h2>
              <Link href="/marketplace?view=resale">
                <Button variant="outline" size="sm" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700">
                  View All
                </Button>
              </Link>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {listings.slice(0, viewMode === 'all' ? 4 : undefined).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}

      {/* Ticketmaster Events Section */}
      {(viewMode === 'all' || viewMode === 'events') && (
        <>
          {viewMode === 'all' && (
            <div className="flex items-center justify-between mt-8">
              <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
              <Link href="/discover">
                <Button variant="outline" size="sm" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700">
                  View All
                </Button>
              </Link>
            </div>
          )}

          {eventsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neutral-700 border-t-amber-200"></div>
              <p className="text-neutral-400 mt-4">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredEvents.slice(0, viewMode === 'all' ? 4 : undefined).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  href={`/discover/${event.id}`}
                  badge="Event"
                  badgeVariant="info"
                />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-700/50 rounded-xl p-8 border border-neutral-600/50 text-center">
              <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-1">No events found</h3>
              <p className="text-neutral-400">
                {searchQuery
                  ? `No events found for "${searchQuery}". Try a different search.`
                  : 'No upcoming events available at this time.'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Empty state when both are empty */}
      {viewMode === 'resale' && listings.length === 0 && (
        <div className="bg-neutral-700/50 rounded-xl p-8 border border-neutral-600/50 text-center">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">No resale tickets found</h3>
          <p className="text-neutral-400">
            {searchQuery
              ? `No resale tickets found for "${searchQuery}". Try a different search.`
              : 'No tickets are currently available for resale on the marketplace.'}
          </p>
        </div>
      )}
    </div>
  );
}
