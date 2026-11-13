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
        warm: {
          bg: "#FAF9F6",
          surface: "#FFFFFF",
          subtle: "#F4F3EE",
          hover: "#EFECE5",
          border: "#E8E6DF",
          borderStrong: "#D5D2C8",
          text: "#151413",
          secondary: "#686660",
          muted: "#96948D",
          amber: "#D97706",
          amberSoft: "#FEF3C7",
          lampGlow: "#FDE68A",
        },
        night: {
          bg: "#1C1B18",
          surface: "#24231F",
          subtle: "#2C2A25",
          hover: "#34322C",
          border: "#383630",
          text: "#EDEBE6",
          secondary: "#A3A096",
          muted: "#76736A",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Text'",
          "'SF Pro Display'",
          "'Geist'",
          "'Inter'",
          "system-ui",
          "sans-serif"
        ],
        serif: [
          "'Newsreader'",
          "'Playfair Display'",
          "Georgia",
          "serif"
        ],
        mono: [
          "'SF Mono'",
          "'Geist Mono'",
          "'JetBrains Mono'",
          "ui-monospace",
          "monospace"
        ],
      },
      boxShadow: {
        'apple-sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'apple': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-md': '0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'apple-lg': '0 12px 32px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'lamp': '0 0 45px rgba(245, 158, 11, 0.15)',
      }
    },
  },
  plugins: [],
};

export default config;
