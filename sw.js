// Version: 4.0 - Service Worker for PWA Offline Support
const CACHE_NAME = 'travel-guide-cache-v4.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
  // 如果你有其他圖檔 (例如 icon-192.png) 都可以加喺呢度
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache v4.0');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果喺 Cache 搵到，就直接回覆（支援離線瀏覽）
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
            return caches.delete(cacheName); // 清除舊版本 Cache
          }
        })
      );
    })
  );
});