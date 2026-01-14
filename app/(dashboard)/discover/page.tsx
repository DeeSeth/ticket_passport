'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Badge, Input } from '@/components/ui';
import { useEventsSearch } from '@/lib/hooks/use-events';

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('Music');
  const [currentPage, setCurrentPage] = useState(0);

  const { events, page, loading, error } = useEventsSearch({
    keyword: searchQuery || undefined,
    city: city || undefined,
    classificationName: category,
    page: currentPage,
    size: 20,
    sort: 'date,asc',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Discover Events</h1>
        <p className="text-neutral-400">Browse upcoming events powered by Ticketmaster</p>
      </div>

      {/* Search and filters */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by artist, event, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              dark
            />
          </div>
          <div className="sm:w-48">
            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              dark
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
            <option value="Arts & Theatre">Arts & Theatre</option>
            <option value="Family">Family</option>
            <option value="Film">Film</option>
          </select>
          <Button type="submit" variant="gold">
            Search
          </Button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neutral-700 border-t-amber-200"></div>
          <p className="text-neutral-400 mt-4">Loading events...</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {/* Results count */}
          {page.totalElements > 0 && (
            <div className="text-sm text-neutral-400">
              Found {page.totalElements.toLocaleString()} events
            </div>
          )}

          {/* Events grid */}
          {events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event) => {
                  const eventDate = new Date(event.date);
                  const isUpcoming = eventDate > new Date();

                  return (
                    <Link
                      key={event.id}
                      href={`/discover/${event.id}`}
                      className="bg-neutral-700/50 rounded-xl border border-neutral-600/50 overflow-hidden hover:border-amber-200/30 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Event image */}
                        {event.imageUrl ? (
                          <div className="sm:w-48 h-32 sm:h-auto relative flex-shrink-0">
                            <img
                              src={event.imageUrl}
                              alt={event.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-neutral-700 to-neutral-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-amber-200/20 text-4xl font-bold">
                              {event.artist.charAt(0)}
                            </span>
                          </div>
                        )}

                        {/* Event details */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-bold text-white">{event.artist}</h3>
                              <p className="text-sm text-neutral-400">{event.name}</p>
                            </div>
                            {isUpcoming && (
                              <Badge variant="info" size="sm">
                                Upcoming
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-neutral-500">
                            {event.venue}, {event.city}
                          </p>
                          <p className="text-sm text-neutral-500 mb-3">
                            {eventDate.toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>

                          {event.description && (
                            <p className="text-sm text-neutral-400 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {page.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    variant="outline"
                    className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                  >
                    Previous
                  </Button>
                  <span className="text-neutral-400 px-4">
                    Page {currentPage + 1} of {page.totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage((p) => Math.min(page.totalPages - 1, p + 1))}
                    disabled={currentPage >= page.totalPages - 1}
                    variant="outline"
                    className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-neutral-700/50 rounded-xl p-8 border border-neutral-600/50 text-center">
              <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-1">No events found</h3>
              <p className="text-neutral-400">
                {searchQuery || city
                  ? 'Try adjusting your search filters'
                  : 'No events are currently available'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
