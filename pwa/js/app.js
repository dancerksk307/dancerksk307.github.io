//service worker 登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./js/service_worker.js', {
        // scope: '/'
    }).then(function(e) {
        // success
      console.log('[Success] Service Worker Registered');
    }).catch(function(err) {
        // failed
      console.log('[Error]',err);
    });
}


var vue_app = new Vue({
  el: "#app",
  data: function () {
    return {
      todoList: [],
      addName:"",
    }; //return
  },
  computed: {
  },
  watch: {
  },
  methods: {
    //TODO 1件削除
    deleteItem: function (index) {
      this.todoList.splice(index, 1);
    },

    //完了分をリストの下に移動
    changeStatus: function (index) {
      if ((this.todoList[index].complete) === false){
        this.todoList[index].complete = !this.todoList[index].complete;
        this.todoList.push(this.todoList[index]);
        this.todoList.splice(index, 1);
      } else {
        this.todoList[index].complete = !this.todoList[index].complete;
      }
    },

    //TODOをひとつ上に移動
    upList: function (index) {
      if (index !== 0){
        this.todoList.splice(index-1, 0, this.todoList[index] );
        this.todoList.splice(index+1, 1);
      }
    },

    //TODOをひとつ下に移動
    downList: function (index) {
      if (index !== (this.todoList.length-1)){
        this.todoList.splice(index+2, 0, this.todoList[index] );
        this.todoList.splice(index, 1);
      }
    },

    //完了分を削除
    deleteCompItem: function() {

      // window.confirm( 'この内容で宜しいですか？');

      this.todoList.forEach (function( obj,idx,array ) {
        if(obj.complete === true){
          array.splice(idx, 1);
        }
      });
    },

    //TODOを追加
    addItem: function (type) {
      var obj = {
        index    : this.todoList.length,
        title    : this.addName ? this.addName : "Todo " + this.todoList.length,
        complete : false,
      };

      // 0：前に追加 1：後ろに追加
      if(type === 0){
        this.todoList.unshift (obj);
      }else if(type === 1){
        this.todoList.push (obj);
      }
    },

    //TODO一覧を保存
    saveData: function () {
      var postData = new URLSearchParams();
      postData.append('todo_list', JSON.stringify(this.todoList, null, 2));

      axios.post('./api/save_json.php',postData)
        .then(function (response) {//通信処理成功時に実行
          console.log(response.data);
        })
        .catch(function (error) {//通信処理失敗時に実行
          console.log(error);
        })
        .then(function () {//通信処理の成否に関係なく実行
          // vue_container.loading = false;
        });
    },

  },
  created: function() {
  },//created
  mounted: function() {
    console.log('mounted')
    var _this = this;
      axios.get('./api/todo_list.json')
    .then(function (response) {//通信処理成功時に実行
      console.log(response.data);
      _this.todoList = response.data;
    })
    .catch(function (error) {//通信処理失敗時に実行
      console.log(error);
    })
    .then(function () {//通信処理の成否に関係なく実行
      // vue_container.loading = false;
    });
  }//mounted

});//vue
