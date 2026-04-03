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
        background: "#0a0a0a", // Deep charcoal/black
        foreground: "#ededed", // Soft white
        card: "#121212", // Slightly lighter black
        "card-hover": "#1a1a1a",
        primary: "#dc2626", // Red 600
        secondary: "#94a3b8", // Slate 400 (More silver)
        accent: "#f59e0b", // Amber 500
        muted: "#525252", // Neutral 600
        "muted-foreground": "#a3a3a3", // Neutral 400
        border: "#262626", // Neutral 800
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        heading: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "sans-serif"],
      },
      animation: {
        'pulse-slow': 'pulse 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
