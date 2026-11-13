'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_WATCHLIST } from '@/lib/db';
import { WatchlistItem } from '@/lib/types';
import { Film, ExternalLink, CheckCircle2, Clock, PlayCircle, Filter } from 'lucide-react';

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>(DEFAULT_WATCHLIST);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    setItems(universeStore.get('watchlist', DEFAULT_WATCHLIST));
  }, []);

  const statuses = ['All', 'To Watch', 'Watching', 'Completed'];
  const categories = ['All', 'YouTube', 'Tutorial', 'Course', 'Documentary'];

  const filteredItems = items.filter((item) => {
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchStatus && matchCat;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        planetName="OBSERVATORY"
        sector="Sector 07: Curated Feeds & Media"
        planetColor="#f59e0b"
        title="Cosmic Watchlist & Tutorials"
        description="The outer observatory tracking videos, deep-dive programming tutorials, courses, and documentaries queued or completed."
      />

      {/* Filter Bars */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-space-border/60">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                statusFilter === s
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-space-900 text-slate-400 hover:text-white border border-space-border'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 rounded text-[11px] font-mono transition ${
                categoryFilter === c
                  ? 'bg-space-800 text-white border border-slate-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl group"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-space-950/80 backdrop-blur-md border border-amber-500/30 text-[10px] font-mono text-amber-300">
                  {item.category}
                </span>

                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    item.status === 'Completed'
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                      : item.status === 'Watching'
                      ? 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                      : 'bg-space-900/80 border border-space-border text-slate-300'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>

            {/* External Link */}
            <div className="p-5 pt-0">
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-space-900 border border-space-border hover:border-amber-400/50 text-xs font-mono text-amber-300 hover:text-amber-200 transition"
              >
                <span>Open Resource</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
