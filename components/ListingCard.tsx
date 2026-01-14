'use client';

import Link from 'next/link';
import { Badge } from './ui';
import { Ticket, Event, ResaleListing } from '@/lib/types';
import { formatCurrency } from '@/lib/mock-data';

interface ListingCardProps {
  listing: ResaleListing & { ticket: Ticket; event: Event };
}

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

export default function ListingCard({ listing }: ListingCardProps) {
  const { ticket, event } = listing;
  const colors = artistColors[event.artist] || defaultColor;

  const eventDate = new Date(event.date);
  const monthShort = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNum = eventDate.getDate();

  return (
    <Link href={`/marketplace/${listing.id}`}>
      <div className="group relative flex hover:scale-[1.01] transition-all duration-300 cursor-pointer h-32">

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
              <div className="flex gap-1 flex-shrink-0">
                <Badge variant="cleared" size="sm">✓</Badge>
                {listing.isAuction && (
                  <Badge variant="info" size="sm">Auction</Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-neutral-400 truncate">{event.name}</p>
            <p className="text-xs text-neutral-500 mt-1">
              {ticket.section} · Row {ticket.row} · Seat {ticket.seat}
            </p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-lg font-bold text-amber-200">
              {formatCurrency(listing.isAuction ? (listing.currentHighestBid || listing.minimumBid || 0) : listing.askingPrice, ticket.currency)}
            </p>
            {listing.isAuction && (
              <p className="text-xs text-neutral-500">current bid</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
