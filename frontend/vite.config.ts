import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },

  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName:
        process.env.NODE_ENV === 'production'
          ? '[hash:base64:6]'
          : '[name]__[local]__[hash:base64:4]',
    },
  },

  server: {
    open: true,
    port: 3000,
    proxy: {
      '/api': {
        target: `${process.env.VITE_API_URL}`,
        changeOrigin: true,
      },
      'ws://base.invalid/': {
        target: `${process.env.VITE_WS_URL}`,
        changeOrigin: true,
        ws: true,
      },
    },
  },

  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
});
