'use client';

import React, { useState } from 'react';
import { Gamepad2, Music, Film, ExternalLink, Play, Pause } from 'lucide-react';
import { Game, Song, WatchlistItem } from '@/lib/types';

interface Props {
  games: Game[];
  songs: Song[];
  watchlist: WatchlistItem[];
}

export default function InterestsSection({ games, songs, watchlist }: Props) {
  const [activeTab, setActiveTab] = useState<'gaming' | 'music' | 'watchlist'>('gaming');

  return (
    <section className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-warm-border/60">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-warm-muted block mb-1">
            Free Time & Interests
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-warm-text">
            Music, Gaming & Watchlist
          </h2>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 bg-warm-subtle/80 p-1 rounded-xl border border-warm-border">
          <button
            onClick={() => setActiveTab('gaming')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === 'gaming'
                ? 'bg-warm-surface text-warm-text shadow-apple-sm'
                : 'text-warm-secondary hover:text-warm-text'
            }`}
          >
            Gaming
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === 'music'
                ? 'bg-warm-surface text-warm-text shadow-apple-sm'
                : 'text-warm-secondary hover:text-warm-text'
            }`}
          >
            Music
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === 'watchlist'
                ? 'bg-warm-surface text-warm-text shadow-apple-sm'
                : 'text-warm-secondary hover:text-warm-text'
            }`}
          >
            Watchlist
          </button>
        </div>
      </div>

      {/* Content Panels */}
      {activeTab === 'gaming' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {games.map((game) => (
            <div key={game.id} className="apple-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-warm-muted mb-2">
                  <span>{game.platform}</span>
                  {game.hoursPlayed && <span>{game.hoursPlayed}h played</span>}
                </div>
                <h4 className="text-base font-bold text-warm-text mb-1">
                  {game.title}
                </h4>
                <p className="text-xs text-warm-secondary line-clamp-2 leading-relaxed mb-3">
                  {game.description}
                </p>
              </div>

              {game.memories && (
                <p className="text-[11px] text-warm-muted italic pt-3 border-t border-warm-border/60">
                  "{game.memories}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'music' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {songs.map((song) => (
            <div key={song.id} className="apple-card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-warm-subtle border border-warm-border flex items-center justify-center shrink-0">
                  <Music size={18} className="text-warm-secondary" />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-bold text-warm-text truncate">
                    {song.title}
                  </h4>
                  <p className="text-xs text-warm-secondary truncate font-normal">
                    {song.artist}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {song.spotifyUrl && (
                  <a
                    href={song.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-warm-secondary hover:text-warm-text hover:bg-warm-subtle transition"
                    title="Open on Spotify"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'watchlist' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {watchlist.map((item) => (
            <div key={item.id} className="apple-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-warm-muted mb-2">
                  <span>{item.category}</span>
                  <span className="px-2 py-0.5 rounded-full bg-warm-subtle text-warm-text font-medium">
                    {item.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-warm-text mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-warm-secondary leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 pt-3 border-t border-warm-border/60 text-xs font-medium text-warm-text hover:text-warm-amber flex items-center gap-1"
                >
                  <span>Open Resource</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
