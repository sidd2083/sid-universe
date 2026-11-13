'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_PROJECTS } from '@/lib/db';
import { Project } from '@/lib/types';
import { ExternalLink, Github, Filter, Search, ArrowRight, Eye } from 'lucide-react';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setProjects(universeStore.get('projects', DEFAULT_PROJECTS));
  }, []);

  const statuses = ['All', 'Completed', 'Currently Building', 'Planned Idea'];

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        planetName="FORGE"
        sector="Sector 02: Works & Creations"
        planetColor="#06b6d4"
        title="Creations & Engineering"
        description="The industrial creation foundry housing production web systems, AI experiments, mobile projects, and technical architectures."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-space-border/60">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                filterStatus === status
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-space-900 text-slate-400 hover:text-white border border-space-border'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-space-900 border border-space-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="glass-panel rounded-2xl overflow-hidden border border-space-border hover:border-cyan-500/50 transition-all duration-300 group flex flex-col justify-between shadow-xl"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-space-950/85 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                  {project.category}
                </span>
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    project.status === 'Completed'
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                      : project.status === 'Currently Building'
                      ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300'
                      : 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-space-900 border border-space-border/80 text-[10px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-space-border/50 text-xs font-mono">
              <Link
                href={`/portfolio/${project.id}`}
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition font-semibold"
              >
                <Eye size={13} />
                <span>Deep Dive</span>
              </Link>

              <div className="flex items-center gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-space-900 hover:bg-space-800 text-slate-300 hover:text-white transition"
                    title="GitHub Repository"
                  >
                    <Github size={14} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-cyan-950/50 border border-cyan-800/40 text-cyan-300 hover:bg-cyan-900/50 transition"
                    title="Live Project"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
