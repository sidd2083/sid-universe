'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import MultilingualGreeting from '@/components/home/MultilingualGreeting';
import FlipClock from '@/components/home/FlipClock';
import LiveActivityCard from '@/components/home/LiveActivityCard';
import FeaturedProjectCard from '@/components/home/FeaturedProjectCard';
import ProjectsSection from '@/components/home/ProjectsSection';
import LearningSection from '@/components/home/LearningSection';
import AnonymousAndQASection from '@/components/home/AnonymousAndQASection';
import InterestsSection from '@/components/home/InterestsSection';
import { BackgroundMusicPlayer } from '@/components/home/BackgroundMusicPlayer';
import { SendTouchButton } from '@/components/home/SendTouchButton';
import { LiveStreamBanner } from '@/components/home/LiveStreamBanner';
import { DailyThoughtBox } from '@/components/home/DailyThoughtBox';
import {
  universeStore,
  DEFAULT_SETTINGS,
  DEFAULT_PROJECTS,
  DEFAULT_LEARNING,
  DEFAULT_GAMES,
  DEFAULT_SONGS,
  DEFAULT_WATCHLIST,
  DEFAULT_PUBLISHED_QA,
  DEFAULT_ACTIVITY
} from '@/lib/db';
import {
  SiteSettings,
  Project,
  LearningTopic,
  Game,
  Song,
  WatchlistItem,
  PublishedQA,
  PublicActivity
} from '@/lib/types';

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [learning, setLearning] = useState<LearningTopic[]>(DEFAULT_LEARNING);
  const [games, setGames] = useState<Game[]>(DEFAULT_GAMES);
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(DEFAULT_WATCHLIST);
  const [publishedQA, setPublishedQA] = useState<PublishedQA[]>(DEFAULT_PUBLISHED_QA);
  const [activity, setActivity] = useState<PublicActivity>(DEFAULT_ACTIVITY);

  useEffect(() => {
    // Load initial data
    setSettings(universeStore.get('siteSettings', DEFAULT_SETTINGS));
    setProjects(universeStore.get('projects', DEFAULT_PROJECTS));
    setLearning(universeStore.get('learningTopics', DEFAULT_LEARNING));
    setGames(universeStore.get('games', DEFAULT_GAMES));
    setSongs(universeStore.get('songs', DEFAULT_SONGS));
    setWatchlist(universeStore.get('watchlist', DEFAULT_WATCHLIST));
    setPublishedQA(universeStore.get('publishedQA', DEFAULT_PUBLISHED_QA));
    setActivity(universeStore.get('publicActivity', DEFAULT_ACTIVITY));

    // Fetch latest published Q&A from server
    fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.publishedQA && Array.isArray(data.publishedQA) && data.publishedQA.length > 0) {
          setPublishedQA(data.publishedQA);
          universeStore.set('publishedQA', data.publishedQA);
        }
      })
      .catch((err) => console.warn('Homepage publishedQA fetch notice:', err));

    // Listen for live updates
    function handleUpdate(e: any) {
      const { key, value } = e.detail || {};
      if (key === 'siteSettings') setSettings(value);
      if (key === 'projects') setProjects(value);
      if (key === 'learningTopics') setLearning(value);
      if (key === 'games') setGames(value);
      if (key === 'songs') setSongs(value);
      if (key === 'watchlist') setWatchlist(value);
      if (key === 'publishedQA') setPublishedQA(value);
      if (key === 'publicActivity') setActivity(value);
    }

    window.addEventListener('sid_store_updated', handleUpdate);

    // Live polling for activity every 2.5s
    let isMounted = true;
    const pollActivity = async () => {
      try {
        const res = await fetch('/api/activity');
        if (res.ok) {
          const data = await res.json();
          if (data && isMounted && data.siddhantAction) {
            setActivity((prev) => ({ ...prev, ...data }));
          }
        }
      } catch (e) {}
    };
    pollActivity();
    const pollTimer = setInterval(pollActivity, 2500);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
      window.removeEventListener('sid_store_updated', handleUpdate);
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-24">
      {/* Live Stream Banner (Only visible when Sid is actively streaming) */}
      <LiveStreamBanner url={settings.liveStream?.url} title={settings.liveStream?.title} />

      {/* 1. HERO: Multilingual Greeting, Large Flip Clock & Live Activity Card */}
      <section className="space-y-8 pt-2 text-center">
        <MultilingualGreeting
          greetings={settings.greetings}
          intervalMs={settings.greetingIntervalMs}
          paused={settings.greetingPaused}
        />

        {/* Large Flip-Style Digital Clock */}
        <div className="pt-2 pb-2">
          <FlipClock format={settings.clockFormat || '12h'} />
        </div>

        {/* Daily Thoughts, Essay & Philosophy Box (Shows only when text is entered in Admin) */}
        <DailyThoughtBox thought={settings.dailyThought} />

        {/* Live Activity Card & Touch Sid Action */}
        <div className="pt-2 flex flex-col items-center gap-3.5">
          <LiveActivityCard activity={activity} />
          <SendTouchButton />
        </div>
      </section>

      {/* 2. ABOUT ME: Honest & Philosophical Introduction */}
      <section className="apple-card p-6 sm:p-9 bg-warm-surface border border-warm-border/80 shadow-apple-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-warm-border/60">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-warm-muted">
              Personal Introduction
            </span>
            <span className="text-warm-border">•</span>
            <span className="text-[11px] font-mono text-warm-secondary">Hetauda, Nepal</span>
          </div>
          <Link
            href="/about"
            className="text-xs font-semibold text-warm-text hover:text-warm-amber flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Read full story & philosophy</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-warm-text tracking-tight">
            {settings.tagline}
          </h2>
          <div className="space-y-3 text-sm sm:text-base text-warm-secondary leading-relaxed max-w-3xl">
            <p>
              Hey! I am Siddhant, you can also call me Sidd. I am a full-time student currently studying in grade 11, part-time coder and builder, and casual gamer playing new games every day.
            </p>
            <p>
              In reality, I hate everything sometimes, the routine, the classes, and even the games. But I enjoy the process of making things from scratch. It gives me a dopamine rush, and at the end of the day, it's just me sitting in my room in front of my PC trying to figure out life.
            </p>
          </div>
        </div>

        {/* Philosophical Builder Quote Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-warm-subtle/80 border border-warm-border/60 flex items-start gap-3">
          <span className="text-2xl text-warm-muted/60 font-serif leading-none select-none">“</span>
          <div>
            <blockquote className="text-xs sm:text-sm text-warm-text italic leading-relaxed font-serif">
              "{settings.philosophicalQuote?.quote || "The people who are crazy enough to think they can change the world are the ones who do."}"
            </blockquote>
            <cite className="block text-[10px] font-mono uppercase tracking-widest text-warm-muted mt-1.5 not-italic">
              — {settings.philosophicalQuote?.author || "Steve Jobs"}
            </cite>
          </div>
        </div>
      </section>

      {/* 3. FEATURED RECENT BIG PROJECT: StudentHub Nepal */}
      <FeaturedProjectCard project={settings.currentProject || DEFAULT_SETTINGS.currentProject} />

      {/* 4. PROJECTS: Built, In Progress, Want to Build */}
      <ProjectsSection projects={projects} />

      {/* 5. LEARNING & EXPLORING */}
      <LearningSection topics={learning} />

      {/* 6. FREE TIME: Music, Gaming, Watchlist */}
      <InterestsSection games={games} songs={songs} watchlist={watchlist} />

      {/* 7. PRIVATE ANONYMOUS INBOX & PUBLISHED Q&A */}
      <AnonymousAndQASection publishedQA={publishedQA} />

      {/* FLOATING BACKGROUND MUSIC PLAYER */}
      <BackgroundMusicPlayer settings={settings} />
    </div>
  );
}
