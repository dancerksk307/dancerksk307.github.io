(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{282:function(t,e,r){"use strict";var o={components:{commonHeader:d},methods:{}},n=r(47),c=r(70),l=r.n(c),h=r(518),v=r(285),component=Object(n.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-app-bar",{attrs:{fixed:"",dark:"",dense:""}},[r("v-app-bar-nav-icon",{on:{click:function(e){return t.$nuxt.$emit("drawerShow",!0)}}})],1)}),[],!1,null,null,null),d=e.a=component.exports;l()(component,{VAppBar:h.a,VAppBarNavIcon:v.a})},285:function(t,e,r){"use strict";r(12),r(9),r(5),r(4),r(8);var o=r(1),n=r(96),c=r(283),l=r(0);function h(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function v(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?h(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):h(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.a=l.a.extend({name:"v-app-bar-nav-icon",functional:!0,render:function(t,e){var r=e.slots,o=e.listeners,l=e.props,data=e.data,h=Object.assign(data,{staticClass:"v-app-bar__nav-icon ".concat(data.staticClass||"").trim(),props:v({},l,{icon:!0}),on:o}),d=r().default;return t(c.a,h,d||[t(n.a,"$menu")])}})},416:function(t,e,r){var content=r(448);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(11).default)("7f2242b6",content,!0,{sourceMap:!1})},417:function(t,e,r){var content=r(418);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(11).default)("197fcea4",content,!0,{sourceMap:!1})},418:function(t,e,r){(e=r(10)(!1)).push([t.i,'.v-chip:not(.v-chip--outlined).accent,.v-chip:not(.v-chip--outlined).error,.v-chip:not(.v-chip--outlined).info,.v-chip:not(.v-chip--outlined).primary,.v-chip:not(.v-chip--outlined).secondary,.v-chip:not(.v-chip--outlined).success,.v-chip:not(.v-chip--outlined).warning{color:#fff}.theme--light.v-chip{border-color:rgba(0,0,0,.12);color:rgba(0,0,0,.87)}.theme--light.v-chip:not(.v-chip--active){background:#e0e0e0}.theme--light.v-chip:hover:before{opacity:.04}.theme--light.v-chip--active:before,.theme--light.v-chip--active:hover:before,.theme--light.v-chip:focus:before{opacity:.12}.theme--light.v-chip--active:focus:before{opacity:.16}.theme--dark.v-chip{border-color:hsla(0,0%,100%,.12);color:#fff}.theme--dark.v-chip:not(.v-chip--active){background:#555}.theme--dark.v-chip:hover:before{opacity:.08}.theme--dark.v-chip--active:before,.theme--dark.v-chip--active:hover:before,.theme--dark.v-chip:focus:before{opacity:.24}.theme--dark.v-chip--active:focus:before{opacity:.32}.v-chip{-webkit-box-align:center;align-items:center;cursor:default;display:-webkit-inline-box;display:inline-flex;line-height:20px;max-width:100%;outline:none;overflow:hidden;padding:0 12px;position:relative;text-decoration:none;-webkit-transition-duration:.28s;transition-duration:.28s;-webkit-transition-property:box-shadow,opacity;transition-property:box-shadow,opacity;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1);vertical-align:middle;white-space:nowrap}.v-chip:before{background-color:currentColor;bottom:0;border-radius:inherit;content:"";left:0;opacity:0;position:absolute;pointer-events:none;right:0;top:0}.v-chip .v-avatar{height:24px!important;min-width:24px!important;width:24px!important}.v-chip .v-icon{font-size:24px}.v-application--is-ltr .v-chip .v-avatar--left,.v-application--is-ltr .v-chip .v-icon--left{margin-left:-6px;margin-right:8px}.v-application--is-ltr .v-chip .v-avatar--right,.v-application--is-ltr .v-chip .v-icon--right,.v-application--is-rtl .v-chip .v-avatar--left,.v-application--is-rtl .v-chip .v-icon--left{margin-left:8px;margin-right:-6px}.v-application--is-rtl .v-chip .v-avatar--right,.v-application--is-rtl .v-chip .v-icon--right{margin-left:-6px;margin-right:8px}.v-chip:not(.v-chip--no-color) .v-icon{color:inherit}.v-chip .v-chip__close.v-icon{font-size:18px;max-height:18px;max-width:18px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.v-application--is-ltr .v-chip .v-chip__close.v-icon.v-icon--right{margin-right:-4px}.v-application--is-rtl .v-chip .v-chip__close.v-icon.v-icon--right{margin-left:-4px}.v-chip .v-chip__close.v-icon:active,.v-chip .v-chip__close.v-icon:focus,.v-chip .v-chip__close.v-icon:hover{opacity:.72}.v-chip .v-chip__content{-webkit-box-align:center;align-items:center;display:-webkit-inline-box;display:inline-flex;height:100%;max-width:100%}.v-chip--active .v-icon{color:inherit}.v-chip--link:before{-webkit-transition:opacity .3s cubic-bezier(.25,.8,.5,1);transition:opacity .3s cubic-bezier(.25,.8,.5,1)}.v-chip--link:focus:before{opacity:.32}.v-chip--clickable{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.v-chip--clickable:active{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.v-chip--disabled{opacity:.4;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.v-chip__filter{max-width:24px}.v-chip__filter.v-icon{color:inherit}.v-chip__filter.expand-x-transition-enter,.v-chip__filter.expand-x-transition-leave-active{margin:0}.v-chip--pill .v-chip__filter{margin-right:0 16px 0 0}.v-chip--pill .v-avatar{height:32px!important;width:32px!important}.v-application--is-ltr .v-chip--pill .v-avatar--left{margin-left:-12px}.v-application--is-ltr .v-chip--pill .v-avatar--right,.v-application--is-rtl .v-chip--pill .v-avatar--left{margin-right:-12px}.v-application--is-rtl .v-chip--pill .v-avatar--right{margin-left:-12px}.v-chip--label{border-radius:4px!important}.v-chip.v-chip--outlined{border-width:thin;border-style:solid}.v-chip.v-chip--outlined:not(.v-chip--active):before{opacity:0}.v-chip.v-chip--outlined.v-chip--active:before{opacity:.08}.v-chip.v-chip--outlined .v-icon{color:inherit}.v-chip.v-chip--outlined.v-chip.v-chip{background-color:transparent!important}.v-chip.v-chip--selected{background:transparent}.v-chip.v-chip--selected:after{opacity:.28}.v-chip.v-size--x-small{border-radius:8px;font-size:10px;height:16px}.v-chip.v-size--small{border-radius:12px;font-size:12px;height:24px}.v-chip.v-size--default{border-radius:16px;font-size:14px;height:32px}.v-chip.v-size--large{border-radius:27px;font-size:16px;height:54px}.v-chip.v-size--x-large{border-radius:33px;font-size:18px;height:66px}',""]),t.exports=e},447:function(t,e,r){"use strict";var o=r(416);r.n(o).a},448:function(t,e,r){(e=r(10)(!1)).push([t.i,"#map_view{width:100%;height:300px}pre{font-size:10px}.wrap{background:#ddd;-webkit-perspective:1000px;perspective:1000px}.cube{display:block;position:relative;margin:0 auto;width:180px;height:300px;text-align:center;-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s}.cube,.face{-webkit-transform-style:preserve-3d;transform-style:preserve-3d}.face{position:absolute;top:0;left:0;display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;color:#fff;background-color:#333;box-sizing:border-box;opacity:.4}.face.f1{-webkit-transform:translateZ(20px);transform:translateZ(20px);width:180px;height:300px;color:#333;border:20px solid #333;background-color:#fff;opacity:.6}.face.f2{-webkit-transform:rotateX(90deg) translateX(0) translateY(0) translateZ(20px);transform:rotateX(90deg) translateX(0) translateY(0) translateZ(20px)}.face.f2,.face.f3{width:180px;height:40px}.face.f3{-webkit-transform:rotateX(-90deg) translateX(0) translateY(0) translateZ(280px);transform:rotateX(-90deg) translateX(0) translateY(0) translateZ(280px)}.face.f4{-webkit-transform:rotateY(180deg) translateX(0) translateY(0) translateZ(20px);transform:rotateY(180deg) translateX(0) translateY(0) translateZ(20px);width:180px;height:300px;opacity:.6}.face.f5{-webkit-transform:rotateY(90deg) translateX(0) translateY(0) translateZ(160px);transform:rotateY(90deg) translateX(0) translateY(0) translateZ(160px)}.face.f5,.face.f6{width:40px;height:300px}.face.f6{-webkit-transform:rotateY(270deg) translateX(0) translateY(0) translateZ(20px);transform:rotateY(270deg) translateX(0) translateY(0) translateZ(20px)}",""]),t.exports=e},449:function(t,e,r){"use strict";r(12),r(9),r(5),r(4),r(8);var o=r(19),n=r(1),c=(r(417),r(7)),l=r(112),h=r(96),v=r(17),d=r(113),f=r(20),m=r(48),x=r(75),w=r(115),y=r(6);function k(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function _(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?k(Object(source),!0).forEach((function(e){Object(n.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):k(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.a=Object(c.a)(v.a,w.a,x.a,f.a,Object(d.a)("chipGroup"),Object(m.b)("inputValue")).extend({name:"v-chip",props:{active:{type:Boolean,default:!0},activeClass:{type:String,default:function(){return this.chipGroup?this.chipGroup.activeClass:""}},close:Boolean,closeIcon:{type:String,default:"$delete"},disabled:Boolean,draggable:Boolean,filter:Boolean,filterIcon:{type:String,default:"$complete"},label:Boolean,link:Boolean,outlined:Boolean,pill:Boolean,tag:{type:String,default:"span"},textColor:String,value:null},data:function(){return{proxyClass:"v-chip--active"}},computed:{classes:function(){return _({"v-chip":!0},x.a.options.computed.classes.call(this),{"v-chip--clickable":this.isClickable,"v-chip--disabled":this.disabled,"v-chip--draggable":this.draggable,"v-chip--label":this.label,"v-chip--link":this.isLink,"v-chip--no-color":!this.color,"v-chip--outlined":this.outlined,"v-chip--pill":this.pill,"v-chip--removable":this.hasClose},this.themeClasses,{},this.sizeableClasses,{},this.groupClasses)},hasClose:function(){return Boolean(this.close)},isClickable:function(){return Boolean(x.a.options.computed.isClickable.call(this)||this.chipGroup)}},created:function(){var t=this;[["outline","outlined"],["selected","input-value"],["value","active"],["@input","@active.sync"]].forEach((function(e){var r=Object(o.a)(e,2),n=r[0],c=r[1];t.$attrs.hasOwnProperty(n)&&Object(y.a)(n,c,t)}))},methods:{click:function(t){this.$emit("click",t),this.chipGroup&&this.toggle()},genFilter:function(){var t=[];return this.isActive&&t.push(this.$createElement(h.a,{staticClass:"v-chip__filter",props:{left:!0}},this.filterIcon)),this.$createElement(l.b,t)},genClose:function(){var t=this;return this.$createElement(h.a,{staticClass:"v-chip__close",props:{right:!0},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.$emit("click:close"),t.$emit("update:active",!1)}}},this.closeIcon)},genContent:function(){return this.$createElement("span",{staticClass:"v-chip__content"},[this.filter&&this.genFilter(),this.$slots.default,this.hasClose&&this.genClose()])}},render:function(t){var e=[this.genContent()],r=this.generateRouteLink(),o=r.tag,data=r.data;data.attrs=_({},data.attrs,{draggable:this.draggable?"true":void 0,tabindex:this.chipGroup&&!this.disabled?0:data.attrs.tabindex}),data.directives.push({name:"show",value:this.active}),data=this.setBackgroundColor(this.color,data);var n=this.textColor||this.outlined&&this.color;return t(o,this.setTextColor(n,data),e)}})},512:function(t,e,r){"use strict";r.r(e);var o={components:{commonHeader:r(282).a},data:function(){return{doData:{alpha:0,beta:0,gamma:0}}},computed:{decimalDoData:function(){return{alpha:this.doData.alpha.toFixed(2),beta:this.doData.beta.toFixed(2),gamma:this.doData.gamma.toFixed(2)}},cubeStyle:function(){return"transform:rotateY("+this.decimalDoData.alpha+"deg) rotateX("+this.decimalDoData.beta+"deg) rotateZ("+this.decimalDoData.gamma+"deg) translateZ(20px)"}},beforeMount:function(){window.addEventListener("deviceorientation",this.doHandler,!0),window.addEventListener("devicemotion",this.dmHandler,!0)},mounted:function(){},methods:{doHandler:function(t){console.log("doHandler",t),this.doData.alpha=t.alpha,this.doData.beta=t.beta,this.doData.gamma=t.gamma},dmHandler:function(t){console.log("doHandler",t)},arrowDo:function(){var t=this;DeviceOrientationEvent.requestPermission().then((function(e){"granted"==e&&(alert("許可されました"),window.addEventListener("deviceorientation",(function(e){t.doData.alpha=e.alpha,t.doData.beta=e.beta,t.doData.gamma=e.gamma})))})).catch(alert("許可されませんでした"))}}},n=(r(447),r(47)),c=r(70),l=r.n(c),h=r(283),v=r(449),component=Object(n.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"pa-2"},[r("commonHeader"),r("pre",[t._v(t._s(t.doData))]),r("pre",[t._v(t._s(t.decimalDoData))]),r("v-chip",{attrs:{small:""}},[t._v("alpha : 0～360")]),r("p",{staticClass:"caption"},[t._v("z軸を中心にしたコンパスの動き")]),r("v-chip",{attrs:{small:""}},[t._v("beta : 0～360")]),r("p",{staticClass:"caption"},[t._v("x軸を中心にしたデバイスの前後の動き")]),r("v-chip",{attrs:{small:""}},[t._v("gamma : 0～360")]),r("p",{staticClass:"caption"},[t._v("z軸を中心にしたデバイスの左右の動き")]),r("p",[r("v-btn",{attrs:{color:"primary"},on:{click:t.arrowDo}},[t._v("ジャイロセンサーの許可")])],1),r("div",{staticClass:"wrap"},[r("div",{staticClass:"cube",style:t.cubeStyle},[r("div",{staticClass:"face f1"},[t._v("Front")]),r("div",{staticClass:"face f2"},[t._v("Top")]),r("div",{staticClass:"face f3"},[t._v("Bottom")]),r("div",{staticClass:"face f4"},[t._v("Back")]),r("div",{staticClass:"face f5"},[t._v("Right")]),r("div",{staticClass:"face f6"},[t._v("Left")])])])],1)}),[],!1,null,null,null);e.default=component.exports;l()(component,{VBtn:h.a,VChip:v.a})}}]);