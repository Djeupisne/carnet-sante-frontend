import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ CONFIGURATION COMPLÈTE CORRIGÉE
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  // ✅ IMPORTANT pour le routing SPA en production
  base: '/',
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})