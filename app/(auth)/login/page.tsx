'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/wallet');
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo quick login
  const handleDemoLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo');
    setIsLoading(true);
    const success = await login(userEmail, 'demo');
    if (success) {
      router.push('/wallet');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-neutral-400 mt-2">Sign in to access your Concert Passport</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          dark
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          dark
        />

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading} variant="gold">
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-neutral-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-amber-200 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Demo accounts section */}
      <div className="mt-8 pt-6 border-t border-neutral-800">
        <p className="text-sm text-neutral-500 text-center mb-4">Quick Demo Login</p>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => handleDemoLogin('jane@example.com')}
            className="p-3 text-left bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-700/50"
            disabled={isLoading}
          >
            <p className="font-medium text-white">Jane Wang</p>
            <p className="text-xs text-neutral-500">Verified • Score: 92 • Has tickets</p>
          </button>
          <button
            onClick={() => handleDemoLogin('dee@example.com')}
            className="p-3 text-left bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-700/50"
            disabled={isLoading}
          >
            <p className="font-medium text-white">Dee</p>
            <p className="text-xs text-neutral-500">Verified • Score: 88 • Has tickets</p>
          </button>
          <button
            onClick={() => handleDemoLogin('alex@example.com')}
            className="p-3 text-left bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-700/50"
            disabled={isLoading}
          >
            <p className="font-medium text-white">Alex Chen</p>
            <p className="text-xs text-neutral-500">Not Verified • Score: 45</p>
          </button>
        </div>
      </div>
    </div>
  );
}
