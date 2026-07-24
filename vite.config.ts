import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
  server: {
    watch: {
      useFsEvents: false,
      usePolling: process.env.CODEX_SANDBOX === "seatbelt",
    },
  },
});
