import Link from 'next/link';

export default function ForVenuesPage() {
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
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              For Venues
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Smoother Entry.<br />
              <span className="text-amber-200">Happier Fans.</span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed mb-8">
              Eliminate gate fraud, reduce entry friction, and create better experiences. T-PASSPORT integrates with your existing systems to verify every ticket before fans reach the door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:venues@ticketpassport.com"
                className="inline-flex items-center justify-center bg-gradient-to-r from-amber-200 to-amber-300 text-neutral-900 px-8 py-4 rounded-lg font-semibold text-lg hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                Become a Partner Venue
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
                Gate Chaos is <span className="text-red-400">Costly</span>
              </h2>
              <div className="space-y-4 text-neutral-400 leading-relaxed">
                <p>
                  Every sold-out show brings the same headaches: fans with fake tickets, disputes at the gate, angry crowds, and security incidents. Your staff spends hours dealing with problems that shouldn&apos;t exist.
                </p>
                <p>
                  Meanwhile, legitimate ticket holders wait in longer lines while fraudulent tickets get sorted out. It&apos;s a bad experience for everyone—and it doesn&apos;t have to be this way.
                </p>
              </div>
            </div>
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50">
              <h3 className="text-lg font-semibold text-white mb-6">Common Gate Problems</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-neutral-400">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Duplicate barcodes from screenshot scams</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Counterfeit tickets that look legitimate</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Disputes slowing down entry lines</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Security incidents from frustrated fans</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Negative reviews from bad experiences</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How T-PASSPORT Works for Venues</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Simple integration. Immediate results. Better experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-neutral-900 font-bold">1</span>
              </div>
              <div className="w-16 h-16 bg-neutral-700 rounded-xl flex items-center justify-center mb-6 mt-2">
                <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Integrate</h3>
              <p className="text-neutral-400 leading-relaxed">
                Connect T-PASSPORT to your existing ticketing and access control systems. Our API works with all major platforms.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-neutral-900 font-bold">2</span>
              </div>
              <div className="w-16 h-16 bg-neutral-700 rounded-xl flex items-center justify-center mb-6 mt-2">
                <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Verify</h3>
              <p className="text-neutral-400 leading-relaxed">
                T-PASSPORT validates tickets in real-time. Cleared tickets show green at scan. Fraudulent tickets are flagged instantly.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-neutral-900 font-bold">3</span>
              </div>
              <div className="w-16 h-16 bg-neutral-700 rounded-xl flex items-center justify-center mb-6 mt-2">
                <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Enjoy</h3>
              <p className="text-neutral-400 leading-relaxed">
                Faster entry, fewer disputes, happier fans. Your staff focuses on hospitality, not fraud detection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Partner Benefits</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Join 500+ venues already using T-PASSPORT to improve their operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">40% Faster Entry</h3>
              <p className="text-neutral-400 text-sm">
                Pre-verified tickets mean fewer stops at the gate. Move fans through faster without compromising security.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero Fraud</h3>
              <p className="text-neutral-400 text-sm">
                T-PASSPORT-cleared tickets are guaranteed valid. If a cleared ticket fails, we handle the refund—not you.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Reduced Staff Burden</h3>
              <p className="text-neutral-400 text-sm">
                Less time resolving disputes means your team can focus on creating great fan experiences.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Analytics</h3>
              <p className="text-neutral-400 text-sm">
                Track entry flow, identify bottlenecks, and optimize operations with live dashboards.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multilingual Support</h3>
              <p className="text-neutral-400 text-sm">
                Our support team speaks 10+ languages, helping international fans navigate entry smoothly.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Better Reviews</h3>
              <p className="text-neutral-400 text-sm">
                Happier fans leave better reviews. Partner venues see an average 0.4 star increase in ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-neutral-950 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">500+</p>
              <p className="text-neutral-400 font-medium">Partner Venues</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">40%</p>
              <p className="text-neutral-400 font-medium">Faster Entry</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">0</p>
              <p className="text-neutral-400 font-medium">Fraud Incidents</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">24/7</p>
              <p className="text-neutral-400 font-medium">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Works With Your <span className="text-amber-200">Existing Systems</span>
              </h2>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                T-PASSPORT integrates seamlessly with all major ticketing platforms and access control systems. No need to replace your infrastructure—we work with what you have.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-neutral-300">RESTful API with comprehensive documentation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-neutral-300">Webhooks for real-time event notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-neutral-300">SDKs for iOS, Android, and web</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-neutral-300">Dedicated integration support team</span>
                </div>
              </div>
            </div>
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50">
              <h3 className="text-lg font-semibold text-white mb-6">Compatible Platforms</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
                  <span className="text-neutral-300 font-medium">Ticketmaster</span>
                </div>
                <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
                  <span className="text-neutral-300 font-medium">AXS</span>
                </div>
                <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
                  <span className="text-neutral-300 font-medium">Eventbrite</span>
                </div>
                <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
                  <span className="text-neutral-300 font-medium">SeatGeek</span>
                </div>
                <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
                  <span className="text-neutral-300 font-medium">Dice</span>
                </div>
                <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
                  <span className="text-neutral-300 font-medium">See Tickets</span>
                </div>
              </div>
              <p className="text-neutral-500 text-sm mt-4 text-center">
                + many more. Contact us for custom integrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready for <span className="text-amber-200">Smoother Shows</span>?
          </h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Join the network of venues providing better experiences for artists and fans alike.
          </p>
          <a
            href="mailto:venues@ticketpassport.com"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-200 to-amber-300 text-neutral-900 px-10 py-5 rounded-xl font-bold text-xl hover:from-amber-300 hover:to-amber-400 transition-all"
          >
            Contact Our Venue Team
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
