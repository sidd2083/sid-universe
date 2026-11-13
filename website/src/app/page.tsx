'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import MultilingualGreeting from '@/components/home/MultilingualGreeting';
import FlipClock from '@/components/home/FlipClock';
import LocationAtmosphere from '@/components/home/LocationAtmosphere';
import LiveActivitySection from '@/components/home/LiveActivitySection';
import ProjectsSection from '@/components/home/ProjectsSection';
import LearningSection from '@/components/home/LearningSection';
import AnonymousAndQASection from '@/components/home/AnonymousAndQASection';
import InterestsSection from '@/components/home/InterestsSection';
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
  PublicActivity,
  WeatherInfo
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
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

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
    return () => window.removeEventListener('sid_store_updated', handleUpdate);
  }, []);

  // Fetch live weather in Hetauda
  useEffect(() => {
    fetch('/api/weather')
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-24">
      {/* 1. HERO: Multilingual Greeting & Large Flip Clock */}
      <section className="space-y-8 pt-2">
        <MultilingualGreeting
          greetings={settings.greetings}
          intervalMs={settings.greetingIntervalMs}
          paused={settings.greetingPaused}
        />

        {/* Large Flip-Style Digital Clock */}
        <div className="pt-2 pb-4">
          <FlipClock format={settings.clockFormat || '12h'} />
        </div>

        {/* Live Location Atmosphere Card (Hetauda, Nepal) */}
        <LocationAtmosphere weather={weather} />
      </section>

      {/* 2. ABOUT ME: Compact Introduction */}
      <section className="apple-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-warm-muted">
            Personal Introduction
          </span>
          <Link
            href="/about"
            className="text-xs font-semibold text-warm-text hover:text-warm-amber flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Know more about me</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-warm-text tracking-tight mb-3">
          {settings.tagline}
        </h2>
        <p className="text-sm sm:text-base text-warm-secondary leading-relaxed max-w-3xl">
          {settings.bio}
        </p>
      </section>

      {/* 3. LIVE ACTIVITY: Synchronized with Windows Companion */}
      <section>
        <LiveActivitySection
          activity={activity}
          currentProject={settings.currentProject || DEFAULT_SETTINGS.currentProject}
        />
      </section>

      {/* 4. PROJECTS: Built, Currently building, Want to build */}
      <ProjectsSection projects={projects} />

      {/* 5. LEARNING & EXPLORING */}
      <LearningSection topics={learning} />

      {/* 6. FREE TIME: Music, Gaming, Watchlist */}
      <InterestsSection games={games} songs={songs} watchlist={watchlist} />

      {/* 7. PRIVATE ANONYMOUS INBOX & PUBLISHED Q&A */}
      <AnonymousAndQASection publishedQA={publishedQA} />
    </div>
  );
}
