webpackJsonp([53],{1082:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=t(431),i=t.n(o),a=t(744);e.default={name:"mailDetail",data:function(){var n=this;return{defaultPhoto:"/static/img/default_avatar.jpg",companyPhoto:"/static/img/default_company.png",dialogAddPerson:!1,rulePersonForm:{firstName:"",lastName:"",position:"",email:""},rules:{firstName:[{required:!0,message:"请输入firstName",trigger:"blur"},{validator:function(e,t,o){""===t.trim()?(n.personError=!1,o(new Error("firstName 不能为空")),o()):(n.personError=!1,o())},trigger:"blur"}],email:[{validator:function(e,t,o){var i=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;""===t?(n.personError=!1,o()):i.test(t)?(n.personError=!1,o()):(n.personError=!0,o(new Error("请输入正确邮箱")))},trigger:"blur"}]},personError:!1,item:{},attachmentList:[],detailLoad:!1,attachLoad:!1}},watch:{item:function(){var n=this;this.$nextTick(function(){for(var e=n.$refs.mailContent.getElementsByTagName("a"),t=0;t<e.length;t++)e[t].setAttribute("target","_blank")})}},mounted:function(){this.$store.dispatch("updateMailRedPoint"),this.getMailDetail()},computed:{channelList:function(){return this.$store.state.mail.channelList}},methods:{backMailList:function(){this.$router.push({path:"/mailList"})},getMailDetail:function(){var n=this,e={receiveId:this.$route.query.id};this.detailLoad=!0,a.a.getMailDetail(e).then(function(t){0===t.data.code&&(n.item=t.data.data,n.detailLoad=!1,n.item.withAttach&&(n.attachLoad=!0,a.a.getAttachment(e).then(function(e){0===e.data.code&&(n.attachLoad=!1,n.attachmentList=e.data.data)})))})},replyMail:function(n){var e=n.sender;event.stopPropagation();var t={contactId:"",actionType:-1,contactType:-1,messageType:"mail"};e.personId?(t.contactId=e.personId,t.contactType=0):(t.contactId=e.companyId,t.contactType=1),this.$router.push({path:"/contactDetail",query:t})},addPerson:function(n){var e=this;n.stopPropagation();var t=this;this.$refs.rulePersonForm.validate(function(n){if(!n)return!1;e.rulePersonForm.mails=i()([{type:0,mail:e.rulePersonForm.email}]),a.a.addPerson(e.rulePersonForm).then(function(n){n.data.code?t.$message.error(n.data.message):(e.dialogAddPerson=!1,t.$message.success("新增联系人成功"),e.getMailDetail())})})},showAddDialog:function(n){this.rulePersonForm.email=n.sender.email,this.dialogAddPerson=!0},closeAddPerson:function(){this.dialogAddPerson=!1,this.rulePersonForm={firstName:"",lastName:"",position:"",email:""}}}}},1288:function(n,e,t){e=n.exports=t(62)(),e.i(t(108),""),e.push([n.i,"/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\nhtml,\nbody,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  display: block;\n}\nhtml,\ntextarea {\n  font-family: 'Noto Serif CJK SC', 'Noto Serif CJK', 'Source Han Serif SC', 'Source Han Serif', source-han-serif-sc, Source Han Sans CN Regular, PingFangSC-Regular, Microsoft YaHei, Helvetica Neue For Number, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Helvetica Neue, Helvetica, Arial, sans-serif;\n}\nbody {\n  line-height: 1;\n  /*避免弹框时去掉滚动条*/\n  overflow: auto!important;\n  padding-right: 0!important;\n}\nol,\nul,\nli {\n  list-style: none;\n}\nblockquote,\nq {\n  quotes: none;\n}\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: \"\";\n  content: none;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  width: 100%;\n}\na {\n  text-decoration: none;\n}\ni,\nem {\n  font-style: normal;\n}\n.clearfix {\n  *zoom: 1;\n}\n.clearfix:before,\n.clearfix:after {\n  content: ' ';\n  display: table;\n}\n.clearfix:after {\n  clear: both;\n}\n.relative {\n  position: relative;\n}\n@font-face {\n  font-family: 'icomoon';\n  /* project id 250415 */\n  src: url("+t(63)+");\n  src: url("+t(63)+"?#iefix) format('embedded-opentype'), url("+t(111)+") format('woff'), url("+t(110)+") format('truetype'), url("+t(109)+"#iconmoon) format('svg');\n}\n.icon-font,\n[class^=\"icon\"] {\n  font-family: \"icomoon\" !important;\n  font-size: 12px;\n  font-style: normal;\n  -webkit-font-smoothing: antialiased;\n  -webkit-text-stroke-width: 0.2px;\n  -moz-osx-font-smoothing: grayscale;\n}\n.icon {\n  width: 1em;\n  height: 1em;\n  vertical-align: -0.15em;\n  fill: currentColor;\n  overflow: hidden;\n}\n.icon-search:before {\n  content: '\\E607';\n}\n.icon-fresh:before {\n  content: '\\E6F9';\n}\n.icon-warn:before {\n  content: '\\E604';\n}\n.icon-prompt:before {\n  content: '\\E629';\n}\n.icon-fail:before {\n  content: '\\E605';\n}\n.icon-ok:before {\n  content: '\\E606';\n}\n.icon-left:before {\n  content: '\\E600';\n}\n.icon-remove2:before {\n  content: '\\E602';\n}\n.icon-move:before {\n  content: \"\\E66E\";\n}\n.icon-contact-facebook:before {\n  content: '\\E6D9';\n  color: #ddd;\n}\n.icon-contact-twitter:before {\n  content: '\\E621';\n  color: #ddd;\n}\n.icon-contact-linkedin:before {\n  content: '\\E616';\n  color: #ddd;\n}\n.icon-ppt:before {\n  content: \"\\E619\";\n}\n.icon-word:before {\n  content: \"\\E624\";\n}\n.icon-facebook:before {\n  content: '\\E6D9';\n  color: #577ECE;\n}\n.icon-fb:before {\n  content: '\\E68D';\n  color: #577ECE;\n}\n.icon-company:before {\n  content: '\\E62D';\n}\n.icon-twitter:before {\n  content: '\\E621';\n  color: #48B3FE;\n}\n.icon-twitter-two:before {\n  content: '\\E6D2';\n}\n.icon-linkedin-two:before {\n  content: '\\E7EA';\n}\n.icon-linkedin:before {\n  content: '\\E616';\n  color: #2991CB;\n}\n.icon-pinterest:before {\n  content: '\\E6FF';\n}\n.icon-pinterest2:before {\n  content: '\\E618';\n}\n.icon-mail:before {\n  content: '\\E614';\n}\n.icon-remark-i:before {\n  content: '\\E643';\n}\n.icon-arrdown:before {\n  content: '\\E608';\n}\n.icon-arrup:before {\n  content: '\\E609';\n}\n.icon-quest:before {\n  content: '\\E6ED';\n}\n.icon-remind:before {\n  content: '\\E601';\n}\n.icon-remind:before {\n  content: '\\E601';\n}\n.icon-addPerson:before {\n  content: '\\E684';\n}\n.icon-pdf:before {\n  content: \"\\E69C\";\n}\n.icon-edit:before {\n  content: \"\\E68A\";\n}\n.el-select .el-input .el-input__icon.el-icon-caret-top {\n  font-family: \"icomoon\" !important;\n  color: #33475B;\n  font-size: 15px;\n}\n.el-select .el-input .el-input__icon.el-icon-caret-top:before {\n  content: '\\E609' !important;\n}\n.icon-add:before {\n  content: '\\E6AD';\n}\n.icon-close:before {\n  content: '\\E6EC';\n}\n.icon-arright:before {\n  content: '\\E613';\n}\n.icon-addthin:before {\n  content: '\\E61E';\n}\n.icon-addcir:before {\n  content: '\\E6DA';\n}\n.icon-add10:before {\n  content: '\\E63A';\n}\n.icon-editor:before {\n  content: '\\E61A';\n}\n.icon-msg-full:before {\n  content: '\\E63C';\n}\n.icon-real-start:before {\n  content: '\\E678';\n}\n.icon-empty-start:before {\n  content: '\\E68F';\n}\n.icon-merge:before {\n  content: '\\E66D';\n}\n.icon-label:before {\n  content: '\\E66B';\n}\n.icon-remove:before {\n  content: '\\E679';\n}\n.icon-exprot:before {\n  content: \"\\E68E\";\n}\n.icon-eye:before {\n  content: \"\\E60C\";\n}\n.icon-pen:before {\n  content: \"\\E68A\";\n}\n.icon-copy:before {\n  content: \"\\E688\";\n}\n.icon-trash:before {\n  content: \"\\E679\";\n}\n.icon-groupsort:before {\n  content: \"\\E667\";\n}\n.icon-menu:before {\n  content: '\\E60B';\n}\n.icon-drag:before {\n  content: '\\E66F';\n}\n.icon-compress:before {\n  content: '\\E625';\n}\n.icon-shape:before {\n  content: '\\E61C';\n}\n.icon-weizhi:before {\n  content: '\\E622';\n}\n.icon-right:before {\n  content: '\\E626';\n}\n.icon-agree:before {\n  content: '\\E60E';\n}\n.icon-replay:before {\n  content: '\\E62F';\n}\n.icon-retweet:before {\n  content: '\\E71A';\n}\n.icon-social:before {\n  content: '\\E633';\n}\n.icon-track:before {\n  content: '\\E635';\n}\n.icon-remark:before {\n  content: '\\E634';\n}\n.icon-adjust:before {\n  content: '\\E683';\n}\n.icon-contact-person:before {\n  content: '\\E689';\n}\n.icon-contact-company:before {\n  content: '\\E638';\n}\n.icon-menugroup:before {\n  content: '\\E664';\n}\n.icon-menuprod:before {\n  content: '\\E687';\n}\n.icon-menupage:before {\n  content: '\\E671';\n}\n.icon-menuorder:before {\n  content: '\\E672';\n}\n.icon-excel:before {\n  content: '\\E61C';\n}\n.icon-file:before {\n  content: '\\E639';\n}\n.icon-smile:before {\n  content: '\\E6C0';\n}\n.icon-fly:before {\n  content: '\\E6BF';\n}\n.icon-funds:before {\n  content: \"\\E693\";\n}\n.icon-social-promotion:before {\n  content: \"\\E67E\";\n}\n.icon-find-client:before {\n  content: \"\\E690\";\n}\n.icon-social:before {\n  content: \"\\E67C\";\n}\n.icon-email:before {\n  content: \"\\E644\";\n}\n.icon-inquiry:before {\n  content: \"\\E63D\";\n}\n.icon-contact-person:before {\n  content: \"\\E689\";\n}\n.icon-gongsi1:before {\n  content: \"\\E638\";\n}\n.icon-mailmarket:before {\n  content: \"\\E6C2\";\n}\n.icon-complete:before {\n  content: \"\\E6C3\";\n}\n.icon-click:before {\n  content: \"\\E6C4\";\n}\n.icon-draft:before {\n  content: \"\\E6C5\";\n}\n.icon-message:before {\n  content: \"\\E6C6\";\n}\n.icon-rendrate:before {\n  content: \"\\E6C7\";\n}\n.icon-pic:before {\n  content: \"\\E6C8\";\n}\n.icon-sendall:before {\n  content: \"\\E6C9\";\n}\n.icon-clickrate:before {\n  content: \"\\E6CA\";\n}\n.icon-planing:before {\n  content: \"\\E6CC\";\n}\n.icon-sended:before {\n  content: \"\\E6CD\";\n}\n.icon-sendfail:before {\n  content: \"\\E6CE\";\n}\n.icon-websitestatic:before {\n  content: \"\\E6CF\";\n}\n.icon-sendrate:before {\n  content: \"\\E6D1\";\n}\n.icon-all:before {\n  content: \"\\E6D4\";\n}\n.icon-websitestyle:before {\n  content: \"\\E6D8\";\n}\n.icon-bgarr:before {\n  content: \"\\E6DB\";\n}\n.icon-zhankaishouqi:before {\n  content: \"\\E652\";\n}\n.icon-adsrukou1:before {\n  content: \"\\E658\";\n}\n.icon-user:before {\n  content: \"\\E680\";\n}\n.icon-addr:before {\n  content: \"\\E641\";\n}\n.icon-fill:before {\n  content: \"\\E691\";\n}\n.icon-user2:before {\n  content: \"\\E6D8\";\n}\n.icon-delete:before {\n  content: \"\\E62C\";\n}\n.icon-tel:before {\n  content: \"\\E676\";\n}\n.icon-alignleft:before {\n  content: \"\\E730\";\n}\n.icon-Shape1:before {\n  content: \"\\E69F\";\n}\n.icon-wenzi:before {\n  content: \"\\E7A0\";\n}\n.icon-list:before {\n  content: \"\\E64C\";\n}\n.icon-link:before {\n  content: \"\\E64E\";\n}\n.icon-unlink:before {\n  content: \"\\E6FE\";\n}\n.icon-table:before {\n  content: \"\\E64F\";\n}\n.icon-iconfresh:before {\n  content: \"\\E749\";\n}\n.icon-hr:before {\n  content: \"\\E64D\";\n}\n.icon-tequan:before {\n  content: \"\\E656\";\n}\n.icon-right-arrow:before {\n  content: \"\\E6A2\";\n}\n.icon-san:before {\n  content: \"\\E6DC\";\n}\n.icon-grouping:before {\n  content: \"\\E6A8\";\n}\n.el-icon-del {\n  font-family: \"icomoon\" !important;\n}\n.el-icon-del:before {\n  content: '\\E602';\n}\nbody {\n  background: #f0f2f3;\n  font-size: 12px;\n  color: #33475B;\n  width: 99vw;\n  padding-top: 60px;\n  box-sizing: border-box;\n}\n@-moz-document url-prefix() {\n  /*Firefox*/\nbody {\n    width: 98vw;\n}\n}\n::-webkit-scrollbar {\n  width: 0.5vw;\n  height: 0.5vw;\n}\n::-webkit-scrollbar-track {\n  background: #f1f1f1;\n}\n::-webkit-scrollbar-track-piece {\n  background-color: #f1f1f1;\n}\n::-webkit-scrollbar-thumb {\n  background: #c1c1c1;\n  border-radius: 4px;\n}\n::-webkit-scrollbar-corner {\n  background: #f1f1f1;\n}\n::-webkit-scrollbar-resizer {\n  background: #f1f1f1;\n}\n.save-btn,\n.cancel-btn {\n  display: inline-block;\n  width: 140px;\n  height: 50px;\n  line-height: 50px;\n  border: 1px solid #CBD6E3;\n  margin: 20px 30px;\n  cursor: pointer;\n  border-radius: 4px;\n  font-size: 16px;\n}\n.cancel-btn {\n  background: white;\n  color: #4F6D95;\n}\n.save-btn {\n  background: #5488F9;\n  color: white;\n}\n.btn-blue.el-button,\n.btn-trans.el-button {\n  margin-top: 5px;\n  min-width: 80px;\n}\n.btn-blue.el-button {\n  padding: 6px 11px;\n}\n.btn-trans.el-button {\n  padding: 6px 11px;\n  color: #4F6D95;\n  border: 1px solid #CBD6E3;\n}\n.btn-trans.el-button:hover {\n  background: #5488F9;\n  color: white;\n}\n.el-button--text:hover {\n  color: #5488F9;\n  text-decoration: underline;\n}\n.logistic-container {\n  width: 100%;\n  margin-top: 20px;\n  padding-bottom: 20px;\n  min-height: 600px;\n  background: white;\n  box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);\n  border-radius: 4px;\n  overflow: hidden;\n  margin-bottom: 30px;\n}\n.fresh-btn.el-button {\n  height: 35px;\n  width: 35px;\n  line-height: 39px;\n  padding: 0;\n  border: 1px solid #CBD6E3;\n  vertical-align: middle;\n}\n.fresh-btn.el-button .icon-fresh {\n  font-size: 20px;\n  color: #B0C1D4;\n  vertical-align: top;\n}\n.fresh-btn.el-button:hover .icon-fresh,\n.fresh-btn.el-button:focus .icon-fresh {\n  color: #5488F9;\n}\n.confirm-btn .el-button {\n  width: 80px;\n  height: 32px;\n  font-size: 13px;\n  border-radius: 4px;\n  padding: 0;\n}\n.confirm-btn .el-button + .el-button {\n  margin-left: 5px;\n}\n.confirm-btn .close {\n  color: #4F6D95;\n  border: none;\n  cursor: pointer;\n}\n.confirm-btn .confirm {\n  color: #fff;\n  font-weight: 300;\n  background: #5488F9;\n  border: none;\n}\n.el-dialog__close.el-icon-close {\n  color: #7C98B6;\n}\n.el-dialog__header .el-dialog__title {\n  font-size: 14px;\n}\n.el-input__inner {\n  height: 34px;\n  border: 1px solid #CBD6E3;\n}\n.size-l {\n  width: 125px;\n  height: 40px;\n}\n.red-tip {\n  color: #F86563;\n}\n.ellipsis {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.no-data {\n  padding-top: 100px;\n  width: 100%;\n  text-align: center;\n}\n.no-data .img {\n  display: inline-block;\n  width: 82px;\n  height: 94px;\n  background: url("+t(107)+') center no-repeat;\n  background-size: 82px 94px;\n}\n.no-data .tips {\n  margin: 15px 0;\n  color: #4F6D95;\n  font-size: 13px;\n}\n.no-data .el-button {\n  margin-top: 25px;\n}\n.el-select .el-input .el-input__inner:hover {\n  border: 1px solid #CBD6E3;\n}\n.el-select .el-input .el-input__inner:focus {\n  border: 1px solid #02AAAA;\n  box-shadow: 0 0 1px 0 #02AAAA;\n}\n.el-input .el-input__inner,\n.blog-right-content .el-textarea .el-input__inner,\n.el-input .el-textarea__inner,\n.blog-right-content .el-textarea .el-textarea__inner {\n  border: 1px solid #CBD6E3;\n}\n.el-input .el-input__inner:hover,\n.blog-right-content .el-textarea .el-input__inner:hover,\n.el-input .el-textarea__inner:hover,\n.blog-right-content .el-textarea .el-textarea__inner:hover,\n.el-input .el-input__inner:focus,\n.blog-right-content .el-textarea .el-input__inner:focus,\n.el-input .el-textarea__inner:focus,\n.blog-right-content .el-textarea .el-textarea__inner:focus {\n  border: 1px solid #02AAAA;\n}\n.el-input .el-input__inner:focus,\n.blog-right-content .el-textarea .el-input__inner:focus,\n.el-input .el-textarea__inner:focus,\n.blog-right-content .el-textarea .el-textarea__inner:focus {\n  border: 1px solid #02AAAA;\n  box-shadow: 0 0 1px 0 #02AAAA;\n}\n.blog-right-content .el-textarea .el-textarea__inner {\n  border: 1px solid #CBD6E3;\n}\n.blog-right-content .el-textarea .el-textarea__inner:hover,\n.blog-right-content .el-textarea .el-textarea__inner:focus {\n  border: 1px solid #02AAAA;\n}\n.blog-right-content .el-textarea .el-textarea__inner:focus {\n  border: 1px solid #02AAAA;\n  box-shadow: 0 0 1px 0 #02AAAA;\n}\n.el-radio .el-radio__inner::after {\n  width: 7px;\n  height: 7px;\n  background-color: #5488F9;\n}\n.el-radio .el-radio__input.is-checked .el-radio__inner {\n  border-width: 2px;\n  background: #fff;\n}\n.el-radio .el-radio__inner,\n.el-radio .el-radio__inner:hover {\n  border-width: 2px;\n}\n.el-checkbox .el-checkbox__inner {\n  width: 16px;\n  height: 16px;\n  border-radius: 1px;\n}\n.el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner {\n  border-color: #5488F9;\n}\n.el-checkbox .el-checkbox__inner:hover {\n  border-width: 2px;\n}\n.el-checkbox .el-checkbox__inner::after {\n  top: -1px;\n  left: 3px;\n}\n.d-size .el-dialog--small {\n  width: 538px;\n}\n.el-input-group .el-input-group__append {\n  background-color: #f5f8fa;\n}\n.el-input-group .el-input-group__append .el-icon-search {\n  font-size: 13.1px;\n  color: #CBD6E2;\n}\n.el-input-group .el-input-group__append .el-icon-search:before {\n  font-family: "icomoon" !important;\n  content: \'\\E6BE\';\n}\n::-webkit-input-placeholder {\n  /* WebKit browsers */\n  color: #cbd6e2!important;\n}\n:-moz-placeholder {\n  /* Mozilla Firefox 4 to 18 */\n  color: #cbd6e2!important;\n}\n::-moz-placeholder {\n  /* Mozilla Firefox 19+ */\n  color: #cbd6e2!important;\n}\n:-ms-input-placeholder {\n  /* Internet Explorer 10+ */\n  color: #cbd6e2!important;\n}\n.el-date-editor ::-webkit-input-placeholder {\n  /* WebKit browsers */\n  color: #4F6D95!important;\n}\n.el-date-editor :-moz-placeholder {\n  /* Mozilla Firefox 4 to 18 */\n  color: #4F6D95!important;\n}\n.el-date-editor ::-moz-placeholder {\n  /* Mozilla Firefox 19+ */\n  color: #4F6D95!important;\n}\n.el-date-editor :-ms-input-placeholder {\n  /* Internet Explorer 10+ */\n  color: #4F6D95!important;\n}\n.el-select ::-webkit-input-placeholder {\n  /* WebKit browsers */\n  color: #33475B!important;\n}\n.el-select :-moz-placeholder {\n  /* Mozilla Firefox 4 to 18 */\n  color: #33475B!important;\n}\n.el-select ::-moz-placeholder {\n  /* Mozilla Firefox 19+ */\n  color: #33475B!important;\n}\n.el-select :-ms-input-placeholder {\n  /* Internet Explorer 10+ */\n  color: #33475B!important;\n}\n.ui-select {\n  appearance: none;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAzklEQVQoU5WRuxGCQBCGd2HE1BIs4WZo4Ax8hBrKGGAHWoEtaAckXGwKBlwDHNKBJRifg+vcjTiKJLfZPr59/IvgaOhYD+5AOFsvAfDQ6GBylcm9byKbRsz3sCqzFO2EcB6dgYDKXKy6gCn2EAsg2quLSCzAeDzygocEpEplYttCNj7UFQCeVJYeTfxzg0n6gb4Rwc50evsFANZlnsZtk5+j7a4I0kCIyAlorHLBv9f8U4ktNtwnKoigfuoB7wrRK6tRrtFD2aea+x9cP/0COOxPDbZ9xqoAAAAASUVORK5CYII=") no-repeat scroll 88% center transparent;\n}\n.el-date-picker .el-date-table td.current:not(.disabled),\n.el-date-editor .el-date-table td.current:not(.disabled),\n.el-date-picker .el-date-table td.start-date,\n.el-date-editor .el-date-table td.start-date,\n.el-date-picker .el-date-table td.end-date,\n.el-date-editor .el-date-table td.end-date {\n  background-color: #0BC !important;\n  color: white!important;\n}\n.el-date-picker .el-date-table td.in-range,\n.el-date-editor .el-date-table td.in-range {\n  background-color: #ccf0f4;\n}\n.el-date-picker .el-date-table td.today,\n.el-date-editor .el-date-table td.today {\n  color: #0BC;\n}\n.el-date-picker .el-date-table .today.start-date,\n.el-date-editor .el-date-table .today.start-date,\n.el-date-picker .el-date-table .today.end-date,\n.el-date-editor .el-date-table .today.end-date {\n  color: #fff;\n}\n.el-date-picker .el-date-table td.today:before,\n.el-date-editor .el-date-table td.today:before {\n  border-top-color: #0BC;\n}\n.el-date-picker .el-date-picker__header-label:hover,\n.el-date-editor .el-date-picker__header-label:hover {\n  color: #0BC;\n}\n.el-date-editor .el-icon-date:before {\n  font-family: "icomoon" !important;\n  content: \'\\E685\';\n  font-size: 12px;\n  color: #CBD6E3;\n}\ndiv.el-tooltip__popper.is-dark {\n  background-color: #415b77;\n}\ndiv.el-tooltip__popper.is-dark .popper__arrow::after {\n  border-bottom-color: #415b77;\n  border-top-color: #415b77;\n}\n.el-checkbox .el-checkbox__input {\n  line-height: 1 !important;\n}\n.el-checkbox .el-checkbox__inner {\n  border: 2px solid #bfc4d9;\n  border-radius: 2px;\n}\n.el-select .resize-triggers > div {\n  overflow: hidden;\n}\n.loading-image {\n  position: relative;\n  display: inline-block;\n  margin-bottom: 15px;\n  margin-right: 10px;\n  width: 85px;\n  height: 85px;\n  background: #cbd6e2;\n  vertical-align: top;\n}\n.loading-image .img-load {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  margin: -19px 0 0 -19px;\n  border-color: #CBD6E2;\n  border-top-color: white;\n}\n.load-center {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n}\n.loaders .loader {\n  box-sizing: border-box;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  max-width: 100%;\n}\n.ball-pulse-sync > div:nth-child(0) {\n  -webkit-animation: ball-pulse-sync 0.6s 0s infinite ease-in-out;\n  animation: ball-pulse-sync 0.6s 0s infinite ease-in-out;\n}\n.ball-pulse-sync > div:nth-child(1) {\n  -webkit-animation: ball-pulse-sync 0.6s 0.07s infinite ease-in-out;\n  animation: ball-pulse-sync 0.6s 0.07s infinite ease-in-out;\n}\n.ball-pulse-sync > div:nth-child(2) {\n  -webkit-animation: ball-pulse-sync 0.6s 0.14s infinite ease-in-out;\n  animation: ball-pulse-sync 0.6s 0.14s infinite ease-in-out;\n}\n.ball-pulse-sync > div:nth-child(3) {\n  -webkit-animation: ball-pulse-sync 0.6s 0.21s infinite ease-in-out;\n  animation: ball-pulse-sync 0.6s 0.21s infinite ease-in-out;\n}\n.ball-pulse-sync > div {\n  background-color: #fff;\n  width: 5px;\n  height: 5px;\n  border-radius: 100%;\n  margin: 2px;\n  -webkit-animation-fill-mode: both;\n  animation-fill-mode: both;\n  display: inline-block;\n}\n@-webkit-keyframes ball-pulse-sync {\n33% {\n    -webkit-transform: translateY(10px);\n    transform: translateY(10px);\n}\n66% {\n    -webkit-transform: translateY(-10px);\n    transform: translateY(-10px);\n}\n100% {\n    -webkit-transform: translateY(0);\n    transform: translateY(0);\n}\n}\n@keyframes ball-pulse-sync {\n33% {\n    -webkit-transform: translateY(10px);\n    transform: translateY(10px);\n}\n66% {\n    -webkit-transform: translateY(-10px);\n    transform: translateY(-10px);\n}\n100% {\n    -webkit-transform: translateY(0);\n    transform: translateY(0);\n}\n}\n.el-table .el-table__header-wrapper thead div,\n.el-table .el-table__fixed-header-wrapper thead div {\n  color: #33475b;\n}\n.el-table .el-table__body-wrapper .el-table__body tr:hover > td {\n  background-color: #F5F8FA;\n}\ndiv.el-table {\n  font-size: 13px;\n}\n.el-select-dropdown {\n  border-radius: 4px;\n}\n.el-select-dropdown .el-select-dropdown__item {\n  padding-left: 10px;\n}\n.el-select-dropdown .el-select-dropdown__item:hover {\n  background-color: #f4f6f8;\n}\n.el-select-dropdown .el-select-dropdown__item.hover {\n  background-color: #f4f6f8;\n}\n.el-select-dropdown .el-select-dropdown__item.selected {\n  color: #33475B;\n  background-color: #e6f8fa;\n}\n.el-select-dropdown .el-select-dropdown__item.selected.hover {\n  background-color: #e6f8fa;\n}\nul.el-select-dropdown__list {\n  padding: 0;\n}\n.el-input-group--append {\n  overflow: hidden;\n}\n.el-popover {\n  word-break: break-all;\n}\n@keyframes loadingColor {\n0% {\n    opacity: 1;\n}\n50% {\n    opacity: 0.4;\n}\n100% {\n    opacity: 1;\n}\n}\n@-webkit-keyframes loadingColor {\n0% {\n    opacity: 1;\n}\n50% {\n    opacity: 0.4;\n}\n100% {\n    opacity: 1;\n}\n}\n.el-button.is-disabled,\n.el-button.is-disabled:hover {\n  background: #EAF0F6!important;\n  border: 1px solid #DFE3EB!important;\n  color: #B0C1D4!important;\n}\n.container-1200 {\n  margin: 68px auto 0 auto;\n  width: 1200px;\n}\n.left-back {\n  width: 18px;\n  margin-right: 8px;\n}\n.inner-top {\n  position: absolute;\n  margin-top: -35px;\n  margin-bottom: 20px;\n}\n.inner-top a {\n  font-size: 14px;\n  color: #7C98B6;\n}\n.inner-top i {\n  color: #7C98B6;\n  font-weight: bold;\n  font-size: 18px;\n  margin-right: 10px;\n}\n.blog-seo-feature {\n  display: inline-block;\n  margin-right: 13px;\n  padding: 0 7px;\n  height: 28px;\n  line-height: 28px;\n  font-size: 13px;\n  color: #00B8CC;\n  background-color: rgba(204, 240, 244, 0.8);\n  border-radius: 4px;\n  cursor: pointer;\n}\n.icon-buttons {\n  background: #fff;\n  height: 28px;\n  line-height: 29px;\n  display: inline-block;\n  border: 1px solid #CBD6E3;\n  border-radius: 4px;\n}\n.icon-buttons .icon-button {\n  border-left: 1px solid #CBD6E3;\n  display: inline-block;\n}\n.icon-buttons .icon-button:first-child {\n  border-left: none;\n}\nhtml body {\n  padding-top: 50px;\n}\n.mailDetail-container {\n  width: 1200px;\n  margin: 0 auto 30px;\n}\n.mailDetail-container i {\n  cursor: pointer;\n}\n.mailDetail-container .back-title {\n  font-size: 14px;\n  padding: 30px 0 16px;\n  line-height: 18px;\n  cursor: pointer;\n}\n.mailDetail-container .back-title i {\n  font-size: 18px;\n  font-weight: bolder;\n  vertical-align: text-top;\n  color: #B0C1D4;\n}\n.mailDetail-container .back-title span {\n  font-size: 13px;\n  color: #7C98B6;\n}\n.mailDetail-container .mailDetail-section {\n  width: 1200px;\n  padding: 30px 20px 50px;\n  border-radius: 4px;\n  background: #fff;\n  box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);\n  box-sizing: border-box;\n}\n.mailDetail-container .mailDetail-section .head-section {\n  overflow: hidden;\n  position: relative;\n  padding: 0 20px;\n}\n.mailDetail-container .mailDetail-section .head-section img {\n  float: left;\n  width: 50px;\n  height: 50px;\n  margin-right: 8px;\n  border-radius: 50%;\n}\n.mailDetail-container .mailDetail-section .head-section p.personName {\n  overflow: hidden;\n  line-height: 25px;\n  margin-top: 1px;\n  margin-bottom: 4px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: #33475B;\n  font-size: 18px;\n  font-weight: bolder;\n}\n.mailDetail-container .mailDetail-section .head-section p.personName.hasCompany {\n  margin-bottom: 0;\n  line-height: 50px;\n}\n.mailDetail-container .mailDetail-section .head-section p.company {\n  overflow: hidden;\n  line-height: 18px;\n  color: #4F6D95;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 13px;\n}\n.mailDetail-container .mailDetail-section .head-section p.single {\n  font-size: 18px;\n  font-weight: bolder;\n  line-height: 50px;\n}\n.mailDetail-container .mailDetail-section .head-section .el-button {\n  position: absolute;\n  top: 8px;\n  right: 20px;\n  width: 110px;\n  height: 34px;\n  line-height: 34px;\n  padding: 0;\n  font-size: 13px;\n  font-weight: 300;\n  background: #5488F9;\n  border: none;\n}\n.mailDetail-container .mailDetail-section .head-section .el-button span {\n  color: #fff;\n}\n.mailDetail-container .mailDetail-section .head-section .el-button:hover {\n  background: #76a0fa;\n}\n.mailDetail-container .mailDetail-section .head-section .el-button i {\n  margin-right: 4px;\n}\n.mailDetail-container .mailDetail-section .mail-detail {\n  margin: 16px 0 24px;\n  padding: 24px 20px;\n  border-top: 3px solid #DFE3EB;\n  background: #F5F8FA;\n}\n.mailDetail-container .mailDetail-section .mail-detail .subject-title {\n  line-height: 30px;\n  margin-bottom: 15px;\n  font-size: 22px;\n  color: #33475B;\n}\n.mailDetail-container .mailDetail-section .mail-detail .mail-item {\n  margin-top: 8px;\n  font-size: 13px;\n  line-height: 18px;\n  color: #4F6D95;\n}\n.mailDetail-container .mailDetail-section .mail-detail .mail-item p {\n  display: inline-block;\n  width: 53px;\n}\n.mailDetail-container .mailDetail-section .mail-detail .mail-item i {\n  font-size: 14px;\n}\n.mailDetail-container .mailDetail-section .mail-detail .mail-item i.attach {\n  color: #FFA726;\n}\n.mailDetail-container .mailDetail-section .mail-detail .mail-item a {\n  margin-right: 12px;\n  color: #5488F9;\n}\n.mailDetail-container .mailDetail-section .mail-detail .mail-item .attach-buffer {\n  display: inline-block;\n  width: 200px;\n  height: 18px;\n  vertical-align: text-top;\n  background: #EAF0F6;\n  animation: loadingColor 1s infinite;\n  -webkit-animation: loadingColor 1s infinite;\n  -moz-animation: loadingColor 1s infinite;\n  -ms-animation: loadingColor 1s infinite;\n  -o-animation: loadingColor 1s infinite;\n}\n.mailDetail-container .mailDetail-section .mail-content {\n  line-height: 18px;\n  padding: 0 20px;\n  font-size: 13px;\n  color: #33475B;\n}\n.mailDetail-container .mailDetail-section .mail-content img {\n  max-width: 1118px;\n}\n.mailDetail-container .mailDetail-section .loading {\n  margin: 150px auto 130px;\n}\n.mailDetail-container .add-dialog .el-dialog {\n  width: 500px;\n}\n.mailDetail-container .add-dialog .el-dialog__header {\n  border: none;\n  padding: 25px 20px;\n  background: #5488F9;\n}\n.mailDetail-container .add-dialog .el-dialog__header span {\n  color: #fff;\n  font-size: 20px;\n}\n.mailDetail-container .add-dialog .el-dialog__header .el-dialog__close {\n  font-size: 16px;\n  color: #fff;\n}\n.mailDetail-container .add-dialog .el-dialog__body {\n  padding: 30px 40px 20px;\n}\n.mailDetail-container .add-dialog .el-dialog__body .el-form-item {\n  margin-bottom: 20px;\n}\n.mailDetail-container .add-dialog .el-dialog__body .el-form-item input {\n  height: 40px;\n}\n.mailDetail-container .add-dialog .el-dialog__footer {\n  padding: 21px 30px 30px 40px;\n  text-align: left;\n  background: #F5F8FA;\n  border-top: 1px solid #CBD6E2;\n}\n.mailDetail-container .add-dialog .el-dialog__footer .add-btn {\n  padding: 16px 53px;\n}\n.mailDetail-container .add-dialog .el-dialog__footer .add-btn span {\n  font-size: 16px;\n}\n',""])},1598:function(n,e,t){n.exports={render:function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{staticClass:"mailDetail-container"},[t("div",{staticClass:"back-title",on:{click:n.backMailList}},[n._m(0),n._v(" "),t("span",[n._v("返回收件箱")])]),n._v(" "),n.detailLoad?n._e():t("div",{staticClass:"mailDetail-section"},[n.item.sender?t("div",{staticClass:"head-section"},[n.item.sender.companyId?n._e():t("img",{attrs:{src:n.item.sender.avatar||n.defaultPhoto,onerror:"javascript:this.src='/static/img/default_avatar.jpg'"}}),n._v(" "),n.item.sender.companyId?t("img",{attrs:{src:n.item.sender.avatar||n.companyPhoto,onerror:"javascript:this.src='/static/img/default_company.png'"}}):n._e(),n._v(" "),n.item.sender.personId?t("p",{staticClass:"personName",attrs:{title:n.item.sender.name}},[n._v(n._s(n.item.sender.name))]):n._e(),n._v(" "),n.item.sender.personId?t("p",{staticClass:"company",attrs:{title:n.item.sender.companyName}},[n._v(n._s(n.item.sender.companyName||"-"))]):n._e(),n._v(" "),n.item.sender.companyId?t("p",{staticClass:"single",attrs:{title:n.item.sender.companyName}},[n._v(n._s(n.item.sender.companyName))]):n._e(),n._v(" "),n.item.sender.personId||n.item.sender.companyId?n._e():t("p",{staticClass:"single",attrs:{title:n.item.sender.email}},[n._v(n._s(n.item.sender.email))]),n._v(" "),n.item.sender.personId||n.item.sender.companyId?t("el-button",{on:{click:function(e){n.replyMail(n.item)}}},[n._v("回复")]):t("el-button",{on:{click:function(e){n.showAddDialog(n.item)}}},[t("i",{staticClass:"icon-font"},[n._v("")]),n._v("添加")])],1):n._e(),n._v(" "),t("div",{staticClass:"mail-detail"},[t("b",{staticClass:"subject-title"},[n._v(n._s(n.item.subject))]),n._v(" "),t("div",{staticClass:"mail-item"},[t("p",[n._v("收件人：")]),n._v(" "),t("span",[n._v(n._s(n.item.to))])]),n._v(" "),n.item.sentTime?t("div",{staticClass:"mail-item"},[t("p",[n._v("时间：")]),n._v(" "),t("span",[n._v(n._s(n._f("time-formater-no-second")(n.item.sentTime)))])]):n._e(),n._v(" "),n.item.cc?t("div",{staticClass:"mail-item"},[t("p",[n._v("抄送：")]),n._v(" "),t("span",[n._v(n._s(n.item.cc))])]):n._e(),n._v(" "),n.item.bcc?t("div",{staticClass:"mail-item"},[t("p",[n._v(n._s(n.item.bcc))])]):n._e(),n._v(" "),n.item.withAttach?t("div",{staticClass:"mail-item"},[t("p",[n._v("附件：")]),n._v(" "),n._l(n.attachmentList,function(e){return n.attachLoad?n._e():t("span",[t("i",{staticClass:"icon-font attach"},[n._v("")]),n._v(" "),t("a",{attrs:{href:e.source,target:"_blank"}},[n._v(n._s(e.filename))])])}),n._v(" "),n.attachLoad?t("span",{staticClass:"attach-buffer"}):n._e()],2):n._e()]),n._v(" "),t("div",{ref:"mailContent",staticClass:"mail-content",domProps:{innerHTML:n._s(n.item.textHtml||n.item.textPlain||n.item.text)}})]),n._v(" "),n.detailLoad?t("div",{staticClass:"mailDetail-section"},[t("div",{staticClass:"loading loading-circle"})]):n._e(),n._v(" "),t("el-dialog",{staticClass:"add-dialog",attrs:{title:"新增联系人"},on:{close:n.closeAddPerson},model:{value:n.dialogAddPerson,callback:function(e){n.dialogAddPerson=e},expression:"dialogAddPerson"}},[t("el-form",{ref:"rulePersonForm",attrs:{"label-position":"top",model:n.rulePersonForm,rules:n.rules}},[t("el-form-item",{attrs:{label:"First Name",prop:"firstName"}},[t("el-input",{model:{value:n.rulePersonForm.firstName,callback:function(e){n.rulePersonForm.firstName=e},expression:"rulePersonForm.firstName"}})],1),n._v(" "),t("el-form-item",{attrs:{label:"Last Name"}},[t("el-input",{model:{value:n.rulePersonForm.lastName,callback:function(e){n.rulePersonForm.lastName=e},expression:"rulePersonForm.lastName"}})],1),n._v(" "),t("el-form-item",{attrs:{label:"职位"}},[t("el-input",{model:{value:n.rulePersonForm.position,callback:function(e){n.rulePersonForm.position=e},expression:"rulePersonForm.position"}})],1),n._v(" "),t("el-form-item",{attrs:{label:"Email",prop:"email"}},[t("el-input",{model:{value:n.rulePersonForm.email,callback:function(e){n.rulePersonForm.email=e},expression:"rulePersonForm.email"}})],1)],1),n._v(" "),t("span",{staticClass:"add-dialog-footer",slot:"footer"},[t("el-button",{staticClass:"add-btn",attrs:{type:"primary",disabled:!n.rulePersonForm.firstName||n.personError},on:{click:n.addPerson}},[n._v("新增")]),n._v(" "),t("el-button",{staticClass:"add-btn",on:{click:n.closeAddPerson}},[n._v("取 消")])],1)],1)],1)},staticRenderFns:[function(){var n=this,e=n.$createElement,o=n._self._c||e;return o("span",[o("img",{staticClass:"left-back",attrs:{src:t(447)}})])}]},n.exports.render._withStripped=!0},1782:function(n,e,t){var o=t(1288);"string"==typeof o&&(o=[[n.i,o,""]]),o.locals&&(n.exports=o.locals);t(105)("6fda7c44",o,!1)},389:function(n,e,t){t(1782);var o=t(106)(t(1082),t(1598),null,null);o.options.__file="D:\\B2Bseller4.0\\b2b-seller4.0\\src\\views\\mail\\mailDetail.vue",o.esModule&&Object.keys(o.esModule).some(function(n){return"default"!==n&&"__esModule"!==n}),o.options.functional,n.exports=o.exports},431:function(n,e,t){n.exports={default:t(438),__esModule:!0}},438:function(n,e,t){var o=t(9),i=o.JSON||(o.JSON={stringify:JSON.stringify});n.exports=function(n){return i.stringify.apply(i,arguments)}},447:function(n,e){n.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAaCAMAAADsW95KAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0ZGNTYxNkQ1NjM2MTFFNzk3RTA4OTZBOUIwRjBGQUUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0ZGNTYxNkU1NjM2MTFFNzk3RTA4OTZBOUIwRjBGQUUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozRkY1NjE2QjU2MzYxMUU3OTdFMDg5NkE5QjBGMEZBRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozRkY1NjE2QzU2MzYxMUU3OTdFMDg5NkE5QjBGMEZBRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnzEDXEAAADeUExURXyYtoCbuNjh6u/y9n6at3+at97l7Njg6dTd54ukv8vW4oKcuevw9Onu89fg6cHO3Iylv4qjvsfT4IKduH6Zt8DO3IOeuczX4+rv9ISeudzk67LD1IOduZqvx4mjvcHP3e7y9oOeutri6oSeu9Xe6JOqw3+auIGcufj6+9Pd54iivcjU4MnV4dvj6/j5+/H09+Lo74GbuJmvxsDN3Nnh6tni6rHC0+fs8o2mwObs8dbf6Ozw9J+zyeDn7oafutjh6X+att/m7dzj69/l7cnV4IGcuJSrw+jt8q6/0v////u8mUoAAABKdFJOU/////////////////////////////////////////////////////////////////////////////////////////////////8AWiu/GwAAAMhJREFUeNqM08dWAkEURdFTSDciQURRwSxmMYuYwez9/x+yHMlA+vYZ1WCv99YbFBrrlUf9H2Pv82c+PXtqszBt2dsixUM5lq6STJr1x9J59nbkWKdCuJdjJx+EuhzbviAU5Nh1YL8vx0qBrVSODUewdDCV1eYp7xUodkNmSZkVcpSg2Tit+VIqZFSvxhNasHtmT5A24PbBs9+9japn+o5u2TPdQLnmma5gruaZmtF9eaZjWB94ph4c3eX4gDOwloNFdzmB/QgwAG3L3PVx+9w+AAAAAElFTkSuQmCC"},744:function(n,e,t){"use strict";var o=t(13),i={getMailList:function(n){return o.a.post("https://server.onloon.com.cn/bshop/inbox/mail/page",n)},getMailDetail:function(n){return o.a.post("https://server.onloon.com.cn/bshop/inbox/mail/detail",n)},readMail:function(n){return o.a.post("https://server.onloon.com.cn/bshop/inbox/mail/read",n)},getAttachment:function(n){return o.a.post("https://server.onloon.com.cn/bshop/inbox/mail/get/attachment",n)},getChannelList:function(n){return o.a.get("https://server.onloon.com.cn/bshop/channel/shop/list",n)},addPerson:function(n){return o.a.post("https://server.onloon.com.cn/bshop/contacts/person/add",n)}};e.a=i}});
//# sourceMappingURL=53.6d561152c9ef54fd67b9.js.map