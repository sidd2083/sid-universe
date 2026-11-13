'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_GAMES, DEFAULT_ACTIVITY } from '@/lib/db';
import { Game, PublicActivity } from '@/lib/types';
import { Gamepad2, Trophy, Clock, Heart, Monitor, Sparkles } from 'lucide-react';

export default function GamingPage() {
  const [games, setGames] = useState<Game[]>(DEFAULT_GAMES);
  const [activity, setActivity] = useState<PublicActivity>(universeStore.get('publicActivity', DEFAULT_ACTIVITY));

  useEffect(() => {
    setGames(universeStore.get('games', DEFAULT_GAMES));
    setActivity(universeStore.get('publicActivity', DEFAULT_ACTIVITY));

    function handleStoreUpdate(e: any) {
      if (e.detail?.key === 'publicActivity') {
        setActivity(e.detail.value);
      }
      if (e.detail?.key === 'games') {
        setGames(e.detail.value);
      }
    }

    window.addEventListener('sid_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('sid_store_updated', handleStoreUpdate);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        planetName="ARENA"
        sector="Sector 04: The Gaming Realm"
        planetColor="#10b981"
        title="Gaming Sanctum & Telemetry"
        description="The proving ground showcasing favorite competitive and narrative games, memories, achievements, and real-time gaming telemetry."
      />

      {/* Live Gaming Telemetry Card (Sid Companion sync) */}
      <div className="glass-panel-glow rounded-2xl p-6 border border-emerald-500/40 mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Gamepad2 size={24} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${activity.currentGame ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  {activity.currentGame ? 'Active Game Detected via Sid Companion' : 'No Game Currently Running'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {activity.currentGame ? activity.currentGame.title : 'Station Idle — In Code or Offline'}
              </h3>
            </div>
          </div>

          {activity.currentGame && (
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
              {activity.currentGame.category || 'Live Session'}
            </span>
          )}
        </div>
      </div>

      {/* Hall of Favorite Games Grid */}
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Trophy size={20} className="text-emerald-400" />
        <span>Curated Hall of Games</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {games.map((game) => (
          <div
            key={game.id}
            className="glass-panel rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
          >
            <div>
              {/* Game Cover Banner */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/30 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-space-950/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-semibold">
                  {game.platform} • {game.genre}
                </span>
                {game.hoursPlayed && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-space-950/80 backdrop-blur-md border border-space-border text-[10px] font-mono text-slate-300 flex items-center gap-1">
                    <Clock size={11} className="text-emerald-400" />
                    <span>{game.hoursPlayed} hrs</span>
                  </span>
                )}
              </div>

              {/* Game Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {game.description}
                </p>

                {/* Achievements */}
                {game.achievements && (
                  <div className="p-3 rounded-xl bg-space-950/60 border border-space-border/80 text-xs text-slate-300 mb-3 leading-relaxed">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1 flex items-center gap-1">
                      <Trophy size={11} />
                      <span>Key Achievements</span>
                    </span>
                    {game.achievements}
                  </div>
                )}

                {/* Gaming Memories */}
                {game.memories && (
                  <div className="p-3 rounded-xl bg-space-950/60 border border-space-border/80 text-xs text-slate-300 leading-relaxed">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                      <Heart size={11} className="text-rose-400" />
                      <span>Favorite Memory</span>
                    </span>
                    {game.memories}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
