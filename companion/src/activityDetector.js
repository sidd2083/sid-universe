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
  { process: 'csgo', name: 'Counter-Strike 2', category: 'Competitive FPS' },
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

    // Duration tracking
    this.currentActiveApp = null;
    this.activeAppStartTime = Date.now();
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
        return resolve(this.formatResult(null, null, null, null, this.browserReportedTab));
      }

      // Safe Windows process enumeration without dropping processes lacking MainWindowTitle
      const psCommand = `powershell -NoProfile -Command "Get-Process | Select-Object ProcessName, MainWindowTitle | ConvertTo-Json -Compress"`;

      exec(psCommand, { timeout: 4000 }, (err, stdout) => {
        let detectedGame = null;
        let detectedCoding = null;
        let detectedMusic = null;
        let detectedApp = null;
        let appDetails = null;

        if (!err && stdout && stdout.trim()) {
          try {
            let processes = JSON.parse(stdout.trim());
            if (!Array.isArray(processes)) {
              processes = [processes];
            }

            for (const p of processes) {
              const pName = (p.ProcessName || '').toLowerCase();
              const wTitle = p.MainWindowTitle || '';

              // 1. Check Games (matches ProcessName or MainWindowTitle)
              const gameMatch = KNOWN_GAMES.find((g) =>
                pName.includes(g.process) || (wTitle && wTitle.toLowerCase().includes(g.name.toLowerCase()))
              );
              if (gameMatch && !detectedGame) {
                detectedGame = {
                  title: gameMatch.name,
                  category: gameMatch.category,
                  detectedAt: new Date().toISOString()
                };
                detectedApp = gameMatch.name;
                appDetails = `Playing ${gameMatch.name}`;
              }

              // 2. Check Creative & Coding
              if (pName.includes('code')) {
                let project = 'StudentHub Nepal';
                let file = 'Workspace';
                if (wTitle.includes('Visual Studio Code')) {
                  const parts = wTitle.split(' - Visual Studio Code')[0].split(' - ');
                  project = parts[parts.length - 1] || 'StudentHub Nepal';
                  file = parts.length > 1 ? parts[0] : 'Workspace';
                }
                detectedCoding = {
                  project: project.trim(),
                  file: file.trim(),
                  editor: 'Visual Studio Code',
                  detectedAt: new Date().toISOString()
                };
                if (!detectedApp) {
                  detectedApp = 'Visual Studio Code';
                  appDetails = `Coding ${project.trim()}`;
                }
              } else if (pName.includes('blender')) {
                detectedCoding = {
                  project: '3D Project',
                  file: 'Scene.blend',
                  editor: 'Blender',
                  detectedAt: new Date().toISOString()
                };
                if (!detectedApp) {
                  detectedApp = 'Blender';
                  appDetails = '3D Modeling';
                }
              } else if (pName.includes('photoshop')) {
                detectedCoding = {
                  project: 'Design Workspace',
                  file: 'Asset.psd',
                  editor: 'Adobe Photoshop',
                  detectedAt: new Date().toISOString()
                };
                if (!detectedApp) {
                  detectedApp = 'Adobe Photoshop';
                  appDetails = 'Graphic Design';
                }
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
                  if (!detectedApp) {
                    detectedApp = 'Spotify';
                    appDetails = `${detectedMusic.title} by ${detectedMusic.artist}`;
                  }
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
          Date.now() - this.browserReportedTab.timestamp < 25000 &&
          this.browserReportedTab.title
        ) {
          if (this.browserReportedTab.title.includes('YouTube')) {
            const cleanTitle = this.browserReportedTab.title.replace(' - YouTube', '').trim();
            detectedMusic = {
              title: cleanTitle,
              artist: this.browserReportedTab.channel || 'YouTube',
              source: 'YouTube',
              url: this.browserReportedTab.url || '',
              detectedAt: new Date().toISOString()
            };
            if (!detectedApp) {
              detectedApp = 'Google Chrome';
              appDetails = `Watching: ${cleanTitle}`;
            }
          }
        }

        resolve(this.formatResult(detectedGame, detectedCoding, detectedMusic, detectedApp, appDetails));
      });
    });
  }

  formatResult(game, coding, music, app, details) {
    this.lastDetectedGame = game;
    this.lastDetectedCoding = coding;
    this.lastDetectedMusic = music;
    this.lastDetectedApp = app;

    // Track active application and duration
    const currentIdentity = app || (this.browserReportedTab?.title ? 'Google Chrome' : 'Idle');
    if (this.currentActiveApp !== currentIdentity) {
      this.currentActiveApp = currentIdentity;
      this.activeAppStartTime = Date.now();
    }

    const durationMinutes = Math.max(1, Math.floor((Date.now() - this.activeAppStartTime) / 60000));

    // Build human-friendly action text
    let siddhantAction = 'Siddhant is currently exploring ideas';
    if (game) {
      siddhantAction = `Siddhant is currently playing ${game.title}`;
    } else if (coding) {
      if (coding.editor === 'Visual Studio Code') {
        siddhantAction = `Siddhant is currently coding ${coding.project || 'StudentHub Nepal'}`;
      } else if (coding.editor === 'Blender') {
        siddhantAction = 'Siddhant is currently 3D modeling in Blender';
      } else if (coding.editor === 'Adobe Photoshop') {
        siddhantAction = 'Siddhant is currently designing in Photoshop';
      }
    } else if (music && music.source === 'YouTube') {
      siddhantAction = `Siddhant is currently watching YouTube: "${music.title}"`;
    } else if (music) {
      siddhantAction = `Siddhant is currently listening to ${music.title} by ${music.artist}`;
    } else if (app) {
      siddhantAction = `Siddhant is currently using ${app}`;
    }

    return {
      game,
      coding,
      music,
      currentApp: app,
      appDetails: details,
      siddhantAction,
      durationMinutes,
      activeSince: new Date(this.activeAppStartTime).toISOString(),
      browserTab: this.browserReportedTab
    };
  }
}

module.exports = new ActivityDetector();
