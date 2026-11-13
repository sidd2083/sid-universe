// Companion UI Logic
const { ipcRenderer } = window.electron || {
  ipcRenderer: {
    invoke: async () => ({}),
    on: () => {}
  }
};

const masterToggle = document.getElementById('masterShareToggle');
const shareGaming = document.getElementById('shareGamingToggle');
const shareMusic = document.getElementById('shareMusicToggle');
const shareCoding = document.getElementById('shareCodingToggle');
const shareBrowser = document.getElementById('shareBrowserToggle');
const customStatusInput = document.getElementById('customStatusInput');
const btnSaveStatus = document.getElementById('btnSaveStatus');
const btnManualSync = document.getElementById('btnManualSync');
const btnSaveConfig = document.getElementById('btnSaveConfig');
const apiUrlInput = document.getElementById('apiUrl');
const apiTokenInput = document.getElementById('apiToken');
const autoLaunchToggle = document.getElementById('autoLaunchToggle');

const statusIndicator = document.getElementById('statusIndicator');
const statusSubtitle = document.getElementById('statusSubtitle');
const currentAppVal = document.getElementById('currentAppVal');
const currentGameVal = document.getElementById('currentGameVal');
const currentMusicVal = document.getElementById('currentMusicVal');
const currentCodingVal = document.getElementById('currentCodingVal');
const lastSyncLabel = document.getElementById('lastSyncLabel');
const toast = document.getElementById('toast');

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2500);
}

// 1. Initial Load Config
async function init() {
  try {
    const config = await ipcRenderer.invoke('get-config');
    masterToggle.checked = config.shareActivity !== false;
    shareGaming.checked = config.shareGaming !== false;
    shareMusic.checked = config.shareMusic !== false;
    shareCoding.checked = config.shareCoding !== false;
    shareBrowser.checked = config.shareBrowser !== false;
    customStatusInput.value = config.customStatus || '';
    apiUrlInput.value = config.apiUrl || 'http://localhost:3000';
    apiTokenInput.value = config.apiToken || '';
    autoLaunchToggle.checked = !!config.autoLaunch;

    updateMasterIndicator(masterToggle.checked);
  } catch (e) {
    console.warn('Init config error:', e);
  }
}

function updateMasterIndicator(isActive) {
  if (isActive) {
    statusIndicator.classList.remove('paused');
    statusSubtitle.textContent = 'Active & synchronizing';
  } else {
    statusIndicator.classList.add('paused');
    statusSubtitle.textContent = 'Activity sharing paused';
  }
}

// 2. Master Toggle change
masterToggle.addEventListener('change', async () => {
  const isSharing = masterToggle.checked;
  await ipcRenderer.invoke('save-config', { shareActivity: isSharing });
  updateMasterIndicator(isSharing);
  showToast(isSharing ? 'Activity sharing resumed' : 'Activity sharing paused');
});

// 3. Category toggles change
[shareGaming, shareMusic, shareCoding, shareBrowser].forEach((toggle) => {
  toggle.addEventListener('change', async () => {
    await ipcRenderer.invoke('save-config', {
      shareGaming: shareGaming.checked,
      shareMusic: shareMusic.checked,
      shareCoding: shareCoding.checked,
      shareBrowser: shareBrowser.checked
    });
    showToast('Privacy preferences updated');
  });
});

// 4. Manual Status Save
btnSaveStatus.addEventListener('click', async () => {
  const status = customStatusInput.value.trim();
  await ipcRenderer.invoke('save-config', { customStatus: status });
  await ipcRenderer.invoke('trigger-sync');
  showToast('Custom status broadcasted');
});

// 5. Manual Sync Now
btnManualSync.addEventListener('click', async () => {
  btnManualSync.disabled = true;
  btnManualSync.textContent = 'Syncing...';
  await ipcRenderer.invoke('trigger-sync');
  btnManualSync.textContent = 'Sync Now';
  btnManualSync.disabled = false;
  showToast('Synchronized with website');
});

// 6. Save Config Settings
btnSaveConfig.addEventListener('click', async () => {
  await ipcRenderer.invoke('save-config', {
    apiUrl: apiUrlInput.value.trim(),
    apiToken: apiTokenInput.value.trim(),
    autoLaunch: autoLaunchToggle.checked
  });
  showToast('Settings saved');
});

// 7. IPC Event Listeners from Main process
ipcRenderer.on('activity-detected', (_event, data) => {
  currentAppVal.textContent = data.currentApp || 'Desktop Idle';
  currentGameVal.textContent = data.game ? data.game.title : 'None detected';
  currentMusicVal.textContent = data.music ? `${data.music.title} — ${data.music.artist}` : 'Idle';
  currentCodingVal.textContent = data.coding ? `${data.coding.project} (${data.coding.editor})` : 'Idle';
});

ipcRenderer.on('status-update', (_event, status) => {
  if (status.lastSyncTime) {
    const time = new Date(status.lastSyncTime).toLocaleTimeString();
    lastSyncLabel.textContent = `Last sync: ${time}`;
  }
});

init();
