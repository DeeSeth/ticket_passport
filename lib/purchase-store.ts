/**
 * Simple client-side purchase tracking using localStorage
 * In production, this would be handled by a backend database
 */

export interface PurchasedTicket {
  ticketId: string;
  listingId: string;
  eventId: string;
  buyerId: string;
  purchasedAt: string; // ISO date string
  amount: number;
  currency: string;
}

const STORAGE_KEY = 'passport_purchases';

/**
 * Get all purchases for the current user
 */
export function getUserPurchases(userId: string): PurchasedTicket[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const allPurchases: PurchasedTicket[] = JSON.parse(stored);
    return allPurchases.filter(p => p.buyerId === userId);
  } catch (error) {
    console.error('Error reading purchases:', error);
    return [];
  }
}

/**
 * Add a new purchase
 */
export function addPurchase(purchase: PurchasedTicket): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allPurchases: PurchasedTicket[] = stored ? JSON.parse(stored) : [];

    allPurchases.push(purchase);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPurchases));
  } catch (error) {
    console.error('Error saving purchase:', error);
  }
}

/**
 * Check if user has purchased a specific ticket
 */
export function hasPurchasedTicket(userId: string, ticketId: string): boolean {
  const purchases = getUserPurchases(userId);
  return purchases.some(p => p.ticketId === ticketId);
}
