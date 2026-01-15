import { User, VerificationStatus, VERIFICATION_SCORES } from './types';

/**
 * Check if user can access the marketplace (buy/sell tickets)
 * Requires ALL THREE verifications: email, phone, AND ID
 */
export function canAccessMarketplace(user: User | null): boolean {
  if (!user) return false;
  const { verification } = user;
  return verification.emailVerified && verification.phoneVerified && verification.idVerified;
}

/**
 * Get appropriate message based on which verifications are missing
 */
export function getVerificationGateMessage(user: User): string {
  const { verification } = user;
  const missing: string[] = [];

  if (!verification.emailVerified) missing.push('email');
  if (!verification.phoneVerified) missing.push('phone');
  if (!verification.idVerified) missing.push('ID');

  if (missing.length === 3) {
    return 'Complete email, phone, and ID verification to access the marketplace.';
  }
  if (missing.length === 2) {
    return `Complete ${missing[0]} and ${missing[1]} verification to access the marketplace.`;
  }
  if (missing.length === 1) {
    return `Complete ${missing[0]} verification to access the marketplace.`;
  }
  return '';
}

/**
 * Get list of missing verifications
 */
export function getMissingVerifications(user: User): ('email' | 'phone' | 'id')[] {
  const { verification } = user;
  const missing: ('email' | 'phone' | 'id')[] = [];

  if (!verification.emailVerified) missing.push('email');
  if (!verification.phoneVerified) missing.push('phone');
  if (!verification.idVerified) missing.push('id');

  return missing;
}

/**
 * Calculate passport score from verification status
 */
export function calculatePassportScore(verification: VerificationStatus): number {
  let score = 0;
  if (verification.emailVerified) score += VERIFICATION_SCORES.EMAIL;
  if (verification.phoneVerified) score += VERIFICATION_SCORES.PHONE;
  if (verification.idVerified) score += VERIFICATION_SCORES.ID;
  return score;
}

/**
 * Check if user is fully verified (all three tiers complete)
 */
export function isFullyVerified(verification: VerificationStatus): boolean {
  return verification.emailVerified && verification.phoneVerified && verification.idVerified;
}

/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Mask phone number for display (e.g., +1 ***-***-1234)
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  const lastFour = phone.slice(-4);
  const prefix = phone.slice(0, phone.length - 10) || '+1';
  return `${prefix} ***-***-${lastFour}`;
}

/**
 * Mask email for display (e.g., j***e@example.com)
 */
export function maskEmail(email: string): string {
  if (!email) return email;
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}
