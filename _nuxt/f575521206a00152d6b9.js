(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{282:function(e,t,o){"use strict";var n={components:{commonHeader:d},methods:{}},c=o(47),l=o(70),r=o.n(l),f=o(510),m=o(285),component=Object(c.a)(n,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("v-app-bar",{attrs:{fixed:"",dark:"",dense:""}},[o("v-app-bar-nav-icon",{on:{click:function(t){return e.$nuxt.$emit("drawerShow",!0)}}})],1)}),[],!1,null,null,null),d=t.a=component.exports;r()(component,{VAppBar:f.a,VAppBarNavIcon:m.a})},285:function(e,t,o){"use strict";o(12),o(9),o(5),o(4),o(8);var n=o(1),c=o(96),l=o(283),r=o(0);function f(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(object);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,o)}return t}function m(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}t.a=r.a.extend({name:"v-app-bar-nav-icon",functional:!0,render:function(e,t){var o=t.slots,n=t.listeners,r=t.props,data=t.data,f=Object.assign(data,{staticClass:"v-app-bar__nav-icon ".concat(data.staticClass||"").trim(),props:m({},r,{icon:!0}),on:n}),d=o().default;return e(l.a,f,d||[e(c.a,"$menu")])}})},507:function(e,t,o){"use strict";o.r(t);var n=o(282),c=o(429),l={components:{commonHeader:n.a},data:function(){return{localforageSampleText:""}},mounted:function(){this.loadLF()},methods:{loadLF:function(){var e=this;c.getItem("localforageSampleText").then((function(t){t?(console.log("Data Load Success",t),e.localforageSampleText=t,console.log(app.localforageSampleText)):console.log("No Data",t)})).catch((function(e){console.log("Data Load Faild",e)}))},saveLF:function(){c.setItem("localforageSampleText",this.localforageSampleText).then((function(){c.getItem("localforageSampleText"),console.log("Save Success")})).then((function(e){})).catch((function(e){console.log("Save Faild",e)}))},deleteLF:function(){localStorage.removeItem("localforageSampleText"),c.clear(),console.log("data clear")}}},r=o(47),f=o(70),m=o.n(f),d=o(283),v=o(511),component=Object(r.a)(l,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"pa-2"},[o("commonHeader"),o("v-text-field",{attrs:{label:"localforageSampleText"},model:{value:e.localforageSampleText,callback:function(t){e.localforageSampleText=t},expression:"localforageSampleText"}}),o("v-btn",{on:{click:e.loadLF}},[e._v("load")]),o("v-btn",{on:{click:e.saveLF}},[e._v("Save")]),o("v-btn",{on:{click:e.deleteLF}},[e._v("Delete")])],1)}),[],!1,null,null,null);t.default=component.exports;m()(component,{VBtn:d.a,VTextField:v.a})}}]);