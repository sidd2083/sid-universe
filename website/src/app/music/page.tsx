'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_SONGS, DEFAULT_PLAYLISTS } from '@/lib/db';
import { Song, Playlist } from '@/lib/types';
import { Music, Play, Pause, ExternalLink, Disc } from 'lucide-react';

export default function MusicPage() {
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [playlists, setPlaylists] = useState<Playlist[]>(DEFAULT_PLAYLISTS);

  useEffect(() => {
    setSongs(universeStore.get('songs', DEFAULT_SONGS));
    setPlaylists(universeStore.get('playlists', DEFAULT_PLAYLISTS));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <SectionHeader
        category="Sound & Melodies"
        title="Music"
        description="Tracks, ambient soundscapes, and playlists that keep me company while coding, designing, and thinking."
      />

      {/* Songs Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-mono uppercase tracking-wider font-semibold text-warm-text pb-2 border-b border-warm-border/60">
          Favorite Tracks
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {songs.map((song) => (
            <div key={song.id} className="apple-card p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-warm-subtle border border-warm-border flex items-center justify-center shrink-0">
                  <Disc size={20} className="text-warm-secondary" />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-bold text-warm-text truncate">
                    {song.title}
                  </h4>
                  <p className="text-xs text-warm-secondary truncate font-normal">
                    {song.artist}
                  </p>
                  {song.genre && (
                    <span className="text-[10px] font-mono text-warm-muted">
                      {song.genre}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {song.spotifyUrl && (
                  <a
                    href={song.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-warm-border bg-warm-subtle/60 text-warm-text hover:bg-warm-hover transition"
                    title="Open in Spotify"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Playlists */}
      <div className="space-y-4">
        <h3 className="text-base font-mono uppercase tracking-wider font-semibold text-warm-text pb-2 border-b border-warm-border/60">
          Playlists
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {playlists.map((pl) => (
            <div key={pl.id} className="apple-card p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-warm-muted block mb-1">
                  {pl.trackCount} Tracks
                </span>
                <h4 className="text-lg font-bold text-warm-text mb-2">
                  {pl.title}
                </h4>
                <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed mb-4">
                  {pl.description}
                </p>
              </div>

              {pl.spotifyUrl && (
                <a
                  href={pl.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-text hover:text-warm-amber transition pt-3 border-t border-warm-border/60"
                >
                  <span>Open Spotify Playlist</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
