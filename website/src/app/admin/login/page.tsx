'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, KeyRound, ArrowRight, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Default admin secret or custom session passcode
    // For SID UNIVERSE: "sid2026" or "admin" or Firebase token
    if (passcode === 'sid2026' || passcode === 'admin') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sid_admin_session', 'authenticated');
      }
      router.push('/admin');
    } else {
      setError('Invalid admin credentials. Access denied to Sector 0.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-panel-glow rounded-2xl p-8 border border-cyan-500/30 shadow-2xl relative">
        <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto mb-5 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Shield size={28} />
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-2">
          Admin Control Center
        </h1>
        <p className="text-xs text-center text-slate-400 mb-6">
          Access restricted to the creator of SID UNIVERSE.
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              Master Access Passcode
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (default: sid2026)"
                required
                className="w-full bg-space-950/90 border border-space-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-1 block">
              Default passcode: <code className="text-cyan-400 font-bold">sid2026</code>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Master Console'}</span>
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
