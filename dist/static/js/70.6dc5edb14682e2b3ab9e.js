webpackJsonp([70],{1072:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(459);e.default={name:"companyDetail",data:function(){return{}},created:function(){},mounted:function(){this.comDetail({companyId:this.$route.query.companyId})},components:{},methods:{comDetail:function(t){o.a.getCompanyDetail(t).then(function(t){return function(){}})}}}},1246:function(t,e,n){e=t.exports=n(62)(),e.push([t.i,"",""])},1561:function(t,e,n){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"info"},[n("div",{staticClass:"detail-head"},[n("img",{attrs:{src:"",alt:""}}),t._v(" "),n("p"),t._m(0),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),t._m(3),t._v(" "),t._m(4),t._v(" "),t._m(5),t._v(" "),t._m(6),t._v(" "),t._m(7),t._v(" "),n("p"),t._v(" "),n("el-table",{staticStyle:{width:"90%"}},[n("el-table-column",{attrs:{label:"姓名"}}),t._v(" "),n("el-table-column",{attrs:{label:"职位"}}),t._v(" "),n("el-table-column",{attrs:{label:"岗位"}}),t._v(" "),n("el-table-column",{attrs:{label:"邮箱"}}),t._v(" "),n("el-table-column",{attrs:{label:"社交信息"}})],1)],1)])},staticRenderFns:[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{},[n("span",[t._v("行业：")]),n("span")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{},[n("span",[t._v("公司类型：")]),n("span")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{},[n("span",[t._v("公司网址：")]),n("span")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{},[n("span",[t._v("公司规模：")]),n("span")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{},[n("span",[t._v("公司地址：")]),n("span")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{},[n("span",[t._v("公司名称：")]),n("span")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{},[n("span",[t._v("电话：")]),n("span")])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{},[n("span",[t._v("传真：")]),n("span")])}]},t.exports.render._withStripped=!0},1740:function(t,e,n){var o=n(1246);"string"==typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);n(105)("c327aac0",o,!1)},379:function(t,e,n){n(1740);var o=n(106)(n(1072),n(1561),"data-v-5785f8b4",null);o.options.__file="D:\\B2Bseller4.0\\b2b-seller4.0\\src\\views\\explore\\cpnts\\companyDetail.vue",o.esModule&&Object.keys(o.esModule).some(function(t){return"default"!==t&&"__esModule"!==t}),o.options.functional,t.exports=o.exports},459:function(t,e,n){"use strict";var o=n(13),r={getPpcList:function(t){return o.a.get("https://server.onloon.com.cn/bshop/purchaser/recommendation/list",t)},addPpc:function(t){return o.a.post("https://server.onloon.com.cn/bshop/contacts/person/add",t)},getPpcDetail:function(t){return o.a.get("https://server.onloon.com.cn/bshop/purchaser/recommendation/detail",t)},getLeads:function(t){return o.a.get("https://server.onloon.com.cn/bshop/client/recommend/list",t)},addLeads:function(t){return o.a.post("https://server.onloon.com.cn/bshop/explore/recommend/add",t)},removeContact:function(t){return o.a.post("https://server.onloon.com.cn/bshop/explore/recommend/remove",t)},companyList:function(t){return o.a.get("https://server.onloon.com.cn/bshop/explore/company/list",t)},addCompany:function(t){return o.a.post("https://server.onloon.com.cn/bshop/explore/company/add",t)},addCompanyNow:function(t){return o.a.post("https://server.onloon.com.cn/bshop/contacts/social/add",t)},getCompanyDetail:function(t){return o.a.get("https://server.onloon.com.cn/bshop/contacts/company/detail",t)},getSearchResult:function(t){return o.a.get("https://server.onloon.com.cn/bshop/client/search/list",t)},getCountry:function(t){return o.a.post("https://server.onloon.com.cn/bshop/config/dict/list",t)},getCompany:function(t){return o.a.get("https://server.onloon.com.cn/bshop/client/company/detail",t)},getStaffList:function(t){return o.a.get("https://server.onloon.com.cn/bshop/client/company/employee/list",t)},getLeadList:function(t){return o.a.get("https://server.onloon.com.cn/bshop/purchaser/detailList",t)},getStaffDetail:function(t){return o.a.get("https://server.onloon.com.cn/bshop/client/employee/detail",t)},getFbRecommend:function(t){return o.a.get("https://server.onloon.com.cn/bshop/explore/recommend/fbSearch",t)},getEmail:function(t){return o.a.get("https://server.onloon.com.cn/bshop/client/hunter/findemail",t)},addContact:function(t){return o.a.post("https://server.onloon.com.cn/bshop/client/contacts/add",t)},searchCompany:function(t){return o.a.get("https://server.onloon.com.cn/bshop/explore/company/list",t)}};e.a=r}});
//# sourceMappingURL=70.6dc5edb14682e2b3ab9e.js.map