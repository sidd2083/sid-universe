'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface DailyThoughtBoxProps {
  thought?:
    | {
        title?: string;
        content: string;
        updatedAt?: string;
      }
    | string;
}

export function DailyThoughtBox({ thought }: DailyThoughtBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!thought) return null;

  const content = typeof thought === 'string' ? thought.trim() : (thought.content || '').trim();
  const title = typeof thought === 'object' && thought.title ? thought.title.trim() : '';
  const updatedAt = typeof thought === 'object' && thought.updatedAt ? thought.updatedAt : '';

  // If there's no text entered from the admin panel, do not show the box
  if (!content) return null;

  // Estimate word count
  const words = content.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isLong = content.length > 550 || wordCount > 80;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 text-left animate-fadeIn">
      <div className="apple-card p-6 sm:p-8 bg-warm-surface border border-warm-border/80 shadow-apple-sm rounded-3xl transition-all duration-300 hover:shadow-apple-md relative overflow-hidden">
        {/* Subtle accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 opacity-70" />

        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-warm-border/60 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-warm-subtle border border-warm-border flex items-center justify-center text-warm-text">
              <Sparkles size={12} className="text-amber-600" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-warm-muted font-bold">
              Daily Thoughts & Philosophy
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-warm-muted">
            <span className="hidden sm:inline-block">By Siddhant</span>
            {updatedAt && (
              <>
                <span className="hidden sm:inline-block">•</span>
                <span>{new Date(updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </>
            )}
          </div>
        </div>

        {/* Optional Title */}
        {title && (
          <h3 className="text-base sm:text-lg font-bold text-warm-text tracking-tight mb-3">
            {title}
          </h3>
        )}

        {/* Essay / Thought Body */}
        <div className="relative">
          <div
            className={`text-xs sm:text-sm text-warm-secondary leading-relaxed whitespace-pre-wrap font-sans transition-all duration-300 ${
              isLong && !isExpanded ? 'max-h-52 overflow-hidden' : ''
            }`}
          >
            {content}
          </div>

          {/* Fade gradient overlay when collapsed */}
          {isLong && !isExpanded && (
            <div className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-warm-surface via-warm-surface/80 to-transparent" />
          )}
        </div>

        {/* Expand / Collapse Button for Long Texts */}
        {isLong && (
          <div className="pt-3 flex items-center justify-between border-t border-warm-border/40 mt-3">
            <span className="text-[11px] font-mono text-warm-muted">
              {wordCount} words
            </span>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-text hover:text-black transition-colors px-3 py-1.5 rounded-xl bg-warm-subtle hover:bg-warm-hover border border-warm-border"
            >
              <span>{isExpanded ? 'Show Less' : 'Read Full Thought'}</span>
              {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
