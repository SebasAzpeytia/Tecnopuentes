import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// TODO: una vez que existan los íconos reales (ver public/icons/),
// completar los tamaños en `manifest.icons` abajo.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TecnoPuentes',
        short_name: 'TecnoPuentes',
        description: 'Conectando generaciones a través de la tecnología',
        theme_color: '#1d459e',
        background_color: '#fefdf7',
        display: 'standalone',
        start_url: '/',
        icons: [
          // TODO: agregar icon-192.png e icon-512.png en public/icons/
        ],
      },
      workbox: {
        // Cachea el shell de la app; los datos siguen viniendo de Supabase.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
});
