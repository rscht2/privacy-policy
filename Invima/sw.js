/* Service worker: app shell sin conexión + caché de las librerías del OCR.
   Las consultas a datos.gov.co NUNCA se cachean (siempre red). */
const VERSION = "v1";
const SHELL_CACHE = "invima-shell-" + VERSION;
const LIB_CACHE = "invima-lib-" + VERSION;
const SHELL = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
const LIB_HOSTS = ["cdn.jsdelivr.net", "unpkg.com", "tessdata.projectnaptha.com", "cdnjs.cloudflare.com"];
const API_HOSTS = ["www.datos.gov.co", "api.us.socrata.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => ![SHELL_CACHE, LIB_CACHE].includes(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (API_HOSTS.includes(url.hostname)) return;                 // red directa

  if (url.origin === self.location.origin) {
    if (req.mode === "navigate") {                              // red primero, caché si no hay conexión
      e.respondWith(fetch(req).catch(() => caches.match("index.html")));
      return;
    }
    e.respondWith(                                              // stale-while-revalidate
      caches.open(SHELL_CACHE).then(async cache => {
        const hit = await cache.match(req);
        const net = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r; }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  if (LIB_HOSTS.includes(url.hostname)) {                       // librerías OCR: caché primero
    e.respondWith(
      caches.open(LIB_CACHE).then(async cache => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const r = await fetch(req);
        if (r.ok || r.type === "opaque") cache.put(req, r.clone());
        return r;
      })
    );
  }
});
