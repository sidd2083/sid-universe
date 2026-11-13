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
  Sun,
  Disc as DiscordIcon,
  Youtube,
  Facebook
} from 'lucide-react';
import { universeStore, DEFAULT_SETTINGS } from '@/lib/db';
import { SiteSettings, WeatherInfo } from '@/lib/types';

// Custom clean SVG icons for platforms where Lucide doesn't have standard shapes
function SnapchatIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.164 2c-3.924 0-6.175 2.766-6.175 5.568 0 1.258.468 2.502.946 3.42.183.35.342.637.342.844 0 .227-.197.472-.497.669-.607.399-1.503.744-2.522.973-.424.095-.668.324-.668.623 0 .373.342.668.966.821 1.487.367 2.128 1.155 2.583 2.168.109.243.208.472.338.679-.315.657-.887 1.408-2.008 1.765-.365.116-.583.33-.583.582 0 .426.474.721 1.229.771.829.055 1.758-.158 2.688-.616.486-.239.914-.388 1.341-.388.358 0 .668.109 1.043.346 1.05.666 2.195 1.002 3.42 1.002 1.218 0 2.37-.336 3.42-1.002.375-.237.685-.346 1.043-.346.427 0 .855.149 1.341.388.93.458 1.859.671 2.688.616.755-.05 1.229-.345 1.229-.771 0-.252-.218-.466-.583-.582-1.121-.357-1.693-1.108-2.008-1.765.13-.207.229-.436.338-.679.455-1.013 1.096-1.801 2.583-2.168.624-.153.966-.448.966-.821 0-.299-.244-.528-.668-.623-1.019-.229-1.915-.574-2.522-.973-.3-.197-.497-.442-.497-.669 0-.207.159-.494.342-.844.478-.918.946-2.162.946-3.42C18.339 4.766 16.088 2 12.164 2z" />
    </svg>
  );
}

function SteamIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-10 10c0 4.67 3.2 8.59 7.54 9.69l3.22-4.63a3.3 3.3 0 0 1-.76-2.06c0-1.84 1.5-3.33 3.33-3.33s3.33 1.5 3.33 3.33-1.5 3.34-3.33 3.34c-.26 0-.52-.03-.76-.09l-3.32 4.77A10 10 0 1 0 12 2zm3.33 11a2.33 2.33 0 1 0 0 4.67 2.33 2.33 0 0 0 0-4.67zm-7.6 5.86l2.36-3.39a3.3 3.3 0 0 1 1.4.37l-2.03 2.92a2.35 2.35 0 0 1-1.73.1z" />
    </svg>
  );
}

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
        {/* Left: Minimal Wordmark */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-warm-text group-hover:scale-125 transition-transform" />
          <span className="font-semibold text-base sm:text-lg tracking-tight text-warm-text">
            SID
          </span>
          <span className="text-xs text-warm-muted font-normal hidden sm:inline">
            / universe
          </span>
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

          {/* Social Icons */}
          <div className="hidden sm:flex items-center gap-1 text-warm-secondary">
            {socials.discord && (
              <a
                href={socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                title="Discord"
                className="p-1.5 rounded-lg hover:bg-warm-surface hover:text-warm-text transition"
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
                className="p-1.5 rounded-lg hover:bg-warm-surface hover:text-warm-text transition"
              >
                <SteamIcon className="w-4 h-4" />
              </a>
            )}
            {socials.youtube && (
              <a
                href={socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="p-1.5 rounded-lg hover:bg-warm-surface hover:text-warm-text transition"
              >
                <Youtube size={16} />
              </a>
            )}
            {socials.snapchat && (
              <a
                href={socials.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                title="Snapchat"
                className="p-1.5 rounded-lg hover:bg-warm-surface hover:text-warm-text transition"
              >
                <SnapchatIcon className="w-4 h-4" />
              </a>
            )}
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="p-1.5 rounded-lg hover:bg-warm-surface hover:text-warm-text transition"
              >
                <Facebook size={16} />
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
