'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button, Badge } from '@/components/ui';
import TicketCard from '@/components/TicketCard';
import AuctionCountdown from '@/components/AuctionCountdown';
import { mockTickets, getEventById, getTicketById, formatCurrency } from '@/lib/mock-data';
import { getUserPurchases } from '@/lib/purchase-store';
import { getActiveBids, getUnreadNotifications, StoredBid, OutbidNotification } from '@/lib/bid-store';
import { getActiveSellerListings, StoredListing } from '@/lib/listing-store';

type FilterType = 'all' | 'upcoming' | 'past';

export default function WalletPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>('upcoming');
  const [activeBids, setActiveBids] = useState<StoredBid[]>([]);
  const [notifications, setNotifications] = useState<OutbidNotification[]>([]);
  const [activeListings, setActiveListings] = useState<StoredListing[]>([]);

  // Load active bids and listings
  useEffect(() => {
    if (user) {
      setActiveBids(getActiveBids(user.id));
      setNotifications(getUnreadNotifications(user.id));
      setActiveListings(getActiveSellerListings(user.id));
    }
  }, [user]);

  // Get user's tickets with event data (including purchased tickets)
  const userTickets = useMemo(() => {
    if (!user) return [];

    // Get tickets owned by user (from mock data)
    const ownedTickets = mockTickets
      .filter(ticket => ticket.ownerId === user.id)
      .map(ticket => ({
        ticket,
        event: getEventById(ticket.eventId)!,
        isPurchased: false,
      }))
      .filter(({ event }) => event !== undefined);

    // Get tickets purchased by user (from localStorage)
    const purchases = getUserPurchases(user.id);
    const purchasedTickets = purchases
      .map(purchase => {
        const ticket = getTicketById(purchase.ticketId);
        if (!ticket) return null;
        const event = getEventById(purchase.eventId);
        if (!event) return null;
        return {
          ticket,
          event,
          isPurchased: true,
        };
      })
      .filter((item): item is { ticket: any; event: any; isPurchased: boolean } => item !== null);

    // Combine and deduplicate (in case a ticket appears in both lists)
    const allTickets = [...ownedTickets, ...purchasedTickets];
    const uniqueTickets = allTickets.filter(
      (item, index, self) => self.findIndex(t => t.ticket.id === item.ticket.id) === index
    );

    return uniqueTickets;
  }, [user]);

  // Filter tickets
  const filteredTickets = useMemo(() => {
    const now = new Date();
    return userTickets.filter(({ event }) => {
      const eventDate = new Date(event.date);
      switch (filter) {
        case 'upcoming':
          return eventDate >= now;
        case 'past':
          return eventDate < now;
        default:
          return true;
      }
    });
  }, [userTickets, filter]);

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = userTickets.filter(({ event }) => new Date(event.date) >= now).length;
    const listed = userTickets.filter(({ ticket }) => ticket.resaleStatus === 'listed').length;
    const cleared = userTickets.filter(({ ticket }) => ticket.isCleared).length;
    return { total: userTickets.length, upcoming, listed, cleared };
  }, [userTickets]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Tickets</h1>
          <p className="text-neutral-400">Manage your concert tickets</p>
        </div>
        <div className="flex gap-3">
          <Link href="/wallet/listings">
            <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700 relative">
              My Listings
              {activeListings.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-xs font-bold text-white flex items-center justify-center">
                  {activeListings.length}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/wallet/bids">
            <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700 relative">
              My Bids
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full text-xs font-bold text-neutral-900 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="gold">Browse Marketplace</Button>
          </Link>
        </div>
      </div>

      {/* Active Listings Banner */}
      {activeListings.length > 0 && (
        <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-300">
                  {activeListings.length} Active Listing{activeListings.length > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-emerald-400/80 mt-1">
                  {activeListings.filter(l => l.listingType === 'auction').length > 0
                    ? `You have ${activeListings.filter(l => l.listingType === 'auction').length} auction${activeListings.filter(l => l.listingType === 'auction').length > 1 ? 's' : ''} in progress.`
                    : 'Your tickets are listed on the marketplace.'}
                </p>
              </div>
            </div>
            <Link href="/wallet/listings">
              <Button size="sm" variant="outline" className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/30">
                Manage Listings
              </Button>
            </Link>
          </div>

          {/* Quick preview of active listings */}
          {activeListings.slice(0, 2).map((listing) => (
            <div
              key={listing.id}
              className="mt-4 pt-4 border-t border-emerald-700/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-900/50 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-300 font-bold">{listing.eventArtist.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{listing.eventArtist}</p>
                  <p className="text-emerald-400/70 text-xs">
                    {listing.listingType === 'auction'
                      ? `Starting at ${formatCurrency(listing.minimumBid || 0, listing.currency)}`
                      : `Listed at ${formatCurrency(listing.askingPrice, listing.currency)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={listing.listingType === 'auction' ? 'info' : 'success'} size="sm">
                  {listing.listingType === 'auction' ? 'Auction' : 'Fixed Price'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Bids Banner */}
      {activeBids.length > 0 && (
        <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-300">
                  {activeBids.length} Active Bid{activeBids.length > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-blue-400/80 mt-1">
                  {activeBids.filter(b => b.status === 'winning').length > 0
                    ? `You're winning ${activeBids.filter(b => b.status === 'winning').length} auction${activeBids.filter(b => b.status === 'winning').length > 1 ? 's' : ''}!`
                    : 'You have active bids on auction tickets.'}
                </p>
              </div>
            </div>
            <Link href="/wallet/bids">
              <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-300 hover:bg-blue-900/30">
                View Bids
              </Button>
            </Link>
          </div>

          {/* Quick preview of active bids */}
          {activeBids.slice(0, 2).map((bid) => (
            <div
              key={bid.id}
              className="mt-4 pt-4 border-t border-blue-700/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <span className="text-blue-300 font-bold">{bid.eventArtist.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{bid.eventArtist}</p>
                  <p className="text-blue-400/70 text-xs">
                    Your bid: {formatCurrency(bid.amount, bid.currency)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {bid.status === 'winning' ? (
                  <Badge variant="success" size="sm">Winning</Badge>
                ) : (
                  <Badge variant="warning" size="sm">Outbid</Badge>
                )}
                <AuctionCountdown endsAt={bid.auctionEndsAt} size="sm" showLabel={false} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Outbid Alert */}
      {notifications.length > 0 && (
        <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-300">You&apos;ve been outbid!</h3>
              <p className="text-sm text-amber-400/80 mt-1">
                Someone placed a higher bid on {notifications.length} auction{notifications.length > 1 ? 's' : ''}.
                Increase your bid to stay in the running.
              </p>
              <Link href="/wallet/bids">
                <Button size="sm" variant="gold" className="mt-3">View & Rebid</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Total Tickets</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Upcoming Events</p>
          <p className="text-2xl font-bold text-amber-200">{stats.upcoming}</p>
        </div>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Listed for Sale</p>
          <p className="text-2xl font-bold text-orange-400">{stats.listed}</p>
        </div>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Cleared by PASSPORT</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.cleared}</p>
        </div>
      </div>

      {/* Entry Guarantee Banner - show if user is verified */}
      {user?.isVerified && (
        <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-300">Entry Guarantee Active</h3>
              <p className="text-sm text-emerald-400/80 mt-1">
                All your cleared tickets are protected. If you&apos;re denied entry for validity reasons, you&apos;ll receive an automatic refund.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Not verified banner */}
      {!user?.isVerified && (
        <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-300">Verify Your Identity</h3>
              <p className="text-sm text-amber-400/80 mt-1">
                Complete identity verification to unlock Entry Guarantee for all your tickets.
              </p>
              <Link href="/verify">
                <Button size="sm" variant="gold" className="mt-3">Verify Now</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-neutral-700">
        {(['upcoming', 'past', 'all'] as FilterType[]).map((filterOption) => (
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

      {/* Tickets grid */}
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTickets.map(({ ticket, event }) => (
            <TicketCard key={ticket.id} ticket={ticket} event={event} />
          ))}
        </div>
      ) : (
        <div className="bg-neutral-700/50 rounded-xl p-8 border border-neutral-600/50 text-center">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">No {filter} tickets</h3>
          <p className="text-neutral-400 mb-4">
            {filter === 'upcoming'
              ? "You don't have any upcoming events."
              : filter === 'past'
              ? "You haven't attended any events yet."
              : "You don't have any tickets yet."}
          </p>
          <Link href="/marketplace">
            <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700">Browse Marketplace</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
