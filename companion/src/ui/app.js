// Sid Companion UI Logic
const api = window.companionAPI || {
  getConfig: async () => ({}),
  saveConfig: async () => ({}),
  getStatus: async () => ({}),
  triggerSync: async () => ({}),
  testConnection: async () => ({ success: false }),
  fetchMessages: async () => ({ messages: [] }),
  replyMessage: async () => ({ success: false }),
  fetchTouches: async () => ({ touches: [] }),
  onStatusUpdate: () => {},
  onActivityDetected: () => {},
  onTouchReceived: () => {}
};

// Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

const statusIndicator = document.getElementById('statusIndicator');
const statusSubtitle = document.getElementById('statusSubtitle');
const actionBroadcastVal = document.getElementById('actionBroadcastVal');
const currentStatusMode = document.getElementById('currentStatusMode');
const btnResumeAutoDetect = document.getElementById('btnResumeAutoDetect');
const presetChips = document.querySelectorAll('.preset-chip');

const currentAppVal = document.getElementById('currentAppVal');
const currentGameVal = document.getElementById('currentGameVal');
const currentMusicVal = document.getElementById('currentMusicVal');
const currentCodingVal = document.getElementById('currentCodingVal');

const customStatusInput = document.getElementById('customStatusInput');
const btnSaveStatus = document.getElementById('btnSaveStatus');
const btnManualSync = document.getElementById('btnManualSync');

const confessionList = document.getElementById('confessionList');
const confessionCountBadge = document.getElementById('confessionCountBadge');
const btnRefreshConfessions = document.getElementById('btnRefreshConfessions');

const touchList = document.getElementById('touchList');
const btnTestNotif = document.getElementById('btnTestNotif');

const apiUrlInput = document.getElementById('apiUrl');
const apiTokenInput = document.getElementById('apiToken');
const btnSaveConfig = document.getElementById('btnSaveConfig');
const btnTestConnection = document.getElementById('btnTestConnection');
const testConnResult = document.getElementById('testConnResult');

const toast = document.getElementById('toast');

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2800);
}

// 1. Tab Navigation
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.tab);
    if (target) target.classList.add('active');

    if (btn.dataset.tab === 'tab-confessions') {
      loadConfessions();
    } else if (btn.dataset.tab === 'tab-touches') {
      loadTouches();
    }
  });
});

// 2. Preset Activity Chips (Discord-Style)
presetChips.forEach(chip => {
  chip.addEventListener('click', async () => {
    const status = chip.dataset.status;
    const app = chip.dataset.app;

    presetChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    actionBroadcastVal.textContent = status;
    currentStatusMode.textContent = `Mode: Locked Preset (${app})`;
    btnResumeAutoDetect.style.display = 'inline-block';

    if (window.electron?.ipcRenderer) {
      await window.electron.ipcRenderer.invoke('set-manual-status', {
        status,
        appName: app,
        details: status
      });
    }

    showToast(`Status updated: "${status}"`);
  });
});

// Resume Auto-Detect Mode
btnResumeAutoDetect.addEventListener('click', async () => {
  presetChips.forEach(c => c.classList.remove('active'));
  if (selectRunningWindow) selectRunningWindow.value = '__auto__';
  btnResumeAutoDetect.style.display = 'none';
  currentStatusMode.textContent = 'Mode: Auto-Detect Running Processes';

  if (window.electron?.ipcRenderer) {
    await window.electron.ipcRenderer.invoke('clear-manual-status');
  }

  showToast('Resumed auto-detection of running processes');
});

// Running Windows & Task Selector
const selectRunningWindow = document.getElementById('selectRunningWindow');
const btnRefreshWindows = document.getElementById('btnRefreshWindows');

async function loadRunningWindows() {
  if (!selectRunningWindow || !window.electron?.ipcRenderer) return;
  try {
    const res = await window.electron.ipcRenderer.invoke('get-running-windows');
    const windows = res?.windows || [];

    const currentVal = selectRunningWindow.value;
    selectRunningWindow.innerHTML = '<option value="__auto__">✨ Auto-Detect Active Window (Default)</option>';

    windows.forEach(w => {
      const opt = document.createElement('option');
      opt.value = JSON.stringify({ process: w.ProcessName, title: w.MainWindowTitle });
      const displayTitle = w.MainWindowTitle.length > 55 ? w.MainWindowTitle.slice(0, 52) + '...' : w.MainWindowTitle;
      opt.textContent = `🪟 ${displayTitle} (${w.ProcessName})`;
      selectRunningWindow.appendChild(opt);
    });

    if (currentVal && currentVal !== '__auto__') {
      selectRunningWindow.value = currentVal;
    }
  } catch (err) {
    console.warn('Load windows error:', err);
  }
}

if (btnRefreshWindows) {
  btnRefreshWindows.addEventListener('click', async () => {
    btnRefreshWindows.textContent = 'Refreshing...';
    await loadRunningWindows();
    btnRefreshWindows.textContent = '🔄 Refresh Windows';
    showToast('Running windows list refreshed!');
  });
}

if (selectRunningWindow) {
  selectRunningWindow.addEventListener('change', async () => {
    const val = selectRunningWindow.value;
    if (val === '__auto__') {
      btnResumeAutoDetect.style.display = 'none';
      presetChips.forEach(c => c.classList.remove('active'));
      currentStatusMode.textContent = 'Mode: Auto-Detect Running Processes';
      if (window.electron?.ipcRenderer) {
        await window.electron.ipcRenderer.invoke('select-window-task', { processName: '__auto__' });
      }
      showToast('Switched to Auto-Detect mode');
    } else {
      try {
        const parsed = JSON.parse(val);
        presetChips.forEach(c => c.classList.remove('active'));
        currentStatusMode.textContent = `Mode: Locked Window (${parsed.process})`;
        btnResumeAutoDetect.style.display = 'inline-block';
        if (window.electron?.ipcRenderer) {
          const res = await window.electron.ipcRenderer.invoke('select-window-task', {
            processName: parsed.process,
            windowTitle: parsed.title
          });
          if (res?.status) {
            actionBroadcastVal.textContent = res.status;
          }
        }
        showToast(`Broadcasting window: ${parsed.title.slice(0, 30)}...`);
      } catch (e) {}
    }
  });
}

// Initial load of windows
loadRunningWindows();
setInterval(loadRunningWindows, 12000);

// Custom Status Broadcast
btnSaveStatus.addEventListener('click', async () => {
  const text = customStatusInput.value.trim();
  if (!text) return;

  const fullSentence = text.startsWith('Siddhant is') ? text : `Siddhant is currently ${text}`;
  actionBroadcastVal.textContent = fullSentence;
  currentStatusMode.textContent = 'Mode: Custom Manual Status';
  btnResumeAutoDetect.style.display = 'inline-block';

  if (window.electron?.ipcRenderer) {
    await window.electron.ipcRenderer.invoke('set-manual-status', {
      status: fullSentence,
      appName: 'Custom Status',
      details: text
    });
  }

  showToast('Custom status broadcasted to website!');
});

// Manual Sync Button
btnManualSync.addEventListener('click', async () => {
  btnManualSync.disabled = true;
  btnManualSync.textContent = 'Syncing...';
  await api.triggerSync();
  btnManualSync.textContent = 'Sync Now';
  btnManualSync.disabled = false;
  showToast('Synchronized with website');
});

// 3. Anonymous Confessions & Direct Reply
async function loadConfessions() {
  confessionList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px;">Loading messages...</div>';
  try {
    const res = await api.fetchMessages();
    const messages = res.messages || [];

    if (messages.length === 0) {
      confessionList.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 12px;">No confessions received yet from website visitors.</div>';
      confessionCountBadge.style.display = 'none';
      return;
    }

    confessionCountBadge.textContent = messages.length;
    confessionCountBadge.style.display = 'inline-block';

    confessionList.innerHTML = '';
    messages.forEach(msg => {
      const item = document.createElement('div');
      item.className = 'confession-item';

      const time = msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() + ' ' + new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Recent';

      item.innerHTML = `
        <div class="confession-meta">
          <strong>${msg.senderName || 'Anonymous Visitor'}</strong>
          <span>${time}</span>
        </div>
        <p class="confession-text">"${msg.message || msg.content || ''}"</p>
        ${msg.reply ? `
          <div class="confession-replied-badge">
            <span>✓ Answer Published:</span> "${msg.reply}"
          </div>
        ` : `
          <div class="confession-reply-box">
            <input type="text" class="confession-reply-input" placeholder="Type your answer to publish to website Q&A..." id="replyInput-${msg.id}">
            <button class="btn btn-primary" style="padding: 6px 12px; font-size: 11px;" onclick="window.replyToMessage('${msg.id}')">Publish Reply</button>
          </div>
        `}
      `;
      confessionList.appendChild(item);
    });
  } catch (err) {
    confessionList.innerHTML = `<div style="padding: 20px; text-align: center; color: #DC2626; font-size: 12px;">Failed loading confessions: ${err.message}</div>`;
  }
}

btnRefreshConfessions.addEventListener('click', loadConfessions);

window.replyToMessage = async (msgId) => {
  const input = document.getElementById(`replyInput-${msgId}`);
  if (!input) return;
  const replyText = input.value.trim();
  if (!replyText) return;

  const res = await api.replyMessage(msgId, replyText);
  if (res.success) {
    showToast('Reply published to website Q&A!');
    loadConfessions();
  } else {
    showToast('Failed to publish reply');
  }
};

// 4. Visitor Touches
async function loadTouches() {
  touchList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px;">Loading touches...</div>';
  try {
    const res = await api.fetchTouches();
    const touches = res.touches || [];

    if (touches.length === 0) {
      touchList.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 12px;">No visitor touches received yet. When visitors click "Send a Touch to Sid", they appear here.</div>';
      return;
    }

    touchList.innerHTML = '';
    touches.forEach(t => {
      const item = document.createElement('div');
      item.className = 'confession-item';
      const time = t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : 'Just now';
      item.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">${t.emoji || '👋'}</span>
            <div>
              <strong style="font-size: 12px; color: var(--text-main);">${t.senderName || 'Website Visitor'}</strong>
              <div style="font-size: 11px; color: var(--text-secondary);">${t.message || 'Sent a touch from SID UNIVERSE'}</div>
            </div>
          </div>
          <span style="font-size: 10px; color: var(--text-muted); font-family: monospace;">${time}</span>
        </div>
      `;
      touchList.appendChild(item);
    });
  } catch (err) {
    touchList.innerHTML = `<div style="padding: 20px; text-align: center; color: #DC2626; font-size: 12px;">Notice: ${err.message}</div>`;
  }
}

btnTestNotif.addEventListener('click', () => {
  if (window.electron?.ipcRenderer) {
    showToast('Simulated notification triggered');
    new Notification('SID UNIVERSE — Touch Received! 👋', {
      body: 'A visitor just tapped your profile on the website!'
    });
  }
});

// 5. Connection Settings & Test Connection
btnSaveConfig.addEventListener('click', async () => {
  const apiUrl = apiUrlInput.value.trim();
  const apiToken = apiTokenInput.value.trim();
  await api.saveConfig({ apiUrl, apiToken });
  showToast('Connection settings saved');
});

btnTestConnection.addEventListener('click', async () => {
  btnTestConnection.disabled = true;
  btnTestConnection.textContent = 'Testing...';
  testConnResult.style.display = 'block';
  testConnResult.textContent = 'Pinging website endpoint...';
  testConnResult.style.color = 'var(--text-secondary)';

  try {
    const res = await api.testConnection(apiUrlInput.value.trim(), apiTokenInput.value.trim());
    if (res.success) {
      testConnResult.textContent = `✓ Connected! Website responded successfully (${res.latency || 0}ms)`;
      testConnResult.style.color = '#059669';
      statusIndicator.classList.remove('paused');
      statusSubtitle.textContent = 'Connected & synchronized with website';
      showToast('Website connection verified!');
    } else {
      testConnResult.textContent = `✗ Connection Failed: ${res.error || 'Server unreachable'}. Verify your URL.`;
      testConnResult.style.color = '#DC2626';
      statusIndicator.classList.add('paused');
      statusSubtitle.textContent = 'Connection error (check settings)';
    }
  } catch (e) {
    testConnResult.textContent = `✗ Error: ${e.message}`;
    testConnResult.style.color = '#DC2626';
  } finally {
    btnTestConnection.disabled = false;
    btnTestConnection.textContent = 'Test Connection';
  }
});

// 6. IPC Real-time Event Listeners
if (window.electron?.ipcRenderer) {
  window.electron.ipcRenderer.on('activity-detected', (_event, data) => {
    currentAppVal.textContent = data.currentApp || 'Desktop Idle';
    currentGameVal.textContent = data.game ? data.game.title : 'None detected';
    currentMusicVal.textContent = data.music ? `${data.music.title} — ${data.music.artist}` : 'Idle';
    currentCodingVal.textContent = data.coding ? `${data.coding.project} (${data.coding.editor})` : 'Idle';

    if (currentStatusMode.textContent.includes('Auto-Detect') && data.siddhantAction) {
      actionBroadcastVal.textContent = data.siddhantAction;
    }
  });

  window.electron.ipcRenderer.on('touch-received', (_event, touch) => {
    showToast(`👋 Touch received from ${touch.senderName || 'a visitor'}!`);
    loadTouches();
  });

  window.electron.ipcRenderer.on('status-update', (_event, status) => {
    if (status.isConnected) {
      statusIndicator.classList.remove('paused');
      statusSubtitle.textContent = 'Connected & synchronizing with website';
    }
  });
}

// Initial Load
async function init() {
  try {
    const config = await api.getConfig();
    apiUrlInput.value = config.apiUrl || 'http://localhost:3000';
    apiTokenInput.value = config.apiToken || '';
  } catch (e) {}
}

init();
