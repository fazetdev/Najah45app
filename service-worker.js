// Service Worker for offline functionality
const CACHE_NAME = 'najah45-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/offline.html',
  '/css/style.css',
  '/css/rtl.css',
  '/js/supabase-config.js',
  '/js/auth.js',
  '/js/dashboard.js',
  '/js/progress.js',
  '/js/portfolio.js',
  '/js/celebration.js',
  '/js/phases.js',
  '/js/offline-sync.js'
];

// Install event - cache essential files
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(function() {
        // Fallback to offline page
        return caches.match('/offline.html');
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
