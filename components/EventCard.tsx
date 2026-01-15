'use client';

import Link from 'next/link';
import { Badge } from './ui';
import { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
  href: string;
  badge?: string;
  badgeVariant?: 'info' | 'cleared' | 'warning';
  showDescription?: boolean;
}

// Artist-specific accent colors
const artistColors: Record<string, string> = {
  'Taylor Swift': 'from-purple-600 to-pink-500',
  'Beyoncé': 'from-amber-500 to-orange-500',
  'Coldplay': 'from-cyan-500 to-blue-600',
  'Bad Bunny': 'from-red-500 to-pink-600',
  'BLACKPINK': 'from-pink-500 to-fuchsia-600',
  'The Weeknd': 'from-red-600 to-rose-700',
};

const defaultColor = 'from-amber-500 to-orange-500';

export default function EventCard({ event, href, badge, badgeVariant = 'info', showDescription = false }: EventCardProps) {
  const gradient = artistColors[event.artist] || defaultColor;
  const eventDate = new Date(event.date);
  const monthShort = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNum = eventDate.getDate();

  return (
    <Link href={href}>
      <div className="group relative flex hover:scale-[1.01] transition-all duration-300 cursor-pointer h-32">

        {/* Left colored stub section */}
        <div className={`relative w-20 bg-gradient-to-br ${gradient} rounded-l-xl flex flex-col justify-center items-center`}>
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
              {badge && (
                <Badge variant={badgeVariant} size="sm">{badge}</Badge>
              )}
            </div>
            <p className="text-sm text-neutral-400 truncate">{event.name}</p>
            <p className="text-xs text-neutral-500 mt-1 truncate">{event.venue}, {event.city}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
