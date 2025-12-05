// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  server: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 5000,
  },

  image: {
    domains: ['yem.yenamarre.sn', 'lesvillageois.org', 'www.lesvillageois.org'],
  },

  integrations: [react()],

  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },

    // @ts-ignore - Type mismatch between @tailwindcss/vite and Astro's internal Vite version
    plugins: [tailwindcss()],
  },
});