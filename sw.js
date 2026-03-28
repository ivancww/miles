/* ==========================================
   哩數攻略 (Mileage Exchanger) PWA
   檔案：sw.js (Service Worker)
   版本：v1.3.1
========================================== */

const CACHE_NAME = 'mileage-calculator-cache-v1.3.0';
const urlsToCache = [
  './',
  './index.html',
  './style.css?v=1.3.0',
  './app.js?v=1.3.0',
  './manifest.json'
  // 若有圖示 (如 icon-192.png)，可於此處加入
];

// 安裝 Service Worker 並快取檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache v1.3.0');
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截 Fetch 請求 (離線優先策略)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 若在 Cache 找到，則回傳 Cache，否則透過網路抓取
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// 啟動 Service Worker 並清除舊版 Cache
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName); 
          }
        })
      );
    })
  );
});