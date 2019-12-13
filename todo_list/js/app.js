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
          id:1,
          label:"買うもの",
        },
      ],
      items:[
        {
          seq    : 0,
          tab_id : 0,
          label  :"TODO 1",
          complate :false,
        },
        {
          seq    : 1,
          tab_id : 0,
          label  :"TODO 2",
          complate :false,
        },
        {
          seq    : 2,
          tab_id : 1,
          label  :"サプリ",
          complate :false,
        },
        {
          seq    : 3,
          tab_id : 0,
          label  :"TODO 3",
          complate :false,
        },
        {
          seq    : 4,
          tab_id : 0,
          label  :"TODO 4",
          complate :false,
        },
        {
          seq    : 5,
          tab_id : 0,
          label  :"TODO 5",
          complate :true,
        },
        {
          seq    : 6,
          tab_id : 0,
          label  :"TODO 6",
          complate :false,
        },
      ],
    },
list:[
  {
    "name": "vue.draggable",
    "order": 1
  },
  {
    "name": "draggable",
    "order": 2
  },
  {
    "name": "component",
    "order": 3
  },
  {
    "name": "for",
    "order": 4
  },
  {
    "name": "vue.js 2.0",
    "order": 5
  },
  {
    "name": "based",
    "order": 6
  },
  {
    "name": "on",
    "order": 7
  },
  {
    "name": "Sortablejs",
    "order": 8
  }
],
drag: false,
  },
  watch: {
    todo: {
      handler: function(value){
        console.log(value);
        // this.saveJson();
      },
      deep: true,
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
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
        id    :tabs.length,
      };
      this.$set(tabs, tabs.length, addObj);
    },//addNewTab

    removeTab:function(key){
      console.log("removeTab",key);
      console.log(this.todo.tabs[key]);
      this.$delete(this.todo.tabs, key);
    },//removeTab

    sort:function() {
      this.todo.items = this.todo.items.sort((a, b) => a.seq - b.seq);
    }
  },
  mounted : function(){
    console.log('mounted');

    localforage.getItem('todo')
      .then(function(value){
        if(!value){
          console.log('No Data',value);
        }else{
          console.log('Data Load Success',value);
          // app.todo = value;
          // app.$set(app, 'todo', value);
        }
        // app.isReady = true;
      })
      .catch(function(err){
        console.log('Data Load Faild',err);
      });

  }//mounted
});
