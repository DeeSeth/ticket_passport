'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { User } from '@/lib/types';
import { canAccessMarketplace, getMissingVerifications } from '@/lib/verification-utils';

interface VerificationBannerProps {
  user: User;
}

export default function VerificationBanner({ user }: VerificationBannerProps) {
  // Don't show if fully verified
  if (canAccessMarketplace(user)) {
    return null;
  }

  const missing = getMissingVerifications(user);

  // Get appropriate message
  const getMessage = () => {
    if (missing.length === 3) {
      return 'Complete email, phone, and ID verification to access the marketplace.';
    }
    if (missing.length === 2) {
      const formatted = missing.map(m => m === 'id' ? 'ID' : m).join(' and ');
      return `Complete ${formatted} verification to access the marketplace.`;
    }
    if (missing.length === 1) {
      const formatted = missing[0] === 'id' ? 'ID' : missing[0];
      return `Complete ${formatted} verification to unlock buying and selling.`;
    }
    return '';
  };

  // Get link destination based on what's missing
  const getVerifyLink = () => {
    if (missing.includes('email')) return '/verify-email';
    return '/verify';
  };

  return (
    <div className="bg-amber-200/10 border border-amber-200/20 rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          {/* Warning icon */}
          <div className="w-10 h-10 bg-amber-200/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-amber-200">Verification Incomplete</p>
            <p className="text-sm text-neutral-400">{getMessage()}</p>
          </div>
        </div>
        <Link href={getVerifyLink()}>
          <Button variant="gold" size="sm">
            Complete Verification
          </Button>
        </Link>
      </div>

      {/* Progress bar showing score */}
      <div className="mt-4 pt-4 border-t border-amber-200/10">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-neutral-400">Passport Score</span>
          <span className="text-amber-200 font-medium">{user.passportScore}/80 required</span>
        </div>
        <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-200 to-amber-300 transition-all duration-500"
            style={{ width: `${Math.min((user.passportScore / 80) * 100, 100)}%` }}
          />
        </div>

        {/* Verification checklist */}
        <div className="mt-3 flex flex-wrap gap-3">
          <VerificationBadge
            label="Email"
            verified={user.verification?.emailVerified}
          />
          <VerificationBadge
            label="Phone"
            verified={user.verification?.phoneVerified}
          />
          <VerificationBadge
            label="ID"
            verified={user.verification?.idVerified}
          />
        </div>
      </div>
    </div>
  );
}

function VerificationBadge({ label, verified }: { label: string; verified?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
      verified
        ? 'bg-emerald-500/20 text-emerald-400'
        : 'bg-neutral-700/50 text-neutral-500'
    }`}>
      {verified ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
        </svg>
      )}
      {label}
    </div>
  );
}
