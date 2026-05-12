// sw.js - Service Worker minimal
self.addEventListener('fetch', (event) => {
  // Nécessaire pour que l'app soit considérée comme PWA
  event.respondWith(fetch(event.request));
});