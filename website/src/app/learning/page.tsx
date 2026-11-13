'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_LEARNING } from '@/lib/db';
import { LearningTopic } from '@/lib/types';
import { BookOpen, ExternalLink, Sparkles, Filter, Brain, CheckCircle, Clock } from 'lucide-react';

export default function LearningPage() {
  const [topics, setTopics] = useState<LearningTopic[]>(DEFAULT_LEARNING);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    setTopics(universeStore.get('learningTopics', DEFAULT_LEARNING));
  }, []);

  const categories = [
    'All',
    'Programming',
    'AI & ML',
    'Cybersecurity',
    'Web Development',
    '3D & Blender',
    'Video Editing'
  ];

  const filteredTopics = topics.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        planetName="SYNAPSE"
        sector="Sector 03: Knowledge & Growth"
        planetColor="#a855f7"
        title="Knowledge Nexus & Active Studies"
        description="The neural knowledge sphere tracking what I am currently studying in programming, machine learning, systems architecture, and 3D graphics."
      />

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-space-border/60">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
              selectedCategory === cat
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/60 font-bold shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'bg-space-900 text-slate-400 hover:text-white border border-space-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="glass-panel rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-purple-950/70 border border-purple-800/40 text-purple-300 uppercase tracking-wider font-semibold">
                  {topic.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-mono">
                  {topic.status === 'Mastered' ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle size={13} />
                      <span>Mastered</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-purple-400">
                      <Clock size={13} />
                      <span>{topic.status}</span>
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                {topic.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {topic.description}
              </p>

              {/* Progress Indicator */}
              {topic.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-purple-400 font-bold">{topic.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-space-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Personal Notes */}
              {topic.notes && (
                <div className="p-3 rounded-xl bg-space-950/60 border border-space-border/80 text-xs text-slate-300 mb-4 leading-relaxed">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 block mb-1">
                    Engineering Notes:
                  </span>
                  {topic.notes}
                </div>
              )}
            </div>

            {/* Curated Resources */}
            {topic.resources && topic.resources.length > 0 && (
              <div className="pt-3 border-t border-space-border/60">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                  Learning Resources:
                </span>
                <div className="flex flex-wrap gap-2">
                  {topic.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-space-900 border border-space-border hover:border-purple-400/50 text-[11px] font-mono text-purple-300 hover:text-purple-200 transition"
                    >
                      <span>{res.title}</span>
                      <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
