'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_PLANETS } from '@/lib/planetsData';
import { Download, Sparkles, Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-space-border/50 bg-space-950/80 backdrop-blur-md py-8 px-4 sm:px-6 mt-16 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Coordinates */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="text-sm font-semibold text-white tracking-wider flex items-center gap-2">
            SID UNIVERSE
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[10px] font-mono text-slate-400">COORDINATES [27.7172° N, 85.3240° E]</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Designed & engineered as an interactive digital universe. Powered by Three.js & Firebase.
          </p>
        </div>

        {/* Quick Planetary Teleport */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {INITIAL_PLANETS.map((planet) => (
            <Link
              key={planet.id}
              href={planet.path}
              className="px-2.5 py-1 rounded bg-space-900 border border-space-border hover:border-cyan-500/50 hover:text-cyan-300 font-mono text-[11px] transition"
            >
              {planet.name}
            </Link>
          ))}
        </div>

        {/* Companion Download CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/sid/sid-universe/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 hover:bg-cyan-900/40 transition text-[11px] font-medium"
          >
            <Download size={13} />
            <span>Sid Companion (.exe)</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
