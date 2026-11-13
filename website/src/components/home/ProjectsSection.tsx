'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, FolderKanban, CheckCircle2, Clock, Compass } from 'lucide-react';
import { Project } from '@/lib/types';

interface Props {
  projects: Project[];
}

export default function ProjectsSection({ projects }: Props) {
  const [activeTab, setActiveTab] = useState<'All' | 'Currently Building' | 'Built' | 'Want to Build'>('All');

  const filtered = activeTab === 'All'
    ? projects
    : projects.filter((p) => p.status === activeTab);

  return (
    <section className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-warm-border/60">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-warm-muted block mb-1">
            Creations & Experiments
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-warm-text">
            Projects
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-warm-subtle/80 p-1 rounded-xl border border-warm-border">
          {(['All', 'Currently Building', 'Built', 'Want to Build'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeTab === tab
                  ? 'bg-warm-surface text-warm-text shadow-apple-sm'
                  : 'text-warm-secondary hover:text-warm-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((proj) => {
          const statusBadge =
            proj.status === 'Currently Building'
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : proj.status === 'Built'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : 'bg-warm-subtle text-warm-secondary border-warm-border';

          return (
            <div
              key={proj.id}
              className="apple-card apple-card-hover p-6 flex flex-col justify-between group"
            >
              <div>
                {/* Top Meta */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border uppercase tracking-wider ${statusBadge}`}>
                    {proj.status}
                  </span>
                  <span className="text-xs font-mono text-warm-muted">
                    {proj.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-warm-text tracking-tight mb-2 group-hover:text-warm-amber transition-colors">
                  <Link href={`/portfolio/${proj.id}`} className="hover:underline">
                    {proj.title}
                  </Link>
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed mb-4">
                  {proj.description}
                </p>
              </div>

              {/* Footer Tech Stack & Details Link */}
              <div className="pt-4 border-t border-warm-border/60 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-warm-subtle text-[11px] font-mono text-warm-muted"
                    >
                      {t}
                    </span>
                  ))}
                  {proj.technologies.length > 3 && (
                    <span className="text-[11px] font-mono text-warm-muted self-center">
                      +{proj.technologies.length - 3}
                    </span>
                  )}
                </div>

                <Link
                  href={`/portfolio/${proj.id}`}
                  className="text-xs font-semibold text-warm-text hover:text-warm-amber flex items-center gap-1 group/btn shrink-0"
                >
                  <span>Case Study</span>
                  <ArrowUpRight size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
