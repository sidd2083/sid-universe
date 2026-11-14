import {
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
  GreetingLanguage,
  CurrentProjectHighlight
} from './types';
import { listenCollection, listenDocument, saveDocument } from './firestoreService';

export const DEFAULT_GREETINGS: GreetingLanguage[] = [
  { id: 'gr-1', language: 'Nepali', greeting: 'Namaste', enabled: true },
  { id: 'gr-2', language: 'English', greeting: 'Hello', enabled: true },
  { id: 'gr-3', language: 'French', greeting: 'Bonjour', enabled: true },
  { id: 'gr-4', language: 'Spanish', greeting: 'Hola', enabled: true },
  { id: 'gr-5', language: 'Italian', greeting: 'Ciao', enabled: true },
  { id: 'gr-6', language: 'German', greeting: 'Guten Tag', enabled: true },
  { id: 'gr-7', language: 'Japanese', greeting: 'こんにちは', enabled: true },
  { id: 'gr-8', language: 'Korean', greeting: '안녕하세요', enabled: true },
  { id: 'gr-9', language: 'Chinese', greeting: '你好', enabled: true },
  { id: 'gr-10', language: 'Arabic', greeting: 'مرحباً', enabled: true },
  { id: 'gr-11', language: 'Russian', greeting: 'Привет', enabled: true },
  { id: 'gr-12', language: 'Portuguese', greeting: 'Olá', enabled: true }
];

export const DEFAULT_CURRENT_PROJECT: CurrentProjectHighlight = {
  name: "StudentHub Nepal",
  description: "A comprehensive platform created for students across Nepal with collaborative study rooms, report card tracking, progress metrics, gamification, and academic streaks.",
  personalStory: "This was the project that took the longest time to make, and it feels like a child to me. I honestly don't care whether thousands of people use it or not — I use it daily, and I love my creation.",
  status: "Recent Big Project",
  link: "https://studenthubnp.com",
  imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "PostgreSQL"],
  updatedAt: new Date().toISOString()
};

export const DEFAULT_RAW_BIO = `Hey! I am Siddhant, you can also call me Sidd. I am a full-time student currently studying in grade 11, part-time coder and builder, and casual gamer playing new games every day.

This is just my small bio to tell. In reality, I hate everything. I hate going to college sometimes, I hate what I am doing most of the time, I even hate the game I am playing — I don't know why, but yeah, it is what it is. I have built many projects; most of them are just sitting in my folders and GitHub. I just enjoy the process of making new things — it gives me a dopamine rush. I get this instant delusion that it will hit, and those projects definitely have the power to get hit, but yeah... me and my interests just vanish after a while.

I am learning many things at the same time. I don't know if it's good or bad, but it is what it is. Like, I am currently learning AI & Machine Learning, but I wanted to learn cybersecurity. Currently, I am also learning Photoshop and Blender, but I wanted to learn video editing too. It's always my heart and brain fighting against each other — my mind wants to learn everything, but ends up finishing nothing.

At the end, it's just me sitting in my room alone in front of my PC, trying to figure out life, doing and learning new things every day.`;

export const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: "Siddhant — Personal Space",
  authorName: "Siddhant",
  tagline: "Grade 11 Student · Builder · Explorer of Ideas",
  bio: DEFAULT_RAW_BIO,
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  nepalTimezone: "Asia/Kathmandu",
  locationCity: "Hetauda, Nepal",
  clockFormat: "12h",
  greetings: DEFAULT_GREETINGS,
  greetingIntervalMs: 3000,
  greetingPaused: false,
  currentProject: DEFAULT_CURRENT_PROJECT,
  philosophicalQuote: {
    quote: "In the midst of winter, I found there was, within me, an invincible summer.",
    author: "Albert Camus"
  },
  footerQuote: {
    quote: "In the midst of winter, I found there was, within me, an invincible summer.",
    author: "Albert Camus"
  },
  learningDisclaimer: "Seeing these skills and terms doesn't mean I know everything. Yes, I understand the concepts and I have consumed all these topics. But I have one trait — some might call it a god-gifted power, though it's debatable: I learn any new thing pretty fast, but my forgetting speed is just as fast! At the end of the day, I'm always learning new things, but I'm weak at applying the concepts in real life. I'm learning that too! !_!",
  socialLinks: {
    snapchat: "https://snapchat.com/add/sid",
    discord: "https://discord.com/users/sid",
    steam: "https://steamcommunity.com/id/sid",
    youtube: "https://youtube.com/@sid",
    facebook: "https://facebook.com/sid",
    github: "https://github.com/sidd2083"
  },
  backgroundMusic: {
    enabled: false,
    title: "Lofi Study Session",
    artist: "Chilled Beats",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    autoplay: false
  },
  companionToken: "sid_universe_secret_token_demo_2026"
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'StudentHub Nepal',
    description: 'A dedicated platform designed for students in Nepal with collaborative study rooms, report cards, progress tracking, gamification, leaderboards, and streaks.',
    personalStory: "This was the project that took the longest time to make, and it feels like a child to me. I honestly don't care whether thousands of people use it or not — I use it daily, and I love my creation.",
    longDescription: 'StudentHub Nepal combines real-time study rooms, automatic report card analysis, subject-by-subject streak tracking, and interactive peer challenges without social media distractions.',
    whyBuilt: 'Built to give students in Nepal a single clean space to organize syllabus milestones and study together.',
    problemAddressed: 'Overcomes academic fragmentation and keeps students motivated through streak accountability.',
    learnings: 'Mastered real-time state synchronization, gamification psychology, responsive mobile layout design, and PostgreSQL schema architecture.',
    category: 'Student Platform',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase', 'PostgreSQL'],
    status: 'Recent Big Project',
    startDate: '2025-10-01',
    liveUrl: 'https://studenthubnp.com',
    githubUrl: 'https://github.com/sidd2083/studenthub-nepal',
    featured: true,
    order: 1
  },
  {
    id: 'proj-2',
    title: 'GSConfession',
    description: 'An anonymous social networking and confession platform created for students in Nepal, built using WordPress and BuddyBoss.',
    personalStory: 'One of my early experiments that actually grew fast. Students loved having an open space to share what was on their minds anonymously.',
    longDescription: 'GSConfession allowed students to express thoughts, discuss academic pressures, and communicate honestly without fear of judgment.',
    whyBuilt: 'Built to give students an authentic voice and community space during high school and college seasons.',
    problemAddressed: 'Addressed the absence of open, anonymous student communication channels.',
    learnings: 'Taught me real-world server management, MySQL optimization under unexpected traffic spikes, and user moderation.',
    category: 'Student Platform',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    technologies: ['WordPress', 'BuddyBoss', 'PHP', 'MySQL', 'Nginx'],
    status: 'Built',
    startDate: '2023-04-15',
    completionDate: '2024-08-20',
    liveUrl: 'https://gsconfession.xyz',
    featured: true,
    order: 2
  },
  {
    id: 'proj-3',
    title: 'Autonomous Exam & Course Assistant',
    description: 'An upcoming AI-powered revision tutor tailored to the Nepali curriculum with automated practice papers and syllabus summarization.',
    personalStory: 'A project in the idea incubator. I love the thrill of designing AI workflows that solve practical study challenges.',
    whyBuilt: 'Nepali curriculum students often spend hours searching for old question solutions and chapter summaries.',
    problemAddressed: 'Bridges access to intelligent revision assistants without requiring expensive subscriptions.',
    learnings: 'Exploring retrieval-augmented generation (RAG) and local quantized models.',
    category: 'AI & ML',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    technologies: ['Python', 'FastAPI', 'Llama 3', 'LangChain', 'React'],
    status: 'Want to Build',
    startDate: '2026-06-01',
    featured: true,
    order: 3
  }
];

export const DEFAULT_LEARNING: LearningTopic[] = [
  // Currently Learning as specified by user:
  // Python, NumPy, Pandas, Matplotlib, Seaborn, Calculus, Graphic Designing
  { id: 'l-1', title: 'Python', categoryType: 'currently-learning', category: 'Programming & Data', order: 1 },
  { id: 'l-2', title: 'NumPy', categoryType: 'currently-learning', category: 'Programming & Data', order: 2 },
  { id: 'l-3', title: 'Pandas', categoryType: 'currently-learning', category: 'Programming & Data', order: 3 },
  { id: 'l-4', title: 'Matplotlib', categoryType: 'currently-learning', category: 'Programming & Data', order: 4 },
  { id: 'l-5', title: 'Seaborn', categoryType: 'currently-learning', category: 'Programming & Data', order: 5 },
  { id: 'l-6', title: 'Calculus', categoryType: 'currently-learning', category: 'Mathematics', order: 6 },
  { id: 'l-7', title: 'Graphic Designing', categoryType: 'currently-learning', category: 'Creative', order: 7 },

  // Wanted to Learn as specified by user:
  // Linear Algebra, Scikit-Learn, XGBoost, PyTorch, TensorFlow, LangChain, OpenCV, AI/ML Deep Concepts
  { id: 'w-1', title: 'Linear Algebra', categoryType: 'want-to-learn', category: 'Mathematics', order: 8 },
  { id: 'w-2', title: 'Scikit-Learn', categoryType: 'want-to-learn', category: 'AI & ML', order: 9 },
  { id: 'w-3', title: 'XGBoost', categoryType: 'want-to-learn', category: 'AI & ML', order: 10 },
  { id: 'w-4', title: 'PyTorch', categoryType: 'want-to-learn', category: 'AI & ML', order: 11 },
  { id: 'w-5', title: 'TensorFlow', categoryType: 'want-to-learn', category: 'AI & ML', order: 12 },
  { id: 'w-6', title: 'LangChain', categoryType: 'want-to-learn', category: 'AI & ML', order: 13 },
  { id: 'w-7', title: 'OpenCV', categoryType: 'want-to-learn', category: 'Computer Vision', order: 14 },
  { id: 'w-8', title: 'AI / ML Deep Concepts', categoryType: 'want-to-learn', category: 'AI & ML', order: 15 }
];

export const DEFAULT_GAMES: Game[] = [
  {
    id: 'game-1',
    title: 'Grand Theft Auto V',
    platform: 'PC',
    genre: 'Open World',
    description: 'Free roaming, driving around Los Santos, and playing online with friends.',
    hoursPlayed: 240,
    memories: 'Cruising through the city on late nights while listening to the radio.',
    isCurrentlyPlaying: true,
    order: 1
  },
  {
    id: 'game-2',
    title: 'Minecraft',
    platform: 'Cross-Platform',
    genre: 'Sandbox / Survival',
    description: 'Building survival houses, experimenting with redstone, and chilling with friends.',
    hoursPlayed: 1100,
    memories: 'Our cliff-side survival base built during high school breaks.',
    isCurrentlyPlaying: false,
    order: 2
  },
  {
    id: 'game-3',
    title: 'Human: Fall Flat',
    platform: 'PC',
    genre: 'Physics Comedy',
    description: 'Chaotic ragdoll physics puzzles that guarantee pure laughs in co-op mode.',
    hoursPlayed: 65,
    memories: 'Throwing friends off the catapult by mistake.',
    isCurrentlyPlaying: false,
    order: 3
  }
];

export const DEFAULT_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Midnight City',
    artist: 'M83',
    album: "Hurry Up, We're Dreaming",
    spotifyUrl: 'https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt',
    genre: 'Synthwave',
    featured: true,
    order: 1
  },
  {
    id: 'song-2',
    title: 'Resonance',
    artist: 'HOME',
    album: 'Odyssey',
    spotifyUrl: 'https://open.spotify.com/track/1Tu2K7t3Z63e2i0dY4e7L4',
    genre: 'Chillwave',
    featured: true,
    order: 2
  },
  {
    id: 'song-3',
    title: 'Cornfield Chase',
    artist: 'Hans Zimmer',
    album: 'Interstellar Soundtrack',
    spotifyUrl: 'https://open.spotify.com/track/6pWgRkpqVfxnj3WuUNMu7W',
    genre: 'Cinematic Score',
    featured: true,
    order: 3
  }
];

export const DEFAULT_PLAYLISTS: Playlist[] = [
  {
    id: 'play-1',
    title: 'Deep Focus Coding',
    description: 'Instrumental chillwave, low-tempo beats, and quiet soundscapes.',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
    trackCount: 42,
    order: 1
  }
];

export const DEFAULT_WATCHLIST: WatchlistItem[] = [
  {
    id: 'watch-1',
    title: 'CS50: Introduction to Computer Science',
    description: 'Harvard University computer science course exploring memory, algorithms, and C.',
    sourceUrl: 'https://cs50.harvard.edu/',
    category: 'Course',
    status: 'Completed',
    order: 1
  },
  {
    id: 'watch-2',
    title: 'Neural Networks: Zero to Hero by Andrej Karpathy',
    description: 'Building micrograd and makemore from the ground up in pure Python.',
    sourceUrl: 'https://youtube.com',
    category: 'YouTube',
    status: 'Watching',
    order: 2
  },
  {
    id: 'watch-3',
    title: 'The Principles of Clean Typography & Design Systems',
    description: 'Editorial grid systems, baseline hierarchy, and minimalist typography.',
    sourceUrl: 'https://youtube.com',
    category: 'Tutorial',
    status: 'To Watch',
    order: 3
  }
];

export const DEFAULT_PUBLISHED_QA: PublishedQA[] = [
  {
    id: 'qa-1',
    messageId: 'msg-init-1',
    question: "What made you want to build StudentHub Nepal?",
    reply: "Growing up studying in Nepal, I saw how much time we lost juggling disparate notes, disconnected group chats, and fragmented exam papers. I wanted to build one clean space to organize study rooms, track streaks, and study together.",
    publishedAt: "2026-02-14T18:30:00Z",
    category: "Projects"
  },
  {
    id: 'qa-2',
    messageId: 'msg-init-2',
    question: "How do you manage learning so many things at once?",
    reply: "Honestly, it's a constant struggle! I start so many things, learn them quickly, and then get interested in something completely different. But building real projects like StudentHub is what keeps me grounded.",
    publishedAt: "2026-02-28T14:15:00Z",
    category: "Life"
  }
];

export const DEFAULT_ACTIVITY: PublicActivity = {
  isOnline: true,
  lastHeartbeat: new Date().toISOString(),
  siddhantAction: "Siddhant is currently coding StudentHub Nepal",
  appName: "Visual Studio Code",
  appDetails: "Working on room collaboration engine",
  durationMinutes: 45,
  activeSince: new Date(Date.now() - 45 * 60000).toISOString(),
  customStatus: "Building StudentHub Nepal & learning Python",
  lastActiveTime: new Date().toISOString()
};

const SCHEMA_VERSION = 'v2.3.0_sidd_refresh';

// Unified in-memory, localStorage and live Firestore store
class UniverseStore {
  private memoryStore: Record<string, any> = {};
  private isListeningToFirestore = false;

  constructor() {
    this.init();
    if (typeof window !== 'undefined') {
      setTimeout(() => this.initFirestore(), 150);
    }
  }

  private init() {
    if (typeof window !== 'undefined') {
      const currentVer = localStorage.getItem('sid_store_version');
      const shouldForceSeed = currentVer !== SCHEMA_VERSION;

      if (shouldForceSeed) {
        localStorage.setItem('sid_store_version', SCHEMA_VERSION);
      }

      this.loadOrSeed('siteSettings', DEFAULT_SETTINGS, shouldForceSeed);
      this.loadOrSeed('projects', DEFAULT_PROJECTS, shouldForceSeed);
      this.loadOrSeed('learningTopics', DEFAULT_LEARNING, shouldForceSeed);
      this.loadOrSeed('games', DEFAULT_GAMES, shouldForceSeed);
      this.loadOrSeed('songs', DEFAULT_SONGS, shouldForceSeed);
      this.loadOrSeed('playlists', DEFAULT_PLAYLISTS, shouldForceSeed);
      this.loadOrSeed('watchlist', DEFAULT_WATCHLIST, shouldForceSeed);
      this.loadOrSeed('publishedQA', DEFAULT_PUBLISHED_QA, shouldForceSeed);
      this.loadOrSeed('publicActivity', DEFAULT_ACTIVITY, shouldForceSeed);
      this.loadOrSeed('anonymousMessages', [], false);
    } else {
      this.memoryStore['siteSettings'] = DEFAULT_SETTINGS;
      this.memoryStore['projects'] = DEFAULT_PROJECTS;
      this.memoryStore['learningTopics'] = DEFAULT_LEARNING;
      this.memoryStore['games'] = DEFAULT_GAMES;
      this.memoryStore['songs'] = DEFAULT_SONGS;
      this.memoryStore['playlists'] = DEFAULT_PLAYLISTS;
      this.memoryStore['watchlist'] = DEFAULT_WATCHLIST;
      this.memoryStore['publishedQA'] = DEFAULT_PUBLISHED_QA;
      this.memoryStore['publicActivity'] = DEFAULT_ACTIVITY;
      this.memoryStore['anonymousMessages'] = [];
    }
  }

  private initFirestore() {
    if (typeof window === 'undefined' || this.isListeningToFirestore) return;
    this.isListeningToFirestore = true;

    try {
      listenDocument<SiteSettings>('siteSettings', 'general', (data) => {
        if (data && Object.keys(data).length > 1) {
          this.updateLocal('siteSettings', { ...DEFAULT_SETTINGS, ...data });
        }
      });

      listenDocument<PublicActivity>('publicActivity', 'current', (data) => {
        if (data && Object.keys(data).length > 1) {
          this.updateLocal('publicActivity', { ...DEFAULT_ACTIVITY, ...data });
        }
      });

      const collectionsToListen = [
        { col: 'projects', key: 'projects' },
        { col: 'learningTopics', key: 'learningTopics' },
        { col: 'games', key: 'games' },
        { col: 'songs', key: 'songs' },
        { col: 'playlists', key: 'playlists' },
        { col: 'watchlist', key: 'watchlist' },
        { col: 'publishedQA', key: 'publishedQA' },
        { col: 'anonymousMessages', key: 'anonymousMessages' }
      ];

      collectionsToListen.forEach(({ col, key }) => {
        listenCollection(col, (items) => {
          if (items && items.length > 0) {
            this.updateLocal(key, items);
          }
        });
      });
    } catch (e) {
      console.warn('Firestore live listener notice:', e);
    }
  }

  private loadOrSeed(key: string, defaultValue: any, forceSeed: boolean = false) {
    try {
      if (forceSeed) {
        this.memoryStore[key] = defaultValue;
        localStorage.setItem(`sid_universe_${key}`, JSON.stringify(defaultValue));
        return;
      }
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

  private updateLocal(key: string, value: any) {
    this.memoryStore[key] = value;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`sid_universe_${key}`, JSON.stringify(value));
        window.dispatchEvent(new CustomEvent('sid_store_updated', { detail: { key, value } }));
      } catch (e) {}
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
    this.updateLocal(key, value);
    if (typeof window !== 'undefined') {
      this.syncToFirestore(key, value).catch(() => {});
    }
  }

  private async syncToFirestore(key: string, value: any) {
    try {
      if (key === 'siteSettings') {
        await saveDocument('siteSettings', 'general', value);
      } else if (key === 'publicActivity') {
        await saveDocument('publicActivity', 'current', value);
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (item && item.id) {
            await saveDocument(key, item.id, item);
          }
        }
      }
    } catch (e) {
      // Non-blocking fallback
    }
  }
}

export const universeStore = new UniverseStore();
