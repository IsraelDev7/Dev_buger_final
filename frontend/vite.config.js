import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/product-file': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/category-file': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
