import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001", // <-- your backend URL/port
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
      target: 'http://localhost:5001',   // <-- and this, so videos load in the player
      changeOrigin: true,
    },
    },
  },
})
