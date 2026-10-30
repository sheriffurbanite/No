/* Shika Chapaa Hack Predictor Pro - app shell cache.
   Only same-origin GET requests for the page itself are handled; payment/API calls and
   everything cross-origin go straight to the network and are never cached. */
const V = 'scpp-v1';
const PAGE = 'Shika-Chapaa-Signals-guide-1.html';
const SHELL = ['./', PAGE, 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match(PAGE))));
    return;
  }
  if (SHELL.some(p => u.pathname.endsWith(p.replace('./', '')) && p !== './')) {
    e.respondWith(caches.match(r).then(m => m || fetch(r)));
  }
});
