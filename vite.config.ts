/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'ui': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'icons': ['lucide-react'],
          'animations': ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4242',
        changeOrigin: true,
      },
    },
  },
});
