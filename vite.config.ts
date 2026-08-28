import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const fireflyUrl = loadEnv(mode, process.cwd(), '').FIREFLY_III_BASE_URL;

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['favicon.svg'],
        devOptions: {
          enabled: true,
          type: 'module',
        },
        manifest: {
          name: 'Monetta',
          short_name: 'Monetta',
          description: 'Personal finance PWA',
          theme_color: '#242424',
          background_color: '#242424',
          display: 'standalone',
          id: '/',
          scope: '/',
          start_url: '/',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, 'src'),
      },
    },
    server: {
      host: true,
      port: 5175,
      strictPort: true,
      allowedHosts: true,
      proxy: fireflyUrl
        ? { '/api': { target: fireflyUrl, changeOrigin: true } }
        : undefined,
    },
  };
});
