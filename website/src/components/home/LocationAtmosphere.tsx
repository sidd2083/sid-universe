'use client';

import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Sun,
  Moon,
  CloudRain,
  Cloud,
  Sunrise,
  Sunset,
  Wind,
  Droplets,
  Lamp
} from 'lucide-react';
import { WeatherInfo } from '@/lib/types';

interface Props {
  weather: WeatherInfo | null;
}

export default function LocationAtmosphere({ weather }: Props) {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('day');
  const [nepalHour, setNepalHour] = useState<number>(12);

  useEffect(() => {
    function calculateTimeOfDay() {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const nepalOffsetMs = (5 * 60 + 45) * 60000;
      const nepalDate = new Date(utc + nepalOffsetMs);
      const hour = nepalDate.getHours();
      setNepalHour(hour);

      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning');
        document.documentElement.classList.remove('atmosphere-night');
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay('day');
        document.documentElement.classList.remove('atmosphere-night');
      } else if (hour >= 17 && hour < 20) {
        setTimeOfDay('evening');
        document.documentElement.classList.remove('atmosphere-night');
      } else {
        setTimeOfDay('night');
        document.documentElement.classList.add('atmosphere-night');
      }
    }

    calculateTimeOfDay();
    const interval = setInterval(calculateTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, []);

  const isNight = timeOfDay === 'night';
  const isRain = weather?.rain || false;

  return (
    <div
      className={`apple-card p-5 sm:p-6 transition-all duration-700 relative overflow-hidden ${
        isRain ? 'subtle-rain-indicator' : ''
      } ${isNight ? 'lamp-glow' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Location & Atmosphere Label */}
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${
              isNight
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                : timeOfDay === 'evening'
                ? 'bg-amber-100/70 border-amber-300 text-amber-600'
                : 'bg-warm-subtle border-warm-border text-warm-text'
            }`}
          >
            {isRain ? (
              <CloudRain size={20} className="text-sky-500" />
            ) : isNight ? (
              <Moon size={20} />
            ) : timeOfDay === 'morning' ? (
              <Sunrise size={20} className="text-amber-500" />
            ) : (
              <Sun size={20} className="text-amber-500" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-warm-muted">
                Local Atmosphere
              </span>
              {/* Cozy Night Desk Lamp Indicator */}
              {isNight && (
                <span
                  title="Nighttime in Hetauda — Desk lamp illuminated"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono text-amber-400 font-medium"
                >
                  <Lamp size={11} className="animate-pulse" />
                  <span>Night Lamp On</span>
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-warm-text tracking-tight mt-0.5">
              Hetauda, Nepal
            </h3>
            <p className="text-xs text-warm-secondary mt-0.5">
              {weather
                ? `${weather.condition} · ${weather.temperature}°C`
                : 'Mild atmosphere in the valley'}
            </p>
          </div>
        </div>

        {/* Right: Environmental Metrics */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-warm-secondary">
          {weather?.humidity !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-subtle/80 border border-warm-border">
              <Droplets size={13} className="text-warm-muted" />
              <span>Humidity {weather.humidity}%</span>
            </div>
          )}

          {weather?.windSpeed !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-subtle/80 border border-warm-border">
              <Wind size={13} className="text-warm-muted" />
              <span>{weather.windSpeed} km/h</span>
            </div>
          )}

          {weather?.sunset && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-subtle/80 border border-warm-border">
              {isNight ? (
                <>
                  <Sunrise size={13} className="text-warm-muted" />
                  <span>Sunrise ~{weather.sunrise || '06:15'}</span>
                </>
              ) : (
                <>
                  <Sunset size={13} className="text-warm-muted" />
                  <span>Sunset ~{weather.sunset || '17:45'}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
