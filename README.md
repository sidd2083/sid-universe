# SID — Personal Digital Space

A personal digital world representing the life, software projects, learning journey, and thoughts of Sid, based in Hetauda, Nepal.

Designed with an editorial, Apple-inspired philosophy: warm off-white tones, clean typography, intentional spacing, and natural transitions.

---

## ✦ Core Experience

- **Multilingual Greeting:** Dynamic welcoming banner smoothly rotating greetings across languages (Namaste, Hello, Bonjour, Hola, Ciao, etc.).
- **Large Flip-Style Clock:** Real-time Nepal Standard Time clock (UTC+05:45) with smooth second transitions.
- **Live Location Atmosphere:** Real-time Hetauda, Nepal weather integration (temperature, condition, sunrise/sunset, rain).
- **Dynamic Day & Night Atmosphere:** Automatically transitions between fresh morning, daylight, warm evening, and a cozy lamp-lit night mode.
- **Live Activity Integration:** Synchronized foreground activity from Sid Companion (games, VS Code, music, YouTube).
- **Projects (Built, Building, Planned):** Showcases StudentHub Nepal, GSConfession, and future explorations with full case study detail pages.
- **Learning & Exploring:** Two clearly separated tracks for active studies (Python, NumPy, Pandas, Web dev, Blender) and future interests.
- **Private Anonymous Messages & Q&A:** Allows visitors to leave private notes without name or account, with an admin inbox and public answered Q&A archive.
- **Personal Interests:** Dedicated sections for gaming (GTA V, Minecraft, Human: Fall Flat), music favorites, and content watchlist.

---

## 🪟 Sid Companion — Windows Desktop Client

A private desktop application running quietly in the Windows system tray that detects foreground activity and streams approved status to the website.

- **Process Scanner:** Detects running games (GTA V, Minecraft, Human: Fall Flat, Counter-Strike 2), Visual Studio Code workspaces, and Spotify.
- **Browser Extension Bridge:** Local server on `127.0.0.1:49152` receives active YouTube video titles from the Chrome extension.
- **Privacy Controls:** One master **Share Activity** switch, plus granular category toggles.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & Database:** Google Cloud Firestore (Project `sidhoni`), Firebase Authentication, secure Next.js API routes.
- **Atmosphere API:** Real-time weather integration via Open-Meteo for Hetauda (27.4284° N, 85.0331° E).
- **Desktop Application:** Electron, PowerShell Windows Process Scanner, Windows System Tray.
- **CI/CD & Deployment:** Vercel 1-click deployment, GitHub Actions Windows binary packaging.

---

## 🚀 Running Locally

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

### 4. Chrome Extension
1. Go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `browser-extension/` directory.

---

## 🔒 Administration

Access the private admin dashboard at `/admin` (no public links exist on the website).
Authenticated via authorized Google account or master passcode.
