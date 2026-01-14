'use client';

import Link from 'next/link';
import { Badge } from './ui';
import { Ticket, Event } from '@/lib/types';
import { formatCurrency } from '@/lib/mock-data';

interface TicketCardProps {
  ticket: Ticket;
  event: Event;
  showResaleInfo?: boolean;
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

export default function TicketCard({ ticket, event, showResaleInfo = false }: TicketCardProps) {
  const isPastEvent = new Date(event.date) < new Date();
  const colors = artistColors[event.artist] || defaultColor;

  const eventDate = new Date(event.date);
  const monthShort = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNum = eventDate.getDate();

  return (
    <Link href={`/wallet/${ticket.id}`}>
      <div className="group relative flex hover:scale-[1.01] transition-all duration-300 cursor-pointer h-32 max-w-sm">

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
                {ticket.isCleared && (
                  <Badge variant="cleared" size="sm">✓</Badge>
                )}
                {ticket.resaleStatus === 'listed' && (
                  <Badge variant="warning" size="sm">For Sale</Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-neutral-400 truncate">{event.name}</p>
            <p className="text-xs text-neutral-500 mt-1">
              {ticket.section} · Row {ticket.row} · Seat {ticket.seat}
            </p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            {showResaleInfo && ticket.resalePrice ? (
              <p className="text-lg font-bold text-amber-200">
                {formatCurrency(ticket.resalePrice, ticket.currency)}
              </p>
            ) : (
              <p className="text-lg font-bold text-white">
                {formatCurrency(ticket.faceValue, ticket.currency)}
              </p>
            )}
          </div>
        </div>

        {/* Past event overlay */}
        {isPastEvent && (
          <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center z-20">
            <div className="bg-neutral-800 rounded-full px-4 py-1.5 border border-neutral-600">
              <span className="text-neutral-300 font-semibold text-sm">PAST EVENT</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
