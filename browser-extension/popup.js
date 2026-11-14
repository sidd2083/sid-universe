document.addEventListener('DOMContentLoaded', async () => {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const tabTitle = document.getElementById('tabTitle');
  const tabDomain = document.getElementById('tabDomain');
  const syncBtn = document.getElementById('syncBtn');

  const COMPANION_URL = 'http://127.0.0.1:49152';

  // 1. Check companion health
  async function checkCompanion() {
    try {
      const res = await fetch(`${COMPANION_URL}/health`, { method: 'GET' });
      if (res.ok) {
        statusDot.className = 'dot connected';
        statusText.textContent = 'Companion Online';
        return true;
      }
    } catch (e) {
      statusDot.className = 'dot disconnected';
      statusText.textContent = 'Companion Closed';
      return false;
    }
  }

  // 2. Fetch current active tab
  async function refreshCurrentTab() {
    try {
      const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (tabs && tabs.length > 0) {
        const tab = tabs[0];
        let domain = 'web';
        try {
          domain = new URL(tab.url).hostname;
        } catch (e) {}

        const cleanTitle = (tab.title || domain).replace(/\s*-\s*Google Chrome.*$/i, '').trim();
        tabTitle.textContent = cleanTitle;
        tabDomain.textContent = domain;
        return { title: cleanTitle, url: tab.url, domain: domain };
      }
    } catch (e) {
      tabTitle.textContent = 'No tab focused';
      tabDomain.textContent = 'idle';
    }
    return null;
  }

  await checkCompanion();
  const currentTab = await refreshCurrentTab();

  // 3. Manual Sync Button
  syncBtn.addEventListener('click', async () => {
    syncBtn.textContent = 'Transmitting...';
    const tab = await refreshCurrentTab();
    if (!tab) {
      syncBtn.textContent = 'No active tab found';
      setTimeout(() => { syncBtn.textContent = 'Transmit to Companion Now'; }, 2000);
      return;
    }

    try {
      const res = await fetch(`${COMPANION_URL}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: tab.domain.includes('youtube.com') ? 'YouTube' : 'Chrome Web',
          title: tab.title,
          url: tab.url,
          domain: tab.domain,
          timestamp: Date.now()
        })
      });

      if (res.ok) {
        statusDot.className = 'dot connected';
        statusText.textContent = 'Companion Synced!';
        syncBtn.textContent = '✓ Transmitted Successfully';
      } else {
        syncBtn.textContent = 'Sync Error';
      }
    } catch (err) {
      statusDot.className = 'dot disconnected';
      statusText.textContent = 'Companion Closed';
      syncBtn.textContent = 'Companion not running';
    }

    setTimeout(() => {
      syncBtn.textContent = 'Transmit to Companion Now';
    }, 2500);
  });
});
