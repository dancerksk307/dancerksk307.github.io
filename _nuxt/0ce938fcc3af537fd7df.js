(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{303:function(e,n,t){"use strict";var r={components:{commonHeader:w},methods:{}},o=t(53),l=t(77),c=t.n(l),d=t(543),v=t(306),component=Object(o.a)(r,(function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("v-app-bar",{attrs:{fixed:"",dark:"",dense:""}},[t("v-app-bar-nav-icon",{on:{click:function(n){return e.$nuxt.$emit("drawerShow",!0)}}})],1)}),[],!1,null,null,null),w=n.a=component.exports;c()(component,{VAppBar:d.a,VAppBarNavIcon:v.a})},449:function(e,n,t){var content=t(516);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,t(13).default)("089fedee",content,!0,{sourceMap:!1})},515:function(e,n,t){"use strict";var r=t(449);t.n(r).a},516:function(e,n,t){(n=t(12)(!1)).push([e.i,".v-card{height:20vh}.v-card+.v-card{margin-top:8px}",""]),e.exports=n},542:function(e,n,t){"use strict";t.r(n);var r=t(303),o=t(1),l=t(446),c=t.n(l);o.a.use(c.a);var d={components:{commonHeader:r.a},data:function(){return{swipe:{dialog:!1,event:"",longFlg:!1}}},computed:{},mounted:function(){},methods:{swipeHandler:function(e,n){this.swipe.event=e,console.log("swipe",e,n)},longtapHandler:function(e){console.log("longtap",e),this.swipe.longFlg=!this.swipe.longFlg}}},v=(t(515),t(53)),w=t(77),h=t.n(w),m=t(530),f=t(107),component=Object(v.a)(d,(function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("v-sheet",{staticClass:"pa-2"},[t("commonHeader"),t("v-card",{directives:[{name:"touch",rawName:"v-touch:swipe",value:e.swipeHandler,expression:"swipeHandler",arg:"swipe"}],staticClass:"pa-2"},[e._v("Swipe Here!"),t("br"),e._v(e._s(e.swipe.event))]),t("v-card",{directives:[{name:"touch",rawName:"v-touch:swipe.right",value:e.swipeHandler,expression:"swipeHandler",arg:"swipe",modifiers:{right:!0}}],staticClass:"pa-2"},[e._v("Swipe Right Only"),t("br"),e._v(e._s(e.swipe.event))]),t("v-card",{directives:[{name:"touch",rawName:"v-touch:longtap",value:e.longtapHandler,expression:"longtapHandler",arg:"longtap"}],staticClass:"pa-2",style:"background:"+(e.swipe.longFlg?"#dd3":"#3dd")+";"},[e._v("Long Tap Here"),t("br"),e._v("長押しで背景色変更")])],1)}),[],!1,null,null,null);n.default=component.exports;h()(component,{VCard:m.a,VSheet:f.a})}}]);