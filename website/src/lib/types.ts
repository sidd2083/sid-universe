export interface PlanetConfig {
  id: string;
  name: string;
  sector: string; // e.g. "Sector 01: Origins"
  path: string; // e.g. "/about"
  description: string;
  color: string;
  emissiveColor: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number; // orbital rotation speed
  rotationSpeed: number; // self-axial rotation
  rings?: boolean;
  ringColor?: string;
  texturePattern: 'craters' | 'rings' | 'continents' | 'gas' | 'cyber' | 'waves' | 'mist';
  visible: boolean;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: 'Full-Stack' | 'AI & ML' | '3D & Creative' | 'Mobile & Desktop' | 'Tools';
  coverImage: string;
  screenshots?: string[];
  technologies: string[];
  status: 'Completed' | 'Currently Building' | 'Planned Idea';
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
  category: 'Programming' | 'AI & ML' | 'Cybersecurity' | 'Web Development' | '3D & Blender' | 'Video Editing' | 'DevOps';
  description: string;
  notes: string;
  resources: { title: string; url: string }[];
  startDate: string;
  status: 'In Progress' | 'Mastered' | 'Queued';
  progress?: number; // 0 to 100 percentage
  featured: boolean;
  order: number;
}

export interface Game {
  id: string;
  title: string;
  platform: 'PC' | 'PlayStation' | 'Steam' | 'Cross-Platform';
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
  audioPreviewUrl?: string; // Optional MP3 preview
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
  currentGame?: {
    title: string;
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
  lastActiveTime?: string;
}

export interface SiteSettings {
  siteTitle: string;
  tagline: string;
  bio: string;
  profileImage: string;
  nepalTimezone: string;
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
