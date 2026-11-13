'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, CheckCircle2, Clock, Calendar, Code2 } from 'lucide-react';
import { universeStore, DEFAULT_PROJECTS } from '@/lib/db';
import { Project } from '@/lib/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const list = universeStore.get<Project[]>('projects', DEFAULT_PROJECTS);
    const found = list.find((p) => p.id === projectId) || DEFAULT_PROJECTS[0];
    setProject(found);
  }, [projectId]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-warm-secondary">
        Loading project details...
      </div>
    );
  }

  const statusBadge =
    project.status === 'Currently Building'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : project.status === 'Built'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-warm-subtle text-warm-secondary border-warm-border';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Back button */}
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-secondary hover:text-warm-text transition group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to all projects</span>
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border uppercase tracking-wider ${statusBadge}`}>
            {project.status}
          </span>
          <span className="text-xs font-mono text-warm-muted">
            {project.category}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-warm-text">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-warm-secondary leading-relaxed max-w-2xl">
          {project.description}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-warm-text hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 transition shadow-apple-sm"
            >
              <span>Visit Website</span>
              <ExternalLink size={13} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-warm-surface border border-warm-border text-warm-text hover:bg-warm-hover text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Github size={13} />
              <span>Source Repository</span>
            </a>
          )}
        </div>
      </div>

      {/* Case Study Detailed Breakdown */}
      <div className="apple-card p-6 sm:p-8 space-y-8">
        {/* Why Built & Problem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-warm-muted mb-2 font-semibold">
              01. The Problem
            </h3>
            <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed">
              {project.problemAddressed ||
                'Students frequently experience fragmentation across study tools, disconnected communication, and lack of clear academic progress accountability.'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-warm-muted mb-2 font-semibold">
              02. The Solution & Vision
            </h3>
            <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed">
              {project.whyBuilt ||
                'Built to provide a dedicated, distraction-free environment tailored specifically for students in Nepal.'}
            </p>
          </div>
        </div>

        {/* Long Description */}
        {project.longDescription && (
          <div className="pt-6 border-t border-warm-border/60">
            <h3 className="text-sm font-mono uppercase tracking-wider text-warm-muted mb-2 font-semibold">
              03. Architecture & Overview
            </h3>
            <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed">
              {project.longDescription}
            </p>
          </div>
        )}

        {/* Learnings */}
        {project.learnings && (
          <div className="pt-6 border-t border-warm-border/60">
            <h3 className="text-sm font-mono uppercase tracking-wider text-warm-muted mb-2 font-semibold">
              04. Key Takeaways & Learnings
            </h3>
            <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed">
              {project.learnings}
            </p>
          </div>
        )}

        {/* Technologies Used */}
        <div className="pt-6 border-t border-warm-border/60">
          <h3 className="text-sm font-mono uppercase tracking-wider text-warm-muted mb-3 font-semibold">
            Technologies & Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg bg-warm-subtle text-xs font-mono text-warm-text border border-warm-border"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
