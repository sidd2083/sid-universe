const { exec } = require('child_process');
const os = require('os');

// Common game executable names and patterns
const KNOWN_GAMES = [
  { process: 'valorant', name: 'Valorant', category: 'Tactical Shooter' },
  { process: 'cs2', name: 'Counter-Strike 2', category: 'Competitive FPS' },
  { process: 'csgo', name: 'Counter-Strike: Global Offensive', category: 'FPS' },
  { process: 'leagueclientux', name: 'League of Legends', category: 'MOBA' },
  { process: 'dota2', name: 'Dota 2', category: 'MOBA' },
  { process: 'javaw', name: 'Minecraft', category: 'Sandbox / Survival' },
  { process: 'minecraft', name: 'Minecraft', category: 'Sandbox / Survival' },
  { process: 'gta5', name: 'Grand Theft Auto V', category: 'Open World' },
  { process: 'cyberpunk2077', name: 'Cyberpunk 2077', category: 'RPG' },
  { process: 'eldenring', name: 'Elden Ring', category: 'Action RPG' },
  { process: 'genshinimpact', name: 'Genshin Impact', category: 'Action RPG' },
  { process: 'starrail', name: 'Honkai: Star Rail', category: 'Turn-Based RPG' },
  { process: 'r5apex', name: 'Apex Legends', category: 'Battle Royale' },
  { process: 'fortniteclient-win64-shipping', name: 'Fortnite', category: 'Battle Royale' },
  { process: 'overwatch', name: 'Overwatch 2', category: 'Hero Shooter' },
  { process: 'rocketleague', name: 'Rocket League', category: 'Sports / Arcade' },
  { process: 'robloxplayerbeta', name: 'Roblox', category: 'Sandbox' },
  { process: 'destiny2', name: 'Destiny 2', category: 'MMO FPS' },
  { process: 'baldursgate3', name: 'Baldur\'s Gate 3', category: 'RPG' },
  { process: 'bg3', name: 'Baldur\'s Gate 3', category: 'RPG' },
  { process: 'steam', name: 'Steam Gaming', category: 'Gaming Platform' }
];

class ActivityDetector {
  constructor() {
    this.lastDetectedGame = null;
    this.lastDetectedMusic = null;
    this.lastDetectedCoding = null;
    this.browserReportedMedia = null;
  }

  // Set media received from browser extension (YouTube, YT Music, etc.)
  setBrowserMedia(mediaData) {
    this.browserReportedMedia = mediaData;
  }

  // Scan running processes on Windows using PowerShell to find active games & tools
  detectRunningProcesses() {
    return new Promise((resolve) => {
      if (os.platform() !== 'win32') {
        return resolve({ game: null, coding: null, music: null });
      }

      // Query process name and main window titles
      const psCommand = `powershell -NoProfile -Command "Get-Process | Where-Object { $_.MainWindowTitle -ne '' } | Select-Object ProcessName, MainWindowTitle | ConvertTo-Json"`;

      exec(psCommand, { timeout: 4000 }, (err, stdout) => {
        let detectedGame = null;
        let detectedCoding = null;
        let detectedMusic = null;

        if (!err && stdout.trim()) {
          try {
            let processes = JSON.parse(stdout.trim());
            if (!Array.isArray(processes)) {
              processes = [processes];
            }

            for (const p of processes) {
              const pName = (p.ProcessName || '').toLowerCase();
              const wTitle = p.MainWindowTitle || '';

              // Check for known games
              const matchedGame = KNOWN_GAMES.find((g) => pName.includes(g.process) || wTitle.toLowerCase().includes(g.name.toLowerCase()));
              if (matchedGame && !detectedGame) {
                detectedGame = {
                  title: matchedGame.name,
                  category: matchedGame.category,
                  windowTitle: wTitle,
                  detectedAt: new Date().toISOString()
                };
              }

              // Check for VS Code coding activity
              if (pName.includes('code') && wTitle.includes('Visual Studio Code')) {
                // Window title in VS Code format: "filename - projectname - Visual Studio Code"
                const parts = wTitle.split(' - Visual Studio Code')[0].split(' - ');
                const project = parts[parts.length - 1] || 'SID UNIVERSE';
                const file = parts.length > 1 ? parts[0] : 'Workspace';
                detectedCoding = {
                  project: project.trim(),
                  file: file.trim(),
                  editor: 'Visual Studio Code',
                  detectedAt: new Date().toISOString()
                };
              }

              // Check for Spotify desktop client
              if (pName.includes('spotify') && wTitle && wTitle !== 'Spotify' && wTitle !== 'Spotify Free' && wTitle !== 'Spotify Premium') {
                // Spotify window title when playing is: "Artist - Track"
                const parts = wTitle.split(' - ');
                if (parts.length >= 2) {
                  detectedMusic = {
                    title: parts.slice(1).join(' - ').trim(),
                    artist: parts[0].trim(),
                    source: 'Spotify Desktop',
                    detectedAt: new Date().toISOString()
                  };
                }
              }
            }
          } catch (parseError) {
            // Ignore parse errors from partial JSON
          }
        }

        // Check if browser extension reported media (YouTube / YouTube Music)
        if (!detectedMusic && this.browserReportedMedia && (Date.now() - this.browserReportedMedia.timestamp < 15000)) {
          detectedMusic = {
            title: this.browserReportedMedia.title || 'YouTube Audio',
            artist: this.browserReportedMedia.channel || 'YouTube',
            source: this.browserReportedMedia.source || 'YouTube',
            url: this.browserReportedMedia.url || '',
            detectedAt: new Date().toISOString()
          };
        }

        this.lastDetectedGame = detectedGame;
        this.lastDetectedCoding = detectedCoding;
        this.lastDetectedMusic = detectedMusic;

        resolve({
          game: detectedGame,
          coding: detectedCoding,
          music: detectedMusic
        });
      });
    });
  }
}

module.exports = new ActivityDetector();
