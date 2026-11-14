'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Brain } from 'lucide-react';
import { LearningTopic } from '@/lib/types';
import { DEFAULT_LEARNING } from '@/lib/db';

interface Props {
  topics: LearningTopic[];
}

/* Homepage preview limits */
const PREVIEW_LIMIT = 4;

export default function LearningSection({ topics }: Props) {
  // Resilient fallback guarantees topics are ALWAYS populated
  const activeTopics = (topics && topics.length > 0 && topics.some(t => t.categoryType === 'currently-learning'))
    ? topics
    : DEFAULT_LEARNING;

  const currentlyLearning = activeTopics.filter((t) => t.categoryType === 'currently-learning');
  const wantToLearn = activeTopics.filter((t) => t.categoryType === 'want-to-learn');

  const previewLearning = currentlyLearning.slice(0, PREVIEW_LIMIT);
  const previewWanted = wantToLearn.slice(0, PREVIEW_LIMIT);

  return (
    <section className="space-y-6">
      {/* Header & Learn More Link */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-warm-border/60">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-warm-muted block mb-1">
            Knowledge & Studies
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-warm-text">
            Learning & Exploring
          </h2>
          <p className="text-xs sm:text-sm text-warm-secondary mt-1">
            Currently consuming mathematics, programming concepts, and visual design.
          </p>
        </div>

        <Link
          href="/learning"
          className="text-xs font-semibold text-warm-text hover:text-warm-amber flex items-center gap-1 group self-start sm:self-auto bg-warm-surface hover:bg-warm-hover px-3.5 py-1.5 rounded-full border border-warm-border shadow-apple-sm transition"
        >
          <span>Learn more & explore syllabus</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Honest Disclaimer */}
      <div className="apple-card p-5 sm:p-7 bg-warm-surface border border-warm-border/80 shadow-apple-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
            <Brain size={16} className="text-amber-700" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-warm-text">
            On My Learning Speed & Practical Realities
          </span>
        </div>
        <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed font-sans pl-0 sm:pl-9">
          &ldquo;I learn any new thing pretty fast, but my forgetting speed is just as fast! I&rsquo;m always on the run learning new things every day, but I&rsquo;m weak at applying the concepts in real life. I&rsquo;m learning and figuring that out too! !_!&rdquo;
        </p>
      </div>

      {/* 2-Column: Show 4 items each with "See more" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Currently Learning — 4 preview */}
        <div className="apple-card p-5 sm:p-7 bg-warm-surface border border-warm-border/80 shadow-apple-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-warm-text">
                Currently Learning
              </h3>
            </div>
            <span className="text-[11px] font-mono text-warm-muted">{currentlyLearning.length} topics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {previewLearning.map((topic) => (
              <div
                key={topic.id}
                className="p-3.5 rounded-xl bg-warm-subtle/70 border border-warm-border/80 hover:border-warm-muted/50 hover:bg-warm-subtle transition"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs sm:text-sm font-bold text-warm-text">
                    {topic.title}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50 shrink-0">
                    Active
                  </span>
                </div>
                <span className="text-[10px] text-warm-secondary block">
                  {topic.category}
                </span>
              </div>
            ))}
          </div>

          {currentlyLearning.length > PREVIEW_LIMIT && (
            <Link href="/learning" className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-warm-secondary hover:text-warm-text pt-1 group transition">
              <span>See all {currentlyLearning.length} topics</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* 2. Wanted to Learn — 4 preview */}
        <div className="apple-card p-5 sm:p-7 bg-warm-surface border border-warm-border/80 shadow-apple-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-warm-text">
                Wanted to Learn
              </h3>
            </div>
            <span className="text-[11px] font-mono text-warm-muted">{wantToLearn.length} topics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {previewWanted.map((topic) => (
              <div
                key={topic.id}
                className="p-3.5 rounded-xl bg-warm-subtle/50 border border-warm-border/60 hover:border-warm-muted/50 transition"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs sm:text-sm font-bold text-warm-text">
                    {topic.title}
                  </span>
                  <span className="text-[10px] font-mono text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50 shrink-0">
                    Queue
                  </span>
                </div>
                <span className="text-[10px] text-warm-secondary block">
                  {topic.category}
                </span>
              </div>
            ))}
          </div>

          {wantToLearn.length > PREVIEW_LIMIT && (
            <Link href="/learning" className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-warm-secondary hover:text-warm-text pt-1 group transition">
              <span>See all {wantToLearn.length} topics</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
