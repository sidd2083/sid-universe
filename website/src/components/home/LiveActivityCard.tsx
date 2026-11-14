'use client';

import React from 'react';
import { Gamepad2, Tv, Code2, Sparkles, Clock, Music } from 'lucide-react';
import { PublicActivity } from '@/lib/types';

interface Props {
  activity: PublicActivity;
}

export default function LiveActivityCard({ activity }: Props) {
  const isOnline = activity.isOnline;

  // Determine icon & clean human sentence
  let icon = <Sparkles size={16} className="text-warm-amber" />;
  let actionText = activity.siddhantAction || 'Siddhant is currently exploring ideas';

  if (activity.appName?.toLowerCase().includes('gta') || activity.appName?.toLowerCase().includes('grand theft auto')) {
    icon = <Gamepad2 size={18} className="text-emerald-600" />;
    actionText = 'Siddhant is currently playing Grand Theft Auto V';
  } else if (activity.appName?.toLowerCase().includes('minecraft')) {
    icon = <Gamepad2 size={18} className="text-emerald-600" />;
    actionText = 'Siddhant is currently playing Minecraft';
  } else if (activity.appName?.toLowerCase().includes('human')) {
    icon = <Gamepad2 size={18} className="text-emerald-600" />;
    actionText = 'Siddhant is currently playing Human: Fall Flat';
  } else if (activity.appName?.toLowerCase().includes('youtube') || activity.appDetails?.toLowerCase().includes('youtube')) {
    icon = <Tv size={18} className="text-red-500" />;
    actionText = activity.appDetails
      ? `Siddhant is currently watching YouTube: "${activity.appDetails.replace(/^Watching:\s*/i, '')}"`
      : 'Siddhant is currently watching YouTube';
  } else if (activity.appName?.toLowerCase().includes('code') || activity.appName?.toLowerCase().includes('visual studio')) {
    icon = <Code2 size={18} className="text-sky-600" />;
    actionText = 'Siddhant is currently coding StudentHub Nepal';
  } else if (activity.appName?.toLowerCase().includes('spotify') || activity.appDetails?.toLowerCase().includes('spotify')) {
    icon = <Music size={18} className="text-amber-600" />;
    actionText = activity.appDetails
      ? `Siddhant is currently listening to ${activity.appDetails}`
      : 'Siddhant is currently listening to music';
  } else if (!isOnline) {
    actionText = 'Siddhant is currently offline';
  }

  return (
    <div className="w-full max-w-xl mx-auto apple-card p-4 sm:p-5 text-center flex flex-col sm:flex-row items-center justify-center gap-3 transition shadow-apple-sm">
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-warm-muted'
          }`}
        />
        <div className="w-7 h-7 rounded-xl bg-warm-subtle border border-warm-border flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>

      <div className="text-center sm:text-left min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-warm-text leading-snug line-clamp-2">
          {actionText}
        </p>
        {activity.durationMinutes && isOnline && (
          <span className="text-[11px] font-mono text-warm-muted flex items-center justify-center sm:justify-start gap-1 mt-0.5">
            <Clock size={10} />
            <span>Active for {activity.durationMinutes}m</span>
          </span>
        )}
      </div>
    </div>
  );
}
