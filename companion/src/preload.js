const { contextBridge, ipcRenderer } = require('electron');

// Expose safe IPC wrapper
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, listener) => {
      const subscription = (_event, ...args) => listener(_event, ...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    }
  }
});

contextBridge.exposeInMainWorld('companionAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  getStatus: () => ipcRenderer.invoke('get-status'),
  triggerSync: () => ipcRenderer.invoke('trigger-sync'),
  testConnection: (url, token) => ipcRenderer.invoke('test-connection', { url, token }),
  fetchMessages: () => ipcRenderer.invoke('fetch-messages'),
  replyMessage: (id, reply) => ipcRenderer.invoke('reply-message', { id, reply }),
  fetchTouches: () => ipcRenderer.invoke('fetch-touches'),
  onStatusUpdate: (callback) => ipcRenderer.on('status-update', (_event, value) => callback(value)),
  onActivityDetected: (callback) => ipcRenderer.on('activity-detected', (_event, value) => callback(value)),
  onTouchReceived: (callback) => ipcRenderer.on('touch-received', (_event, value) => callback(value))
});
