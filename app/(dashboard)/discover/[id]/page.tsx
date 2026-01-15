'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Badge } from '@/components/ui';
import ResaleRulesDisplay from '@/components/ResaleRules';
import { useEvent } from '@/lib/hooks/use-events';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { event, loading, error } = useEvent(eventId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neutral-700 border-t-amber-200 mb-4"></div>
          <p className="text-neutral-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Event Not Found</h2>
          <p className="text-neutral-400 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <Link href="/discover">
            <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-700">
              Back to Discover
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/discover"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Discover
      </Link>

      {/* Event header with image */}
      <div className="bg-neutral-700/50 rounded-xl border border-neutral-600/50 overflow-hidden">
        {event.imageUrl && (
          <div className="w-full h-64 relative">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{event.artist}</h1>
              <p className="text-xl text-neutral-300">{event.name}</p>
            </div>
            {isUpcoming && (
              <Badge variant="info">
                Upcoming
              </Badge>
            )}
          </div>

          {/* Event info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Date & Time</p>
                <p className="text-white font-medium">
                  {eventDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-neutral-400">
                  {eventDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Venue</p>
                <p className="text-white font-medium">{event.venue}</p>
                <p className="text-neutral-400">
                  {event.city}, {event.country}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">About This Event</h3>
              <p className="text-neutral-400">{event.description}</p>
            </div>
          )}

          {/* Resale rules */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Resale Rules</h3>
            <ResaleRulesDisplay
              rules={event.resaleRules}
              faceValue={100} // Default face value for display
              currency="USD"
              dark
            />
          </div>

          {/* Info banner */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Ticketmaster Event</h4>
                <p className="text-sm text-neutral-400">
                  This event is powered by Ticketmaster. Tickets listed for resale on T-PASSPORT must comply with the resale rules shown above.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/marketplace" className="flex-1">
              <Button variant="gold" className="w-full">
                Check Marketplace
              </Button>
            </Link>
            <Link href="/sell" className="flex-1">
              <Button variant="outline" className="w-full border-neutral-600 text-neutral-300 hover:bg-neutral-700">
                List My Ticket
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
