/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Colorful trust-focused theme. Token names kept so existing classNames work.
        ink: { 950: "#f5f8ff", 900: "#eef3ff", 800: "#ffffff", 700: "#e3e9f5", 600: "#c9d3e6" },
        ivory: { 50: "#0b1b3b", 100: "#1e2b4a", 200: "#5a6784" },
        brand: { 50: "#eef4ff", 100: "#dbe8ff", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8" },
        moss: { 400: "#10b981", 500: "#059669", 600: "#047857" },
        clay: { 400: "#2563eb", 500: "#1d4ed8", 600: "#1e40af" },
        accent: { 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706" },
      },
      fontFamily: {
        display: ["Manrope", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
