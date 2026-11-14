const { spawn } = require('child_process');
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
  { process: 'cyberpunk2077', name: 'Cyberpunk 2077', category: 'RPG' }
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
    this.manualStatus = null;
    this.manualAppName = null;
    this.manualDetails = null;

    // Duration tracking
    this.currentActiveApp = null;
    this.activeAppStartTime = Date.now();
  }

  setManualStatus(statusText, appName = 'Manual Activity', details = null) {
    this.manualStatus = statusText ? statusText.trim() : null;
    this.manualAppName = appName;
    this.manualDetails = details;
  }

  clearManualStatus() {
    this.manualStatus = null;
    this.manualAppName = null;
    this.manualDetails = null;
  }

  // Get active running windows for the window selector
  getRunningWindows() {
    return new Promise((resolve) => {
      if (os.platform() !== 'win32') {
        return resolve([]);
      }

      const ps = spawn('powershell.exe', [
        '-NoProfile',
        '-Command',
        'Get-Process | Where-Object { $_.MainWindowTitle -ne "" } | Select-Object ProcessName, MainWindowTitle, Id | ConvertTo-Json -Compress'
      ], { timeout: 6000 });

      let stdout = '';
      ps.stdout.on('data', (c) => { stdout += c.toString(); });
      ps.on('error', () => resolve([]));
      ps.on('close', () => {
        try {
          if (!stdout || !stdout.trim()) return resolve([]);
          let items = JSON.parse(stdout.trim());
          if (!Array.isArray(items)) items = [items];
          const filtered = items.filter(i =>
            i.MainWindowTitle &&
            i.MainWindowTitle.trim() &&
            i.ProcessName !== 'powershell' &&
            !i.MainWindowTitle.includes('Sid Companion')
          );
          resolve(filtered);
        } catch (e) {
          resolve([]);
        }
      });
    });
  }

  // Set selected window task explicitly
  setSelectedWindow(processName, windowTitle) {
    if (!processName || processName === '__auto__') {
      this.clearManualStatus();
      return { auto: true };
    }

    const pLower = (processName || '').toLowerCase();
    const wTitle = (windowTitle || '').trim();

    let status = `Siddhant is currently using ${wTitle || processName}`;
    let appName = processName;

    // Check games
    const gameMatch = KNOWN_GAMES.find(g => pLower.includes(g.process) || (wTitle && wTitle.toLowerCase().includes(g.name.toLowerCase())));
    if (gameMatch) {
      status = `Siddhant is currently playing ${gameMatch.name}`;
      appName = gameMatch.name;
    } else if (pLower.includes('code')) {
      appName = 'Visual Studio Code';
      if (wTitle) {
        const clean = wTitle.replace(/\s*[-—]\s*Visual Studio Code.*$/i, '').trim();
        const parts = clean.split(/\s*[-—]\s*/);
        const proj = parts[parts.length - 1] || '';
        status = proj && proj !== 'Visual Studio Code' ? `Siddhant is currently coding ${proj}` : 'Siddhant is currently coding in VS Code';
      } else {
        status = 'Siddhant is currently coding in VS Code';
      }
    } else if (pLower.includes('spotify')) {
      appName = 'Spotify';
      status = wTitle && !['Spotify', 'Spotify Free'].includes(wTitle) ? `Siddhant is currently listening to ${wTitle}` : 'Siddhant is currently listening to Spotify';
    } else if (pLower.includes('chrome')) {
      appName = 'Google Chrome';
      if (wTitle.toLowerCase().includes('youtube')) {
        const vid = wTitle.replace(/\s*-\s*YouTube.*$/i, '').trim();
        status = `Siddhant is currently watching YouTube: "${vid}"`;
      } else {
        status = wTitle ? `Siddhant is currently browsing "${wTitle.replace(/\s*-\s*Google Chrome.*$/i, '').trim()}"` : 'Siddhant is currently browsing in Chrome';
      }
    } else if (pLower.includes('discord')) {
      appName = 'Discord';
      status = 'Siddhant is currently hanging out on Discord';
    } else if (pLower.includes('blender')) {
      appName = 'Blender';
      status = 'Siddhant is currently 3D modeling in Blender';
    } else if (pLower.includes('photoshop')) {
      appName = 'Adobe Photoshop';
      status = 'Siddhant is currently designing in Photoshop';
    }

    this.setManualStatus(status, appName, wTitle);
    return { status, appName, wTitle };
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
      // If manual status is locked, return immediately with manual status
      if (this.manualStatus) {
        return resolve(this.formatResult(
          null,
          null,
          null,
          this.manualAppName || 'Activity Preset',
          this.manualDetails || this.manualStatus,
          this.manualStatus
        ));
      }

      if (os.platform() !== 'win32') {
        return resolve(this.formatResult(null, null, null, null, this.browserReportedTab));
      }

      let stdout = '';
      const ps = spawn('powershell.exe', [
        '-NoProfile',
        '-Command',
        'Get-Process | Select-Object ProcessName, MainWindowTitle | ConvertTo-Json -Compress'
      ], { timeout: 6000 });

      ps.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      ps.on('error', () => {
        resolve(this.formatResult(null, null, null, null, null));
      });

      ps.on('close', () => {
        let detectedGame = null;
        let detectedCoding = null;
        let detectedMusic = null;
        let detectedApp = null;
        let appDetails = null;

        if (stdout && stdout.trim()) {
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
              if (pName.includes('code') && !detectedCoding) {
                let project = '';
                let file = '';
                if (wTitle) {
                  // e.g. "page.tsx - sid-universe - Visual Studio Code" or "● main.js - my-app"
                  const clean = wTitle.replace(/\s*[-—]\s*Visual Studio Code.*$/i, '').trim();
                  const parts = clean.split(/\s*[-—]\s*/);
                  if (parts.length >= 2) {
                    file = parts[0].replace(/^[●*]\s*/, '').trim();
                    project = parts[parts.length - 1].trim();
                  } else if (parts.length === 1 && parts[0] && parts[0] !== 'Visual Studio Code') {
                    project = parts[0].trim();
                  }
                }

                detectedCoding = {
                  project: project || 'Workspace',
                  file: file || 'Code',
                  editor: 'Visual Studio Code',
                  detectedAt: new Date().toISOString()
                };
                if (!detectedApp) {
                  detectedApp = 'Visual Studio Code';
                  appDetails = project ? `Coding ${project}` : 'Coding in VS Code';
                }
              } else if (pName.includes('blender') && !detectedCoding) {
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
              } else if (pName.includes('photoshop') && !detectedCoding) {
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
                !['Spotify', 'Spotify Free', 'Spotify Premium'].includes(wTitle) &&
                !detectedMusic
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

        // 4. Browser reported activity (from Chrome extension)
        // Keep active browser tab as long as it was reported, with an extended 15-minute window or indefinite if browser process exists
        const hasChromeProcess = processes.some(p => (p.ProcessName || '').toLowerCase().includes('chrome'));
        const isBrowserRecent = this.browserReportedTab && (
          hasChromeProcess || (Date.now() - this.browserReportedTab.timestamp < 15 * 60 * 1000)
        );
        if (isBrowserRecent && this.browserReportedTab.title) {
          const tab = this.browserReportedTab;
          const cleanTitle = (tab.title || '').trim();
          const domain = (tab.domain || '').toLowerCase();

          if (cleanTitle.toLowerCase().includes('youtube') || domain.includes('youtube.com') || tab.source === 'YouTube') {
            const videoTitle = cleanTitle.replace(/\s*-\s*YouTube.*$/i, '').trim();
            detectedMusic = {
              title: videoTitle,
              artist: tab.channel || 'YouTube',
              source: 'YouTube',
              url: tab.url || '',
              detectedAt: new Date().toISOString()
            };
            if (!detectedApp || detectedApp === 'Google Chrome') {
              detectedApp = 'Google Chrome';
              appDetails = `Watching: ${videoTitle}`;
            }
          } else {
            // General Chrome web browsing
            if (!detectedApp && !detectedGame && !detectedCoding) {
              detectedApp = 'Google Chrome';
              appDetails = cleanTitle;
            }
          }
        }

        resolve(this.formatResult(detectedGame, detectedCoding, detectedMusic, detectedApp, appDetails));
      });
    });
  }

  formatResult(game, coding, music, app, details, manualOverride = null) {
    this.lastDetectedGame = game;
    this.lastDetectedCoding = coding;
    this.lastDetectedMusic = music;
    this.lastDetectedApp = app;

    // Track active application and duration
    const currentIdentity = manualOverride || app || (this.browserReportedTab?.title ? 'Google Chrome' : 'Exploring');
    if (this.currentActiveApp !== currentIdentity) {
      this.currentActiveApp = currentIdentity;
      this.activeAppStartTime = Date.now();
    }

    const durationMinutes = Math.max(1, Math.floor((Date.now() - this.activeAppStartTime) / 60000));

    // Build human-friendly action text
    let siddhantAction = manualOverride || 'Siddhant is currently exploring ideas';
    if (!manualOverride) {
      if (game) {
        siddhantAction = `Siddhant is currently playing ${game.title}`;
      } else if (coding) {
        if (coding.editor === 'Visual Studio Code') {
          if (coding.project && coding.project !== 'Workspace') {
            siddhantAction = `Siddhant is currently coding ${coding.project}`;
          } else if (coding.file && coding.file !== 'Code') {
            siddhantAction = `Siddhant is currently working on ${coding.file} in VS Code`;
          } else {
            siddhantAction = 'Siddhant is currently coding in VS Code';
          }
        } else if (coding.editor === 'Blender') {
          siddhantAction = 'Siddhant is currently 3D modeling in Blender';
        } else if (coding.editor === 'Adobe Photoshop') {
          siddhantAction = 'Siddhant is currently designing in Photoshop';
        }
      } else if (music && music.source === 'YouTube') {
        siddhantAction = `Siddhant is currently watching YouTube: "${music.title}"`;
      } else if (music) {
        siddhantAction = `Siddhant is currently listening to ${music.title} by ${music.artist}`;
      } else if (app === 'Google Chrome') {
        if (details && details.startsWith('Watching: ')) {
          siddhantAction = `Siddhant is currently watching YouTube: "${details.replace('Watching: ', '')}"`;
        } else if (details && details.toLowerCase().includes('github')) {
          siddhantAction = `Siddhant is currently browsing GitHub: "${details.replace(/\s*·\s*GitHub.*$/i, '').trim()}"`;
        } else if (details && details.toLowerCase().includes('studenthub')) {
          siddhantAction = 'Siddhant is currently testing StudentHub Nepal';
        } else if (details) {
          siddhantAction = `Siddhant is currently browsing "${details}"`;
        } else {
          siddhantAction = 'Siddhant is currently browsing in Chrome';
        }
      } else if (app) {
        siddhantAction = `Siddhant is currently using ${app}`;
      }
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
