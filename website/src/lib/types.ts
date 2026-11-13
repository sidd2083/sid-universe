export interface GreetingLanguage {
  id: string;
  language: string;
  greeting: string;
  pronunciation?: string;
  enabled: boolean;
}

export interface WeatherInfo {
  temperature: number;
  weatherCode: number;
  condition: string;
  isDay: boolean;
  humidity: number;
  windSpeed: number;
  rain: boolean;
  city: string;
  sunrise?: string;
  sunset?: string;
  updatedAt: string;
}

export interface CurrentProjectHighlight {
  name: string;
  description: string;
  status: 'Currently Building' | 'Built' | 'Want to Build';
  link?: string;
  imageUrl?: string;
  technologies?: string[];
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  whyBuilt?: string;
  problemAddressed?: string;
  learnings?: string;
  category: 'Full-Stack' | 'AI & ML' | 'Student Platform' | 'Creative' | 'Systems' | 'Tools';
  coverImage: string;
  screenshots?: string[];
  technologies: string[];
  status: 'Built' | 'Currently Building' | 'Want to Build';
  startDate?: string;
  completionDate?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
}

export interface LearningTopic {
  id: string;
  title: string;
  categoryType: 'currently-learning' | 'want-to-learn';
  category: 'Programming' | 'AI & ML' | 'Data Science' | 'Web Development' | '3D & Blender' | 'Creative Tools' | 'Systems';
  description: string;
  notes?: string;
  resources: { title: string; url: string }[];
  startDate?: string;
  status: 'In Progress' | 'Exploring' | 'Queued' | 'Mastered';
  progress?: number; // 0 to 100 percentage
  featured: boolean;
  order: number;
}

export interface Game {
  id: string;
  title: string;
  platform: 'PC' | 'Steam' | 'PlayStation' | 'Cross-Platform';
  genre: string;
  coverImage: string;
  description: string;
  hoursPlayed?: number;
  achievements?: string;
  memories?: string;
  isFavorite: boolean;
  isCurrentlyPlaying: boolean;
  order: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverArt: string;
  duration?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  audioPreviewUrl?: string;
  genre?: string;
  isFavorite: boolean;
  featured: boolean;
  order: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  spotifyUrl: string;
  trackCount: number;
  order: number;
}

export interface WatchlistItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  sourceUrl: string;
  category: 'YouTube' | 'Tutorial' | 'Course' | 'Documentary' | 'Educational';
  addedDate: string;
  status: 'To Watch' | 'Watching' | 'Completed';
  order: number;
}

export interface AnonymousMessage {
  id: string;
  message: string;
  category?: string;
  createdAt: string;
  isRead: boolean;
  reply?: string;
  isPublished: boolean;
  archived?: boolean;
}

export interface PublishedQA {
  id: string;
  messageId: string;
  question: string;
  reply: string;
  publishedAt: string;
  category?: string;
}

export interface PublicActivity {
  isOnline: boolean;
  lastHeartbeat: string;
  customStatus?: string;
  currentActivityLabel?: string; // e.g. "Watching YouTube", "Coding in VS Code", "Playing GTA V"
  currentApp?: string; // e.g. "Google Chrome", "Visual Studio Code"
  browserTab?: {
    title: string;
    domain?: string;
    url?: string;
  } | null;
  currentGame?: {
    title: string;
    platform?: string;
    category?: string;
    detectedAt: string;
  } | null;
  currentMusic?: {
    title: string;
    artist: string;
    source: string;
    url?: string;
    detectedAt: string;
  } | null;
  currentCoding?: {
    project: string;
    file: string;
    editor: string;
    detectedAt: string;
  } | null;
  currentProject?: CurrentProjectHighlight | null;
  lastActiveTime?: string;
  sharingPaused?: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  bio: string;
  profileImage: string;
  nepalTimezone: string;
  locationCity: string;
  clockFormat: '12h' | '24h';
  greetings: GreetingLanguage[];
  greetingIntervalMs: number;
  greetingPaused: boolean;
  currentProject: CurrentProjectHighlight;
  footerQuote: {
    quote: string;
    author: string;
  };
  socialLinks: {
    snapchat?: string;
    discord?: string;
    steam?: string;
    youtube?: string;
    facebook?: string;
    github?: string;
    twitter?: string;
  };
  companionToken: string;
  audioAmbientEnabled: boolean;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  iconName?: string;
}
