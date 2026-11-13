'use client';

import React, { useEffect, useState } from 'react';
import { Gamepad2, Music, Code2, Sparkles, Clock, Wifi, WifiOff } from 'lucide-react';
import { universeStore, DEFAULT_ACTIVITY } from '@/lib/db';
import { PublicActivity } from '@/lib/types';

export default function LiveActivityBar() {
  const [activity, setActivity] = useState<PublicActivity>(universeStore.get('publicActivity', DEFAULT_ACTIVITY));

  useEffect(() => {
    setActivity(universeStore.get('publicActivity', DEFAULT_ACTIVITY));

    function handleStoreUpdate(e: any) {
      if (e.detail?.key === 'publicActivity') {
        setActivity(e.detail.value);
      }
    }

    window.addEventListener('sid_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('sid_store_updated', handleStoreUpdate);
  }, []);

  const hasActivity = activity.currentGame || activity.currentMusic || activity.currentCoding || activity.customStatus;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-6">
      <div className="glass-panel-glow rounded-xl p-3.5 sm:p-4 border border-space-border/80 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Live status label */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-space-900 border border-space-border">
            <span className={`w-2 h-2 rounded-full ${activity.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-300">
              {activity.isOnline ? 'Live Activity' : 'Station Idle'}
            </span>
          </div>

          {activity.customStatus && (
            <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-medium truncate max-w-xs">
              <Sparkles size={14} className="text-yellow-400 shrink-0" />
              <span className="truncate">{activity.customStatus}</span>
            </div>
          )}
        </div>

        {/* Center / Right: Live Streams */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full md:w-auto justify-start md:justify-end text-xs">
          {activity.currentGame && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
              <Gamepad2 size={14} className="text-emerald-400 shrink-0" />
              <span className="font-semibold">{activity.currentGame.title}</span>
              {activity.currentGame.category && (
                <span className="text-[10px] text-emerald-400/70 font-mono hidden sm:inline">
                  ({activity.currentGame.category})
                </span>
              )}
            </div>
          )}

          {activity.currentMusic && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-300">
              <Music size={14} className="text-purple-400 shrink-0" />
              <span className="font-semibold truncate max-w-[140px] sm:max-w-[180px]">
                {activity.currentMusic.title}
              </span>
              <span className="text-[10px] text-purple-400/70 truncate max-w-[90px]">
                • {activity.currentMusic.artist}
              </span>
            </div>
          )}

          {activity.currentCoding && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-300">
              <Code2 size={14} className="text-blue-400 shrink-0" />
              <span className="font-semibold">{activity.currentCoding.project}</span>
              <span className="text-[10px] text-blue-400/70 font-mono hidden sm:inline">
                [{activity.currentCoding.file}]
              </span>
            </div>
          )}

          {!hasActivity && (
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock size={13} className="text-slate-500" />
              <span>Offline or in stealth mode</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
