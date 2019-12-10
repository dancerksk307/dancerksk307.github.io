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
    isReady :false,
    newItem : {
      label:"",
      // limit:"2019/11/27",
    },
    newTab : {
      dialog : false,
      label:"",
    },
    todo:{
      selectedTab:0,
      tabs :[
        {
          id:0,
          label:"やること",
        },
        {
          label:"買うもの",
          id:1,
        },
      ],
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
      localforage.clear();
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
    },//addNewItem

    addNewTab:function(){
      console.log("addNewTab");
      if(!this.newTab.label) return;
      var tabs = this.todo.tabs;
      var addObj = {
        label :this.newTab.label,
      };
      this.$set(tabs, tabs.length, addObj);
    },//addNewTab

    removeTab:function(key){
      console.log("removeTab",key);
      console.log(this.todo.tabs[key]);
      this.$delete(this.todo.tabs, key);
    },//removeTab
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
