import { INITIAL_PLANETS } from './planetsData';
import {
  PlanetConfig,
  Project,
  LearningTopic,
  Game,
  Song,
  Playlist,
  WatchlistItem,
  AnonymousMessage,
  PublishedQA,
  PublicActivity,
  SiteSettings,
  TimelineMilestone
} from './types';

// Default initial data for Sid's Universe
export const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: "SID UNIVERSE",
  tagline: "Builder, Explorer & Creator of Worlds",
  bio: "Hey, I'm Sid — an engineer, creative developer, and digital explorer building next-generation web architectures, AI workflows, and immersive digital worlds. Welcome to my personal cosmos.",
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  nepalTimezone: "Asia/Kathmandu",
  socialLinks: {
    snapchat: "https://snapchat.com/add/sid",
    discord: "https://discord.com/users/sid",
    steam: "https://steamcommunity.com/id/sid",
    youtube: "https://youtube.com/@sid",
    facebook: "https://facebook.com/sid",
    github: "https://github.com/sid",
  },
  companionToken: "sid_universe_secret_token_demo_2026",
  audioAmbientEnabled: true
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Aether OS — Spatial Desktop Environment',
    description: 'A WebGL-accelerated 3D spatial computing environment running native web microfrontends inside an infinite canvas workspace.',
    longDescription: 'Aether OS is an exploration into the convergence of 3D spatial interfaces and standard productivity workflows. Built with Three.js, React, and WebAssembly, it enables running multiple sandbox windows, code editors, and media players in full 3D space.',
    category: '3D & Creative',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
    ],
    technologies: ['React', 'Three.js', 'TypeScript', 'Web Workers', 'Tailwind CSS'],
    status: 'Completed',
    startDate: '2025-06-01',
    completionDate: '2026-02-15',
    liveUrl: 'https://github.com/sid/aether-os',
    githubUrl: 'https://github.com/sid/aether-os',
    featured: true,
    order: 1
  },
  {
    id: 'proj-2',
    title: 'Neural Sentinel — Threat Intelligence Engine',
    description: 'Autonomous cybersecurity AI pipeline scanning endpoints for anomalous process injection and binary payload telemetry in real time.',
    longDescription: 'Engineered for rapid telemetry analysis across distributed Windows and Linux machines. Uses lightweight eBPF probes and a fine-tuned embedding model to classify zero-day behavior patterns.',
    category: 'AI & ML',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    technologies: ['Python', 'PyTorch', 'Rust', 'Next.js', 'FastAPI'],
    status: 'Completed',
    startDate: '2025-09-10',
    completionDate: '2026-01-20',
    liveUrl: 'https://github.com/sid/neural-sentinel',
    githubUrl: 'https://github.com/sid/neural-sentinel',
    featured: true,
    order: 2
  },
  {
    id: 'proj-3',
    title: 'Sid Universe & Companion Engine',
    description: 'An interactive 3D personal universe featuring real-time Windows telemetry synchronization, companion desktop app, and cosmic visual design.',
    longDescription: 'The current platform you are exploring. Features real-time orbital planetary navigation, background Windows companion client, YouTube integration, and hardened Firebase architecture.',
    category: 'Full-Stack',
    coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'
    ],
    technologies: ['Next.js', 'TypeScript', 'Three.js', 'Electron', 'Firebase', 'Tailwind CSS'],
    status: 'Currently Building',
    startDate: '2026-01-01',
    liveUrl: 'https://github.com/sid/sid-universe',
    githubUrl: 'https://github.com/sid/sid-universe',
    featured: true,
    order: 3
  },
  {
    id: 'proj-4',
    title: 'VoxelForge — Procedural Game Engine',
    description: 'Experimental voxel terrain generator and physics sandbox built in C++ and Vulkan with real-time ray-traced lighting.',
    longDescription: 'Investigating sparse voxel octrees (SVO) and compute-shader ray tracing for infinite destructible worlds.',
    category: '3D & Creative',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    technologies: ['C++', 'Vulkan', 'GLSL', 'CMake'],
    status: 'Planned Idea',
    startDate: '2026-06-01',
    githubUrl: 'https://github.com/sid/voxelforge',
    featured: false,
    order: 4
  }
];

export const DEFAULT_LEARNING: LearningTopic[] = [
  {
    id: 'learn-1',
    title: 'Advanced Shader Programming & Raymarching',
    category: '3D & Blender',
    description: 'Mastering GLSL fragment shaders, Signed Distance Functions (SDF), and raymarching for real-time procedural volumetrics in Three.js.',
    notes: 'Focusing on Inigo Quilez distance functions and GPU performance optimization on mobile hardware.',
    resources: [
      { title: 'The Book of Shaders', url: 'https://thebookofshaders.com' },
      { title: 'Inigo Quilez Articles', url: 'https://iquilezles.org' }
    ],
    startDate: '2026-01-10',
    status: 'In Progress',
    progress: 72,
    featured: true,
    order: 1
  },
  {
    id: 'learn-2',
    title: 'Large Language Model Fine-Tuning & Quantization',
    category: 'AI & ML',
    description: 'Fine-tuning open-weights models (Llama 3, Mistral) using LoRA/QLoRA on custom datasets, deploying with vLLM and TensorRT-LLM.',
    notes: 'Benchmarking latency reduction and memory savings with 4-bit AWQ and GGUF quantization formats.',
    resources: [
      { title: 'Hugging Face PEFT Documentation', url: 'https://huggingface.co/docs/peft' }
    ],
    startDate: '2025-11-05',
    status: 'In Progress',
    progress: 85,
    featured: true,
    order: 2
  },
  {
    id: 'learn-3',
    title: 'Windows Kernel Internals & Driver Development',
    category: 'Cybersecurity',
    description: 'Understanding Windows memory management, IRP handling, and minifilter driver architecture for low-level process instrumentation.',
    notes: 'Working through Windows Internals (7th Edition) and setting up dual-machine kernel debugging with WinDbg.',
    resources: [
      { title: 'Microsoft Driver Development Guide', url: 'https://learn.microsoft.com/windows-hardware/drivers/' }
    ],
    startDate: '2026-02-01',
    status: 'In Progress',
    progress: 45,
    featured: true,
    order: 3
  },
  {
    id: 'learn-4',
    title: 'Distributed Systems & Raft Consensus',
    category: 'Programming',
    description: 'Implementing distributed key-value stores with consensus algorithms in Go.',
    notes: 'Completed leader election, log replication, and snapshotting modules.',
    resources: [
      { title: 'Raft Paper (Ongaro & Ousterhout)', url: 'https://raft.github.io' }
    ],
    startDate: '2025-08-15',
    status: 'Mastered',
    progress: 100,
    featured: false,
    order: 4
  }
];

export const DEFAULT_GAMES: Game[] = [
  {
    id: 'game-1',
    title: 'Cyberpunk 2077: Phantom Liberty',
    platform: 'PC',
    genre: 'Open-World Action RPG',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    description: 'A masterpiece of atmospheric world-building and narrative design in the neon dystopia of Night City.',
    hoursPlayed: 185,
    achievements: 'Completed all Dogtown gigs, unlocked all endings, level 60 Netrunner build.',
    memories: 'Driving through Japantown at 2 AM with the body synth radio station playing through pouring rain.',
    isFavorite: true,
    isCurrentlyPlaying: false,
    order: 1
  },
  {
    id: 'game-2',
    title: 'Counter-Strike 2',
    platform: 'Steam',
    genre: 'Tactical Competitive FPS',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    description: 'The definitive tactical shooter testing reflex, map control, and team coordination.',
    hoursPlayed: 640,
    achievements: 'Premier rating 16,500+, 5k clutch ace on Inferno.',
    memories: 'Late night competitive sessions with the squad breaking into sudden laugh attacks.',
    isFavorite: true,
    isCurrentlyPlaying: true,
    order: 2
  },
  {
    id: 'game-3',
    title: 'Elden Ring: Shadow of the Erdtree',
    platform: 'PC',
    genre: 'Action RPG / Souls',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    description: 'An unmatched achievement in exploration, combat mastery, and visual grandeur.',
    hoursPlayed: 230,
    achievements: 'Defeated Consort Radahn, collected all Scadutree fragments, platinum trophy.',
    memories: 'Finally conquering Malenia after three intense evenings of dodging Waterfowl Dance.',
    isFavorite: true,
    isCurrentlyPlaying: false,
    order: 3
  },
  {
    id: 'game-4',
    title: 'Minecraft',
    platform: 'Cross-Platform',
    genre: 'Sandbox / Survival',
    coverImage: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80',
    description: 'The eternal canvas of creativity, redstone engineering, and multiplayer survival adventures.',
    hoursPlayed: 1200,
    achievements: 'Automated mega iron and gold farms, nether hub railway network.',
    memories: 'Building our first survival castle with friends back in high school.',
    isFavorite: true,
    isCurrentlyPlaying: false,
    order: 4
  }
];

export const DEFAULT_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    duration: '4:03',
    spotifyUrl: 'https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt',
    youtubeUrl: 'https://youtube.com/watch?v=dX3k_QDnzHE',
    genre: 'Synthwave / Electronic',
    isFavorite: true,
    featured: true,
    order: 1
  },
  {
    id: 'song-2',
    title: 'Resonance',
    artist: 'HOME',
    album: 'Odyssey',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    duration: '3:32',
    spotifyUrl: 'https://open.spotify.com/track/1Tu2K7t3Z63e2i0dY4e7L4',
    youtubeUrl: 'https://youtube.com/watch?v=8GW6sLrK40k',
    genre: 'Chillwave',
    isFavorite: true,
    featured: true,
    order: 2
  },
  {
    id: 'song-3',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    duration: '3:50',
    spotifyUrl: 'https://open.spotify.com/track/7MXVkk9YM5FZxjWyuGo05v',
    youtubeUrl: 'https://youtube.com/watch?v=34Na4j8AVgA',
    genre: 'R&B / Synthpop',
    isFavorite: true,
    featured: true,
    order: 3
  },
  {
    id: 'song-4',
    title: 'Cornfield Chase',
    artist: 'Hans Zimmer',
    album: 'Interstellar Soundtrack',
    coverArt: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    duration: '2:06',
    spotifyUrl: 'https://open.spotify.com/track/6pWgRkpqVfxnj3WuUNMu7W',
    youtubeUrl: 'https://youtube.com/watch?v=1V_xRb0x9aw',
    genre: 'Cinematic Score',
    isFavorite: true,
    featured: true,
    order: 4
  }
];

export const DEFAULT_PLAYLISTS: Playlist[] = [
  {
    id: 'play-1',
    title: 'Cosmic Coding Focus',
    description: 'Deep instrumental synthwave, ambient electronica, and low-tempo beats designed for 4-hour coding flow states.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
    trackCount: 48,
    order: 1
  },
  {
    id: 'play-2',
    title: 'Night Drive in Kathmandu',
    description: 'Atmospheric neo-soul, synthpop, and indie electronic melodies for rainy drives across the valley.',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4t95P99014Q',
    trackCount: 35,
    order: 2
  }
];

export const DEFAULT_WATCHLIST: WatchlistItem[] = [
  {
    id: 'watch-1',
    title: 'Building a Fast Voxel Engine in Vulkan',
    description: 'Comprehensive 4-part series covering GPU memory allocation, compute pipeline optimization, and volumetric raymarching.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://youtube.com',
    category: 'YouTube',
    addedDate: '2026-02-10',
    status: 'Watching',
    order: 1
  },
  {
    id: 'watch-2',
    title: 'CS50: Introduction to Artificial Intelligence with Python',
    description: 'Harvard University course on graph search algorithms, minimax, reinforcement learning, and neural network foundations.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://cs50.harvard.edu/ai',
    category: 'Course',
    addedDate: '2025-12-01',
    status: 'Completed',
    order: 2
  },
  {
    id: 'watch-3',
    title: 'The James Webb Space Telescope: Unveiling the Cosmic Dawn',
    description: 'Deep documentary examining the engineering behind the infrared sunshield and first deep-field exoplanet spectrometry.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://youtube.com',
    category: 'Documentary',
    addedDate: '2026-01-25',
    status: 'Completed',
    order: 3
  },
  {
    id: 'watch-4',
    title: 'Rust for High-Frequency Systems Architecture',
    description: 'In-depth guide to zero-cost abstractions, lock-free queues, and cache-friendly data structures in systems programming.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://youtube.com',
    category: 'Tutorial',
    addedDate: '2026-03-01',
    status: 'To Watch',
    order: 4
  }
];

export const DEFAULT_PUBLISHED_QA: PublishedQA[] = [
  {
    id: 'qa-1',
    messageId: 'msg-init-1',
    question: "What inspired you to build this entire 3D solar system website instead of a normal portfolio?",
    reply: "I believe standard web pages have become too homogenous and card-heavy. A personal website should feel like entering someone's distinct mental universe. Planetary orbits represent how different passions (code, gaming, music, learning) continually revolve around the central core of who we are.",
    publishedAt: "2026-02-14T18:30:00Z",
    category: "Philosophy"
  },
  {
    id: 'qa-2',
    messageId: 'msg-init-2',
    question: "What advice would you give someone who wants to learn creative 3D web development?",
    reply: "Start with fundamental math (vectors, trigonometry, matrices) and raw Three.js primitives before jumping into heavyweight abstractions. Learn GLSL fragment shaders early — once you understand how to control pixels on the GPU, you have total creative freedom.",
    publishedAt: "2026-02-28T14:15:00Z",
    category: "Career"
  },
  {
    id: 'qa-3',
    messageId: 'msg-init-3',
    question: "Are you open to collaborating on open-source AI or 3D web experiments?",
    reply: "Always! Feel free to reach out through Discord, GitHub, or send an anonymous note right here with your project idea or repository link.",
    publishedAt: "2026-03-05T09:40:00Z",
    category: "Collaboration"
  }
];

export const DEFAULT_TIMELINE: TimelineMilestone[] = [
  {
    id: 'time-1',
    year: '2021',
    title: 'Ignition — The First Lines of Code',
    description: 'Began programming with Python and web fundamentals. Discovered the thrill of building things from pure logic.'
  },
  {
    id: 'time-2',
    year: '2023',
    title: 'Full-Stack & Systems Architecture',
    description: 'Transitioned to modern TypeScript, Next.js, and cloud backends. Built production-ready microservices and real-time platforms.'
  },
  {
    id: 'time-3',
    year: '2024',
    title: 'The 3D & Creative Web Frontier',
    description: 'Fell in love with Three.js, shaders, and spatial computing. Designed interactive digital experiences and creative portfolios.'
  },
  {
    id: 'time-4',
    year: '2025',
    title: 'AI Engineering & Deep Telemetry',
    description: 'Integrated local LLMs, fine-tuning workflows, and low-level Windows systems telemetry engines.'
  },
  {
    id: 'time-5',
    year: '2026',
    title: 'Launch of SID UNIVERSE',
    description: 'Unified all creations, studies, gaming worlds, and live activity into an interconnected digital universe.'
  }
];

export const DEFAULT_ACTIVITY: PublicActivity = {
  isOnline: true,
  lastHeartbeat: new Date().toISOString(),
  customStatus: "Constructing cosmic web systems 🛸",
  currentGame: {
    title: "Counter-Strike 2",
    category: "Tactical FPS",
    detectedAt: new Date().toISOString()
  },
  currentMusic: {
    title: "Resonance",
    artist: "HOME",
    source: "Spotify Desktop",
    detectedAt: new Date().toISOString()
  },
  currentCoding: {
    project: "SID UNIVERSE",
    file: "UniverseCanvas.tsx",
    editor: "Visual Studio Code",
    detectedAt: new Date().toISOString()
  },
  lastActiveTime: new Date().toISOString()
};

// Safe in-memory and localStorage unified store
class UniverseStore {
  private memoryStore: Record<string, any> = {};

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      this.loadOrSeed('siteSettings', DEFAULT_SETTINGS);
      this.loadOrSeed('planets', INITIAL_PLANETS);
      this.loadOrSeed('projects', DEFAULT_PROJECTS);
      this.loadOrSeed('learningTopics', DEFAULT_LEARNING);
      this.loadOrSeed('games', DEFAULT_GAMES);
      this.loadOrSeed('songs', DEFAULT_SONGS);
      this.loadOrSeed('playlists', DEFAULT_PLAYLISTS);
      this.loadOrSeed('watchlist', DEFAULT_WATCHLIST);
      this.loadOrSeed('publishedQA', DEFAULT_PUBLISHED_QA);
      this.loadOrSeed('timeline', DEFAULT_TIMELINE);
      this.loadOrSeed('publicActivity', DEFAULT_ACTIVITY);
      this.loadOrSeed('anonymousMessages', []);
    } else {
      this.memoryStore['siteSettings'] = DEFAULT_SETTINGS;
      this.memoryStore['planets'] = INITIAL_PLANETS;
      this.memoryStore['projects'] = DEFAULT_PROJECTS;
      this.memoryStore['learningTopics'] = DEFAULT_LEARNING;
      this.memoryStore['games'] = DEFAULT_GAMES;
      this.memoryStore['songs'] = DEFAULT_SONGS;
      this.memoryStore['playlists'] = DEFAULT_PLAYLISTS;
      this.memoryStore['watchlist'] = DEFAULT_WATCHLIST;
      this.memoryStore['publishedQA'] = DEFAULT_PUBLISHED_QA;
      this.memoryStore['timeline'] = DEFAULT_TIMELINE;
      this.memoryStore['publicActivity'] = DEFAULT_ACTIVITY;
      this.memoryStore['anonymousMessages'] = [];
    }
  }

  private loadOrSeed(key: string, defaultValue: any) {
    try {
      const stored = localStorage.getItem(`sid_universe_${key}`);
      if (stored) {
        this.memoryStore[key] = JSON.parse(stored);
      } else {
        this.memoryStore[key] = defaultValue;
        localStorage.setItem(`sid_universe_${key}`, JSON.stringify(defaultValue));
      }
    } catch {
      this.memoryStore[key] = defaultValue;
    }
  }

  public get<T>(key: string, fallback: T): T {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`sid_universe_${key}`);
        if (stored) return JSON.parse(stored) as T;
      } catch (e) {}
    }
    return (this.memoryStore[key] as T) || fallback;
  }

  public set<T>(key: string, value: T): void {
    this.memoryStore[key] = value;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`sid_universe_${key}`, JSON.stringify(value));
        window.dispatchEvent(new CustomEvent('sid_store_updated', { detail: { key, value } }));
      } catch (e) {}
    }
  }
}

export const universeStore = new UniverseStore();
