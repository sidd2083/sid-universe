'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface SectionHeaderProps {
  category?: string;
  title: string;
  description: string;
  // Optional legacy props kept for compatibility
  sector?: string;
  planetName?: string;
  planetColor?: string;
}

export default function SectionHeader({
  category,
  title,
  description
}: SectionHeaderProps) {
  return (
    <div className="w-full pb-8 pt-4 border-b border-warm-border/60 mb-10 space-y-4">
      {/* Back navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-secondary hover:text-warm-text transition group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to personal space</span>
      </Link>

      {/* Main Title & Description */}
      <div>
        {category && (
          <span className="text-xs font-mono uppercase tracking-wider text-warm-muted block mb-1">
            {category}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-warm-text mb-3">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-warm-secondary max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
