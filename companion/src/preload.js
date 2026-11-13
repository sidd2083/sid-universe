const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('companionAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  getStatus: () => ipcRenderer.invoke('get-status'),
  triggerScan: () => ipcRenderer.invoke('trigger-scan'),
  toggleStealth: () => ipcRenderer.invoke('toggle-stealth'),
  setCustomStatus: (status) => ipcRenderer.invoke('set-custom-status', status),
  onStatusUpdate: (callback) => ipcRenderer.on('status-update', (_event, value) => callback(value)),
  onActivityDetected: (callback) => ipcRenderer.on('activity-detected', (_event, value) => callback(value))
});
