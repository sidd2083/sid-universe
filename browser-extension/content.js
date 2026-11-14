// Sid Universe Chrome Activity Bridge — Content Script
(function () {
  let lastReported = '';

  function reportMedia(info) {
    const key = `${info.title}-${info.channel}`;
    if (key === lastReported) return;
    lastReported = key;

    // Send to background service worker
    try {
      chrome.runtime.sendMessage({
        type: 'MEDIA_UPDATE',
        title: info.title,
        channel: info.channel,
        url: info.url || window.location.href
      });
    } catch (e) {}

    // Direct HTTP fallback to Companion
    fetch('http://127.0.0.1:49152/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'YouTube',
        title: info.title,
        channel: info.channel,
        url: info.url || window.location.href,
        domain: window.location.hostname
      })
    }).catch(() => {});
  }

  function checkYouTubeMusic() {
    if (!window.location.hostname.includes('music.youtube.com')) return false;

    const titleEl = document.querySelector('ytmusic-player-bar .title');
    const bylineEl = document.querySelector('ytmusic-player-bar .byline');
    const playPauseBtn = document.querySelector('#play-pause-button');

    if (titleEl && bylineEl && titleEl.textContent.trim()) {
      const isPlaying = playPauseBtn ? playPauseBtn.getAttribute('aria-label') === 'Pause' : true;
      if (isPlaying) {
        reportMedia({
          source: 'YouTube Music',
          title: titleEl.textContent.trim(),
          channel: bylineEl.textContent.split('•')[0]?.trim() || 'YouTube Music',
          url: window.location.href
        });
        return true;
      }
    }
    return false;
  }

  function checkStandardYouTube() {
    if (!window.location.hostname.includes('youtube.com')) return;

    const videoEl = document.querySelector('video');
    if (videoEl && !videoEl.paused && !videoEl.ended) {
      const titleEl =
        document.querySelector('h1.ytd-watch-metadata yt-formatted-string') ||
        document.querySelector('h1.title yt-formatted-string') ||
        document.querySelector('h1.title');
      const channelEl =
        document.querySelector('ytd-channel-name a') ||
        document.querySelector('#channel-name a');

      if (titleEl && titleEl.textContent.trim()) {
        reportMedia({
          source: 'YouTube Video',
          title: titleEl.textContent.trim(),
          channel: channelEl ? channelEl.textContent.trim() : 'YouTube Creator',
          url: window.location.href
        });
      }
    }
  }

  // Scan YouTube players every 2.5 seconds
  if (window.location.hostname.includes('youtube.com')) {
    setInterval(() => {
      if (!checkYouTubeMusic()) {
        checkStandardYouTube();
      }
    }, 2500);
  }
})();
