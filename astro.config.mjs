import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// Served from https://<user>.github.io/tells/
export default defineConfig({
  base: '/tells/',
  integrations: [preact()],
});
