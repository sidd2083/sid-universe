'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { LearningTopic } from '@/lib/types';

interface Props {
  topics: LearningTopic[];
}

export default function LearningSection({ topics }: Props) {
  const currentlyLearning = topics.filter((t) => t.categoryType === 'currently-learning');
  const wantToLearn = topics.filter((t) => t.categoryType === 'want-to-learn');

  return (
    <section className="space-y-8">
      {/* Header with the prompt's philosophical quote */}
      <div className="pb-4 border-b border-warm-border/60">
        <span className="text-xs font-mono uppercase tracking-wider text-warm-muted block mb-1">
          Knowledge & Studies
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-warm-text">
          Learning & Exploring
        </h2>
        <p className="text-sm sm:text-base text-warm-secondary italic mt-2 font-serif">
          "An endless list of things to learn. A few unfinished courses. And somehow, always something new to explore."
        </p>
      </div>

      {/* 1. Currently Learning Category */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <h3 className="text-sm font-mono uppercase tracking-wider font-semibold text-warm-text">
            Currently Learning
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentlyLearning.map((topic) => (
            <div
              key={topic.id}
              className="apple-card p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-warm-subtle text-[10px] font-mono font-medium text-warm-secondary">
                    {topic.category}
                  </span>
                  {topic.progress !== undefined && (
                    <span className="text-xs font-mono font-bold text-warm-text">
                      {topic.progress}%
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-warm-text mb-1.5">
                  {topic.title}
                </h4>
                <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed mb-3">
                  {topic.description}
                </p>
              </div>

              {topic.progress !== undefined && (
                <div className="w-full h-1.5 rounded-full bg-warm-subtle overflow-hidden mt-2">
                  <div
                    className="h-full bg-warm-text rounded-full transition-all duration-500"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Want to Learn Category */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warm-amber" />
          <h3 className="text-sm font-mono uppercase tracking-wider font-semibold text-warm-text">
            Want to Learn
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wantToLearn.map((topic) => (
            <div
              key={topic.id}
              className="apple-card p-5 flex flex-col justify-between bg-warm-surface/80"
            >
              <div>
                <span className="px-2 py-0.5 rounded-md bg-warm-subtle text-[10px] font-mono font-medium text-warm-muted block mb-2 w-fit">
                  {topic.category}
                </span>

                <h4 className="text-sm font-bold text-warm-text mb-1.5">
                  {topic.title}
                </h4>
                <p className="text-xs text-warm-secondary leading-relaxed mb-3">
                  {topic.description}
                </p>
              </div>

              <span className="text-[11px] font-mono text-warm-muted">
                Status: {topic.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
