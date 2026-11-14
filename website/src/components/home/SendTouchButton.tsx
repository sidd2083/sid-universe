'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Check } from 'lucide-react';

const TOUCH_EMOJIS = [
  { emoji: '👋', label: 'Wave' },
  { emoji: '⚡', label: 'Vibe' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '☕', label: 'Cheers' }
];

export function SendTouchButton() {
  const [selectedEmoji, setSelectedEmoji] = useState('👋');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [visitorName, setVisitorName] = useState('');

  const sendTouch = async (emojiToSend = selectedEmoji) => {
    if (isSending) return;
    setIsSending(true);

    try {
      const res = await fetch('/api/touch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emoji: emojiToSend,
          senderName: visitorName.trim() || 'Visitor from Web',
          message: 'Sent a live touch from the website'
        })
      });

      if (res.ok) {
        setSentSuccess(true);
        setShowPicker(false);
        setTimeout(() => setSentSuccess(false), 3500);
      }
    } catch (err) {
      console.warn('Touch transmit notice:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Main Trigger Button */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-warm-surface border border-warm-border/80 shadow-apple-sm transition hover:shadow-apple-md hover:border-warm-muted/60">
        <button
          onClick={() => sendTouch(selectedEmoji)}
          disabled={isSending || sentSuccess}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
            sentSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-warm-text text-white hover:bg-black active:scale-95'
          }`}
          title="Send a live notification to Sid's Windows Companion App"
        >
          {sentSuccess ? (
            <>
              <Check size={13} className="animate-bounce" />
              <span>Sent to Sid's PC!</span>
            </>
          ) : (
            <>
              <span className="text-sm">{selectedEmoji}</span>
              <span>Send a Touch to Sid</span>
            </>
          )}
        </button>

        {/* Emoji Selector Pill */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-1.5 rounded-full text-warm-secondary hover:text-warm-text hover:bg-warm-subtle transition"
          title="Choose reaction emoji"
        >
          <Sparkles size={13} className="text-amber-600" />
        </button>
      </div>

      {/* Floating Emoji Picker Popover */}
      {showPicker && (
        <div className="absolute left-0 mt-2 z-50 p-3 rounded-2xl bg-warm-surface border border-warm-border shadow-apple-lg w-64 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-[10px] font-mono uppercase tracking-wider text-warm-muted font-bold block">
            Choose Your Vibe
          </span>

          <div className="flex items-center justify-between gap-1">
            {TOUCH_EMOJIS.map((item) => (
              <button
                key={item.emoji}
                onClick={() => {
                  setSelectedEmoji(item.emoji);
                  sendTouch(item.emoji);
                }}
                className={`p-2 rounded-xl text-lg hover:scale-125 transition ${
                  selectedEmoji === item.emoji ? 'bg-warm-subtle scale-110' : 'hover:bg-warm-subtle'
                }`}
                title={item.label}
              >
                {item.emoji}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-warm-border/60">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="w-full text-[11px] px-2.5 py-1.5 rounded-lg bg-warm-subtle border border-warm-border text-warm-text placeholder:text-warm-muted"
            />
          </div>
        </div>
      )}
    </div>
  );
}
