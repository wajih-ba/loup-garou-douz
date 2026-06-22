import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/loup-garou-douz/',
  server: {
    proxy: {
      '/generate': 'http://localhost:5000',
      '/health':   'http://localhost:5000',
    },
  },
})
