// "use strict";

//service worker 登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
      '../service_worker.js',
      {scope: './otd'}
    ).then(function(e) {
        // success
      console.log('[Service Worker:Regist]',e);
    }).catch(function(err) {
        // failed
      console.log('[Service Worker:Error]',err);
    });
}

//localStrage
localforage.config({
  name: 'ore_no_todo_db',
  storeName: 'todo_json',
});

var app = new Vue({
  el: '#app',
  data: {
    ver:"1.0.0",
    // newTab : {
    //   dialog : false,
    //   label:"",
    // },
    newItem:{
      label:"",
      limit:new XDate().toString("yyyy-MM-dd"),
      limitFlg:false,
    },
    today:new XDate().toString("yyyy-MM-dd"),

    editOrder: false,
    listDrag : false,
    todo:{
      selectedTab:0,
      tabs :[
        // {
        //   id:0,
        //   label:"やること",
        // },
      ],
      items:[
        // {
        //   index    : 0,
        //   tab_id   : 0,
        //   label    : "Todo 1",//タスク名
        //   complete : false, //完了判定
        //   select   : false, //削除フラグ
        //   limit    : "2019-12-10", //完了期限
        // },
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
  computed: {
    //完了したTODOの数
    completeNum:function(){
      var num = 0;
      this.todo.items.forEach(function(obj){
        //complete が trueだったら加算
        if(obj.complete) num++;
      });
      return num;
    },
    //達成度の算出（％）
    levelOfAchievement:function(){
      return this.todo.items.length ? this.completeNum / this.todo.items.length : 0 ;
    },
    //TODOの選択があるかどうか
    isSelectTodo:function(){
      return this.todo.items.some(function(obj){
        return obj.select;
      });
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

    /**
     * [addNewItem 新規にTODOを追加]
     */
    addNewItem:function(){
      console.log("addNewItem");
      // if(!this.newItem.label) return;
      var items = this.todo.items;
      items.push(
        {
          index    : items.length,
          tab_id   : this.todo.selectedTab,
          // label    : this.newItem.label ? this.newItem.label : this.todo.tabs[this.todo.selectedTab].label + " - " + this.todo.items.length,
          label    : this.newItem.label ? this.newItem.label : "ToDo - " + this.todo.items.length,
          limit    : this.newItem.limitFlg ? this.newItem.limit : null,
          complete : false,
          select   : false,
        }
      );

    },//addNewItem

    /**
     * [addNewTab 新規にタブを追加]
     */
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
      // this.todo.items = this.todo.items.sort((a, b) => a.seq - b.seq);
      this.list = this.list.sort((a, b) => a.order - b.order);
    },//sort

    /**
     * [removeTodoItem チェックしたTODOリストのアイテムを削除]
     */
    removeTodoItem:function(){
      this.todo.items = this.todo.items.filter(function( obj ) {
        return !obj.select;
      });
    },

    /**
     * [convertDate カレンダーの日付をXDate形式に変換]
     * @param  {[string]} date ["yyyy-MM-dd"]
     * @return {[date]}        [XDate]
     */
    convertDate:function(date){
      var d_ary = date.split( '-' );
      // console.log(d_ary1,d_ary2);
      return new XDate(d_ary[0], Number(d_ary[1]) - 1, d_ary[2]);
    },
    /**
     * [remainingDate 期限までの残りに数を算出]
     * @param  {[string]} date [期限]
     * @return {[number]}      [残日数]
     */
    remainingDate:function(date){
      var dif = this.convertDate(this.today).diffDays( this.convertDate(date) );
      // console.log(dif);
      return dif;
    },




  },
  mounted : function(){
    console.log('mounted');

    localforage.getItem('todo')
      .then(function(value){
        if(!value){
          console.log('No Data',value);
          app.$set(app.todo, 'items', []); //TODO追加時にリアクティブになるよう初期値をset
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
