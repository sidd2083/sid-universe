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
  TimelineMilestone,
  GreetingLanguage,
  CurrentProjectHighlight
} from './types';
import { listenCollection, listenDocument, saveDocument } from './firestoreService';

export const DEFAULT_GREETINGS: GreetingLanguage[] = [
  { id: 'gr-1', language: 'Nepali', greeting: 'Namaste', pronunciation: 'नमस्ते', enabled: true },
  { id: 'gr-2', language: 'English', greeting: 'Hello', pronunciation: 'Hello', enabled: true },
  { id: 'gr-3', language: 'French', greeting: 'Bonjour', pronunciation: 'bon-ZHOOR', enabled: true },
  { id: 'gr-4', language: 'Spanish', greeting: 'Hola', pronunciation: 'OH-lah', enabled: true },
  { id: 'gr-5', language: 'Italian', greeting: 'Ciao', pronunciation: 'CHOW', enabled: true },
  { id: 'gr-6', language: 'German', greeting: 'Guten Tag', pronunciation: 'GOO-ten TAHK', enabled: true },
  { id: 'gr-7', language: 'Japanese', greeting: 'こんにちは', pronunciation: 'Konnichiwa', enabled: true },
  { id: 'gr-8', language: 'Korean', greeting: '안녕하세요', pronunciation: 'Annyeonghaseyo', enabled: true },
  { id: 'gr-9', language: 'Chinese', greeting: '你好', pronunciation: 'Nǐ hǎo', enabled: true },
  { id: 'gr-10', language: 'Arabic', greeting: 'مرحباً', pronunciation: 'Marhaban', enabled: true },
  { id: 'gr-11', language: 'Russian', greeting: 'Привет', pronunciation: 'Privet', enabled: true },
  { id: 'gr-12', language: 'Portuguese', greeting: 'Olá', pronunciation: 'OH-lah', enabled: true }
];

export const DEFAULT_CURRENT_PROJECT: CurrentProjectHighlight = {
  name: "StudentHub Nepal",
  description: "A centralized platform designed for students in Nepal featuring collaborative study Rooms, report card analytics, progress tracking, gamification, and academic streaks.",
  status: "Currently Building",
  link: "https://studenthubnp.com",
  imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "PostgreSQL"],
  updatedAt: new Date().toISOString()
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: "SID UNIVERSE",
  tagline: "Exploring technology, design, and ideas from Hetauda, Nepal.",
  bio: "Hey, I'm Sid — an independent developer and student from Hetauda, Nepal. I enjoy building thoughtful software, experimenting with Python and full-stack systems, playing games with friends, and learning how things work from the ground up.",
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  nepalTimezone: "Asia/Kathmandu",
  locationCity: "Hetauda, Nepal",
  clockFormat: "12h",
  greetings: DEFAULT_GREETINGS,
  greetingIntervalMs: 3200,
  greetingPaused: false,
  currentProject: DEFAULT_CURRENT_PROJECT,
  footerQuote: {
    quote: "When something is important enough, you do it even if the odds are not in your favor.",
    author: "Elon Musk"
  },
  socialLinks: {
    snapchat: "https://snapchat.com/add/sid",
    discord: "https://discord.com/users/sid",
    steam: "https://steamcommunity.com/id/sid",
    youtube: "https://youtube.com/@sid",
    facebook: "https://facebook.com/sid",
    github: "https://github.com/sidd2083"
  },
  companionToken: "sid_universe_secret_token_demo_2026",
  audioAmbientEnabled: false
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'StudentHub Nepal',
    description: 'A platform designed for students in Nepal with study Rooms, report cards, progress tracking, gamification, leaderboards, and streaks.',
    longDescription: 'StudentHub Nepal is built to solve the fragmentation students face across schools and colleges in Nepal. It combines collaborative study rooms, automatic report card generation, subject-by-subject streak tracking, and interactive peer challenges.',
    whyBuilt: 'During my studies, I noticed students lacked a dedicated, distraction-free environment to track syllabus milestones and study with peers in real time.',
    problemAddressed: 'Provides Nepali students with structured motivation, peer accountability, and clear academic progression metrics.',
    learnings: 'Deepened my understanding of real-time state synchronization, gamification psychology, responsive mobile layout design, and relational schema management.',
    category: 'Student Platform',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase', 'PostgreSQL'],
    status: 'Currently Building',
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
    longDescription: 'GSConfession was launched as an open social platform where students could freely express thoughts, share honest feedback about student life, and communicate without fear of judgment.',
    whyBuilt: 'Built to give students an authentic voice and community space during high school and college seasons.',
    problemAddressed: 'Addressed the absence of open, anonymous student communication channels in our local academic circle.',
    learnings: 'Taught me server management, PHP architecture, database optimization under unexpected traffic spikes, user moderation challenges, and anti-abuse protocols.',
    category: 'Student Platform',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    ],
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
    longDescription: 'A planned lightweight local AI tool that parses curriculum PDFs and generates spaced repetition flashcards and practice test exams.',
    whyBuilt: 'Nepali curriculum students often spend hours searching for old question solutions and chapter summaries.',
    problemAddressed: 'Bridges access to intelligent revision assistants without requiring expensive subscriptions.',
    learnings: 'Currently exploring RAG (Retrieval-Augmented Generation) architectures, vector embeddings, and local quantized models.',
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
  // 1. Currently Learning
  {
    id: 'learn-1',
    title: 'Python Core & Scripting',
    categoryType: 'currently-learning',
    category: 'Programming',
    description: 'Mastering idiomatic Python, object-oriented concepts, generators, decorators, and system automation scripts.',
    notes: 'Working through practical data pipeline exercises and building CLI utilities for daily workflows.',
    resources: [
      { title: 'Python Official Documentation', url: 'https://docs.python.org/3/' },
      { title: 'Automate the Boring Stuff with Python', url: 'https://automatetheboringstuff.com/' }
    ],
    startDate: '2025-11-01',
    status: 'In Progress',
    progress: 75,
    featured: true,
    order: 1
  },
  {
    id: 'learn-2',
    title: 'NumPy & Numerical Computing',
    categoryType: 'currently-learning',
    category: 'Data Science',
    description: 'Multidimensional array manipulation, vectorization, linear algebra routines, and high-performance computation in memory.',
    notes: 'Practicing broadcasting rules and replacing slow for-loops with vectorized mathematical operations.',
    resources: [
      { title: 'NumPy User Guide', url: 'https://numpy.org/doc/stable/' }
    ],
    startDate: '2026-01-15',
    status: 'In Progress',
    progress: 60,
    featured: true,
    order: 2
  },
  {
    id: 'learn-3',
    title: 'Pandas Data Wrangling',
    categoryType: 'currently-learning',
    category: 'Data Science',
    description: 'DataFrames, Series, time series analysis, aggregating, handling missing data, and cleaning raw datasets.',
    notes: 'Analyzing real-world CSV datasets and mastering groupby aggregations and data reshaping.',
    resources: [
      { title: '10 Minutes to Pandas', url: 'https://pandas.pydata.org/docs/user_guide/10min.html' }
    ],
    startDate: '2026-02-01',
    status: 'In Progress',
    progress: 55,
    featured: true,
    order: 3
  },
  {
    id: 'learn-4',
    title: 'Full-Stack Web Architecture',
    categoryType: 'currently-learning',
    category: 'Web Development',
    description: 'Modern Next.js App Router, React Server Components, TypeScript type-safety, Tailwind CSS, and cloud databases.',
    notes: 'Refining architecture patterns on StudentHub Nepal and optimizing production build performance.',
    resources: [
      { title: 'Next.js Documentation', url: 'https://nextjs.org/docs' }
    ],
    startDate: '2024-06-01',
    status: 'In Progress',
    progress: 88,
    featured: true,
    order: 4
  },
  {
    id: 'learn-5',
    title: 'Blender 3D Modeling & Lighting',
    categoryType: 'currently-learning',
    category: '3D & Blender',
    description: 'Hard-surface 3D modeling, topology, UV unwrapping, Cycles and Eevee lighting, and material shaders.',
    notes: 'Practicing low-poly asset creation and clean studio lighting setups.',
    resources: [
      { title: 'Blender Fundamentals', url: 'https://www.blender.org/' }
    ],
    startDate: '2025-08-10',
    status: 'In Progress',
    progress: 45,
    featured: true,
    order: 5
  },
  {
    id: 'learn-6',
    title: 'Adobe Photoshop & Graphic Design',
    categoryType: 'currently-learning',
    category: 'Creative Tools',
    description: 'UI asset composition, photo retouching, poster design, typography hierarchy, and thumbnail creation.',
    notes: 'Creating custom banner designs and exploring minimal editorial layouts.',
    resources: [
      { title: 'Adobe Creative Tutorials', url: 'https://helpx.adobe.com/photoshop/tutorials.html' }
    ],
    startDate: '2024-09-01',
    status: 'In Progress',
    progress: 70,
    featured: true,
    order: 6
  },

  // 2. Want to Learn
  {
    id: 'learn-7',
    title: 'Artificial Intelligence & Machine Learning',
    categoryType: 'want-to-learn',
    category: 'AI & ML',
    description: 'Neural networks from scratch, backpropagation, gradient descent, PyTorch foundations, and fine-tuning open-weights models.',
    notes: 'Aiming to build custom classification models and understand the mathematical foundation behind attention mechanisms.',
    resources: [
      { title: 'Fast.ai Practical Deep Learning for Coders', url: 'https://course.fast.ai/' }
    ],
    status: 'Exploring',
    featured: true,
    order: 7
  },
  {
    id: 'learn-8',
    title: 'Large-Scale Distributed Systems & Rust',
    categoryType: 'want-to-learn',
    category: 'Systems',
    description: 'Memory safety without garbage collection, concurrency primitives, high-throughput microservices, and distributed consensus.',
    notes: 'Want to read The Rust Book and implement a high-speed telemetry server.',
    resources: [
      { title: 'The Rust Programming Language', url: 'https://doc.rust-lang.org/book/' }
    ],
    status: 'Queued',
    featured: true,
    order: 8
  },
  {
    id: 'learn-9',
    title: 'Advanced Creative Shader Programming',
    categoryType: 'want-to-learn',
    category: '3D & Blender',
    description: 'GLSL fragment shaders, Signed Distance Functions, procedural noise, and hardware-accelerated creative visuals.',
    notes: 'Want to study Inigo Quilez tutorials on procedural graphics.',
    resources: [
      { title: 'The Book of Shaders', url: 'https://thebookofshaders.com' }
    ],
    status: 'Queued',
    featured: true,
    order: 9
  }
];

export const DEFAULT_GAMES: Game[] = [
  {
    id: 'game-1',
    title: 'Grand Theft Auto V',
    platform: 'PC',
    genre: 'Open-World Action Adventure',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    description: 'Endless freedom in Los Santos, completing heists with friends, driving across Blaine County at sunset.',
    hoursPlayed: 240,
    achievements: 'Completed all story heists, high-end apartment, custom car garage.',
    memories: 'Cruising through the city while listening to West Coast Classics on late weekend nights.',
    isFavorite: true,
    isCurrentlyPlaying: true,
    order: 1
  },
  {
    id: 'game-2',
    title: 'Minecraft',
    platform: 'Cross-Platform',
    genre: 'Sandbox / Survival',
    coverImage: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80',
    description: 'The timeless canvas of building, survival servers with friends, redstone experiments, and exploration.',
    hoursPlayed: 1100,
    achievements: 'Defeated Ender Dragon in survival, automated iron farm, nether transit line.',
    memories: 'First survival house built on a mountain cliff during high school breaks.',
    isFavorite: true,
    isCurrentlyPlaying: false,
    order: 2
  },
  {
    id: 'game-3',
    title: 'Human: Fall Flat',
    platform: 'PC',
    genre: 'Physics Comedy Puzzle',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    description: 'Hilarious ragdoll physics puzzles that turn into uncontrollable laughter sessions in co-op mode.',
    hoursPlayed: 65,
    achievements: 'Completed all main campaign dreams, discovered secret shortcuts.',
    memories: 'Accidentally throwing friends off the catapult instead of the boulder.',
    isFavorite: true,
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
    title: 'Deep Focus Coding',
    description: 'Calm ambient electronica, low-tempo beats, and minimal acoustic instrumental tracks for flow states.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
    trackCount: 42,
    order: 1
  },
  {
    id: 'play-2',
    title: 'Rain in Hetauda',
    description: 'Mellow melodies, acoustic guitar, and indie songs for quiet afternoons.',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4t95P99014Q',
    trackCount: 30,
    order: 2
  }
];

export const DEFAULT_WATCHLIST: WatchlistItem[] = [
  {
    id: 'watch-1',
    title: 'CS50: Introduction to Computer Science',
    description: 'Harvard University computer science course exploring memory, algorithms, data structures, and web technologies.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://cs50.harvard.edu/',
    category: 'Course',
    addedDate: '2025-10-10',
    status: 'Completed',
    order: 1
  },
  {
    id: 'watch-2',
    title: 'Neural Networks: Zero to Hero by Andrej Karpathy',
    description: 'Deep walkthrough building micrograd and makemore from the ground up in pure Python.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://youtube.com',
    category: 'YouTube',
    addedDate: '2026-01-20',
    status: 'Watching',
    order: 2
  },
  {
    id: 'watch-3',
    title: 'The Principles of Clean Typography & Design Systems',
    description: 'Deep dive into editorial grid systems, font pairings, visual hierarchy, and baseline alignment.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://youtube.com',
    category: 'Tutorial',
    addedDate: '2026-02-15',
    status: 'To Watch',
    order: 3
  }
];

export const DEFAULT_PUBLISHED_QA: PublishedQA[] = [
  {
    id: 'qa-1',
    messageId: 'msg-init-1',
    question: "What made you want to build StudentHub Nepal?",
    reply: "Growing up studying in Nepal, I saw how much time we lost juggling disparate notes, disconnected group chats, and fragmented exam papers. I wanted to build one clean, quiet space where Nepali students could organize their academic life, track streaks, and learn with peers without social media clutter.",
    publishedAt: "2026-02-14T18:30:00Z",
    category: "Projects"
  },
  {
    id: 'qa-2',
    messageId: 'msg-init-2',
    question: "How do you manage staying consistent with learning so many different technologies?",
    reply: "To be honest, consistency is something I constantly wrestle with. I have several half-finished courses and tabs I never close! What helps me is picking one real project (like building a feature for StudentHub or a small Python script) rather than trying to consume endless tutorials passively.",
    publishedAt: "2026-02-28T14:15:00Z",
    category: "Learning"
  },
  {
    id: 'qa-3',
    messageId: 'msg-init-3',
    question: "What are your favorite games to play when you are not coding?",
    reply: "GTA V with friends is always a great laugh. Minecraft when I want to relax and build things, and Human: Fall Flat whenever we just need something completely ridiculous.",
    publishedAt: "2026-03-05T09:40:00Z",
    category: "Gaming"
  }
];

export const DEFAULT_TIMELINE: TimelineMilestone[] = [
  {
    id: 'time-1',
    year: '2021',
    title: 'First Curiosity & Hello World',
    description: 'Wrote my first Python scripts and web pages. Fell in love with the feeling of creating things from pure code.'
  },
  {
    id: 'time-2',
    year: '2023',
    title: 'Building GSConfession',
    description: 'Created and deployed an anonymous student social platform on WordPress and BuddyBoss, handling thousands of student visits.'
  },
  {
    id: 'time-3',
    year: '2024',
    title: 'Modern TypeScript & Frontend Engineering',
    description: 'Transitioned to React, Next.js, TypeScript, and modern UI design principles.'
  },
  {
    id: 'time-4',
    year: '2025',
    title: 'Conception of StudentHub Nepal',
    description: 'Began architecting a comprehensive student platform tailored specifically for school and college students in Nepal.'
  },
  {
    id: 'time-5',
    year: '2026',
    title: 'Personal Digital Workspace',
    description: 'Refined my personal web space, Python data science exploration, and companion desktop ecosystem.'
  }
];

export const DEFAULT_ACTIVITY: PublicActivity = {
  isOnline: true,
  lastHeartbeat: new Date().toISOString(),
  customStatus: "Building StudentHub Nepal & learning Python",
  currentActivityLabel: "Coding in VS Code",
  currentApp: "Visual Studio Code",
  browserTab: {
    title: "Next.js Documentation — App Router",
    domain: "nextjs.org"
  },
  currentGame: {
    title: "Grand Theft Auto V",
    platform: "PC",
    category: "Action Adventure",
    detectedAt: new Date().toISOString()
  },
  currentMusic: {
    title: "Resonance",
    artist: "HOME",
    source: "Spotify",
    detectedAt: new Date().toISOString()
  },
  currentCoding: {
    project: "StudentHub Nepal",
    file: "page.tsx",
    editor: "Visual Studio Code",
    detectedAt: new Date().toISOString()
  },
  currentProject: DEFAULT_CURRENT_PROJECT,
  lastActiveTime: new Date().toISOString(),
  sharingPaused: false
};

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
      this.loadOrSeed('siteSettings', DEFAULT_SETTINGS);
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
        { col: 'timeline', key: 'timeline' },
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
