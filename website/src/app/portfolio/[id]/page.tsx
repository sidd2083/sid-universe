'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_PROJECTS } from '@/lib/db';
import { Project } from '@/lib/types';
import { ArrowLeft, ExternalLink, Github, Calendar, Layers, CheckCircle2, Terminal } from 'lucide-react';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const allProjects = universeStore.get<Project[]>('projects', DEFAULT_PROJECTS);
    const found = allProjects.find((p) => p.id === resolvedParams.id);
    setProject(found || null);
  }, [resolvedParams.id]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Project Not Found in Sector 02</h2>
        <Link href="/portfolio" className="text-xs font-mono text-cyan-400 hover:underline">
          Return to Project Showcase
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        planetName="FORGE"
        sector="Sector 02: Detailed Architectural Spec"
        planetColor="#06b6d4"
        title={project.title}
        description={project.description}
      />

      {/* Main Cover Banner */}
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-8 border border-cyan-500/30 shadow-2xl">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-space-950/90 backdrop-blur-md border border-cyan-400/50 text-xs font-mono text-cyan-300 font-bold">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-md bg-space-950/90 backdrop-blur-md border border-space-border text-xs font-mono text-slate-300">
              Status: {project.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-space-900/90 backdrop-blur-md border border-space-border hover:border-white text-xs font-mono font-medium text-white transition"
              >
                <Github size={14} />
                <span>Source Code</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-bold text-white transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <ExternalLink size={14} />
                <span>Launch Live</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Left Column: Full Architectural Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-space-border">
            <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold mb-4 flex items-center gap-2">
              <Terminal size={16} />
              <span>System Overview & Architecture</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {project.longDescription || project.description}
            </p>

            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Core Technical Deliverables
            </h4>
            <div className="space-y-2.5">
              {project.technologies.map((tech) => (
                <div key={tech} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                  <span>Engineered with {tech} for optimal concurrency and spatial rendering.</span>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshots Gallery */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-space-border">
              <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold mb-4 flex items-center gap-2">
                <Layers size={16} />
                <span>Interface Visuals</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.screenshots.map((shot, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-space-border h-48">
                    <img src={shot} alt="Screenshot" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Spec Metadata */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-space-border space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Project Parameters
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Development Period</span>
                <div className="flex items-center gap-1.5 text-slate-200 font-mono">
                  <Calendar size={13} className="text-cyan-400" />
                  <span>{project.startDate || '2025'} — {project.completionDate || 'Ongoing'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Technology Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-space-900 border border-space-border text-[10px] font-mono text-cyan-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/portfolio"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-space-900 border border-space-border hover:border-cyan-400/50 text-xs font-mono text-slate-300 transition"
          >
            <ArrowLeft size={14} />
            <span>Return to Portfolio Grid</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
