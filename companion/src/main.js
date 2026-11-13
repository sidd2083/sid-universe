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
  shareActivity: true, // Master Switch
  shareBrowser: true,
  shareGaming: true,
  shareMusic: true,
  shareCoding: true,
  customStatus: 'Building StudentHub Nepal & learning Python',
  currentProject: 'StudentHub Nepal',
  autoLaunch: false
};

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      config = { ...config, ...JSON.parse(data) };
    }
  } catch (err) {
    console.warn('Failed to read config file:', err);
  }
  apiClient.configure(config.apiUrl, config.apiToken);
}

function saveConfig(newConfig) {
  try {
    config = { ...config, ...newConfig };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    apiClient.configure(config.apiUrl, config.apiToken);

    if (process.platform === 'win32') {
      app.setLoginItemSettings({
        openAtLogin: !!config.autoLaunch,
        path: process.execPath
      });
    }
  } catch (err) {
    console.warn('Failed to save config:', err);
  }
}

// Local HTTP Server for Chrome Extension integration (Port 49152)
let localServer = null;
function startLocalExtensionServer() {
  try {
    localServer = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      if (req.method === 'POST' && (req.url === '/activity' || req.url === '/media')) {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            activityDetector.setBrowserTab(data);
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
      console.log('Sid Companion extension bridge active on 127.0.0.1:49152');
    });

    localServer.on('error', (err) => {
      console.warn('Local extension port 49152 notice:', err.message);
    });
  } catch (e) {
    console.warn('Could not launch local receiver:', e.message);
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 760,
    height: 600,
    minWidth: 640,
    minHeight: 500,
    backgroundColor: '#FAF9F6', // Apple warm white
    icon: path.join(__dirname, '../resources/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    frame: true,
    title: 'Sid Companion'
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
  const iconPath = path.join(__dirname, '../resources/icon.ico');
  tray = fs.existsSync(iconPath) ? new Tray(iconPath) : new Tray(nativeImage.createEmpty());

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
      label: 'Share Activity',
      type: 'checkbox',
      checked: config.shareActivity,
      click: (item) => {
        config.shareActivity = item.checked;
        saveConfig(config);
        broadcastStatus();
      }
    },
    { type: 'separator' },
    {
      label: 'Sync Activity Now',
      click: () => syncTelemetry()
    },
    { type: 'separator' },
    {
      label: 'Exit Companion',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Sid Companion — Personal Activity Sync');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Background Activity Scanning & Syncing
let latestDetected = { game: null, coding: null, music: null, currentApp: null, browserTab: null };

async function performActivityScan() {
  try {
    latestDetected = await activityDetector.detectRunningProcesses();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('activity-detected', latestDetected);
    }
  } catch (err) {
    console.warn('Process scan notice:', err);
  }
}

async function syncTelemetry() {
  if (!config.shareActivity) {
    // Sharing paused by master switch
    broadcastStatus();
    return;
  }

  // Filter approved activity according to sub-toggles
  const payload = {
    isOnline: true,
    lastHeartbeat: new Date().toISOString(),
    game: config.shareGaming ? latestDetected.game : null,
    music: config.shareMusic ? latestDetected.music : null,
    coding: config.shareCoding ? latestDetected.coding : null,
    browserTab: config.shareBrowser ? latestDetected.browserTab : null,
    currentApp: latestDetected.currentApp || null,
    customStatus: config.customStatus || null,
    sharingPaused: !config.shareActivity
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
ipcMain.handle('trigger-sync', async () => {
  await performActivityScan();
  await syncTelemetry();
  return { success: true };
});
ipcMain.handle('toggle-master-share', () => {
  config.shareActivity = !config.shareActivity;
  saveConfig(config);
  syncTelemetry();
  return config.shareActivity;
});

// App Lifecycle
const singleLock = app.requestSingleInstanceLock();
if (!singleLock) {
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

    performActivityScan();
    syncTelemetry();

    setInterval(performActivityScan, 6000);
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
