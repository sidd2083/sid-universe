const { exec } = require('child_process');
const os = require('os');

// Supported processes matching user requirements
const KNOWN_GAMES = [
  { process: 'gta5', name: 'Grand Theft Auto V', category: 'Action Adventure' },
  { process: 'playgtav', name: 'Grand Theft Auto V', category: 'Action Adventure' },
  { process: 'javaw', name: 'Minecraft', category: 'Sandbox / Survival' },
  { process: 'minecraft', name: 'Minecraft', category: 'Sandbox / Survival' },
  { process: 'human', name: 'Human: Fall Flat', category: 'Physics Puzzle' },
  { process: 'cs2', name: 'Counter-Strike 2', category: 'Competitive FPS' },
  { process: 'valorant', name: 'Valorant', category: 'Tactical Shooter' },
  { process: 'cyberpunk2077', name: 'Cyberpunk 2077', category: 'RPG' },
  { process: 'steam', name: 'Steam Gaming', category: 'Platform' }
];

const KNOWN_CREATIVE = [
  { process: 'code', name: 'Visual Studio Code', type: 'coding' },
  { process: 'blender', name: 'Blender', type: '3d' },
  { process: 'photoshop', name: 'Adobe Photoshop', type: 'creative' }
];

class ActivityDetector {
  constructor() {
    this.lastDetectedGame = null;
    this.lastDetectedMusic = null;
    this.lastDetectedCoding = null;
    this.lastDetectedApp = null;
    this.browserReportedTab = null;
  }

  // Receive active tab or media from Chrome extension
  setBrowserTab(tabData) {
    this.browserReportedTab = {
      ...tabData,
      timestamp: Date.now()
    };
  }

  detectRunningProcesses() {
    return new Promise((resolve) => {
      if (os.platform() !== 'win32') {
        return resolve({
          game: null,
          coding: null,
          music: null,
          currentApp: null,
          browserTab: this.browserReportedTab
        });
      }

      // Safe Windows process enumeration
      const psCommand = `powershell -NoProfile -Command "Get-Process | Where-Object { $_.MainWindowTitle -ne '' } | Select-Object ProcessName, MainWindowTitle | ConvertTo-Json"`;

      exec(psCommand, { timeout: 3500 }, (err, stdout) => {
        let detectedGame = null;
        let detectedCoding = null;
        let detectedMusic = null;
        let detectedApp = null;

        if (!err && stdout && stdout.trim()) {
          try {
            let processes = JSON.parse(stdout.trim());
            if (!Array.isArray(processes)) {
              processes = [processes];
            }

            for (const p of processes) {
              const pName = (p.ProcessName || '').toLowerCase();
              const wTitle = p.MainWindowTitle || '';

              // 1. Check Games
              const gameMatch = KNOWN_GAMES.find((g) =>
                pName.includes(g.process) || wTitle.toLowerCase().includes(g.name.toLowerCase())
              );
              if (gameMatch && !detectedGame) {
                detectedGame = {
                  title: gameMatch.name,
                  category: gameMatch.category,
                  detectedAt: new Date().toISOString()
                };
                detectedApp = gameMatch.name;
              }

              // 2. Check Creative & Coding
              if (pName.includes('code') && wTitle.includes('Visual Studio Code')) {
                const parts = wTitle.split(' - Visual Studio Code')[0].split(' - ');
                const project = parts[parts.length - 1] || 'StudentHub Nepal';
                const file = parts.length > 1 ? parts[0] : 'Workspace';
                detectedCoding = {
                  project: project.trim(),
                  file: file.trim(),
                  editor: 'Visual Studio Code',
                  detectedAt: new Date().toISOString()
                };
                if (!detectedApp) detectedApp = 'Visual Studio Code';
              } else if (pName.includes('blender')) {
                detectedCoding = {
                  project: '3D Project',
                  file: 'Scene.blend',
                  editor: 'Blender',
                  detectedAt: new Date().toISOString()
                };
                if (!detectedApp) detectedApp = 'Blender';
              } else if (pName.includes('photoshop')) {
                detectedCoding = {
                  project: 'Design Workspace',
                  file: 'Asset.psd',
                  editor: 'Adobe Photoshop',
                  detectedAt: new Date().toISOString()
                };
                if (!detectedApp) detectedApp = 'Adobe Photoshop';
              }

              // 3. Check Spotify
              if (
                pName.includes('spotify') &&
                wTitle &&
                !['Spotify', 'Spotify Free', 'Spotify Premium'].includes(wTitle)
              ) {
                const parts = wTitle.split(' - ');
                if (parts.length >= 2) {
                  detectedMusic = {
                    title: parts.slice(1).join(' - ').trim(),
                    artist: parts[0].trim(),
                    source: 'Spotify',
                    detectedAt: new Date().toISOString()
                  };
                }
              }
            }
          } catch (e) {
            // Ignore parse warnings
          }
        }

        // 4. Browser reported media (YouTube / YouTube Music)
        if (
          !detectedMusic &&
          this.browserReportedTab &&
          Date.now() - this.browserReportedTab.timestamp < 15000 &&
          this.browserReportedTab.title
        ) {
          if (this.browserReportedTab.title.includes('YouTube')) {
            detectedMusic = {
              title: this.browserReportedTab.title.replace(' - YouTube', '').trim(),
              artist: this.browserReportedTab.channel || 'YouTube',
              source: 'YouTube',
              url: this.browserReportedTab.url || '',
              detectedAt: new Date().toISOString()
            };
            if (!detectedApp) detectedApp = 'Google Chrome';
          }
        }

        this.lastDetectedGame = detectedGame;
        this.lastDetectedCoding = detectedCoding;
        this.lastDetectedMusic = detectedMusic;
        this.lastDetectedApp = detectedApp;

        resolve({
          game: detectedGame,
          coding: detectedCoding,
          music: detectedMusic,
          currentApp: detectedApp,
          browserTab: this.browserReportedTab
        });
      });
    });
  }
}

module.exports = new ActivityDetector();
