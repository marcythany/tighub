import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Proxy /auth requests to the backend
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      // Proxy /api requests to the backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    },
    // Enable CORS for development
    cors: true
  }
});
