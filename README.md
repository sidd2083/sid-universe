# SID — Personal Digital Space

A personal digital world representing the life, software projects, learning journey, and authentic thoughts of Siddhant (Sidd), based in Hetauda, Nepal.

Designed with an editorial, Apple-inspired philosophy: 100% warm off-white tones (`#FAF9F6`), clean typography, intentional spacing, natural transitions, and zero tech jargon.

---

## ✦ Core Experience

- **Clean Multilingual Greeting:** Dynamic welcoming banner smoothly rotating clean greetings across languages (`Namaste.`, `Hello.`, `Bonjour.`, `Hola.`, `Ciao.`, etc.) without distracting language tags.
- **Large Flip-Style Clock:** Real-time Nepal Standard Time clock (UTC+05:45) with smooth second transitions.
- **Hero Live Activity Card:** Replaced weather widget with a focused live card showing exactly what Siddhant is doing right now (e.g. *"Siddhant is currently playing Grand Theft Auto V"*, *"Siddhant is currently watching YouTube: [Title]"*, *"Siddhant is currently coding StudentHub Nepal"*) along with active session duration.
- **Authentic & Philosophical About Me:** Honest reflections on being a grade 11 student, part-time coder, builder, and gamer; the dopamine rush of creating; learning rapid concepts vs forgetting speed; and sitting in his room figuring out life. Features an inspiring philosophical quote by Albert Camus.
- **Recent Big Project — StudentHub Nepal:** Dedicated showcase for [studenthubnp.com](https://studenthubnp.com) with Siddhant's personal note: *"This was the project that took the longest time to make, and it feels like a child to me. I honestly don't care whether people use it or not — I use it daily, and I love my creation."*
- **Learning & Exploring:** Cleanly organized tracks with an honest disclaimer at the top:
  - **Currently Learning:** Python, NumPy, Pandas, Matplotlib, Seaborn, Calculus, Graphic Designing.
  - **Wanted to Learn:** Linear Algebra, Scikit-Learn, XGBoost, PyTorch, TensorFlow, LangChain, OpenCV, AI/ML Deep Concepts.
  - Includes a link to explore detailed notes at `/learning`.
- **All Interests Visible (Free Time):** Gaming (GTA V, Minecraft, Human: Fall Flat), Music (favorite tracks with Spotify links), and Watchlist (anime & cinema) all clearly visible without hiding behind closed tabs.
- **Private Anonymous Inbox & Published Q&A:** Allows visitors to leave anonymous thoughts and view answered questions.

---

## 🪟 Sid Companion — Windows Desktop App

A lightweight Windows application running in the system tray that detects active processes and streams clean, human status updates to the website.

- **Process Scanner:** Detects running games (`gta5.exe`, `javaw.exe`, `human.exe`, `cs2.exe`), development in Visual Studio Code, 3D modeling in Blender, Photoshop, and Spotify — without dropping full-screen DirectX/Vulkan games.
- **Duration Tracking:** Tracks active continuous usage (e.g. `Active for 45m`) and broadcasts it to the website.
- **Browser Extension Bridge:** Local server on `127.0.0.1:49152` receives active YouTube video titles from the Chrome extension.
- **Privacy Controls:** Master switch to pause sharing anytime, plus granular category toggles.

### How to Run Sid Companion:
```bash
cd companion
npm install
npm start
```
To package as a standalone Windows executable (`.exe`):
```bash
npm run dist
```
The installer and portable executable will be placed in `companion/dist/`.

---

## 🧩 Chrome Extension (YouTube Activity Detection)

The companion app pairs with a lightweight Chrome extension that securely broadcasts YouTube video titles to `http://127.0.0.1:49152/activity`.

### How to Install in Chrome:
1. Go to `chrome://extensions/` in Google Chrome.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the `browser-extension/` directory (or extract `browser-extension.zip`).
4. Whenever you watch a video on YouTube, the extension automatically sends the title to Sid Companion.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & Database:** Google Cloud Firestore (Project `sidhoni`), Firebase Authentication, secure Next.js API routes.
- **Desktop Application:** Electron, PowerShell Windows Process Scanner, Windows System Tray.
- **Deployment:** Vercel ready (`vercel.json`), GitHub Actions automated companion build (`.github/workflows/build-companion.yml`).

---

## 🔒 Administration

Access the private admin dashboard at `/admin/login`.
- Authenticate via authorized Google account or secure master passcode.
- Manage live activity status, edit bio and quotes, reply to anonymous messages, and publish Q&As.
