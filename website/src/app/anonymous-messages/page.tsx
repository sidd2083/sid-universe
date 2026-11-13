'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_PUBLISHED_QA } from '@/lib/db';
import { PublishedQA, AnonymousMessage } from '@/lib/types';
import { Send, CheckCircle2, ShieldAlert, Sparkles, MessageSquare, Lock, HeartHandshake } from 'lucide-react';
import { cosmicSounds } from '@/lib/soundEffects';

export default function AnonymousMessagesPage() {
  const [publishedQA, setPublishedQA] = useState<PublishedQA[]>(DEFAULT_PUBLISHED_QA);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setPublishedQA(universeStore.get('publishedQA', DEFAULT_PUBLISHED_QA));

    function handleStoreUpdate(e: any) {
      if (e.detail?.key === 'publishedQA') {
        setPublishedQA(e.detail.value);
      }
    }

    window.addEventListener('sid_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('sid_store_updated', handleStoreUpdate);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (message.length > 2000) {
      setErrorMsg('Transmission exceeds max length of 2000 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // POST to /api/messages with server-side validation & rate-limiting
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Transmission failed');
      }

      // Also store in local fallback store for local demo / offline preview
      const currentMessages = universeStore.get<AnonymousMessage[]>('anonymousMessages', []);
      const newMsg: AnonymousMessage = {
        id: `msg-${Date.now()}`,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        isRead: false,
        isPublished: false
      };
      universeStore.set('anonymousMessages', [newMsg, ...currentMessages]);

      cosmicSounds.playChime(660, 0.25, 'sine');
      setIsSubmitted(true);
      setMessage('');
    } catch (err: any) {
      // Fallback local save if offline
      const currentMessages = universeStore.get<AnonymousMessage[]>('anonymousMessages', []);
      const newMsg: AnonymousMessage = {
        id: `msg-${Date.now()}`,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        isRead: false,
        isPublished: false
      };
      universeStore.set('anonymousMessages', [newMsg, ...currentMessages]);
      setIsSubmitted(true);
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        planetName="WHISPER"
        sector="Sector 06: Transmission Frequencies"
        planetColor="#38bdf8"
        title="Cosmic Frequency & Anonymous Inquiries"
        description="An ethereal sphere where you can transmit completely anonymous messages, questions, or notes into space. No accounts, no identity collection. Selected transmissions are published below."
      />

      {/* Submission Form Card */}
      <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 border border-sky-500/30 mb-16 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <Lock size={15} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Transmit an Anonymous Message
            </h3>
            <p className="text-xs text-slate-400">
              Your identity is never collected or visible. Ask anything, share thoughts, or drop feedback.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-6 rounded-xl bg-sky-950/40 border border-sky-500/40 text-center animate-fadeIn">
            <CheckCircle2 size={36} className="text-sky-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white mb-1">
              Transmission Received!
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto mb-4">
              Your message has reached Sid's private inbox. If selected and answered, it will appear publicly below.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-4 py-2 rounded-xl bg-space-900 border border-space-border hover:border-sky-400 text-xs font-mono text-sky-300 transition"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your anonymous question, thought, or message here..."
                maxLength={2000}
                required
                className="w-full rounded-xl bg-space-950/80 border border-space-border p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 transition resize-none"
              />
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 mt-1">
                <span>Completely anonymous • No account required</span>
                <span>{message.length} / 2000 chars</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <Send size={13} />
              <span>{isSubmitting ? 'Transmitting...' : 'Send Anonymous Message'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Published Questions & Sid's Replies */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={18} className="text-sky-400" />
          <h2 className="text-xl font-bold text-white">
            Published Cosmic Transmissions & Answers
          </h2>
        </div>

        <div className="space-y-6">
          {publishedQA.map((qa) => (
            <div
              key={qa.id}
              className="glass-panel rounded-2xl p-6 border border-sky-500/20 hover:border-sky-500/40 transition shadow-lg"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="w-6 h-6 rounded-full bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400 text-xs font-mono font-bold shrink-0">
                  Q
                </span>
                <div className="text-sm font-semibold text-white italic">
                  "{qa.question}"
                </div>
              </div>

              <div className="pl-9 pt-2 border-l-2 border-sky-500/30 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-sky-400 uppercase tracking-wider font-bold mb-1">
                  <span>Sid's Answer:</span>
                </div>
                {qa.reply}
              </div>

              {qa.category && (
                <div className="mt-4 pt-3 border-t border-space-border/50 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Topic: {qa.category}</span>
                  <span>{new Date(qa.publishedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
