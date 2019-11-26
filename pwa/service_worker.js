// configuration
const
  version = '1.0.0',
  CACHE = version + '::PWAsite',
  // offlineURL = '/offline/',
  // installFilesEssential = [
    // '/',
    // '/manifest.json',
    // '/css/styles.css',
    // '/js/main.js',
    // '/js/offlinepage.js',
    // '/images/logo/logo152.png'
  // ].concat(offlineURL),
  installFilesDesirable = [
    // '/favicon.ico',
    // '/images/logo/logo016.png',
    // '/images/hero/power-pv.jpg',
    // '/images/hero/power-lo.jpg',
    // '/images/hero/power-hi.jpg'
  ];




self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  console.log(e);
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  console.log(e);
});

// 現状では、この処理を書かないとService Workerが有効と判定されないようです
self.addEventListener('fetch', function(event) {
  console.log(event);
});