'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/lib/db';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const rawFooter = DEFAULT_SETTINGS.footerQuote;
  const quoteText: string = typeof rawFooter === 'object' && rawFooter !== null
    ? rawFooter.quote
    : (typeof rawFooter === 'string' ? rawFooter : "In the midst of winter, I found there was, within me, an invincible summer.");
  const authorText: string = typeof rawFooter === 'object' && rawFooter !== null
    ? rawFooter.author
    : "Albert Camus";

  return (
    <footer className="w-full border-t border-warm-border/70 bg-warm-bg mt-24 py-16 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Philosophical Quote */}
        <div className="max-w-2xl">
          <blockquote className="font-serif italic text-lg sm:text-xl text-warm-text leading-relaxed">
            "{quoteText}"
          </blockquote>
          <cite className="block text-xs font-mono text-warm-muted uppercase tracking-wider not-italic mt-2">
            — {authorText}
          </cite>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-warm-border/60" />

        {/* Bottom Metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-warm-secondary">
          <div className="flex items-center gap-2">
            <span className="font-bold text-warm-text tracking-tight">SID</span>
            <span className="text-warm-muted">•</span>
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-warm-muted" />
              <span>Hetauda, Nepal</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-warm-muted">
            <span>© {currentYear} Sid. All personal rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
