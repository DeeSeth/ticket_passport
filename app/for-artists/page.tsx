import Link from 'next/link';

export default function ForArtistsPage() {
  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <header className="bg-neutral-950 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="text-amber-200 font-bold text-xl">P</span>
              </div>
              <span className="font-medium text-white text-lg tracking-wide">T-PASSPORT</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-neutral-300 hover:text-white font-medium transition-colors">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-amber-200 to-amber-300 text-neutral-900 px-5 py-2.5 rounded-lg font-semibold hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-200/10 border border-amber-200/20 text-amber-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
              For Artists
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Your Tickets.<br />
              <span className="text-amber-200">Your Rules.</span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed mb-8">
              Take control of your ticket economy. Set resale price caps, transfer windows, and charity splits—ensuring your fans get fair access and scalpers get nothing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:artists@ticketpassport.com"
                className="inline-flex items-center justify-center bg-gradient-to-r from-amber-200 to-amber-300 text-neutral-900 px-8 py-4 rounded-lg font-semibold text-lg hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                Partner With Us
              </a>
              <Link
                href="/about"
                className="inline-flex items-center justify-center border border-neutral-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                The Secondary Market is <span className="text-red-400">Broken</span>
              </h2>
              <div className="space-y-4 text-neutral-400 leading-relaxed">
                <p>
                  Scalpers buy up tickets with bots and resell them at 5-10x face value. Your most loyal fans—the ones who follow your music, buy your merch, and show up to every show—get priced out.
                </p>
                <p>
                  Meanwhile, you have zero visibility into where your tickets end up, no control over pricing, and no way to reward the fans who deserve access most.
                </p>
              </div>
            </div>
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50">
              <h3 className="text-lg font-semibold text-white mb-6">Without T-PASSPORT</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-neutral-400">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Tickets resold at 500%+ markup</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Bots snag tickets in seconds</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>No control over resale terms</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Real fans priced out of shows</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Scalpers profit from your art</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resale Rules */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">You Set the Rules</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Every aspect of your ticket resale is customizable. Here&apos;s what you control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Price Caps</h3>
              <p className="text-neutral-400 text-sm">
                Set maximum resale prices (e.g., 150% of face value). Stop scalping in its tracks.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Transfer Windows</h3>
              <p className="text-neutral-400 text-sm">
                Define when transfers can happen. Block last-minute scalping before show day.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Charity Splits</h3>
              <p className="text-neutral-400 text-sm">
                Direct a percentage of resale premiums to causes you care about.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fan-Only Access</h3>
              <p className="text-neutral-400 text-sm">
                Give verified fans exclusive early access to resale tickets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Rules */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Style</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              From strict anti-scalping to flexible fan trading. Pick what works for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Strict */}
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Strict</h3>
              </div>
              <p className="text-neutral-400 mb-6 text-sm">Maximum protection against scalping. Face value only.</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400">Price Cap</span>
                  <span className="text-white font-medium">100% (face value)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400">Transfer Deadline</span>
                  <span className="text-white font-medium">48 hours before</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400">ID Match Required</span>
                  <span className="text-white font-medium">Yes</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-400">Charity Split</span>
                  <span className="text-white font-medium">N/A</span>
                </div>
              </div>
            </div>

            {/* Standard */}
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-amber-200/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-200 text-neutral-900 px-3 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-200/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Standard</h3>
              </div>
              <p className="text-neutral-400 mb-6 text-sm">Balanced approach. Fair resale with charity impact.</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400">Price Cap</span>
                  <span className="text-amber-200 font-medium">150% of face value</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400">Transfer Deadline</span>
                  <span className="text-amber-200 font-medium">24 hours before</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400">ID Match Required</span>
                  <span className="text-amber-200 font-medium">Yes</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-400">Charity Split</span>
                  <span className="text-amber-200 font-medium">10% of premium</span>
                </div>
              </div>
            </div>

            {/* Relaxed */}
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Relaxed</h3>
              </div>
              <p className="text-neutral-400 mb-6 text-sm">More flexibility. Market-driven with some limits.</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400">Price Cap</span>
                  <span className="text-white font-medium">200% of face value</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400">Transfer Deadline</span>
                  <span className="text-white font-medium">4 hours before</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-700">
                  <span className="text-neutral-400">ID Match Required</span>
                  <span className="text-white font-medium">No</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-400">Charity Split</span>
                  <span className="text-white font-medium">5% of premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Artists Choose T-PASSPORT</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Join hundreds of artists taking control of their ticket economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Real-Time Analytics</h3>
                <p className="text-neutral-400">
                  See exactly where your tickets are, who owns them, and how they&apos;re being transferred. Full visibility into your ticket economy.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Know Your Fans</h3>
                <p className="text-neutral-400">
                  Build direct relationships with verified ticket holders. Reach the people actually attending your shows.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Charity Integration</h3>
                <p className="text-neutral-400">
                  Automatically route resale premiums to your foundation or causes you support. Over $2M donated so far.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Zero Fraud Guarantee</h3>
                <p className="text-neutral-400">
                  Every ticket on T-PASSPORT is verified. Your fans are protected by our Entry Guarantee, which means better experiences at your shows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take <span className="text-amber-200">Control</span>?
          </h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Join the growing community of artists who are putting their fans first.
          </p>
          <a
            href="mailto:artists@ticketpassport.com"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-200 to-amber-300 text-neutral-900 px-10 py-5 rounded-xl font-bold text-xl hover:from-amber-300 hover:to-amber-400 transition-all"
          >
            Contact Our Artist Team
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 py-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                  <span className="text-amber-200 font-bold text-xl">P</span>
                </div>
                <span className="font-medium text-white text-lg">T-PASSPORT</span>
              </div>
              <p className="text-neutral-500 text-sm">
                The global standard for concert entry and safe resale.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/#how-it-works" className="hover:text-amber-200 transition-colors">How it Works</Link></li>
                <li><Link href="/#pricing" className="hover:text-amber-200 transition-colors">Pricing</Link></li>
                <li><Link href="/#guarantee" className="hover:text-amber-200 transition-colors">Entry Guarantee</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/about" className="hover:text-amber-200 transition-colors">About</Link></li>
                <li><Link href="/for-artists" className="hover:text-amber-200 transition-colors">For Artists</Link></li>
                <li><Link href="/for-venues" className="hover:text-amber-200 transition-colors">For Venues</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-amber-200 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-amber-200 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-amber-200 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
            <p>&copy; 2026 Ticket T-PASSPORT. The Global Standard for Concert Entry + Safe Resale.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
