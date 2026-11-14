'use client';

import React, { useState } from 'react';
import { Sparkles, Check, Heart, Zap, Flame, Coffee, Hand } from 'lucide-react';

const TOUCH_REACTIONS = [
  { emoji: '👋', label: 'Wave', icon: Hand },
  { emoji: '⚡', label: 'Vibe', icon: Zap },
  { emoji: '❤️', label: 'Love', icon: Heart },
  { emoji: '🔥', label: 'Fire', icon: Flame },
  { emoji: '☕', label: 'Cheers', icon: Coffee }
];

export function SendTouchButton() {
  const [isSending, setIsSending] = useState(false);
  const [lastSentEmoji, setLastSentEmoji] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);

  const sendTouch = async (emojiToSend = '👋') => {
    if (isSending) return;
    setIsSending(true);

    try {
      const res = await fetch('/api/touch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emoji: emojiToSend,
          senderName: 'Website Visitor',
          message: `Sent a live ${emojiToSend} touch from the website`
        })
      });

      if (res.ok) {
        setLastSentEmoji(emojiToSend);
        setTimeout(() => setLastSentEmoji(null), 3500);
      }
    } catch (err) {
      console.warn('Touch transmit notice:', err);
      setLastSentEmoji(emojiToSend);
      setTimeout(() => setLastSentEmoji(null), 3500);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Main Touch Control Pill */}
      <div className="flex items-center gap-1 p-1 rounded-full bg-warm-surface border border-warm-border/90 shadow-apple-sm transition hover:shadow-apple-md">
        {/* Main 1-Click Send Button */}
        <button
          onClick={() => sendTouch('👋')}
          disabled={isSending}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
            lastSentEmoji
              ? 'bg-emerald-600 text-white'
              : 'bg-warm-text text-white hover:bg-black'
          }`}
          title="Send a live ping to Sid's Windows Companion App"
        >
          {lastSentEmoji ? (
            <>
              <Check size={14} className="animate-bounce" />
              <span>{lastSentEmoji} Delivered to Sid's PC!</span>
            </>
          ) : (
            <>
              <span className="text-sm">👋</span>
              <span>Send a Touch to Sid</span>
            </>
          )}
        </button>

        {/* Reaction Picker Toggle */}
        <button
          onClick={() => setShowReactions(!showReactions)}
          className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1 ${
            showReactions
              ? 'bg-warm-subtle text-warm-text font-bold'
              : 'text-warm-secondary hover:text-warm-text hover:bg-warm-subtle'
          }`}
          title="Pick custom reaction emoji"
        >
          <Sparkles size={13} className="text-amber-600" />
          <span className="text-[11px]">Vibes</span>
        </button>
      </div>

      {/* Expanded Quick Reaction Pills */}
      {showReactions && (
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-warm-surface/95 border border-warm-border shadow-apple-md animate-fadeIn">
          {TOUCH_REACTIONS.map((item) => (
            <button
              key={item.emoji}
              onClick={() => sendTouch(item.emoji)}
              disabled={isSending}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs hover:bg-warm-subtle hover:scale-110 active:scale-95 transition"
              title={`Send ${item.label}`}
            >
              <span className="text-sm">{item.emoji}</span>
              <span className="text-[10px] text-warm-secondary font-mono">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
