const CACHE_NAME = "ayush-practice-v2";
const FILES_TO_CACHE = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Network-first: always try to get the latest version from GitHub first.
// Only fall back to the cached copy if there's no internet.
self.addEventListener("fetch", function(event) {
  event.respondWith(
    fetch(event.request).then(function(response) {
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(event.request, copy);
      });
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
