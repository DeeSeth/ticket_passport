/**
 * Client-side listing storage using localStorage
 * In production, this would be handled by a backend database
 */

export interface StoredListing {
  id: string;
  ticketId: string;
  eventId: string;
  sellerId: string;
  sellerName: string;
  // Ticket details for display
  eventArtist: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  eventCity: string;
  eventCountry: string;
  section: string;
  row: string;
  seat: string;
  faceValue: number;
  currency: string;
  // Listing details
  listingType: 'fixed' | 'auction';
  askingPrice: number; // For fixed price
  // Auction fields
  minimumBid?: number;
  reservePrice?: number;
  auctionEndsAt?: string;
  currentHighestBid?: number;
  totalBids?: number;
  // Status
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  listedAt: string;
  soldAt?: string;
  buyerId?: string;
}

const LISTINGS_STORAGE_KEY = 'passport_listings';

/**
 * Get all listings
 */
export function getAllListings(): StoredListing[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(LISTINGS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading listings:', error);
    return [];
  }
}

/**
 * Get active listings (for marketplace)
 */
export function getActiveListings(): StoredListing[] {
  const listings = getAllListings();
  const now = new Date();

  return listings.filter(listing => {
    if (listing.status !== 'active') return false;

    // Check if auction has expired
    if (listing.listingType === 'auction' && listing.auctionEndsAt) {
      if (new Date(listing.auctionEndsAt) <= now) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get listings by seller
 */
export function getSellerListings(sellerId: string): StoredListing[] {
  return getAllListings().filter(l => l.sellerId === sellerId);
}

/**
 * Get active listings by seller
 */
export function getActiveSellerListings(sellerId: string): StoredListing[] {
  return getActiveListings().filter(l => l.sellerId === sellerId);
}

/**
 * Get listing by ID
 */
export function getListingById(listingId: string): StoredListing | null {
  const listings = getAllListings();
  return listings.find(l => l.id === listingId) || null;
}

/**
 * Get listing for a specific ticket
 */
export function getListingByTicketId(ticketId: string): StoredListing | null {
  const listings = getAllListings();
  return listings.find(l => l.ticketId === ticketId && l.status === 'active') || null;
}

/**
 * Check if a ticket is currently listed
 */
export function isTicketListed(ticketId: string): boolean {
  return getListingByTicketId(ticketId) !== null;
}

/**
 * Create a new listing
 */
export function createListing(listing: StoredListing): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Not in browser' };

  try {
    // Check if ticket is already listed
    if (isTicketListed(listing.ticketId)) {
      return { success: false, error: 'This ticket is already listed' };
    }

    const listings = getAllListings();
    listings.push(listing);
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));

    return { success: true };
  } catch (error) {
    console.error('Error creating listing:', error);
    return { success: false, error: 'Failed to create listing' };
  }
}

/**
 * Update a listing
 */
export function updateListing(listingId: string, updates: Partial<StoredListing>): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Not in browser' };

  try {
    const listings = getAllListings();
    const index = listings.findIndex(l => l.id === listingId);

    if (index === -1) {
      return { success: false, error: 'Listing not found' };
    }

    listings[index] = { ...listings[index], ...updates };
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));

    return { success: true };
  } catch (error) {
    console.error('Error updating listing:', error);
    return { success: false, error: 'Failed to update listing' };
  }
}

/**
 * Cancel a listing
 */
export function cancelListing(listingId: string): { success: boolean; error?: string } {
  return updateListing(listingId, { status: 'cancelled' });
}

/**
 * Mark listing as sold
 */
export function markListingSold(listingId: string, buyerId: string): { success: boolean; error?: string } {
  return updateListing(listingId, {
    status: 'sold',
    soldAt: new Date().toISOString(),
    buyerId,
  });
}

/**
 * Update auction bid
 */
export function updateAuctionBid(listingId: string, bidAmount: number): { success: boolean; error?: string } {
  const listing = getListingById(listingId);
  if (!listing) {
    return { success: false, error: 'Listing not found' };
  }

  if (listing.listingType !== 'auction') {
    return { success: false, error: 'Not an auction listing' };
  }

  return updateListing(listingId, {
    currentHighestBid: bidAmount,
    totalBids: (listing.totalBids || 0) + 1,
  });
}

/**
 * Generate a unique listing ID
 */
export function generateListingId(): string {
  return `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Delete a listing (for cleanup - usually just cancel instead)
 */
export function deleteListing(listingId: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Not in browser' };

  try {
    const listings = getAllListings();
    const filtered = listings.filter(l => l.id !== listingId);
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error('Error deleting listing:', error);
    return { success: false, error: 'Failed to delete listing' };
  }
}
