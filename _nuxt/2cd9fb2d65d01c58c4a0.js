(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{428:function(e,t,n){var content=n(486);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(12).default)("089fedee",content,!0,{sourceMap:!1})},485:function(e,t,n){"use strict";var r=n(428);n.n(r).a},486:function(e,t,n){(t=n(11)(!1)).push([e.i,".v-card{height:20vh}.v-card+.v-card{margin-top:8px}",""]),e.exports=t},516:function(e,t,n){"use strict";n.r(t);var r=n(0),o=n(420),l=n.n(o);r.a.use(l.a);var c={data:function(){return{swipe:{dialog:!1,event:"",longFlg:!1}}},computed:{},mounted:function(){},methods:{swipeHandler:function(e,t){this.swipe.event=e,console.log("swipe",e,t)},longtapHandler:function(e){console.log("longtap",e),this.swipe.longFlg=!this.swipe.longFlg}}},d=(n(485),n(48)),v=n(70),w=n.n(v),h=n(476),f=n(96),component=Object(d.a)(c,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-sheet",{staticClass:"pa-2"},[n("v-card",{directives:[{name:"touch",rawName:"v-touch:swipe",value:e.swipeHandler,expression:"swipeHandler",arg:"swipe"}],staticClass:"pa-2"},[e._v("Swipe Here!"),n("br"),e._v(e._s(e.swipe.event))]),n("v-card",{directives:[{name:"touch",rawName:"v-touch:swipe.right",value:e.swipeHandler,expression:"swipeHandler",arg:"swipe",modifiers:{right:!0}}],staticClass:"pa-2"},[e._v("Swipe Right Only"),n("br"),e._v(e._s(e.swipe.event))]),n("v-card",{directives:[{name:"touch",rawName:"v-touch:longtap",value:e.longtapHandler,expression:"longtapHandler",arg:"longtap"}],staticClass:"pa-2",style:"background:"+(e.swipe.longFlg?"#dd3":"#3dd")+";"},[e._v("Long Tap Here"),n("br"),e._v("長押しで背景色変更")])],1)}),[],!1,null,null,null);t.default=component.exports;w()(component,{VCard:h.a,VSheet:f.a})}}]);