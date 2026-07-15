/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "#080c09",      // very dark slate green
          card: "#0f1812",    // dark card green
          border: "#1c3224",  // forest green border
          accent: "#10b981",  // bright emerald accent
          accentLight: "#34d399", // light emerald
          accentDim: "#065f46", // dark emerald dim
          text: "#ecfdf5",    // minty off-white text
          muted: "#7f9c8b",   // muted green-gray
          danger: "#ef4444",  // warning red
          dangerBg: "#2d1616" // warning dim red
        }
      },
      fontFamily: {
        mono: ["Space Mono", "monospace"],
        sans: ["DM Sans", "sans-serif"],
        condensed: ["Barlow Condensed", "sans-serif"]
      }
    },
  },
  plugins: [],
}
