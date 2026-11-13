'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_PROJECTS } from '@/lib/db';
import { Project } from '@/lib/types';
import { ArrowUpRight, Search, Filter } from 'lucide-react';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<string>('All');

  useEffect(() => {
    setProjects(universeStore.get('projects', DEFAULT_PROJECTS));
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      activeStatus === 'All' ? true : p.status === activeStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <SectionHeader
        category="Creations & Products"
        title="Projects"
        description="A collection of platforms, utilities, and ideas I have built, am currently building, or plan to create."
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-warm-border/60">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or technologies..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-warm-surface border border-warm-border text-xs text-warm-text placeholder-warm-muted focus:outline-none focus:border-warm-text transition shadow-apple-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-warm-subtle/80 p-1 rounded-xl border border-warm-border self-start sm:self-auto">
          {['All', 'Currently Building', 'Built', 'Want to Build'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeStatus === status
                  ? 'bg-warm-surface text-warm-text shadow-apple-sm'
                  : 'text-warm-secondary hover:text-warm-text'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
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
              className="apple-card apple-card-hover p-6 sm:p-7 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border uppercase tracking-wider ${statusBadge}`}>
                    {proj.status}
                  </span>
                  <span className="text-xs font-mono text-warm-muted">
                    {proj.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-warm-text tracking-tight mb-2 group-hover:text-warm-amber transition-colors">
                  <Link href={`/portfolio/${proj.id}`} className="hover:underline">
                    {proj.title}
                  </Link>
                </h3>

                <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed mb-4">
                  {proj.description}
                </p>
              </div>

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
    </div>
  );
}
