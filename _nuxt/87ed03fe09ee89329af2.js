(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{303:function(n,o,t){"use strict";var c={components:{commonHeader:d},methods:{}},e=t(53),r=t(77),l=t.n(r),f=t(550),m=t(306),component=Object(e.a)(c,(function(){var n=this,o=n.$createElement,t=n._self._c||o;return t("v-app-bar",{attrs:{absolute:"",dark:"",dense:""}},[t("v-app-bar-nav-icon",{on:{click:function(o){return n.$nuxt.$emit("drawerView")}}})],1)}),[],!1,null,null,null),d=o.a=component.exports;l()(component,{VAppBar:f.a,VAppBarNavIcon:m.a})},450:function(n,o,t){var content=t(522);"string"==typeof content&&(content=[[n.i,content,""]]),content.locals&&(n.exports=content.locals);(0,t(13).default)("6b99c3ce",content,!0,{sourceMap:!1})},521:function(n,o,t){"use strict";var c=t(450);t.n(c).a},522:function(n,o,t){(o=t(12)(!1)).push([n.i,"pre{font-size:10px;background-color:#e8fa94}",""]),n.exports=o},549:function(n,o,t){"use strict";t.r(o);var c=t(303),e=t(1),r=t(518),l=t.n(r);t(519);e.a.use(l.a);var f={components:{commonHeader:c.a},data:function(){return{}},methods:{confirmA:function(){this.$dialog.confirm({title:"confirmAのタイトル",body:"confirmAの本文。"},{okText:"OK",cancelText:"キャンセル",html:!1,loader:!1,reverse:!1,animation:"fade",type:"basic",verification:"continue",verificationHelp:'Type "[+:verification]" below to confirm',clicksCount:3,backdropClose:!1,customClass:""}).then((function(){console.log("confirmA OK")})).catch((function(){console.log("confirmA Cancel")}))},confirmB:function(){this.$dialog.confirm({title:"confirmBのタイトル",body:"confirmBの本文。<br>htmlタグを含んだ本文。<br>OKをクリックするとネストされたダイアログを開きます。"},{okText:"OK",cancelText:"キャンセル",html:!0,reverse:!0,animation:"bounce",backdropClose:!0}).then(function(){console.log("confirmB OK confirmNest を開きます"),this.confirmNest()}.bind(this)).catch((function(){console.log("confirmB Cancel")}))},confirmNest:function(){this.$dialog.confirm({title:"ネストしたダイアログ",body:"ネストしたダイアログの本文。"},{okText:"yes",cancelText:"cancel"}).then((function(){console.log("confirmNest OK")})).catch((function(){console.log("confirmNest Cancel")}))}}},m=(t(521),t(53)),d=t(77),v=t.n(d),h=t(304),k=t(117),component=Object(m.a)(f,(function(){var n=this,o=n.$createElement,t=n._self._c||o;return t("div",{staticClass:"pa-2"},[t("commonHeader"),t("p",[t("v-btn",{attrs:{color:"primary"},on:{click:function(o){return n.confirmA()}}},[t("v-icon",{attrs:{left:""}},[n._v("mdi-help")]),t("span",[n._v("confirm A")])],1)],1),t("v-btn",{attrs:{color:"primary"},on:{click:function(o){return n.confirmB()}}},[t("v-icon",{attrs:{left:""}},[n._v("mdi-help")]),t("span",[n._v("confirm B")])],1)],1)}),[],!1,null,null,null);o.default=component.exports;v()(component,{VBtn:h.a,VIcon:k.a})}}]);