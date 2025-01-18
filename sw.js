self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('app-v2').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/icon.png',
                '/theme.js'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
