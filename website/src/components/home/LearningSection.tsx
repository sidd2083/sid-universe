'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Sparkles, CheckCircle2 } from 'lucide-react';
import { LearningTopic } from '@/lib/types';
import { DEFAULT_LEARNING } from '@/lib/db';

interface Props {
  topics: LearningTopic[];
}

export default function LearningSection({ topics }: Props) {
  // Resilient fallback guarantees topics are ALWAYS populated
  const activeTopics = (topics && topics.length > 0 && topics.some(t => t.categoryType === 'currently-learning'))
    ? topics
    : DEFAULT_LEARNING;

  const currentlyLearning = activeTopics.filter((t) => t.categoryType === 'currently-learning');
  const wantToLearn = activeTopics.filter((t) => t.categoryType === 'want-to-learn');

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

      {/* Honest Disclaimer at the top as requested */}
      <div className="apple-card p-6 sm:p-7 bg-warm-surface border border-warm-border/80 shadow-apple-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
            <Brain size={16} className="text-amber-700" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-warm-text">
            On My Learning Speed, Forgetfulness & Practical Realities
          </span>
        </div>
        <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed font-sans pl-0 sm:pl-9">
          "Seeing these skills and terms doesn't mean I know everything. Yes, I understand the concepts and I have consumed all these topics. But I have one trait — some might call it a god-gifted power, though it's debatable: I learn any new thing pretty fast, but my forgetting speed is just as fast! At the end of the day, I'm always on the run learning new things every day, but I'm weak at applying the concepts in real life. I'm learning and figuring that out too! !_!"
        </p>
      </div>

      {/* 2-Column Responsive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Currently Learning */}
        <div className="apple-card p-6 sm:p-7 bg-warm-surface border border-warm-border/80 shadow-apple-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-warm-text">
                Currently Learning
              </h3>
            </div>
            <span className="text-[11px] font-mono text-warm-muted">Active Focus (7 items)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {currentlyLearning.map((topic) => (
              <div
                key={topic.id}
                className="p-3.5 rounded-xl bg-warm-subtle/70 border border-warm-border/80 hover:border-warm-muted/50 hover:bg-warm-subtle transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs sm:text-sm font-bold text-warm-text">
                      {topic.title}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
                      Active
                    </span>
                  </div>
                  <span className="text-[10px] text-warm-secondary block">
                    {topic.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Wanted to Learn */}
        <div className="apple-card p-6 sm:p-7 bg-warm-surface border border-warm-border/80 shadow-apple-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-warm-text">
                Wanted to Learn
              </h3>
            </div>
            <span className="text-[11px] font-mono text-warm-muted">Target Queue (8 items)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {wantToLearn.map((topic) => (
              <div
                key={topic.id}
                className="p-3.5 rounded-xl bg-warm-subtle/50 border border-warm-border/60 hover:border-warm-muted/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs sm:text-sm font-bold text-warm-text">
                      {topic.title}
                    </span>
                    <span className="text-[10px] font-mono text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                      Queue
                    </span>
                  </div>
                  <span className="text-[10px] text-warm-secondary block">
                    {topic.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
