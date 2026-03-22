import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 9000,
        host: '0.0.0.0',
      },
      preview: {
        port: 9000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['logo_abravacon_transparent.png'],
          manifest: {
            name: 'CRM ABRACON',
            short_name: 'CRM ABRACON',
            description: 'Gestão de Relacionamento e Simulações ABRACON.',
            theme_color: '#071226',
            background_color: '#f8f9fa',
            display: 'standalone',
            icons: [
              {
                src: '/logo_abravacon_transparent.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/logo_abravacon_transparent.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
