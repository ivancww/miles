/* ==========================================
   哩數攻略 (Mileage Exchanger) PWA
   檔案：sw.js (Service Worker)
   版本：v1.5.
========================================== */

const CACHE_NAME = 'mileage-calculator-cache-v1.5.0';
const urlsToCache = [
  './',
  './index.html',
  './style.css?v=1.5.0',
  './app.js?v=1.5.0',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // 對於 POST 請求（例如傳送至 Google Sheet）不進行 Cache
  if (event.request.method === 'POST') {
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); 
          }
        })
      );
    })
  );
});