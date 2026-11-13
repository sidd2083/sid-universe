'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Code2, BookOpen, Music, Film, MessageCircle, ExternalLink } from 'lucide-react';
import { universeStore } from '@/lib/db';
import { Project, LearningTopic, Song, WatchlistItem, PublishedQA } from '@/lib/types';

export default function HomepagePreviews() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [learning, setLearning] = useState<LearningTopic[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [qaList, setQaList] = useState<PublishedQA[]>([]);

  useEffect(() => {
    setProjects(universeStore.get<Project[]>('projects', []).filter(p => p.featured).slice(0, 3));
    setLearning(universeStore.get<LearningTopic[]>('learningTopics', []).filter(l => l.featured).slice(0, 2));
    setSongs(universeStore.get<Song[]>('songs', []).filter(s => s.featured).slice(0, 3));
    setWatchlist(universeStore.get<WatchlistItem[]>('watchlist', []).slice(0, 3));
    setQaList(universeStore.get<PublishedQA[]>('publishedQA', []).slice(0, 2));
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 space-y-16">
      {/* 1. Featured Works (Planet FORGE Preview) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Featured Creations
              <span className="text-xs font-mono text-cyan-400 font-normal">[Planet Forge]</span>
            </h2>
          </div>
          <Link href="/portfolio" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group">
            <span>Explore All Projects</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="glass-panel rounded-xl overflow-hidden border border-space-border hover:border-cyan-500/40 transition group flex flex-col">
              <div className="h-44 overflow-hidden relative">
                <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-space-950/80 backdrop-blur-sm border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                  {proj.category}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-space-950/80 backdrop-blur-sm border border-space-border text-[10px] font-mono text-slate-300">
                  {proj.status}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {proj.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-space-border/60">
                  {proj.technologies.slice(0, 3).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-space-900 text-[10px] font-mono text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Active Learning Topics (Planet SYNAPSE Preview) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Current Studies
              <span className="text-xs font-mono text-purple-400 font-normal">[Planet Synapse]</span>
            </h2>
          </div>
          <Link href="/learning" className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 group">
            <span>View Learning Path</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learning.map((topic) => (
            <div key={topic.id} className="glass-panel rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-purple-300">
                    {topic.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">
                    {topic.title}
                  </h3>
                </div>
                {topic.progress !== undefined && (
                  <span className="text-sm font-mono font-bold text-purple-400">
                    {topic.progress}%
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                {topic.description}
              </p>
              {topic.progress !== undefined && (
                <div className="w-full h-1.5 rounded-full bg-space-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Published Anonymous Q&A (Planet WHISPER Preview) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Published Cosmic Q&A
              <span className="text-xs font-mono text-sky-400 font-normal">[Planet Whisper]</span>
            </h2>
          </div>
          <Link href="/anonymous-messages" className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 group">
            <span>Send Anonymous Message</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qaList.map((qa) => (
            <div key={qa.id} className="glass-panel rounded-xl p-5 border border-sky-500/20 hover:border-sky-500/40 transition">
              <div className="text-xs font-semibold text-sky-300 mb-2 flex items-start gap-2">
                <span className="text-slate-500 shrink-0 font-mono">Q:</span>
                <span className="text-slate-100 italic">"{qa.question}"</span>
              </div>
              <div className="text-xs text-slate-300 pl-4 border-l-2 border-sky-500/40 leading-relaxed">
                {qa.reply}
              </div>
              {qa.category && (
                <div className="mt-3 text-[10px] font-mono text-slate-500">
                  Topic: {qa.category}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
