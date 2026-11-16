'use client';

import React from 'react';
import { Radio, ExternalLink } from 'lucide-react';

interface LiveStreamBannerProps {
  url?: string;
  title?: string;
}

export function LiveStreamBanner({ url, title }: LiveStreamBannerProps) {
  if (!url || !url.trim()) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-500 p-3.5 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <Radio size={20} className="text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-100 font-bold">
                LIVE NOW
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white truncate">
              {title || 'Streaming right now, come watch!'}
            </p>
          </div>
        </div>
        <div className="shrink-0 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-1.5 group-hover:bg-white/30 transition">
          <span>Watch</span>
          <ExternalLink size={12} />
        </div>
      </div>
    </a>
  );
}
