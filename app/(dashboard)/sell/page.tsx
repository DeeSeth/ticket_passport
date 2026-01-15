'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button, Input, Badge } from '@/components/ui';
import ResaleRulesDisplay from '@/components/ResaleRules';
import { canAccessMarketplace } from '@/lib/verification-utils';
import {
  mockTickets,
  getEventById,
  formatCurrency,
  getMaxResalePrice,
} from '@/lib/mock-data';

type SellStep = 'select' | 'price' | 'review' | 'success';

export default function SellPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const preselectedTicketId = searchParams.get('ticket');
  const [step, setStep] = useState<SellStep>(preselectedTicketId ? 'price' : 'select');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(preselectedTicketId);
  const [askingPrice, setAskingPrice] = useState<string>('');
  const [priceError, setPriceError] = useState<string>('');

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
    setStep('price');
    setAskingPrice('');
    setPriceError('');
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

  const handleListTicket = async () => {
    // Simulate listing process
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStep('success');
  };

  // Calculate fees
  const numericPrice = parseFloat(askingPrice) || 0;
  const platformFee = Math.round(numericPrice * 0.08);
  const charityAmount = selectedTicket
    ? Math.round(
        Math.max(0, numericPrice - selectedTicket.ticket.faceValue) *
          (selectedTicket.event.resaleRules.charityPercentage / 100)
      )
    : 0;
  const sellerPayout = numericPrice - platformFee - charityAmount;

  // Hard gate for unverified users
  if (!canAccessMarketplace(user)) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-neutral-700/50 rounded-xl p-8 border border-neutral-600/50 text-center">
          <div className="w-16 h-16 bg-amber-200/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Verification Required</h2>
          <p className="text-neutral-400 mb-6">
            Complete all verification steps to start selling tickets on the marketplace.
          </p>

          {/* Verification checklist */}
          <div className="bg-neutral-800 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-medium text-neutral-400 mb-3">Verification Status</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {user?.verification?.emailVerified ? (
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  </svg>
                )}
                <span className={user?.verification?.emailVerified ? 'text-white' : 'text-neutral-500'}>
                  Email Verification
                </span>
              </div>
              <div className="flex items-center gap-2">
                {user?.verification?.phoneVerified ? (
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  </svg>
                )}
                <span className={user?.verification?.phoneVerified ? 'text-white' : 'text-neutral-500'}>
                  Phone Verification
                </span>
              </div>
              <div className="flex items-center gap-2">
                {user?.verification?.idVerified ? (
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  </svg>
                )}
                <span className={user?.verification?.idVerified ? 'text-white' : 'text-neutral-500'}>
                  ID Verification
                </span>
              </div>
            </div>
          </div>

          <Link href="/verify">
            <Button variant="gold" size="lg" className="w-full">
              Complete Verification
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-20 h-20 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Ticket Listed!</h2>
        <p className="text-neutral-400 mb-6">
          Your ticket is now live on the marketplace. We&apos;ll notify you when it sells.
        </p>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50 text-left mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Event</span>
              <span className="font-medium text-white">{selectedTicket?.event.artist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Asking Price</span>
              <span className="font-medium text-white">{formatCurrency(numericPrice, selectedTicket!.ticket.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">You&apos;ll receive</span>
              <span className="font-bold text-emerald-400">{formatCurrency(sellerPayout, selectedTicket!.ticket.currency)}</span>
            </div>
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
        {['select', 'price', 'review'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? 'bg-amber-200 text-neutral-900'
                  : ['select', 'price', 'review'].indexOf(step) > i
                  ? 'bg-emerald-500 text-white'
                  : 'bg-neutral-700 text-neutral-400'
              }`}
            >
              {['select', 'price', 'review'].indexOf(step) > i ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {i < 2 && <div className="w-12 h-0.5 bg-neutral-700 mx-2"></div>}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 'select' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Select a ticket to sell</h2>

          {sellableTickets.length > 0 ? (
            <div className="space-y-3">
              {sellableTickets.map(({ ticket, event }) => (
                <div
                  key={ticket.id}
                  className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50 cursor-pointer hover:border-amber-200/30 transition-colors"
                  onClick={() => handleSelectTicket(ticket.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-neutral-900 text-2xl font-bold">{event.artist.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white">{event.artist}</h3>
                      <p className="text-sm text-neutral-400">{event.name}</p>
                      <p className="text-sm text-neutral-500">
                        {ticket.section} • Row {ticket.row} • Seat {ticket.seat}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500">Face value</p>
                      <p className="font-semibold text-white">{formatCurrency(ticket.faceValue, ticket.currency)}</p>
                    </div>
                  </div>
                </div>
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
          <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-neutral-900 text-2xl font-bold">{selectedTicket.event.artist.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{selectedTicket.event.artist}</h3>
                <p className="text-sm text-neutral-400">{selectedTicket.event.name}</p>
                <p className="text-sm text-neutral-500">
                  {selectedTicket.ticket.section} • Row {selectedTicket.ticket.row} • Seat {selectedTicket.ticket.seat}
                </p>
              </div>
              <Badge variant="cleared">Cleared</Badge>
            </div>
          </div>

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
            onClick={() => setStep('price')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change price
          </button>

          <div className="bg-neutral-700/50 rounded-xl p-6 border border-neutral-600/50">
            <h2 className="text-lg font-semibold text-white mb-4">Review Your Listing</h2>

            <div className="space-y-4 mb-6">
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
              <div className="flex justify-between">
                <span className="text-neutral-400">Your Asking Price</span>
                <span className="font-bold text-lg text-amber-200">{formatCurrency(numericPrice, selectedTicket.ticket.currency)}</span>
              </div>
              <div className="border-t border-neutral-600 pt-4 flex justify-between">
                <span className="font-semibold text-white">You&apos;ll receive (after fees)</span>
                <span className="font-bold text-lg text-emerald-400">{formatCurrency(sellerPayout, selectedTicket.ticket.currency)}</span>
              </div>
            </div>

            {/* Terms notice */}
            <div className="bg-amber-200/10 rounded-lg p-4 mb-6 border border-amber-200/20">
              <p className="text-sm text-amber-200">
                By listing, you agree to transfer this ticket to the buyer within 24 hours of sale.
                Payment will be released after successful transfer verification.
              </p>
            </div>

            <Button onClick={handleListTicket} variant="gold" className="w-full" size="lg">
              List Ticket for Sale
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
