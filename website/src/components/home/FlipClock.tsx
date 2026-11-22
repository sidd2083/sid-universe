'use client';

import React, { useEffect, useState } from 'react';

interface Props {
  format?: '12h' | '24h';
}

interface FlipCardProps {
  value: string;
  label?: string;
}

function FlipUnit({ value }: FlipCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flip-clock-unit w-16 sm:w-24 md:w-28 h-20 sm:h-28 md:h-32">
        <div className="flip-clock-divider" />
        <span className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-warm-text select-none">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function FlipClock({ format = '12h' }: Props) {
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [ampm, setAmpm] = useState('PM');
  const [formattedDate, setFormattedDate] = useState('');
  const [dayName, setDayName] = useState('');

  useEffect(() => {
    function updateNepalTime() {
      const now = new Date();
      // UTC + 5:45 (Nepal Standard Time)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const nepalOffsetMs = (5 * 60 + 45) * 60000;
      const nepalTime = new Date(utc + nepalOffsetMs);

      let h = nepalTime.getHours();
      const m = nepalTime.getMinutes();
      const s = nepalTime.getSeconds();

      if (format === '12h') {
        setAmpm(h >= 12 ? 'PM' : 'AM');
        h = h % 12 || 12;
      }

      setHours(h < 10 ? `0${h}` : `${h}`);
      setMinutes(m < 10 ? `0${m}` : `${m}`);
      setSeconds(s < 10 ? `0${s}` : `${s}`);

      setDayName(
        nepalTime.toLocaleDateString('en-US', { weekday: 'long' })
      );
      setFormattedDate(
        nepalTime.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      );
    }

    updateNepalTime();
    const interval = setInterval(updateNepalTime, 1000);
    return () => clearInterval(interval);
  }, [format]);

  return (
    <div className="flex flex-col items-start sm:items-center">
      {/* Clock Units */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <FlipUnit value={hours} />
        <span className="text-2xl sm:text-4xl text-warm-border font-bold -mt-2">:</span>
        <FlipUnit value={minutes} />
        <span className="text-2xl sm:text-4xl text-warm-border font-bold -mt-2">:</span>
        <FlipUnit value={seconds} />

        {format === '12h' && (
          <div className="flex flex-col items-center self-start mt-2 sm:mt-4">
            <span className="px-2 sm:px-2.5 py-1 rounded-md bg-warm-subtle border border-warm-border text-[11px] sm:text-xs font-mono font-semibold text-warm-secondary uppercase tracking-wider">
              {ampm}
            </span>
          </div>
        )}
      </div>

      {/* Date & Location Label */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-warm-secondary font-sans">
        <span className="font-semibold text-warm-text">{dayName}</span>
        <span className="text-warm-muted">•</span>
        <span>{formattedDate}</span>
        <span className="text-warm-muted">•</span>
        <span className="font-mono text-xs text-warm-muted">Hetauda, Nepal (UTC+05:45)</span>
      </div>
    </div>
  );
}
