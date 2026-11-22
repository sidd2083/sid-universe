const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, Notification } = require('electron');
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
  apiToken: '',
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

      if (req.method === 'GET' && (req.url === '/health' || req.url === '/ping')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', client: 'Sid Companion', time: Date.now() }));
        return;
      }

      if (req.method === 'POST' && (req.url === '/activity' || req.url === '/media')) {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            activityDetector.setBrowserTab(data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));

            // Immediately scan and sync when new Chrome tab is reported
            await performActivityScan();
            await syncTelemetry();
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
    appName: latestDetected.currentApp || null,
    appDetails: latestDetected.appDetails || null,
    siddhantAction: latestDetected.siddhantAction || 'Siddhant is currently exploring ideas',
    durationMinutes: latestDetected.durationMinutes || 1,
    activeSince: latestDetected.activeSince || new Date().toISOString(),
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

// Manual status preset & custom override
ipcMain.handle('set-manual-status', async (_event, params) => {
  const { status, appName, details } = params || {};
  activityDetector.setManualStatus(status, appName, details);
  await performActivityScan();
  await syncTelemetry();
  return { success: true };
});

ipcMain.handle('clear-manual-status', async () => {
  activityDetector.clearManualStatus();
  await performActivityScan();
  await syncTelemetry();
  return { success: true };
});

// Running windows selector
ipcMain.handle('get-running-windows', async () => {
  try {
    const windows = await activityDetector.getRunningWindows();
    return { success: true, windows };
  } catch (err) {
    return { success: false, windows: [], error: err.message };
  }
});

ipcMain.handle('select-window-task', async (_event, params) => {
  const { processName, windowTitle } = params || {};
  const res = activityDetector.setSelectedWindow(processName, windowTitle);
  await performActivityScan();
  await syncTelemetry();
  return { success: true, ...res };
});

// Test Connection with website
ipcMain.handle('test-connection', async (_event, params) => {
  const url = (params?.url || config.apiUrl || 'http://localhost:3000').replace(/\/$/, '');
  const token = params?.token || config.apiToken;
  const startTime = Date.now();
  try {
    const res = await fetch(`${url}/api/companion/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-companion-token': token
      },
      body: JSON.stringify({
        isOnline: true,
        siddhantAction: 'Companion connection test ping',
        appName: 'Sid Companion'
      })
    });
    const latency = Date.now() - startTime;
    if (res.ok) {
      return { success: true, latency, status: res.status };
    }
    return { success: false, error: `Server returned HTTP ${res.status}` };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Fetch confessions / messages from website
ipcMain.handle('fetch-messages', async () => {
  const url = (config.apiUrl || 'http://localhost:3000').replace(/\/$/, '');
  try {
    const res = await fetch(`${url}/api/messages`);
    if (res.ok) {
      const data = await res.json();
      return { success: true, messages: data.messages || [] };
    }
    return { success: false, error: `HTTP ${res.status}` };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Reply to a confession from desktop app
ipcMain.handle('reply-message', async (_event, params) => {
  const { id, reply } = params || {};
  const url = (config.apiUrl || 'http://localhost:3000').replace(/\/$/, '');
  try {
    const res = await fetch(`${url}/api/messages`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reply, isPublished: true })
    });
    if (res.ok) {
      return { success: true };
    }
    return { success: false, error: `HTTP ${res.status}` };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Fetch touches
ipcMain.handle('fetch-touches', async () => {
  const url = (config.apiUrl || 'http://localhost:3000').replace(/\/$/, '');
  try {
    const res = await fetch(`${url}/api/touch`);
    if (res.ok) {
      const data = await res.json();
      return { success: true, touches: data.touches || [] };
    }
    return { success: false, error: `HTTP ${res.status}` };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Live stream status handlers
ipcMain.handle('get-livestream', async () => {
  const url = (config.apiUrl || 'http://localhost:3000').replace(/\/$/, '');
  try {
    const res = await fetch(`${url}/api/store?collection=siteSettings`);
    if (res.ok) {
      const data = await res.json();
      return { success: true, liveStream: data?.data?.liveStream || { url: '', title: '' } };
    }
  } catch (e) {}
  return { success: true, liveStream: { url: '', title: '' } };
});

ipcMain.handle('set-livestream', async (_event, params) => {
  const { url: streamUrl, title } = params || {};
  const webUrl = (config.apiUrl || 'http://localhost:3000').replace(/\/$/, '');
  try {
    const res = await fetch(`${webUrl}/api/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collection: 'siteSettings',
        id: 'general',
        data: {
          liveStream: {
            url: streamUrl || '',
            title: title || ''
          }
        }
      })
    });
    if (res.ok) {
      return { success: true };
    }
    return { success: false, error: `HTTP ${res.status}` };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Periodic Touch Receiver from Website to trigger Windows Desktop Notification
async function pollTouches() {
  if (!config.apiUrl) return;
  const url = config.apiUrl.replace(/\/$/, '');
  try {
    const res = await fetch(`${url}/api/touch?unread=true&markRead=true`);
    if (res.ok) {
      const data = await res.json();
      if (data.touches && data.touches.length > 0) {
        for (const touch of data.touches) {
          try {
            if (Notification.isSupported()) {
              const notif = new Notification({
                title: `SID UNIVERSE — Touch Received! ${touch.emoji || '👋'}`,
                body: `${touch.senderName || 'A visitor'} just sent you a touch from the website!`,
                icon: path.join(__dirname, '../resources/icon.ico')
              });
              notif.show();
            }
          } catch (nErr) {}

          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('touch-received', touch);
          }
        }
      }
    }
  } catch (e) {}
}

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
    setInterval(pollTouches, 7000);

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
