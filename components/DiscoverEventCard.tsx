'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from './ui';
import { Event } from '@/lib/types';

interface DiscoverEventCardProps {
  event: Event;
  href: string;
  badge?: string;
  badgeVariant?: 'info' | 'cleared' | 'warning';
}

export default function DiscoverEventCard({ event, href, badge, badgeVariant = 'info' }: DiscoverEventCardProps) {
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <Link href={href}>
      <div className="group bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 hover:border-amber-200/30 transition-all duration-200 cursor-pointer hover:scale-[1.02]">
        {/* Event Image */}
        <div className="relative h-44 bg-gradient-to-br from-neutral-700 to-neutral-600">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-amber-200/20 text-6xl font-bold">
                {event.artist.charAt(0)}
              </span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Badge */}
          {badge && (
            <div className="absolute top-3 right-3">
              <Badge variant={badgeVariant} size="sm">{badge}</Badge>
            </div>
          )}

          {/* Date overlay */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-semibold text-sm">{dateStr}</p>
            <p className="text-white/80 text-xs">{timeStr}</p>
          </div>
        </div>

        {/* Event Info */}
        <div className="p-4">
          <h3 className="font-bold text-white text-lg truncate">{event.artist}</h3>
          <p className="text-sm text-neutral-400 truncate">{event.name}</p>

          <div className="flex items-center gap-2 text-neutral-500 mt-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm truncate">{event.venue}, {event.city}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
