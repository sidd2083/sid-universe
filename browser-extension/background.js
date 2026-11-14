// Sid Universe Chrome Activity Bridge — Background Service Worker
const COMPANION_ENDPOINTS = [
  'http://127.0.0.1:49152/activity',
  'http://localhost:49152/activity'
];

let lastSentPayloadKey = '';

async function getActiveTabInfo() {
  try {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tabs || tabs.length === 0) return null;
    const tab = tabs[0];
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('chrome-extension://')) {
      return null;
    }

    let domain = '';
    try {
      domain = new URL(tab.url).hostname;
    } catch (e) {}

    let cleanTitle = (tab.title || '').replace(/\s*-\s*Google Chrome.*$/i, '').trim();

    // Special handling for YouTube
    const isYouTube = domain.includes('youtube.com');
    if (isYouTube) {
      cleanTitle = cleanTitle.replace(/\s*-\s*YouTube.*$/i, '').trim();
    }

    return {
      title: cleanTitle || domain,
      url: tab.url,
      domain: domain,
      favIconUrl: tab.favIconUrl || '',
      isYouTube: isYouTube,
      timestamp: Date.now()
    };
  } catch (err) {
    return null;
  }
}

async function transmitTab(tabInfo) {
  if (!tabInfo || !tabInfo.title) return;

  const payloadKey = `${tabInfo.domain}::${tabInfo.title}`;
  if (payloadKey === lastSentPayloadKey) return; // Prevent duplicate rapid posts

  const payload = {
    source: tabInfo.isYouTube ? 'YouTube' : 'Chrome Web',
    title: tabInfo.title,
    url: tabInfo.url,
    domain: tabInfo.domain,
    timestamp: tabInfo.timestamp
  };

  let sent = false;
  for (const endpoint of COMPANION_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        lastSentPayloadKey = payloadKey;
        sent = true;
        await chrome.storage.local.set({
          lastSuccessSync: Date.now(),
          lastActiveTitle: tabInfo.title,
          lastDomain: tabInfo.domain,
          companionConnected: true
        });
        break;
      }
    } catch (err) {
      // Try next endpoint
    }
  }

  if (!sent) {
    await chrome.storage.local.set({ companionConnected: false });
  }
}

async function checkAndSend() {
  const tabInfo = await getActiveTabInfo();
  if (tabInfo) {
    await transmitTab(tabInfo);
  }
}

// 1. Tab switches
chrome.tabs.onActivated.addListener(() => {
  checkAndSend();
});

// 2. URL or title changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete' || changeInfo.title) {
    checkAndSend();
  }
});

// 3. Window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    checkAndSend();
  }
});

// 4. Messages from content script (e.g. YouTube media player updates)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'MEDIA_UPDATE') {
    transmitTab({
      title: message.title,
      url: message.url || sender.tab?.url || '',
      domain: message.domain || 'youtube.com',
      isYouTube: true,
      timestamp: Date.now()
    });
    sendResponse({ received: true });
  }
});

// 5. Keep alive and polling via alarms
chrome.alarms.create('companionHeartbeat', { periodInMinutes: 0.1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'companionHeartbeat') {
    checkAndSend();
  }
});

// Initial run
checkAndSend();
