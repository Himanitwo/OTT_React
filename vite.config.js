import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
      },
    },
    headers: {
      'X-Custom-Header': 'value',
    },
    // If you're using proxying or additional configurations that could be increasing header size, check for those.
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("socket.io-client")) return "socket";
            if (id.includes("react-router-dom")) return "react-router";
            return "vendor";
          }
        },
      },
    },
  },
  

})
