'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  MapPin,
  CloudSun,
  CloudRain,
  Moon,
  Sun
} from 'lucide-react';
import {
  DiscordIcon,
  YouTubeIcon,
  SteamIcon,
  SnapchatIcon,
  FacebookIcon,
  GitHubIcon
} from '@/components/ui/SocialIcons';
import { universeStore, DEFAULT_SETTINGS } from '@/lib/db';
import { SiteSettings, WeatherInfo } from '@/lib/types';

export default function Header() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSettings(universeStore.get('siteSettings', DEFAULT_SETTINGS));

    function handleStoreUpdate(e: any) {
      if (e.detail?.key === 'siteSettings') {
        setSettings(e.detail.value);
      }
    }

    window.addEventListener('sid_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('sid_store_updated', handleStoreUpdate);
  }, []);

  // Fetch live Hetauda weather
  useEffect(() => {
    fetch('/api/weather')
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch(() => {});
  }, []);

  const socials = settings?.socialLinks || DEFAULT_SETTINGS.socialLinks;

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/portfolio' },
    { label: 'Learning', href: '/learning' },
    { label: 'Interests', href: '/gaming' },
    { label: 'Q&A', href: '/anonymous-messages' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-warm-bg/90 backdrop-blur-md border-b border-warm-border/70 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Authentic SID Brand Monogram & Wordmark */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-warm-surface border border-warm-border shadow-apple-sm flex items-center justify-center text-warm-text group-hover:border-warm-text/40 group-hover:scale-105 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2" opacity="0.6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-warm-text group-hover:text-black transition-colors leading-none">
              SID
            </span>
            <span className="text-[10px] text-warm-muted font-mono tracking-wider uppercase leading-none mt-1">
              Universe
            </span>
          </div>
        </Link>

        {/* Center / Right: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-warm-surface/80 px-3 py-1.5 rounded-full border border-warm-border/80 shadow-apple-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-warm-text text-white'
                    : 'text-warm-secondary hover:text-warm-text hover:bg-warm-hover'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Weather Pill & Socials */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Subtle Live Hetauda Atmosphere pill */}
          {weather && (
            <div
              title={`Hetauda: ${weather.condition}, ${weather.temperature}°C`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warm-surface border border-warm-border text-[11px] font-medium text-warm-secondary shadow-apple-sm"
            >
              <MapPin size={11} className="text-warm-muted" />
              <span>Hetauda</span>
              <span className="text-warm-text font-semibold">{weather.temperature}°C</span>
              {weather.rain ? (
                <CloudRain size={12} className="text-sky-500" />
              ) : weather.isDay ? (
                <Sun size={12} className="text-amber-500" />
              ) : (
                <Moon size={12} className="text-amber-400" />
              )}
            </div>
          )}

          {/* Authentic Real Brand Social Icons */}
          <div className="flex items-center gap-1">
            {socials.discord && (
              <a
                href={socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                title="Discord"
                className="w-8 h-8 rounded-full flex items-center justify-center text-warm-secondary hover:text-[#5865F2] hover:bg-warm-surface transition-all duration-200"
              >
                <DiscordIcon size={16} />
              </a>
            )}
            {socials.steam && (
              <a
                href={socials.steam}
                target="_blank"
                rel="noopener noreferrer"
                title="Steam"
                className="w-8 h-8 rounded-full flex items-center justify-center text-warm-secondary hover:text-[#171A21] hover:bg-warm-surface transition-all duration-200"
              >
                <SteamIcon size={16} />
              </a>
            )}
            {socials.youtube && (
              <a
                href={socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="w-8 h-8 rounded-full flex items-center justify-center text-warm-secondary hover:text-[#FF0000] hover:bg-warm-surface transition-all duration-200"
              >
                <YouTubeIcon size={16} />
              </a>
            )}
            {socials.snapchat && (
              <a
                href={socials.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                title="Snapchat"
                className="w-8 h-8 rounded-full flex items-center justify-center text-warm-secondary hover:text-amber-500 hover:bg-warm-surface transition-all duration-200"
              >
                <SnapchatIcon size={16} />
              </a>
            )}
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-8 h-8 rounded-full flex items-center justify-center text-warm-secondary hover:text-[#1877F2] hover:bg-warm-surface transition-all duration-200"
              >
                <FacebookIcon size={16} />
              </a>
            )}
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="w-8 h-8 rounded-full flex items-center justify-center text-warm-secondary hover:text-warm-text hover:bg-warm-surface transition-all duration-200"
              >
                <GitHubIcon size={16} />
              </a>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-warm-secondary hover:text-warm-text hover:bg-warm-surface border border-warm-border/60 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 bg-warm-surface border-b border-warm-border space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-warm-secondary hover:text-warm-text hover:bg-warm-subtle"
            >
              {link.label}
            </Link>
          ))}
          {weather && (
            <div className="pt-2 border-t border-warm-border/60 flex items-center justify-between text-xs text-warm-secondary px-3">
              <span>Hetauda, Nepal</span>
              <span className="font-semibold text-warm-text">
                {weather.condition} · {weather.temperature}°C
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
