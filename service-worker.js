/* ════════════════════════════════════════════════════
   DICOTOMÍA DE CONTROL — service-worker.js
   Estrategia: Cache-first para assets, red para resto
════════════════════════════════════════════════════ */

const CACHE_NAME = 'dicotomia-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// ── INSTALL: cachear todos los assets ────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ── ACTIVATE: limpiar caches viejos ──────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: cache-first ───────────────────────────────
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // Si falla la red y no hay cache, devolver index.html
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
