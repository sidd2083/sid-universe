'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ExternalLink, Music } from 'lucide-react';
import { Song } from '@/lib/types';
import { universeStore, DEFAULT_SONGS } from '@/lib/db';

export default function CosmicMusicPlayer() {
  const [songs, setSongs] = useState<Song[]>(universeStore.get('songs', DEFAULT_SONGS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  const currentSong = songs[currentIndex] || DEFAULT_SONGS[0];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
  };

  return (
    <div className="w-full glass-panel-glow rounded-2xl p-4 sm:p-5 border border-pink-500/20 max-w-xl mx-auto shadow-2xl">
      <div className="flex items-center gap-4">
        {/* Cover Art */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-pink-500/30 shadow-lg">
          <img
            src={currentSong.coverArt}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-pink-900/40 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-end gap-1 h-6">
                <span className="w-1 bg-pink-400 h-full animate-pulse" />
                <span className="w-1 bg-pink-300 h-3/4 animate-pulse" style={{ animationDelay: '0.15s' }} />
                <span className="w-1 bg-pink-200 h-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Track Details & Controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="truncate">
              <h4 className="text-sm sm:text-base font-bold text-white truncate">
                {currentSong.title}
              </h4>
              <p className="text-xs text-slate-400 truncate">
                {currentSong.artist} {currentSong.album ? `• ${currentSong.album}` : ''}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950/60 border border-pink-800/40 text-pink-300 shrink-0">
              {currentSong.genre || 'Electronic'}
            </span>
          </div>

          {/* Interactive Controls */}
          <div className="flex items-center justify-between gap-2 mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={prevSong}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition"
                title="Previous Track"
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 text-white shadow-lg hover:scale-105 transition"
                title={isPlaying ? "Pause Track" : "Play Track"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>

              <button
                onClick={nextSong}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition"
                title="Next Track"
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* External Links */}
            <div className="flex items-center gap-2">
              {currentSong.spotifyUrl && (
                <a
                  href={currentSong.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/40 transition text-xs flex items-center gap-1 font-mono"
                  title="Open in Spotify"
                >
                  <span>Spotify</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {currentSong.youtubeUrl && (
                <a
                  href={currentSong.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 hover:bg-red-900/40 transition text-xs flex items-center gap-1 font-mono"
                  title="Watch on YouTube"
                >
                  <span>YouTube</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
