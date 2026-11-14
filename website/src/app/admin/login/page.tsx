'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Default authorized administrator emails
const BASE_ADMIN_EMAILS = [
  'sidd2083@gmail.com',
  'sidhoni@gmail.com',
  'sid@siduniverse.dev'
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checkIsAdmin = async (email: string): Promise<boolean> => {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Check strict authorized allowlist or env var
    const envEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
      .toLowerCase()
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);

    const allAllowed = [...BASE_ADMIN_EMAILS, ...envEmails];
    if (allAllowed.includes(cleanEmail)) {
      return true;
    }

    // 2. Check Firestore 'admins' collection for this exact email
    try {
      const adminDoc = await getDoc(doc(db, 'admins', cleanEmail));
      if (adminDoc.exists() && adminDoc.data()?.isAdmin !== false) {
        return true;
      }
    } catch (e) {
      console.warn('Firestore admin check notice:', e);
    }

    return false;
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const res = await signInWithPopup(auth, provider);

      if (!res?.user || !res.user.email) {
        throw new Error('No user account returned from Google authentication.');
      }

      const email = res.user.email;
      const isAdmin = await checkIsAdmin(email);

      if (!isAdmin) {
        // Immediate sign out and session purge for unauthorized accounts
        await signOut(auth);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('sid_admin_session');
        }
        setError(`Access Denied: ${email} is not authorized as an administrator for SID UNIVERSE. Only Siddhant's admin account can access this panel.`);
        setLoading(false);
        return;
      }

      // Authorized admin
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sid_admin_session', email);
      }
      router.push('/admin');
    } catch (err: any) {
      setError(err?.message || 'Google authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="apple-card max-w-md w-full p-8 sm:p-10 bg-warm-surface shadow-apple-lg border border-warm-border">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-warm-subtle border border-warm-border flex items-center justify-center text-warm-text mx-auto mb-4">
            <ShieldCheck size={22} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-warm-text">
            Admin Management
          </h1>
          <p className="text-xs text-warm-secondary mt-1">
            Restricted to authorized administrator Google accounts only.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 mb-6 leading-relaxed">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Strict Google Admin Sign-in */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-warm-surface hover:bg-warm-hover border border-warm-border text-warm-text text-xs font-semibold transition flex items-center justify-center gap-2.5 shadow-apple-sm group"
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
            <span>{loading ? 'Verifying Admin Credentials...' : 'Sign in with Admin Google Account'}</span>
          </button>

          <p className="text-[11px] text-center text-warm-muted leading-relaxed pt-2">
            Authentication is secured via Firebase Authentication with administrative whitelist verification. Public passwords and unverified accounts have been disabled.
          </p>

          <div className="pt-4 border-t border-warm-border/60 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-warm-secondary hover:text-warm-text transition"
            >
              <ArrowLeft size={13} />
              <span>Return to SID UNIVERSE</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
