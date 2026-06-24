import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
          env.NODE_ENV === 'production' ? '[hash:base64:6]' : '[name]__[local]__[hash:base64:4]',
      },
    },

    server: {
      open: true,
      port: 3000,
      proxy: {
        '/api': {
          target: `${env.VITE_API_URL}`,
          changeOrigin: true,
        },
        '/ws': {
          target: `${env.VITE_WS_URL}`,
          changeOrigin: true,
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
  };
});
