import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// Served from https://<user>.github.io/tells/
export default defineConfig({
  base: '/tells/',
  integrations: [preact()],
  // Old single-track URLs from the first release.
  redirects: {
    '/drill': '/tells/dsa/drill/',
    '/patterns': '/tells/dsa/patterns/',
  },
});
