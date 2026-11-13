'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_SETTINGS, DEFAULT_TIMELINE } from '@/lib/db';
import { SiteSettings, TimelineMilestone } from '@/lib/types';
import { User, Target, Sparkles, Code, Cpu, Shield, Globe, Award, Calendar } from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [timeline, setTimeline] = useState<TimelineMilestone[]>(DEFAULT_TIMELINE);

  useEffect(() => {
    setSettings(universeStore.get('siteSettings', DEFAULT_SETTINGS));
    setTimeline(universeStore.get('timeline', DEFAULT_TIMELINE));
  }, []);

  const skills = [
    { name: 'Full-Stack Architecture (Next.js, React, Node.js, TypeScript)', level: 95 },
    { name: '3D Web & Creative Computing (Three.js, WebGL, GLSL)', level: 88 },
    { name: 'Systems Engineering & Windows Telemetry (Rust, C++, Electron)', level: 82 },
    { name: 'Cloud Infrastructure & Database Security (Firebase, Cloudflare)', level: 90 },
    { name: 'AI Workflows & LLM Orchestration (PyTorch, PEFT, LangChain)', level: 85 },
    { name: 'Low-Level Security & Process Monitoring', level: 78 }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Section Header with Back to Universe Button */}
      <SectionHeader
        planetName="CHRONICLE"
        sector="Sector 01: Identity & Origins"
        planetColor="#6366f1"
        title="About Sid"
        description="The ancestral origin sphere holding my story, philosophy, background, core skillsets, and milestones."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left Column: Profile Card & Bio */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel-glow rounded-2xl p-6 border border-indigo-500/30 text-center">
            <div className="relative w-36 h-36 mx-auto mb-5 rounded-full overflow-hidden border-2 border-indigo-400 p-1 shadow-[0_0_25px_rgba(99,102,241,0.4)]">
              <img
                src={settings.profileImage || DEFAULT_SETTINGS.profileImage}
                alt="Sid"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <h2 className="text-2xl font-black text-white tracking-wide">Sid</h2>
            <p className="text-xs font-mono text-indigo-300 mt-1 uppercase tracking-widest">
              Digital Architect & Creative Engineer
            </p>

            <div className="mt-4 pt-4 border-t border-space-border/60 text-xs text-slate-300 leading-relaxed text-left">
              {settings.bio || DEFAULT_SETTINGS.bio}
            </div>
          </div>

          {/* Core Philosophy & Ambitions */}
          <div className="glass-panel rounded-2xl p-6 border border-space-border space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-2">
              <Target size={16} />
              <span>Ambitions & Vision</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To bridge the boundary between spatial 3D computing and real-time backend intelligence. Creating software that is not only robust and highly secure, but also deeply atmospheric and rewarding to experience.
            </p>
          </div>
        </div>

        {/* Right Column: Skills & Milestones */}
        <div className="lg:col-span-7 space-y-8">
          {/* Technical Proficiencies */}
          <div className="glass-panel rounded-2xl p-6 border border-space-border">
            <h3 className="text-sm font-mono uppercase tracking-wider text-indigo-400 font-bold mb-5 flex items-center gap-2">
              <Code size={16} />
              <span>Core Proficiencies</span>
            </h3>
            <div className="space-y-4">
              {skills.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-200 font-medium">{s.name}</span>
                    <span className="font-mono text-indigo-400">{s.level}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-space-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Timeline */}
          <div className="glass-panel rounded-2xl p-6 border border-space-border">
            <h3 className="text-sm font-mono uppercase tracking-wider text-indigo-400 font-bold mb-6 flex items-center gap-2">
              <Calendar size={16} />
              <span>Chronological Milestones</span>
            </h3>

            <div className="relative pl-6 space-y-8 border-l border-indigo-500/30">
              {timeline.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Orb */}
                  <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-space-950 shadow-[0_0_10px_#6366f1] group-hover:scale-125 transition-transform" />

                  <span className="text-xs font-mono text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40">
                    {item.year}
                  </span>
                  <h4 className="text-base font-bold text-white mt-2 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
