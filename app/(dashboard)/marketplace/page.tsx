'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button, Badge, Input } from '@/components/ui';
import ResaleRulesDisplay from '@/components/ResaleRules';
import { getActiveListings, formatCurrency, getMaxResalePrice } from '@/lib/mock-data';
import { canAccessMarketplace } from '@/lib/verification-utils';

export default function MarketplacePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price_low' | 'price_high'>('date');
  const isVerified = canAccessMarketplace(user);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Marketplace</h1>
        <p className="text-neutral-400">Browse verified resale tickets with Entry Guarantee</p>
      </div>

      {/* Verification warning for unverified users */}
      {!isVerified && (
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-200/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-amber-200">Browsing Only</p>
                <p className="text-sm text-neutral-400">Complete verification to buy tickets</p>
              </div>
            </div>
            <Link href="/verify">
              <Button variant="gold" size="sm">
                Verify Now
              </Button>
            </Link>
          </div>
        </div>
      )}

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
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2.5 rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="date">Sort by Date</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

      {/* Listings */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {listings.map((listing) => {
            const maxPrice = getMaxResalePrice(listing.ticket, listing.event);
            const isPriceWithinCap = listing.askingPrice <= maxPrice;
            const savings = maxPrice - listing.askingPrice;

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
                      <Badge variant="cleared" size="sm">Cleared</Badge>
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
                      </div>
                      <Link href={`/marketplace/${listing.id}`}>
                        <Button size="sm" variant="gold">View Details</Button>
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
      ) : (
        <div className="bg-neutral-700/50 rounded-xl p-8 border border-neutral-600/50 text-center">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">No tickets found</h3>
          <p className="text-neutral-400">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search.`
              : 'No tickets are currently available on the marketplace.'}
          </p>
        </div>
      )}
    </div>
  );
}
