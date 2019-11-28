//service worker 登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
      './service_worker.js',
      {scope: './pwa4'}
    ).then(function(e) {
        // success
      console.log('[Success]\n Service Worker Registered!!!');
      console.log(e);
    }).catch(function(err) {
        // failed
      console.log('[Error]',err);
    });
}



var app = new Vue({
  el: '#app',
  data: {
    ver:"1.0.7",
    // newTask:"new task",
    // newLimit:"2019/11/27",
  },

  methods: {
  },
  mounted : function(){
    // console.log('mounted')
  }
});
