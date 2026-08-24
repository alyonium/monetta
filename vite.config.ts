import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Monetta',
        short_name: 'Monetta',
        description: 'Personal finance PWA',
        theme_color: '#090d14',
        background_color: '#090d14',
        display: 'standalone',
        start_url: '/',
      },
    }),
  ],
});
