'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import {
  universeStore,
  DEFAULT_GAMES,
  DEFAULT_SONGS,
  DEFAULT_WATCHLIST
} from '@/lib/db';
import { Game, Song, WatchlistItem } from '@/lib/types';
import { Gamepad2, Music, Film, Clock, ExternalLink, Star, Quote, Play } from 'lucide-react';

export default function GamingPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'gaming' | 'music' | 'watchlist'>('all');
  const [games, setGames] = useState<Game[]>(DEFAULT_GAMES);
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(DEFAULT_WATCHLIST);

  useEffect(() => {
    setGames(universeStore.get('games', DEFAULT_GAMES));
    setSongs(universeStore.get('songs', DEFAULT_SONGS));
    setWatchlist(universeStore.get('watchlist', DEFAULT_WATCHLIST));

    function handleStoreUpdate(e: any) {
      if (e.detail?.key === 'games' && Array.isArray(e.detail.value)) setGames(e.detail.value);
      if (e.detail?.key === 'songs' && Array.isArray(e.detail.value)) setSongs(e.detail.value);
      if (e.detail?.key === 'watchlist' && Array.isArray(e.detail.value)) setWatchlist(e.detail.value);
    }

    window.addEventListener('sid_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('sid_store_updated', handleStoreUpdate);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <SectionHeader
        category="Free Time & Leisure"
        title="Interests & Taste"
        description="A curated catalog of games I play with friends, soundtracks that keep me in flow, and cinema or tutorials I watch."
      />

      {/* Philosophy on Play & Art Callout */}
      <div className="apple-card p-6 sm:p-8 bg-warm-subtle/70 border border-warm-border text-center relative overflow-hidden">
        <Quote size={28} className="mx-auto text-warm-muted/40 mb-3" />
        <blockquote className="text-base sm:text-lg font-serif italic text-warm-text max-w-2xl mx-auto leading-relaxed">
          "Without music, life would be a mistake. Play is the highest form of research."
        </blockquote>
        <cite className="block text-xs font-mono uppercase tracking-widest text-warm-muted mt-3 not-italic">
          — Friedrich Nietzsche & Albert Einstein
        </cite>
      </div>

      {/* Category Tab Switcher */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-warm-subtle border border-warm-border shadow-apple-sm">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'bg-warm-surface text-warm-text shadow-apple-sm'
                : 'text-warm-secondary hover:text-warm-text'
            }`}
          >
            All Interests
          </button>
          <button
            onClick={() => setActiveTab('gaming')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'gaming'
                ? 'bg-warm-surface text-warm-text shadow-apple-sm'
                : 'text-warm-secondary hover:text-warm-text'
            }`}
          >
            <Gamepad2 size={13} className="text-emerald-600" />
            <span>Gaming ({games.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'music'
                ? 'bg-warm-surface text-warm-text shadow-apple-sm'
                : 'text-warm-secondary hover:text-warm-text'
            }`}
          >
            <Music size={13} className="text-amber-600" />
            <span>Music ({songs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'watchlist'
                ? 'bg-warm-surface text-warm-text shadow-apple-sm'
                : 'text-warm-secondary hover:text-warm-text'
            }`}
          >
            <Film size={13} className="text-sky-600" />
            <span>Watchlist ({watchlist.length})</span>
          </button>
        </div>
      </div>

      {/* 1. GAMING SECTION */}
      {(activeTab === 'all' || activeTab === 'gaming') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
            <div className="flex items-center gap-2">
              <Gamepad2 size={18} className="text-emerald-600" />
              <h2 className="text-base font-bold text-warm-text tracking-tight">
                PC & Co-op Games
              </h2>
            </div>
            <span className="text-xs font-mono text-warm-muted">{games.length} Titles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map((game) => (
              <div key={game.id} className="apple-card p-6 flex flex-col justify-between group hover:border-warm-strong transition-all">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-warm-muted mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-warm-subtle text-warm-text font-medium">
                      {game.platform}
                    </span>
                    {game.hoursPlayed && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>{game.hoursPlayed} hrs</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-warm-text mb-1.5 group-hover:text-emerald-700 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs text-warm-secondary leading-relaxed mb-4">
                    {game.description}
                  </p>
                </div>

                {game.memories && (
                  <div className="pt-3 border-t border-warm-border/60">
                    <div className="p-3 rounded-xl bg-warm-subtle/80 text-warm-muted italic text-[11px] leading-relaxed">
                      "{game.memories}"
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. MUSIC SECTION */}
      {(activeTab === 'all' || activeTab === 'music') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
            <div className="flex items-center gap-2">
              <Music size={18} className="text-amber-600" />
              <h2 className="text-base font-bold text-warm-text tracking-tight">
                Favorite Soundtracks & Tracks
              </h2>
            </div>
            <span className="text-xs font-mono text-warm-muted">{songs.length} Tracks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {songs.map((song) => (
              <div key={song.id} className="apple-card p-5 flex items-center justify-between gap-3 group hover:border-warm-strong transition-all">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-warm-muted block mb-0.5">
                    {song.genre || 'Soundtrack'}
                  </span>
                  <h3 className="text-sm font-bold text-warm-text truncate group-hover:text-amber-700 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-xs text-warm-secondary truncate mt-0.5">
                    {song.artist} {song.album ? `• ${song.album}` : ''}
                  </p>
                </div>

                {song.spotifyUrl && (
                  <a
                    href={song.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-warm-subtle hover:bg-[#1DB954] hover:text-white text-warm-secondary flex items-center justify-center transition shrink-0"
                    title="Listen on Spotify"
                  >
                    <Play size={13} className="ml-0.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. WATCHLIST & CINEMA */}
      {(activeTab === 'all' || activeTab === 'watchlist') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
            <div className="flex items-center gap-2">
              <Film size={18} className="text-sky-600" />
              <h2 className="text-base font-bold text-warm-text tracking-tight">
                Cinema, Anime & Courses
              </h2>
            </div>
            <span className="text-xs font-mono text-warm-muted">{watchlist.length} Items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {watchlist.map((item) => (
              <div key={item.id} className="apple-card p-6 flex flex-col justify-between group hover:border-warm-strong transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-warm-subtle text-warm-secondary">
                      {item.type || item.category}
                    </span>
                    {item.rating && (
                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-warm-text">
                        <Star size={11} className="text-amber-500 fill-amber-500" />
                        <span>{item.rating}/10</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-warm-text mb-1 group-hover:text-sky-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-warm-secondary leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {item.thoughts && (
                  <div className="pt-3 border-t border-warm-border/60">
                    <p className="text-[11px] text-warm-muted italic leading-relaxed">
                      "{item.thoughts}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
