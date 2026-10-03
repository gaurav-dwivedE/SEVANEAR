import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { sourcemap: false, chunkSizeWarningLimit: 600, rollupOptions: { output: { manualChunks: { react: ["react","react-dom","react-router-dom"], motion: ["gsap","lenis"] } } } },
  server: {
    port: 5173,
  },
});
