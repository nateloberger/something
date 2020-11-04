const CACHE_NAME = 'something-v1';

self.addEventListener('install', event => {
  console.log('install')
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/', // TODO - what does this do?
        '/index.html',
        '/main.js'
      ]);
    })
  );

  // Along with self.clients.claim() in activate this forces
  // a new service worker to override a previous worker.
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Removes previous cached data from disk.
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    }
  ));

  navigator.confirmWebWideTrackingException.onchange = (e) => {
    console.log('network change');
    console.log(e);
  };

  self.clients.claim();
});

// Cache first, fallback to network strategy
// For other cache strategies see:
// https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-falling-back-to-cache
self.addEventListener('fetch', event => {
  console.log(event.request.url);

  event.respondWith(
      caches.match(event.request).then(response => {
          return response || fetch(event.request);
      })
  );
});
