// var CACHE_NAME  = "cache_1.0.0";

// var urlsToCache = [
//     "index.html",
//     "offline.html",
//     "css/app.css",
//     "js/app.js",
//     "js/vue.min.js",
//     "js/axios.min.js",
//     "js/localforage.min.js",
//     "js/xdate.js",
//     "js/sortable.min.js",
//     "js/vuedraggable.umd.min.js",
//     "images/icons/icon-72x72.png",
// ];


// self.addEventListener('install', function(event) {
//   console.log('[Service Worker]',event.type);
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(function(cache){
//       // 指定したリソースをキャッシュへ追加
//       return cache.addAll(urlsToCache);
//       // return cache.addAll(urlsToCache.map(url => new Request(url, {credentials: 'same-origin'})));
//       // 1つでも失敗したらService Workerのインストールはスキップされる
//     })
//   );
// });

// //新しいバージョンのServiceWorkerが有効化されたとき
// self.addEventListener('activate', (event) => {
//   console.log('[Service Worker]',event.type);
//   var cacheWhitelist = [CACHE_NAME];

//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           console.log(cacheName,cacheNames);
//           // ホワイトリストにないキャッシュ(古いキャッシュ)は削除する
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             console.log("[Cache Delete]",cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   console.log('[Service Worker]',event.request.url);
//   var online = navigator.onLine;

//   // ファイルパス ~/test.htmlにアクセスすると、このファイル自体は無いがServiceWorkerがResponseを作成して表示してくれる
//   if (event.request.url.indexOf('test.html') != -1) {
//     return event.respondWith(new Response('任意のURLの内容をここで自由に返却できる'));
//   }

//   if(online){
//     // console.log("ONLINE");
//     //このパターンの処理では、Responseだけクローンすれば問題ない
//     //cloneEventRequest = event.request.clone();
//     event.respondWith(
//       caches.match(event.request)
//         .then(
//         function (response) {
//           if (response) {
//             //オンラインでもローカルにキャッシュでリソースがあればそれを返す
//             //ここを無効にすればオンラインのときは常にオンラインリソースを取りに行き、その最新版をキャッシュにPUTする
//             return response;
//           }
//           //request streem 1
//           return fetch(event.request)
//             .then(function(response){
//               //ローカルキャッシュになかったからネットワークから落とす
//               //ネットワークから落とせてればここでリソースが返される

//               // Responseはストリームなのでキャッシュで使用してしまうと、ブラウザの表示で不具合が起こる(っぽい)ので、複製したものを使う
//               cloneResponse = response.clone();

//               if(response){
//                 if(response || response.status == 200){
//                   console.log("正常にリソースを取得");
//                   caches.open(CACHE_NAME)
//                     .then(function(cache)
//                     {
//                       console.log("キャッシュへ保存");
//                       cache.put(event.request, cloneResponse)
//                       .then(function(){
//                         console.log("保存完了");
//                       });
//                     });
//                 }else{
//                   return event.respondWith(new Response('200以外のエラーをハンドリングしたりできる'));
//                 }
//                 return response;
//               }
//             }).catch(function(error) {
//               return console.log(error);
//             });
//         })
//     );
//   }else{
//     console.log("OFFLINE");
//     event.respondWith(
//       caches.match(event.request)
//         .then(function(response) {
//           // キャッシュがあったのでそのレスポンスを返す
//           if (response) {
//             return response;
//           }
//           //オフラインでキャッシュもなかったパターン
//           return caches.match("offline.html")
//               .then(function(responseNodata)
//               {
//                 return responseNodata;
//               });
//         }
//       )
//     );
//   }
// });

// ServiceWorker処理：https://developers.google.com/web/fundamentals/primers/service-workers/?hl=ja

// キャッシュ名とキャッシュファイルの指定
var CACHE_NAME = 'pwa-sample-caches';
var urlsToCache = [
  '/pwa/',
  '/pwa/css/style.css',
  '/pwa/drawer.js'
];

// インストール処理
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function(response) {
        return response ? response : fetch(event.request);
      })
  );
});