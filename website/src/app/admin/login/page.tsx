'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, KeyRound } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Google Sign-In with Firebase Auth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      if (res?.user) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('sid_admin_session', res.user.email || 'authenticated');
        }
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err?.message || 'Google authentication failed. You can use your master passcode.');
      setLoading(false);
    }
  };

  // 2. Master Passcode fallback
  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (passcode === 'sid2026' || passcode === 'admin') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sid_admin_session', 'authenticated');
      }
      router.push('/admin');
    } else {
      setError('Invalid admin credentials. Access restricted.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="apple-card max-w-md w-full p-8 sm:p-10 bg-warm-surface shadow-apple-lg border border-warm-border">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-warm-subtle border border-warm-border flex items-center justify-center text-warm-text mx-auto mb-4">
            <Lock size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-warm-text">
            Admin Management
          </h1>
          <p className="text-xs text-warm-secondary mt-1">
            Sign in to manage personal content, live activity, and inbox.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Google Sign-in */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-warm-surface hover:bg-warm-hover border border-warm-border text-warm-text text-xs font-medium transition flex items-center justify-center gap-2 shadow-apple-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-warm-border" />
            <span className="text-[11px] font-mono text-warm-muted uppercase">or passcode</span>
            <div className="flex-1 h-px bg-warm-border" />
          </div>

          {/* Passcode Form */}
          <form onSubmit={handlePasscodeLogin} className="space-y-4">
            <div>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Master passcode"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-warm-subtle/80 border border-warm-border text-xs text-warm-text placeholder-warm-muted focus:outline-none focus:border-warm-text transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-warm-text hover:bg-black text-white text-xs font-medium transition flex items-center justify-center gap-2 shadow-apple-sm"
            >
              <span>{loading ? 'Authenticating...' : 'Enter Dashboard'}</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
