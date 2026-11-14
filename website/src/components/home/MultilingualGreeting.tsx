'use client';

import React, { useEffect, useState } from 'react';
import { GreetingLanguage } from '@/lib/types';
import { DEFAULT_GREETINGS } from '@/lib/db';

interface Props {
  greetings?: GreetingLanguage[];
  intervalMs?: number;
  paused?: boolean;
}

export default function MultilingualGreeting({
  greetings = DEFAULT_GREETINGS,
  intervalMs = 3000,
  paused = false
}: Props) {
  const activeGreetings = greetings.filter((g) => g.enabled);
  const list = activeGreetings.length > 0 ? activeGreetings : DEFAULT_GREETINGS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (paused || list.length <= 1) return;

    const timer = setInterval(() => {
      setFadeState('out');

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % list.length);
        setFadeState('in');
      }, 300);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [paused, list.length, intervalMs]);

  const current = list[currentIndex] || list[0];

  return (
    <div className="h-12 sm:h-14 flex items-center justify-center overflow-hidden text-center">
      <div
        className={`transition-all duration-300 ease-out transform ${
          fadeState === 'in'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-1.5'
        }`}
      >
        <span className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-warm-text font-sans">
          {current.greeting}.
        </span>
      </div>
    </div>
  );
}
