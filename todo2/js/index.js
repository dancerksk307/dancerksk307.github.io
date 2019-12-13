window.onload = function() {

var app = new Vue({
  el: '#app',
  data: {
    notes:[
      "期限の設定を選択可能",
      "期限の設定を選択可能",
      "期限の設定を選択可能",
      "期限の設定を選択可能",
      "",
      "",
      "",
    ],
    todoList:[
      {
        index    : 0,
        label    : "Todo 1",//タスク名
        complete : false, //完了判定
        select   : false, //削除フラグ
        limit    : "2019-12-10", //完了期限
      },
      {
        index    : 1,
        label    : "Todo 2",//タスク名
        complete : true, //完了判定
        select   : false, //削除フラグ
        limit    : "2019-12-13", //完了期限
      },
      {
        index    : 2,
        label    : "Todo 3",//タスク名
        complete : false, //完了判定
        select   : false, //削除フラグ
        limit    : "2019-12-14", //完了期限
      },
      {
        index    : 3,
        label    : "Todo 4",//タスク名
        complete : false, //完了判定
        select   : false, //削除フラグ
        limit    : "2019-12-20", //完了期限
      },
    ],
    count:{
      all:10,
      comp:7,
      noComp:3,
    },
    newItem:{
      label:"",
      limit:new XDate().toString("yyyy-MM-dd"),
      limitFlg:false,
    },
    today:new XDate().toString("yyyy-MM-dd"),
    noteShow:false,
  },

  computed: {
    //完了したTODOの数
    complateNum:function(){
      var num = 0;
      this.todoList.forEach(function(obj){
        //complete が trueだったら加算
        if(obj.complete) num++;
      });
      return num;
    },
    //達成度の算出（％）
    levelOfAchievement:function(){
      return this.complateNum / this.todoList.length;
    },
    isSelectTodo:function(){
      return this.todoList.some(function(obj){
        return obj.select;
      });
    },
  },
  methods: {
    /**
     * [addNewItem 新規にTODOを追加]
     */
    addNewItem:function(){
      console.log('addNewItem');
      // if(this.newItem.label === ""){
      //   console.log('ラベルが空');
      //   return false; //ここで処理が強制終了される
      // }
      var newItem = Vue.util.extend({},
        {
          index:this.todoList.length,
          label:this.newItem.label ? this.newItem.label : "Todo"+this.todoList.length,
          limit:this.newItem.limitFlg ? this.newItem.limit : null,
          select:false,
          complete : false,
        }
      );
      this.todoList.push(newItem);
    },
    /**
     * [removeTodoItem チェックしたTODOリストのアイテムを削除]
     */
    removeTodoItem:function(){
      // this.todoList.forEach(function( obj,idx ) {
      //   if(obj.select) app.todoList.splice(idx,1);
      //   console.log(obj.title);
      // });
      this.todoList = this.todoList.filter(function( obj ) {
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
    console.log('mounted')
  }
});


//HTMLにデータを表示
  //-> 下から出てくる
  //-> タスク数
//v-forとか使う
//-----------------
//カレンダーの入力の仕方
//新規作成
  //-> 押したときのファンクション
  //-> 下から出てくる
//新規作成のダイアログ
// テキスト入力欄
// 保存・キャンセル
// カレンダー
// TODO
  //->
  //超過時のスタイル・炎アイコン
  //完了/未完了でアイコン変更
  //完了になったら薄くする
  // 削除ボタン・機能
  // 削除確認ダイアログ
  // 残日数表示
  // 超過日数表示
// 完了全て削除


};//onload
