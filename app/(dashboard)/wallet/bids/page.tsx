'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button, Badge } from '@/components/ui';
import AuctionCountdown from '@/components/AuctionCountdown';
import {
  getUserBids,
  getActiveBids,
  withdrawBid,
  StoredBid,
  getUnreadNotifications,
  markAllNotificationsRead,
  OutbidNotification,
} from '@/lib/bid-store';
import { formatCurrency } from '@/lib/mock-data';

type FilterType = 'active' | 'won' | 'lost' | 'all';

export default function MyBidsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>('active');
  const [bids, setBids] = useState<StoredBid[]>([]);
  const [notifications, setNotifications] = useState<OutbidNotification[]>([]);
  const [withdrawingBid, setWithdrawingBid] = useState<string | null>(null);

  // Load bids and notifications
  useEffect(() => {
    if (user) {
      setBids(getUserBids(user.id));
      setNotifications(getUnreadNotifications(user.id));
    }
  }, [user]);

  // Mark notifications as read when viewing bids
  useEffect(() => {
    if (user && notifications.length > 0) {
      markAllNotificationsRead(user.id);
    }
  }, [user, notifications.length]);

  // Filter bids
  const filteredBids = useMemo(() => {
    switch (filter) {
      case 'active':
        return bids.filter(b => b.status === 'active' || b.status === 'winning');
      case 'won':
        return bids.filter(b => b.status === 'won');
      case 'lost':
        return bids.filter(b => b.status === 'lost' || b.status === 'outbid');
      default:
        return bids;
    }
  }, [bids, filter]);

  // Stats
  const stats = useMemo(() => {
    const active = bids.filter(b => b.status === 'active' || b.status === 'winning').length;
    const winning = bids.filter(b => b.status === 'winning').length;
    const won = bids.filter(b => b.status === 'won').length;
    const totalBidValue = bids
      .filter(b => b.status === 'active' || b.status === 'winning')
      .reduce((sum, b) => sum + b.amount, 0);
    return { active, winning, won, totalBidValue };
  }, [bids]);

  const handleWithdrawBid = async (bidId: string) => {
    setWithdrawingBid(bidId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = withdrawBid(bidId);
    if (result.success) {
      setBids(prev => prev.map(b =>
        b.id === bidId ? { ...b, status: 'withdrawn' as const } : b
      ));
    }
    setWithdrawingBid(null);
  };

  const getBidStatusBadge = (status: StoredBid['status']) => {
    switch (status) {
      case 'winning':
        return <Badge variant="success">Winning</Badge>;
      case 'active':
        return <Badge variant="info">Active</Badge>;
      case 'outbid':
        return <Badge variant="warning">Outbid</Badge>;
      case 'won':
        return <Badge variant="success">Won</Badge>;
      case 'lost':
        return <Badge variant="error">Lost</Badge>;
      case 'withdrawn':
        return <Badge variant="default">Withdrawn</Badge>;
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
            <h1 className="text-2xl font-bold text-white">My Bids</h1>
          </div>
          <p className="text-neutral-400 mt-1">Track your auction bids</p>
        </div>
        <Link href="/marketplace">
          <Button variant="gold">Browse Auctions</Button>
        </Link>
      </div>

      {/* Outbid Notifications Alert */}
      {notifications.length > 0 && (
        <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/50">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-300">You&apos;ve been outbid!</h3>
              <p className="text-sm text-amber-400/80 mt-1">
                You have {notifications.length} auction{notifications.length > 1 ? 's' : ''} where you&apos;ve been outbid.
                Place a higher bid to stay in the running.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Active Bids</p>
          <p className="text-2xl font-bold text-white">{stats.active}</p>
        </div>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Currently Winning</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.winning}</p>
        </div>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Auctions Won</p>
          <p className="text-2xl font-bold text-amber-200">{stats.won}</p>
        </div>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <p className="text-sm text-neutral-400">Total Active Bids</p>
          <p className="text-2xl font-bold text-white">
            {stats.totalBidValue > 0 ? formatCurrency(stats.totalBidValue, 'USD') : '$0'}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-neutral-700">
        {(['active', 'won', 'lost', 'all'] as FilterType[]).map((filterOption) => (
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

      {/* Bids list */}
      {filteredBids.length > 0 ? (
        <div className="space-y-4">
          {filteredBids.map((bid) => {
            const auctionEnded = new Date(bid.auctionEndsAt) <= new Date();
            const isOutbid = bid.status === 'outbid';

            return (
              <div
                key={bid.id}
                className={`bg-neutral-700/50 rounded-xl border overflow-hidden transition-colors ${
                  bid.status === 'winning'
                    ? 'border-emerald-600/50'
                    : isOutbid
                    ? 'border-amber-600/50'
                    : 'border-neutral-600/50'
                }`}
              >
                <div className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Event info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-neutral-900 text-2xl font-bold">
                          {bid.eventArtist.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-white">{bid.eventArtist}</h3>
                          {getBidStatusBadge(bid.status)}
                        </div>
                        <p className="text-sm text-neutral-400">{bid.eventName}</p>
                        <p className="text-sm text-neutral-500">
                          {bid.section} • Row {bid.row} • Seat {bid.seat}
                        </p>
                      </div>
                    </div>

                    {/* Bid details */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8">
                      {/* Your bid */}
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-neutral-500">Your Bid</p>
                        <p className={`text-xl font-bold ${
                          bid.status === 'winning' ? 'text-emerald-400' : 'text-white'
                        }`}>
                          {formatCurrency(bid.amount, bid.currency)}
                        </p>
                      </div>

                      {/* Countdown or status */}
                      <div className="min-w-[140px]">
                        {!auctionEnded && (bid.status === 'active' || bid.status === 'winning') ? (
                          <AuctionCountdown
                            endsAt={bid.auctionEndsAt}
                            size="sm"
                            showLabel
                          />
                        ) : (
                          <div className="text-sm text-neutral-500">
                            {auctionEnded ? 'Auction ended' : `Bid placed ${new Date(bid.bidAt).toLocaleDateString()}`}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!auctionEnded && (bid.status === 'active' || bid.status === 'winning' || isOutbid) && (
                          <>
                            <Link href={`/marketplace/${bid.listingId}`}>
                              <Button
                                size="sm"
                                variant={isOutbid ? 'gold' : 'outline'}
                                className={!isOutbid ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-700' : ''}
                              >
                                {isOutbid ? 'Bid Again' : 'View Auction'}
                              </Button>
                            </Link>
                            {bid.status !== 'outbid' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600/50 text-red-400 hover:bg-red-900/20"
                                onClick={() => handleWithdrawBid(bid.id)}
                                disabled={withdrawingBid === bid.id}
                              >
                                {withdrawingBid === bid.id ? 'Withdrawing...' : 'Withdraw'}
                              </Button>
                            )}
                          </>
                        )}
                        {bid.status === 'won' && (
                          <Link href="/wallet">
                            <Button size="sm" variant="gold">
                              View Ticket
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Outbid warning */}
                  {isOutbid && !auctionEnded && (
                    <div className="mt-4 pt-4 border-t border-neutral-600/50">
                      <div className="flex items-center gap-2 text-amber-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">
                          Someone placed a higher bid. Increase your bid to stay in the running.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Winning indicator */}
                  {bid.status === 'winning' && !auctionEnded && (
                    <div className="mt-4 pt-4 border-t border-neutral-600/50">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">
                          You&apos;re currently the highest bidder. Payment held in escrow.
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="font-semibold text-white mb-1">
            {filter === 'active' ? 'No active bids' : filter === 'won' ? 'No won auctions' : filter === 'lost' ? 'No lost auctions' : 'No bids yet'}
          </h3>
          <p className="text-neutral-400 mb-4">
            {filter === 'active'
              ? "You don't have any active bids on auctions."
              : filter === 'won'
              ? "You haven't won any auctions yet."
              : filter === 'lost'
              ? "You haven't lost any auctions yet."
              : "Browse the marketplace to find tickets to bid on."}
          </p>
          <Link href="/marketplace">
            <Button variant="gold">Browse Auctions</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
