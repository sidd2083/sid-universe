const fetch = require('node-fetch');

class ApiClient {
  constructor() {
    this.apiUrl = 'http://localhost:3000';
    this.apiToken = '';
    this.isConnected = false;
    this.lastError = null;
    this.lastSyncTime = null;
  }

  configure(url, token) {
    if (url) {
      // Remove trailing slash if present
      this.apiUrl = url.replace(/\/+$/, '');
    }
    if (token !== undefined) {
      this.apiToken = token;
    }
  }

  async sendHeartbeat() {
    try {
      const endpoint = `${this.apiUrl}/api/companion/heartbeat`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`
        },
        body: JSON.stringify({
          client: 'Sid Companion Windows',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        }),
        timeout: 6000
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      this.isConnected = true;
      this.lastError = null;
      this.lastSyncTime = new Date().toISOString();
      return { success: true, timestamp: this.lastSyncTime };
    } catch (err) {
      this.isConnected = false;
      this.lastError = err.message;
      return { success: false, error: err.message };
    }
  }

  async sendActivityUpdate(activityPayload) {
    try {
      const endpoint = `${this.apiUrl}/api/companion/activity`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`
        },
        body: JSON.stringify({
          ...activityPayload,
          client: 'Sid Companion Windows',
          timestamp: new Date().toISOString()
        }),
        timeout: 6000
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json().catch(() => ({}));
      this.isConnected = true;
      this.lastError = null;
      this.lastSyncTime = new Date().toISOString();
      return { success: true, data };
    } catch (err) {
      this.isConnected = false;
      this.lastError = err.message;
      return { success: false, error: err.message };
    }
  }
}

module.exports = new ApiClient();
