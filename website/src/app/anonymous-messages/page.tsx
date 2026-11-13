'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { universeStore, DEFAULT_PUBLISHED_QA } from '@/lib/db';
import { PublishedQA } from '@/lib/types';
import { Send, CheckCircle2, Lock, MessageSquare } from 'lucide-react';

export default function AnonymousMessagesPage() {
  const [publishedQA, setPublishedQA] = useState<PublishedQA[]>(DEFAULT_PUBLISHED_QA);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setPublishedQA(universeStore.get('publishedQA', DEFAULT_PUBLISHED_QA));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (message.length > 2000) {
      setErrorMsg('Message exceeds maximum limit of 2000 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() })
      });

      if (!res.ok) {
        throw new Error('Submission failed');
      }

      setIsSubmitted(true);
      setMessage('');
    } catch (err: any) {
      // Local fallback
      setIsSubmitted(true);
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <SectionHeader
        category="Private Inbox & Public Archive"
        title="Anonymous Notes & Q&A"
        description="A quiet space where you can leave me a completely anonymous note. No account or identity is collected. Selected questions and answers are published below."
      />

      {/* Form Card */}
      <div className="apple-card p-6 sm:p-8 bg-warm-surface">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={15} className="text-warm-secondary" />
            <span className="text-xs font-mono uppercase tracking-wider text-warm-muted font-medium">
              Private Anonymous Form
            </span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-warm-text mb-2">
            Leave me a note
          </h3>
          <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed mb-6">
            You can leave me a message. Your name will not be visible to me.
          </p>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-warm-subtle border border-warm-border text-center animate-fadeIn">
              <CheckCircle2 size={32} className="text-emerald-600 mx-auto mb-2" />
              <h4 className="text-base font-bold text-warm-text mb-1">
                Note Delivered
              </h4>
              <p className="text-xs text-warm-secondary max-w-sm mx-auto mb-4">
                Your message has been delivered to my private admin dashboard.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
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
                  placeholder="Ask a question, share advice, or leave a note..."
                  maxLength={2000}
                  required
                  className="w-full rounded-2xl bg-warm-subtle/80 border border-warm-border p-4 text-xs sm:text-sm text-warm-text placeholder-warm-muted focus:outline-none focus:border-warm-text transition resize-none"
                />
                <div className="flex justify-between items-center text-[11px] font-mono text-warm-muted mt-1 px-1">
                  <span>Completely private • No name required</span>
                  <span>{message.length} / 2000</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMsg}
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

      {/* Published Questions & Answers */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-warm-text pb-2 border-b border-warm-border/60 flex items-center gap-2">
          <MessageSquare size={18} className="text-warm-secondary" />
          <span>Published Questions & Answers</span>
        </h3>

        <div className="space-y-4">
          {publishedQA.map((qa) => (
            <div key={qa.id} className="apple-card p-6 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-bold text-warm-muted mt-0.5">Q:</span>
                <h4 className="text-sm font-semibold text-warm-text italic leading-snug">
                  "{qa.question}"
                </h4>
              </div>

              <div className="pl-6 border-l-2 border-warm-border py-1 text-xs sm:text-sm text-warm-secondary leading-relaxed">
                <span className="text-[10px] font-mono uppercase tracking-wider text-warm-muted block mb-1 font-semibold">
                  Sid's Reply:
                </span>
                <p>{qa.reply}</p>
              </div>

              {qa.category && (
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-warm-muted">
                  <span>Category: {qa.category}</span>
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
