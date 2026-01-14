'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button, Input, Badge } from '@/components/ui';
import ResaleRulesDisplay from '@/components/ResaleRules';
import {
  mockTickets,
  getEventById,
  formatCurrency,
  getMaxResalePrice,
} from '@/lib/mock-data';
import { Ticket, Event } from '@/lib/types';

// Artist-specific accent colors
const artistColors: Record<string, { gradient: string; solid: string }> = {
  'Taylor Swift': { gradient: 'from-purple-600 to-pink-500', solid: 'bg-purple-600' },
  'Beyoncé': { gradient: 'from-amber-500 to-orange-500', solid: 'bg-amber-500' },
  'Coldplay': { gradient: 'from-cyan-500 to-blue-600', solid: 'bg-cyan-500' },
  'Bad Bunny': { gradient: 'from-red-500 to-pink-600', solid: 'bg-red-500' },
  'BLACKPINK': { gradient: 'from-pink-500 to-fuchsia-600', solid: 'bg-pink-500' },
  'The Weeknd': { gradient: 'from-red-600 to-rose-700', solid: 'bg-red-600' },
};

const defaultColor = { gradient: 'from-amber-500 to-orange-500', solid: 'bg-amber-500' };

// Ticket card component for sell page (raffle ticket style)
function SellableTicketCard({
  ticket,
  event,
  onClick,
  selected = false,
  showSellLabel = false
}: {
  ticket: Ticket;
  event: Event;
  onClick?: () => void;
  selected?: boolean;
  showSellLabel?: boolean;
}) {
  const colors = artistColors[event.artist] || defaultColor;
  const eventDate = new Date(event.date);
  const monthShort = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNum = eventDate.getDate();

  return (
    <div
      className={`group relative flex hover:scale-[1.01] transition-all duration-300 cursor-pointer h-32 max-w-lg ${
        selected ? 'ring-2 ring-amber-200 rounded-xl' : ''
      }`}
      onClick={onClick}
    >
      {/* Left colored stub section */}
      <div className={`relative w-20 bg-gradient-to-br ${colors.gradient} rounded-l-xl flex flex-col justify-center items-center`}>
        {/* Perforated edge */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around py-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 bg-neutral-900 rounded-full translate-x-1" />
          ))}
        </div>

        {/* Date */}
        <div className="text-white text-center">
          <p className="text-[10px] font-bold opacity-80">{monthShort}</p>
          <p className="text-2xl font-black leading-none">{dayNum}</p>
        </div>
      </div>

      {/* Main ticket section */}
      <div className="flex-1 bg-neutral-700 border-y border-r border-neutral-600 rounded-r-xl px-4 flex items-center min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-white truncate">{event.artist}</h3>
            {ticket.isCleared && <Badge variant="cleared" size="sm">✓</Badge>}
          </div>
          <p className="text-sm text-neutral-400 truncate">{event.name}</p>
          <p className="text-xs text-neutral-500 mt-1">
            {ticket.section} · Row {ticket.row} · Seat {ticket.seat}
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-lg font-bold text-white">
            {formatCurrency(ticket.faceValue, ticket.currency)}
          </p>
          {showSellLabel && (
            <p className="text-xs text-amber-200">Tap to sell →</p>
          )}
        </div>
      </div>
    </div>
  );
}

type SellStep = 'select' | 'listing_type' | 'price' | 'auction_setup' | 'review' | 'success';
type ListingType = 'fixed' | 'auction';

export default function SellPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const preselectedTicketId = searchParams.get('ticket');
  const [step, setStep] = useState<SellStep>(preselectedTicketId ? 'listing_type' : 'select');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(preselectedTicketId);
  const [listingType, setListingType] = useState<ListingType>('fixed');
  const [askingPrice, setAskingPrice] = useState<string>('');
  const [priceError, setPriceError] = useState<string>('');

  // Auction-specific state
  const [minimumBid, setMinimumBid] = useState<string>('');
  const [reservePrice, setReservePrice] = useState<string>('');
  const [auctionDuration, setAuctionDuration] = useState<string>('24'); // hours
  const [auctionError, setAuctionError] = useState<string>('');

  // Get user's sellable tickets
  const sellableTickets = useMemo(() => {
    return mockTickets
      .filter(
        (ticket) =>
          ticket.ownerId === user?.id &&
          ticket.resaleStatus === 'not_listed' &&
          new Date(getEventById(ticket.eventId)?.date || 0) > new Date()
      )
      .map((ticket) => ({
        ticket,
        event: getEventById(ticket.eventId)!,
      }))
      .filter(({ event }) => event !== undefined);
  }, [user?.id]);

  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    const ticket = mockTickets.find((t) => t.id === selectedTicketId);
    if (!ticket) return null;
    const event = getEventById(ticket.eventId);
    if (!event) return null;
    return { ticket, event };
  }, [selectedTicketId]);

  const maxPrice = selectedTicket
    ? getMaxResalePrice(selectedTicket.ticket, selectedTicket.event)
    : 0;

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setStep('listing_type');
    setAskingPrice('');
    setPriceError('');
    setMinimumBid('');
    setReservePrice('');
    setAuctionError('');
  };

  const handleListingTypeSelect = (type: ListingType) => {
    setListingType(type);
    setStep(type === 'fixed' ? 'price' : 'auction_setup');
  };

  const validatePrice = (price: string): boolean => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setPriceError('Please enter a valid price');
      return false;
    }
    if (numPrice > maxPrice) {
      setPriceError(`Price cannot exceed the cap of ${formatCurrency(maxPrice, selectedTicket!.ticket.currency)}`);
      return false;
    }
    if (numPrice < selectedTicket!.ticket.faceValue * 0.5) {
      setPriceError('Price seems too low. Minimum is 50% of face value.');
      return false;
    }
    setPriceError('');
    return true;
  };

  const handlePriceSubmit = () => {
    if (validatePrice(askingPrice)) {
      setStep('review');
    }
  };

  const validateAuction = (): boolean => {
    const minBid = parseFloat(minimumBid);
    const reserve = parseFloat(reservePrice);
    const duration = parseInt(auctionDuration);

    if (isNaN(minBid) || minBid <= 0) {
      setAuctionError('Please enter a valid minimum bid');
      return false;
    }
    if (minBid < selectedTicket!.ticket.faceValue * 0.5) {
      setAuctionError('Minimum bid cannot be less than 50% of face value');
      return false;
    }
    if (reserve && !isNaN(reserve)) {
      if (reserve < minBid) {
        setAuctionError('Reserve price must be greater than minimum bid');
        return false;
      }
      if (reserve > maxPrice) {
        setAuctionError(`Reserve price cannot exceed ${formatCurrency(maxPrice, selectedTicket!.ticket.currency)}`);
        return false;
      }
    }
    if (isNaN(duration) || duration < 1 || duration > 168) {
      setAuctionError('Auction duration must be between 1 and 168 hours (7 days)');
      return false;
    }
    setAuctionError('');
    return true;
  };

  const handleAuctionSubmit = () => {
    if (validateAuction()) {
      setStep('review');
    }
  };

  const handleListTicket = async () => {
    // Simulate listing process
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStep('success');
  };

  // Calculate fees (for fixed price listing or estimated for auction)
  const numericPrice = listingType === 'fixed'
    ? parseFloat(askingPrice) || 0
    : parseFloat(reservePrice) || parseFloat(minimumBid) || 0;
  const platformFee = Math.round(numericPrice * 0.08);
  const charityAmount = selectedTicket
    ? Math.round(
        Math.max(0, numericPrice - selectedTicket.ticket.faceValue) *
          (selectedTicket.event.resaleRules.charityPercentage / 100)
      )
    : 0;
  const sellerPayout = numericPrice - platformFee - charityAmount;

  // Auction end date calculation
  const auctionEndDate = new Date();
  auctionEndDate.setHours(auctionEndDate.getHours() + parseInt(auctionDuration || '24'));

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-20 h-20 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {listingType === 'auction' ? 'Auction Started!' : 'Ticket Listed!'}
        </h2>
        <p className="text-neutral-400 mb-6">
          {listingType === 'auction'
            ? `Your auction is now live and will end ${auctionEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${auctionEndDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. We'll notify you when bids are placed.`
            : "Your ticket is now live on the marketplace. We'll notify you when it sells."}
        </p>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50 text-left mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Event</span>
              <span className="font-medium text-white">{selectedTicket?.event.artist}</span>
            </div>
            {listingType === 'auction' ? (
              <>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Listing Type</span>
                  <span className="font-medium text-white">Auction</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Starting Bid</span>
                  <span className="font-medium text-white">{formatCurrency(parseFloat(minimumBid), selectedTicket!.ticket.currency)}</span>
                </div>
                {reservePrice && parseFloat(reservePrice) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Reserve Price</span>
                    <span className="font-medium text-white">{formatCurrency(parseFloat(reservePrice), selectedTicket!.ticket.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-400">Auction Ends</span>
                  <span className="font-medium text-white">{auctionEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Asking Price</span>
                  <span className="font-medium text-white">{formatCurrency(numericPrice, selectedTicket!.ticket.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">You&apos;ll receive</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(sellerPayout, selectedTicket!.ticket.currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/wallet">
            <Button variant="gold">View My Tickets</Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700">Browse Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sell a Ticket</h1>
        <p className="text-neutral-400">List your ticket on the PASSPORT marketplace</p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {['select', 'listing_type', listingType === 'fixed' ? 'price' : 'auction_setup', 'review'].map((s, i) => {
          const stepOrder = ['select', 'listing_type', 'price', 'auction_setup', 'review'];
          const currentStepIndex = stepOrder.indexOf(step);
          const thisStepIndex = stepOrder.indexOf(s);
          const isCompleted = currentStepIndex > thisStepIndex;
          const isCurrent = step === s;

          return (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCurrent
                    ? 'bg-amber-200 text-neutral-900'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-neutral-700 text-neutral-400'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {i < 3 && <div className="w-12 h-0.5 bg-neutral-700 mx-2"></div>}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      {step === 'select' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Select a ticket to sell</h2>

          {sellableTickets.length > 0 ? (
            <div className="space-y-3">
              {sellableTickets.map(({ ticket, event }) => (
                <SellableTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  event={event}
                  onClick={() => handleSelectTicket(ticket.id)}
                  showSellLabel
                />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-700/50 rounded-xl p-8 border border-neutral-600/50 text-center">
              <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-1">No tickets available to sell</h3>
              <p className="text-neutral-400 mb-4">
                You don&apos;t have any upcoming tickets that can be listed.
              </p>
              <Link href="/marketplace">
                <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700">Browse Marketplace</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Listing type selection */}
      {step === 'listing_type' && selectedTicket && (
        <div className="space-y-6">
          <button
            onClick={() => {
              setStep('select');
              setSelectedTicketId(null);
            }}
            className="flex items-center gap-2 text-neutral-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change ticket
          </button>

          <h2 className="text-lg font-semibold text-white">Choose Listing Type</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fixed Price Option */}
            <button
              onClick={() => handleListingTypeSelect('fixed')}
              className="bg-neutral-700/50 rounded-xl p-6 border-2 border-neutral-600/50 hover:border-amber-200/50 transition-colors text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-200/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">Fixed Price</h3>
                  <p className="text-sm text-neutral-400">
                    Set a price and sell immediately when a buyer accepts. Quick and simple.
                  </p>
                </div>
              </div>
            </button>

            {/* Auction Option */}
            <button
              onClick={() => handleListingTypeSelect('auction')}
              className="bg-neutral-700/50 rounded-xl p-6 border-2 border-neutral-600/50 hover:border-amber-200/50 transition-colors text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">Auction</h3>
                  <p className="text-sm text-neutral-400">
                    Let buyers compete with bids. Great for high-demand events to maximize value.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Auction setup */}
      {step === 'auction_setup' && selectedTicket && (
        <div className="space-y-6">
          <button
            onClick={() => setStep('listing_type')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change listing type
          </button>

          {/* Selected ticket summary */}
          <SellableTicketCard
            ticket={selectedTicket.ticket}
            event={selectedTicket.event}
            selected
          />

          {/* Resale rules */}
          <ResaleRulesDisplay
            rules={selectedTicket.event.resaleRules}
            faceValue={selectedTicket.ticket.faceValue}
            currency={selectedTicket.ticket.currency}
            dark
          />

          {/* Auction configuration */}
          <div className="bg-neutral-700/50 rounded-xl p-6 border border-neutral-600/50">
            <h2 className="text-lg font-semibold text-white mb-4">Configure Auction</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                  <span>Face value: {formatCurrency(selectedTicket.ticket.faceValue, selectedTicket.ticket.currency)}</span>
                  <span>•</span>
                  <span>Max allowed: {formatCurrency(maxPrice, selectedTicket.ticket.currency)}</span>
                </div>
                <Input
                  label="Starting Bid (Minimum Bid)"
                  type="number"
                  value={minimumBid}
                  onChange={(e) => {
                    setMinimumBid(e.target.value);
                    setAuctionError('');
                  }}
                  placeholder="Enter minimum bid amount"
                  dark
                />
              </div>

              <Input
                label="Reserve Price (Optional)"
                type="number"
                value={reservePrice}
                onChange={(e) => {
                  setReservePrice(e.target.value);
                  setAuctionError('');
                }}
                placeholder="Minimum price to accept (hidden from bidders)"
                dark
              />

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Auction Duration
                </label>
                <select
                  value={auctionDuration}
                  onChange={(e) => {
                    setAuctionDuration(e.target.value);
                    setAuctionError('');
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="24">24 hours</option>
                  <option value="48">48 hours (2 days)</option>
                  <option value="72">72 hours (3 days)</option>
                  <option value="120">5 days</option>
                  <option value="168">7 days</option>
                </select>
              </div>

              {auctionError && (
                <p className="text-sm text-red-400">{auctionError}</p>
              )}

              {/* Info banner */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-neutral-300">
                    <p className="mb-1"><strong className="text-white">How auctions work:</strong></p>
                    <ul className="space-y-1 text-neutral-400">
                      <li>• Bidders compete by placing increasingly higher bids</li>
                      <li>• Reserve price is kept private - auction succeeds only if met</li>
                      <li>• Highest bid wins when auction ends</li>
                      <li>• Payment held in escrow until ticket transfer completes</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Estimated payout preview */}
              {parseFloat(minimumBid) > 0 && !auctionError && (
                <div className="bg-neutral-800 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-neutral-400 mb-2">Estimated payout (at reserve price):</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">
                      {reservePrice && parseFloat(reservePrice) > 0 ? 'Reserve price' : 'Starting bid'}
                    </span>
                    <span className="text-white">{formatCurrency(numericPrice, selectedTicket.ticket.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Platform fee (8%)</span>
                    <span className="text-red-400">-{formatCurrency(platformFee, selectedTicket.ticket.currency)}</span>
                  </div>
                  {charityAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Charity ({selectedTicket.event.resaleRules.charityPercentage}% of premium)</span>
                      <span className="text-red-400">-{formatCurrency(charityAmount, selectedTicket.ticket.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-neutral-700">
                    <span className="font-semibold text-white">You&apos;ll receive</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(sellerPayout, selectedTicket.ticket.currency)}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleAuctionSubmit}
                variant="gold"
                className="w-full"
                disabled={!minimumBid || parseFloat(minimumBid) <= 0}
              >
                Continue to Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 'price' && selectedTicket && (
        <div className="space-y-6">
          <button
            onClick={() => {
              setStep('select');
              setSelectedTicketId(null);
            }}
            className="flex items-center gap-2 text-neutral-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change ticket
          </button>

          {/* Selected ticket summary */}
          <SellableTicketCard
            ticket={selectedTicket.ticket}
            event={selectedTicket.event}
            selected
          />

          {/* Resale rules */}
          <ResaleRulesDisplay
            rules={selectedTicket.event.resaleRules}
            faceValue={selectedTicket.ticket.faceValue}
            currency={selectedTicket.ticket.currency}
            dark
          />

          {/* Price input */}
          <div className="bg-neutral-700/50 rounded-xl p-6 border border-neutral-600/50">
            <h2 className="text-lg font-semibold text-white mb-4">Set Your Price</h2>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                <span>Face value: {formatCurrency(selectedTicket.ticket.faceValue, selectedTicket.ticket.currency)}</span>
                <span>•</span>
                <span>Max allowed: {formatCurrency(maxPrice, selectedTicket.ticket.currency)}</span>
              </div>
              <Input
                label="Asking Price"
                type="number"
                value={askingPrice}
                onChange={(e) => {
                  setAskingPrice(e.target.value);
                  setPriceError('');
                }}
                placeholder={`Enter amount (max ${formatCurrency(maxPrice, selectedTicket.ticket.currency)})`}
                error={priceError}
                dark
              />
            </div>

            {numericPrice > 0 && !priceError && (
              <div className="bg-neutral-800 rounded-lg p-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Your price</span>
                  <span className="text-white">{formatCurrency(numericPrice, selectedTicket.ticket.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Platform fee (8%)</span>
                  <span className="text-red-400">-{formatCurrency(platformFee, selectedTicket.ticket.currency)}</span>
                </div>
                {charityAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Charity ({selectedTicket.event.resaleRules.charityPercentage}% of premium)</span>
                    <span className="text-red-400">-{formatCurrency(charityAmount, selectedTicket.ticket.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-neutral-700">
                  <span className="font-semibold text-white">You&apos;ll receive</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(sellerPayout, selectedTicket.ticket.currency)}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handlePriceSubmit}
              variant="gold"
              className="w-full"
              disabled={!askingPrice || parseFloat(askingPrice) <= 0}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 'review' && selectedTicket && (
        <div className="space-y-6">
          <button
            onClick={() => setStep(listingType === 'fixed' ? 'price' : 'auction_setup')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change {listingType === 'fixed' ? 'price' : 'auction settings'}
          </button>

          <div className="bg-neutral-700/50 rounded-xl p-6 border border-neutral-600/50">
            <h2 className="text-lg font-semibold text-white mb-4">Review Your Listing</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-400">Listing Type</span>
                <span className="font-medium text-white">
                  {listingType === 'fixed' ? 'Fixed Price' : 'Auction'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Event</span>
                <span className="font-medium text-white">{selectedTicket.event.artist} - {selectedTicket.event.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Seat</span>
                <span className="font-medium text-white">{selectedTicket.ticket.section} / {selectedTicket.ticket.row} / {selectedTicket.ticket.seat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Face Value</span>
                <span className="font-medium text-white">{formatCurrency(selectedTicket.ticket.faceValue, selectedTicket.ticket.currency)}</span>
              </div>

              {listingType === 'auction' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Starting Bid</span>
                    <span className="font-bold text-lg text-amber-200">{formatCurrency(parseFloat(minimumBid), selectedTicket.ticket.currency)}</span>
                  </div>
                  {reservePrice && parseFloat(reservePrice) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Reserve Price</span>
                      <span className="font-medium text-white">{formatCurrency(parseFloat(reservePrice), selectedTicket.ticket.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Auction Duration</span>
                    <span className="font-medium text-white">{auctionDuration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Auction Ends</span>
                    <span className="font-medium text-white">
                      {auctionEndDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {reservePrice && parseFloat(reservePrice) > 0 && (
                    <div className="border-t border-neutral-600 pt-4 flex justify-between">
                      <span className="font-semibold text-white">Est. payout at reserve (after fees)</span>
                      <span className="font-bold text-lg text-emerald-400">{formatCurrency(sellerPayout, selectedTicket.ticket.currency)}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Your Asking Price</span>
                    <span className="font-bold text-lg text-amber-200">{formatCurrency(numericPrice, selectedTicket.ticket.currency)}</span>
                  </div>
                  <div className="border-t border-neutral-600 pt-4 flex justify-between">
                    <span className="font-semibold text-white">You&apos;ll receive (after fees)</span>
                    <span className="font-bold text-lg text-emerald-400">{formatCurrency(sellerPayout, selectedTicket.ticket.currency)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Terms notice */}
            <div className="bg-amber-200/10 rounded-lg p-4 mb-6 border border-amber-200/20">
              <p className="text-sm text-amber-200">
                {listingType === 'auction'
                  ? 'By starting this auction, you agree to transfer the ticket to the winning bidder within 24 hours of auction end. Payment will be held in escrow until transfer is verified.'
                  : 'By listing, you agree to transfer this ticket to the buyer within 24 hours of sale. Payment will be released after successful transfer verification.'}
              </p>
            </div>

            <Button onClick={handleListTicket} variant="gold" className="w-full" size="lg">
              {listingType === 'auction' ? 'Start Auction' : 'List Ticket for Sale'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
