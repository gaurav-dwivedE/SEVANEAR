/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Light theme: "ink" tokens are now the light surfaces and
        // "ivory" tokens are now the dark text colors (names kept as-is
        // so every existing className in the app still works correctly).
        ink: { 950: "#ffffff", 900: "#f6f6f6", 800: "#ffffff", 700: "#ebebeb", 600: "#d2d2d2" },
        ivory: { 50: "#000000", 100: "#111111", 200: "#5c5c5c" },
        moss: { 400: "#111111", 500: "#000000", 600: "#000000" },
        clay: { 400: "#111111", 500: "#000000", 600: "#222222" },
        // Only overriding the shades used as *text* for error states so
        // they stay readable on the light background; red-500 keeps its
        // default value since it's only ever used as a low-opacity tint.
        red: { 300: "#111111", 400: "#111111" },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "ui-sans-serif", "system-ui", "sans-serif"],
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
