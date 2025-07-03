import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
  },
  build: {
    chunkSizeWarningLimit: 1000, // optional: silence warning if chunks are okay
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("socket.io-client")) return "socket";
            if (id.includes("react-router-dom")) return "react-router";
            if (id.includes("firebase")) return "firebase";
            if (id.includes("framer-motion")) return "framer";
            return "vendor";
          }
        },
      },
    },
  },
});
