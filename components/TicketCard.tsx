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

export default function TicketCard({ ticket, event, showResaleInfo = false }: TicketCardProps) {
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <Link href={`/wallet/${ticket.id}`}>
      <div className="bg-neutral-700/50 rounded-xl border border-neutral-600/50 overflow-hidden hover:scale-[1.02] hover:border-amber-200/30 transition-all duration-200 cursor-pointer">
        {/* Event Image */}
        <div className="relative h-32 bg-gradient-to-br from-neutral-700 to-neutral-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-amber-200/20 text-4xl font-bold">
              {event.artist.charAt(0)}
            </span>
          </div>
          {/* Status badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {ticket.isCleared && (
              <Badge variant="cleared" size="sm">Cleared</Badge>
            )}
            {ticket.resaleStatus === 'listed' && (
              <Badge variant="warning" size="sm">For Sale</Badge>
            )}
          </div>
          {isPastEvent && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Past Event</span>
            </div>
          )}
        </div>

        {/* Ticket Info */}
        <div className="p-4">
          <h3 className="font-bold text-white text-lg truncate">{event.artist}</h3>
          <p className="text-sm text-neutral-400 truncate">{event.name}</p>
          <p className="text-xs text-neutral-500 mt-1">{event.venue}, {event.city}</p>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-sm font-medium text-neutral-300">
                {ticket.section} • Row {ticket.row} • Seat {ticket.seat}
              </p>
            </div>
            <div className="text-right">
              {showResaleInfo && ticket.resalePrice ? (
                <>
                  <p className="text-xs text-neutral-500 line-through">
                    {formatCurrency(ticket.faceValue, ticket.currency)}
                  </p>
                  <p className="text-lg font-bold text-amber-200">
                    {formatCurrency(ticket.resalePrice, ticket.currency)}
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold text-white">
                  {formatCurrency(ticket.faceValue, ticket.currency)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
