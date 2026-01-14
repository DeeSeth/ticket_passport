'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button, Badge } from '@/components/ui';
import PassportScore from '@/components/PassportScore';
import ResaleRulesDisplay from '@/components/ResaleRules';
import {
  getListingById,
  getTicketById,
  getEventById,
  getUserById,
  formatCurrency,
  formatEventDate,
  getMaxResalePrice,
} from '@/lib/mock-data';

type PurchaseStep = 'details' | 'confirm' | 'processing' | 'success';

export default function MarketplaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const listingId = params.id as string;
  const [step, setStep] = useState<PurchaseStep>('details');

  const listingData = useMemo(() => {
    const listing = getListingById(listingId);
    if (!listing) return null;
    const ticket = getTicketById(listing.ticketId);
    if (!ticket) return null;
    const event = getEventById(ticket.eventId);
    if (!event) return null;
    const seller = getUserById(listing.sellerId);
    if (!seller) return null;
    return { listing, ticket, event, seller };
  }, [listingId]);

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
  const maxPrice = getMaxResalePrice(ticket, event);
  const platformFee = Math.round(listing.askingPrice * 0.08); // 8% fee
  const charityAmount = Math.round((listing.askingPrice - ticket.faceValue) * (event.resaleRules.charityPercentage / 100));
  const total = listing.askingPrice + platformFee;

  const handlePurchase = async () => {
    setStep('processing');
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-20 h-20 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Purchase Complete!</h2>
        <p className="text-neutral-400 mb-6">
          Your ticket has been added to your wallet. You&apos;re all set for {event.artist}!
        </p>
        <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/50 mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="text-left">
              <p className="font-semibold text-emerald-300">Entry Guarantee Active</p>
              <p className="text-sm text-emerald-400">Your ticket is protected by PASSPORT.</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/wallet">
            <Button variant="gold">View My Tickets</Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700">Continue Shopping</Button>
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
        <h2 className="text-xl font-bold text-white mb-2">Processing Payment</h2>
        <p className="text-neutral-400">Your payment is in escrow. Transferring ticket...</p>
        <div className="mt-6 space-y-2 text-sm text-neutral-500">
          <p>Verifying ticket authenticity...</p>
          <p>Processing payment...</p>
          <p>Transferring ownership...</p>
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
          <h2 className="text-xl font-bold text-white mb-6">Confirm Purchase</h2>

          {/* Order summary */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-neutral-400">Ticket</span>
              <span className="font-medium text-white">{event.artist} - {ticket.section}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Ticket Price</span>
              <span className="font-medium text-white">{formatCurrency(listing.askingPrice, ticket.currency)}</span>
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
                  Your payment is held securely until the ticket transfer is verified. Seller receives payment only after successful transfer.
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
            Pay {formatCurrency(total, ticket.currency)}
          </Button>

          <p className="text-xs text-neutral-500 text-center mt-4">
            By completing this purchase, you agree to our Terms of Service. Entry Guarantee applies to verified Passport members.
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
                  <Badge variant="cleared">Cleared by PASSPORT</Badge>
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
                <div className="flex items-center justify-between pt-2 border-t border-neutral-700">
                  <span className="font-semibold text-white">Asking Price</span>
                  <span className="text-xl font-bold text-amber-200">{formatCurrency(listing.askingPrice, ticket.currency)}</span>
                </div>
                {listing.askingPrice < maxPrice && (
                  <p className="text-sm text-emerald-400 text-right mt-1">
                    {formatCurrency(maxPrice - listing.askingPrice, ticket.currency)} below max price
                  </p>
                )}
              </div>
            </div>
          </div>

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
          {/* Buy box */}
          <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
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
                <p className="font-semibold text-emerald-300">PASSPORT Guarantee</p>
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
