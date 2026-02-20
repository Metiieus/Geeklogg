/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Paleta de cores do Geeklogg
        primary: {
          DEFAULT: "#7c3aed", // violet-600
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        dark: {
          DEFAULT: "#0a0a0f",
          50: "#1a1a2e",
          100: "#16213e",
          200: "#0f3460",
          card: "#12121a",
          border: "#2a2a3e",
          text: "#e2e8f0",
          muted: "#94a3b8",
        },
        accent: {
          cyan: "#06b6d4",
          pink: "#ec4899",
          gold: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Inter", "System"],
        mono: ["JetBrainsMono", "Courier"],
      },
    },
  },
  plugins: [],
};
