'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_SETTINGS, DEFAULT_RAW_BIO } from '@/lib/db';
import { SiteSettings } from '@/lib/types';
import { MapPin, Quote, Terminal, Sparkles, Brain, Gamepad2 } from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(universeStore.get('siteSettings', DEFAULT_SETTINGS));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <SectionHeader
        category="Identity & Personal Reflection"
        title="About Siddhant"
        description="Grade 11 Student · Builder · Explorer of Ideas · Hetauda, Nepal"
      />

      {/* Main Raw Bio */}
      <div className="apple-card p-6 sm:p-10 space-y-8 bg-warm-surface border border-warm-border shadow-apple-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-warm-border/60">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-warm-text tracking-tight">
              Siddhant (Sidd)
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-warm-muted mt-1.5">
              <MapPin size={13} />
              <span>Hetauda, Bagmati Province, Nepal</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-warm-subtle text-xs font-mono text-warm-secondary border border-warm-border">
            Grade 11 Student & Builder
          </span>
        </div>

        {/* Authentic Raw Story */}
        <div className="space-y-6 text-sm sm:text-base text-warm-secondary leading-relaxed font-sans">
          <p className="text-base sm:text-lg text-warm-text font-medium leading-relaxed">
            Hey! I am Siddhant, you can also call me Sidd. I am a full-time student currently studying in grade 11, part-time coder and builder, and casual gamer playing new games every day.
          </p>

          <p>
            This is just my small bio to tell. In reality, I hate everything. I hate going to college sometimes, I hate what I am doing most of the time, I even hate the game I am playing — I don't know why, but yeah, it is what it is. I have built many projects; most of them are just sitting in my folders and GitHub. I just enjoy the process of making new things — it gives me a dopamine rush. I get this instant delusion that it will hit, and those projects definitely have the power to get hit, but yeah... me and my interests just vanish after a while.
          </p>

          <p>
            I am learning many things at the same time. I don't know if it's good or bad, but it is what it is. Like, I am currently learning AI & Machine Learning, but I wanted to learn cybersecurity too. Currently, I am also learning Photoshop and Blender, but I wanted to learn video editing also. It's always my heart and brain fighting against each other — my mind wants to learn everything, but ends up finishing nothing.
          </p>

          <p className="text-warm-text font-medium bg-warm-subtle/80 p-5 rounded-2xl border border-warm-border">
            At the end, it's just me sitting in my room alone in front of my PC, trying to figure out life, doing and learning new things every day.
          </p>
        </div>
      </div>

      {/* Prominent Philosophical Quote */}
      <div className="apple-card p-8 sm:p-10 bg-warm-subtle/70 border border-warm-border text-center relative overflow-hidden">
        <Quote size={32} className="mx-auto text-warm-muted/40 mb-4" />
        <blockquote className="text-lg sm:text-xl md:text-2xl font-serif italic text-warm-text max-w-2xl mx-auto leading-relaxed">
          "{settings.philosophicalQuote?.quote || "The people who are crazy enough to think they can change the world are the ones who do."}"
        </blockquote>
        <cite className="block text-xs font-mono uppercase tracking-widest text-warm-muted mt-4 not-italic">
          — {settings.philosophicalQuote?.author || "Steve Jobs"}
        </cite>
      </div>

      {/* Honest Facets of Mind */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="apple-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-warm-text font-bold">
            <Brain size={18} className="text-amber-600" />
            <h3>The Curiosity Dilemma</h3>
          </div>
          <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed">
            I grasp concepts remarkably fast, but the forgetting curve hits just as rapidly. The fight between wanting to master AI/ML, 3D graphics, cybersecurity, and design keeps me awake, building and testing every day.
          </p>
        </div>

        <div className="apple-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-warm-text font-bold">
            <Gamepad2 size={18} className="text-emerald-600" />
            <h3>Gaming & Digital Escape</h3>
          </div>
          <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed">
            Whether running around Los Santos in GTA V, building redstone mechanics in Minecraft, or casually playing with friends, gaming is my room's second window into other worlds.
          </p>
        </div>
      </div>
    </div>
  );
}
