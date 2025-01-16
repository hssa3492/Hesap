self.addEventListener('install', (event) => {
event .waitUntil(
caches.open('app-v1').then((cache) => {
return cache.addAl1([
'/',
'/index.html',
"/icon.png"
]);
});

self.addEventListener('fetch', (event) => {
event . respondwith(
caches.match(event.request).then((response) =>
return response || fetch(event.request);

);
});
