//service worker 登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service_worker.js?111', {
        // scope: '/'
    }).then(function(e) {
        // success
      console.log('[Success]\n Service Worker Registered!!!');
      console.log(e);
    }).catch(function(err) {
        // failed
      console.log('[Error]',err);
    });
}

