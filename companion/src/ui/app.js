document.addEventListener('DOMContentLoaded', async () => {
  const connectionBadge = document.getElementById('connectionBadge');
  const connectionText = document.getElementById('connectionText');
  const detectedGameText = document.getElementById('detectedGameText');
  const detectedMusicText = document.getElementById('detectedMusicText');
  const detectedCodingText = document.getElementById('detectedCodingText');
  const customStatusInput = document.getElementById('customStatusInput');
  const lastSyncTimeEl = document.getElementById('lastSyncTime');

  const toggleShareGaming = document.getElementById('toggleShareGaming');
  const toggleShareMusic = document.getElementById('toggleShareMusic');
  const toggleShareCoding = document.getElementById('toggleShareCoding');
  const toggleShareStatus = document.getElementById('toggleShareStatus');
  const toggleAutoLaunch = document.getElementById('toggleAutoLaunch');

  const apiUrlInput = document.getElementById('apiUrl');
  const apiTokenInput = document.getElementById('apiToken');
  const btnSaveConfig = document.getElementById('btnSaveConfig');
  const btnScanNow = document.getElementById('btnScanNow');
  const btnStealth = document.getElementById('btnStealth');
  const toast = document.getElementById('toast');

  let currentConfig = {};

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }

  // Load existing configuration
  try {
    currentConfig = await window.companionAPI.getConfig();
    apiUrlInput.value = currentConfig.apiUrl || 'http://localhost:3000';
    apiTokenInput.value = currentConfig.apiToken || '';
    customStatusInput.value = currentConfig.customStatus || '';
    toggleShareGaming.checked = currentConfig.shareGaming !== false;
    toggleShareMusic.checked = currentConfig.shareMusic !== false;
    toggleShareCoding.checked = currentConfig.shareCoding !== false;
    toggleShareStatus.checked = currentConfig.shareCustomStatus !== false;
    toggleAutoLaunch.checked = !!currentConfig.autoLaunch;

    updateStealthButton(currentConfig.stealthMode);
  } catch (err) {
    console.error('Failed to load initial config:', err);
  }

  function updateStealthButton(isStealth) {
    if (isStealth) {
      btnStealth.textContent = '👁️ Exit Stealth Mode';
      btnStealth.style.borderColor = '#10b981';
      btnStealth.style.color = '#10b981';
    } else {
      btnStealth.textContent = '👻 Stealth Mode';
      btnStealth.style.borderColor = '#78350f';
      btnStealth.style.color = '#f59e0b';
    }
  }

  function updateConnectionUI(status) {
    if (status.config && status.config.stealthMode) {
      connectionBadge.className = 'connection-badge stealth';
      connectionText.textContent = 'Stealth Active';
    } else if (status.isConnected) {
      connectionBadge.className = 'connection-badge connected';
      connectionText.textContent = 'Connected (Sync Active)';
    } else {
      connectionBadge.className = 'connection-badge disconnected';
      connectionText.textContent = status.lastError ? `Disconnected (${status.lastError})` : 'Offline';
    }

    if (status.lastSyncTime) {
      const d = new Date(status.lastSyncTime);
      lastSyncTimeEl.textContent = d.toLocaleTimeString();
    }
  }

  // Save Settings
  btnSaveConfig.addEventListener('click', async () => {
    const updated = {
      apiUrl: apiUrlInput.value.trim(),
      apiToken: apiTokenInput.value.trim(),
      customStatus: customStatusInput.value.trim(),
      shareGaming: toggleShareGaming.checked,
      shareMusic: toggleShareMusic.checked,
      shareCoding: toggleShareCoding.checked,
      shareCustomStatus: toggleShareStatus.checked,
      autoLaunch: toggleAutoLaunch.checked
    };

    await window.companionAPI.saveConfig(updated);
    showToast('Settings saved successfully!');
    await window.companionAPI.triggerScan();
  });

  // Stealth toggle
  btnStealth.addEventListener('click', async () => {
    const isStealth = await window.companionAPI.toggleStealth();
    updateStealthButton(isStealth);
    showToast(isStealth ? 'Stealth Mode ON — Telemetry paused' : 'Stealth Mode OFF — Resumed sync');
  });

  // Manual Scan
  btnScanNow.addEventListener('click', async () => {
    btnScanNow.disabled = true;
    btnScanNow.textContent = 'Scanning...';
    await window.companionAPI.triggerScan();
    showToast('Scan and synchronization completed!');
    btnScanNow.textContent = '⚡ Scan & Sync Now';
    btnScanNow.disabled = false;
  });

  // Custom status live update on change
  customStatusInput.addEventListener('change', async () => {
    await window.companionAPI.setCustomStatus(customStatusInput.value.trim());
  });

  // Receive live activity detected
  window.companionAPI.onActivityDetected((detected) => {
    if (detected.game) {
      detectedGameText.textContent = `${detected.game.title} (${detected.game.category})`;
      detectedGameText.style.color = '#38bdf8';
    } else {
      detectedGameText.textContent = 'No game running';
      detectedGameText.style.color = '#8b9bb4';
    }

    if (detected.music) {
      detectedMusicText.textContent = `${detected.music.title} - ${detected.music.artist} (${detected.music.source})`;
      detectedMusicText.style.color = '#a78bfa';
    } else {
      detectedMusicText.textContent = 'No active music';
      detectedMusicText.style.color = '#8b9bb4';
    }

    if (detected.coding) {
      detectedCodingText.textContent = `${detected.coding.project} (${detected.coding.file})`;
      detectedCodingText.style.color = '#34d399';
    } else {
      detectedCodingText.textContent = 'VS Code idle';
      detectedCodingText.style.color = '#8b9bb4';
    }
  });

  // Receive telemetry status update
  window.companionAPI.onStatusUpdate((status) => {
    updateConnectionUI(status);
  });

  // Initial status check
  try {
    const initialStatus = await window.companionAPI.getStatus();
    updateConnectionUI(initialStatus);
  } catch (e) {}
});
