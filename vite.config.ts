import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Test-task/',
  plugins: [react()],
  server: {
    open: true,
  },
  preview: {
    port: 4173,
  },
})
