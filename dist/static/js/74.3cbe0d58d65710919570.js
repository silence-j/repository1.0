webpackJsonp([74],{1264:function(t,n,e){n=t.exports=e(62)(),n.push([t.i,'/**\n * 二级菜单样式\n */\n.topMenu {\n  width: 1200px;\n  margin: 0 auto;\n  border-bottom: 1px solid #dfe3eb;\n  margin-bottom: 16px;\n}\n.topMenu .top-title {\n  font-size: 20px;\n  color: #33475B;\n  margin-top: 20px;\n}\n.topMenu .menu a {\n  margin-left: 2%;\n}\n.topMenu .menu li {\n  display: inline-block;\n  font-size: 14px;\n  padding: 16px 0 10px 0;\n  line-height: 18px;\n  position: relative;\n  cursor: pointer;\n  color: #7C98B6;\n}\n.topMenu .menu li .icon-active {\n  display: none;\n}\n.topMenu .menu li:hover {\n  color: #5488F9;\n}\n.topMenu .menu a:first-child {\n  margin-left: 0;\n}\n.topMenu .menu .icon,\n.topMenu .menu [class^="icon"] {\n  margin-right: 5px;\n}\n.topMenu .menu .curr {\n  border-bottom: 4px solid #5488F9;\n  color: #5488F9;\n}\n.topMenu .menu .curr .icon-unactive {\n  display: none;\n}\n.topMenu .menu .curr .icon-active {\n  display: inline-block;\n}\n.router-view {\n  width: 1200px;\n  margin: 0 auto;\n}\n',""])},1578:function(t,n,e){t.exports={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",[e("div",{staticClass:"topMenu"},[e("div",{staticClass:"top-title"},[t._v("全网监控")]),t._v(" "),e("ul",{staticClass:"menu"},t._l(t.menuList,function(n,i){return"/mailMonitor"!==n.url||"0"!==t.serverLevel?e("router-link",{key:i,attrs:{to:{path:n.url}}},[e("li",{class:{curr:i===t.selectedSubNav},domProps:{innerHTML:t._s(n.title)},on:{click:function(n){t.changeMenu(i)}}})]):t._e()}))]),t._v(" "),e("div",{staticClass:"router-view"},[e("router-view")],1)])},staticRenderFns:[]},t.exports.render._withStripped=!0},1758:function(t,n,e){var i=e(1264);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);e(105)("6aee7386",i,!1)},353:function(t,n,e){e(1758);var i=e(106)(e(988),e(1578),null,null);i.options.__file="D:\\B2Bseller4.0\\b2b-seller4.0\\src\\components\\subNavBars\\MonitorBar.vue",i.esModule&&Object.keys(i.esModule).some(function(t){return"default"!==t&&"__esModule"!==t}),i.options.functional,t.exports=i.exports},988:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=e(69),o=e.n(i),r=e(114);n.default={data:function(){return{selectedSubNav:0,serverLevel:"1",timerMonitor:0,menuListCopy:[],menuList:[{title:'<i class="icon-font">&#xe668;</i>询盘监控',url:"/enquiriesIndex",code:"CC"},{title:'<i class="icon-font">&#xe67c;</i>社交监控',url:"/socialMonitor",code:"CA"},{title:'<i class="icon-font">&#xe68b;</i>邮件监控',url:"/mailMonitor",code:"CB"},{title:'<i class="icon-font">&#xe6af;</i>社媒雷达',url:"/socialMedia",code:"CD"}]}},components:{},computed:o()({},e.i(r.b)(["allRights"])),watch:{$route:function(t,n){t.path.indexOf("socialMonitor")>0&&(this.selectedSubNav=1)},allRights:function(){this.rightCompute(this.menuListCopy),this.isRouterInRightArray()}},mounted:function(){this.menuListCopy=this.menuList,this.serverLevel=window.localStorage.serverLevel,this.rightCompute(this.menuList)},methods:{isRouterInRightArray:function(){var t=this.$router.currentRoute.fullPath;this.menuList.some(function(n){return n.url===t})||this.$router.push({path:"/index"})},setSelectedTab:function(){this.$store.dispatch("setNavIndex","");for(var t in this.menuList)this.$route.path===this.menuList[t].url&&(this.selectedSubNav=parseInt(t));var n=localStorage.userId,e=JSON.parse(localStorage["topBar"+n]);for(var i in e)"全网监控"===e[i].title&&this.$store.dispatch("setNavIndex",parseInt(i))},rightCompute:function(t){if(sessionStorage.functions){var n=JSON.parse(sessionStorage.functions),e=[];for(var i in t)this.isInRightArray(t[i],n)&&e.push(t[i]);this.menuList=e,this.setSelectedTab()}},isInRightArray:function(t,n){return n.some(function(n){return n.code===t.code})},changeMenu:function(t){this.selectedSubNav=t,this.timerMonitor++,this.$store.commit("MONITOR_TIMERMONITOR",{timerMonitor:this.timerMonitor,mindex:t})}}}}});
//# sourceMappingURL=74.3cbe0d58d65710919570.js.map