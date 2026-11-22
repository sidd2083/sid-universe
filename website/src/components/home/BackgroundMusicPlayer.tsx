'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings } from '@/lib/types';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

interface BackgroundMusicPlayerProps {
  settings?: SiteSettings;
}

const DEFAULT_AUDIO_URL = '/audio/lofi-study.wav';

export function BackgroundMusicPlayer({ settings }: BackgroundMusicPlayerProps) {
  const musicConfig = settings?.backgroundMusic;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Determine working audio URL (replace obsolete/broken pixabay URLs with guaranteed local audio)
  const rawUrl = musicConfig?.audioUrl || DEFAULT_AUDIO_URL;
  const resolvedAudioUrl = rawUrl.includes('cdn.pixabay.com') ? DEFAULT_AUDIO_URL : rawUrl;

  const isExplicitlyDisabled = musicConfig?.enabled === false;

  // Universal Autoplay & Mobile Audio Unlock Mechanism
  useEffect(() => {
    if (isExplicitlyDisabled) return;

    const audio = audioRef.current;
    if (!audio) return;

    // Set gentle ambient volume
    audio.volume = 0.65;

    // 1. Direct Autoplay Attempt
    const attemptAutoplay = () => {
      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch(() => {
            // Browser autoplay policy blocked unprompted audio on initial page load
            setIsPlaying(false);

            // 2. Global First-Interaction Listener (for iOS, Android, Safari, Chrome)
            // As soon as the user taps, scrolls, or clicks anywhere on the site, audio starts playing immediately.
            const unlockAudio = () => {
              if (audioRef.current && audioRef.current.paused) {
                audioRef.current
                  .play()
                  .then(() => {
                    setIsPlaying(true);
                    setHasStarted(true);
                  })
                  .catch((e) => console.warn('Interaction audio unlock notice:', e));
              }
            };

            const triggerEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'];
            triggerEvents.forEach((evt) => {
              window.addEventListener(evt, unlockAudio, { once: true, passive: true });
            });
          });
      }
    };

    attemptAutoplay();
  }, [resolvedAudioUrl, isExplicitlyDisabled]);

  if (isExplicitlyDisabled) {
    return null;
  }

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch((err) => {
            console.warn('Playback resume notice, reloading stream:', err);
            try {
              audio.load();
              audio.currentTime = 0;
              audio.play().then(() => {
                setIsPlaying(true);
                setHasStarted(true);
              }).catch((e) => console.warn('Retry play notice:', e));
            } catch (reloadErr) {
              console.warn('Audio reload error:', reloadErr);
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
        src={resolvedAudioUrl}
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }}
      />

      {/* Pulsing indicator or static icon */}
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F3F2ED] text-[#151413]">
        {isPlaying ? (
          <div className="flex items-end gap-[2px] h-3">
            <span className="w-[2px] h-2 bg-[#059669] animate-[bounce_0.8s_infinite]" />
            <span className="w-[2px] h-3 bg-[#059669] animate-[bounce_0.6s_infinite]" />
            <span className="w-[2px] h-1.5 bg-[#059669] animate-[bounce_0.9s_infinite]" />
          </div>
        ) : (
          <Music className="w-3.5 h-3.5 text-[#73716B]" />
        )}
      </div>

      {/* Song title & Artist */}
      <div className="flex flex-col text-left pr-1 max-w-[140px] sm:max-w-[180px] overflow-hidden">
        <span className="text-[11px] font-semibold text-[#151413] truncate leading-tight">
          {musicConfig?.title || 'Lofi Study Session'}
        </span>
        <span className="text-[10px] text-[#73716B] truncate leading-tight">
          {musicConfig?.artist || 'Chilled Beats'}
        </span>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        title={isPlaying ? 'Pause music' : 'Play music'}
        className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-[#EAE8E2] text-[#151413] transition-colors cursor-pointer"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
        className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-[#EAE8E2] text-[#73716B] hover:text-[#151413] transition-colors cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
