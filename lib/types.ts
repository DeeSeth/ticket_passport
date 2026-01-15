// Verification score constants
export const VERIFICATION_SCORES = {
  EMAIL: 15,
  PHONE: 20,
  ID: 45,
} as const;

export const MARKETPLACE_MIN_SCORE = 80;

// Verification status for each tier
export interface VerificationStatus {
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  phoneVerified: boolean;
  phoneVerifiedAt?: Date;
  phone?: string; // Stored phone number (masked for display)
  idVerified: boolean;
  idVerifiedAt?: Date;
  idType?: 'passport' | 'drivers_license' | 'national_id';
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  passportScore: number; // 0-100, computed from verification tiers
  isVerified: boolean; // Convenience: true if all verifications complete
  verification: VerificationStatus; // Granular verification tracking
  membershipStatus: 'active' | 'expired' | 'none';
  membershipExpiresAt?: Date;
  createdAt: Date;
  profileImage?: string;
}

// Event types
export interface Event {
  id: string;
  name: string;
  artist: string;
  venue: string;
  city: string;
  country: string;
  date: Date;
  imageUrl: string;
  description?: string;
  resaleRules: ResaleRules;
}

// Resale rules set by artists/promoters
export interface ResaleRules {
  maxPriceMultiplier: number; // e.g., 1.5 = 150% of face value max
  fanOnlyWindowHours: number; // Hours only verified fans can buy before brokers
  transferDeadlineHours: number; // Hours before show that transfers must complete
  requiresIdMatch: boolean; // Must buyer ID match ticket holder?
  charityPercentage: number; // % of resale premium goes to charity
  allowedCountries?: string[]; // Optional country restrictions
}

// Ticket types
export interface Ticket {
  id: string;
  eventId: string;
  ownerId: string;
  section: string;
  row: string;
  seat: string;
  faceValue: number;
  currency: string;
  isCleared: boolean; // Verified by PASSPORT
  resaleStatus: 'not_listed' | 'listed' | 'pending_transfer' | 'sold';
  resalePrice?: number;
  barcode: string;
  purchasedAt: Date;
  originalOwnerId: string;
  transferHistory: TransferRecord[];
}

// Transfer history record
export interface TransferRecord {
  id: string;
  fromUserId: string;
  toUserId: string;
  price: number;
  transferredAt: Date;
  method: 'resale' | 'gift' | 'original_purchase';
}

// Listing for marketplace
export interface ResaleListing {
  id: string;
  ticketId: string;
  sellerId: string;
  askingPrice: number;
  listedAt: Date;
  status: 'active' | 'pending' | 'sold' | 'cancelled';
  expiresAt?: Date;
}

// Purchase/escrow state
export interface Purchase {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  ticketId: string;
  amount: number;
  platformFee: number;
  charityAmount: number;
  sellerPayout: number;
  status: 'pending_payment' | 'in_escrow' | 'completed' | 'refunded' | 'disputed';
  createdAt: Date;
  completedAt?: Date;
}

// Entry guarantee status
export interface EntryGuarantee {
  ticketId: string;
  status: 'guaranteed' | 'not_eligible' | 'pending_verification';
  reason?: string;
  coverageAmount: number;
}

// Auth state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Verification step
export interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}
