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
  maxPriceMultiplier: 2.0, // Allow up to 2x face value (platform-wide cap)
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
    date: '2026-03-15T20:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
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
    date: '2026-04-22T19:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
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
    date: '2026-05-10T19:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
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
    date: '2026-02-28T21:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
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
    date: '2026-06-18T18:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
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
    date: '2026-04-05T20:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
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
    barcode: 'T-PASSPORT-TKT-001-ABC123',
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
    barcode: 'T-PASSPORT-TKT-002-DEF456',
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
    barcode: 'T-PASSPORT-TKT-003-GHI789',
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
    barcode: 'T-PASSPORT-TKT-004-JKL012',
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
    barcode: 'T-PASSPORT-TKT-005-MNO345',
    purchasedAt: new Date('2025-12-01'),
    originalOwnerId: 'user-2',
    transferHistory: [],
  },
  {
    id: 'ticket-6',
    eventId: 'event-1',
    ownerId: 'user-3',
    section: 'Floor',
    row: 'A',
    seat: '15',
    faceValue: 450,
    currency: 'USD',
    isCleared: true,
    resaleStatus: 'in_auction',
    barcode: 'T-PASSPORT-TKT-006-PQR678',
    purchasedAt: new Date('2025-11-20'),
    originalOwnerId: 'user-3',
    transferHistory: [],
  },
  {
    id: 'ticket-7',
    eventId: 'event-3',
    ownerId: 'user-1',
    section: 'Section 102',
    row: '12',
    seat: '8',
    faceValue: 200,
    currency: 'USD',
    isCleared: true,
    resaleStatus: 'in_auction',
    barcode: 'T-PASSPORT-TKT-007-STU901',
    purchasedAt: new Date('2025-12-05'),
    originalOwnerId: 'user-1',
    transferHistory: [],
  },
  // Additional tickets for more marketplace listings
  {
    id: 'ticket-8',
    eventId: 'event-1',
    ownerId: 'user-4',
    section: 'Floor B',
    row: '8',
    seat: '21',
    faceValue: 450,
    currency: 'USD',
    isCleared: true,
    resaleStatus: 'listed',
    resalePrice: 675,
    barcode: 'PASSPORT-TKT-008-VWX234',
    purchasedAt: new Date('2025-09-15'),
    originalOwnerId: 'user-4',
    transferHistory: [],
  },
  {
    id: 'ticket-9',
    eventId: 'event-2',
    ownerId: 'user-4',
    section: '205',
    row: 'M',
    seat: '14',
    faceValue: 225,
    currency: 'GBP',
    isCleared: true,
    resaleStatus: 'listed',
    resalePrice: 300,
    barcode: 'PASSPORT-TKT-009-YZA567',
    purchasedAt: new Date('2025-10-20'),
    originalOwnerId: 'user-4',
    transferHistory: [],
  },
  {
    id: 'ticket-10',
    eventId: 'event-5',
    ownerId: 'user-4',
    section: 'Arena A',
    row: '3',
    seat: '12',
    faceValue: 380,
    currency: 'USD',
    isCleared: true,
    resaleStatus: 'in_auction',
    barcode: 'PASSPORT-TKT-010-BCD890',
    purchasedAt: new Date('2025-11-25'),
    originalOwnerId: 'user-4',
    transferHistory: [],
  },
  {
    id: 'ticket-11',
    eventId: 'event-6',
    ownerId: 'user-3',
    section: 'Lower Bowl',
    row: '15',
    seat: '7',
    faceValue: 175,
    currency: 'GBP',
    isCleared: true,
    resaleStatus: 'listed',
    resalePrice: 250,
    barcode: 'PASSPORT-TKT-011-EFG123',
    purchasedAt: new Date('2025-12-10'),
    originalOwnerId: 'user-3',
    transferHistory: [],
  },
  {
    id: 'ticket-12',
    eventId: 'event-4',
    ownerId: 'user-2',
    section: 'Section 110',
    row: '22',
    seat: '5',
    faceValue: 350,
    currency: 'USD',
    isCleared: true,
    resaleStatus: 'listed',
    resalePrice: 500,
    barcode: 'PASSPORT-TKT-012-HIJ456',
    purchasedAt: new Date('2025-08-20'),
    originalOwnerId: 'user-2',
    transferHistory: [],
  },
  {
    id: 'ticket-13',
    eventId: 'event-3',
    ownerId: 'user-4',
    section: 'Section 215',
    row: '5',
    seat: '18',
    faceValue: 125,
    currency: 'USD',
    isCleared: true,
    resaleStatus: 'in_auction',
    barcode: 'PASSPORT-TKT-013-KLM789',
    purchasedAt: new Date('2025-11-28'),
    originalOwnerId: 'user-4',
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
  // Auction listings
  {
    id: 'listing-3',
    ticketId: 'ticket-6',
    sellerId: 'user-3',
    askingPrice: 0, // Not used for auctions
    listedAt: new Date('2026-01-12'),
    status: 'active',
    isAuction: true,
    minimumBid: 500, // Starting bid above face value ($450)
    reservePrice: 700,
    auctionEndsAt: new Date('2026-01-17T20:00:00'),
    currentHighestBid: 620,
    totalBids: 3,
  },
  {
    id: 'listing-4',
    ticketId: 'ticket-7',
    sellerId: 'user-1',
    askingPrice: 0,
    listedAt: new Date('2026-01-13'),
    status: 'active',
    isAuction: true,
    minimumBid: 250, // Starting bid above face value ($200)
    reservePrice: 350,
    auctionEndsAt: new Date('2026-01-15T19:00:00'),
    currentHighestBid: 310,
    totalBids: 5,
  },
  // Additional fixed-price listings
  {
    id: 'listing-5',
    ticketId: 'ticket-8',
    sellerId: 'user-4',
    askingPrice: 675,
    listedAt: new Date('2026-01-08'),
    status: 'active',
  },
  {
    id: 'listing-6',
    ticketId: 'ticket-9',
    sellerId: 'user-4',
    askingPrice: 300,
    listedAt: new Date('2026-01-09'),
    status: 'active',
  },
  {
    id: 'listing-7',
    ticketId: 'ticket-11',
    sellerId: 'user-3',
    askingPrice: 250,
    listedAt: new Date('2026-01-11'),
    status: 'active',
  },
  {
    id: 'listing-8',
    ticketId: 'ticket-12',
    sellerId: 'user-2',
    askingPrice: 500,
    listedAt: new Date('2026-01-07'),
    status: 'active',
  },
  // Additional auction listings
  {
    id: 'listing-9',
    ticketId: 'ticket-10',
    sellerId: 'user-4',
    askingPrice: 0,
    listedAt: new Date('2026-01-12'),
    status: 'active',
    isAuction: true,
    minimumBid: 400,
    reservePrice: 600,
    auctionEndsAt: new Date('2026-01-20T18:00:00'),
    currentHighestBid: 480,
    totalBids: 4,
  },
  {
    id: 'listing-10',
    ticketId: 'ticket-13',
    sellerId: 'user-4',
    askingPrice: 0,
    listedAt: new Date('2026-01-14'),
    status: 'active',
    isAuction: true,
    minimumBid: 150,
    reservePrice: 225,
    auctionEndsAt: new Date('2026-01-18T19:00:00'),
    currentHighestBid: 175,
    totalBids: 2,
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
