# SID COMPANION — WINDOWS ACTIVITY CLIENT

Sid Companion is the native Windows background desktop client for **Sid's Personal Web Space**. It runs quietly in the Windows system tray and synchronizes approved activity, gaming telemetry, media playback, and live heartbeats directly to your website.

---

## ⚡ Features

- **System Tray Integration:** Minimizes seamlessly into the Windows notification tray with an instant pause toggle.
- **Process Activity Detection:** Automatically identifies running games (GTA V, Minecraft, Human: Fall Flat, Counter-Strike 2, etc.) using lightweight PowerShell process scans.
- **Media Telemetry:** Syncs current music playback from Spotify Desktop and YouTube Music (via the browser extension bridge).
- **Coding Focus:** Detects active Visual Studio Code workspaces and open projects.
- **Privacy Controls:** Master **Share Activity** switch, plus independent toggles for gaming, music, coding, and custom status.
- **Auto-Launch with Windows:** Optional startup entry in the Windows registry so your website reflects active presence without manual starts.
- **Secure Heartbeat:** Periodic 12-second beacon keeping the Nepal clock and online presence accurate.

---

## 🛠️ First-Time Setup Instructions

1. **Launch Sid Companion:**
   - Run `Sid-Companion-Setup.exe` or `Sid-Companion-Portable.exe`.
2. **Configure:**
   - In Sid Companion, paste your website URL (e.g., `https://your-domain.vercel.app` or `http://localhost:3000`).
   - Paste the Telemetry Token from your private `/admin` dashboard.
   - Click **Save Connection Settings**.
3. **Browser Extension Integration (Optional for YouTube metadata):**
   - Open Google Chrome or Microsoft Edge.
   - Go to `chrome://extensions`, enable **Developer mode**, and click **Load unpacked**.
   - Select the `browser-extension/` folder in this repository.
   - The extension will automatically bridge active YouTube audio to Sid Companion via `127.0.0.1:49152`.

---

## 🔒 Privacy & Data Policy

Sid Companion is strictly designed for personal privacy:
- **No Personal Data:** Does not scan personal documents, passwords, keystrokes, browsing history, or private messages.
- **Whitelisted Scanning:** Only inspects known game process names, VS Code workspace titles, and media player headers.
- **Instant Pause:** Click the master switch or tray checkbox to pause all activity transmission immediately.

---

## 🔧 Building Locally from Source

```bash
cd companion
npm install
npm run build         # Generates dist/Sid-Companion-Setup.exe
npm run build:portable # Generates dist/Sid-Companion-Portable.exe
```
