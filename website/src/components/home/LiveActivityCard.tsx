'use client';

import React from 'react';
import { Gamepad2, Tv, Code2, Sparkles, Clock, Music, Globe } from 'lucide-react';
import { PublicActivity } from '@/lib/types';

interface Props {
  activity: PublicActivity;
}

export default function LiveActivityCard({ activity }: Props) {
  const isOnline = activity.isOnline;

  // Determine icon & clean human sentence
  let icon = <Sparkles size={16} className="text-warm-amber" />;
  let actionText = activity.siddhantAction || 'Siddhant is currently exploring ideas';

  const appNameLower = (activity.appName || '').toLowerCase();
  const appDetailsLower = (activity.appDetails || '').toLowerCase();
  const actionLower = (activity.siddhantAction || '').toLowerCase();

  if (appNameLower.includes('gta') || appNameLower.includes('grand theft auto')) {
    icon = <Gamepad2 size={16} className="text-emerald-600" />;
    actionText = 'Siddhant is currently playing Grand Theft Auto V';
  } else if (appNameLower.includes('minecraft')) {
    icon = <Gamepad2 size={16} className="text-emerald-600" />;
    actionText = 'Siddhant is currently playing Minecraft';
  } else if (appNameLower.includes('human')) {
    icon = <Gamepad2 size={16} className="text-emerald-600" />;
    actionText = 'Siddhant is currently playing Human: Fall Flat';
  } else if (appNameLower.includes('youtube') || appDetailsLower.includes('youtube') || actionLower.includes('watching youtube')) {
    icon = <Tv size={16} className="text-red-500" />;
    actionText = activity.siddhantAction || (activity.appDetails
      ? `Siddhant is currently watching YouTube: "${activity.appDetails.replace(/^Watching:\s*/i, '')}"`
      : 'Siddhant is currently watching YouTube');
  } else if (appNameLower.includes('code') || appNameLower.includes('visual studio')) {
    icon = <Code2 size={16} className="text-sky-600" />;
    actionText = activity.siddhantAction || 'Siddhant is currently coding StudentHub Nepal';
  } else if (appNameLower.includes('spotify') || appDetailsLower.includes('spotify')) {
    icon = <Music size={16} className="text-amber-600" />;
    actionText = activity.siddhantAction || (activity.appDetails
      ? `Siddhant is currently listening to ${activity.appDetails}`
      : 'Siddhant is currently listening to music');
  } else if (appNameLower.includes('chrome') || actionLower.includes('browsing') || actionLower.includes('github') || actionLower.includes('studenthub')) {
    icon = <Globe size={16} className="text-blue-600" />;
    actionText = activity.siddhantAction || (activity.appDetails
      ? `Siddhant is currently browsing "${activity.appDetails}"`
      : 'Siddhant is currently browsing the web');
  } else if (!isOnline) {
    actionText = 'Siddhant is currently offline';
  }

  return (
    <div className="w-full max-w-xl mx-auto rounded-full bg-warm-surface/95 hover:bg-warm-surface border border-warm-border/90 px-5 py-3 text-center flex flex-col sm:flex-row items-center justify-between gap-3 shadow-apple-sm hover:shadow-apple-md transition duration-300">
      <div className="flex items-center gap-3 min-w-0">
        {/* Status dot & icon */}
        <div className="relative shrink-0 flex items-center">
          <span
            className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 ring-2 ring-warm-surface ${
              isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-warm-muted'
            }`}
          />
          <div className="w-7 h-7 rounded-full bg-warm-subtle/80 border border-warm-border/80 flex items-center justify-center shrink-0">
            {icon}
          </div>
        </div>

        {/* Action sentence */}
        <p className="text-xs sm:text-sm font-semibold text-warm-text leading-snug truncate text-center sm:text-left">
          {actionText}
        </p>
      </div>

      {/* Elapsed badge */}
      {activity.durationMinutes && isOnline && (
        <span className="text-[10px] font-mono font-medium text-warm-secondary bg-warm-subtle/80 px-2.5 py-1 rounded-full border border-warm-border/60 shrink-0 flex items-center gap-1">
          <Clock size={10} className="text-warm-muted" />
          <span>Active for {activity.durationMinutes}m</span>
        </span>
      )}
    </div>
  );
}
