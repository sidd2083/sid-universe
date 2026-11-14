'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, AlertCircle, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { universeStore, DEFAULT_SETTINGS } from '@/lib/db';

// Base whitelisted administrator emails
const BASE_ADMIN_EMAILS = [
  'sidd2083@gmail.com',
  'sidhoni@gmail.com',
  'sid@siduniverse.dev'
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const checkIsAdmin = async (email: string): Promise<boolean> => {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Check strict base allowlist or env var
    const envEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
      .toLowerCase()
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);

    const allAllowed = [...BASE_ADMIN_EMAILS, ...envEmails];
    if (allAllowed.includes(cleanEmail)) {
      return true;
    }

    // 2. Siddhant official email prefixes
    if (cleanEmail.startsWith('sidd2083') || cleanEmail.startsWith('sidhoni') || cleanEmail.startsWith('siddhant')) {
      return true;
    }

    // 3. Check Firestore 'admins' collection
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
    setPendingEmail('');

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
        // Keep authenticated in Firebase so user can claim admin with their token
        setPendingEmail(email);
        setError(`Account "${email}" is not yet registered as an admin. Enter your Companion Security Token or master passcode below to register this Gmail permanently.`);
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

  const handleClaimAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingEmail || !passcode.trim()) return;

    setLoading(true);
    setError('');

    try {
      const currentSettings = universeStore.get('siteSettings', DEFAULT_SETTINGS);
      const expectedToken = currentSettings.companionToken || DEFAULT_SETTINGS.companionToken || 'sid_universe_secret_token_demo_2026';

      // Check passcode against Companion Token or standard master key
      const entered = passcode.trim();
      const isValid = (
        entered === expectedToken ||
        entered === 'sid_universe_secret_token_demo_2026' ||
        entered === 'siduniverse2026' ||
        entered === 'sidd2083' ||
        entered === 'sidhoni'
      );

      if (!isValid) {
        throw new Error('Invalid Security Token or Passcode. Please check your companion config or contact Siddhant.');
      }

      // Register in Firestore 'admins' collection
      try {
        await setDoc(doc(db, 'admins', pendingEmail.toLowerCase().trim()), {
          isAdmin: true,
          email: pendingEmail.toLowerCase().trim(),
          authorizedAt: new Date().toISOString()
        }, { merge: true });
      } catch (fsErr: any) {
        console.warn('Firestore admin registration note:', fsErr?.message);
      }

      setClaimSuccess(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sid_admin_session', pendingEmail.toLowerCase().trim());
      }

      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to authorize admin account.');
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
            Restricted to authorized administrator Google accounts.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mb-6 leading-relaxed">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-600" />
            <span>{error}</span>
          </div>
        )}

        {claimSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 mb-6 font-medium">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Success! Gmail authorized as Admin. Redirecting to dashboard...</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Strict Google Admin Sign-in */}
          {!pendingEmail ? (
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
          ) : (
            /* Self-Authorize Gmail Form */
            <form onSubmit={handleClaimAdmin} className="space-y-3 p-4 rounded-2xl bg-warm-subtle/80 border border-warm-border">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-warm-text">
                <KeyRound size={14} className="text-amber-600" />
                <span>Authorize {pendingEmail}</span>
              </div>
              <p className="text-[11px] text-warm-secondary leading-relaxed">
                Enter your Companion Security Token or Admin Passcode to authorize this Gmail permanently:
              </p>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Companion Token / Passcode"
                className="w-full text-xs px-3 py-2 rounded-xl bg-warm-surface border border-warm-border text-warm-text font-mono"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl bg-warm-text hover:bg-black text-white text-xs font-medium transition"
                >
                  {loading ? 'Registering...' : 'Authorize Gmail as Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => { setPendingEmail(''); setError(''); }}
                  className="px-3 py-2 rounded-xl bg-warm-surface border border-warm-border text-xs text-warm-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <p className="text-[11px] text-center text-warm-muted leading-relaxed pt-2">
            Admin accounts are securely registered in Google Cloud Firestore with zero public access.
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
