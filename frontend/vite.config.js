import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      '5174-inzcq16k9a3hgmo2qnjhh-6f6da37d.manusvm.computer', // النطاق المؤقت
      'localhost',
      '127.0.0.1',
    ],
  },
})
