//service worker 登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
      './service_worker.js',
      {scope: './pwa4'}
    ).then(function(e) {
        // success
      console.log('[Service Worker:Regist]',e);
    }).catch(function(err) {
        // failed
      console.log('[Service Worker:Error]',err);
    });
}



var app = new Vue({
  el: '#app',
  data: {
    ver:"1.1.0",
    testText:"",
    // newTask:"new task",
    // newLimit:"2019/11/27",
  },

  methods: {
    saveJson:function(){
      localStorage.setItem('save_text', this.testText);
    },
    deleteJson:function(){
      // localStorage.removeItem('save_text');
      localStorage.clear();
    },
  },
  mounted : function(){
    console.log('mounted')
    this.testText = localStorage.getItem('save_text');
  }
});
