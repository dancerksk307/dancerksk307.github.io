(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{303:function(t,e,n){"use strict";var o={components:{commonHeader:f},methods:{}},r=n(53),c=n(77),l=n.n(c),d=n(550),h=n(306),component=Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app-bar",{attrs:{fixed:"",dark:"",dense:""}},[n("v-app-bar-nav-icon",{on:{click:function(e){return t.$nuxt.$emit("drawerView")}}})],1)}),[],!1,null,null,null),f=e.a=component.exports;l()(component,{VAppBar:d.a,VAppBarNavIcon:h.a})},306:function(t,e,n){"use strict";n(14),n(11),n(7),n(6),n(10);var o=n(2),r=n(106),c=n(304),l=n(1);function d(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function h(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.a=l.a.extend({name:"v-app-bar-nav-icon",functional:!0,render:function(t,e){var n=e.slots,o=e.listeners,l=e.props,data=e.data,d=Object.assign(data,{staticClass:"v-app-bar__nav-icon ".concat(data.staticClass||"").trim(),props:h({},l,{icon:!0}),on:o}),f=n().default;return t(c.a,d,f||[t(r.a,"$menu")])}})},544:function(t,e,n){"use strict";n.r(e);var o=n(303),r=n(73),c={components:{commonHeader:o.a},data:function(){return{loading:!1,pwShow:!1,isLogin:!1,user:{id:"banba@f-logic.jp",pw:"Dancerksk307"},activeUserId:""}},computed:{db:function(){return r.a.firestore()}},mounted:function(){this.checkLoginUser()},methods:{login:function(){console.log("auth!!"),this.loading=!0,r.a.auth().signInWithEmailAndPassword(this.user.id,this.user.pw).then(function(t){console.log("login:success",t),this.isLogin=!0}.bind(this)).catch(function(t){console.log("error",t)}.bind(this)).then(function(){this.loading=!1}.bind(this))},logout:function(){this.loading=!0,r.a.auth().signOut().then(function(){console.log("logout:success"),this.isLogin=!1,this.activeUserId=""}.bind(this)).catch((function(t){console.log("error",t)})).then(function(){this.loading=!1}.bind(this))},regist:function(){console.log("regist"),this.loading=!0,r.a.auth().createUserWithEmailAndPassword(this.user.id,this.user.pw).then(function(data){console.log("create user:success",data),console.log(data.user.email),this.setUser(data.user.email)}.bind(this)).catch((function(t){console.log("error",t)})).then(function(){this.loading=!1}.bind(this))},setUser:function(t){console.log("setUser"),this.loading=!0,this.db.collection("users").doc(t).set({dateCreate:r.a.firestore.Timestamp.now(),dateLatest:r.a.firestore.Timestamp.now()}).then((function(t){console.log("Document written with ID: ",t)})).catch((function(t){console.error("Error adding document: ",t)})).then(function(){this.loading=!1}.bind(this))},checkLoginUser:function(){console.log("checkLoginUser"),this.loading=!0,r.a.auth().onAuthStateChanged(function(t){t?(console.log("signin",t.email,t),this.isLogin=!0,this.activeUserId=t.email):console.log("no signin"),this.loading=!1}.bind(this))},update:function(){console.log("update"),this.db.collection("users").doc(this.user.id).update({dateLatest:r.a.firestore.Timestamp.now()}).then((function(t){console.log("update:success ",t)})).catch((function(t){console.error("Error update : ",t)})).then(function(){this.loading=!1}.bind(this))},get:function(){this.db.collection("users").doc(this.user.id).get().then((function(t){console.log("getUser: ",t.id);var e=t.data().dateLatest;console.log(e.toDate())}))},set:function(){this.db.collection("users").doc("one").set({first:"aaaa",middle:"Mathison",last:"Turing",born:1912}).then((function(t){console.log("Document written with ID: ",t)})).catch((function(t){console.error("Error adding document: ",t)}))}}},l=n(53),d=n(77),h=n.n(d),f=n(304),v=n(117),m=n(120),w=n(455),_=n(551),component=Object(l.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"pa-1"},[n("commonHeader"),n("v-overlay",{model:{value:t.loading,callback:function(e){t.loading=e},expression:"loading"}},[n("v-progress-circular",{attrs:{size:50,indeterminate:""}})],1),n("p",[n("v-btn",{attrs:{href:"https://qiita.com/_takeshi_24/items/3ee051e1db1b3e8da106#firebase%E3%81%AE%E8%A8%AD%E5%AE%9A",color:"primary",target:"_blank"}},[n("v-icon",{attrs:{left:""}},[t._v("mdi-link-variant")]),n("span",[t._v("参考サイト")])],1)],1),n("p",[t._v("参考サイトの「Firebaseの設定」～「Hosting」までを参考にFirebaseを設定する。")]),n("p",[t._v("参考サイトの「NuxtとFirebaseを連携」を参考に .env、firebase.js、auth.js ファイルを作成する。")]),n("p",[n("v-text-field",{attrs:{label:"ID",clearable:""},model:{value:t.user.id,callback:function(e){t.$set(t.user,"id",e)},expression:"user.id"}}),n("v-text-field",{attrs:{label:"Password",clearable:"","append-icon":t.pwShow?"mdi-eye":"mdi-eye-off",type:t.pwShow?"text":"password"},on:{"click:append":function(e){t.pwShow=!t.pwShow}},model:{value:t.user.pw,callback:function(e){t.$set(t.user,"pw",e)},expression:"user.pw"}})],1),n("p",[t._v(t._s(t.isLogin?"ログイン中":"未ログイン")+" : "+t._s(t.activeUserId))]),n("p",[n("v-btn",{on:{click:function(e){return t.login()}}},[n("v-icon",{attrs:{left:""}},[t._v("mdi-login")]),n("span",[t._v("ログイン")])],1),n("v-btn",{on:{click:function(e){return t.checkLoginUser()}}},[n("v-icon",{attrs:{left:""}},[t._v("mdi-login")]),n("span",[t._v("ログインチェック")])],1),n("v-btn",{on:{click:function(e){return t.logout()}}},[n("v-icon",{attrs:{left:""}},[t._v("mdi-logout")]),n("span",[t._v("ログアウト")])],1),n("v-btn",{on:{click:function(e){return t.regist()}}},[n("v-icon",{attrs:{left:""}},[t._v("mdi-account-plus")]),n("span",[t._v("新規登録")])],1)],1),n("p",[n("v-btn",{attrs:{href:"https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ja",color:"primary",target:"_blank"}},[n("span",[t._v("【公式】Firestoreデータ追加方法")])])],1),n("p",[n("v-btn",{attrs:{href:"https://firebase.google.com/docs/firestore/security/rules-conditions?hl=ja",color:"primary",target:"_blank"}},[n("span",[t._v("【公式】Cloud Firestore ルール記述")])])],1),n("p",[n("v-btn",{attrs:{href:"https://qiita.com/wancoro/items/1e4ad4f08719989afea0",color:"primary",target:"_blank"}},[n("span",[t._v("Cloud Firestore ルールの書き方参考")])])],1),n("p",[n("v-btn",{on:{click:function(e){return t.get()}}},[t._v("読込")]),n("v-btn",{on:{click:function(e){return t.update()}}},[t._v("更新")])],1),n("p",[n("v-btn",{attrs:{href:"https://www.topgate.co.jp/firebase04-firebase-hosting-deploy-website",color:"primary",target:"_blank"}},[n("span",[t._v("Firestore ホスティング")])])],1)],1)}),[],!1,null,null,null);e.default=component.exports;h()(component,{VBtn:f.a,VIcon:v.a,VOverlay:m.a,VProgressCircular:w.a,VTextField:_.a})}}]);