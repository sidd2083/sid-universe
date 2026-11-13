import { PlanetConfig } from './types';

export const INITIAL_PLANETS: PlanetConfig[] = [
  {
    id: 'chronicle',
    name: 'CHRONICLE',
    sector: 'Sector 01: Identity & Origins',
    path: '/about',
    description: 'The ancestral origin sphere holding Sid\'s story, core background, personal philosophy, milestones, and timeline.',
    color: '#6366f1', // Indigo
    emissiveColor: '#312e81',
    radius: 0.52,
    orbitRadius: 3.2,
    orbitSpeed: 0.0075,
    rotationSpeed: 0.012,
    rings: false,
    texturePattern: 'continents',
    visible: true,
    order: 1
  },
  {
    id: 'forge',
    name: 'FORGE',
    sector: 'Sector 02: Works & Creations',
    path: '/portfolio',
    description: 'The industrial creation foundry housing production web systems, AI experiments, mobile projects, and technical architectures.',
    color: '#06b6d4', // Cyan
    emissiveColor: '#164e63',
    radius: 0.65,
    orbitRadius: 4.8,
    orbitSpeed: 0.0055,
    rotationSpeed: 0.009,
    rings: true,
    ringColor: 'rgba(6, 182, 212, 0.4)',
    texturePattern: 'cyber',
    visible: true,
    order: 2
  },
  {
    id: 'synapse',
    name: 'SYNAPSE',
    sector: 'Sector 03: Knowledge & Growth',
    path: '/learning',
    description: 'The neural knowledge nexus tracking current studies in machine learning, cybersecurity, advanced programming, and 3D modeling.',
    color: '#a855f7', // Purple
    emissiveColor: '#581c87',
    radius: 0.58,
    orbitRadius: 6.4,
    orbitSpeed: 0.0042,
    rotationSpeed: 0.014,
    rings: false,
    texturePattern: 'waves',
    visible: true,
    order: 3
  },
  {
    id: 'arena',
    name: 'ARENA',
    sector: 'Sector 04: The Gaming Realm',
    path: '/gaming',
    description: 'The competitive proving ground highlighting favorite games, live gaming telemetry from Sid Companion, achievements, and gaming memories.',
    color: '#10b981', // Emerald
    emissiveColor: '#064e3b',
    radius: 0.68,
    orbitRadius: 8.0,
    orbitSpeed: 0.0034,
    rotationSpeed: 0.008,
    rings: true,
    ringColor: 'rgba(16, 185, 129, 0.35)',
    texturePattern: 'craters',
    visible: true,
    order: 4
  },
  {
    id: 'resonance',
    name: 'RESONANCE',
    sector: 'Sector 05: Harmonic Frequencies',
    path: '/music',
    description: 'The acoustic celestial sphere vibrating with curated tracks, playlists, favorite artists, and optional cosmic audio player.',
    color: '#ec4899', // Rose/Pink
    emissiveColor: '#831843',
    radius: 0.62,
    orbitRadius: 9.6,
    orbitSpeed: 0.0028,
    rotationSpeed: 0.015,
    rings: true,
    ringColor: 'rgba(236, 72, 153, 0.45)',
    texturePattern: 'gas',
    visible: true,
    order: 5
  },
  {
    id: 'whisper',
    name: 'WHISPER',
    sector: 'Sector 06: Transmission Frequencies',
    path: '/anonymous-messages',
    description: 'An ethereal nebula planet where visitors cast anonymous messages into space and browse Sid\'s published answers.',
    color: '#38bdf8', // Sky Blue
    emissiveColor: '#075985',
    radius: 0.48,
    orbitRadius: 11.2,
    orbitSpeed: 0.0022,
    rotationSpeed: 0.010,
    rings: false,
    texturePattern: 'mist',
    visible: true,
    order: 6
  },
  {
    id: 'observatory',
    name: 'OBSERVATORY',
    sector: 'Sector 07: Curated Feeds & Media',
    path: '/watchlist',
    description: 'The outer watchpost archiving documentaries, coding tutorials, courses, and educational videos in progress and completed.',
    color: '#f59e0b', // Amber/Gold
    emissiveColor: '#78350f',
    radius: 0.55,
    orbitRadius: 12.8,
    orbitSpeed: 0.0018,
    rotationSpeed: 0.007,
    rings: false,
    texturePattern: 'craters',
    visible: true,
    order: 7
  }
];
