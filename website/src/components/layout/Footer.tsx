'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { universeStore, DEFAULT_SETTINGS } from '@/lib/db';
import { SiteSettings } from '@/lib/types';
import {
  DiscordIcon,
  YouTubeIcon,
  SteamIcon,
  SnapchatIcon,
  FacebookIcon,
  GitHubIcon
} from '@/components/ui/SocialIcons';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(universeStore.get('siteSettings', DEFAULT_SETTINGS));
    function handleUpdate(e: any) {
      if (e.detail?.key === 'siteSettings') setSettings(e.detail.value);
    }
    window.addEventListener('sid_store_updated', handleUpdate);
    return () => window.removeEventListener('sid_store_updated', handleUpdate);
  }, []);

  const socials = settings.socialLinks || DEFAULT_SETTINGS.socialLinks;
  const currentYear = new Date().getFullYear();
  const rawFooter = settings.footerQuote || DEFAULT_SETTINGS.footerQuote;
  const quoteText: string = typeof rawFooter === 'object' && rawFooter !== null
    ? rawFooter.quote
    : (typeof rawFooter === 'string' ? rawFooter : "In the midst of winter, I found there was, within me, an invincible summer.");
  const authorText: string = typeof rawFooter === 'object' && rawFooter !== null
    ? rawFooter.author
    : "Albert Camus";

  return (
    <footer className="w-full border-t border-warm-border/70 bg-warm-bg mt-24 py-16 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Philosophical Quote */}
        <div className="max-w-2xl">
          <blockquote className="font-serif italic text-lg sm:text-xl text-warm-text leading-relaxed">
            "{quoteText}"
          </blockquote>
          <cite className="block text-xs font-mono text-warm-muted uppercase tracking-wider not-italic mt-2">
            — {authorText}
          </cite>
        </div>

        {/* Social Links Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {socials.discord && (
            <a
              href={socials.discord}
              target="_blank"
              rel="noopener noreferrer"
              title="Discord"
            >
              <DiscordIcon size={18} />
            </a>
          )}
          {socials.steam && (
            <a
              href={socials.steam}
              target="_blank"
              rel="noopener noreferrer"
              title="Steam"
            >
              <SteamIcon size={18} />
            </a>
          )}
          {socials.youtube && (
            <a
              href={socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
            >
              <YouTubeIcon size={18} />
            </a>
          )}
          {socials.snapchat && (
            <a
              href={socials.snapchat}
              target="_blank"
              rel="noopener noreferrer"
              title="Snapchat"
            >
              <SnapchatIcon size={18} />
            </a>
          )}
          {socials.facebook && (
            <a
              href={socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <FacebookIcon size={18} />
            </a>
          )}
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <GitHubIcon size={18} />
            </a>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-warm-border/60" />

        {/* Bottom Metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-warm-secondary">
          <div className="flex items-center gap-2">
            <span className="font-bold text-warm-text tracking-tight">SID</span>
            <span className="text-warm-muted">•</span>
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-warm-muted" />
              <span>Hetauda, Nepal</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-warm-muted">
            <Link href="/admin/login" className="hover:text-warm-text transition">
              Admin Portal
            </Link>
            <span>•</span>
            <span>© {currentYear} Sid. All personal rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
