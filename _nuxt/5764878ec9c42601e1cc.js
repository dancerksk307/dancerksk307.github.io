(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{260:function(t,e,o){var content=o(310);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(12).default)("323312d3",content,!0,{sourceMap:!1})},261:function(t,e,o){var content=o(312);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(12).default)("bc049656",content,!0,{sourceMap:!1})},309:function(t,e,o){"use strict";var l=o(260);o.n(l).a},310:function(t,e,o){(e=o(11)(!1)).push([t.i,".datepicker{display:-webkit-inline-box;display:inline-flex;-webkit-box-align:center;align-items:center;padding:4px 0;position:relative;overflow:hidden}.datepicker .date_select{opacity:0;position:absolute;width:100%}input[type=date]{width:100%;position:relative}input[type=date]::-webkit-clear-button,input[type=date]::-webkit-inner-spin-button{-webkit-appearance:none}input[type=date]::-webkit-calendar-picker-indicator{position:absolute;width:100%;height:200%}",""]),t.exports=e},311:function(t,e,o){"use strict";var l=o(261);o.n(l).a},312:function(t,e,o){(e=o(11)(!1)).push([t.i,".todo_list .v-list-item{border-bottom:1px solid #ddd}.todo_list .v-list-item .v-list-item__content{border-left:1px solid #ddd;-webkit-transition:opacity .3s;transition:opacity .3s;border-right:1px solid #ddd;padding:0 8px;margin:6px 0}.todo_list .v-list-item .v-list-item__content .todo_limit{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;padding:2px}.todo_list .v-list-item .todo_comp_check .v-icon{opacity:.25;-webkit-transition:opacity .3s;transition:opacity .3s}.todo_list .v-list-item[complete] .v-list-item__content{opacity:.25;pointer-events:none}.todo_list .v-list-item[complete] .todo_comp_check .v-icon{opacity:1}.todo_list .v-input__slot:after{opacity:.25}.todo_list .ghost{opacity:.5;background:#c8ebfb}.v-app-bar .v-image__image.v-image__image--cover{-webkit-filter:opacity(.125);filter:opacity(.125)}",""]),t.exports=e},343:function(t,e,o){"use strict";o.r(e);var l=o(0),n=o(305),d=o(93),c=o.n(d),r=o(306),m=o.n(r),v=o(308),w=o.n(v),f={props:{limit_date:{type:String}},data:function(){return{}},methods:{}},h=(o(309),o(49)),_=o(70),x=o.n(_),k=o(108),component=Object(h.a)(f,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"datepicker"},[o("v-icon",{staticClass:"mr-1",attrs:{small:""}},[t._v("mdi-calendar-clock")]),o("div",{staticClass:"date"},[t._v(t._s(null!=t.limit_date?t.limit_date:"期日未設定"))]),o("input",{staticClass:"date_select",attrs:{type:"date"},domProps:{value:t.limit_date},on:{change:function(e){return t.$emit("date-change",e.target.value)}}})],1)}),[],!1,null,null,null),y=component.exports;x()(component,{VIcon:k.a}),l.a.use(w.a);var Y={components:{draggable:m.a,datepicker:y},data:function(){return{editOrder:!1,listDrag:!1,moment:c.a,limitAlert:3,dialogNewItem:!1,newItem:{label:"",limit:c()().format("YYYY-MM-DD"),limitFlg:!1},todo:{items:[{index:0,tab_id:0,label:"Todo 0",complete:!1,select:!1,limit:c()().format("YYYY-MM-DD")},{index:1,tab_id:0,label:"Todo 1",complete:!1,select:!1,limit:null},{index:2,tab_id:0,label:"Todo 2",complete:!1,select:!1,limit:c()("2001-10-12","YYYY-MM-DD").format("YYYY-MM-DD")}]}}},computed:{},methods:{saveJson:function(){n.setItem("todo",this.todo).then((function(){console.log("Save Success")})).catch((function(t){console.log("Save Faild",t)}))},deleteJson:function(){n.clear(),console.log("data clear")},swipeHandler:function(t){console.log(t)},addNewItem:function(){var t=this.todo.items;t.push({index:t.length,tab_id:this.todo.selectedTab,label:this.newItem.label?this.newItem.label:"ToDo - "+this.todo.items.length,limit:this.newItem.limitFlg?this.newItem.limit:null,complete:!1,select:!1}),this.dialogNewItem=!1}},mounted:function(){console.log("mounted");var t=c()("2015-01-11","YYYY-MM-DD");console.log("sampleday",t.format("YYYY-MM-DD")),console.log("30add",t.add(30,"days").format("YYYY-MM-DD")),console.log("diff",t.diff(c()(),"days"))}},I=(o(311),o(346)),C=o(345),D=o(265),V=o(347),N=o(267),M=o(268),H=o(68),O=o(110),S=o(39),T=o(55),A=o(97),L=o(115),$=o(340),J=o(348),E=Object(h.a)(Y,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-layout",{attrs:{column:""}},[o("pre",{staticClass:"data_view"},[t._v(t._s(t.todo.items))]),o("v-app-bar",{attrs:{absolute:"",dark:"",dense:"",color:"primary",src:"https://media.kasperskydaily.com/wp-content/uploads/sites/98/2016/01/07013852/main4.jpg"}},[o("v-btn",{attrs:{icon:""}},[o("v-icon",[t._v("mdi-format-list-checkbox")])],1),o("v-checkbox",{attrs:{"hide-details":"",label:"編集"},model:{value:t.editOrder,callback:function(e){t.editOrder=e},expression:"editOrder"}}),o("v-spacer"),o("v-btn",{attrs:{icon:""}},[o("v-icon",[t._v("mdi-dots-vertical")])],1)],1),o("draggable",{staticClass:"mt-12",attrs:{"ghost-class":"ghost",animation:"100",handle:".handle",disabled:!t.editOrder},on:{start:function(e){t.listDrag=!0},end:function(e){t.listDrag=!1}},model:{value:t.todo.items,callback:function(e){t.$set(t.todo,"items",e)},expression:"todo.items"}},[o("transition-group",{staticClass:"todo_list py-0",attrs:{tag:"v-list",type:"transition",name:t.listDrag?null:"flip-list"}},t._l(t.todo.items,(function(e,l){return o("v-list-item",{directives:[{name:"touch",rawName:"v-touch:swipe.left",value:t.swipeHandler,expression:"swipeHandler",arg:"swipe",modifiers:{left:!0}}],key:l,staticClass:"align-items-center px-2",attrs:{dense:"",complete:e.complete}},[o("v-list-item-action",{staticClass:"mr-2"},[o("v-slide-x-transition",[o("v-checkbox",{directives:[{name:"show",rawName:"v-show",value:t.editOrder,expression:"editOrder"}],model:{value:e.select,callback:function(o){t.$set(e,"select",o)},expression:"item.select"}})],1)],1),o("v-list-item-content",[o("v-text-field",{staticClass:"pt-0",attrs:{"hide-details":"",clearable:""},model:{value:e.label,callback:function(o){t.$set(e,"label",o)},expression:"item.label"}}),o("v-list-item-subtitle",{staticClass:"todo_limit"},[o("datepicker",{attrs:{limit_date:e.limit},on:{"date-change":function(t){e.limit=t}}}),o("v-spacer"),o("div",{staticClass:"remaining"},[t.moment().isSame(e.limit,"day")?[o("v-icon",{staticClass:"pr-1",attrs:{small:""}},[t._v("mdi-av-timer")]),o("span",[t._v("期限当日")])]:t.moment().isAfter(e.limit)?[o("v-icon",{staticClass:"pr-1",attrs:{small:""}},[t._v("mdi-av-timer")]),o("span",[t._v(t._s(t.moment().diff(e.limit,"day"))+"日超過")])]:t.moment().isAfter(t.moment(e.limit).subtract(t.limitAlert,"days"))?[o("v-icon",{staticClass:"pr-1",attrs:{small:""}},[t._v("mdi-av-timer")]),o("span",[t._v("あと"+t._s(t.moment(e.limit).diff(t.moment(),"day")+1)+"日")])]:t._e()],2)],1)],1),o("v-list-item-icon",{staticClass:"ml-2 handle align-self-auto"},[o("v-slide-x-transition",[o("v-icon",{directives:[{name:"show",rawName:"v-show",value:t.editOrder,expression:"editOrder"}]},[t._v("mdi-menu")])],1),o("v-slide-x-transition",[o("v-icon",{directives:[{name:"show",rawName:"v-show",value:!t.editOrder,expression:"!editOrder"}],attrs:{color:e.complete?"success":""},on:{click:function(t){e.complete=!e.complete}}},[t._v("mdi-check-bold")])],1)],1)],1)})),1)],1),o("v-btn",{on:{click:function(e){t.dialogNewItem=!0}}},[t._v("new")]),o("v-bottom-sheet",{model:{value:t.dialogNewItem,callback:function(e){t.dialogNewItem=e},expression:"dialogNewItem"}},[o("v-sheet",{staticClass:"pa-2",attrs:{height:"30vh"}},[o("v-text-field",{attrs:{"hide-details":"",clearable:"",outlined:"",label:"新規ToDo"},model:{value:t.newItem.label,callback:function(e){t.$set(t.newItem,"label",e)},expression:"newItem.label"}}),o("div",{staticClass:"d-flex"},[o("datepicker",{attrs:{limit_date:t.newItem.limit},on:{"date-change":function(e){t.newItem.limit=e}}}),o("v-spacer"),o("v-btn",{on:{click:t.addNewItem}},[t._v("add")])],1)],1)],1),o("v-flex",[o("v-btn",{on:{click:t.saveJson}},[t._v("SAVE")]),o("v-btn",{on:{click:t.deleteJson}},[t._v("Delete")])],1),t._v(" "),o("div",{directives:[{name:"touch",rawName:"v-touch:swipe",value:t.swipeHandler,expression:"swipeHandler",arg:"swipe"}]},[t._v("Swipe Here")]),o("div",{directives:[{name:"touch",rawName:"v-touch:swipe.left",value:t.swipeHandler,expression:"swipeHandler",arg:"swipe",modifiers:{left:!0}}]},[t._v("Swipe Here")]),o("div",{directives:[{name:"touch",rawName:"v-touch:longtap",value:t.swipeHandler,expression:"swipeHandler",arg:"longtap"}]},[t._v("Long Tap Event")]),t._v(" "),o("div",{directives:[{name:"touch",rawName:"v-touch:moved",value:t.swipeHandler,expression:"swipeHandler",arg:"moved"}]},[t._v("move")]),o("div",{directives:[{name:"touch",rawName:"v-touch:moving",value:t.swipeHandler,expression:"swipeHandler",arg:"moving"}]},[t._v("Continuously triggering Event")])],1)}),[],!1,null,null,null);e.default=E.exports;x()(E,{VAppBar:I.a,VBottomSheet:C.a,VBtn:D.a,VCheckbox:V.a,VFlex:N.a,VIcon:k.a,VLayout:M.a,VListItem:H.a,VListItemAction:O.a,VListItemContent:S.a,VListItemIcon:T.a,VListItemSubtitle:S.b,VSheet:A.a,VSlideXTransition:L.d,VSpacer:$.a,VTextField:J.a})}}]);