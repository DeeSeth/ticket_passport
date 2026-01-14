/**
 * Client-side bid tracking using localStorage
 * In production, this would be handled by a backend database with real-time updates
 */

import { Bid } from './types';

export interface StoredBid {
  id: string;
  listingId: string;
  ticketId: string;
  eventId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  currency: string;
  bidAt: string; // ISO date string
  status: 'active' | 'outbid' | 'winning' | 'won' | 'lost' | 'withdrawn';
  isAutoBid?: boolean;
  maxAutoBid?: number;
  // Event/listing context for display
  eventArtist: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  section: string;
  row: string;
  seat: string;
  auctionEndsAt: string;
  reservePrice?: number;
  sellerName: string;
}

export interface OutbidNotification {
  id: string;
  bidId: string;
  listingId: string;
  eventArtist: string;
  eventName: string;
  currentHighestBid: number;
  yourBid: number;
  currency: string;
  createdAt: string;
  isRead: boolean;
}

const BIDS_STORAGE_KEY = 'passport_bids';
const NOTIFICATIONS_STORAGE_KEY = 'passport_bid_notifications';

/**
 * Get all bids for a user
 */
export function getUserBids(userId: string): StoredBid[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(BIDS_STORAGE_KEY);
    if (!stored) return [];

    const allBids: StoredBid[] = JSON.parse(stored);
    return allBids
      .filter(b => b.bidderId === userId)
      .sort((a, b) => new Date(b.bidAt).getTime() - new Date(a.bidAt).getTime());
  } catch (error) {
    console.error('Error reading bids:', error);
    return [];
  }
}

/**
 * Get active bids (not outbid, won, or lost) for a user
 */
export function getActiveBids(userId: string): StoredBid[] {
  return getUserBids(userId).filter(b =>
    b.status === 'active' || b.status === 'winning'
  );
}

/**
 * Get user's bid on a specific listing
 */
export function getUserBidOnListing(userId: string, listingId: string): StoredBid | null {
  const userBids = getUserBids(userId);
  return userBids.find(b => b.listingId === listingId) || null;
}

/**
 * Get all bids for a listing (for displaying bid history)
 */
export function getListingBids(listingId: string): StoredBid[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(BIDS_STORAGE_KEY);
    if (!stored) return [];

    const allBids: StoredBid[] = JSON.parse(stored);
    return allBids
      .filter(b => b.listingId === listingId)
      .sort((a, b) => b.amount - a.amount); // Highest first
  } catch (error) {
    console.error('Error reading listing bids:', error);
    return [];
  }
}

/**
 * Place a new bid
 */
export function placeBid(bid: StoredBid): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Not in browser' };

  try {
    const stored = localStorage.getItem(BIDS_STORAGE_KEY);
    const allBids: StoredBid[] = stored ? JSON.parse(stored) : [];

    // Find existing bids on this listing
    const listingBids = allBids.filter(b => b.listingId === bid.listingId);
    const highestBid = listingBids.reduce((max, b) => Math.max(max, b.amount), 0);

    // Check if bid is high enough
    if (bid.amount <= highestBid) {
      return { success: false, error: 'Bid must be higher than current highest bid' };
    }

    // Mark previous bids on this listing as outbid
    const updatedBids = allBids.map(b => {
      if (b.listingId === bid.listingId && b.bidderId !== bid.bidderId) {
        // Create outbid notification for the user
        if (b.status === 'active' || b.status === 'winning') {
          createOutbidNotification(b, bid.amount);
        }
        return { ...b, status: 'outbid' as const };
      }
      // Update user's previous bid on this listing
      if (b.listingId === bid.listingId && b.bidderId === bid.bidderId) {
        return { ...b, status: 'outbid' as const };
      }
      return b;
    });

    // Add new bid as winning
    updatedBids.push({ ...bid, status: 'winning' });
    localStorage.setItem(BIDS_STORAGE_KEY, JSON.stringify(updatedBids));

    return { success: true };
  } catch (error) {
    console.error('Error placing bid:', error);
    return { success: false, error: 'Failed to place bid' };
  }
}

/**
 * Update bid status (e.g., when auction ends)
 */
export function updateBidStatus(bidId: string, status: StoredBid['status']): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(BIDS_STORAGE_KEY);
    if (!stored) return;

    const allBids: StoredBid[] = JSON.parse(stored);
    const updatedBids = allBids.map(b =>
      b.id === bidId ? { ...b, status } : b
    );
    localStorage.setItem(BIDS_STORAGE_KEY, JSON.stringify(updatedBids));
  } catch (error) {
    console.error('Error updating bid status:', error);
  }
}

/**
 * Withdraw a bid
 */
export function withdrawBid(bidId: string): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Not in browser' };

  try {
    const stored = localStorage.getItem(BIDS_STORAGE_KEY);
    if (!stored) return { success: false, error: 'Bid not found' };

    const allBids: StoredBid[] = JSON.parse(stored);
    const bidIndex = allBids.findIndex(b => b.id === bidId);

    if (bidIndex === -1) {
      return { success: false, error: 'Bid not found' };
    }

    const bid = allBids[bidIndex];

    // Check if auction has ended
    if (new Date(bid.auctionEndsAt) <= new Date()) {
      return { success: false, error: 'Cannot withdraw bid after auction has ended' };
    }

    allBids[bidIndex] = { ...bid, status: 'withdrawn' };
    localStorage.setItem(BIDS_STORAGE_KEY, JSON.stringify(allBids));

    return { success: true };
  } catch (error) {
    console.error('Error withdrawing bid:', error);
    return { success: false, error: 'Failed to withdraw bid' };
  }
}

// ============ Notifications ============

function createOutbidNotification(outbidBid: StoredBid, newHighestBid: number): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const notifications: OutbidNotification[] = stored ? JSON.parse(stored) : [];

    const notification: OutbidNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bidId: outbidBid.id,
      listingId: outbidBid.listingId,
      eventArtist: outbidBid.eventArtist,
      eventName: outbidBid.eventName,
      currentHighestBid: newHighestBid,
      yourBid: outbidBid.amount,
      currency: outbidBid.currency,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    notifications.push(notification);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

/**
 * Get unread notifications for a user
 */
export function getUnreadNotifications(userId: string): OutbidNotification[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!stored) return [];

    const notifications: OutbidNotification[] = JSON.parse(stored);
    const userBids = getUserBids(userId);
    const userBidIds = new Set(userBids.map(b => b.id));

    return notifications
      .filter(n => userBidIds.has(n.bidId) && !n.isRead)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error reading notifications:', error);
    return [];
  }
}

/**
 * Get all notifications for a user
 */
export function getAllNotifications(userId: string): OutbidNotification[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!stored) return [];

    const notifications: OutbidNotification[] = JSON.parse(stored);
    const userBids = getUserBids(userId);
    const userBidIds = new Set(userBids.map(b => b.id));

    return notifications
      .filter(n => userBidIds.has(n.bidId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error reading notifications:', error);
    return [];
  }
}

/**
 * Mark notification as read
 */
export function markNotificationRead(notificationId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!stored) return;

    const notifications: OutbidNotification[] = JSON.parse(stored);
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error marking notification read:', error);
  }
}

/**
 * Mark all notifications as read for a user
 */
export function markAllNotificationsRead(userId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!stored) return;

    const notifications: OutbidNotification[] = JSON.parse(stored);
    const userBids = getUserBids(userId);
    const userBidIds = new Set(userBids.map(b => b.id));

    const updated = notifications.map(n =>
      userBidIds.has(n.bidId) ? { ...n, isRead: true } : n
    );
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error marking notifications read:', error);
  }
}

/**
 * Generate a unique bid ID
 */
export function generateBidId(): string {
  return `bid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
