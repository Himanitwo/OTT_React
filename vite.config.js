import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    headers: {
      'X-Custom-Header': 'value',
    },
    // If you're using proxying or additional configurations that could be increasing header size, check for those.
  }
  

})
