import type { APIRoute } from 'astro';
import { tracks } from '../lib/tracks';

// The service worker, generated at build time so every deploy gets a new
// version: it saves every page (and the review data) on install, then serves
// from the cache so the site works offline. Music is left out (too big).
const base = import.meta.env.BASE_URL;
const pages = [
  '', 'map/', 'review/', 'gallery/', 'sync/',
  ...tracks.flatMap((t) => [`${t.slug}/drill/`, `${t.slug}/patterns/`, `review/${t.slug}.json`]),
].map((p) => base + p);
const statics = ['favicon.svg', 'app-icon.svg', 'icon-192.png', 'manifest.webmanifest'].map((p) => base + p);

const sw = (version: string) => `// Tells service worker ${version}
const BASE = ${JSON.stringify(base)};
const PAGES = 'tells-pages-${version}';
const ASSETS = 'tells-assets';
const FONTS = 'tells-fonts';
const URLS = ${JSON.stringify([...pages, ...statics])};

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const pages = await caches.open(PAGES);
    const assets = await caches.open(ASSETS);
    const found = new Set();
    await Promise.allSettled(URLS.map(async (u) => {
      const res = await fetch(u, { cache: 'no-cache' });
      if (!res.ok) return;
      if (u.endsWith('/')) {
        const html = await res.clone().text();
        for (const m of html.matchAll(/["'(]([^"'()\\s]*\\/_astro\\/[^"'()\\s]+)/g)) found.add(new URL(m[1], location.origin + u).href);
      }
      await pages.put(u, res);
    }));
    // Built assets have hashed names, so a cached copy never goes stale.
    // Scripts import other chunks, so follow those imports too.
    const done = new Set();
    const save = async (u) => {
      if (done.has(u)) return;
      done.add(u);
      let res = await assets.match(u, { ignoreVary: true });
      if (!res) {
        res = await fetch(u);
        if (!res.ok) return;
        await assets.put(u, res.clone());
      }
      if (!u.endsWith('.js')) return;
      const js = await res.text();
      const next = [...js.matchAll(/["'](\\.{1,2}\\/[^"'\\s]+?\\.(?:js|css))["']/g)].map((m) => new URL(m[1], u).href);
      await Promise.allSettled(next.map(save));
    };
    await Promise.allSettled([...found].map(save));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('tells-pages-') && k !== PAGES) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function fromCache(req, name) {
  const hit = await caches.match(req, { cacheName: name, ignoreVary: true });
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') (await caches.open(name)).put(req, res.clone());
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    e.respondWith(fromCache(req, FONTS).catch(() => Response.error()));
    return;
  }
  if (url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;
  if (url.pathname.startsWith(BASE + 'audio/')) return; // music streams from the network
  if (url.pathname.startsWith(BASE + '_astro/')) {
    e.respondWith(fromCache(req, ASSETS));
    return;
  }
  // Pages and data: the saved copy first (instant, works offline), else the network.
  e.respondWith((async () => {
    const path = url.pathname.endsWith('/') || url.pathname.includes('.') ? url.pathname : url.pathname + '/';
    const hit = await caches.match(path, { cacheName: PAGES, ignoreSearch: true, ignoreVary: true });
    if (hit) return hit;
    try {
      return await fetch(req);
    } catch (err) {
      if (req.mode === 'navigate') {
        const home = await caches.match(BASE, { cacheName: PAGES, ignoreVary: true });
        if (home) return home;
      }
      throw err;
    }
  })());
});
`;

export const GET: APIRoute = () =>
  new Response(sw(Date.now().toString(36)), { headers: { 'Content-Type': 'text/javascript' } });
