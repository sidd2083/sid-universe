const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const activityDetector = require('./activityDetector');
const apiClient = require('./apiClient');

let mainWindow = null;
let tray = null;
let isQuitting = false;

// Default Local Config
const CONFIG_PATH = path.join(app.getPath('userData'), 'sid-companion-config.json');
let config = {
  apiUrl: 'http://localhost:3000',
  apiToken: 'sid_universe_secret_token_demo_2026',
  stealthMode: false,
  autoLaunch: false,
  shareGaming: true,
  shareMusic: true,
  shareCoding: true,
  shareCustomStatus: true,
  customStatus: 'Exploring the cosmos 🚀'
};

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      config = { ...config, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Failed to read config:', err);
  }
  apiClient.configure(config.apiUrl, config.apiToken);
}

function saveConfig(newConfig) {
  try {
    config = { ...config, ...newConfig };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    apiClient.configure(config.apiUrl, config.apiToken);

    // Apply autoLaunch
    if (process.platform === 'win32') {
      app.setLoginItemSettings({
        openAtLogin: !!config.autoLaunch,
        path: process.execPath
      });
    }
  } catch (err) {
    console.error('Failed to save config:', err);
  }
}

// Local HTTP Server for Chrome Extension integration
let localServer = null;
function startLocalExtensionServer() {
  try {
    localServer = http.createServer((req, res) => {
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      if (req.method === 'POST' && req.url === '/media') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            activityDetector.setBrowserMedia({
              ...data,
              timestamp: Date.now()
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch (e) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }

      res.writeHead(404);
      res.end();
    });

    localServer.listen(49152, '127.0.0.1', () => {
      console.log('Sid Companion Extension receiver listening on 127.0.0.1:49152');
    });

    localServer.on('error', (err) => {
      console.warn('Local extension server port warning:', err.message);
    });
  } catch (e) {
    console.warn('Could not start local receiver:', e.message);
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 820,
    height: 640,
    minWidth: 700,
    minHeight: 520,
    backgroundColor: '#030712',
    icon: path.join(__dirname, '../resources/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    frame: true,
    title: 'SID COMPANION — Universe Telemetry'
  });

  mainWindow.loadFile(path.join(__dirname, 'ui/index.html'));

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });
}

function createTray() {
  // Use a fallback empty or basic icon if resource icon is not yet present
  let iconPath = path.join(__dirname, '../resources/icon.ico');
  if (!fs.existsSync(iconPath)) {
    // Generate a simple 16x16 icon in memory if file doesn't exist
    tray = new Tray(nativeImage.createEmpty());
  } else {
    tray = new Tray(iconPath);
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Sid Companion',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Stealth Mode (Pause Sync)',
      type: 'checkbox',
      checked: config.stealthMode,
      click: (item) => {
        config.stealthMode = item.checked;
        saveConfig(config);
        broadcastStatus();
      }
    },
    { type: 'separator' },
    {
      label: 'Sync Now',
      click: () => syncTelemetry()
    },
    { type: 'separator' },
    {
      label: 'Quit Sid Companion',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('SID UNIVERSE — Companion');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Telemetry scanning & synchronization loop
let latestDetected = { game: null, coding: null, music: null };

async function performActivityScan() {
  try {
    latestDetected = await activityDetector.detectRunningProcesses();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('activity-detected', latestDetected);
    }
  } catch (err) {
    console.error('Scan error:', err);
  }
}

async function syncTelemetry() {
  if (config.stealthMode) {
    // When stealth mode is active, send heartbeat with stealth indicator or paused
    await apiClient.sendHeartbeat();
    broadcastStatus();
    return;
  }

  // Filter approved activity according to user's privacy toggles
  const payload = {
    isOnline: true,
    lastHeartbeat: new Date().toISOString(),
    game: config.shareGaming ? latestDetected.game : null,
    music: config.shareMusic ? latestDetected.music : null,
    coding: config.shareCoding ? latestDetected.coding : null,
    customStatus: config.shareCustomStatus ? config.customStatus : null
  };

  await apiClient.sendActivityUpdate(payload);
  broadcastStatus();
}

function broadcastStatus() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('status-update', {
      isConnected: apiClient.isConnected,
      lastError: apiClient.lastError,
      lastSyncTime: apiClient.lastSyncTime,
      config: config
    });
  }
}

// IPC Handlers
ipcMain.handle('get-config', () => config);
ipcMain.handle('save-config', (_event, newConfig) => {
  saveConfig(newConfig);
  return config;
});
ipcMain.handle('get-status', () => ({
  isConnected: apiClient.isConnected,
  lastError: apiClient.lastError,
  lastSyncTime: apiClient.lastSyncTime,
  latestDetected: latestDetected
}));
ipcMain.handle('trigger-scan', async () => {
  await performActivityScan();
  await syncTelemetry();
  return { success: true };
});
ipcMain.handle('toggle-stealth', () => {
  config.stealthMode = !config.stealthMode;
  saveConfig(config);
  return config.stealthMode;
});
ipcMain.handle('set-custom-status', (_event, status) => {
  config.customStatus = status;
  saveConfig(config);
  syncTelemetry();
  return config.customStatus;
});

// App lifecycle
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    loadConfig();
    createMainWindow();
    createTray();
    startLocalExtensionServer();

    // Start background activity loops
    performActivityScan();
    syncTelemetry();

    // Scan processes every 6 seconds
    setInterval(performActivityScan, 6000);

    // Transmit heartbeat & activity every 12 seconds
    setInterval(syncTelemetry, 12000);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
  });

  app.on('before-quit', () => {
    isQuitting = true;
    if (localServer) {
      try { localServer.close(); } catch (e) {}
    }
  });
}
