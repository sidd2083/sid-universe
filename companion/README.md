# SID COMPANION — WINDOWS TELEMETRY CLIENT

Sid Companion is the native Windows background desktop client for **SID UNIVERSE**. It runs quietly in the Windows system tray and synchronizes approved activity, gaming telemetry, media playback, and live heartbeats directly to your interactive cosmic website.

---

## 🚀 Downloads for Windows

| Deliverable | Description | Format |
| :--- | :--- | :--- |
| **[Sid-Companion-Setup.exe](https://github.com/sid/sid-universe/releases/latest/download/Sid-Companion-Setup.exe)** | Official Windows Installer (Recommended) | `.exe` Installer |
| **[Sid-Companion-Portable.exe](https://github.com/sid/sid-universe/releases/latest/download/Sid-Companion-Portable.exe)** | Standalone Executable (No installation required) | Standalone `.exe` |

*Release assets are compiled and validated across Windows 10 and Windows 11 via automated GitHub Actions.*

---

## ⚡ Features

- **System Tray Integration:** Minimizes seamlessly into the Windows notification tray with quick stealth toggles.
- **Process Activity Detection:** Automatically identifies running games (Steam, CS2, Valorant, Minecraft, GTA V, Cyberpunk, etc.) using lightweight PowerShell process scans.
- **Media Telemetry:** Syncs current music playback from Spotify Desktop and YouTube Music (via the browser extension bridge).
- **Coding Focus:** Detects active Visual Studio Code workspaces and open projects.
- **Privacy Controls:** Independent toggles for gaming, music, coding, and custom status, plus an instant **Stealth Mode** button.
- **Auto-Launch with Windows:** Optional startup entry in the Windows registry so your universe remains online without manual starts.
- **Secure Heartbeat:** Periodic 12-second beacon keeping the public Nepal clock and online indicator alive on SID UNIVERSE.

---

## 🛠️ First-Time Setup Instructions

1. **Download & Run:**
   - Run `Sid-Companion-Setup.exe` and follow the guided setup wizard, or run `Sid-Companion-Portable.exe`.
2. **Retrieve Your Secret Token:**
   - Open your SID UNIVERSE website.
   - Navigate to `/admin` and log in to the **Master Control Console**.
   - Click on the **Companion & Integrations** tab.
   - Copy the **Sid Companion Telemetry Token**.
3. **Configure the Companion:**
   - In Sid Companion, paste your website URL (e.g., `https://your-domain.com` or `http://localhost:3000`).
   - Paste the Telemetry Token into the **Secret Telemetry Token** field.
   - Click **Save Settings**.
   - Click **⚡ Scan & Sync Now** to trigger your first cosmic telemetry burst.
4. **Browser Extension Integration (Optional for YouTube/YT Music):**
   - Open Google Chrome, Brave, or Microsoft Edge.
   - Go to `chrome://extensions`, enable **Developer mode**, and click **Load unpacked**.
   - Select the `browser-extension/` folder inside the repository.
   - The extension will automatically bridge active YouTube audio to Sid Companion via `127.0.0.1:49152`.

---

## 🔒 Privacy & Data Policy

Sid Companion is designed with strict data privacy principles:
- **No Personal Data:** Does not scan personal documents, passwords, keystrokes, browser history, or private messages.
- **Whitelisted Scanning:** Only looks for known game process names, VS Code workspace titles, and media player headers.
- **Stealth Mode:** With one click or tray toggle, pause all activity transmission immediately.

---

## 🔧 Building Locally from Source

If you want to build the executable locally:

```bash
cd companion
npm install
npm run build         # Generates dist/Sid-Companion-Setup.exe
npm run build:portable # Generates dist/Sid-Companion-Portable.exe
```

---

## ❓ Troubleshooting

- **Status Shows Disconnected:** Check that your SID UNIVERSE website is reachable and your Telemetry Token matches the one shown in `/admin`.
- **Game Not Detected:** Verify that the game's main window is open. Some anti-cheat systems hide process names; running Sid Companion as Administrator can resolve this.
- **Tray Icon Hidden:** Windows often tucks new tray icons into the overflow arrow. Drag the cyan orb icon out to keep it permanently visible.
