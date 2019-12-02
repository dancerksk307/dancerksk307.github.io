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
    log:"",
    testText:"",
    selected:"0",
    testJson:null,
    latitude :20.00000,
    longitude:50.00000,
    deviceOrientation:{
      absolute : true,
      alpha    : 10,
      beta     : 10,
      gamma    : 10,
    }
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
    getGps:function(){
      //GPS位置情報
      navigator.geolocation.getCurrentPosition(
        function(position) {//success
          console.log(
            position.coords.latitude,
            position.coords.longitude
          );
          app.latitude  = position.coords.latitude;
          app.longitude = position.coords.longitude;
        },
        function(error) {//error
          console.log(error);
          // error.code can be:
          //   0: unknown error
          //   1: permission denied
          //   2: position unavailable (error response from location provider)
          //   3: timed out
        },
        {//options
          timeout: 10 * 1000,
          enableHighAccuracy: true //高精度GPS
        }
      );
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
        // 'https://qiita.com/api/v2/items',
        'https://map.yahooapis.jp/weather/V1/place?coordinates=139.732293,35.663613&appid=dj00aiZpPW1MMVExQklNTTEzSSZzPWNvbnN1bWVyc2VjcmV0Jng9ZDk-&output=json',
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

    },//getPost
    deviceOrientationHandler:function(orientation){
      console.log(orientation);
      this.deviceOrientation.absolute = orientation.absolute;
      this.deviceOrientation.alpha    = orientation.alpha;
      this.deviceOrientation.beta     = orientation.beta;
      this.deviceOrientation.gamma    = orientation.gamma;
    },//deviceOrientationHandler
    deviceMotionHandler:function(orientation){
      alert("もーしょん")
    },//deviceMotionHandler
  },
  mounted : function(){
    console.log('mounted')
    this.testText = localStorage.getItem('testText');
    this.selected = localStorage.getItem('selected');

    // this.getPost();

    //カメラアクセス
    // var player = document.getElementById('player');
    // var handleSuccess = function(stream) {
    //   player.srcObject = stream;
    // };
    // navigator.mediaDevices.getUserMedia({video: true}).then(handleSuccess);

    //端末画面の向き
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this.deviceOrientationHandler, false);
      this.log += "DeviceOrientationEvent Supported\n";
    }

    //端末画面のモーションイベント
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.deviceMotionHandler);
      // setTimeout(stopJump, 3*1000);
      this.log += "deviceMotionHandler Supported\n";
    }
  }
});
