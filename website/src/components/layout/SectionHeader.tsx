'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Orbit, Compass } from 'lucide-react';
import { cosmicSounds } from '@/lib/soundEffects';

interface SectionHeaderProps {
  sector: string;
  planetName: string;
  planetColor: string;
  title: string;
  description: string;
}

export default function SectionHeader({
  sector,
  planetName,
  planetColor,
  title,
  description
}: SectionHeaderProps) {
  return (
    <div className="relative w-full pb-8 pt-4 border-b border-space-border/60 mb-10">
      {/* Background celestial glow matching the planet's color */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 rounded-full blur-[90px] opacity-25 pointer-events-none"
        style={{ backgroundColor: planetColor }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Return to Universe Button */}
        <Link
          href="/"
          onClick={() => cosmicSounds.playWarp()}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-space-900 border border-space-border hover:border-cyan-400 hover:text-cyan-300 text-xs font-mono text-slate-300 transition group w-fit"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return to Universe</span>
          <Orbit size={13} className="text-amber-400 group-hover:rotate-45 transition-transform" />
        </Link>

        {/* Planet Sector Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: planetColor }}
          />
          <span
            className="text-xs font-mono uppercase px-2.5 py-1 rounded-md border font-semibold tracking-wider"
            style={{
              borderColor: `${planetColor}60`,
              backgroundColor: `${planetColor}15`,
              color: planetColor
            }}
          >
            Planet {planetName} — {sector}
          </span>
        </div>
      </div>

      {/* Main Title & Description */}
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
