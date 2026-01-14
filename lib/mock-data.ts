import { User, Event, Ticket, ResaleListing, Purchase, ResaleRules } from './types';

// Sample users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'jane@example.com',
    name: 'Jane Wang',
    passportScore: 92,
    isVerified: true,
    membershipStatus: 'active',
    membershipExpiresAt: new Date('2026-12-31'),
    createdAt: new Date('2024-03-15'),
    profileImage: '/avatars/jane.jpg',
  },
  {
    id: 'user-2',
    email: 'dee@example.com',
    name: 'Dee',
    passportScore: 88,
    isVerified: true,
    membershipStatus: 'active',
    membershipExpiresAt: new Date('2026-12-31'),
    createdAt: new Date('2024-06-01'),
    profileImage: '/avatars/dee.jpg',
  },
  {
    id: 'user-3',
    email: 'yue@example.com',
    name: 'Yue',
    passportScore: 95,
    isVerified: true,
    membershipStatus: 'active',
    membershipExpiresAt: new Date('2026-12-31'),
    createdAt: new Date('2024-01-20'),
    profileImage: '/avatars/yue.jpg',
  },
  {
    id: 'user-4',
    email: 'alex@example.com',
    name: 'Alex Chen',
    passportScore: 45,
    isVerified: false,
    membershipStatus: 'none',
    createdAt: new Date('2025-11-10'),
  },
];

// Resale rules presets
const standardRules: ResaleRules = {
  maxPriceMultiplier: 1.5,
  fanOnlyWindowHours: 48,
  transferDeadlineHours: 24,
  requiresIdMatch: true,
  charityPercentage: 10,
};

const strictRules: ResaleRules = {
  maxPriceMultiplier: 1.0, // Face value only
  fanOnlyWindowHours: 72,
  transferDeadlineHours: 48,
  requiresIdMatch: true,
  charityPercentage: 15,
};

const relaxedRules: ResaleRules = {
  maxPriceMultiplier: 2.0,
  fanOnlyWindowHours: 24,
  transferDeadlineHours: 12,
  requiresIdMatch: false,
  charityPercentage: 5,
};

// Sample events
export const mockEvents: Event[] = [
  {
    id: 'event-1',
    name: 'The Eras Tour',
    artist: 'Taylor Swift',
    venue: 'SoFi Stadium',
    city: 'Los Angeles',
    country: 'USA',
    date: new Date('2026-03-15T20:00:00'),
    imageUrl: '/events/eras-tour.jpg',
    description: 'Experience the magic of Taylor Swift\'s record-breaking Eras Tour.',
    resaleRules: strictRules,
  },
  {
    id: 'event-2',
    name: 'Renaissance World Tour',
    artist: 'Beyoncé',
    venue: 'Wembley Stadium',
    city: 'London',
    country: 'UK',
    date: new Date('2026-04-22T19:30:00'),
    imageUrl: '/events/renaissance.jpg',
    description: 'Queen Bey returns to London for an unforgettable night.',
    resaleRules: standardRules,
  },
  {
    id: 'event-3',
    name: 'Music of the Spheres',
    artist: 'Coldplay',
    venue: 'MetLife Stadium',
    city: 'New Jersey',
    country: 'USA',
    date: new Date('2026-05-10T19:00:00'),
    imageUrl: '/events/coldplay.jpg',
    description: 'An immersive visual and musical experience.',
    resaleRules: standardRules,
  },
  {
    id: 'event-4',
    name: 'World Tour 2026',
    artist: 'Bad Bunny',
    venue: 'Madison Square Garden',
    city: 'New York',
    country: 'USA',
    date: new Date('2026-02-28T21:00:00'),
    imageUrl: '/events/bad-bunny.jpg',
    description: 'El Conejo Malo takes over MSG.',
    resaleRules: relaxedRules,
  },
  {
    id: 'event-5',
    name: 'Born Pink World Tour',
    artist: 'BLACKPINK',
    venue: 'Tokyo Dome',
    city: 'Tokyo',
    country: 'Japan',
    date: new Date('2026-06-18T18:00:00'),
    imageUrl: '/events/blackpink.jpg',
    description: 'K-pop icons BLACKPINK perform in Tokyo.',
    resaleRules: strictRules,
  },
  {
    id: 'event-6',
    name: 'Midnights Tour',
    artist: 'The Weeknd',
    venue: 'O2 Arena',
    city: 'London',
    country: 'UK',
    date: new Date('2026-04-05T20:00:00'),
    imageUrl: '/events/weeknd.jpg',
    description: 'The Weeknd brings his cinematic live show to London.',
    resaleRules: standardRules,
  },
];

// Sample tickets
export const mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    eventId: 'event-1',
    ownerId: 'user-1',
    section: 'Floor A',
    row: '12',
    seat: '15',
    faceValue: 450,
    currency: 'USD',
    isCleared: true,
    resaleStatus: 'not_listed',
    barcode: 'PASSPORT-TKT-001-ABC123',
    purchasedAt: new Date('2025-09-01'),
    originalOwnerId: 'user-1',
    transferHistory: [],
  },
  {
    id: 'ticket-2',
    eventId: 'event-2',
    ownerId: 'user-1',
    section: '102',
    row: 'G',
    seat: '22',
    faceValue: 275,
    currency: 'GBP',
    isCleared: true,
    resaleStatus: 'listed',
    resalePrice: 350,
    barcode: 'PASSPORT-TKT-002-DEF456',
    purchasedAt: new Date('2025-10-15'),
    originalOwnerId: 'user-1',
    transferHistory: [],
  },
  {
    id: 'ticket-3',
    eventId: 'event-3',
    ownerId: 'user-2',
    section: 'GA',
    row: 'N/A',
    seat: 'General Admission',
    faceValue: 150,
    currency: 'USD',
    isCleared: true,
    resaleStatus: 'not_listed',
    barcode: 'PASSPORT-TKT-003-GHI789',
    purchasedAt: new Date('2025-11-20'),
    originalOwnerId: 'user-2',
    transferHistory: [],
  },
  {
    id: 'ticket-4',
    eventId: 'event-4',
    ownerId: 'user-3',
    section: 'VIP Box',
    row: '1',
    seat: '1-4',
    faceValue: 800,
    currency: 'USD',
    isCleared: true,
    resaleStatus: 'listed',
    resalePrice: 1200,
    barcode: 'PASSPORT-TKT-004-JKL012',
    purchasedAt: new Date('2025-08-05'),
    originalOwnerId: 'user-3',
    transferHistory: [],
  },
  {
    id: 'ticket-5',
    eventId: 'event-5',
    ownerId: 'user-2',
    section: 'Arena B',
    row: '5',
    seat: '8',
    faceValue: 320,
    currency: 'JPY',
    isCleared: true,
    resaleStatus: 'not_listed',
    barcode: 'PASSPORT-TKT-005-MNO345',
    purchasedAt: new Date('2025-12-01'),
    originalOwnerId: 'user-2',
    transferHistory: [],
  },
];

// Sample resale listings
export const mockListings: ResaleListing[] = [
  {
    id: 'listing-1',
    ticketId: 'ticket-2',
    sellerId: 'user-1',
    askingPrice: 350,
    listedAt: new Date('2026-01-05'),
    status: 'active',
  },
  {
    id: 'listing-2',
    ticketId: 'ticket-4',
    sellerId: 'user-3',
    askingPrice: 1200,
    listedAt: new Date('2026-01-10'),
    status: 'active',
  },
];

// Helper functions to get data
export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}

export function getEventById(id: string): Event | undefined {
  return mockEvents.find(event => event.id === id);
}

export function getTicketById(id: string): Ticket | undefined {
  return mockTickets.find(ticket => ticket.id === id);
}

export function getTicketsByUserId(userId: string): Ticket[] {
  return mockTickets.filter(ticket => ticket.ownerId === userId);
}

export function getTicketWithEvent(ticketId: string): (Ticket & { event: Event }) | undefined {
  const ticket = getTicketById(ticketId);
  if (!ticket) return undefined;
  const event = getEventById(ticket.eventId);
  if (!event) return undefined;
  return { ...ticket, event };
}

export function getActiveListings(): (ResaleListing & { ticket: Ticket; event: Event; seller: User })[] {
  return mockListings
    .filter(listing => listing.status === 'active')
    .map(listing => {
      const ticket = getTicketById(listing.ticketId)!;
      const event = getEventById(ticket.eventId)!;
      const seller = getUserById(listing.sellerId)!;
      return { ...listing, ticket, event, seller };
    });
}

export function getListingById(id: string): ResaleListing | undefined {
  return mockListings.find(listing => listing.id === id);
}

// Calculate resale price limits
export function getMaxResalePrice(ticket: Ticket, event: Event): number {
  return Math.floor(ticket.faceValue * event.resaleRules.maxPriceMultiplier);
}

// Check if ticket is eligible for entry guarantee
export function isEligibleForGuarantee(ticket: Ticket, user: User): boolean {
  return ticket.isCleared && user.isVerified && user.membershipStatus === 'active';
}

// Format currency
export function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(amount);
}

// Format date
export function formatEventDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
