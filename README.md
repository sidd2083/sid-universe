# SID UNIVERSE — THE INTERACTIVE DIGITAL COSMOS

Welcome to **SID UNIVERSE**, a custom-built interactive personal cosmos representing the digital world of Sid.

Built as an immersive 3D solar system rather than a generic portfolio, seven unique planets revolve continuously around the central Sun (representing Sid). Each planet opens a distinct sector of his creations, knowledge, gaming, music, watchlist, and public communications.

---

## 🌌 Core Concepts & The 7 Celestial Bodies

| Sector | Planet Name | Focus Area | Route | Visual Atmosphere |
| :--- | :--- | :--- | :--- | :--- |
| **Sector 01** | **CHRONICLE** | About Me & Origins | `/about` | Deep Indigo • Core Milestones & Philosophy |
| **Sector 02** | **FORGE** | Creations & Portfolio | `/portfolio` | Cyan / Electric • Industrial Foundry with Rings |
| **Sector 03** | **SYNAPSE** | Learning & Studies | `/learning` | Purple / Neural • Filament Waves of Knowledge |
| **Sector 04** | **ARENA** | Gaming Realm | `/gaming` | Emerald / Cyber • Live Game Telemetry & Hall of Games |
| **Sector 05** | **RESONANCE** | Music & Frequencies | `/music` | Rose / Pink • Acoustic Gas Sphere & Sound Player |
| **Sector 06** | **WHISPER** | Anonymous Messages | `/anonymous-messages` | Sky Blue • Ethereal Nebula & Public Q&A |
| **Sector 07** | **OBSERVATORY**| Watchlist & Feeds | `/watchlist` | Amber / Gold • Outer Astronomical Watchpost |

*The center of the universe features a glowing, procedural 3D Sun with pulsing corona shaders representing Sid.*

---

## 🪟 Sid Companion — Windows Desktop Application

Sid Companion is a standalone Windows desktop client that runs in the background and synchronizes live telemetry to the website.

### 📥 Download Official Release Binaries
- **[Download Sid-Companion-Setup.exe](https://github.com/sid/sid-universe/releases/latest/download/Sid-Companion-Setup.exe)** (Guided Windows Installer)
- **[Download Sid-Companion-Portable.exe](https://github.com/sid/sid-universe/releases/latest/download/Sid-Companion-Portable.exe)** (Standalone / No Install Needed)

### Capabilities:
- Detects active games (Counter-Strike 2, Valorant, Minecraft, Cyberpunk 2077, GTA V, etc.).
- Detects active VS Code workspace and project name.
- Captures Spotify and YouTube Music playback (via browser extension bridge).
- Runs in the Windows system tray with one-click **Stealth Mode**.
- Automated GitHub Actions workflow (`.github/workflows/build-companion.yml`) compiles new installers on every release tag.

See [`companion/README.md`](companion/README.md) for full instructions.

---

## 🛡️ Firebase & Security Architecture

1. **Firestore Security Rules:** Fully hardened CEL rules in [`firestore.rules`](firestore.rules).
   - **Public Read:** `siteSettings`, `planets`, `projects`, `learningTopics`, `games`, `songs`, `playlists`, `watchlist`, `timeline`, `publishedQA`, `publicActivity`.
   - **Anonymous Message Lockdown:** Visitors can submit messages up to 2000 chars, but can **never** read, list, or delete messages.
   - **Telemetry Isolation:** `privateActivity` and `integrations` tokens are strictly blocked from public read.
   - **Default Deny:** Catch-all blocks all unlisted collections.
2. **Unified Data Layer:** Supports live Firebase Firestore as well as reactive offline persistence out-of-the-box.

---

## 🎛️ Admin Control Center

Log in at `/admin` (Default access code: `sid2026`).

Ten comprehensive management sectors:
1. **Overview:** Universe uptime, transmission count, telemetry health.
2. **Profile & Identity:** Name, bio, tagline, profile image, and social links.
3. **Planets Management:** Real-time orbital radius, orbital speed, rotation, and visibility.
4. **Projects (Forge):** Add, edit, or delete portfolio projects.
5. **Live Telemetry & Activity:** Custom status, presence toggle, and manual overrides.
6. **Anonymous Inbox & Q&A:** Read incoming messages, moderate, write replies, and publish them to Planet Whisper.
7. **Companion & Integrations:** Generate and copy secret companion tokens.
8. **Appearance:** Theme settings, lighting, and performance toggles.
9. **Analytics:** Sector view counts and traffic distribution.
10. **General Settings:** Local Nepal clock settings (`Asia/Kathmandu`, UTC+5:45) and database parameters.

---

## 🚀 Getting Started

### 1. Website Development Server
```bash
cd website
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Website Production Build
```bash
cd website
npm run build
npm start
```

### 3. Sid Companion Desktop Client
```bash
cd companion
npm install
npm start
```

### 4. YouTube Browser Extension
1. Open Chrome / Edge / Brave and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `browser-extension/` directory.

---

## 📜 Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **3D Graphics:** Three.js, WebGL procedural shaders, particle starfields, dynamic raycasting.
- **Backend:** Firebase Firestore, Firebase Authentication, secure server-side API routes.
- **Desktop:** Electron, PowerShell Windows Process Scanner, Windows System Tray, native installers.
- **CI/CD:** GitHub Actions automated Windows binary compiler.
