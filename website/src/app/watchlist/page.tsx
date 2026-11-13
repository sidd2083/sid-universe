'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_WATCHLIST } from '@/lib/db';
import { WatchlistItem } from '@/lib/types';
import { Film, ExternalLink, BookmarkCheck } from 'lucide-react';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(DEFAULT_WATCHLIST);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    setWatchlist(universeStore.get('watchlist', DEFAULT_WATCHLIST));
  }, []);

  const filtered = filter === 'All'
    ? watchlist
    : watchlist.filter((w) => w.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <SectionHeader
        category="Curated Queue"
        title="Watchlist & Resources"
        description="A personal queue of documentaries, computer science courses, tutorials, and educational content to explore."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-warm-subtle/80 p-1 rounded-xl border border-warm-border w-fit">
        {['All', 'Watching', 'To Watch', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              filter === tab
                ? 'bg-warm-surface text-warm-text shadow-apple-sm'
                : 'text-warm-secondary hover:text-warm-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="apple-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-warm-muted mb-2">
                <span>{item.category}</span>
                <span className="px-2 py-0.5 rounded-full bg-warm-subtle text-warm-text font-medium">
                  {item.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-warm-text mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pt-4 border-t border-warm-border/60 text-xs font-medium text-warm-text hover:text-warm-amber flex items-center justify-between transition"
              >
                <span>View Resource</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
