// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), tailwind()],
  },
  output: 'static', // Keep static by default
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations: [react()]
});