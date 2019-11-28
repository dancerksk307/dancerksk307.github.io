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
    selected:"0",
    // newTask:"new task",
    // newLimit:"2019/11/27",
  },

  methods: {
    saveJson:function(){
      localStorage.setItem('testText', this.testText);
      localStorage.setItem('selected', this.selected);
    },
    deleteJson:function(){
      // localStorage.removeItem('testText');
      localStorage.clear();
    },
  },
  mounted : function(){
    console.log('mounted')
    this.testText = localStorage.getItem('testText');
    this.selected = localStorage.getItem('selected');
  }
});
