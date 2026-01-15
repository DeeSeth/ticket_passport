'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button, Badge } from '@/components/ui';
import ResaleRulesDisplay from '@/components/ResaleRules';
import { getTicketById, getEventById, formatCurrency, formatEventDate, isEligibleForGuarantee } from '@/lib/mock-data';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const ticketId = params.id as string;

  const ticketData = useMemo(() => {
    const ticket = getTicketById(ticketId);
    if (!ticket) return null;
    const event = getEventById(ticket.eventId);
    if (!event) return null;
    return { ticket, event };
  }, [ticketId]);

  if (!ticketData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white mb-2">Ticket Not Found</h2>
        <p className="text-neutral-400 mb-4">This ticket doesn&apos;t exist or you don&apos;t have access to it.</p>
        <Link href="/wallet">
          <Button variant="gold">Back to Wallet</Button>
        </Link>
      </div>
    );
  }

  const { ticket, event } = ticketData;
  const isPastEvent = new Date(event.date) < new Date();
  const isOwner = ticket.ownerId === user?.id;
  const hasGuarantee = user ? isEligibleForGuarantee(ticket, user) : false;

  // Generate a simple QR code pattern (in production, use a real QR library)
  const QRCode = ({ data }: { data: string }) => {
    // Simple deterministic pattern based on data
    const hash = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pattern = Array.from({ length: 25 }, (_, i) => (hash * (i + 1)) % 2 === 0);

    return (
      <div className="inline-block p-4 bg-white rounded-lg">
        <div className="grid grid-cols-5 gap-1 w-40 h-40">
          {pattern.map((filled, i) => (
            <div
              key={i}
              className={`aspect-square ${filled ? 'bg-neutral-900' : 'bg-white'}`}
            />
          ))}
        </div>
        <p className="text-xs text-neutral-500 text-center mt-2 font-mono">{data.slice(-12)}</p>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-neutral-400 hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Ticket card */}
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
              <div className="flex gap-2">
                {ticket.isCleared && <Badge variant="cleared">Cleared</Badge>}
                {ticket.resaleStatus === 'listed' && <Badge variant="warning">For Sale</Badge>}
              </div>
            </div>
            <div className="text-neutral-900">
              <p className="text-lg font-semibold">{event.venue}</p>
              <p className="text-neutral-700">{event.city}, {event.country}</p>
            </div>
          </div>
          {isPastEvent && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xl font-bold">Past Event</span>
            </div>
          )}
        </div>

        {/* Ticket details */}
        <div className="p-6 space-y-6">
          {/* Date and seat info */}
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

          {/* Price info */}
          <div className="flex items-center justify-between py-4 border-y border-neutral-600/50">
            <div>
              <p className="text-sm text-neutral-500">Face Value</p>
              <p className="text-xl font-bold text-white">{formatCurrency(ticket.faceValue, ticket.currency)}</p>
            </div>
            {ticket.resalePrice && (
              <div className="text-right">
                <p className="text-sm text-neutral-500">Resale Price</p>
                <p className="text-xl font-bold text-amber-200">{formatCurrency(ticket.resalePrice, ticket.currency)}</p>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="flex justify-center py-4">
            <div className="text-center">
              <QRCode data={ticket.barcode} />
              <p className="text-sm text-neutral-400 mt-2">Show this at entry</p>
            </div>
          </div>

          {/* Entry Guarantee status */}
          {hasGuarantee ? (
            <div className="bg-emerald-900/30 rounded-lg p-4 flex items-start gap-3 border border-emerald-700/50">
              <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-emerald-300">Entry Guaranteed</p>
                <p className="text-sm text-emerald-400">If denied entry for validity reasons, you&apos;ll receive an automatic refund.</p>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-800 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-6 h-6 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="font-semibold text-neutral-300">Entry Guarantee Not Active</p>
                <p className="text-sm text-neutral-500">
                  {!user?.isVerified
                    ? 'Verify your identity to activate Entry Guarantee.'
                    : 'This ticket is not eligible for Entry Guarantee.'}
                </p>
                {!user?.isVerified && (
                  <Link href="/verify">
                    <Button size="sm" variant="outline" className="mt-2 border-neutral-600 text-neutral-300 hover:bg-neutral-700">Verify Now</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resale Rules */}
      <ResaleRulesDisplay
        rules={event.resaleRules}
        faceValue={ticket.faceValue}
        currency={ticket.currency}
        dark
      />

      {/* Actions */}
      {isOwner && !isPastEvent && ticket.resaleStatus === 'not_listed' && (
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">Want to sell this ticket?</h3>
              <p className="text-sm text-neutral-400">List it on the marketplace with Entry Guarantee for buyers.</p>
            </div>
            <Link href={`/sell?ticket=${ticket.id}`}>
              <Button variant="gold">Sell Ticket</Button>
            </Link>
          </div>
        </div>
      )}

      {isOwner && ticket.resaleStatus === 'listed' && (
        <div className="bg-amber-200/10 rounded-xl p-4 border border-amber-200/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-amber-200">Listed for Sale</h3>
              <p className="text-sm text-amber-200/70">This ticket is currently listed at {formatCurrency(ticket.resalePrice!, ticket.currency)}</p>
            </div>
            <Button variant="outline" className="border-amber-200/50 text-amber-200 hover:bg-amber-200/10">Cancel Listing</Button>
          </div>
        </div>
      )}
    </div>
  );
}
