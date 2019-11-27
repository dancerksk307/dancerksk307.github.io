//service worker 登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service_worker.js', {
        // scope: '/'
    }).then(function() {
        // success
      console.log('[Success]\n Service Worker Registered!!!');
    }).catch(function(err) {
        // failed
      console.log('[Error]',err);
    });
}

