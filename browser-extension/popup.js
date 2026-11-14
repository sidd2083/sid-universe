document.addEventListener('DOMContentLoaded', async () => {
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const tabTitle = document.getElementById('tabTitle');
  const tabDomain = document.getElementById('tabDomain');
  const syncBtn = document.getElementById('syncBtn');

  const ENDPOINTS = [
    'http://127.0.0.1:49152',
    'http://localhost:49152'
  ];

  async function checkCompanion() {
    for (const host of ENDPOINTS) {
      try {
        const res = await fetch(`${host}/health`, { method: 'GET' });
        if (res.ok) {
          statusDot.className = 'dot connected';
          statusText.textContent = 'Companion Online';
          return host;
        }
      } catch (e) {}
    }
    statusDot.className = 'dot disconnected';
    statusText.textContent = 'Companion Closed';
    return null;
  }

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
      tabTitle.textContent = 'Active Chrome Tab';
      tabDomain.textContent = 'web';
    }
    return null;
  }

  const activeHost = await checkCompanion();
  const currentTab = await refreshCurrentTab();

  syncBtn.addEventListener('click', async () => {
    syncBtn.textContent = 'Transmitting...';
    const tab = await refreshCurrentTab();
    if (!tab) {
      syncBtn.textContent = 'No active tab found';
      setTimeout(() => { syncBtn.textContent = 'Transmit to Companion Now'; }, 2000);
      return;
    }

    let success = false;
    for (const host of ENDPOINTS) {
      try {
        const res = await fetch(`${host}/activity`, {
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
          success = true;
          break;
        }
      } catch (e) {}
    }

    if (success) {
      statusDot.className = 'dot connected';
      statusText.textContent = 'Companion Synced!';
      syncBtn.textContent = '✓ Transmitted Successfully';
    } else {
      statusDot.className = 'dot disconnected';
      statusText.textContent = 'Companion Closed';
      syncBtn.textContent = 'Companion not running';
    }

    setTimeout(() => {
      syncBtn.textContent = 'Transmit to Companion Now';
    }, 2500);
  });
});
