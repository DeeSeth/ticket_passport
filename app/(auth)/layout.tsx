import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image - grayscale concert */}
        <div
          className="absolute inset-0 bg-cover bg-center grayscale"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-neutral-900/80" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center border border-neutral-700">
              <span className="text-amber-200 font-bold text-2xl">P</span>
            </div>
            <span className="font-medium text-xl tracking-wide">T-PASSPORT</span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl font-serif leading-tight">
              <span className="text-amber-200">Your golden ticket</span><br />
              <span className="text-white">to unforgettable moments</span>
            </h1>
            <p className="text-lg text-neutral-300 max-w-md">
              Join thousands of fans who buy and sell concert tickets with confidence. Entry guaranteed.
            </p>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-neutral-300">Verified Sellers</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-neutral-300">Entry Guaranteed</span>
              </div>
            </div>
          </div>

          <p className="text-neutral-500 text-sm">
            &copy; 2026 Ticket T-PASSPORT. The Global Standard for Concert Entry.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-neutral-950">
        {/* Mobile header */}
        <header className="lg:hidden p-6 bg-neutral-900 border-b border-neutral-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
              <span className="text-amber-200 font-bold text-xl">P</span>
            </div>
            <span className="text-white font-medium text-lg">T-PASSPORT</span>
          </Link>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>

        {/* Mobile footer */}
        <footer className="lg:hidden p-6 text-center text-neutral-500 text-sm border-t border-neutral-800">
          <p>&copy; 2026 Ticket T-PASSPORT</p>
        </footer>
      </div>
    </div>
  );
}
