'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button, Badge, Input } from '@/components/ui';
import PassportScore from '@/components/PassportScore';
import ResaleRulesDisplay from '@/components/ResaleRules';
import AuctionCountdown from '@/components/AuctionCountdown';
import {
  getListingById as getMockListingById,
  getTicketById,
  getEventById,
  getUserById,
  formatCurrency,
  formatEventDate,
  getMaxResalePrice,
  mockUsers,
} from '@/lib/mock-data';
import { addPurchase } from '@/lib/purchase-store';
import {
  placeBid,
  getUserBidOnListing,
  getListingBids,
  generateBidId,
  StoredBid,
} from '@/lib/bid-store';
import {
  getListingById as getUserListingById,
  StoredListing,
  markListingSold,
} from '@/lib/listing-store';

type PurchaseStep = 'details' | 'confirm' | 'processing' | 'success';

export default function MarketplaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const listingId = params.id as string;
  const [step, setStep] = useState<PurchaseStep>('details');

  // Bidding state
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidError, setBidError] = useState<string>('');
  const [userExistingBid, setUserExistingBid] = useState<StoredBid | null>(null);
  const [bidHistory, setBidHistory] = useState<StoredBid[]>([]);
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);

  const listingData = useMemo(() => {
    // First try mock listings
    const mockListing = getMockListingById(listingId);
    if (mockListing) {
      const ticket = getTicketById(mockListing.ticketId);
      if (!ticket) return null;
      const event = getEventById(ticket.eventId);
      if (!event) return null;
      const seller = getUserById(mockListing.sellerId);
      if (!seller) return null;
      return { listing: mockListing, ticket, event, seller, isUserListing: false };
    }

    // Then try user-created listings from localStorage
    const userListing = getUserListingById(listingId);
    if (userListing) {
      // Transform user listing to match expected format
      const transformedListing = {
        id: userListing.id,
        ticketId: userListing.ticketId,
        sellerId: userListing.sellerId,
        askingPrice: userListing.askingPrice,
        isAuction: userListing.listingType === 'auction',
        minimumBid: userListing.minimumBid,
        reservePrice: userListing.reservePrice,
        auctionEndsAt: userListing.auctionEndsAt ? new Date(userListing.auctionEndsAt) : undefined,
        currentHighestBid: userListing.currentHighestBid,
        totalBids: userListing.totalBids,
        status: userListing.status,
        listedAt: new Date(userListing.listedAt),
      };
      const ticket = {
        id: userListing.ticketId,
        eventId: userListing.eventId,
        ownerId: userListing.sellerId,
        section: userListing.section,
        row: userListing.row,
        seat: userListing.seat,
        faceValue: userListing.faceValue,
        currency: userListing.currency,
        isCleared: true,
        resaleStatus: 'listed' as const,
        barcode: `T-PASSPORT-${userListing.ticketId}`,
        purchasedAt: new Date(),
        originalOwnerId: userListing.sellerId,
        transferHistory: [] as { id: string; fromUserId: string; toUserId: string; price: number; transferredAt: Date; method: 'resale' | 'gift' | 'original_purchase' }[],
      };
      const event = {
        id: userListing.eventId,
        artist: userListing.eventArtist,
        name: userListing.eventName,
        date: userListing.eventDate,
        venue: userListing.eventVenue,
        city: userListing.eventCity,
        country: userListing.eventCountry,
        resaleRules: {
          maxPriceMultiplier: 2.0, // Default to 2x max price cap
          fanOnlyWindowHours: 48,
          transferDeadlineHours: 24,
          requiresIdMatch: true,
          charityPercentage: 10,
        },
      };
      // Try to find seller in mock users, or create placeholder
      const seller = getUserById(userListing.sellerId) || {
        id: userListing.sellerId,
        name: userListing.sellerName,
        email: '',
        passportScore: 85,
        isVerified: true,
        membershipStatus: 'active' as const,
        createdAt: new Date(),
      };
      return { listing: transformedListing, ticket, event, seller, isUserListing: true };
    }

    return null;
  }, [listingId]);

  // Load user's existing bid and bid history
  useEffect(() => {
    if (user && listingData?.listing.isAuction) {
      const existingBid = getUserBidOnListing(user.id, listingId);
      setUserExistingBid(existingBid);
      const history = getListingBids(listingId);
      setBidHistory(history);
    }
  }, [user, listingId, listingData?.listing.isAuction]);

  // Check if auction has ended
  useEffect(() => {
    if (listingData?.listing.isAuction && listingData.listing.auctionEndsAt) {
      const endTime = new Date(listingData.listing.auctionEndsAt).getTime();
      if (endTime <= Date.now()) {
        setAuctionEnded(true);
      }
    }
  }, [listingData]);

  if (!listingData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Listing Not Found</h2>
        <p className="text-neutral-400 mb-4">This listing doesn&apos;t exist or is no longer available.</p>
        <Link href="/marketplace">
          <Button variant="gold">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const { listing, ticket, event, seller } = listingData;
  // Enforce max bid/price as 2x face value (200% cap)
  const maxMultiplier = Math.min(event.resaleRules.maxPriceMultiplier, 2.0);
  const maxPrice = Math.floor(ticket.faceValue * maxMultiplier);

  // For auctions, use bid amount; for fixed price, use asking price
  const isAuction = listing.isAuction || false;

  // Get effective current highest bid (from storage or mock data)
  const effectiveHighestBid = bidHistory.length > 0
    ? Math.max(bidHistory[0]?.amount || 0, listing.currentHighestBid || 0)
    : listing.currentHighestBid || 0;

  const priceForCalculation = isAuction
    ? parseFloat(bidAmount) || effectiveHighestBid || listing.minimumBid || 0
    : listing.askingPrice;

  const platformFee = Math.round(priceForCalculation * 0.08); // 8% fee
  const charityAmount = Math.round(
    Math.max(0, priceForCalculation - ticket.faceValue) *
      (event.resaleRules.charityPercentage / 100)
  );
  const total = priceForCalculation + platformFee;

  // Get minimum next bid amount
  const minimumNextBid = effectiveHighestBid > 0
    ? effectiveHighestBid + 10 // Minimum $10 increment
    : listing.minimumBid || 0;

  const validateBid = (): boolean => {
    const bid = parseFloat(bidAmount);

    if (isNaN(bid) || bid <= 0) {
      setBidError('Please enter a valid bid amount');
      return false;
    }

    if (bid < minimumNextBid) {
      setBidError(`Bid must be at least ${formatCurrency(minimumNextBid, ticket.currency)}`);
      return false;
    }

    if (bid > maxPrice) {
      setBidError(`Bid cannot exceed 2x face value (${formatCurrency(maxPrice, ticket.currency)})`);
      return false;
    }

    setBidError('');
    return true;
  };

  const handlePurchaseOrBid = () => {
    if (isAuction) {
      if (validateBid()) {
        setStep('confirm');
      }
    } else {
      setStep('confirm');
    }
  };

  const handlePurchase = async () => {
    if (!user) return;

    setStep('processing');

    if (isAuction) {
      // Place bid
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newBid: StoredBid = {
        id: generateBidId(),
        listingId: listing.id,
        ticketId: ticket.id,
        eventId: event.id,
        bidderId: user.id,
        bidderName: user.name,
        amount: parseFloat(bidAmount),
        currency: ticket.currency,
        bidAt: new Date().toISOString(),
        status: 'winning',
        eventArtist: event.artist,
        eventName: event.name,
        eventDate: event.date,
        eventVenue: event.venue,
        section: ticket.section,
        row: ticket.row,
        seat: ticket.seat,
        auctionEndsAt: listing.auctionEndsAt?.toString() || '',
        reservePrice: listing.reservePrice,
        sellerName: seller.name,
      };

      const result = placeBid(newBid);
      if (!result.success) {
        setBidError(result.error || 'Failed to place bid');
        setStep('details');
        return;
      }

      setUserExistingBid(newBid);
      setBidHistory([newBid, ...bidHistory.map(b => ({ ...b, status: 'outbid' as const }))]);
    } else {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Save purchase to localStorage
      addPurchase({
        ticketId: ticket.id,
        listingId: listing.id,
        eventId: event.id,
        buyerId: user.id,
        purchasedAt: new Date().toISOString(),
        amount: total,
        currency: ticket.currency,
      });

      // Mark listing as sold if it's a user-created listing
      if (listingData.isUserListing) {
        markListingSold(listing.id, user.id);
      }
    }

    setStep('success');
  };

  const handleAuctionEnd = () => {
    setAuctionEnded(true);
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-20 h-20 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {isAuction ? 'Bid Placed!' : 'Purchase Complete!'}
        </h2>
        <p className="text-neutral-400 mb-6">
          {isAuction
            ? `Your bid of ${formatCurrency(parseFloat(bidAmount), ticket.currency)} has been placed. We'll notify you if you're outbid or win the auction.`
            : `Your ticket has been added to your wallet. You're all set for ${event.artist}!`}
        </p>

        {isAuction && (
          <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/50 mb-6 text-left">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-blue-300">What happens next?</p>
                <ul className="text-sm text-blue-400/80 mt-1 space-y-1">
                  <li>• Your payment is held in escrow</li>
                  <li>• If outbid, your funds are released immediately</li>
                  <li>• If you win, the ticket transfers automatically</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {!isAuction && (
          <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/50 mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <p className="font-semibold text-emerald-300">Entry Guarantee Active</p>
                <p className="text-sm text-emerald-400">Your ticket is protected by T-PASSPORT.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Link href="/wallet">
            <Button variant="gold">{isAuction ? 'View My Bids' : 'View My Tickets'}</Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <svg className="animate-spin w-20 h-20 text-amber-200" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          {isAuction ? 'Placing Your Bid' : 'Processing Payment'}
        </h2>
        <p className="text-neutral-400">
          {isAuction ? 'Submitting your bid to the auction...' : 'Your payment is in escrow. Transferring ticket...'}
        </p>
        <div className="mt-6 space-y-2 text-sm text-neutral-500">
          {isAuction ? (
            <>
              <p>Validating bid amount...</p>
              <p>Placing bid on auction...</p>
              <p>Securing escrow payment...</p>
            </>
          ) : (
            <>
              <p>Verifying ticket authenticity...</p>
              <p>Processing payment...</p>
              <p>Transferring ownership...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <button
          onClick={() => setStep('details')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-neutral-700/50 rounded-xl p-6 border border-neutral-600/50">
          <h2 className="text-xl font-bold text-white mb-6">
            {isAuction ? 'Confirm Bid' : 'Confirm Purchase'}
          </h2>

          {/* Order summary */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-neutral-400">Ticket</span>
              <span className="font-medium text-white">{event.artist} - {ticket.section}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">{isAuction ? 'Your Bid' : 'Ticket Price'}</span>
              <span className="font-medium text-white">
                {formatCurrency(priceForCalculation, ticket.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Platform Fee (8%)</span>
              <span className="font-medium text-white">{formatCurrency(platformFee, ticket.currency)}</span>
            </div>
            {charityAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Charity Donation ({event.resaleRules.charityPercentage}% of premium)</span>
                <span className="font-medium">{formatCurrency(charityAmount, ticket.currency)}</span>
              </div>
            )}
            <div className="border-t border-neutral-600 pt-4 flex justify-between">
              <span className="font-semibold text-white">Total</span>
              <span className="font-bold text-xl text-amber-200">{formatCurrency(total, ticket.currency)}</span>
            </div>
          </div>

          {/* Escrow notice */}
          <div className="bg-amber-200/10 rounded-lg p-4 mb-6 border border-amber-200/20">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-200 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="font-medium text-amber-200">Secure Escrow Payment</p>
                <p className="text-sm text-amber-200/70">
                  {isAuction
                    ? 'Your payment is held securely. If outbid, funds are released immediately. If you win, the ticket transfers automatically.'
                    : 'Your payment is held securely until the ticket transfer is verified. Seller receives payment only after successful transfer.'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment method (mock) */}
          <div className="mb-6">
            <p className="text-sm font-medium text-neutral-400 mb-2">Payment Method</p>
            <div className="p-3 border border-neutral-600 rounded-lg flex items-center gap-3 bg-neutral-800">
              <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <span className="text-white">•••• •••• •••• 4242</span>
            </div>
          </div>

          <Button onClick={handlePurchase} variant="gold" className="w-full" size="lg">
            {isAuction ? `Place Bid - ${formatCurrency(total, ticket.currency)}` : `Pay ${formatCurrency(total, ticket.currency)}`}
          </Button>

          <p className="text-xs text-neutral-500 text-center mt-4">
            By completing this {isAuction ? 'bid' : 'purchase'}, you agree to our Terms of Service.
            {!isAuction && ' Entry Guarantee applies to verified Passport members.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-neutral-400 hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main ticket info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-700/50 rounded-xl border border-neutral-600/50 overflow-hidden">
            {/* Event header */}
            <div className="relative h-48 bg-gradient-to-br from-amber-200 to-amber-300 p-6">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <span className="text-neutral-900 text-9xl font-bold">{event.artist.charAt(0)}</span>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-neutral-900">{event.artist}</h1>
                    <p className="text-neutral-700">{event.name}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge variant="cleared">Cleared by T-PASSPORT</Badge>
                    {isAuction && (
                      <Badge variant="info">Auction</Badge>
                    )}
                  </div>
                </div>
                <div className="text-neutral-900">
                  <p className="text-lg font-semibold">{event.venue}</p>
                  <p className="text-neutral-700">{event.city}, {event.country}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Date & Time</p>
                  <p className="font-semibold text-white">{formatEventDate(new Date(event.date))}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Section / Row / Seat</p>
                  <p className="font-semibold text-white">{ticket.section} / {ticket.row} / {ticket.seat}</p>
                </div>
              </div>

              {/* Price comparison */}
              <div className="bg-neutral-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-400">Face Value</span>
                  <span className="text-white">{formatCurrency(ticket.faceValue, ticket.currency)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-400">Max Allowed Price</span>
                  <span className="text-white">{formatCurrency(maxPrice, ticket.currency)}</span>
                </div>
                {isAuction ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-neutral-400">Starting Bid</span>
                      <span className="text-white">{formatCurrency(listing.minimumBid || 0, ticket.currency)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-700">
                      <span className="font-semibold text-white">Current Highest Bid</span>
                      <span className="text-xl font-bold text-amber-200">
                        {effectiveHighestBid > 0
                          ? formatCurrency(effectiveHighestBid, ticket.currency)
                          : 'No bids yet'}
                      </span>
                    </div>
                    {listing.totalBids && listing.totalBids > 0 && (
                      <p className="text-sm text-blue-400 text-right mt-1">
                        {bidHistory.length || listing.totalBids} {(bidHistory.length || listing.totalBids) === 1 ? 'bid' : 'bids'}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-700">
                      <span className="font-semibold text-white">Asking Price</span>
                      <span className="text-xl font-bold text-amber-200">{formatCurrency(listing.askingPrice, ticket.currency)}</span>
                    </div>
                    {listing.askingPrice < maxPrice && (
                      <p className="text-sm text-emerald-400 text-right mt-1">
                        {formatCurrency(maxPrice - listing.askingPrice, ticket.currency)} below max price
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bid History (for auctions) */}
          {isAuction && bidHistory.length > 0 && (
            <div className="bg-neutral-700/50 rounded-xl border border-neutral-600/50 overflow-hidden">
              <button
                onClick={() => setShowBidHistory(!showBidHistory)}
                className="w-full p-4 flex items-center justify-between hover:bg-neutral-700/30 transition-colors"
              >
                <h3 className="font-semibold text-white">Bid History ({bidHistory.length})</h3>
                <svg
                  className={`w-5 h-5 text-neutral-400 transition-transform ${showBidHistory ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showBidHistory && (
                <div className="border-t border-neutral-600/50">
                  {bidHistory.slice(0, 10).map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`p-4 flex items-center justify-between ${
                        index !== bidHistory.length - 1 ? 'border-b border-neutral-600/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-neutral-300">
                            {bid.bidderName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {bid.bidderId === user?.id ? 'You' : bid.bidderName}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {new Date(bid.bidAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${index === 0 ? 'text-amber-200' : 'text-neutral-400'}`}>
                          {formatCurrency(bid.amount, bid.currency)}
                        </p>
                        {index === 0 && (
                          <Badge variant="success" size="sm">Highest</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resale rules */}
          <ResaleRulesDisplay
            rules={event.resaleRules}
            faceValue={ticket.faceValue}
            currency={ticket.currency}
            dark
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Buy/Bid box */}
          <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
            {isAuction ? (
              <>
                {/* Auction countdown */}
                {listing.auctionEndsAt && (
                  <div className="mb-4 pb-4 border-b border-neutral-600">
                    <AuctionCountdown
                      endsAt={listing.auctionEndsAt}
                      onEnd={handleAuctionEnd}
                      size="md"
                    />
                  </div>
                )}

                {auctionEnded ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-neutral-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-white mb-1">Auction Ended</p>
                    <p className="text-sm text-neutral-400">
                      This auction has ended. Check your bids to see if you won.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Current bid info */}
                    <div className="mb-4">
                      <p className="text-sm text-neutral-500">
                        {effectiveHighestBid > 0 ? 'Current Highest Bid' : 'Starting Bid'}
                      </p>
                      <p className="text-3xl font-bold text-amber-200">
                        {formatCurrency(effectiveHighestBid || listing.minimumBid || 0, ticket.currency)}
                      </p>
                      {bidHistory.length > 0 && (
                        <p className="text-xs text-neutral-500 mt-1">
                          {bidHistory.length} {bidHistory.length === 1 ? 'bid' : 'bids'}
                        </p>
                      )}
                    </div>

                    {/* User's existing bid indicator */}
                    {userExistingBid && (
                      <div className={`mb-4 p-3 rounded-lg ${
                        userExistingBid.status === 'winning'
                          ? 'bg-emerald-900/30 border border-emerald-700/50'
                          : 'bg-amber-900/30 border border-amber-700/50'
                      }`}>
                        <div className="flex items-center gap-2">
                          {userExistingBid.status === 'winning' ? (
                            <>
                              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-emerald-300 font-medium">You&apos;re winning!</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span className="text-amber-300 font-medium">You&apos;ve been outbid</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-neutral-400 mt-1">
                          Your bid: {formatCurrency(userExistingBid.amount, userExistingBid.currency)}
                        </p>
                      </div>
                    )}

                    {/* Bid input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-400 mb-2">
                        Your Bid
                      </label>
                      <Input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => {
                          setBidAmount(e.target.value);
                          setBidError('');
                        }}
                        placeholder={`Min ${formatCurrency(minimumNextBid, ticket.currency)}`}
                        error={bidError}
                        dark
                      />
                      <div className="flex justify-between text-xs text-neutral-500 mt-1">
                        <span>Min: {formatCurrency(minimumNextBid, ticket.currency)}</span>
                        <span>Max: {formatCurrency(maxPrice, ticket.currency)} (2x face value)</span>
                      </div>
                    </div>

                    {/* Bid fee breakdown */}
                    {parseFloat(bidAmount) > 0 && !bidError && (
                      <div className="bg-neutral-800 rounded-lg p-3 mb-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Your bid</span>
                          <span className="text-white">{formatCurrency(parseFloat(bidAmount), ticket.currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">+ Platform fee (8%)</span>
                          <span className="text-white">{formatCurrency(platformFee, ticket.currency)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-neutral-700">
                          <span className="font-medium text-white">Total if you win</span>
                          <span className="font-bold text-amber-200">{formatCurrency(total, ticket.currency)}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handlePurchaseOrBid}
                      variant="gold"
                      className="w-full"
                      size="lg"
                      disabled={!bidAmount || parseFloat(bidAmount) <= 0}
                    >
                      Place Bid
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Total Price</p>
                  <p className="text-3xl font-bold text-amber-200">
                    {formatCurrency(listing.askingPrice + platformFee, ticket.currency)}
                  </p>
                  <p className="text-xs text-neutral-500">Includes 8% platform fee</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Entry Guaranteed
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified Authentic
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Secure Escrow Payment
                  </div>
                </div>

                <Button onClick={() => setStep('confirm')} variant="gold" className="w-full" size="lg">
                  Buy Now
                </Button>
              </>
            )}
          </div>

          {/* Seller info */}
          <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
            <h3 className="font-semibold text-white mb-3">Seller</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neutral-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-neutral-300">{seller.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{seller.name}</p>
                <div className="flex items-center gap-2">
                  {seller.isVerified && (
                    <Badge variant="success" size="sm">Verified</Badge>
                  )}
                </div>
              </div>
              <PassportScore score={seller.passportScore} size="sm" showLabel={false} />
            </div>
          </div>

          {/* Guarantee info */}
          <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/50">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-emerald-300">T-PASSPORT Guarantee</p>
                <p className="text-sm text-emerald-400">
                  If denied entry for validity reasons, you&apos;ll receive an automatic full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
