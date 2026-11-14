'use client';

import React from 'react';
import { ExternalLink, Sparkles, FolderGit2, ArrowUpRight } from 'lucide-react';
import { CurrentProjectHighlight } from '@/lib/types';

interface Props {
  project: CurrentProjectHighlight;
}

export default function FeaturedProjectCard({ project }: Props) {
  return (
    <section className="apple-card p-6 sm:p-9 space-y-6 bg-warm-surface border border-warm-border/80 shadow-apple-sm">
      {/* Header Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-warm-border/60">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-warm-subtle text-warm-text border border-warm-border text-[10px] font-mono font-bold uppercase tracking-widest">
            Recent Big Project
          </span>
          <span className="text-[11px] font-mono text-warm-muted">Personal Milestone</span>
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-warm-text hover:bg-black text-white text-xs font-medium transition shadow-apple-sm group self-start sm:self-auto"
          >
            <span>Visit studenthubnp.com</span>
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        )}
      </div>

      {/* Main Title & Description */}
      <div className="space-y-2">
        <h3 className="text-2xl sm:text-3xl font-bold text-warm-text tracking-tight">
          {project.name}
        </h3>
        <p className="text-sm sm:text-base text-warm-secondary leading-relaxed max-w-3xl">
          {project.description}
        </p>
      </div>

      {/* Personal Honest Note — Editorial Callout */}
      <div className="border-l-2 border-warm-text/40 pl-4 sm:pl-5 py-2 space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-warm-muted block font-semibold">
          Personal Reflection from Siddhant
        </span>
        <blockquote className="text-xs sm:text-sm text-warm-text italic leading-relaxed font-serif">
          "{project.personalStory || "This was the project that took the longest time to make, and it feels like a child to me. I honestly don't care whether people use it or not — I use it daily, and I love my creation."}"
        </blockquote>
      </div>

      {/* Tech Stack Pills */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {project.technologies.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-lg bg-warm-subtle/80 border border-warm-border/60 text-[11px] font-mono text-warm-secondary"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
