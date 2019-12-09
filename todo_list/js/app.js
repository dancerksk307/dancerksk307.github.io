// "use strict";

//service worker 登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
      './service_worker.js',
      {scope: './todo_list'}
    ).then(function(e) {
        // success
      console.log('[Service Worker:Regist]',e);
    }).catch(function(err) {
        // failed
      console.log('[Service Worker:Error]',err);
    });
}

localforage.config({
  name: 'ore_no_todo_db',
  storeName: 'todo_json',
});

var app = new Vue({
  el: '#app',
  data: {
    ver:"1.0.0",
    newItem : {
      label:"",
      // limit:"2019/11/27",
    },
    todo:{
      selectedTab:0,
      tabs :{
        "やること":{
          id:0,
        },
        "買うもの":{
          id:1,
        },
      },
      items:[
        {
          seq    : 0,
          tab_id : 0,
          label  :"年賀状を出す",
          complate :false,
        },
        {
          seq    : 1,
          tab_id : 0,
          label  :"美容院連絡",
          complate :false,
        },
        {
          seq    : 2,
          tab_id : 1,
          label  :"サプリ",
          complate :false,
        },
      ],
    },
  },
  watch: {
    todo: {
      handler: function(value){
        console.log(value);
        this.saveJson();
      },
      deep: true,
    },
  },
  methods: {
    saveJson:function(){
      localforage.setItem('todo', this.todo)
        .then(function(){
          console.log("Save Success");
        })
        .catch(function(err){
          console.log("Save Faild",err);
        });
    },
    deleteJson:function(){
      // localStorage.removeItem('testText');
      localStorage.clear();
    },
    addNewItem:function(){
      console.log("addNewItem");
      if(!this.newItem.label) return;
      var items = this.todo.items;
      items.push(
        {
          seq      : items.length,
          tab_id   : this.todo.selectedTab,
          label    : this.newItem.label,
          complate : false,
        }
      );
    },
  },
  mounted : function(){
    console.log('mounted');

    localforage.getItem('todo')
      .then(function(value){
        if(!value){
          console.log('No Data',value);
        }else{
          console.log('Data Load Success',value);
          app.todo = value;
        }
      })
      .catch(function(err){
        console.log('Data Load Faild',err);
      });
  }//mounted
});
