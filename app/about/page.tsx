import Link from 'next/link';

export default function AboutPage() {
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
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-amber-200">T-PASSPORT</span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              We&apos;re on a mission to eliminate ticket fraud and make concert resale fair for everyone—fans, artists, and venues alike.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-200/10 border border-amber-200/20 text-amber-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                Our Story
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Born from a Bad Experience
              </h2>
              <div className="space-y-4 text-neutral-400 leading-relaxed">
                <p>
                  T-PASSPORT was founded in 2024 after our founders experienced the frustration of buying fake concert tickets firsthand. After being turned away at the gate for a sold-out show they&apos;d been anticipating for months, they knew there had to be a better way.
                </p>
                <p>
                  Traditional ticket marketplaces couldn&apos;t guarantee entry. Scalpers ran rampant. Artists had no control over their own tickets. The system was broken.
                </p>
                <p>
                  So we built T-PASSPORT—a platform where every ticket is verified, every seller is accountable, and every buyer is protected by our Entry Guarantee.
                </p>
              </div>
            </div>
            <div className="bg-neutral-800/50 rounded-3xl p-10 border border-neutral-700/50">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-200 font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">2024</h3>
                    <p className="text-neutral-400">Founded after experiencing ticket fraud firsthand</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-200 font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">2025</h3>
                    <p className="text-neutral-400">Launched Entry Guarantee program with 50 partner venues</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-200 font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">2026</h3>
                    <p className="text-neutral-400">Expanded globally with 500+ venues and 50,000+ verified members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Mission & Values</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              We believe live music should be accessible, safe, and fair.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-16 h-16 bg-neutral-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Trust First</h3>
              <p className="text-neutral-400 leading-relaxed">
                Every transaction on our platform is backed by verified identities and our Entry Guarantee. Trust isn&apos;t optional—it&apos;s foundational.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-16 h-16 bg-neutral-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fair for All</h3>
              <p className="text-neutral-400 leading-relaxed">
                Artists set the rules. Fans get fair prices. Scalpers get nothing. We&apos;ve built a system where everyone wins except bad actors.
              </p>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 hover:border-amber-200/30 transition-colors">
              <div className="w-16 h-16 bg-neutral-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Global Access</h3>
              <p className="text-neutral-400 leading-relaxed">
                Music is universal. Our platform supports fans worldwide with multilingual support and international venue partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-neutral-900 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">50K+</p>
              <p className="text-neutral-400 font-medium">Verified Members</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">500+</p>
              <p className="text-neutral-400 font-medium">Partner Venues</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">$2M+</p>
              <p className="text-neutral-400 font-medium">Donated to Charity</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-amber-200">0</p>
              <p className="text-neutral-400 font-medium">Fraud Incidents</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Leadership Team</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Music lovers building for music lovers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 bg-neutral-800 rounded-full mx-auto mb-4 flex items-center justify-center border border-neutral-700">
                <span className="text-4xl text-amber-200 font-bold">MR</span>
              </div>
              <h3 className="text-xl font-bold text-white">Maya Rodriguez</h3>
              <p className="text-amber-200 mb-2">CEO & Co-founder</p>
              <p className="text-neutral-400 text-sm">Former Head of Trust & Safety at a major ticketing platform</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-neutral-800 rounded-full mx-auto mb-4 flex items-center justify-center border border-neutral-700">
                <span className="text-4xl text-amber-200 font-bold">JK</span>
              </div>
              <h3 className="text-xl font-bold text-white">James Kim</h3>
              <p className="text-amber-200 mb-2">CTO & Co-founder</p>
              <p className="text-neutral-400 text-sm">Identity verification expert, previously at a fintech unicorn</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-neutral-800 rounded-full mx-auto mb-4 flex items-center justify-center border border-neutral-700">
                <span className="text-4xl text-amber-200 font-bold">SW</span>
              </div>
              <h3 className="text-xl font-bold text-white">Sarah Williams</h3>
              <p className="text-amber-200 mb-2">Head of Partnerships</p>
              <p className="text-neutral-400 text-sm">15+ years in live entertainment and venue management</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join the <span className="text-amber-200">Movement</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Whether you&apos;re a fan, artist, or venue—there&apos;s a place for you in the T-PASSPORT community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-gradient-to-r from-amber-200 to-amber-300 text-neutral-900 px-8 py-4 rounded-lg font-semibold text-lg hover:from-amber-300 hover:to-amber-400 transition-all"
            >
              Get Your Passport
            </Link>
            <Link
              href="/for-artists"
              className="inline-flex items-center justify-center border border-neutral-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all"
            >
              Partner With Us
            </Link>
          </div>
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
