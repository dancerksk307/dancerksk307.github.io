(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{303:function(t,e,n){"use strict";var j={components:{commonHeader:d},methods:{}},r=n(53),o=n(77),l=n.n(o),c=n(550),m=n(306),component=Object(r.a)(j,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app-bar",{attrs:{fixed:"",dark:"",dense:""}},[n("v-app-bar-nav-icon",{on:{click:function(e){return t.$nuxt.$emit("drawerView")}}})],1)}),[],!1,null,null,null),d=e.a=component.exports;l()(component,{VAppBar:c.a,VAppBarNavIcon:m.a})},457:function(t,e,n){var map={"./af":309,"./af.js":309,"./ar":310,"./ar-dz":311,"./ar-dz.js":311,"./ar-kw":312,"./ar-kw.js":312,"./ar-ly":313,"./ar-ly.js":313,"./ar-ma":314,"./ar-ma.js":314,"./ar-sa":315,"./ar-sa.js":315,"./ar-tn":316,"./ar-tn.js":316,"./ar.js":310,"./az":317,"./az.js":317,"./be":318,"./be.js":318,"./bg":319,"./bg.js":319,"./bm":320,"./bm.js":320,"./bn":321,"./bn.js":321,"./bo":322,"./bo.js":322,"./br":323,"./br.js":323,"./bs":324,"./bs.js":324,"./ca":325,"./ca.js":325,"./cs":326,"./cs.js":326,"./cv":327,"./cv.js":327,"./cy":328,"./cy.js":328,"./da":329,"./da.js":329,"./de":330,"./de-at":331,"./de-at.js":331,"./de-ch":332,"./de-ch.js":332,"./de.js":330,"./dv":333,"./dv.js":333,"./el":334,"./el.js":334,"./en-SG":335,"./en-SG.js":335,"./en-au":336,"./en-au.js":336,"./en-ca":337,"./en-ca.js":337,"./en-gb":338,"./en-gb.js":338,"./en-ie":339,"./en-ie.js":339,"./en-il":340,"./en-il.js":340,"./en-nz":341,"./en-nz.js":341,"./eo":342,"./eo.js":342,"./es":343,"./es-do":344,"./es-do.js":344,"./es-us":345,"./es-us.js":345,"./es.js":343,"./et":346,"./et.js":346,"./eu":347,"./eu.js":347,"./fa":348,"./fa.js":348,"./fi":349,"./fi.js":349,"./fo":350,"./fo.js":350,"./fr":351,"./fr-ca":352,"./fr-ca.js":352,"./fr-ch":353,"./fr-ch.js":353,"./fr.js":351,"./fy":354,"./fy.js":354,"./ga":355,"./ga.js":355,"./gd":356,"./gd.js":356,"./gl":357,"./gl.js":357,"./gom-latn":358,"./gom-latn.js":358,"./gu":359,"./gu.js":359,"./he":360,"./he.js":360,"./hi":361,"./hi.js":361,"./hr":362,"./hr.js":362,"./hu":363,"./hu.js":363,"./hy-am":364,"./hy-am.js":364,"./id":365,"./id.js":365,"./is":366,"./is.js":366,"./it":367,"./it-ch":368,"./it-ch.js":368,"./it.js":367,"./ja":369,"./ja.js":369,"./jv":370,"./jv.js":370,"./ka":371,"./ka.js":371,"./kk":372,"./kk.js":372,"./km":373,"./km.js":373,"./kn":374,"./kn.js":374,"./ko":375,"./ko.js":375,"./ku":376,"./ku.js":376,"./ky":377,"./ky.js":377,"./lb":378,"./lb.js":378,"./lo":379,"./lo.js":379,"./lt":380,"./lt.js":380,"./lv":381,"./lv.js":381,"./me":382,"./me.js":382,"./mi":383,"./mi.js":383,"./mk":384,"./mk.js":384,"./ml":385,"./ml.js":385,"./mn":386,"./mn.js":386,"./mr":387,"./mr.js":387,"./ms":388,"./ms-my":389,"./ms-my.js":389,"./ms.js":388,"./mt":390,"./mt.js":390,"./my":391,"./my.js":391,"./nb":392,"./nb.js":392,"./ne":393,"./ne.js":393,"./nl":394,"./nl-be":395,"./nl-be.js":395,"./nl.js":394,"./nn":396,"./nn.js":396,"./pa-in":397,"./pa-in.js":397,"./pl":398,"./pl.js":398,"./pt":399,"./pt-br":400,"./pt-br.js":400,"./pt.js":399,"./ro":401,"./ro.js":401,"./ru":402,"./ru.js":402,"./sd":403,"./sd.js":403,"./se":404,"./se.js":404,"./si":405,"./si.js":405,"./sk":406,"./sk.js":406,"./sl":407,"./sl.js":407,"./sq":408,"./sq.js":408,"./sr":409,"./sr-cyrl":410,"./sr-cyrl.js":410,"./sr.js":409,"./ss":411,"./ss.js":411,"./sv":412,"./sv.js":412,"./sw":413,"./sw.js":413,"./ta":414,"./ta.js":414,"./te":415,"./te.js":415,"./tet":416,"./tet.js":416,"./tg":417,"./tg.js":417,"./th":418,"./th.js":418,"./tl-ph":419,"./tl-ph.js":419,"./tlh":420,"./tlh.js":420,"./tr":421,"./tr.js":421,"./tzl":422,"./tzl.js":422,"./tzm":423,"./tzm-latn":424,"./tzm-latn.js":424,"./tzm.js":423,"./ug-cn":425,"./ug-cn.js":425,"./uk":426,"./uk.js":426,"./ur":427,"./ur.js":427,"./uz":428,"./uz-latn":429,"./uz-latn.js":429,"./uz.js":428,"./vi":430,"./vi.js":430,"./x-pseudo":431,"./x-pseudo.js":431,"./yo":432,"./yo.js":432,"./zh-cn":433,"./zh-cn.js":433,"./zh-hk":434,"./zh-hk.js":434,"./zh-tw":435,"./zh-tw.js":435};function j(t){var e=r(t);return n(e)}function r(t){if(!n.o(map,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return map[t]}j.keys=function(){return Object.keys(map)},j.resolve=r,t.exports=j,j.id=457},547:function(t,e,n){"use strict";n.r(e);var j=n(303),r=n(301),o=n.n(r);o.a.locale("ja");var l={components:{commonHeader:j.a},data:function(){return{dates:["2020-01-05","2020-01-15"],today:(new Date).toISOString().substr(0,10)}},filters:{moment:function(t,e){return o()(t).format(e)}},computed:{beforeNow:function(){return o()("2020-01-15").fromNow()},diffDays:function(){var t=o()(this.dates[0]),e=o()(this.dates[1]);return[e.diff(t,"months")+"ヶ月",e.diff(t,"days")+"日",e.diff(t,"hours")+"時間"]}},mounted:function(){},methods:{}},c=n(53),m=n(77),d=n.n(m),f=n(304),h=n(539),v=n(117),component=Object(c.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"pa-1"},[n("commonHeader"),n("p",[n("v-btn",{attrs:{href:"https://momentjs.com/",color:"primary",target:"_blank"}},[n("v-icon",{attrs:{left:""}},[t._v("mdi-link-variant")]),n("span",[t._v("moment.js 公式")])],1)],1),n("p",[n("v-btn",{attrs:{href:"https://www.wakuwakubank.com/posts/606-javascript-moment/",color:"primary",target:"_blank"}},[n("v-icon",{attrs:{left:""}},[t._v("mdi-link-variant")]),n("span",[t._v("使い方参考")])],1)],1),n("p",[t._v(t._s(t._f("moment")(new Date,"YYYY/MM/DD-ddd hh:mm:ss")))]),n("p",[t._v(t._s(t.beforeNow))]),n("p",[t._v("Today : "+t._s(t.today))]),n("v-date-picker",{attrs:{range:""},model:{value:t.dates,callback:function(e){t.dates=e},expression:"dates"}}),n("p",[t._v("選択日付 : "+t._s(t.dates))]),n("p",[t._v("日付差分 : "+t._s(t.diffDays))])],1)}),[],!1,null,null,null);e.default=component.exports;d()(component,{VBtn:f.a,VDatePicker:h.a,VIcon:v.a})}}]);