export interface GreetingLanguage {
  id: string;
  language: string;
  greeting: string;
  enabled: boolean;
}

export interface CurrentProjectHighlight {
  name: string;
  description: string;
  personalStory: string;
  status: 'Recent Big Project' | 'Currently Building' | 'Built' | 'Want to Build';
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
  personalStory?: string;
  whyBuilt?: string;
  problemAddressed?: string;
  learnings?: string;
  category: 'Student Platform' | 'Full-Stack' | 'AI & ML' | 'Creative' | 'Tools';
  coverImage: string;
  screenshots?: string[];
  technologies: string[];
  status: 'Recent Big Project' | 'Built' | 'Currently Building' | 'Want to Build';
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
  category: 'Programming & Data' | 'Mathematics' | 'Creative' | 'AI & ML' | 'Computer Vision' | 'Programming';
  description?: string;
  progress?: number;
  order: number;
  status?: string;
  notes?: string;
  resources?: { title: string; url: string }[];
  featured?: boolean;
}

export interface Game {
  id: string;
  title: string;
  platform: 'PC' | 'Cross-Platform';
  genre: string;
  description: string;
  hoursPlayed?: number;
  memories?: string;
  isCurrentlyPlaying?: boolean;
  order: number;
  achievements?: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  spotifyUrl?: string;
  genre?: string;
  featured: boolean;
  order: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  spotifyUrl: string;
  trackCount: number;
  order: number;
}

export interface WatchlistItem {
  id: string;
  title: string;
  description: string;
  sourceUrl?: string;
  category: 'YouTube' | 'Course' | 'Tutorial' | 'Documentary' | 'Cinema' | string;
  type?: 'Movie' | 'Anime' | 'Series' | string;
  rating?: number;
  thoughts?: string;
  status: 'Watching' | 'To Watch' | 'Completed' | string;
  order: number;
}

export interface AnonymousMessage {
  id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  reply?: string;
  isPublished: boolean;
  category?: string;
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
  siddhantAction: string; // e.g. "Siddhant is currently playing Grand Theft Auto V"
  appName?: string; // e.g. "Grand Theft Auto V", "Visual Studio Code", "Google Chrome"
  appDetails?: string; // e.g. "Watching: Interstellar Soundtrack on YouTube"
  durationMinutes?: number; // e.g. 35
  activeSince?: string;
  customStatus?: string;
  lastActiveTime?: string;
  sharingPaused?: boolean;
  currentActivityLabel?: string;
  currentGame?: {
    title: string;
    category?: string;
    platform?: string;
    detectedAt?: string;
  } | null;
  currentCoding?: {
    project: string;
    file?: string;
    editor?: string;
    detectedAt?: string;
  } | null;
  currentMusic?: {
    title: string;
    artist?: string;
    source?: string;
    url?: string;
    detectedAt?: string;
  } | null;
  browserTab?: {
    title?: string;
    url?: string;
    channel?: string;
    timestamp?: number;
  } | null;
}

export interface WeatherInfo {
  temp?: number;
  temperature?: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  city?: string;
  isDay?: boolean;
  rain?: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  authorName: string;
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
  philosophicalQuote?: {
    quote: string;
    author: string;
  };
  learningDisclaimer?: string;
  footerQuote?: {
    quote: string;
    author: string;
  } | string;
  companionToken?: string;
  backgroundMusic?: {
    enabled: boolean;
    title: string;
    artist?: string;
    audioUrl: string;
    autoplay?: boolean;
  };
  liveStream?: {
    url: string;
    title: string;
  };
  socialLinks: {
    snapchat?: string;
    discord?: string;
    steam?: string;
    youtube?: string;
    facebook?: string;
    github?: string;
  };
}

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  order: number;
}
