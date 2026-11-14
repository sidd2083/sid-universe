'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Languages,
  Clock,
  Activity,
  FolderKanban,
  BookOpen,
  Gamepad2,
  Music,
  Film,
  MessageSquare,
  Cpu,
  Settings,
  LogOut,
  Save,
  Plus,
  Trash2,
  Check,
  Edit,
  Send,
  Eye,
  EyeOff,
  Copy,
  Volume2,
  Play,
  Pause,
  Upload,
  FileAudio
} from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  universeStore,
  DEFAULT_SETTINGS,
  DEFAULT_PROJECTS,
  DEFAULT_LEARNING,
  DEFAULT_GAMES,
  DEFAULT_SONGS,
  DEFAULT_WATCHLIST,
  DEFAULT_PUBLISHED_QA,
  DEFAULT_ACTIVITY,
  DEFAULT_GREETINGS
} from '@/lib/db';
import {
  SiteSettings,
  Project,
  LearningTopic,
  Game,
  Song,
  WatchlistItem,
  AnonymousMessage,
  PublishedQA,
  PublicActivity,
  GreetingLanguage
} from '@/lib/types';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [notification, setNotification] = useState<string>('');

  // State
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [learning, setLearning] = useState<LearningTopic[]>(DEFAULT_LEARNING);
  const [games, setGames] = useState<Game[]>(DEFAULT_GAMES);
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(DEFAULT_WATCHLIST);
  const [messages, setMessages] = useState<AnonymousMessage[]>([]);
  const [publishedQA, setPublishedQA] = useState<PublishedQA[]>(DEFAULT_PUBLISHED_QA);
  const [activity, setActivity] = useState<PublicActivity>(DEFAULT_ACTIVITY);

  // Moderation state
  const [replyMessageId, setReplyMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Authentication check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('sid_admin_session');
      if (!session) {
        router.push('/admin/login');
      }
    }
  }, [router]);

  // Load from store
  useEffect(() => {
    setSettings(universeStore.get('siteSettings', DEFAULT_SETTINGS));
    setProjects(universeStore.get('projects', DEFAULT_PROJECTS));
    setLearning(universeStore.get('learningTopics', DEFAULT_LEARNING));
    setGames(universeStore.get('games', DEFAULT_GAMES));
    setSongs(universeStore.get('songs', DEFAULT_SONGS));
    setWatchlist(universeStore.get('watchlist', DEFAULT_WATCHLIST));
    setMessages(universeStore.get('anonymousMessages', []));
    setPublishedQA(universeStore.get('publishedQA', DEFAULT_PUBLISHED_QA));
    setActivity(universeStore.get('publicActivity', DEFAULT_ACTIVITY));
  }, []);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sid_admin_session');
    }
    router.push('/admin/login');
  };

  // 1. Save Settings & Profile
  const saveProfileSettings = () => {
    universeStore.set('siteSettings', settings);
    notify('Profile & settings saved successfully.');
  };

  // 2. Greetings Management
  const toggleGreeting = (id: string) => {
    const updated = (settings.greetings || DEFAULT_GREETINGS).map((g) =>
      g.id === id ? { ...g, enabled: !g.enabled } : g
    );
    const newSettings = { ...settings, greetings: updated };
    setSettings(newSettings);
    universeStore.set('siteSettings', newSettings);
    notify('Greeting language updated.');
  };

  // 3. Activity overrides
  const saveActivity = (newAct: PublicActivity) => {
    setActivity(newAct);
    universeStore.set('publicActivity', newAct);
    notify('Live activity status updated.');
  };

  // 4. Anonymous Message Reply & Publish
  const handlePublishReply = (msg: AnonymousMessage) => {
    if (!replyText.trim()) return;

    // Update message
    const updatedMsgs = messages.map((m) =>
      m.id === msg.id ? { ...m, reply: replyText.trim(), isPublished: true, isRead: true } : m
    );
    setMessages(updatedMsgs);
    universeStore.set('anonymousMessages', updatedMsgs);

    // Add to published Q&A
    const newQA: PublishedQA = {
      id: `qa-${Date.now()}`,
      messageId: msg.id,
      question: msg.message,
      reply: replyText.trim(),
      publishedAt: new Date().toISOString(),
      category: msg.category || 'General'
    };
    const updatedQA = [newQA, ...publishedQA];
    setPublishedQA(updatedQA);
    universeStore.set('publishedQA', updatedQA);

    setReplyMessageId(null);
    setReplyText('');
    notify('Answer published to public Q&A.');
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm('Delete this message permanently?')) {
      const updated = messages.filter((m) => m.id !== id);
      setMessages(updated);
      universeStore.set('anonymousMessages', updated);
      notify('Message deleted.');
    }
  };

  const handleDeleteQA = (id: string) => {
    if (confirm('Unpublish and delete this Q&A entry?')) {
      const updated = publishedQA.filter((q) => q.id !== id);
      setPublishedQA(updated);
      universeStore.set('publishedQA', updated);
      notify('Q&A unpublished.');
    }
  };

  // 5. Projects CRUD
  const handleAddProject = () => {
    const newP: Project = {
      id: `proj-${Date.now()}`,
      title: 'New Project Title',
      description: 'Short description of what was built or planned.',
      category: 'Full-Stack',
      coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      status: 'Currently Building',
      featured: true,
      order: projects.length + 1
    };
    const updated = [newP, ...projects];
    setProjects(updated);
    universeStore.set('projects', updated);
    notify('New project added.');
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Delete this project?')) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      universeStore.set('projects', updated);
      notify('Project deleted.');
    }
  };

  // 6. Learning CRUD
  const handleAddLearning = (categoryType: 'currently-learning' | 'want-to-learn') => {
    const newL: LearningTopic = {
      id: `learn-${Date.now()}`,
      title: categoryType === 'currently-learning' ? 'New Learning Topic' : 'New Topic to Explore',
      categoryType,
      category: 'Programming',
      description: 'What I am studying and practicing.',
      resources: [],
      status: categoryType === 'currently-learning' ? 'In Progress' : 'Queued',
      progress: categoryType === 'currently-learning' ? 10 : undefined,
      featured: true,
      order: learning.length + 1
    };
    const updated = [...learning, newL];
    setLearning(updated);
    universeStore.set('learningTopics', updated);
    notify('New learning topic added.');
  };

  const handleDeleteLearning = (id: string) => {
    if (confirm('Delete this learning topic?')) {
      const updated = learning.filter((l) => l.id !== id);
      setLearning(updated);
      universeStore.set('learningTopics', updated);
      notify('Learning topic deleted.');
    }
  };

  // 7. Games CRUD
  const handleAddGame = () => {
    const newGame: Game = {
      id: `game-${Date.now()}`,
      title: 'New Game Title',
      platform: 'PC',
      genre: 'Action Adventure',
      description: 'Why I play it and what makes it special.',
      hoursPlayed: 10,
      memories: 'Memorable moment playing with friends.',
      isCurrentlyPlaying: true,
      order: games.length + 1
    };
    const updated = [newGame, ...games];
    setGames(updated);
    universeStore.set('games', updated);
    notify('New game added.');
  };

  const handleUpdateGame = (id: string, updates: Partial<Game>) => {
    const updated = games.map((g) => (g.id === id ? { ...g, ...updates } : g));
    setGames(updated);
    universeStore.set('games', updated);
    notify('Game updated.');
  };

  const handleDeleteGame = (id: string) => {
    if (confirm('Delete this game?')) {
      const updated = games.filter((g) => g.id !== id);
      setGames(updated);
      universeStore.set('games', updated);
      notify('Game deleted.');
    }
  };

  // 8. Songs CRUD
  const handleAddSong = () => {
    const newSong: Song = {
      id: `song-${Date.now()}`,
      title: 'New Track Title',
      artist: 'Artist Name',
      album: 'Album / Single',
      spotifyUrl: 'https://open.spotify.com/',
      genre: 'Soundtrack',
      featured: true,
      order: songs.length + 1
    };
    const updated = [newSong, ...songs];
    setSongs(updated);
    universeStore.set('songs', updated);
    notify('New song added.');
  };

  const handleUpdateSong = (id: string, updates: Partial<Song>) => {
    const updated = songs.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSongs(updated);
    universeStore.set('songs', updated);
    notify('Song updated.');
  };

  const handleDeleteSong = (id: string) => {
    if (confirm('Delete this song?')) {
      const updated = songs.filter((s) => s.id !== id);
      setSongs(updated);
      universeStore.set('songs', updated);
      notify('Song deleted.');
    }
  };

  // 9. Watchlist CRUD
  const handleAddWatchlist = () => {
    const newItem: WatchlistItem = {
      id: `watch-${Date.now()}`,
      title: 'Movie or Anime Title',
      type: 'Anime',
      category: 'Cinema',
      status: 'Watching',
      rating: 9,
      thoughts: 'Thoughts on the story and visuals.',
      sourceUrl: '',
      description: 'Overview',
      order: watchlist.length + 1
    };
    const updated = [newItem, ...watchlist];
    setWatchlist(updated);
    universeStore.set('watchlist', updated);
    notify('New watchlist item added.');
  };

  const handleUpdateWatchlist = (id: string, updates: Partial<WatchlistItem>) => {
    const updated = watchlist.map((w) => (w.id === id ? { ...w, ...updates } : w));
    setWatchlist(updated);
    universeStore.set('watchlist', updated);
    notify('Watchlist item updated.');
  };

  const handleDeleteWatchlist = (id: string) => {
    if (confirm('Delete this watchlist item?')) {
      const updated = watchlist.filter((w) => w.id !== id);
      setWatchlist(updated);
      universeStore.set('watchlist', updated);
      notify('Watchlist item deleted.');
    }
  };

  // 10. Background Music Configuration
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);

  const handleSaveBackgroundMusic = (updates: Partial<NonNullable<SiteSettings['backgroundMusic']>>) => {
    const updatedMusic = {
      ...(settings.backgroundMusic || {
        enabled: false,
        title: 'Atmospheric Track',
        artist: '',
        audioUrl: '',
        autoplay: false
      }),
      ...updates
    };
    const newSettings = { ...settings, backgroundMusic: updatedMusic };
    setSettings(newSettings);
    universeStore.set('siteSettings', newSettings);
    notify('Background music settings updated.');
  };

  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAudio(true);
    const cleanName = file.name.replace(/\.[^/.]+$/, '');

    // 1. Create immediate local playback URL
    const localUrl = URL.createObjectURL(file);
    handleSaveBackgroundMusic({
      audioUrl: localUrl,
      title: cleanName,
      enabled: true
    });

    // 2. Upload to Firebase Storage for permanent public access
    try {
      const storageRef = ref(storage, `backgroundMusic/${Date.now()}_${file.name}`);
      const snap = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snap.ref);

      handleSaveBackgroundMusic({
        audioUrl: downloadUrl,
        title: cleanName,
        enabled: true
      });
      notify(`Audio file "${file.name}" uploaded from folder & active!`);
    } catch (err: any) {
      console.warn('Firebase storage upload notice:', err);
      // Fallback base64 conversion
      if (file.size < 4 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (re) => {
          const b64 = re.target?.result as string;
          if (b64) {
            handleSaveBackgroundMusic({
              audioUrl: b64,
              title: cleanName,
              enabled: true
            });
            notify(`Audio file "${file.name}" saved!`);
          }
        };
        reader.readAsDataURL(file);
      } else {
        notify(`Audio file "${file.name}" loaded.`);
      }
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Bio', icon: User },
    { id: 'greetings', label: 'Multilingual Greetings', icon: Languages },
    { id: 'clock', label: 'Clock & Location', icon: Clock },
    { id: 'activity', label: 'Live Activity', icon: Activity },
    { id: 'currentProject', label: 'Current Project', icon: FolderKanban },
    { id: 'projects', label: 'Projects (All)', icon: FolderKanban },
    { id: 'learning', label: 'Learning & Exploring', icon: BookOpen },
    { id: 'interests', label: 'Gaming, Music & Watchlist', icon: Gamepad2 },
    { id: 'backgroundMusic', label: 'Background Music', icon: Music },
    { id: 'inbox', label: 'Anonymous Inbox & Q&A', icon: MessageSquare },
    { id: 'companion', label: 'Companion Token', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-warm-border/70 mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-warm-muted">
            Private Administration
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-warm-text">
            Management Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl border border-warm-border bg-warm-surface hover:bg-warm-hover text-xs font-medium text-warm-secondary hover:text-warm-text transition flex items-center gap-1.5 shadow-apple-sm"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn font-medium">
          <Check size={15} />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition text-left ${
                  isActive
                    ? 'bg-warm-text text-white shadow-apple-sm'
                    : 'text-warm-secondary hover:text-warm-text hover:bg-warm-surface'
                }`}
              >
                <Icon size={15} />
                <span className="truncate">{item.label}</span>
                {item.id === 'inbox' && messages.filter((m) => !m.isRead).length > 0 && (
                  <span className="ml-auto px-1.5 py-0.2 rounded-full bg-amber-500 text-[10px] text-white font-bold">
                    {messages.filter((m) => !m.isRead).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Panel Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="apple-card p-5">
                  <span className="text-[10px] font-mono uppercase text-warm-muted block mb-1">
                    System State
                  </span>
                  <div className="text-lg font-bold text-warm-text flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Active & Connected</span>
                  </div>
                  <span className="text-xs text-warm-muted mt-1 block">
                    Firebase Project: sidhoni
                  </span>
                </div>

                <div className="apple-card p-5">
                  <span className="text-[10px] font-mono uppercase text-warm-muted block mb-1">
                    Unread Notes
                  </span>
                  <div className="text-2xl font-bold text-warm-text">
                    {messages.filter((m) => !m.isRead).length}
                  </div>
                  <span className="text-xs text-warm-muted mt-1 block">
                    Total messages: {messages.length}
                  </span>
                </div>

                <div className="apple-card p-5">
                  <span className="text-[10px] font-mono uppercase text-warm-muted block mb-1">
                    Companion Heartbeat
                  </span>
                  <div className="text-lg font-bold text-warm-text">
                    {activity.isOnline ? 'Online Daemon' : 'Standby'}
                  </div>
                  <span className="text-xs text-warm-muted mt-1 block truncate">
                    {activity.currentGame?.title || activity.currentActivityLabel || 'Idle'}
                  </span>
                </div>
              </div>

              <div className="apple-card p-6 space-y-3">
                <h3 className="text-sm font-mono uppercase tracking-wider font-semibold text-warm-text">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <button onClick={() => setActiveTab('profile')} className="p-3 rounded-xl bg-warm-subtle hover:bg-warm-hover text-left transition font-medium">
                    Edit Bio & Tagline
                  </button>
                  <button onClick={() => setActiveTab('projects')} className="p-3 rounded-xl bg-warm-subtle hover:bg-warm-hover text-left transition font-medium">
                    Manage Projects
                  </button>
                  <button onClick={() => setActiveTab('inbox')} className="p-3 rounded-xl bg-warm-subtle hover:bg-warm-hover text-left transition font-medium">
                    Answer Messages
                  </button>
                  <button onClick={() => setActiveTab('activity')} className="p-3 rounded-xl bg-warm-subtle hover:bg-warm-hover text-left transition font-medium">
                    Override Activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROFILE & BIO */}
          {activeTab === 'profile' && (
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-warm-text">
                Personal Identity & Social Profiles
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Site Title
                  </label>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                    className="w-full rounded-xl bg-warm-subtle border border-warm-border p-2.5 text-xs text-warm-text focus:outline-none focus:border-warm-text"
                  />
                </div>

                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full rounded-xl bg-warm-subtle border border-warm-border p-2.5 text-xs text-warm-text focus:outline-none focus:border-warm-text"
                  />
                </div>

                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Bio (Homepage & About)
                  </label>
                  <textarea
                    rows={4}
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    className="w-full rounded-xl bg-warm-subtle border border-warm-border p-3 text-xs text-warm-text focus:outline-none focus:border-warm-text resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-warm-border/60">
                  <h3 className="text-xs font-mono uppercase text-warm-muted font-semibold mb-3">
                    Social Accounts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-warm-muted mb-1">Discord</label>
                      <input
                        type="text"
                        value={settings.socialLinks.discord || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, discord: e.target.value }
                          })
                        }
                        className="w-full rounded-xl bg-warm-subtle border border-warm-border p-2 text-xs text-warm-text"
                      />
                    </div>
                    <div>
                      <label className="block text-warm-muted mb-1">Steam</label>
                      <input
                        type="text"
                        value={settings.socialLinks.steam || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, steam: e.target.value }
                          })
                        }
                        className="w-full rounded-xl bg-warm-subtle border border-warm-border p-2 text-xs text-warm-text"
                      />
                    </div>
                    <div>
                      <label className="block text-warm-muted mb-1">YouTube</label>
                      <input
                        type="text"
                        value={settings.socialLinks.youtube || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                          })
                        }
                        className="w-full rounded-xl bg-warm-subtle border border-warm-border p-2 text-xs text-warm-text"
                      />
                    </div>
                    <div>
                      <label className="block text-warm-muted mb-1">Snapchat</label>
                      <input
                        type="text"
                        value={settings.socialLinks.snapchat || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, snapchat: e.target.value }
                          })
                        }
                        className="w-full rounded-xl bg-warm-subtle border border-warm-border p-2 text-xs text-warm-text"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={saveProfileSettings}
                className="px-5 py-2.5 rounded-xl bg-warm-text hover:bg-black text-white text-xs font-medium transition flex items-center gap-2 shadow-apple-sm"
              >
                <Save size={13} />
                <span>Save Profile Settings</span>
              </button>
            </div>
          )}

          {/* 3. MULTILINGUAL GREETINGS */}
          {activeTab === 'greetings' && (
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-warm-text">
                    Multilingual Greetings Rotation
                  </h2>
                  <p className="text-xs text-warm-secondary mt-0.5">
                    Controls the animated welcoming text on the top of the homepage.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newSettings = { ...settings, greetingPaused: !settings.greetingPaused };
                    setSettings(newSettings);
                    universeStore.set('siteSettings', newSettings);
                    notify(newSettings.greetingPaused ? 'Rotation paused.' : 'Rotation active.');
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium ${
                    settings.greetingPaused
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-warm-subtle text-warm-text border-warm-border'
                  }`}
                >
                  {settings.greetingPaused ? 'Resume Rotation' : 'Pause Rotation'}
                </button>
              </div>

              <div className="space-y-2">
                {(settings.greetings || DEFAULT_GREETINGS).map((gr) => (
                  <div
                    key={gr.id}
                    className="p-3 rounded-xl bg-warm-subtle border border-warm-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-warm-text text-sm mr-2">{gr.greeting}</span>
                      <span className="text-warm-muted">({gr.language})</span>
                    </div>

                    <button
                      onClick={() => toggleGreeting(gr.id)}
                      className={`p-1.5 rounded-lg border text-xs ${
                        gr.enabled
                          ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                          : 'border-warm-border text-warm-muted bg-warm-surface'
                      }`}
                      title="Toggle visibility"
                    >
                      {gr.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CLOCK & LOCATION */}
          {activeTab === 'clock' && (
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-warm-text">
                Clock & Time Settings
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Clock Display Format
                  </label>
                  <select
                    value={settings.clockFormat || '12h'}
                    onChange={(e) => {
                      const newSettings = { ...settings, clockFormat: e.target.value as '12h' | '24h' };
                      setSettings(newSettings);
                      universeStore.set('siteSettings', newSettings);
                      notify('Clock format updated.');
                    }}
                    className="w-full sm:w-60 rounded-xl bg-warm-subtle border border-warm-border p-2.5 text-xs text-warm-text"
                  >
                    <option value="12h">12-Hour (AM / PM)</option>
                    <option value="24h">24-Hour (Military / International)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Timezone
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="Asia/Kathmandu (UTC+05:45) — Hetauda, Nepal"
                    className="w-full rounded-xl bg-warm-subtle/50 border border-warm-border p-2.5 text-xs text-warm-muted font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. LIVE ACTIVITY */}
          {activeTab === 'activity' && (
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-warm-text">
                Live Activity & Companion Override
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Online Presence Status
                  </label>
                  <select
                    value={activity.isOnline ? 'online' : 'offline'}
                    onChange={(e) =>
                      saveActivity({ ...activity, isOnline: e.target.value === 'online' })
                    }
                    className="w-full sm:w-60 rounded-xl bg-warm-subtle border border-warm-border p-2.5 text-xs text-warm-text"
                  >
                    <option value="online">Online (Beacon Active)</option>
                    <option value="offline">Offline / Standby</option>
                  </select>
                </div>

                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Manual Activity Status
                  </label>
                  <input
                    type="text"
                    value={activity.customStatus || ''}
                    onChange={(e) => setActivity({ ...activity, customStatus: e.target.value })}
                    placeholder="e.g. Coding in VS Code, Studying Python, Watching YouTube"
                    className="w-full rounded-xl bg-warm-subtle border border-warm-border p-2.5 text-xs text-warm-text"
                  />
                </div>

                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Active Game Override
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
                    placeholder="e.g. Grand Theft Auto V"
                    className="w-full rounded-xl bg-warm-subtle border border-warm-border p-2.5 text-xs text-warm-text"
                  />
                </div>
              </div>

              <button
                onClick={() => saveActivity(activity)}
                className="px-5 py-2.5 rounded-xl bg-warm-text hover:bg-black text-white text-xs font-medium transition flex items-center gap-2 shadow-apple-sm"
              >
                <Save size={13} />
                <span>Save Activity State</span>
              </button>
            </div>
          )}

          {/* 6. CURRENT PROJECT */}
          {activeTab === 'currentProject' && (
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-warm-text">
                Current Focus Project (Homepage Highlight)
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={settings.currentProject?.name || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        currentProject: { ...settings.currentProject, name: e.target.value }
                      })
                    }
                    className="w-full rounded-xl bg-warm-subtle border border-warm-border p-2.5 text-xs text-warm-text"
                  />
                </div>

                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Status
                  </label>
                  <select
                    value={settings.currentProject?.status || 'Currently Building'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        currentProject: { ...settings.currentProject, status: e.target.value as any }
                      })
                    }
                    className="w-full sm:w-60 rounded-xl bg-warm-subtle border border-warm-border p-2.5 text-xs text-warm-text"
                  >
                    <option value="Currently Building">Currently Building</option>
                    <option value="Built">Built</option>
                    <option value="Want to Build">Want to Build</option>
                  </select>
                </div>

                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.currentProject?.description || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        currentProject: { ...settings.currentProject, description: e.target.value }
                      })
                    }
                    className="w-full rounded-xl bg-warm-subtle border border-warm-border p-2.5 text-xs text-warm-text resize-none"
                  />
                </div>

                <div>
                  <label className="block text-warm-secondary uppercase font-mono mb-1">
                    Project Link (URL)
                  </label>
                  <input
                    type="text"
                    value={settings.currentProject?.link || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        currentProject: { ...settings.currentProject, link: e.target.value }
                      })
                    }
                    className="w-full rounded-xl bg-warm-subtle border border-warm-border p-2.5 text-xs text-warm-text"
                  />
                </div>
              </div>

              <button
                onClick={saveProfileSettings}
                className="px-5 py-2.5 rounded-xl bg-warm-text hover:bg-black text-white text-xs font-medium transition flex items-center gap-2 shadow-apple-sm"
              >
                <Save size={13} />
                <span>Save Project Highlight</span>
              </button>
            </div>
          )}

          {/* 7. PROJECTS (ALL) */}
          {activeTab === 'projects' && (
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-warm-text">
                    All Projects ({projects.length})
                  </h2>
                  <p className="text-xs text-warm-secondary mt-0.5">
                    GSConfession, StudentHub Nepal, and upcoming creations.
                  </p>
                </div>

                <button
                  onClick={handleAddProject}
                  className="px-3.5 py-1.5 rounded-xl bg-warm-text text-white text-xs font-medium hover:bg-black transition flex items-center gap-1.5 shadow-apple-sm"
                >
                  <Plus size={13} />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-warm-subtle border border-warm-border flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-warm-text text-sm">{proj.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-warm-surface border border-warm-border text-warm-secondary">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-warm-secondary max-w-lg line-clamp-1">
                        {proj.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 rounded-lg text-warm-muted hover:text-red-600 transition"
                      title="Delete Project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. LEARNING TOPICS */}
          {activeTab === 'learning' && (
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-warm-text">
                    Learning & Exploring Topics ({learning.length})
                  </h2>
                  <p className="text-xs text-warm-secondary mt-0.5">
                    Python, NumPy, Pandas, Web dev, Blender, and future areas.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddLearning('currently-learning')}
                    className="px-3 py-1.5 rounded-xl bg-warm-text text-white text-xs font-medium hover:bg-black transition flex items-center gap-1 shadow-apple-sm"
                  >
                    <Plus size={12} />
                    <span>Currently Learning</span>
                  </button>
                  <button
                    onClick={() => handleAddLearning('want-to-learn')}
                    className="px-3 py-1.5 rounded-xl bg-warm-surface border border-warm-border text-warm-text text-xs font-medium hover:bg-warm-hover transition flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Want to Learn</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {learning.map((top) => (
                  <div
                    key={top.id}
                    className="p-4 rounded-xl bg-warm-subtle border border-warm-border flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-warm-text text-sm">{top.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-warm-surface border border-warm-border text-warm-secondary">
                          {top.categoryType === 'currently-learning' ? 'Currently Learning' : 'Want to Learn'}
                        </span>
                        {top.progress !== undefined && (
                          <span className="text-[11px] font-mono text-warm-text font-bold">
                            {top.progress}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-warm-secondary max-w-lg line-clamp-1">
                        {top.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteLearning(top.id)}
                      className="p-2 rounded-lg text-warm-muted hover:text-red-600 transition"
                      title="Delete Topic"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8.5. GAMING, MUSIC & WATCHLIST (INTERESTS) */}
          {activeTab === 'interests' && (
            <div className="space-y-8">
              {/* GAMES MANAGER */}
              <div className="apple-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-warm-text flex items-center gap-2">
                      <Gamepad2 size={18} className="text-emerald-600" />
                      <span>Gaming Space ({games.length})</span>
                    </h2>
                    <p className="text-xs text-warm-secondary mt-0.5">
                      PC games, hours played, personal memories, and favorite titles.
                    </p>
                  </div>

                  <button
                    onClick={handleAddGame}
                    className="px-3.5 py-1.5 rounded-xl bg-warm-text text-white text-xs font-medium hover:bg-black transition flex items-center gap-1.5 shadow-apple-sm"
                  >
                    <Plus size={13} />
                    <span>Add Game</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="p-5 rounded-2xl bg-warm-subtle/80 border border-warm-border space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                          <input
                            type="text"
                            value={game.title}
                            onChange={(e) => handleUpdateGame(game.id, { title: e.target.value })}
                            placeholder="Game Title"
                            className="rounded-lg bg-warm-surface border border-warm-border px-3 py-1.5 text-xs text-warm-text font-bold"
                          />
                          <select
                            value={game.platform}
                            onChange={(e) => handleUpdateGame(game.id, { platform: e.target.value as any })}
                            className="rounded-lg bg-warm-surface border border-warm-border px-2.5 py-1.5 text-xs text-warm-text"
                          >
                            <option value="PC">PC</option>
                            <option value="Cross-Platform">Cross-Platform</option>
                          </select>
                          <input
                            type="number"
                            value={game.hoursPlayed || 0}
                            onChange={(e) => handleUpdateGame(game.id, { hoursPlayed: parseInt(e.target.value) || 0 })}
                            placeholder="Hours Played"
                            className="rounded-lg bg-warm-surface border border-warm-border px-3 py-1.5 text-xs text-warm-text"
                          />
                        </div>

                        <button
                          onClick={() => handleDeleteGame(game.id)}
                          className="p-1.5 rounded-lg text-warm-muted hover:text-red-600 transition shrink-0"
                          title="Delete Game"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={game.description || ''}
                          onChange={(e) => handleUpdateGame(game.id, { description: e.target.value })}
                          placeholder="Description / Why I play it"
                          className="w-full rounded-lg bg-warm-surface border border-warm-border px-3 py-1.5 text-xs text-warm-secondary"
                        />
                        <input
                          type="text"
                          value={game.memories || ''}
                          onChange={(e) => handleUpdateGame(game.id, { memories: e.target.value })}
                          placeholder="Favorite Memory / Story"
                          className="w-full rounded-lg bg-warm-surface border border-warm-border px-3 py-1.5 text-xs text-warm-secondary italic"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MUSIC MANAGER */}
              <div className="apple-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-warm-text flex items-center gap-2">
                      <Music size={18} className="text-amber-600" />
                      <span>Favorite Music & Tracks ({songs.length})</span>
                    </h2>
                    <p className="text-xs text-warm-secondary mt-0.5">
                      Rotations, soundtrack favorites, and Spotify URLs.
                    </p>
                  </div>

                  <button
                    onClick={handleAddSong}
                    className="px-3.5 py-1.5 rounded-xl bg-warm-text text-white text-xs font-medium hover:bg-black transition flex items-center gap-1.5 shadow-apple-sm"
                  >
                    <Plus size={13} />
                    <span>Add Track</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {songs.map((song) => (
                    <div
                      key={song.id}
                      className="p-4 rounded-xl bg-warm-subtle/80 border border-warm-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                        <input
                          type="text"
                          value={song.title}
                          onChange={(e) => handleUpdateSong(song.id, { title: e.target.value })}
                          placeholder="Track Title"
                          className="rounded-lg bg-warm-surface border border-warm-border px-3 py-1.5 text-xs text-warm-text font-bold"
                        />
                        <input
                          type="text"
                          value={song.artist}
                          onChange={(e) => handleUpdateSong(song.id, { artist: e.target.value })}
                          placeholder="Artist"
                          className="rounded-lg bg-warm-surface border border-warm-border px-3 py-1.5 text-xs text-warm-secondary"
                        />
                        <input
                          type="text"
                          value={song.spotifyUrl || ''}
                          onChange={(e) => handleUpdateSong(song.id, { spotifyUrl: e.target.value })}
                          placeholder="Spotify URL (https://...)"
                          className="rounded-lg bg-warm-surface border border-warm-border px-3 py-1.5 text-xs text-warm-secondary"
                        />
                      </div>

                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        className="p-1.5 rounded-lg text-warm-muted hover:text-red-600 transition shrink-0"
                        title="Delete Track"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* WATCHLIST MANAGER */}
              <div className="apple-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-warm-text flex items-center gap-2">
                      <Film size={18} className="text-sky-600" />
                      <span>Watchlist & Cinema ({watchlist.length})</span>
                    </h2>
                    <p className="text-xs text-warm-secondary mt-0.5">
                      Anime, cinema, series, and reviews.
                    </p>
                  </div>

                  <button
                    onClick={handleAddWatchlist}
                    className="px-3.5 py-1.5 rounded-xl bg-warm-text text-white text-xs font-medium hover:bg-black transition flex items-center gap-1.5 shadow-apple-sm"
                  >
                    <Plus size={13} />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {watchlist.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-warm-subtle/80 border border-warm-border space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 w-full">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateWatchlist(item.id, { title: e.target.value })}
                            placeholder="Title"
                            className="rounded-lg bg-warm-surface border border-warm-border px-3 py-1.5 text-xs text-warm-text font-bold"
                          />
                          <select
                            value={item.type || 'Anime'}
                            onChange={(e) => handleUpdateWatchlist(item.id, { type: e.target.value })}
                            className="rounded-lg bg-warm-surface border border-warm-border px-2.5 py-1.5 text-xs text-warm-text"
                          >
                            <option value="Anime">Anime</option>
                            <option value="Movie">Movie</option>
                            <option value="Series">Series</option>
                            <option value="Documentary">Documentary</option>
                          </select>
                          <select
                            value={item.status || 'Watching'}
                            onChange={(e) => handleUpdateWatchlist(item.id, { status: e.target.value })}
                            className="rounded-lg bg-warm-surface border border-warm-border px-2.5 py-1.5 text-xs text-warm-text"
                          >
                            <option value="Watching">Watching</option>
                            <option value="To Watch">To Watch</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-warm-muted">Rating:</span>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={item.rating || 9}
                              onChange={(e) => handleUpdateWatchlist(item.id, { rating: parseInt(e.target.value) || 9 })}
                              className="w-16 rounded-lg bg-warm-surface border border-warm-border px-2 py-1 text-xs text-warm-text font-bold"
                            />
                            <span className="text-[10px] text-warm-muted">/10</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteWatchlist(item.id)}
                          className="p-1.5 rounded-lg text-warm-muted hover:text-red-600 transition shrink-0"
                          title="Delete Watchlist Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={item.thoughts || ''}
                          onChange={(e) => handleUpdateWatchlist(item.id, { thoughts: e.target.value })}
                          placeholder="Your review / thoughts on this show or movie"
                          className="w-full rounded-lg bg-warm-surface border border-warm-border px-3 py-1.5 text-xs text-warm-secondary italic"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BACKGROUND MUSIC CONFIGURATION */}
          {activeTab === 'backgroundMusic' && (
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-warm-border">
                <div>
                  <h2 className="text-lg font-bold text-warm-text flex items-center gap-2">
                    <Music size={20} className="text-amber-600" />
                    <span>Website Background Music</span>
                  </h2>
                  <p className="text-xs text-warm-secondary mt-1">
                    Play a relaxing ambient soundtrack or song for visitors with pause/play controls.
                  </p>
                </div>

                <button
                  onClick={() => notify('Background music settings saved.')}
                  className="px-4 py-2 rounded-xl bg-warm-text text-white text-xs font-medium hover:bg-black transition flex items-center gap-2 shadow-apple-sm"
                >
                  <Save size={14} />
                  <span>Save All Settings</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Master Enable Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-warm-subtle/80 border border-warm-border">
                  <div>
                    <span className="text-sm font-semibold text-warm-text block">
                      Enable Background Music on Website
                    </span>
                    <p className="text-xs text-warm-secondary mt-0.5">
                      When enabled, a minimal Apple-style floating audio pill appears on the site with play/pause controls.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.backgroundMusic?.enabled || false}
                      onChange={(e) => handleSaveBackgroundMusic({ enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-warm-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {/* Choose from Folder (Direct File Upload) */}
                <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <Upload size={14} className="text-amber-700" />
                        <span>Choose Audio File from Your Folder</span>
                      </span>
                      <p className="text-[11px] text-amber-800/80 mt-0.5">
                        Select any MP3, WAV, or OGG file from your computer. It will automatically load and activate for the site.
                      </p>
                    </div>

                    <label className={`px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold cursor-pointer shadow-apple-sm transition flex items-center gap-1.5 shrink-0 ${isUploadingAudio ? 'opacity-50 pointer-events-none' : ''}`}>
                      <FileAudio size={14} />
                      <span>{isUploadingAudio ? 'Uploading from folder...' : 'Select File from Folder'}</span>
                      <input
                        type="file"
                        accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg,audio/*"
                        onChange={handleAudioFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Built-in Royalty-Free Track Presets */}
                <div className="p-4 rounded-xl bg-warm-subtle/80 border border-warm-border space-y-2">
                  <span className="text-xs font-semibold text-warm-text block">
                    Or Quick Select Built-in Relaxing Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveBackgroundMusic({
                        title: 'Lofi Study Session',
                        artist: 'Chilled Beats',
                        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
                        enabled: true
                      })}
                      className="px-3 py-1.5 rounded-lg bg-warm-surface border border-warm-border text-xs text-warm-text hover:bg-warm-hover font-medium transition"
                    >
                      🎧 Lofi Study Session
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveBackgroundMusic({
                        title: 'Deep Ambient Calm',
                        artist: 'Atmospheric Sound',
                        audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=ambient-piano-amp-strings-10711.mp3',
                        enabled: true
                      })}
                      className="px-3 py-1.5 rounded-lg bg-warm-surface border border-warm-border text-xs text-warm-text hover:bg-warm-hover font-medium transition"
                    >
                      🌌 Deep Ambient Calm
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveBackgroundMusic({
                        title: 'Interstellar Cinematic Space',
                        artist: 'Hans Zimmer Inspired',
                        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cinematic-time-lapse-115672.mp3',
                        enabled: true
                      })}
                      className="px-3 py-1.5 rounded-lg bg-warm-surface border border-warm-border text-xs text-warm-text hover:bg-warm-hover font-medium transition"
                    >
                      🎹 Cinematic Space
                    </button>
                  </div>
                </div>

                {/* Track Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-warm-text">Track Title</label>
                    <input
                      type="text"
                      value={settings.backgroundMusic?.title || ''}
                      onChange={(e) => handleSaveBackgroundMusic({ title: e.target.value })}
                      placeholder="e.g. Lofi Study Session / Interstellar Theme"
                      className="w-full rounded-xl bg-warm-surface border border-warm-border px-3.5 py-2.5 text-xs text-warm-text font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-warm-text">Artist / Creator</label>
                    <input
                      type="text"
                      value={settings.backgroundMusic?.artist || ''}
                      onChange={(e) => handleSaveBackgroundMusic({ artist: e.target.value })}
                      placeholder="e.g. Chilled Beats / Hans Zimmer"
                      className="w-full rounded-xl bg-warm-surface border border-warm-border px-3.5 py-2.5 text-xs text-warm-text"
                    />
                  </div>
                </div>

                {/* Audio URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-warm-text">
                    Audio File / Stream URL
                  </label>
                  <input
                    type="text"
                    value={settings.backgroundMusic?.audioUrl || ''}
                    onChange={(e) => handleSaveBackgroundMusic({ audioUrl: e.target.value })}
                    placeholder="https://... or chosen from folder"
                    className="w-full rounded-xl bg-warm-surface border border-warm-border px-3.5 py-2.5 text-xs font-mono text-warm-text"
                  />
                  <p className="text-[11px] text-warm-muted">
                    Supports files selected from your folder, or any direct audio URL (MP3, WAV, OGG).
                  </p>
                </div>

                {/* Autoplay setting */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-warm-subtle/80 border border-warm-border">
                  <div>
                    <span className="text-xs font-semibold text-warm-text block">
                      Attempt Autoplay
                    </span>
                    <p className="text-[11px] text-warm-secondary mt-0.5">
                      Attempts playback on site load (modern browsers automatically prompt user interaction first if restricted).
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.backgroundMusic?.autoplay || false}
                      onChange={(e) => handleSaveBackgroundMusic({ autoplay: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-warm-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {/* Live Audio Preview */}
                {settings.backgroundMusic?.audioUrl && (
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                    <span className="text-xs font-semibold text-amber-900 block flex items-center gap-1.5">
                      <Volume2 size={14} className="text-amber-700" />
                      Live Audio Test in Admin:
                    </span>
                    <audio
                      controls
                      src={settings.backgroundMusic.audioUrl}
                      className="w-full h-9 rounded-lg"
                      preload="none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 9. ANONYMOUS INBOX & Q&A */}
          {activeTab === 'inbox' && (
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-warm-text">
                Private Anonymous Inbox ({messages.length})
              </h2>

              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-xs text-warm-muted py-6 text-center">
                    No anonymous transmissions received yet.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-xl bg-warm-subtle border border-warm-border space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-xs sm:text-sm text-warm-text font-medium leading-relaxed italic">
                          "{msg.message}"
                        </p>
                        <span className="text-[10px] font-mono text-warm-muted shrink-0">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>

                      {replyMessageId === msg.id ? (
                        <div className="space-y-2 pt-2 border-t border-warm-border/60">
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your public response here..."
                            className="w-full rounded-xl bg-warm-surface border border-warm-border p-3 text-xs text-warm-text resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePublishReply(msg)}
                              className="px-3.5 py-1.5 rounded-lg bg-warm-text text-white text-xs font-medium hover:bg-black transition flex items-center gap-1.5"
                            >
                              <Send size={12} />
                              <span>Answer & Publish to Public Q&A</span>
                            </button>
                            <button
                              onClick={() => setReplyMessageId(null)}
                              className="px-3 py-1.5 rounded-lg bg-warm-surface border border-warm-border text-xs text-warm-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-2 border-t border-warm-border/60">
                          <button
                            onClick={() => {
                              setReplyMessageId(msg.id);
                              setReplyText('');
                            }}
                            className="px-3 py-1 rounded-lg bg-warm-surface border border-warm-border text-warm-text text-xs font-medium hover:bg-warm-hover transition flex items-center gap-1.5"
                          >
                            <Edit size={12} />
                            <span>Reply & Publish</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1.5 rounded-lg text-warm-muted hover:text-red-600 transition"
                            title="Delete"
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
              <div className="pt-8 border-t border-warm-border/60 space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-wider font-semibold text-warm-text">
                  Currently Published Q&A ({publishedQA.length})
                </h3>

                <div className="space-y-3">
                  {publishedQA.map((qa) => (
                    <div
                      key={qa.id}
                      className="p-4 rounded-xl bg-warm-subtle border border-warm-border flex items-start justify-between gap-4"
                    >
                      <div className="text-xs space-y-1">
                        <p className="font-semibold text-warm-text">Q: "{qa.question}"</p>
                        <p className="text-warm-secondary pl-3 border-l border-warm-border">
                          A: {qa.reply}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteQA(qa.id)}
                        className="p-1.5 rounded-lg text-warm-muted hover:text-red-600 transition shrink-0"
                        title="Unpublish"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 10. COMPANION TOKEN */}
          {activeTab === 'companion' && (
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-warm-text">
                Windows Companion Telemetry Token
              </h2>
              <p className="text-xs text-warm-secondary">
                Use this private token inside your Sid Companion desktop application to authorize real-time telemetry and active process streaming.
              </p>

              <div className="p-4 rounded-xl bg-warm-subtle border border-warm-border space-y-2">
                <label className="block text-[11px] font-mono uppercase text-warm-muted font-semibold">
                  Secret Authentication Token
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={settings.companionToken || DEFAULT_SETTINGS.companionToken}
                    className="w-full rounded-xl bg-warm-surface border border-warm-border p-2.5 text-xs font-mono text-warm-text"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(settings.companionToken);
                      notify('Token copied to clipboard!');
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-warm-surface border border-warm-border text-xs font-medium text-warm-text hover:bg-warm-hover flex items-center gap-1.5 transition shrink-0"
                  >
                    <Copy size={13} />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 11. GENERAL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="apple-card p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-warm-text">
                System & Deployment Configuration
              </h2>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-warm-subtle border border-warm-border space-y-1">
                  <span className="font-bold text-warm-text block">Database Provider</span>
                  <p className="text-warm-secondary">
                    Google Cloud Firestore (Project: <code className="font-mono text-warm-text">sidhoni</code>)
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-warm-subtle border border-warm-border space-y-1">
                  <span className="font-bold text-warm-text block">Local Timezone</span>
                  <p className="text-warm-secondary font-mono">
                    Asia/Kathmandu (UTC+05:45)
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-warm-subtle border border-warm-border space-y-1">
                  <span className="font-bold text-warm-text block">Location Atmosphere Coordinates</span>
                  <p className="text-warm-secondary font-mono">
                    Hetauda, Nepal (Lat: 27.4284, Lon: 85.0331)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
