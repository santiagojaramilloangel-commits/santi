import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
  // Support client-side routing: serve index.html for all routes
  server: {
    historyApiFallback: true,
  },
});
