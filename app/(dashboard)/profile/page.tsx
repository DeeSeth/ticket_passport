'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button, Badge } from '@/components/ui';
import PassportScore from '@/components/PassportScore';
import { mockTickets, getEventById } from '@/lib/mock-data';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  // Calculate stats
  const stats = useMemo(() => {
    if (!user) return { eventsAttended: 0, ticketsSold: 0, memberSince: '' };

    const userTickets = mockTickets.filter((t) => t.ownerId === user.id);
    const pastEvents = userTickets.filter((t) => {
      const event = getEventById(t.eventId);
      return event && new Date(event.date) < new Date();
    }).length;

    return {
      eventsAttended: pastEvents,
      ticketsSold: 0, // Mock - would come from actual sales data
      memberSince: new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      {/* Profile header */}
      <div className="bg-neutral-700/50 rounded-xl p-6 border border-neutral-600/50">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-neutral-900 text-3xl font-bold">{user.name.charAt(0)}</span>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              {user.isVerified && (
                <Badge variant="success" size="sm">Verified</Badge>
              )}
            </div>
            <p className="text-neutral-400">{user.email}</p>
            <p className="text-sm text-neutral-500">Member since {stats.memberSince}</p>
          </div>

          {/* Passport Score */}
          <PassportScore score={user.passportScore} size="lg" />
        </div>
      </div>

      {/* Membership card */}
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-amber-200 to-amber-300">
        <div className="p-6 text-neutral-900">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-neutral-700 text-sm">Concert Passport</p>
              <h3 className="text-2xl font-bold">
                {user.membershipStatus === 'active' ? 'Active Member' : 'Free Account'}
              </h3>
            </div>
            <div className="w-12 h-12 bg-neutral-900/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">P</span>
            </div>
          </div>

          {user.membershipStatus === 'active' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Entry Guarantee Active</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Verified Identity</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Priority Support</span>
              </div>
              {user.membershipExpiresAt && (
                <p className="text-sm text-neutral-700 pt-2 border-t border-neutral-900/20">
                  Renews: {new Date(user.membershipExpiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-neutral-700">Upgrade to unlock:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Entry Guarantee on all cleared tickets
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  Verified identity badge
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Priority customer support
                </li>
              </ul>
              <Link href="/verify">
                <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800">
                  Upgrade for $20/year
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50 text-center">
          <p className="text-2xl font-bold text-white">{stats.eventsAttended}</p>
          <p className="text-sm text-neutral-500">Events Attended</p>
        </div>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50 text-center">
          <p className="text-2xl font-bold text-white">{stats.ticketsSold}</p>
          <p className="text-sm text-neutral-500">Tickets Sold</p>
        </div>
        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50 text-center">
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-sm text-neutral-500">Disputes</p>
        </div>
      </div>

      {/* Passport Score explanation */}
      <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
        <h3 className="font-semibold text-white mb-2">About Your Passport Score</h3>
        <p className="text-sm text-neutral-400 mb-4">
          Your Passport Score reflects your reliability as a concert-goer. It&apos;s based on:
        </p>
        <ul className="space-y-2 text-sm text-neutral-400">
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-emerald-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Identity verification status
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-emerald-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Successful ticket transfers (buying & selling)
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-emerald-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Events attended vs. no-shows
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-emerald-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Dispute resolution history
          </li>
        </ul>
      </div>

      {/* Account settings */}
      <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
        <h3 className="font-semibold text-white mb-4">Account Settings</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 hover:bg-neutral-600/50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-neutral-300">Edit Profile</span>
            </div>
            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-neutral-600/50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-neutral-300">Payment Methods</span>
            </div>
            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-neutral-600/50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-neutral-300">Notifications</span>
            </div>
            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-neutral-600/50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-neutral-300">Help & Support</span>
            </div>
            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sign out */}
      <Button onClick={logout} variant="outline" className="w-full border-neutral-600 text-neutral-300 hover:bg-neutral-700">
        Sign Out
      </Button>
    </div>
  );
}
