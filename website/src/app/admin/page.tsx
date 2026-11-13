'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Orbit,
  FolderKanban,
  Activity,
  MessageSquare,
  Palette,
  Cpu,
  BarChart3,
  Settings,
  Download,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  LogOut,
  Send,
  ExternalLink
} from 'lucide-react';
import {
  universeStore,
  DEFAULT_SETTINGS,
  DEFAULT_PROJECTS,
  DEFAULT_LEARNING,
  DEFAULT_GAMES,
  DEFAULT_SONGS,
  DEFAULT_WATCHLIST,
  DEFAULT_PUBLISHED_QA,
  DEFAULT_ACTIVITY
} from '@/lib/db';
import { INITIAL_PLANETS } from '@/lib/planetsData';
import {
  SiteSettings,
  PlanetConfig,
  Project,
  LearningTopic,
  Game,
  Song,
  WatchlistItem,
  AnonymousMessage,
  PublishedQA,
  PublicActivity
} from '@/lib/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [savedSuccess, setSavedSuccess] = useState<string>('');

  // Local state copies from store
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [planets, setPlanets] = useState<PlanetConfig[]>(INITIAL_PLANETS);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [learning, setLearning] = useState<LearningTopic[]>(DEFAULT_LEARNING);
  const [games, setGames] = useState<Game[]>(DEFAULT_GAMES);
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(DEFAULT_WATCHLIST);
  const [messages, setMessages] = useState<AnonymousMessage[]>([]);
  const [publishedQA, setPublishedQA] = useState<PublishedQA[]>(DEFAULT_PUBLISHED_QA);
  const [activity, setActivity] = useState<PublicActivity>(DEFAULT_ACTIVITY);

  // Modal / Editing sub-state
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Check auth session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authSession = sessionStorage.getItem('sid_admin_session');
      if (!authSession) {
        router.push('/admin/login');
      }
    }
  }, [router]);

  // Load data from store
  useEffect(() => {
    setSettings(universeStore.get('siteSettings', DEFAULT_SETTINGS));
    setPlanets(universeStore.get('planets', INITIAL_PLANETS));
    setProjects(universeStore.get('projects', DEFAULT_PROJECTS));
    setLearning(universeStore.get('learningTopics', DEFAULT_LEARNING));
    setGames(universeStore.get('games', DEFAULT_GAMES));
    setSongs(universeStore.get('songs', DEFAULT_SONGS));
    setWatchlist(universeStore.get('watchlist', DEFAULT_WATCHLIST));
    setMessages(universeStore.get('anonymousMessages', []));
    setPublishedQA(universeStore.get('publishedQA', DEFAULT_PUBLISHED_QA));
    setActivity(universeStore.get('publicActivity', DEFAULT_ACTIVITY));
  }, []);

  const triggerSaveNotification = (msg: string) => {
    setSavedSuccess(msg);
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sid_admin_session');
    }
    router.push('/admin/login');
  };

  // 1. Save Profile & Settings
  const saveProfileSettings = () => {
    universeStore.set('siteSettings', settings);
    triggerSaveNotification('Profile and site settings saved successfully!');
  };

  // 2. Planet Management Actions
  const updatePlanet = (id: string, updates: Partial<PlanetConfig>) => {
    const updated = planets.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setPlanets(updated);
    universeStore.set('planets', updated);
    triggerSaveNotification('Planet orbit parameters updated!');
  };

  // 3. Activity Management Actions
  const saveActivitySettings = (newActivity: PublicActivity) => {
    setActivity(newActivity);
    universeStore.set('publicActivity', newActivity);
    triggerSaveNotification('Live activity settings updated!');
  };

  // 4. Anonymous Message Moderation Actions
  const handleReplyAndPublish = (msg: AnonymousMessage) => {
    if (!replyText.trim()) return;

    // 1. Update message as replied and published
    const updatedMessages = messages.map((m) =>
      m.id === msg.id ? { ...m, reply: replyText.trim(), isPublished: true, isRead: true } : m
    );
    setMessages(updatedMessages);
    universeStore.set('anonymousMessages', updatedMessages);

    // 2. Add to public Q&A
    const newQA: PublishedQA = {
      id: `qa-${Date.now()}`,
      messageId: msg.id,
      question: msg.message,
      reply: replyText.trim(),
      publishedAt: new Date().toISOString(),
      category: 'General'
    };
    const updatedQA = [newQA, ...publishedQA];
    setPublishedQA(updatedQA);
    universeStore.set('publishedQA', updatedQA);

    setEditingReplyId(null);
    setReplyText('');
    triggerSaveNotification('Message answered and published publicly!');
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      const updated = messages.filter((m) => m.id !== id);
      setMessages(updated);
      universeStore.set('anonymousMessages', updated);
      triggerSaveNotification('Message deleted from inbox.');
    }
  };

  const handleDeleteQA = (id: string) => {
    if (confirm('Unpublish and delete this Q&A entry?')) {
      const updated = publishedQA.filter((q) => q.id !== id);
      setPublishedQA(updated);
      universeStore.set('publishedQA', updated);
      triggerSaveNotification('Q&A unpublished.');
    }
  };

  // 5. Content Management: Projects Actions
  const deleteProject = (id: string) => {
    if (confirm('Delete this project?')) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      universeStore.set('projects', updated);
      triggerSaveNotification('Project deleted.');
    }
  };

  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'New Celestial Project',
      description: 'A newly forged system in the cosmos.',
      category: 'Full-Stack',
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      technologies: ['Next.js', 'TypeScript', 'Tailwind'],
      status: 'Currently Building',
      featured: true,
      order: projects.length + 1
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    universeStore.set('projects', updated);
    triggerSaveNotification('New project added to Forge!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-space-border/60 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-wide">
              MASTER CONTROL CONSOLE
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time management for all sectors, celestial bodies, telemetry, and content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/sid/sid-universe/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 hover:bg-cyan-900/60 text-xs font-mono font-medium transition"
          >
            <Download size={14} />
            <span>Download Sid Companion (.exe)</span>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-space-900 border border-space-border text-slate-300 hover:text-red-400 hover:border-red-500/40 text-xs font-mono transition"
          >
            <LogOut size={14} />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="p-3 mb-6 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <Check size={16} />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Dashboard Layout: Left Nav Tabs & Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'profile', label: 'Profile & Identity', icon: User },
            { id: 'planets', label: 'Planets Management', icon: Orbit },
            { id: 'projects', label: 'Projects (Forge)', icon: FolderKanban },
            { id: 'activity', label: 'Live Telemetry & Activity', icon: Activity },
            { id: 'messages', label: 'Anonymous Inbox & Q&A', icon: MessageSquare },
            { id: 'integrations', label: 'Companion & Integrations', icon: Cpu },
            { id: 'appearance', label: 'Appearance & Themes', icon: Palette },
            { id: 'analytics', label: 'Analytics & Traffic', icon: BarChart3 },
            { id: 'settings', label: 'General Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono transition text-left ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-white hover:bg-space-900 border border-transparent'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
                <span>{tab.label}</span>
                {tab.id === 'messages' && messages.filter((m) => !m.isRead).length > 0 && (
                  <span className="ml-auto px-1.5 py-0.2 rounded-full bg-cyan-500 text-[10px] text-space-950 font-bold">
                    {messages.filter((m) => !m.isRead).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-9">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel rounded-2xl p-5 border border-space-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Cosmic Status
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-lg font-bold text-white">System Operational</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 mt-2 block">
                    7 Planets Revolve
                  </span>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-space-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Unread Transmissions
                  </span>
                  <div className="text-2xl font-bold text-white font-mono">
                    {messages.filter((m) => !m.isRead).length}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                    Total messages: {messages.length}
                  </span>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-space-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Companion Telemetry
                  </span>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${activity.isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    <span>{activity.isOnline ? 'Active Daemon' : 'Standby'}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                    {activity.currentGame?.title || activity.currentMusic?.title || 'No active app'}
                  </span>
                </div>
              </div>

              {/* Quick Jump Shortcuts */}
              <div className="glass-panel rounded-2xl p-6 border border-space-border">
                <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-bold mb-4">
                  Quick Management Shortcuts
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={() => setActiveTab('profile')} className="p-3 rounded-xl bg-space-900 border border-space-border hover:border-cyan-400/50 text-xs text-left">
                    <User size={16} className="text-cyan-400 mb-1" />
                    <div className="font-bold text-white">Edit Bio & Tags</div>
                  </button>
                  <button onClick={() => setActiveTab('projects')} className="p-3 rounded-xl bg-space-900 border border-space-border hover:border-cyan-400/50 text-xs text-left">
                    <FolderKanban size={16} className="text-cyan-400 mb-1" />
                    <div className="font-bold text-white">Add New Project</div>
                  </button>
                  <button onClick={() => setActiveTab('messages')} className="p-3 rounded-xl bg-space-900 border border-space-border hover:border-cyan-400/50 text-xs text-left">
                    <MessageSquare size={16} className="text-cyan-400 mb-1" />
                    <div className="font-bold text-white">Answer Messages</div>
                  </button>
                  <button onClick={() => setActiveTab('activity')} className="p-3 rounded-xl bg-space-900 border border-space-border hover:border-cyan-400/50 text-xs text-left">
                    <Activity size={16} className="text-cyan-400 mb-1" />
                    <div className="font-bold text-white">Override Status</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROFILE & IDENTITY TAB */}
          {activeTab === 'profile' && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-space-border space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User size={18} className="text-cyan-400" />
                <span>Central Core Profile & Social Accounts</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Site Title
                  </label>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                    className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    value={settings.profileImage}
                    onChange={(e) => setSettings({ ...settings, profileImage: e.target.value })}
                    className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Biography (Chronicle Planet)
                  </label>
                  <textarea
                    rows={4}
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    className="w-full bg-space-950 border border-space-border rounded-xl p-3 text-xs text-white resize-none"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-space-border/60">
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-4">
                  Social Network Channels
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Discord URL</label>
                    <input
                      type="text"
                      value={settings.socialLinks.discord || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, discord: e.target.value }
                        })
                      }
                      className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Steam URL</label>
                    <input
                      type="text"
                      value={settings.socialLinks.steam || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, steam: e.target.value }
                        })
                      }
                      className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">YouTube Channel URL</label>
                    <input
                      type="text"
                      value={settings.socialLinks.youtube || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                        })
                      }
                      className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Snapchat URL</label>
                    <input
                      type="text"
                      value={settings.socialLinks.snapchat || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, snapchat: e.target.value }
                        })
                      }
                      className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={saveProfileSettings}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Save size={14} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          )}

          {/* 3. PLANETS MANAGEMENT TAB */}
          {activeTab === 'planets' && (
            <div className="glass-panel rounded-2xl p-6 border border-space-border space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Orbit size={18} className="text-cyan-400" />
                <span>Planetary Physics & Visual Customization</span>
              </h2>

              <div className="space-y-4">
                {planets.map((planet) => (
                  <div
                    key={planet.id}
                    className="p-4 rounded-xl bg-space-950/80 border border-space-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border shrink-0"
                        style={{ backgroundColor: `${planet.color}40`, borderColor: planet.color }}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Planet {planet.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">
                          {planet.sector} • Route: {planet.path}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Orbit Radius</span>
                        <input
                          type="number"
                          step="0.2"
                          value={planet.orbitRadius}
                          onChange={(e) => updatePlanet(planet.id, { orbitRadius: parseFloat(e.target.value) })}
                          className="w-16 bg-space-900 border border-space-border px-2 py-1 rounded text-white"
                        />
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[10px]">Orbit Speed</span>
                        <input
                          type="number"
                          step="0.001"
                          value={planet.orbitSpeed}
                          onChange={(e) => updatePlanet(planet.id, { orbitSpeed: parseFloat(e.target.value) })}
                          className="w-20 bg-space-900 border border-space-border px-2 py-1 rounded text-white"
                        />
                      </div>

                      <button
                        onClick={() => updatePlanet(planet.id, { visible: !planet.visible })}
                        className={`p-2 rounded-lg border text-xs ${
                          planet.visible ? 'border-cyan-500/40 text-cyan-300' : 'border-slate-700 text-slate-500'
                        }`}
                        title="Toggle Visibility"
                      >
                        {planet.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PROJECTS TAB (Forge) */}
          {activeTab === 'projects' && (
            <div className="glass-panel rounded-2xl p-6 border border-space-border space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderKanban size={18} className="text-cyan-400" />
                  <span>Portfolio Creations Management</span>
                </h2>
                <button
                  onClick={addProject}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Plus size={14} />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-space-950/80 border border-space-border flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-space-border">
                        <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-white truncate">
                          {proj.title}
                        </h4>
                        <span className="text-[11px] font-mono text-cyan-400">
                          {proj.category} • {proj.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-2 rounded-lg bg-space-900 border border-space-border text-slate-400 hover:text-red-400 transition"
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. LIVE TELEMETRY & ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-space-border space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-cyan-400" />
                <span>Live Activity & Companion Override</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Custom Status
                  </label>
                  <input
                    type="text"
                    value={activity.customStatus || ''}
                    onChange={(e) => setActivity({ ...activity, customStatus: e.target.value })}
                    className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Online Presence Indicator
                  </label>
                  <select
                    value={activity.isOnline ? 'online' : 'offline'}
                    onChange={(e) => setActivity({ ...activity, isOnline: e.target.value === 'online' })}
                    className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="online">Online (Beacon Pulsing)</option>
                    <option value="offline">Offline (Standby)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Manual Active Game Override
                  </label>
                  <input
                    type="text"
                    value={activity.currentGame?.title || ''}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        currentGame: e.target.value
                          ? { title: e.target.value, detectedAt: new Date().toISOString() }
                          : null
                      })
                    }
                    placeholder="e.g. Counter-Strike 2 or Cyberpunk 2077"
                    className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                onClick={() => saveActivitySettings(activity)}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center gap-2"
              >
                <Save size={14} />
                <span>Save Telemetry Overrides</span>
              </button>
            </div>
          )}

          {/* 6. ANONYMOUS INBOX & Q&A TAB */}
          {activeTab === 'messages' && (
            <div className="glass-panel rounded-2xl p-6 border border-space-border space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare size={18} className="text-cyan-400" />
                <span>Private Anonymous Inbox & Public Q&A Moderation</span>
              </h2>

              {/* Private Incoming Messages */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Incoming Anonymous Submissions ({messages.length})
                </h3>

                {messages.length === 0 ? (
                  <div className="p-6 rounded-xl bg-space-950/60 border border-space-border text-center text-xs text-slate-500">
                    No anonymous transmissions received yet.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-xl bg-space-950/80 border border-space-border space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="text-xs text-white font-medium leading-relaxed italic">
                          "{msg.message}"
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>

                      {editingReplyId === msg.id ? (
                        <div className="space-y-2 pt-2 border-t border-space-border/60">
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your public answer..."
                            className="w-full bg-space-900 border border-space-border rounded-xl p-3 text-xs text-white resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReplyAndPublish(msg)}
                              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-mono text-white flex items-center gap-1.5"
                            >
                              <Send size={12} />
                              <span>Answer & Publish to Planet Whisper</span>
                            </button>
                            <button
                              onClick={() => setEditingReplyId(null)}
                              className="px-3 py-1.5 rounded-lg bg-space-900 border border-space-border text-xs font-mono text-slate-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-2 border-t border-space-border/60">
                          <button
                            onClick={() => {
                              setEditingReplyId(msg.id);
                              setReplyText('');
                            }}
                            className="px-3 py-1 rounded-lg bg-space-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950 text-xs font-mono flex items-center gap-1.5"
                          >
                            <Edit size={12} />
                            <span>Reply & Publish</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1.5 rounded-lg bg-space-900 border border-space-border text-slate-400 hover:text-red-400"
                            title="Delete Message"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Published Q&A moderation */}
              <div className="pt-6 border-t border-space-border/60 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Currently Published Q&A on Planet Whisper ({publishedQA.length})
                </h3>

                {publishedQA.map((qa) => (
                  <div
                    key={qa.id}
                    className="p-4 rounded-xl bg-space-950/60 border border-space-border flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs text-slate-300 font-medium italic mb-1">
                        Q: "{qa.question}"
                      </div>
                      <div className="text-xs text-cyan-300 pl-3 border-l border-cyan-500/40">
                        A: {qa.reply}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteQA(qa.id)}
                      className="p-1.5 rounded-lg bg-space-900 border border-space-border text-slate-400 hover:text-red-400 shrink-0"
                      title="Unpublish"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. COMPANION & INTEGRATIONS TAB */}
          {activeTab === 'integrations' && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-space-border space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu size={18} className="text-cyan-400" />
                <span>Sid Companion & Secret Telemetry Tokens</span>
              </h2>

              <div className="p-4 rounded-xl bg-space-950/80 border border-space-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 uppercase font-bold">
                    Sid Companion Telemetry Token
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={settings.companionToken || DEFAULT_SETTINGS.companionToken}
                    className="w-full bg-space-900 border border-space-border rounded-xl px-3 py-2 text-xs font-mono text-cyan-300"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(settings.companionToken);
                      triggerSaveNotification('Token copied to clipboard!');
                    }}
                    className="px-3 py-2 rounded-xl bg-space-900 border border-space-border text-xs font-mono text-slate-300 hover:text-white"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Paste this token into Sid Companion on your Windows machine to authenticate heartbeats, running games, and media.
                </p>
              </div>

              {/* Official Download Deliverable */}
              <div className="p-5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Download Windows Companion Application
                  </h4>
                  <p className="text-xs text-slate-300">
                    Builds automatically via GitHub Actions as <code>Sid-Companion-Setup.exe</code>.
                  </p>
                </div>
                <a
                  href="https://github.com/sid/sid-universe/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center gap-2 shrink-0"
                >
                  <Download size={14} />
                  <span>Download .EXE</span>
                </a>
              </div>
            </div>
          )}

          {/* 8. APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="glass-panel rounded-2xl p-6 border border-space-border space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Palette size={18} className="text-cyan-400" />
                <span>Cosmic Appearance & Lighting</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-space-950 border border-space-border">
                  <div>
                    <strong className="text-white block">Deep Cosmic Theme</strong>
                    <span className="text-slate-400 text-[11px]">Near-black & deep navy space aesthetic</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-[10px]">
                    Enabled
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-space-950 border border-space-border">
                  <div>
                    <strong className="text-white block">Starfield Density</strong>
                    <span className="text-slate-400 text-[11px]">1800 multi-depth twinkling celestial particles</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-space-900 border border-space-border text-slate-300 font-mono text-[10px]">
                    Optimal 60 FPS
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 9. ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="glass-panel rounded-2xl p-6 border border-space-border space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-cyan-400" />
                <span>Cosmic Traffic & Planetary Telemetry</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-space-950 border border-space-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Total Sector Visits
                  </span>
                  <div className="text-2xl font-bold text-white font-mono">1,428</div>
                </div>
                <div className="p-4 rounded-xl bg-space-950 border border-space-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Most Visited Sector
                  </span>
                  <div className="text-sm font-bold text-cyan-400 font-mono">Planet FORGE</div>
                </div>
                <div className="p-4 rounded-xl bg-space-950 border border-space-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Visitor Origins
                  </span>
                  <div className="text-sm font-bold text-white font-mono">Nepal, US, EU</div>
                </div>
              </div>
            </div>
          )}

          {/* 10. GENERAL SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-space-border space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings size={18} className="text-cyan-400" />
                <span>General Spacecraft Configuration</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-mono uppercase mb-1">
                    Local Timezone Specification
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="Asia/Kathmandu (NPT, UTC+5:45)"
                    className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-mono uppercase mb-1">
                    Database Provider
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="Firebase Cloud Firestore & Local Unified Store"
                    className="w-full bg-space-950 border border-space-border rounded-xl px-3 py-2 text-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
