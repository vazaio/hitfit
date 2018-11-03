const CACHE_V='1.0',
    CACHE_FILES=[
        '/',
        '/index.html',
        '/manifest.json',
        '/sw.js',
        '/dist/',
        '/dist/favicon.ico',
        '/dist/shoes.svg',
        '/dist/logo.svg',
        '/dist/build.js',
        '/dist/batteryIcon.svg',
        '/dist/fitness-bracelet.svg',
        '/dist/flash.svg',
        '/dist/heart.svg',
        '/dist/heartIcon.svg',
        '/dist/loading.svg',
        '/dist/plus.svg',
        '/dist/stepIcon.svg',
        '/dist/sync.svg',
        '/dist/wind.svg',
        '/dist/font.woff2',
        '/dist/icons/',
        '/dist/icons/icon-128x128.png',
        '/dist/icons/icon-144x144.png',
        '/dist/icons/icon-72x72.png',
        '/dist/icons/icon-96x96.png',
        '/dist/icons/icon-152x152.png',
        '/dist/icons/icon-192x192.png',
        '/dist/icons/icon-384x384.png',
        '/dist/icons/icon-512x512.png'
    ]

self.addEventListener('install', e => {
    console.log('Кеширование файлов sw')
    e.waitUntil(
        caches.open(CACHE_V)
        .then(cache => cache.addAll(CACHE_FILES))
        .catch(err => console.log('Ошибка кеширования', err))
    )
})

self.addEventListener('activate', e => {
    console.log(`Активирован sw [${e.type}]`)
})

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
        .then(res => res || fetch(e.request))
        .catch(err => console.error('Ошибка fetch', err))
    )
})
