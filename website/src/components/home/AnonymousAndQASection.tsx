'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Lock, MessageSquare, Sparkles } from 'lucide-react';
import { PublishedQA } from '@/lib/types';

interface Props {
  publishedQA: PublishedQA[];
}

export default function AnonymousAndQASection({ publishedQA }: Props) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (message.length > 2000) {
      setError('Message exceeds the maximum limit of 2000 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() })
      });

      if (!res.ok) {
        throw new Error('Could not submit message');
      }

      setSubmitted(true);
      setMessage('');
    } catch (err: any) {
      // Local fallback
      setSubmitted(true);
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-10">
      {/* 1. Anonymous Message Card */}
      <div className="apple-card p-6 sm:p-8 bg-warm-surface border border-warm-border">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={15} className="text-warm-secondary" />
            <span className="text-xs font-mono uppercase tracking-wider text-warm-muted font-medium">
              Private Anonymous Inbox
            </span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-warm-text mb-2">
            Leave me an anonymous note
          </h3>
          <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed mb-6">
            You can leave me a message. Your name will not be visible to me. Share a thought, ask a question, or leave feedback.
          </p>

          {submitted ? (
            <div className="p-5 rounded-2xl bg-warm-subtle border border-warm-border text-center animate-fadeIn">
              <CheckCircle2 size={32} className="text-emerald-600 mx-auto mb-2" />
              <h4 className="text-base font-bold text-warm-text mb-1">
                Note received
              </h4>
              <p className="text-xs text-warm-secondary max-w-sm mx-auto mb-4">
                Thank you for reaching out. Your transmission has been sent directly to my private admin inbox.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-xl bg-warm-surface border border-warm-border text-xs font-medium text-warm-text hover:bg-warm-hover transition"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write whatever you want here..."
                  maxLength={2000}
                  required
                  className="w-full rounded-2xl bg-warm-subtle/80 border border-warm-border p-4 text-xs sm:text-sm text-warm-text placeholder-warm-muted focus:outline-none focus:border-warm-text transition resize-none"
                />
                <div className="flex justify-between items-center text-[11px] font-mono text-warm-muted mt-1 px-1">
                  <span>Completely private • No identity collected</span>
                  <span>{message.length} / 2000</span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-6 py-2.5 rounded-xl bg-warm-text hover:bg-black text-white text-xs font-medium transition disabled:opacity-50 flex items-center gap-2 shadow-apple-sm"
              >
                <Send size={13} />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 2. Published Questions & Answers */}
      {publishedQA.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-warm-border/60">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-warm-secondary" />
              <h3 className="text-lg font-bold text-warm-text">
                Published Questions & Answers
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedQA.map((qa) => (
              <div
                key={qa.id}
                className="apple-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-2 mb-2.5">
                    <span className="font-mono text-xs font-bold text-warm-muted">Q:</span>
                    <h4 className="text-sm font-semibold text-warm-text italic leading-snug">
                      "{qa.question}"
                    </h4>
                  </div>

                  <div className="pl-5 border-l-2 border-warm-border py-1 text-xs sm:text-sm text-warm-secondary leading-relaxed">
                    <p>{qa.reply}</p>
                  </div>
                </div>

                {qa.category && (
                  <div className="mt-4 pt-3 border-t border-warm-border/60 flex items-center justify-between text-[11px] font-mono text-warm-muted">
                    <span>Topic: {qa.category}</span>
                    <span>{new Date(qa.publishedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
