// サービスワーカー。ホーム画面に追加（PWA）できるようにするために置いている。
// 扱うのはこのフォルダ（tok_wiki/）のファイルだけ。いつもはネットから最新を取り、取れなかったとき（電波が悪いなど）だけ前回の分を返す。
// 地図ツール・地図画像・GitHub への保存の通信は扱わない（素通し）。保存データを古いまま返すと、チェックが巻き戻るため
'use strict';

// 古い保存分を消すときの目印。同じドメイン（dancerksk307.github.io）の他のページの保存分は消さないよう、名前の頭で見分ける
var CACHE_PREFIX = 'totk-map-';
var CACHE_NAME = CACHE_PREFIX + 'v1';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (names) {
        return Promise.all(names
          .filter(function (name) { return name.indexOf(CACHE_PREFIX) === 0 && name !== CACHE_NAME; })
          .map(function (name) { return caches.delete(name); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;
  var url = new URL(request.url);
  var scopePath = new URL(self.registration.scope).pathname;
  if (url.origin !== self.location.origin || url.pathname.indexOf(scopePath) !== 0) return;

  event.respondWith(
    fetch(request)
      .then(function (response) {
        if (response.ok) {
          var copy = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.put(request, copy); }));
        }
        return response;
      })
      .catch(function (error) {
        return caches.match(request).then(function (cached) {
          if (cached) return cached;
          throw error;
        });
      })
  );
});
