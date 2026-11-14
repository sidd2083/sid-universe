'use client';

import React from 'react';
import { ExternalLink, Sparkles, FolderGit2 } from 'lucide-react';
import { CurrentProjectHighlight } from '@/lib/types';

interface Props {
  project: CurrentProjectHighlight;
}

export default function FeaturedProjectCard({ project }: Props) {
  return (
    <section className="apple-card p-6 sm:p-8 space-y-6">
      {/* Header Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-warm-border/60">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200/80 text-[11px] font-mono font-semibold uppercase tracking-wider">
            Recent Big Project
          </span>
          <span className="text-xs font-mono text-warm-muted">Personal Milestone</span>
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-subtle hover:bg-warm-hover border border-warm-border text-xs font-semibold text-warm-text transition group self-start sm:self-auto"
          >
            <span>Visit studenthubnp.com</span>
            <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        )}
      </div>

      {/* Main Title & Description */}
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold text-warm-text tracking-tight mb-2">
          {project.name}
        </h3>
        <p className="text-sm sm:text-base text-warm-secondary leading-relaxed max-w-3xl">
          {project.description}
        </p>
      </div>

      {/* Personal Honest Note */}
      <div className="p-4 sm:p-5 rounded-2xl bg-warm-subtle/80 border border-warm-border">
        <span className="text-[11px] font-mono uppercase tracking-wider text-warm-muted block mb-1 font-semibold">
          From Siddhant
        </span>
        <p className="text-xs sm:text-sm text-warm-text italic leading-relaxed font-serif">
          "{project.personalStory || "This was the project that took the longest time to make, and it feels like a child to me. I honestly don't care whether people use it or not — I use it daily, and I love my creation."}"
        </p>
      </div>

      {/* Tech Stack */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {project.technologies.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-lg bg-warm-subtle border border-warm-border/60 text-[11px] font-mono text-warm-secondary"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
