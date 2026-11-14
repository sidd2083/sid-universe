'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_LEARNING, DEFAULT_SETTINGS } from '@/lib/db';
import { LearningTopic, SiteSettings } from '@/lib/types';
import { ExternalLink, BookOpen, Brain, Sparkles, Code2 } from 'lucide-react';

export default function LearningPage() {
  const [topics, setTopics] = useState<LearningTopic[]>(DEFAULT_LEARNING);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setTopics(universeStore.get('learningTopics', DEFAULT_LEARNING));
    setSettings(universeStore.get('siteSettings', DEFAULT_SETTINGS));
  }, []);

  const activeTopics = (topics && topics.length > 0 && topics.some(t => t.categoryType === 'currently-learning'))
    ? topics
    : DEFAULT_LEARNING;

  const currentlyLearning = activeTopics.filter((t) => t.categoryType === 'currently-learning');
  const wantToLearn = activeTopics.filter((t) => t.categoryType === 'want-to-learn');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <SectionHeader
        category="Continuous Education"
        title="Learning & Exploring"
        description="Exploring artificial intelligence, mathematics, programming concepts, and visual design."
      />

      {/* Honest Disclaimer at the top as requested */}
      <div className="apple-card p-6 sm:p-8 bg-warm-subtle/70 border border-warm-border space-y-3 shadow-apple-sm">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-amber-600 shrink-0" />
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-warm-text">
            On My Learning Speed, Forgetfulness & Practical Realities
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed font-sans">
          "{settings.learningDisclaimer || "Seeing these skills and terms doesn't mean I know everything. Yes, I understand the concepts and I have consumed all these topics. But I have one trait — some might call it a god-gifted power, though it's debatable: I learn any new thing pretty fast, but my forgetting speed is just as fast! At the end of the day, I'm always on the run learning new things every day, but I'm weak at applying the concepts in real life. I'm learning and figuring that out too! !_!"}"
        </p>
      </div>

      {/* 1. Currently Learning Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-warm-text">
              Currently Learning
            </h2>
          </div>
          <span className="text-xs font-mono text-warm-muted">In Active Progress</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentlyLearning.map((topic) => (
            <div key={topic.id} className="apple-card p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-warm-muted mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-warm-subtle text-[10px] text-warm-secondary">
                    {topic.category}
                  </span>
                  {topic.progress !== undefined && (
                    <span className="font-bold text-warm-text">{topic.progress}%</span>
                  )}
                </div>
                <h3 className="text-base font-bold text-warm-text tracking-tight mb-1">
                  {topic.title}
                </h3>
                <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed">
                  {topic.description}
                </p>
              </div>

              {topic.progress !== undefined && (
                <div className="w-full h-1.5 rounded-full bg-warm-subtle overflow-hidden pt-1">
                  <div
                    className="h-full bg-warm-text rounded-full"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Wanted to Learn Section */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-warm-amber" />
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-warm-text">
              Wanted to Learn
            </h2>
          </div>
          <span className="text-xs font-mono text-warm-muted">Future Queue</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wantToLearn.map((topic) => (
            <div key={topic.id} className="apple-card p-4 flex flex-col justify-between space-y-2 bg-warm-surface/90">
              <div>
                <span className="px-2 py-0.5 rounded bg-warm-subtle text-[10px] font-mono text-warm-muted block mb-1.5 w-fit">
                  {topic.category}
                </span>
                <h3 className="text-sm font-bold text-warm-text">
                  {topic.title}
                </h3>
                <p className="text-xs text-warm-secondary leading-relaxed mt-1">
                  {topic.description}
                </p>
              </div>
              <span className="text-[10px] font-mono text-warm-muted pt-2 border-t border-warm-border/60">
                Target: {topic.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
