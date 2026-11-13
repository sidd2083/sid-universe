'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import CosmicMusicPlayer from '@/components/music/CosmicMusicPlayer';
import { universeStore, DEFAULT_SONGS, DEFAULT_PLAYLISTS, DEFAULT_ACTIVITY } from '@/lib/db';
import { Song, Playlist, PublicActivity } from '@/lib/types';
import { Music, Play, ExternalLink, Headphones, Disc3, Radio } from 'lucide-react';

export default function MusicPage() {
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [playlists, setPlaylists] = useState<Playlist[]>(DEFAULT_PLAYLISTS);
  const [activity, setActivity] = useState<PublicActivity>(universeStore.get('publicActivity', DEFAULT_ACTIVITY));

  useEffect(() => {
    setSongs(universeStore.get('songs', DEFAULT_SONGS));
    setPlaylists(universeStore.get('playlists', DEFAULT_PLAYLISTS));
    setActivity(universeStore.get('publicActivity', DEFAULT_ACTIVITY));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        planetName="RESONANCE"
        sector="Sector 05: Harmonic Frequencies"
        planetColor="#ec4899"
        title="Cosmic Frequencies & Soundscapes"
        description="The acoustic celestial sphere vibrating with curated tracks, playlists, favorite artists, and optional website player."
      />

      {/* Website Music Player (Non-autoplay, visitor-controlled) */}
      <div className="mb-12">
        <div className="text-center mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-pink-400 font-semibold flex items-center justify-center gap-1.5">
            <Radio size={14} className="text-pink-400 animate-pulse" />
            <span>Interactive Space Player (Click play to listen)</span>
          </span>
        </div>
        <CosmicMusicPlayer />
      </div>

      {/* Live Spotify / YouTube Music Status Card */}
      {activity.currentMusic && (
        <div className="glass-panel-glow rounded-2xl p-5 border border-pink-500/40 mb-12 shadow-xl flex items-center justify-between gap-4 max-w-xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0">
              <Headphones size={20} className="animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold block">
                Sid is currently listening to ({activity.currentMusic.source})
              </span>
              <h4 className="text-sm font-bold text-white">
                {activity.currentMusic.title} — {activity.currentMusic.artist}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* Curated Track Library */}
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Disc3 size={20} className="text-pink-400" />
        <span>Essential Sound Library</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {songs.map((song) => (
          <div
            key={song.id}
            className="glass-panel rounded-xl p-4 border border-pink-500/20 hover:border-pink-500/50 transition-all flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-space-border relative">
                <img src={song.coverArt} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="truncate">
                <h4 className="text-sm font-bold text-white truncate group-hover:text-pink-300 transition">
                  {song.title}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {song.artist} {song.album ? `• ${song.album}` : ''}
                </p>
                <span className="text-[10px] font-mono text-pink-400">
                  {song.genre} {song.duration ? `• ${song.duration}` : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {song.spotifyUrl && (
                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/40 transition"
                  title="Listen on Spotify"
                >
                  <ExternalLink size={13} />
                </a>
              )}
              {song.youtubeUrl && (
                <a
                  href={song.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 hover:bg-red-900/40 transition"
                  title="Listen on YouTube"
                >
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Featured Playlists */}
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Music size={20} className="text-pink-400" />
        <span>Curated Sonic Playlists</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="glass-panel rounded-2xl overflow-hidden border border-pink-500/20 hover:border-pink-500/50 transition-all flex flex-col sm:flex-row gap-4 p-5 items-center"
          >
            <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 border border-space-border">
              <img src={playlist.coverImage} alt={playlist.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-white mb-1">
                {playlist.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {playlist.description}
              </p>
              <a
                href={playlist.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/60 text-xs font-mono font-semibold transition"
              >
                <span>Open on Spotify</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
