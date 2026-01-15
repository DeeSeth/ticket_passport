'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { maskEmail } from '@/lib/verification-utils';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, verifyEmail, sendEmailCode, isAuthenticated, isLoading } = useAuth();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Redirect if email already verified
  useEffect(() => {
    if (user?.verification?.emailVerified) {
      router.push('/verify');
    }
  }, [user, router]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    const success = await verifyEmail(code);

    if (success) {
      router.push('/verify');
    } else {
      setError('Invalid verification code. Please try again.');
    }
    setIsVerifying(false);
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    await sendEmailCode();
    setResent(true);
    setCountdown(60);
    setTimeout(() => setResent(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
            <span className="text-amber-200 font-bold text-xl">P</span>
          </div>
          <span className="font-medium text-white text-lg tracking-wide">PASSPORT</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50">
            {/* Icon */}
            <div className="w-16 h-16 bg-amber-200/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Verify Your Email
            </h1>
            <p className="text-neutral-400 text-center mb-6">
              We sent a 6-digit code to{' '}
              <span className="text-white">{user?.email ? maskEmail(user.email) : 'your email'}</span>
            </p>

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <Input
                  label="Verification Code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  dark
                />
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="gold"
                className="w-full"
                disabled={code.length !== 6 || isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>

            {/* Resend code */}
            <div className="mt-6 text-center">
              {resent ? (
                <p className="text-emerald-400 text-sm">Code sent! Check your inbox.</p>
              ) : countdown > 0 ? (
                <p className="text-neutral-500 text-sm">
                  Resend code in {countdown}s
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-amber-200 hover:text-amber-300 text-sm font-medium transition-colors"
                >
                  Didn&apos;t receive the code? Resend
                </button>
              )}
            </div>

            {/* Demo hint */}
            <div className="mt-6 p-3 bg-neutral-700/30 rounded-lg">
              <p className="text-xs text-neutral-400 text-center">
                <span className="text-amber-200">Demo:</span> Use code <span className="font-mono text-white">123456</span> or check the browser console for the generated code.
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-8 h-1 bg-amber-200 rounded-full" />
            <div className="w-8 h-1 bg-neutral-700 rounded-full" />
            <div className="w-8 h-1 bg-neutral-700 rounded-full" />
          </div>
          <p className="text-center text-neutral-500 text-sm mt-2">
            Step 1 of 3: Email Verification
          </p>
        </div>
      </main>
    </div>
  );
}
