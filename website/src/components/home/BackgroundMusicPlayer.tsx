'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings } from '@/lib/types';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

interface BackgroundMusicPlayerProps {
  settings?: SiteSettings;
}

export function BackgroundMusicPlayer({ settings }: BackgroundMusicPlayerProps) {
  const musicConfig = settings?.backgroundMusic;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Attempt autoplay if configured (browsers may restrict this without user gesture)
  useEffect(() => {
    if (musicConfig?.autoplay && musicConfig?.enabled && musicConfig?.audioUrl && audioRef.current && !hasStarted) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch(() => {
            // Autoplay blocked by browser policy until interaction
            setIsPlaying(false);
          });
      }
    }
  }, [musicConfig?.autoplay, musicConfig?.enabled, musicConfig?.audioUrl, hasStarted]);

  // If not enabled or no URL, do not render UI (called AFTER all hooks)
  if (!musicConfig || !musicConfig.enabled || !musicConfig.audioUrl) {
    return null;
  }

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Set to beginning if requested or if song ended
      if (audio.ended || !hasStarted) {
        try {
          audio.currentTime = 0;
        } catch (e) {}
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch((err) => {
            console.warn('Playback error / Autoplay blocked on mobile, reloading:', err);
            // On mobile iOS/Android, reload and re-trigger play on user click
            try {
              const currentSrc = audio.src;
              audio.src = '';
              audio.src = currentSrc;
              audio.load();
              audio.currentTime = 0;
              audio.play().then(() => {
                setIsPlaying(true);
                setHasStarted(true);
              }).catch((e) => console.warn('Secondary mobile play failed:', e));
            } catch (reloadErr) {
              console.warn('Reload audio failed:', reloadErr);
            }
          });
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#FAF9F6]/95 backdrop-blur-md border border-[#E8E6DF] shadow-sm rounded-full px-3.5 py-2 transition-all duration-200 hover:shadow-md hover:border-[#D8D6CF]">
      <audio
        ref={audioRef}
        src={musicConfig.audioUrl}
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Pulsing indicator or static icon */}
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F3F2ED] text-[#151413]">
        {isPlaying ? (
          <div className="flex items-end gap-[2px] h-3">
            <span className="w-[2px] h-2 bg-[#059669] animate-[bounce_0.8s_infinite]"></span>
            <span className="w-[2px] h-3 bg-[#059669] animate-[bounce_0.6s_infinite]"></span>
            <span className="w-[2px] h-1.5 bg-[#059669] animate-[bounce_0.9s_infinite]"></span>
          </div>
        ) : (
          <Music className="w-3.5 h-3.5 text-[#73716B]" />
        )}
      </div>

      {/* Song title & Artist */}
      <div className="flex flex-col text-left pr-1 max-w-[140px] sm:max-w-[180px] overflow-hidden">
        <span className="text-[11px] font-semibold text-[#151413] truncate leading-tight">
          {musicConfig.title || 'Atmospheric Track'}
        </span>
        {musicConfig.artist && (
          <span className="text-[10px] text-[#73716B] truncate leading-tight">
            {musicConfig.artist}
          </span>
        )}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        title={isPlaying ? 'Pause music' : 'Play music'}
        className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-[#EAE8E2] text-[#151413] transition-colors"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
        className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-[#EAE8E2] text-[#73716B] hover:text-[#151413] transition-colors"
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
