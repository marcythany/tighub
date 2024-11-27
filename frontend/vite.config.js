import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Proxy /api requests to the backend
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://tighub.onrender.com'
          : 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Proxy /auth requests to the backend
      '/auth': {
        target: process.env.NODE_ENV === 'production'
          ? 'https://tighub.onrender.com'
          : 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});
