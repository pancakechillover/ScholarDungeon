import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: "Scholar's Dungeon",
          short_name: "Scholar's Dungeon",
          description: 'A gamified productivity app',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          gcm_sender_id: '103953800507',
          icons: [
            {
              src: 'pwa-icon.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        } as any
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VAPID_PUBLIC_KEY': JSON.stringify(env.VAPID_PUBLIC_KEY || "BLqju80Sl3cUDF0s-0pEallPIkVpxl-2l5NJMh-X2twNOmvTUU4q1Q2yotukIZEEt92QANtsukbTwk6L7I7LITo"),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
