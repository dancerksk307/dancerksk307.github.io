(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{282:function(t,n,e){"use strict";var r={components:{commonHeader:v},methods:{}},o=e(47),c=e(70),l=e.n(c),d=e(510),f=e(285),component=Object(o.a)(r,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-app-bar",{attrs:{fixed:"",dark:"",dense:""}},[e("v-app-bar-nav-icon",{on:{click:function(n){return t.$nuxt.$emit("drawerShow",!0)}}})],1)}),[],!1,null,null,null),v=n.a=component.exports;l()(component,{VAppBar:d.a,VAppBarNavIcon:f.a})},285:function(t,n,e){"use strict";e(12),e(9),e(5),e(4),e(8);var r=e(1),o=e(96),c=e(283),l=e(0);function d(object,t){var n=Object.keys(object);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(object);t&&(e=e.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),n.push.apply(n,e)}return n}function f(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(n){Object(r.a)(t,n,source[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(source,n))}))}return t}n.a=l.a.extend({name:"v-app-bar-nav-icon",functional:!0,render:function(t,n){var e=n.slots,r=n.listeners,l=n.props,data=n.data,d=Object.assign(data,{staticClass:"v-app-bar__nav-icon ".concat(data.staticClass||"").trim(),props:f({},l,{icon:!0}),on:r}),v=e().default;return t(c.a,d,v||[t(o.a,"$menu")])}})},416:function(t,n,e){var content=e(444);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(11).default)("603134cb",content,!0,{sourceMap:!1})},443:function(t,n,e){"use strict";var r=e(416);e.n(r).a},444:function(t,n,e){(n=e(10)(!1)).push([t.i,".list-group-item{border:1px solid #ddd}.ghost{opacity:.5;background:#c8ebfb}pre{font-size:10px;background-color:#e8fa94}",""]),t.exports=n},505:function(t,n,e){"use strict";e.r(n);var r=e(282),o=e(428),c=e.n(o),l={components:{commonHeader:r.a,draggable:c.a},data:function(){return{list:[{name:"list-0",id:0},{name:"list-1",id:1},{name:"list-2",id:2}],dragging:!1}},methods:{add:function(){this.list.push({name:"list-"+this.list.length,id:this.list.length})}}},d=(e(443),e(47)),f=e(70),v=e.n(f),m=e(283),h=e(107),O=e(66),component=Object(d.a)(l,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"pa-2"},[e("commonHeader"),e("p",[e("v-btn",{attrs:{href:"https://sortablejs.github.io/Vue.Draggable/#/simple",color:"primary",target:"_blank"}},[e("v-icon",{attrs:{left:""}},[t._v("mdi-link-variant")]),e("span",[t._v("npm vue-draggable")])],1)],1),e("p",[e("v-btn",{attrs:{color:"primary"},on:{click:t.add}},[e("v-icon",{attrs:{left:""}},[t._v("mdi-plus")]),e("span",[t._v("ADD")])],1)],1),e("div",[e("draggable",{staticClass:"list-group",attrs:{tag:"v-list",list:t.list,"ghost-class":"ghost"},on:{start:function(n){t.dragging=!0},end:function(n){t.dragging=!1}}},t._l(t.list,(function(n,r){return e("v-list-item",{key:r,staticClass:"list-group-item"},[t._v("["+t._s(n.id)+"] - "+t._s(n.name))])})),1)],1),e("pre",[t._v(t._s(t.list))])],1)}),[],!1,null,null,null);n.default=component.exports;v()(component,{VBtn:m.a,VIcon:h.a,VListItem:O.a})}}]);