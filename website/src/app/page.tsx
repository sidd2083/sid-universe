'use client';

import React, { useEffect, useState } from 'react';
import UniverseCanvas from '@/components/universe/UniverseCanvas';
import MobilePlanetCarousel from '@/components/universe/MobilePlanetCarousel';
import LiveActivityBar from '@/components/activity/LiveActivityBar';
import HomepagePreviews from '@/components/home/HomepagePreviews';
import { universeStore, DEFAULT_SETTINGS } from '@/lib/db';
import { SiteSettings } from '@/lib/types';
import { Sparkles, Orbit, Compass, ArrowDown } from 'lucide-react';

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(universeStore.get('siteSettings', DEFAULT_SETTINGS));

    function handleStoreUpdate(e: any) {
      if (e.detail?.key === 'siteSettings') {
        setSettings(e.detail.value);
      }
    }

    window.addEventListener('sid_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('sid_store_updated', handleStoreUpdate);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Central Identity Section */}
      <section className="relative pt-6 sm:pt-10 pb-4 text-center max-w-4xl mx-auto px-4 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-space-900/90 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Orbit size={13} className="animate-spin text-amber-400" style={{ animationDuration: '6s' }} />
          <span>Interactive Planetary Cosmos</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-4">
          SID <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent">UNIVERSE</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed mb-6">
          {settings.tagline || DEFAULT_SETTINGS.tagline}
        </p>

        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          The central Sun represents Sid. Seven unique custom celestial bodies revolve continuously around him, each unlocking a sector of his work, knowledge, music, and digital life.
        </p>
      </section>

      {/* 3D Universe Canvas (Central Sun & 7 Planets) */}
      <section className="relative w-full">
        <UniverseCanvas />
      </section>

      {/* Mobile Planet Carousel (first-class mobile navigation) */}
      <MobilePlanetCarousel />

      {/* Live Windows Telemetry & Nepali Clock Activity Bar */}
      <LiveActivityBar />

      {/* Homepage Previews: Works, Studies, Cosmic Q&A */}
      <HomepagePreviews />
    </div>
  );
}
