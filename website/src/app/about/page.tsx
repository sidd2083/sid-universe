'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_SETTINGS, DEFAULT_TIMELINE } from '@/lib/db';
import { SiteSettings, TimelineMilestone } from '@/lib/types';
import { MapPin, Calendar, Heart, Terminal } from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [timeline, setTimeline] = useState<TimelineMilestone[]>(DEFAULT_TIMELINE);

  useEffect(() => {
    setSettings(universeStore.get('siteSettings', DEFAULT_SETTINGS));
    setTimeline(universeStore.get('timeline', DEFAULT_TIMELINE));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <SectionHeader
        category="Identity & Background"
        title="About Sid"
        description="A student and builder from Hetauda, Nepal. Exploring computer science, design systems, and building practical things."
      />

      {/* Main Story & Philosophy */}
      <div className="apple-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-warm-border/60">
          <div>
            <h2 className="text-2xl font-bold text-warm-text">Sid</h2>
            <div className="flex items-center gap-2 text-xs text-warm-muted mt-1">
              <MapPin size={12} />
              <span>Hetauda, Bagmati Province, Nepal</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-warm-subtle text-xs font-mono text-warm-secondary border border-warm-border">
            Student & Developer
          </span>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-warm-secondary leading-relaxed font-sans">
          <p>
            I am a student based in Hetauda, Nepal. I enjoy spending my time writing code, exploring how software works under the hood, and building platforms that can genuinely help students around me.
          </p>
          <p>
            My journey began a few years ago when I wanted to build real things on the web. That curiosity led to creating <strong>GSConfession</strong>, an anonymous community space where students could share their authentic thoughts. Managing server crashes, database performance, and content moderation taught me practical engineering lessons that no textbook ever could.
          </p>
          <p>
            Currently, my main energy is focused on <strong>StudentHub Nepal</strong>, an ambitious platform designed to centralize study rooms, report card tracking, and peer streaks for students across Nepal. When I am not working on that, I spend my afternoons learning Python, diving into NumPy and Pandas, playing GTA V or Minecraft with close friends, and exploring minimalist design.
          </p>
        </div>
      </div>

      {/* Personal Philosophy & Approach */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <h3 className="text-base font-bold text-warm-text mb-2">
            My Approach to Building
          </h3>
          <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed">
            I value clarity over unnecessary complexity. Every feature should have a purpose. Beautiful typography, natural spacing, and rock-solid backend reliability matter far more to me than flashy decorative trends.
          </p>
        </div>

        <div className="apple-card p-6">
          <h3 className="text-base font-bold text-warm-text mb-2">
            Curiosity & Consistency
          </h3>
          <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed">
            I don't pretend to know everything or have perfect consistency. I have half-finished courses and an endless queue of things I want to master. What keeps me going is building actual software that people can use.
          </p>
        </div>
      </div>

      {/* Chronological Timeline */}
      <div className="apple-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Calendar size={18} className="text-warm-secondary" />
          <h3 className="text-lg font-bold text-warm-text">
            Milestones & Journey
          </h3>
        </div>

        <div className="relative pl-6 space-y-8 border-l border-warm-border">
          {timeline.map((item) => (
            <div key={item.id} className="relative">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-warm-surface border-2 border-warm-text" />

              <span className="text-xs font-mono font-semibold text-warm-muted">
                {item.year}
              </span>
              <h4 className="text-base font-bold text-warm-text mt-1 mb-1">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
