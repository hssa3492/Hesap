const CACHE_NAME = 'namaz-app-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/theme.js',
    '/app.js',
    '/styles.css',
    '/icon.png',
    '/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request)
                    .then(fetchResponse => {
                        // API çağrılarını cache'leme
                        if (event.request.url.includes('aladhan.com')) {
                            return fetchResponse;
                        }
                        
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, fetchResponse.clone());
                                return fetchResponse;
                            });
                    });
            })
            .catch(() => {
                // Offline durumunda fallback
                if (event.request.url.includes('aladhan.com')) {
                    return new Response(JSON.stringify({
                        code: 200,
                        status: "Offline",
                        data: {
                            timings: {
                                Fajr: "06:00",
                                Sunrise: "07:30",
                                Dhuhr: "13:00",
                                Asr: "16:00",
                                Maghrib: "19:30",
                                Isha: "21:00"
                            }
                        }
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            })
    );
});
