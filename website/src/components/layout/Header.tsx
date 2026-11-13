'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Shield, Radio, ExternalLink } from 'lucide-react';
import { cosmicSounds } from '@/lib/soundEffects';
import { universeStore, DEFAULT_SETTINGS } from '@/lib/db';
import { SiteSettings, PublicActivity } from '@/lib/types';

export default function Header() {
  const [nepalTime, setNepalTime] = useState<string>('');
  const [soundActive, setSoundActive] = useState<boolean>(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [activity, setActivity] = useState<PublicActivity>(universeStore.get('publicActivity', { isOnline: true } as any));

  // Nepal Clock: UTC+5:45
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      // Calculate Nepal time
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const nepalOffsetMs = (5 * 60 + 45) * 60000;
      const nepalDate = new Date(utc + nepalOffsetMs);

      const timeString = nepalDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setNepalTime(timeString);
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to settings and activity updates
  useEffect(() => {
    setSettings(universeStore.get('siteSettings', DEFAULT_SETTINGS));
    setActivity(universeStore.get('publicActivity', { isOnline: true } as any));

    function handleStoreUpdate(e: any) {
      if (e.detail?.key === 'siteSettings') {
        setSettings(e.detail.value);
      }
      if (e.detail?.key === 'publicActivity') {
        setActivity(e.detail.value);
      }
    }

    window.addEventListener('sid_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('sid_store_updated', handleStoreUpdate);
  }, []);

  const toggleSound = () => {
    const isNowOn = cosmicSounds.toggle();
    setSoundActive(isNowOn);
  };

  const socials = settings?.socialLinks || DEFAULT_SETTINGS.socialLinks;

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3 glass-panel border-b border-space-border/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-[0_0_15px_#f59e0b] group-hover:scale-110 transition-transform">
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          </div>
          <div>
            <div className="text-base font-bold tracking-wider text-white flex items-center gap-2">
              SID UNIVERSE
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-space-800 border border-space-border text-cyan-400">
                v1.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
              Digital Cosmos of Sid
            </div>
          </div>
        </Link>

        {/* Nepal Clock & Online Status */}
        <div className="hidden md:flex items-center gap-4 bg-space-950/70 px-3.5 py-1.5 rounded-full border border-space-border text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-amber-400">🇳🇵 NPT</span>
            <span className="text-white font-semibold">{nepalTime || '--:--:--'}</span>
            <span className="text-[10px] text-slate-500">(UTC+5:45)</span>
          </div>
          <div className="w-px h-3.5 bg-space-border" />
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${activity.isOnline ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse' : 'bg-slate-500'}`} />
            <span className={activity.isOnline ? 'text-emerald-400' : 'text-slate-400'}>
              {activity.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Action Controls & Socials */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Social Icons */}
          <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-space-border">
            {socials.discord && (
              <a href={socials.discord} target="_blank" rel="noopener noreferrer" title="Discord" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition">
                <span className="text-xs font-mono font-medium">Discord</span>
              </a>
            )}
            {socials.steam && (
              <a href={socials.steam} target="_blank" rel="noopener noreferrer" title="Steam" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition">
                <span className="text-xs font-mono font-medium">Steam</span>
              </a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noopener noreferrer" title="YouTube" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition">
                <span className="text-xs font-mono font-medium">YouTube</span>
              </a>
            )}
            {socials.snapchat && (
              <a href={socials.snapchat} target="_blank" rel="noopener noreferrer" title="Snapchat" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition">
                <span className="text-xs font-mono font-medium">Snapchat</span>
              </a>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundActive ? "Mute Cosmic Audio" : "Enable Cosmic Audio"}
            className="p-2 rounded-lg bg-space-900 border border-space-border text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition"
          >
            {soundActive ? <Volume2 size={16} className="text-cyan-400" /> : <VolumeX size={16} />}
          </button>

          {/* Admin Control Center Link */}
          <Link
            href="/admin"
            title="Admin Control Center"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 border border-space-border hover:border-cyan-500/50 text-xs font-medium text-slate-200 transition"
          >
            <Shield size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
