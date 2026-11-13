'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_GAMES } from '@/lib/db';
import { Game } from '@/lib/types';
import { Gamepad2, Trophy, Clock, Heart } from 'lucide-react';

export default function GamingPage() {
  const [games, setGames] = useState<Game[]>(DEFAULT_GAMES);

  useEffect(() => {
    setGames(universeStore.get('games', DEFAULT_GAMES));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <SectionHeader
        category="Free Time & Play"
        title="Gaming"
        description="Games I love playing with friends, open-world adventures, and memorable gaming sessions."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="apple-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-warm-muted mb-3">
                <span className="px-2 py-0.5 rounded-md bg-warm-subtle text-warm-text font-medium">
                  {game.platform}
                </span>
                {game.hoursPlayed && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>{game.hoursPlayed}h</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-warm-text mb-2">
                {game.title}
              </h3>
              <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed mb-4">
                {game.description}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-warm-border/60 text-xs">
              {game.achievements && (
                <div>
                  <span className="font-semibold text-warm-text block text-[11px] font-mono uppercase mb-0.5">
                    Highlights:
                  </span>
                  <p className="text-warm-secondary leading-snug">{game.achievements}</p>
                </div>
              )}

              {game.memories && (
                <div className="p-3 rounded-xl bg-warm-subtle/80 text-warm-muted italic text-[11px] leading-relaxed">
                  "{game.memories}"
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
