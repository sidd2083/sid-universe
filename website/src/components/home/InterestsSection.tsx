'use client';

import React, { useState } from 'react';
import { Gamepad2, Music, Film, ExternalLink, Sparkles } from 'lucide-react';
import { Game, Song, WatchlistItem } from '@/lib/types';

interface Props {
  games: Game[];
  songs: Song[];
  watchlist: WatchlistItem[];
}

export default function InterestsSection({ games, songs, watchlist }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'gaming' | 'music' | 'watchlist'>('all');

  return (
    <section className="space-y-8">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-warm-border/60">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-warm-muted block mb-1">
            Free Time & Interests
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-warm-text">
            Gaming, Music & Watchlist
          </h2>
          <p className="text-xs sm:text-sm text-warm-secondary mt-1">
            What I play, listen to, and watch when I'm away from the keyboard.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-warm-subtle/80 p-1 rounded-xl border border-warm-border self-start sm:self-auto">
          {(['all', 'gaming', 'music', 'watchlist'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-warm-surface text-warm-text shadow-apple-sm'
                  : 'text-warm-secondary hover:text-warm-text'
              }`}
            >
              {tab === 'all' ? 'All Interests' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 1. GAMING SECTION */}
      {(activeTab === 'all' || activeTab === 'gaming') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 size={16} className="text-emerald-600" />
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-warm-text">
                Gaming Space
              </h3>
            </div>
            <span className="text-xs font-mono text-warm-muted">PC Games</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {games.map((game) => (
              <div key={game.id} className="apple-card p-5 flex flex-col justify-between hover:border-warm-muted/60 transition">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-warm-muted mb-2">
                    <span>{game.platform}</span>
                    {game.hoursPlayed && <span>{game.hoursPlayed}h</span>}
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
        </div>
      )}

      {/* 2. MUSIC SECTION */}
      {(activeTab === 'all' || activeTab === 'music') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music size={16} className="text-amber-600" />
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-warm-text">
                Favorite Tracks & Soundtracks
              </h3>
            </div>
            <span className="text-xs font-mono text-warm-muted">Rotations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {songs.map((song) => (
              <div key={song.id} className="apple-card p-4 flex items-center justify-between gap-3 hover:border-warm-muted/60 transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-warm-subtle border border-warm-border flex items-center justify-center shrink-0">
                    <Music size={16} className="text-warm-secondary" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs sm:text-sm font-bold text-warm-text truncate">
                      {song.title}
                    </h4>
                    <p className="text-[11px] text-warm-secondary truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>

                {song.spotifyUrl && (
                  <a
                    href={song.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-warm-muted hover:text-warm-text hover:bg-warm-subtle transition shrink-0"
                    title="Open on Spotify"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. WATCHLIST SECTION */}
      {(activeTab === 'all' || activeTab === 'watchlist') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film size={16} className="text-sky-600" />
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-warm-text">
                Watchlist & Anime
              </h3>
            </div>
            <span className="text-xs font-mono text-warm-muted">Cinema</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {watchlist.map((item) => (
              <div key={item.id} className="apple-card p-5 flex flex-col justify-between hover:border-warm-muted/60 transition">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-warm-muted mb-2">
                    <span className="px-2 py-0.5 rounded bg-warm-subtle text-[10px] text-warm-secondary">
                      {item.type}
                    </span>
                    <span>{item.rating}/10</span>
                  </div>
                  <h4 className="text-base font-bold text-warm-text mb-1">
                    {item.title}
                  </h4>
                  {item.thoughts && (
                    <p className="text-xs text-warm-secondary line-clamp-2 leading-relaxed">
                      "{item.thoughts}"
                    </p>
                  )}
                </div>

                <span className="text-[11px] font-mono text-warm-muted pt-3 border-t border-warm-border/60 mt-2">
                  Status: {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
