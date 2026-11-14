'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Music, Film, ExternalLink, ArrowRight } from 'lucide-react';
import { Game, Song, WatchlistItem } from '@/lib/types';

interface Props {
  games: Game[];
  songs: Song[];
  watchlist: WatchlistItem[];
}

/* Homepage preview: show limited items with "See more" links to /gaming */
const PREVIEW_GAMES = 3;
const PREVIEW_SONGS = 3;
const PREVIEW_WATCH = 3;

export default function InterestsSection({ games, songs, watchlist }: Props) {
  const previewGames = games.slice(0, PREVIEW_GAMES);
  const previewSongs = songs.slice(0, PREVIEW_SONGS);
  const previewWatch = watchlist.slice(0, PREVIEW_WATCH);

  return (
    <section className="space-y-8">
      {/* Header */}
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

        <Link
          href="/gaming"
          className="text-xs font-semibold text-warm-text hover:text-warm-amber flex items-center gap-1 group self-start sm:self-auto bg-warm-surface hover:bg-warm-hover px-3.5 py-1.5 rounded-full border border-warm-border shadow-apple-sm transition"
        >
          <span>View all interests</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 1. GAMING — 3 cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 size={16} className="text-emerald-600" />
            <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-warm-text">
              Gaming Space
            </h3>
          </div>
          {games.length > PREVIEW_GAMES && (
            <Link href="/gaming" className="text-[11px] font-semibold text-warm-secondary hover:text-warm-text flex items-center gap-1 group transition">
              <span>See all {games.length} games</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {previewGames.map((game) => (
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
                  &ldquo;{game.memories}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. MUSIC — 3 cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music size={16} className="text-amber-600" />
            <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-warm-text">
              Favorite Tracks
            </h3>
          </div>
          {songs.length > PREVIEW_SONGS && (
            <Link href="/gaming" className="text-[11px] font-semibold text-warm-secondary hover:text-warm-text flex items-center gap-1 group transition">
              <span>See all {songs.length} tracks</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {previewSongs.map((song) => (
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

      {/* 3. WATCHLIST — 3 cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film size={16} className="text-sky-600" />
            <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-warm-text">
              Watchlist & Anime
            </h3>
          </div>
          {watchlist.length > PREVIEW_WATCH && (
            <Link href="/gaming" className="text-[11px] font-semibold text-warm-secondary hover:text-warm-text flex items-center gap-1 group transition">
              <span>See all {watchlist.length} titles</span>
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {previewWatch.map((item) => (
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
                    &ldquo;{item.thoughts}&rdquo;
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
    </section>
  );
}
