import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "e88072b89909.ngrok-free.app" // 👈 آدرس ngrok
    ],
  },
});
