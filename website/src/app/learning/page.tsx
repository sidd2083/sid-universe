'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_LEARNING } from '@/lib/db';
import { LearningTopic } from '@/lib/types';
import { ExternalLink, BookOpen, Sparkles } from 'lucide-react';

export default function LearningPage() {
  const [topics, setTopics] = useState<LearningTopic[]>(DEFAULT_LEARNING);

  useEffect(() => {
    setTopics(universeStore.get('learningTopics', DEFAULT_LEARNING));
  }, []);

  const currentlyLearning = topics.filter((t) => t.categoryType === 'currently-learning');
  const wantToLearn = topics.filter((t) => t.categoryType === 'want-to-learn');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <SectionHeader
        category="Continuous Education"
        title="Learning & Exploring"
        description="An endless list of things to learn. A few unfinished courses. And somehow, always something new to explore."
      />

      {/* 1. Currently Learning */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-warm-border/60">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h2 className="text-base font-mono uppercase tracking-wider font-semibold text-warm-text">
            Currently Learning & Working With
          </h2>
        </div>

        <div className="space-y-4">
          {currentlyLearning.map((topic) => (
            <div key={topic.id} className="apple-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-warm-subtle text-[10px] font-mono font-medium text-warm-secondary">
                      {topic.category}
                    </span>
                    <span className="text-xs font-mono text-warm-muted">
                      Status: {topic.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-warm-text">
                    {topic.title}
                  </h3>
                </div>

                {topic.progress !== undefined && (
                  <div className="text-right shrink-0">
                    <span className="text-sm font-mono font-bold text-warm-text">
                      {topic.progress}%
                    </span>
                    <div className="w-24 h-1.5 rounded-full bg-warm-subtle overflow-hidden mt-1">
                      <div
                        className="h-full bg-warm-text rounded-full"
                        style={{ width: `${topic.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed">
                {topic.description}
              </p>

              {topic.notes && (
                <div className="p-3.5 rounded-xl bg-warm-subtle text-xs text-warm-secondary leading-relaxed border border-warm-border">
                  <span className="font-semibold text-warm-text block mb-0.5">Personal Notes:</span>
                  {topic.notes}
                </div>
              )}

              {topic.resources && topic.resources.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  {topic.resources.map((res) => (
                    <a
                      key={res.url}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-warm-surface border border-warm-border hover:bg-warm-hover text-warm-text transition"
                    >
                      <span>{res.title}</span>
                      <ExternalLink size={11} className="text-warm-muted" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Want to Learn */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 pb-2 border-b border-warm-border/60">
          <span className="w-2.5 h-2.5 rounded-full bg-warm-amber" />
          <h2 className="text-base font-mono uppercase tracking-wider font-semibold text-warm-text">
            Want to Learn
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wantToLearn.map((topic) => (
            <div key={topic.id} className="apple-card p-5 flex flex-col justify-between">
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
    </div>
  );
}
