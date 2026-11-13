'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_PLANETS } from '@/lib/planetsData';
import { PlanetConfig } from '@/lib/types';
import { ChevronLeft, ChevronRight, Orbit, ArrowRight } from 'lucide-react';
import { cosmicSounds } from '@/lib/soundEffects';

export default function MobilePlanetCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevPlanet = () => {
    cosmicSounds.playPlanetHover(260);
    setCurrentIndex((prev) => (prev === 0 ? INITIAL_PLANETS.length - 1 : prev - 1));
  };

  const nextPlanet = () => {
    cosmicSounds.playPlanetHover(320);
    setCurrentIndex((prev) => (prev === INITIAL_PLANETS.length - 1 ? 0 : prev + 1));
  };

  const current = INITIAL_PLANETS[currentIndex];

  return (
    <div className="w-full px-4 py-6 md:hidden">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400">
          <Orbit size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Planetary Navigation ({currentIndex + 1} of {INITIAL_PLANETS.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevPlanet}
            className="p-1.5 rounded-lg bg-space-900 border border-space-border text-slate-300 hover:text-white"
            aria-label="Previous planet"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextPlanet}
            className="p-1.5 rounded-lg bg-space-900 border border-space-border text-slate-300 hover:text-white"
            aria-label="Next planet"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Active Planet Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 glass-panel-glow border transition-all duration-300 shadow-xl"
        style={{ borderColor: `${current.color}60` }}
      >
        {/* Ambient background glow */}
        <div
          className="absolute -right-12 -top-12 w-40 h-40 rounded-full blur-[60px] opacity-30 pointer-events-none"
          style={{ backgroundColor: current.color }}
        />

        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            {/* Visual orb */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border shadow-lg"
              style={{
                backgroundColor: `${current.color}25`,
                borderColor: current.color,
                boxShadow: `0 0 15px ${current.color}40`
              }}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: current.color }}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Planet {current.name}
              </h3>
              <div className="text-[11px] font-mono" style={{ color: current.color }}>
                {current.sector}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          {current.description}
        </p>

        {/* Enter Sector Button */}
        <Link
          href={current.path}
          onClick={() => cosmicSounds.playWarp()}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-semibold text-white transition-all shadow-md group"
          style={{
            backgroundColor: `${current.color}25`,
            border: `1px solid ${current.color}80`
          }}
        >
          <span>Enter {current.name} Sector</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {INITIAL_PLANETS.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-cyan-400' : 'w-1.5 bg-space-800'}`}
            aria-label={`Go to ${p.name}`}
          />
        ))}
      </div>
    </div>
  );
}
