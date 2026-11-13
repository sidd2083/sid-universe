'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Gamepad2,
  Music,
  Code2,
  Tv,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles,
  Wifi,
  WifiOff,
  FolderGit2
} from 'lucide-react';
import { PublicActivity, CurrentProjectHighlight } from '@/lib/types';

interface Props {
  activity: PublicActivity;
  currentProject: CurrentProjectHighlight;
}

export default function LiveActivitySection({ activity, currentProject }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  // Time format helper
  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return 'Just now';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  const isOnline = activity.isOnline && !activity.sharingPaused;

  return (
    <div className="space-y-6">
      {/* Activity Card */}
      <div className="apple-card p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-warm-border/60">
          {/* Header & Status Indicator */}
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-warm-muted'
              }`}
            />
            <h2 className="text-sm font-mono uppercase tracking-wider font-semibold text-warm-text">
              Live Activity
            </h2>
            <span className="text-xs text-warm-muted">
              • {isOnline ? 'Synced with Windows Companion' : 'Standby / Offline'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-warm-muted flex items-center gap-1 font-mono">
              <Clock size={12} />
              <span>{formatTimeAgo(activity.lastActiveTime || activity.lastHeartbeat)}</span>
            </span>

            <button
              onClick={() => setModalOpen(true)}
              className="text-xs font-medium text-warm-text hover:text-warm-amber transition flex items-center gap-0.5"
            >
              <span>View details</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Current State Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          {/* 1. Primary Action */}
          <div className="p-4 rounded-xl bg-warm-subtle/60 border border-warm-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-warm-muted block mb-1">
              Currently Doing
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-warm-text">
              {activity.currentGame ? (
                <>
                  <Gamepad2 size={16} className="text-emerald-600 shrink-0" />
                  <span className="truncate">Playing {activity.currentGame.title}</span>
                </>
              ) : activity.browserTab?.title?.includes('YouTube') ? (
                <>
                  <Tv size={16} className="text-red-500 shrink-0" />
                  <span className="truncate">Watching YouTube</span>
                </>
              ) : activity.currentCoding ? (
                <>
                  <Code2 size={16} className="text-sky-600 shrink-0" />
                  <span className="truncate">{activity.currentCoding.editor || 'Coding'}</span>
                </>
              ) : activity.currentMusic ? (
                <>
                  <Music size={16} className="text-amber-600 shrink-0" />
                  <span className="truncate">Listening to Music</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-warm-muted shrink-0" />
                  <span className="truncate">{activity.customStatus || 'Thinking & Planning'}</span>
                </>
              )}
            </div>
            {activity.browserTab?.title && (
              <p className="text-xs text-warm-secondary truncate mt-1.5 font-normal">
                "{activity.browserTab.title}"
              </p>
            )}
          </div>

          {/* 2. Music / Media */}
          <div className="p-4 rounded-xl bg-warm-subtle/60 border border-warm-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-warm-muted block mb-1">
              Music Stream
            </span>
            {activity.currentMusic ? (
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-warm-text truncate">
                  <Music size={16} className="text-amber-600 shrink-0" />
                  <span className="truncate">{activity.currentMusic.title}</span>
                </div>
                <p className="text-xs text-warm-secondary truncate mt-1 font-normal">
                  by {activity.currentMusic.artist}
                </p>
              </div>
            ) : (
              <p className="text-xs text-warm-muted mt-1 font-normal">
                No active music playback
              </p>
            )}
          </div>

          {/* 3. Primary Working Project */}
          <div className="p-4 rounded-xl bg-warm-subtle/60 border border-warm-border sm:col-span-2 lg:col-span-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-warm-muted block mb-1">
              Active Focus
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-warm-text truncate">
              <FolderGit2 size={16} className="text-warm-amber shrink-0" />
              <span className="truncate">{currentProject.name}</span>
            </div>
            <p className="text-xs text-warm-secondary truncate mt-1 font-normal">
              {currentProject.status} • Next.js & TypeScript
            </p>
          </div>
        </div>
      </div>

      {/* Featured Current Project Card */}
      <div className="apple-card p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-warm-amberSoft text-warm-amber text-[10px] font-mono font-semibold uppercase tracking-wider">
              {currentProject.status}
            </span>
            <span className="text-xs text-warm-muted font-mono">Major Project Highlight</span>
          </div>

          {currentProject.link && (
            <a
              href={currentProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-warm-text hover:text-warm-amber transition flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>Visit project</span>
              <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-warm-text tracking-tight mb-2">
          {currentProject.name}
        </h3>
        <p className="text-sm text-warm-secondary leading-relaxed max-w-3xl mb-4">
          {currentProject.description}
        </p>

        {currentProject.technologies && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-warm-border/60">
            {currentProject.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-warm-subtle text-[11px] font-mono text-warm-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="apple-card max-w-lg w-full p-6 sm:p-7 bg-warm-surface shadow-apple-lg relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-warm-muted hover:text-warm-text hover:bg-warm-subtle transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} className="text-warm-amber" />
              <h3 className="text-base font-bold text-warm-text font-mono">
                Approved Live Telemetry
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-warm-subtle border border-warm-border">
                <span className="text-warm-muted uppercase font-mono text-[10px] block mb-1">
                  Windows Companion Link
                </span>
                <div className="flex items-center gap-2 font-semibold text-warm-text">
                  {isOnline ? (
                    <>
                      <Wifi size={14} className="text-emerald-600" />
                      <span>Active Heartbeat</span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={14} className="text-warm-muted" />
                      <span>Disconnected / Offline</span>
                    </>
                  )}
                </div>
              </div>

              {activity.currentCoding && (
                <div className="p-3.5 rounded-xl bg-warm-subtle border border-warm-border">
                  <span className="text-warm-muted uppercase font-mono text-[10px] block mb-1">
                    Development Environment
                  </span>
                  <p className="font-semibold text-warm-text">
                    {activity.currentCoding.editor} — {activity.currentCoding.project}
                  </p>
                  <p className="text-warm-secondary mt-0.5 font-mono text-[11px]">
                    Active File: {activity.currentCoding.file}
                  </p>
                </div>
              )}

              {activity.currentGame && (
                <div className="p-3.5 rounded-xl bg-warm-subtle border border-warm-border">
                  <span className="text-warm-muted uppercase font-mono text-[10px] block mb-1">
                    Game Session
                  </span>
                  <p className="font-semibold text-warm-text">
                    {activity.currentGame.title} ({activity.currentGame.platform || 'PC'})
                  </p>
                </div>
              )}

              <p className="text-[11px] text-warm-muted leading-relaxed">
                Notice: Private documents, browsing history, form inputs, and system passwords are never collected or transmitted. Only approved foreground activities are broadcasted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
