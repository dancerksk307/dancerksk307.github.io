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



var app = new Vue({
  el: '#app',
  data: {
    ver:"1.0.1",
    // newTask:"new task",
    // newLimit:"2019/11/27",
  },

  methods: {
  },
  mounted : function(){
    // console.log('mounted')
  }
});
