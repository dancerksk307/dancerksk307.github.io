(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{303:function(t,e,n){"use strict";var r={components:{commonHeader:v},methods:{}},o=n(53),c=n(77),l=n.n(c),d=n(543),f=n(306),component=Object(o.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app-bar",{attrs:{absolute:"",dark:"",dense:""}},[n("v-app-bar-nav-icon",{on:{click:function(e){return t.$nuxt.$emit("drawerView")}}})],1)}),[],!1,null,null,null),v=e.a=component.exports;l()(component,{VAppBar:d.a,VAppBarNavIcon:f.a})},306:function(t,e,n){"use strict";n(14),n(11),n(7),n(6),n(10);var r=n(2),o=n(106),c=n(304),l=n(1);function d(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function f(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(e){Object(r.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.a=l.a.extend({name:"v-app-bar-nav-icon",functional:!0,render:function(t,e){var n=e.slots,r=e.listeners,l=e.props,data=e.data,d=Object.assign(data,{staticClass:"v-app-bar__nav-icon ".concat(data.staticClass||"").trim(),props:f({},l,{icon:!0}),on:r}),v=n().default;return t(c.a,d,v||[t(o.a,"$menu")])}})},439:function(t,e,n){var content=n(471);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(13).default)("603134cb",content,!0,{sourceMap:!1})},470:function(t,e,n){"use strict";var r=n(439);n.n(r).a},471:function(t,e,n){(e=n(12)(!1)).push([t.i,".list-group-item{border:1px solid #ddd}.ghost{opacity:.5;background:#c8ebfb}pre{font-size:10px;background-color:#e8fa94}",""]),t.exports=e},537:function(t,e,n){"use strict";n.r(e);var r=n(303),o=n(455),c=n.n(o),l={components:{commonHeader:r.a,draggable:c.a},data:function(){return{list:[{name:"list-0",id:0},{name:"list-1",id:1},{name:"list-2",id:2}],dragging:!1}},methods:{add:function(){this.list.push({name:"list-"+this.list.length,id:this.list.length})}}},d=(n(470),n(53)),f=n(77),v=n.n(f),m=n(304),h=n(117),O=n(72),component=Object(d.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"pa-2"},[n("commonHeader"),n("p",[n("v-btn",{attrs:{href:"https://sortablejs.github.io/Vue.Draggable/#/simple",color:"primary",target:"_blank"}},[n("v-icon",{attrs:{left:""}},[t._v("mdi-link-variant")]),n("span",[t._v("npm vue-draggable")])],1)],1),n("p",[n("v-btn",{attrs:{color:"primary"},on:{click:t.add}},[n("v-icon",{attrs:{left:""}},[t._v("mdi-plus")]),n("span",[t._v("ADD")])],1)],1),n("div",[n("draggable",{staticClass:"list-group",attrs:{tag:"v-list",list:t.list,"ghost-class":"ghost"},on:{start:function(e){t.dragging=!0},end:function(e){t.dragging=!1}}},t._l(t.list,(function(e,r){return n("v-list-item",{key:r,staticClass:"list-group-item"},[t._v("["+t._s(e.id)+"] - "+t._s(e.name))])})),1)],1),n("pre",[t._v(t._s(t.list))])],1)}),[],!1,null,null,null);e.default=component.exports;v()(component,{VBtn:m.a,VIcon:h.a,VListItem:O.a})}}]);