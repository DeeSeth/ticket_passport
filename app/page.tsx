import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                <span className="text-amber-200 font-bold text-xl">P</span>
              </div>
              <span className="font-medium text-white text-lg tracking-wide">T-PASSPORT</span>
            </div>
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
      <section className="relative min-h-screen flex items-center">
        {/* Background concert image - grayscale */}
        <div
          className="absolute inset-0 bg-cover bg-center grayscale"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          }}
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/70 to-neutral-900/50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          {/* Glass card */}
          <div className="max-w-xl bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-10 border border-neutral-700/50">
            <h1 className="text-5xl md:text-6xl font-serif mb-2">
              <span className="text-amber-200">Your golden ticket.</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
              Verified. Every time.
            </h2>
            <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
              Don&apos;t let a fake ticket kill your vibe. The world&apos;s only fraud-proof marketplace ensures you get in, or you get paid.
            </p>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-neutral-800/50 border border-neutral-700 text-neutral-300 px-4 py-2 rounded-full text-sm mb-8">
              <span className="w-2 h-2 bg-neutral-400 rounded-full"></span>
              Trusted by 50,000+ concert fans worldwide
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-gradient-to-r from-amber-200 to-amber-300 text-neutral-900 px-8 py-4 rounded-lg font-semibold text-lg hover:from-amber-300 hover:to-amber-400 transition-all"
              >
                Get Access Now
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center border border-neutral-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-16 bg-neutral-950 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">100%</p>
              <p className="text-neutral-400 font-medium">Entry Guaranteed</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">0</p>
              <p className="text-neutral-400 font-medium">Fraud Incidents</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">50K+</p>
              <p className="text-neutral-400 font-medium">Verified Members</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">500+</p>
              <p className="text-neutral-400 font-medium">Partner Venues</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How T-PASSPORT Works</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Three layers of protection that make resale safe for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Identity */}
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-16 h-16 bg-neutral-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Verified Identity</h3>
              <p className="text-neutral-400 leading-relaxed">
                Every Passport member is verified. You always know who you&apos;re buying from and selling to.
              </p>
            </div>

            {/* Rules */}
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-16 h-16 bg-neutral-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Artist-Set Rules</h3>
              <p className="text-neutral-400 leading-relaxed">
                Artists control price caps, transfer windows, and charity splits. Resale happens on their terms.
              </p>
            </div>

            {/* Gate */}
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-16 h-16 bg-neutral-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gate Validation</h3>
              <p className="text-neutral-400 leading-relaxed">
                Tickets are validated at entry. If you have a cleared ticket, you get in—guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Entry Guarantee */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-200/10 border border-amber-200/20 text-amber-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Entry Guarantee
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Denied Entry?<br />
                <span className="text-amber-200">Get Your Money Back.</span>
              </h2>
              <p className="text-xl text-neutral-400 mb-8">
                Every ticket cleared by T-PASSPORT comes with our Entry Guarantee. If you&apos;re turned away at the door, you receive an automatic full refund. No disputes. No waiting.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg">Automatic refund processing</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg">24/7 support in 10+ languages</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg">Seller accountability enforcement</span>
                </li>
              </ul>
            </div>

            {/* Verification card */}
            <div className="bg-neutral-800/50 backdrop-blur-xl rounded-3xl p-8 border border-neutral-700/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-amber-200 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">Cleared by T-PASSPORT</h3>
                  <p className="text-amber-200">Entry Guaranteed</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-neutral-700">
                  <span className="text-neutral-400">Ticket verified</span>
                  <span className="text-white font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Yes
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-neutral-700">
                  <span className="text-neutral-400">Owner verified</span>
                  <span className="text-white font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Yes
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-neutral-700">
                  <span className="text-neutral-400">Within price cap</span>
                  <span className="text-white font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Yes
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-neutral-400">Transfer deadline</span>
                  <span className="text-white font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Met
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-xl text-neutral-400">One membership. Full protection.</p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-neutral-800/50 rounded-3xl p-10 border border-neutral-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="text-center mb-10">
                  <p className="text-neutral-400 mb-2 font-medium">Concert Passport</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-bold text-amber-200">$20</span>
                    <span className="text-neutral-400 text-xl">/year</span>
                  </div>
                </div>
                <ul className="space-y-5 mb-10">
                  <li className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-amber-200/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-neutral-300">Verified identity + passport wallet</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-amber-200/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-neutral-300">Entry Guarantee on all cleared tickets</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-amber-200/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-neutral-300">Multilingual entry support</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-amber-200/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-neutral-300">Passport Score reputation</span>
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="block w-full bg-gradient-to-r from-amber-200 to-amber-300 text-neutral-900 text-center py-4 rounded-xl font-bold text-lg hover:from-amber-300 hover:to-amber-400 transition-all"
                >
                  Get Your Passport
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-neutral-950/90" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience<br />
            <span className="text-amber-200">Live Music Differently?</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Join thousands of fans who trust T-PASSPORT for safe concert ticket resale.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-200 to-amber-300 text-neutral-900 px-10 py-5 rounded-xl font-bold text-xl hover:from-amber-300 hover:to-amber-400 transition-all"
          >
            Create Your Passport
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
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
                <li><a href="#" className="hover:text-amber-200 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-amber-200 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-amber-200 transition-colors">Entry Guarantee</a></li>
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
