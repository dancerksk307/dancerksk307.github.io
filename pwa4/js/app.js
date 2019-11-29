"use strict";

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

localforage.config({
  name: 'qiitadb',
  storeName: 'postJson',
});


var app = new Vue({
  el: '#app',
  data: {
    ver:"1.1.2",
    testText:"",
    selected:"0",
    testJson:null,
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
    getPost:function(){
      // fetch('https://qiita.com/api/v2/items').then(response => {
      //   return response.json();
      // }).then(res => {

      //   console.log(res);
      //   // const title = res[0].title;
      //   // const url = res[0].url;
      //   // const data = `<a href="${url}">${title}</a>`;
      //   // document.getElementById("newitem").innerHTML = data;

      // }).catch(function (error) {
      //   console.log(error);
      // });

      // var params = new URLSearchParams();
      // params.append('data', JSON.stringify(sendData));
      axios.get(
        'https://qiita.com/api/v2/items',
        // params,
        {timeout  : 15000,}
      )
      .then(function (response) {
        console.log("Success",response.data);
        app.testJson = response.data;
        localforage.setItem('qiita', response.data);
      })
      .catch(function (error) {
        console.log("Error",error);
      });

    }//getPost
  },
  mounted : function(){
    console.log('mounted')
    this.testText = localStorage.getItem('testText');
    this.selected = localStorage.getItem('selected');

    this.getPost();

    //カメラアクセス
    var player = document.getElementById('player');
    var handleSuccess = function(stream) {
      player.srcObject = stream;
    };
    navigator.mediaDevices.getUserMedia({video: true}).then(handleSuccess);


  }
});
