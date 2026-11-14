'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, Brain, Terminal } from 'lucide-react';
import { LearningTopic } from '@/lib/types';

interface Props {
  topics: LearningTopic[];
}

export default function LearningSection({ topics }: Props) {
  const currentlyLearning = topics.filter((t) => t.categoryType === 'currently-learning');
  const wantToLearn = topics.filter((t) => t.categoryType === 'want-to-learn');

  return (
    <section className="space-y-6">
      {/* Header & Learn More Link */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-warm-border/60">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-warm-muted block mb-1">
            Knowledge & Studies
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-warm-text">
            Learning & Exploring
          </h2>
        </div>

        <Link
          href="/learning"
          className="text-xs font-semibold text-warm-text hover:text-warm-amber flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>Learn more & explore topics</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Honest Disclaimer at the top as requested */}
      <div className="apple-card p-5 sm:p-6 bg-warm-subtle/70 border border-warm-border space-y-2">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-amber-600 shrink-0" />
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-warm-text">
            A Note on My Skills & Learning Speed
          </span>
        </div>
        <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed font-sans">
          "Seeing these skills and terms doesn't mean I know everything. Yes, I understand the concepts and I have consumed all these topics. But I have one trait — some might call it a god-gifted power, though it's debatable: I learn any new thing pretty fast, but my forgetting speed is just as fast! At the end of the day, I'm always on the run learning new things every day, but I'm weak at applying the concepts in real life. I'm learning and figuring that out too! !_!"
        </p>
      </div>

      {/* Clean 2-Column Organized Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Currently Learning */}
        <div className="apple-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-warm-text">
                Currently Learning
              </h3>
            </div>
            <span className="text-xs font-mono text-warm-muted">Active Focus</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {currentlyLearning.map((topic) => (
              <div
                key={topic.id}
                className="px-3 py-2 rounded-xl bg-warm-subtle border border-warm-border flex flex-col justify-between hover:border-warm-muted/60 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-warm-text">{topic.title}</span>
                  {topic.progress !== undefined && (
                    <span className="text-[10px] font-mono text-warm-muted">{topic.progress}%</span>
                  )}
                </div>
                <span className="text-[10px] text-warm-secondary line-clamp-1 mt-0.5">
                  {topic.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Wanted to Learn */}
        <div className="apple-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-warm-amber" />
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-warm-text">
                Wanted to Learn
              </h3>
            </div>
            <span className="text-xs font-mono text-warm-muted">Future Queue</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {wantToLearn.map((topic) => (
              <div
                key={topic.id}
                className="px-3 py-2 rounded-xl bg-warm-subtle/80 border border-warm-border hover:border-warm-muted/60 transition"
              >
                <span className="text-xs font-bold text-warm-text block">{topic.title}</span>
                <span className="text-[10px] text-warm-secondary mt-0.5 block">{topic.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
