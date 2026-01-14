'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button, Badge, Input } from '@/components/ui';
import ResaleRulesDisplay from '@/components/ResaleRules';
import { getActiveListings as getMockListings, formatCurrency, getMaxResalePrice, getEventById, getTicketById, getUserById } from '@/lib/mock-data';
import { useEventsSearch } from '@/lib/hooks/use-events';
import { getActiveListings as getUserListings, StoredListing } from '@/lib/listing-store';
import { useAuth } from '@/lib/auth-context';

// Common display format for listings (supports both mock and user-created)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DisplayListing = any;

export default function MarketplacePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price_low' | 'price_high'>('date');
  const [viewMode, setViewMode] = useState<'all' | 'resale' | 'events'>('all');
  const [userListings, setUserListings] = useState<StoredListing[]>([]);

  // Load user listings from localStorage
  useEffect(() => {
    setUserListings(getUserListings());
  }, []);

  // Fetch Ticketmaster events
  const { events, loading: eventsLoading } = useEventsSearch({
    keyword: searchQuery || undefined,
    size: 10,
    sort: 'date,asc',
  });

  const listings = useMemo(() => {
    // Get mock listings
    const mockListings = getMockListings();

    // Transform user listings to match display format
    const transformedUserListings: DisplayListing[] = userListings
      .filter(ul => ul.sellerId !== user?.id) // Don't show your own listings
      .map(ul => ({
        id: ul.id,
        askingPrice: ul.askingPrice,
        isAuction: ul.listingType === 'auction',
        minimumBid: ul.minimumBid,
        currentHighestBid: ul.currentHighestBid,
        reservePrice: ul.reservePrice,
        auctionEndsAt: ul.auctionEndsAt ? new Date(ul.auctionEndsAt) : undefined,
        totalBids: ul.totalBids,
        ticket: {
          id: ul.ticketId,
          section: ul.section,
          row: ul.row,
          seat: ul.seat,
          faceValue: ul.faceValue,
          currency: ul.currency,
        },
        event: {
          id: ul.eventId,
          artist: ul.eventArtist,
          name: ul.eventName,
          venue: ul.eventVenue,
          city: ul.eventCity,
          country: ul.eventCountry,
          date: ul.eventDate,
          resaleRules: {
            priceCap: { type: 'percentage', value: 120 }, // Default rules
            charityPercentage: 10,
            artistShare: 5,
          },
        },
        seller: {
          id: ul.sellerId,
          name: ul.sellerName,
        },
        isUserListing: true,
      }));

    // Combine mock and user listings
    let results: DisplayListing[] = [...mockListings, ...transformedUserListings];

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
        results.sort((a, b) => {
          const priceA = a.isAuction ? (a.currentHighestBid || a.minimumBid || 0) : a.askingPrice;
          const priceB = b.isAuction ? (b.currentHighestBid || b.minimumBid || 0) : b.askingPrice;
          return priceA - priceB;
        });
        break;
      case 'price_high':
        results.sort((a, b) => {
          const priceA = a.isAuction ? (a.currentHighestBid || a.minimumBid || 0) : a.askingPrice;
          const priceB = b.isAuction ? (b.currentHighestBid || b.minimumBid || 0) : b.askingPrice;
          return priceB - priceA;
        });
        break;
      case 'date':
      default:
        results.sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime());
        break;
    }

    return results;
  }, [searchQuery, sortBy, userListings, user?.id]);

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {listings.slice(0, viewMode === 'all' ? 4 : undefined).map((listing) => {
            const maxPrice = getMaxResalePrice(listing.ticket, listing.event);
            const isPriceWithinCap = !listing.isAuction && listing.askingPrice <= maxPrice;
            const savings = maxPrice - listing.askingPrice;

            // Calculate time remaining for auction
            const timeRemaining = listing.isAuction && listing.auctionEndsAt
              ? Math.max(0, new Date(listing.auctionEndsAt).getTime() - new Date().getTime())
              : 0;
            const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
            const daysRemaining = Math.floor(hoursRemaining / 24);

            return (
              <div key={listing.id} className="bg-neutral-700/50 rounded-xl border border-neutral-600/50 overflow-hidden hover:border-amber-200/30 transition-colors">
                <div className="flex flex-col sm:flex-row">
                  {/* Event image placeholder */}
                  <div className="sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-neutral-700 to-neutral-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-200/20 text-4xl font-bold">
                      {listing.event.artist.charAt(0)}
                    </span>
                  </div>

                  {/* Listing details */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-white">{listing.event.artist}</h3>
                        <p className="text-sm text-neutral-400">{listing.event.name}</p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <Badge variant="cleared" size="sm">Cleared</Badge>
                        {listing.isAuction && (
                          <Badge variant="info" size="sm">Auction</Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-neutral-500">
                      {listing.event.venue}, {listing.event.city}
                    </p>
                    <p className="text-sm text-neutral-500 mb-3">
                      {new Date(listing.event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      {listing.ticket.section} • Row {listing.ticket.row} • Seat {listing.ticket.seat}
                    </div>

                    {/* Price section */}
                    <div className="flex items-end justify-between">
                      <div>
                        {listing.isAuction ? (
                          <>
                            <p className="text-xs text-neutral-500">
                              {listing.currentHighestBid ? 'Current bid' : 'Starting bid'}
                            </p>
                            <p className="text-xl font-bold text-amber-200">
                              {formatCurrency(listing.currentHighestBid || listing.minimumBid || 0, listing.ticket.currency)}
                            </p>
                            {listing.totalBids && listing.totalBids > 0 && (
                              <p className="text-xs text-blue-400">
                                {listing.totalBids} {listing.totalBids === 1 ? 'bid' : 'bids'}
                              </p>
                            )}
                            {timeRemaining > 0 && (
                              <p className="text-xs text-neutral-500 mt-1">
                                {daysRemaining > 0
                                  ? `Ends in ${daysRemaining}d ${hoursRemaining % 24}h`
                                  : `Ends in ${hoursRemaining}h`
                                }
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-neutral-500">
                              Face value: {formatCurrency(listing.ticket.faceValue, listing.ticket.currency)}
                            </p>
                            <p className="text-xl font-bold text-amber-200">
                              {formatCurrency(listing.askingPrice, listing.ticket.currency)}
                            </p>
                            {isPriceWithinCap && savings > 0 && (
                              <p className="text-xs text-emerald-400">
                                {formatCurrency(savings, listing.ticket.currency)} below cap
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      <Link href={`/marketplace/${listing.id}`}>
                        <Button size="sm" variant="gold">
                          {listing.isAuction ? 'Place Bid' : 'View Details'}
                        </Button>
                      </Link>
                    </div>

                    {/* Resale rules summary */}
                    <div className="mt-3 pt-3 border-t border-neutral-600/50">
                      <ResaleRulesDisplay
                        rules={listing.event.resaleRules}
                        faceValue={listing.ticket.faceValue}
                        currency={listing.ticket.currency}
                        compact
                        dark
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.slice(0, viewMode === 'all' ? 4 : undefined).map((event) => {
                const eventDate = new Date(event.date);
                return (
                  <Link
                    key={event.id}
                    href={`/discover/${event.id}`}
                    className="bg-neutral-700/50 rounded-xl border border-neutral-600/50 overflow-hidden hover:border-amber-200/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Event image */}
                      {event.imageUrl ? (
                        <div className="sm:w-48 h-32 sm:h-auto relative flex-shrink-0">
                          <img
                            src={event.imageUrl}
                            alt={event.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-neutral-700 to-neutral-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-200/20 text-4xl font-bold">
                            {event.artist.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Event details */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-bold text-white">{event.artist}</h3>
                            <p className="text-sm text-neutral-400">{event.name}</p>
                          </div>
                          <Badge variant="info" size="sm">
                            Event
                          </Badge>
                        </div>

                        <p className="text-sm text-neutral-500">
                          {event.venue}, {event.city}
                        </p>
                        <p className="text-sm text-neutral-500 mb-3">
                          {eventDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>

                        <div className="mt-3 pt-3 border-t border-neutral-600/50">
                          <p className="text-xs text-neutral-500">Powered by Ticketmaster</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
