'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button, Badge } from '@/components/ui';
import AuctionCountdown from '@/components/AuctionCountdown';
import {
  getSellerListings,
  cancelListing,
  StoredListing,
} from '@/lib/listing-store';
import { formatCurrency } from '@/lib/mock-data';

type FilterType = 'active' | 'sold' | 'cancelled' | 'all';

export default function MyListingsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>('active');
  const [listings, setListings] = useState<StoredListing[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Load listings
  useEffect(() => {
    if (user) {
      setListings(getSellerListings(user.id));
    }
  }, [user]);

  // Filter listings
  const filteredListings = useMemo(() => {
    switch (filter) {
      case 'active':
        return listings.filter(l => l.status === 'active');
      case 'sold':
        return listings.filter(l => l.status === 'sold');
      case 'cancelled':
        return listings.filter(l => l.status === 'cancelled' || l.status === 'expired');
      default:
        return listings;
    }
  }, [listings, filter]);

  // Stats
  const stats = useMemo(() => {
    const active = listings.filter(l => l.status === 'active').length;
    const sold = listings.filter(l => l.status === 'sold').length;
    const totalEarnings = listings
      .filter(l => l.status === 'sold')
      .reduce((sum, l) => sum + l.askingPrice, 0);
    const activeValue = listings
      .filter(l => l.status === 'active')
      .reduce((sum, l) => {
        if (l.listingType === 'auction') {
          return sum + (l.currentHighestBid || l.minimumBid || 0);
        }
        return sum + l.askingPrice;
      }, 0);
    return { active, sold, totalEarnings, activeValue };
  }, [listings]);

  const handleCancelListing = async (listingId: string) => {
    setCancellingId(listingId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = cancelListing(listingId);
    if (result.success) {
      setListings(prev => prev.map(l =>
        l.id === listingId ? { ...l, status: 'cancelled' as const } : l
      ));
    }
    setCancellingId(null);
  };

  const getStatusBadge = (listing: StoredListing) => {
    switch (listing.status) {
      case 'active':
        return listing.listingType === 'auction'
          ? <Badge variant="info">Auction Active</Badge>
          : <Badge variant="success">Listed</Badge>;
      case 'sold':
        return <Badge variant="success">Sold</Badge>;
      case 'cancelled':
        return <Badge variant="default">Cancelled</Badge>;
      case 'expired':
        return <Badge variant="warning">Expired</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/wallet" className="text-neutral-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-white">My Listings</h1>
          </div>
          <p className="text-neutral-400 mt-1">Manage your ticket listings</p>
        </div>
        <Link href="/sell">
          <Button variant="gold">Sell a Ticket</Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Active Listings</p>
          <p className="text-2xl font-bold text-white">{stats.active}</p>
        </div>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Tickets Sold</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.sold}</p>
        </div>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Total Earnings</p>
          <p className="text-2xl font-bold text-amber-200">
            {stats.totalEarnings > 0 ? formatCurrency(stats.totalEarnings, 'USD') : '$0'}
          </p>
        </div>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Active Listing Value</p>
          <p className="text-2xl font-bold text-white">
            {stats.activeValue > 0 ? formatCurrency(stats.activeValue, 'USD') : '$0'}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-neutral-700">
        {(['active', 'sold', 'cancelled', 'all'] as FilterType[]).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 font-medium capitalize transition-colors relative ${
              filter === filterOption
                ? 'text-amber-200'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {filterOption}
            {filter === filterOption && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-200"></div>
            )}
          </button>
        ))}
      </div>

      {/* Listings list */}
      {filteredListings.length > 0 ? (
        <div className="space-y-4">
          {filteredListings.map((listing) => {
            const isAuction = listing.listingType === 'auction';
            const auctionEnded = isAuction && listing.auctionEndsAt
              ? new Date(listing.auctionEndsAt) <= new Date()
              : false;

            return (
              <div
                key={listing.id}
                className={`bg-neutral-700/50 rounded-xl border overflow-hidden ${
                  listing.status === 'active'
                    ? 'border-neutral-600/50'
                    : 'border-neutral-700/30'
                }`}
              >
                <div className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Event info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-neutral-900 text-2xl font-bold">
                          {listing.eventArtist.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-white">{listing.eventArtist}</h3>
                          {getStatusBadge(listing)}
                        </div>
                        <p className="text-sm text-neutral-400">{listing.eventName}</p>
                        <p className="text-sm text-neutral-500">
                          {listing.section} • Row {listing.row} • Seat {listing.seat}
                        </p>
                      </div>
                    </div>

                    {/* Listing details */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8">
                      {/* Price */}
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-neutral-500">
                          {isAuction
                            ? listing.currentHighestBid ? 'Current Bid' : 'Starting Bid'
                            : 'Asking Price'}
                        </p>
                        <p className="text-xl font-bold text-amber-200">
                          {isAuction
                            ? formatCurrency(listing.currentHighestBid || listing.minimumBid || 0, listing.currency)
                            : formatCurrency(listing.askingPrice, listing.currency)}
                        </p>
                        {isAuction && listing.totalBids && listing.totalBids > 0 && (
                          <p className="text-xs text-blue-400">
                            {listing.totalBids} {listing.totalBids === 1 ? 'bid' : 'bids'}
                          </p>
                        )}
                      </div>

                      {/* Countdown or date */}
                      <div className="min-w-[140px]">
                        {isAuction && listing.status === 'active' && listing.auctionEndsAt && !auctionEnded ? (
                          <AuctionCountdown
                            endsAt={listing.auctionEndsAt}
                            size="sm"
                            showLabel
                          />
                        ) : (
                          <div className="text-sm text-neutral-500">
                            Listed {new Date(listing.listedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {listing.status === 'active' && (
                          <>
                            <Link href={`/marketplace/${listing.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                              >
                                View Listing
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600/50 text-red-400 hover:bg-red-900/20"
                              onClick={() => handleCancelListing(listing.id)}
                              disabled={cancellingId === listing.id}
                            >
                              {cancellingId === listing.id ? 'Cancelling...' : 'Cancel'}
                            </Button>
                          </>
                        )}
                        {listing.status === 'sold' && (
                          <Badge variant="success">
                            Sold for {formatCurrency(listing.askingPrice, listing.currency)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Auction info */}
                  {isAuction && listing.status === 'active' && !auctionEnded && (
                    <div className="mt-4 pt-4 border-t border-neutral-600/50">
                      <div className="flex items-center gap-2 text-blue-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">
                          Auction in progress. You&apos;ll be notified when it ends.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-neutral-700/50 rounded-xl p-8 border border-neutral-600/50 text-center">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">
            {filter === 'active' ? 'No active listings' : filter === 'sold' ? 'No sold tickets' : filter === 'cancelled' ? 'No cancelled listings' : 'No listings yet'}
          </h3>
          <p className="text-neutral-400 mb-4">
            {filter === 'active'
              ? "You don't have any active ticket listings."
              : filter === 'sold'
              ? "You haven't sold any tickets yet."
              : filter === 'cancelled'
              ? "You don't have any cancelled listings."
              : "Start selling your tickets on the marketplace."}
          </p>
          <Link href="/sell">
            <Button variant="gold">Sell a Ticket</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
