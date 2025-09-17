import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "https://80663b376070.ngrok-free.app" // 👈 آدرس ngrok
    ],
  },
});
