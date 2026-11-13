import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#020408",
          900: "#050814",
          850: "#080e22",
          800: "#0d1636",
          700: "#15224f",
          600: "#1e316d",
          border: "#1c2a52",
        },
        sun: {
          glow: "#ffaa00",
          core: "#fff4d0",
          corona: "#ff7700",
        },
        planet: {
          about: "#6366f1", // Indigo / Cosmic Genesis
          portfolio: "#06b6d4", // Cyan / Forge of Works
          learning: "#8b5cf6", // Purple-Violet / Academy of Knowledge
          gaming: "#10b981", // Emerald / Arena of Play
          music: "#ec4899", // Rose-Pink / Melody Resonance
          messages: "#0284c7", // Sky-Blue / Whisper Frequency
          watchlist: "#f59e0b", // Amber-Orange / Observatory
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.9' },
        }
      },
      animation: {
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};

export default config;
