import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3050,
    proxy: {
      '/api': {
        target: 'http://localhost:3051',
        changeOrigin: true
      }
    },
    allowedHosts: ['plasmic-5a75.sampullman.com']
  }
})
