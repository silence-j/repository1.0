<template>
  <div>
    <div class="ads-tip" v-show="adsEnter">
      获取海量精准用户、大量询盘，ADS平台带你开启外贸流量大门
      <a :href="adsUrl+adsToken" target="_blank">
        <span class="use-ads">
        快来体验吧
      </span>
      </a>
      <i class="icon-font del-ads" @click="closeAds">&#xe62c;</i>
    </div>
    <div class="probation" v-show="probation">
    试用到期时间 : {{probationDate | time-formater-no-hour}},  请联系0571-5658  1798开通正式服务
    </div>
    <div class="helper-down">
      <el-tooltip popper-class="helper-down-tip" effect="dark"  placement="left-start">
        <div slot="content">
          <p class="tit-tip">点击安装 盈店小助手</p>
          <p class="fb-tip">安装后一键导入Facebook好友</p>
          <p class="chrome-tip">请使用Chrome浏览器</p>
        </div>
        <a href="https://chrome.google.com/webstore/detail/%E7%9B%88%E5%BA%97%E5%8A%A9%E6%89%8B/jbmgeokjjidieoppjegcdmmhpflmeijm/related?hl=zh-CN" target="_blank"><img src="../../assets/img/index/helper2.png" alt=""></a>
      </el-tooltip>
    </div>
    <!--流量概览模块-->
    <div class="flow-browse">
      <div class="flow-title">
        <!--<a href="" class="title">流量概览</a>-->
        <router-link :to="{path: 'webCount'}"><span class="title">流量概览</span></router-link>
        <div class="fr">
          <div @click="changeFlowDays(7)" class="flow-recent" :class="{'selected': flowDays === 7}">最近7天</div>
          <div @click="changeFlowDays(30)" class="flow-recent" :class="{'selected': flowDays === 30}">最近30天</div>
        </div>
      </div>
      <div class="flow-data" v-if="isLoading.flowLoading">
        <li><p class="data-loading"></p><p class="name">浏览次数(PV)</p><span class="line"></span></li>
        <li><p class="data-loading"></p><p class="name">独立访客(UV)</p><span class="line"></span></li>
        <li><p class="data-loading"></p><p class="name">平均访问时长(时:分:秒)</p><span class="line"></span></li>
        <li><p class="data-loading"></p><p class="name">平均浏览页数</p><span class="line"></span></li>
        <li><p class="data-loading"></p><p class="name">询盘量</p></li>
      </div>
      <div class="flow-data" v-if="!isLoading.flowLoading">
        <li><p class="data">{{pvVal}}</p><p class="name">浏览次数(PV)</p><span class="line"></span></li>
        <li><p class="data">{{uvVal}}</p><p class="name">独立访客(UV)</p><span class="line"></span></li>
        <li><p class="data">{{avgTime | time-formater-second-hour}}</p><p class="name">平均访问时长(时:分:秒)</p><span class="line"></span></li>
        <li><p class="data">{{avgPage}}</p><p class="name">平均浏览页数</p><span class="line"></span></li>
        <li><p class="data">{{quiryCount}}</p><p class="name">询盘量</p></li>
      </div>
    </div>
    <div class="view-container">
      <!-- 网站统计模块 -->
      <div class="web-info">
        <div class="block-title">
          <router-link :to="{path: 'webCount'}">网站统计</router-link>
          <el-tooltip class="item" effect="dark" content="统计您网站的流量" placement="top">
            <span class="icon-font title-icon">&#xe65b;</span>
          </el-tooltip>
          <div class="fr">
            <div @click="changeStaticsDays(7)" class="condition-day" :class="{'selected': webStaticDays === 7}">最近7天</div>
            <div @click="changeStaticsDays(30)" class="condition-day" :class="{'selected': webStaticDays === 30}">
              最近30天
            </div>
          </div>
        </div>
        <div class="text-loadding" v-if="isLoading.webStatics">
          <div class="block-title" style="overflow:hidden;">
            <span class="loading-title"></span>
            <div class="fr">
              <div  class="condition-day" ></div>
              <div class="condition-day"></div>
            </div>
          </div>
          <div>
            <div class="static-item">
              <div class="static-title"></div>
              <div class="static-content"></div>
            </div>
            <div class="static-item">
              <div class="static-title"></div>
              <div class="static-content"></div>
            </div>
            <div class="static-chart"></div>
            <div class="static-chart"></div>
          </div>
        </div>
        <div class="static-all clearfix" v-if="!isLoading.webStatics">
          <div><label>访问</label><p>{{webStatics.uv}}</p></div>
          <div class="static-mid"><label>{{webStatics.conversionRate}} %</label><i class="icon-bgarr"></i></div>
          <div><label>询盘</label><p>{{webStatics.msgProductCount}}</p></div>
        </div>
        <div class="static-wraper" v-show="!isLoading.webStatics">
          <div id="web-chart" class="static-chart"></div>
          <div id="web2-chart" class="static-chart"></div>
        </div>
      </div>
      <!-- 当前在线模块 -->
      <div class="inquire-customer">
        <div class="block-title">
          当前在线
          <span class="small-tip">（{{sixty}}s后更新数据）</span>
        </div>
        <div class="text-loadding" v-if="isLoading.currOnline">
          <div class="block-title" style="overflow:hidden;">
            <span class="loading-title"></span>
          </div>
          <div class="curr-static">
            <em></em>
            <span></span>
            <p></p>
          </div>
          <div class="lastest-15">
            <p></p>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="curr-static" v-else>
          <em>最近1分钟({{currOnlineData.lastMinute}})</em>
          <span>您网站上有<i class="big-num">{{currOnlineData.uv}}</i>位独立访客</span>
          <p class="curr-static-high"><span>今日最高：<i>{{currOnlineData.maxUv}}</i>（发生时间:  {{currOnlineData.maxUvTime?currOnlineData.maxUvTime.split(' ')[1]: ''}}）</span></p>
        </div>
        <div class="lastest-15" v-if="!isLoading.currOnline">
          <p class="tiny-tit">最近15分钟</p>
          <span>浏览次数：<em>{{currOnlineData.pvInLastXmin}}</em></span>
          <span>独立访客：<em>{{currOnlineData.uvInLastXmin}}</em></span>
          <span>IP：<em>{{currOnlineData.ipInLastXmin}}</em></span>
        </div>
      </div>
      <!--商机推荐start-->
      <div class="chance_recommend_list margin-top16 home-chance" v-if="chanceList.length>0 && ChanceRight() && serverLevel=='1'">
        <div class="block-title">
          商机推荐
          <div class="fr"><router-link to="/enquiriesIndex"><div class="condition-day view-more">查看更多 &gt;&gt;</div></router-link></div>
        </div>
        <ChanceCarouselTwo :chanceList="chanceList" @updatePie="pieCount"></ChanceCarouselTwo>
      </div>
      <!--商机推荐end-->
      <!--最近客户动态模块-->
      <div class="dynamic">
        <div class="loading-dy" v-if="isLoading.dynamic">
          <div class="loading-title"></div>
          <div class="loading-div"></div>
          <div class="loading-div"></div>
          <div class="loading-div"></div>
          <div class="loading-div"></div>
          <div class="loading-div"></div>
          <div class="loading-div"></div>
        </div>
       <div v-if="!isLoading.dynamic && dynamicPage.totalCount > 0">
         <div class="d-name">最近客户动态</div>
         <div class="d-data">
           <div class="d-title">
             <li class="recently">最近动态</li>
             <li class="name">姓名</li>
             <li class="time">时间</li>
           </div>
           <div class="d-list" v-for="item in dynamicData">
             <li class="recently" @click="toContactIt(item.contactId)">
               <!--邮件追踪-->
               <span v-if="item.socialType === 0">
                 <span v-if="item.socialContent.mailMarketingFlag && item.socialContent.trackType === 0">
                   <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 打开了营销邮件 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.emailTitle}}</span>
                 </span>
                 <span v-if="item.socialContent.mailMarketingFlag && item.socialContent.trackType === 1">
                   <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 点击了营销邮件中的链接 <span class="textColor" :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.emailTitle}}</span>
                 </span>
                 <span v-if="item.socialContent.mailMarketingFlag === false && item.socialContent.trackType === 0">
                   <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 打开了邮件 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.emailTitle}}</span>
                 </span>
                 <span v-if="item.socialContent.mailMarketingFlag === false && item.socialContent.trackType === 1">
                   <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 点击了邮件中的链接 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.emailTitle}}</span>
                 </span>
               </span>
               <!--邮件收发(发邮件)-->
               <span v-if="item.socialType===1&&(item.socialContent).emailType==1">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你</span> 发送了一封邮件给 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{(item.socialContent).contactName}}（{{(item.socialContent).contactEmail}}）</span>
               </span>
               <!--邮件收发(收邮件)-->
               <span v-if="item.socialType===1&&(item.socialContent).emailType==0">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你</span> 收到了一封邮件来自 <span class="textColor">{{(item.socialContent).contactName}}（{{(item.socialContent).contactEmail}}）</span>
               </span>
               <!--社交信息（facebook）-->
               <span v-if="item.socialType===2&&item.socialContent.actionType===2&&(item.socialContent.source===1||item.socialContent.source===2)">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'"><em class="icon-font icon-facebook"></em> {{item.firstName}}{{item.lastName}}</span>  在Facebook上给你发了1条私信
               </span>
               <!--社交信息（twitter@提到）-->
               <span v-if="item.socialType===2&&item.socialContent.source===3&&(item.socialContent.bindingAccount === item.socialContent.receiverId)">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'"><span class="icon-font" style="color:#48B3FE;">&#xe6d2;</span> {{item.firstName}}{{item.lastName}}(@{{item.socialContent.senderAccountName || ''}})</span> 在Twitter上@了
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你 (@{{item.socialContent.receiverAccountName}})</span>
               </span>
               <!--社交信息(我 @ 提到别人)-->
               <span v-if="item.socialType===2&&item.socialContent.source===3&&(item.socialContent.bindingAccount === item.socialContent.senderId)&&(item.socialContent.senderId!==item.socialContent.receiverId)">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你 (@{{item.socialContent.senderAccountName}})</span> 在Twitter上@了
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}(@{{item.socialContent.receiverAccountName || ''}})</span>
               </span>
               <!--社交信息（twitter私信 对方发我）-->
               <span v-if="item.socialType===2&&item.socialContent.source===4&&item.socialContent.bindingAccount === item.socialContent.receiverId">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">
                   <span class="icon-font" style="color:#48B3FE;">&#xe6d2;</span> {{item.firstName}}{{item.lastName}}(@{{item.socialContent.senderAccountName || ''}})</span>
                 <span> 在Twitter上给 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你(@{{item.socialContent.receiverAccountName}})</span> 发了一条私信</span>
               </span>
               <!--社交信息 (twitter私信 我发对方)-->
               <span v-if="item.socialType===2&&item.socialContent.source===4&&item.socialContent.bindingAccount === item.socialContent.senderId">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你 (@{{item.socialContent.senderAccountName}})</span> 在Twitter上给
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}(@{{item.socialContent.receiverAccountName}})</span> 发了一条私信
               </span>
               <!--询盘信息-->
               <span v-if="item.socialType === 3">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.detail.firstName}}{{item.socialContent.detail.lastName}}</span> 在 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.source}}</span> 提交了一份询盘
               </span>
               <!--备注-->
               <span v-if="item.socialType === 4">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你</span> 记录了一份关于 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.contactName}}</span> 的备注
               </span>
               <!--合并记录-->
               <span v-if="item.socialType === 5">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.newName}}</span> 与 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.oldName}}（{{item.socialContent.oldEmail}}）</span> 合并
               </span>
               <!--阶段变更-->
               <span v-if="item.socialType === 6">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.contactName}}</span> 状态更改为 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.status | stageFilter}}</span>
               </span>
               <!--系统消息-->
               <span v-if="item.socialType === 7">
                 <span v-if="item.socialContent.commercialOpportunityFlag">
                   <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span>
                   通过商机推荐被创建
                 </span>
                 <span v-else>
                   <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span>
                   通过
                   <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.createSource}}</span>
                   被创建
                 </span>
               </span>
               <!--海关信息-->
               <span v-if="item.socialType === 8">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 有一条海关数据
               </span>
               <!--联系人待补全消息-->
               <span v-if="item.socialType === 9">
                 <span>多个数据字段有更新数据</span>
               </span>
               <!--联系人已补全消息-->
               <span v-if="item.socialType === 10">
                 <span>多个数据字段补充完成</span>
               </span>
               <!--访问了官网-->
               <span v-if="item.socialType === 11">
                 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 访问了官网
               </span>
             </li>
             <li class="name" @click="toContactIt(item.contactId)">{{item.firstName}}{{item.lastName}}</li>
             <li class="time">{{item.createTime | time-formater-no-second}}</li>
           </div>
           <div class="dynamic-page page-center" v-if="dynamicPage.totalCount > 5">
             <el-pagination
               small
               layout="prev, pager, next"
               @current-change="dynamicPageChange"
               :current-page="dynamicPage.page"
               :page-size="dynamicPage.pageSize"
               :total="dynamicPage.totalCount">
             </el-pagination>
           </div>
         </div>
       </div>
      </div>
      <!--客户唤醒模块-->
      <div class="recommend-block lead-box" v-if="wakeList.length !== 0">
        <div class="text-loadding text-load" v-if="isLoading.wake">
          <div class="block-title" style="overflow:hidden;">
            <span class="loading-title"></span>
          </div>
          <div class="recommend-item" v-for="i in [1,2,3,4]">
            <div class="r-head">
            </div>
            <div class="r-info">
              <div class="r-name"  >
              </div>
              <div class="r-about" >
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="block-title">
            客户唤醒
          </div>
          <div class="recommends">
            <a href="javascript:;" class="recommend-item" v-for="(rItem,rIndex) in wakeList">
              <div class="r-head">
                <img :src="rItem.avatar||'/static/img/default.png'" width="100%">
                <!--<img v-else :src="rItem.avatar||'/static/img/default_comp.png'" width="100%">-->
              </div>
              <div class="r-info">
                <div class="r-name">
                  <span class="wake-name">{{rItem.firstName}}{{rItem.lastName}}</span>
                  <i class="wake-line"></i>
                  <span class="wake-company" v-if="rItem.companyName !== null">{{rItem.companyName}}</span>
                </div>
                <div class="wake-day">
                  距离上次互动已过去 <span>{{rItem.count}}</span> 天
                </div>
              </div>
              <div class="r-icons">
                <a class="operation" @click="toContact(rItem.id)">联系</a><a class="operation" @click="ignoreIt(rItem.id, rIndex)">忽略</a>
              </div>
            </a>
            <div class="page-center" v-if='wakePage.totalCount > 4' style="padding-bottom: 22px">
              <el-pagination
                small
                layout="prev, pager, next"
                @current-change="wakePageChange"
                :current-page="wakePage.page"
                :page-size="wakePage.pageSize"
                :total="wakePage.totalCount">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>>
      <!-- 客户来源统计模块 -->
      <div class="web-info client-source">
        <div class="block-title">
          客户来源统计
          <div class="fr">
            <div class="condition-day">2017.7.25 — 至今</div>
          </div>
        </div>
        <div class="static-wraper clearfix">
          <div class="client-chart-nodata" v-if="allpie0">暂无数据</div>
          <div class="client-chart" id="client-chart" v-else></div>
          <div class="forbid-client">
            <div class="client-legend">
              <p class="client-desc">
                <span><i></i>手动添加</span>
                <span><i></i>搜索推荐</span>
                <span><i></i>社交监控</span>
                <span><i></i>邮件添加</span>
                <span><i></i>网站注册</span>
              </p>
              <p class="client-desc1">
                <span><i></i>网站询盘</span>
                <span><i></i>文件导入</span>
                <span><i></i>小助手导入</span>
                <span><i></i>商机推荐</span>
              </p>
            </div>
          </div>
        </div>
        <div class="text-loadding" v-if="isLoading.clientSource">
          <div class="block-title" style="overflow:hidden;">
            <span class="loading-title"></span>
          </div>
          <div class="static-pie">
          </div>
          <div class="load-tr">
            <span class="load-td"></span>
            <span class="load-td"></span>
            <span class="load-td"></span>
            <span class="load-td"></span>
            <span class="load-td"></span>
            <span class="load-td"></span>
          </div>
        </div>
      </div>
      <!-- 询盘客户模块 -->
      <div class="inquire-customer inquire-box">
        <div class="block-title">
          <router-link to="inquiryMonitor">询盘客户</router-link>
          <el-tooltip class="item" effect="dark" content="随时了解询盘动态" placement="top">
            <span class="icon-font title-icon">&#xe65b;</span>
          </el-tooltip>
          </el-tooltip>
        </div>
        <div class="text-loadding" v-if="isLoading.inquire">
            <div class="block-title" style="overflow:hidden;">
            <span class="loading-title"></span>
            <div>
              <div class="loading-tr"></div>
              <div class="loading-tr"></div>
              <div class="loading-tr"></div>
              <div class="loading-tr"></div>
              <div class="loading-tr"></div>
              <div class="loading-tr"></div>
            </div>
          </div>
        </div>
        <div class="none-data-tip" v-else-if="inquireTableData.length === 0">
          <img src="../../assets/img/nodata.png" width="78">
          <br>
          <br>
          最近您没有新的询盘
        </div>
        <div class="table-tmpl" style="width: 592px;" v-else>
          <el-table
            :data="inquireTableData"
            style="width: 100%">
            <el-table-column
              prop="email"
              label="Email"
              width="269">
            </el-table-column>
            <el-table-column
              prop="personName"
              label="Name"
              width="180">
               <template scope="scope">
                <router-link v-if="scope.row.contactTag===1" :to="{ path: 'contactDetail', query: { contactId: scope.row.contactId, contactType: 0 }}">
                  <span class="inquire-name">{{scope.row.personName}}</span>
                </router-link>
                <span v-else class="inquire-name">{{scope.row.personName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="source"
              label="来源">
              <template scope="scope">
                <span v-if="scope.row.source">{{scope.row.source}}</span>
                <span v-else>Contact Us</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-center" v-if="inquirePage.totalCount > 5" style="position: absolute; bottom: 24px;">
             <el-pagination
                small
                @current-change="inquireHandleCurrentChange"
                layout="prev, pager, next"
                :current-page="inquirePage.page"
                :page-size="inquirePage.pageSize"
                :total="inquirePage.totalCount">
              </el-pagination>
          </div>
        </div>
      </div>
      <!-- LEAD推荐模块 -->
      <div class="recommend-block lead-box" v-if="leadList.length !== 0">
        <div class="block-title">
          LEAD推荐
          <div class="fr">
            <div class="condition-day view-more" v-if="leadList.length !== 0" @click="viewMore2">查看更多 ></div>
          </div>
        </div>
         <div class="text-loadding" v-if="isLoading.lead">
            <div class="block-title" style="overflow:hidden;">
              <span class="loading-title"></span>
            </div>
            <div class="recommend-item" v-for="i in [1,2,3,4]">
              <div class="r-head">
              </div>
              <div class="r-info">
                <div class="r-name"  >
                </div>
                <div class="r-about" >
                </div>
              </div>
            </div>
          </div>
        <!--<div class="none-data-tip" v-else-if="leadList.length === 0">-->
          <!--<img src="../../assets/img/nodata.png" width="78">-->
          <!--<br>-->
          <!--<br>-->
          <!--暂无数据-->
        <!--</div>-->
        <div class="recommends" v-else>
          <a href="javascript:;" class="recommend-item" v-for="(rItem,rIndex) in leadList" @click="toDevelopDetail($event, rItem)" v-if="rIndex<4">
            <div class="r-head">
              <!-- {{rItem.avatar}} -->
              <img v-if="rItem.type==0" :src="rItem.avatar||'/static/img/default.png'" width="100%">
              <img v-else :src="rItem.avatar||'/static/img/default_comp.png'" width="100%">
              <!-- <img src="../../assets/img/default.png" width="100%"> -->
            </div>
            <div class="r-info">
              <div class="r-name">
                <i class="icon-user" v-if="rItem.type==0"></i>
                <i class="icon-addr" v-else></i>
                {{rItem.recommendName}}
              </div>
              <div class="r-about">
                {{rItem.desc||'暂未添加任何简介'}}
              </div>
            </div>
            <div class="r-icons">
              <a v-for="(k, v) in rItem.iconArr" :class="k.icon" :href="k.url?k.url:'javascript:;'" target="_blank"></a>
              <!-- <i class="icon-pinterest2"></i>
              <i class="icon-twitter"></i>
              <i class="icon-message"></i>
              <i class="icon-fill"></i> -->
            </div>
          </a>
          <!-- <div class="page-center">
             <el-pagination
                small
                layout="prev, pager, next"
                @current-change="leadPageChange"
                :current-page="leadPage.page"
                :page-size="leadPage.pageSize"
                :total="leadPage.totalCount">
              </el-pagination>
          </div> -->
        </div>
      </div>
      <!-- 营销邮件统计模块 -->
      <div class="web-info market-mail" v-if="serverLevel==='1'">
        <div class="block-title">
          营销邮件统计
          <!-- <div class="fr">
            <div @click="changeMarketDays(7)" class="condition-day" :class="{'selected': marketDays === 7}">最近7天</div>
            <div @click="changeMarketDays(30)" class="condition-day" :class="{'selected': marketDays === 30}">
              最近30天
            </div>
          </div> -->
        </div>
        <div class="text-loadding" v-if="isLoading.market">
          <div class="block-title" style="overflow:hidden;">
            <span class="loading-title"></span>
            <div class="fr">
              <div  class="condition-day" ></div>
              <div class="condition-day"></div>
            </div>
          </div>
          <div>
            <div class="static-item">
              <div class="static-title"></div>
              <div class="static-content"></div>
            </div>
            <div class="static-item">
              <div class="static-title"></div>
              <div class="static-content"></div>
            </div>
            <div class="static-item">
              <div class="static-title"></div>
              <div class="static-content"></div>
            </div>
            <div class="static-item">
              <div class="static-title"></div>
              <div class="static-content"></div>
            </div>
          </div>
        </div>
        <div class="market-all clearfix">
          <div><label>发送邮件&nbsp;&nbsp;(封)</label><p>{{marketData.total}}</p></div>
          <div><label>送达率</label><p>{{marketData.arrivePer}}%</p></div>
          <div><label>阅读率</label><p>{{marketData.readPer}}%</p></div>
          <div><label>点击率</label><p>{{marketData.hitPer}}%</p></div>
        </div>
      </div>
      <!-- 营销邮件效果排行榜模块 -->
      <div class="inquire-customer inquire-box" v-if="serverLevel=='1'">
        <div class="block-title">
          营销邮件效果排行榜
        </div>

        <div class="text-loadding" v-if="isLoading.marketRank">
            <div class="block-title" style="overflow:hidden;">
            <span class="loading-title"></span>
            <div>
              <div class="loading-tr"></div>
              <div class="loading-tr"></div>
              <div class="loading-tr"></div>
              <div class="loading-tr"></div>
              <div class="loading-tr"></div>
              <div class="loading-tr"></div>
            </div>
          </div>
        </div>
        <div class="none-data-tip" v-else-if="marketRankData.length === 0">
          <img src="../../assets/img/nodata.png" width="78">
          <br>
          <br>
          暂无数据
        </div>
        <div class="table-tmpl table-tmpl-off" style="width: 592px;" v-else>
          <el-dropdown @command="changeChoose">
                   <span class="el-dropdown-link">
                     <i class="el-icon-caret-bottom el-icon--right" style="font-size:10px;"></i>
                   </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="read">阅读率</el-dropdown-item>
              <el-dropdown-item command="click">点击率</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-table
            :data="marketRankData"
            style="width: 100%">
            <el-table-column
              prop="title"
              label="营销邮件名称"
              width="269">
            </el-table-column>
            <el-table-column
              prop="readPer"
              :label="labelType"
              width="180">
               <template scope="scope">
               <!--  <router-link v-if="scope.row.contactTag===1" :to="{ path: 'contactDetail', query: { contactId: scope.row.contactId, contactType: 0 }}">
                  <span class="inquire-name">{{scope.row.personName}}</span>
                </router-link>
                <span v-else class="inquire-name">{{scope.row.personName}}</span> -->
                <span v-if="labelType === '阅读率'" class="inquire-name">{{scope.row.readPer}} %</span>
                <span v-if="labelType === '点击率'" class="inquire-name">{{scope.row.hitPer}} %</span>
              </template>
            </el-table-column>

            <el-table-column
              type="index"
              label="排名"
              width="140">
            </el-table-column>
          </el-table>
          <!-- <div class="page-center">
             <el-pagination
                small
                @current-change="marketPageChange"
                layout="prev, pager, next"
                :current-page="marketRankPage.page"
                :page-size="marketRankPage.pageSize"
                :total="marketRankPage.totalCount">
              </el-pagination>
          </div> -->
        </div>
      </div>
      <!-- 精准推荐模块 -->
      <div class="recommend-block" v-if="recommandRight===1&&recommendList.length !== 0">
        <div class="block-title">
          精准推荐
          <el-tooltip class="item" effect="dark" content="收集社交网络的数据并分析，推送最匹配的客户" placement="top">
            <span class="icon-font title-icon">&#xe65b;</span>
          </el-tooltip>
        </div>
         <div class="text-loadding" v-if="isLoading.recommend">
            <div class="block-title" style="overflow:hidden;">
              <span class="loading-title"></span>
            </div>
            <div class="recommend-item" v-for="i in [1,2,3,4]">
              <div class="r-head">
              </div>
              <div class="r-info">
                <div class="r-name"  >
                </div>
                <div class="r-about" >
                </div>
              </div>
            </div>
          </div>
        <!--<div class="none-data-tip" v-else-if="recommendList.length === 0">-->
          <!--<img src="../../assets/img/nodata.png" width="78">-->
          <!--<br>-->
          <!--<br>-->
          <!--最近没有精准推荐数据-->
        <!--</div>-->
        <div class="recommends" v-else>
          <div class="recommend-item" v-for="(rItem,rIndex) in recommendList">
            <div class="r-head" @click="viewRecommendDetail(rItem.poolId)">
              <img src="../../assets/img/default.png" width="100%">
            </div>
            <div class="r-info">
              <div class="r-name"  @click="viewRecommendDetail(rItem.poolId)">

                {{rItem.name}}
              </div>
              <div class="r-about" v-html="rItem.showTitle"  @click="viewRecommendDetail(rItem.poolId)">
              </div>
            </div>
          </div>
         <div class="page-center" v-if="recommendPage.totalCount > 4" style="padding-bottom: 12px">
             <el-pagination
                small
                layout="prev, pager, next"
                @current-change="recommendHandleCurrentChange"
                :current-page="recommendPage.page"
                :page-size="recommendPage.pageSize"
                :total="recommendPage.totalCount">
              </el-pagination>
          </div>
        </div>
      </div>
      <!-- 生日提醒模块 -->
      <div class="birthday-block">
        <div class="block-title">
          生日提醒
          <el-tooltip class="item" effect="dark" content="很方便的了解您联系人的生日动态" placement="top">
            <span class="icon-font title-icon">&#xe65b;</span>
          </el-tooltip>
        </div>
        <div class="text-loadding" v-if="isLoading.birthday">
          <div class="block-title" style="overflow:hidden;">
            <span class="loading-title"></span>
          </div>
          <div class="b-item" v-for="bItem in [1,2,3,4]">
            <div class="b-close">
            </div>
            <div class="b-head">
            </div>
            <div class="b-name"></div>
            <div class="b-job"></div>
            <div class="b-job-title"></div>
            <div class="b-time"></div>
            <div class="b-mail-btn-bg">
            </div>
          </div>
        </div>
        <div class="none-data-tip" v-else-if="birthdayList.length === 0">
          <img src="../../assets/img/nodata.png" width="78">
          <br>
          <br>
          最近没有人生日
        </div>
        <div class="b-items" v-else>
          <div class="b-item" v-for="(bItem,bIndex) in birthdayList">
            <div class="b-close">
              <span @click="removeBirthdayInfo(bItem.id,bIndex)">&times;</span>
            </div>
            <div class="b-head">
              <img :src="bItem.contactLogUrl||'/static/img/default.png'" onerror="javascript:this.src='/static/img/default.png'" width="100%" @click="goToContact(bItem.contactId)">
            </div>
            <div class="b-name ellipsis">{{bItem.contactName}}</div>
            <div class="b-job ellipsis">{{bItem.contactCompany}}</div>
            <div class="b-job-title ellipsis">{{bItem.contactPosition}}</div>
            <div class="b-line"></div>
            <div class="b-time">
              <template v-if="bItem.afterDay===0">
                 今天生日
              </template>
              <template v-else>
                <span class="b-day">{{bItem.afterDay}}</span> 天后生日
              </template>
              <span class="b-date">({{bItem.realDay}})</span>
            </div>
            <template v-if="serverLevel==='1'">
              <div class="b-mail-btn" @click="sendEmail(bItem.contactId)" v-if="bItem.contactEmail">
                <span class="icon-font">&#xe614;</span>
                发送生日邮件
              </div>
              <div class="b-mail-btn" style="background:#EAF0F6;" v-else>
                <span class="icon-font">&#xe614;</span>
                发送生日邮件
              </div>
            </template>

          </div>

          <div class="page-center">
             <el-pagination
                small
                layout="prev, pager, next"
                @current-change="birthdayHandleCurrentChange"
                :current-page="birthDayPage.page"
                :page-size="birthDayPage.pageSize"
                :total="birthDayPage.totalCount">
              </el-pagination>
          </div>
        </div>


      </div>
      <!-- 盈店学堂模块 -->
      <div class="ying-class-block">
        <div class="block-title">
          盈店学堂
          <el-tooltip class="item" effect="dark" content="提供了丰富的社交外贸课程" placement="top">
            <span class="icon-font title-icon">&#xe65b;</span>
          </el-tooltip>
          <div class="fr">
            <div v-if="schoolList.length > 0" class="condition-day view-more" @click="viewMore">查看更多 ></div>
          </div>
        </div>
        <div class="text-loadding" v-if="isLoading.school">
          <div class="block-title" style="overflow:hidden;">
            <span class="loading-title"></span>
          </div>
          <div class="y-items">
            <div class="y-item" v-for="sItem in [1,2,3,4]">
              <div class="y-pic-wraper">
              </div>
              <div class="y-title"></div>
              <div class="y-about"></div>
            </div>
          </div>
        </div>
        <div class="none-data-tip" v-else-if="schoolList.length === 0">
          <img src="../../assets/img/nodata.png" width="78">
          <br>
          <br>
          暂无新的课程，尽情期待
        </div>
        <div class="y-items" v-else>
          <div class="y-item" v-for="(sItem,sIndex) in schoolList" @click="goToArticleDetail(sItem.id)">
            <div class="y-pic-wraper">
              <img class="y-pic" :src="sItem.wholeImgUrl||'/static/img/index/yPic.jpg'" onerror="javascript:this.src='/static/img/index/yPic.jpg'" width="100%">
              <div class="readed">{{sItem.viewCount}}人已阅读</div>
            </div>
            <div class="y-title">{{sItem.title}}</div>
            <div class="y-about">{{sItem.summary}}</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="check-dialog" title="提示" v-model="checkVisible">
      <img src="../../assets/img/index/checkemail.png">
      <p class="check-text">{{notice}}</p>
      <p>请重新绑定您的邮箱</p>
    </el-dialog>
    <!-- <DialogBox :config="oconfig" @sure="confirmOk"></DialogBox> -->
  </div>
</template>
<script>
import IndexAPI from '@/api/indexAPI'
import LoginAPI from '@/api/loginAPI'
import enquiriesAPI from '@/api/enquiriesAPI'
// import chanceRecommedApi from '@/api/chanceRecommedAPI'
import echarts from 'echarts/lib/echarts'
import Util from '@/common/Util.js'
// import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
// import ChanceCarousel from '@/components/chanceCarousel.vue'
import ChanceCarouselTwo from '@/components/ChanceCarouselTwo.vue'
// import Vue from 'vue'
export default {
  name: 'workspace',
  data () {
    return {
      labelType: '阅读率',
      probationDate: '',
      probation: false,
      adsToken: '',
      adsUrl: process.env.ADS_DOMAIN + '/account?token=',
      serverLevel: '1',
      /**
       * 流量概览数据
      */
      pvVal: 0,
      uvVal: 0,
      avgTime: 0,
      avgPage: 0,
      quiryCount: 0,
      /**
       * 询盘权限
       * @type {Number}
       */
      recommandRight: 1,
      /**
       * 各个模块 是否正在加载数据
       * @type {Object}
       */
      isLoading: {
        webStatics: false,
        birthday: true,
        school: true,
        recommend: true,
        inquire: true,
        currOnline: true, // 当前在线
        clientSource: true, // 客户来源
        lead: true, // lead推荐
        market: true, // 营销邮件
        marketRank: true, // 营销邮件排行
        flowLoading: true,
        dynamic: true,
        wake: true
      },
      /**
       * 默认统计7天
       * @type {Number}
       */
      webStaticDays: 7,
      flowDays: 7,
      /**
       * 营销邮件默认统计7天
       * @type {Number}
       */
      // marketDays: 7,
      /**
       * 网站统计信息
       * @type {Object}
       */
      webStatics: {
        conversionRate: 0,
        msgProductCount: 0,
        uv: 0
        // pv: 0,
        // uv: 0,
        // inquire: 0,
        // expose: 0
      },
      /**
       * 询盘table
       * @type {Array}
       */
      inquireTableData: [],
      birthdayList: [],
      schoolList: [],
      recommendList: [],
      marketData: {},
      marketRankData: [],
      leadList: [],
      wakeList: [],
      wakeListTotal: [],
      currOnlineData: {},
      sixty: {type: Number},
      allpie0: false,
      browseData: [],
      /**
       * 询盘分页对象
       * @type {Object}
       */
      inquirePage: {
        page: 1,
        pageSize: 5,
        totalCount: 0
      },
      /**
       * 精准推荐分页
       * @type {Object}
       */
      recommendPage: {
        page: 1,
        pageSize: 4,
        totalCount: 0
      },
      /**
       * 生日分页
       * @type {Object}
       */
      birthDayPage: {
        page: 1,
        pageSize: 4,
        totalCount: 0
      },
      intervalTimer: null,
      checkVisible: false,
      notice: '',
      // 最近动态数据
      latelyDy: [],
      /**
       *dynamic分页
       */
      dynamicPage: {
        page: 1,
        pageSize: 5,
        totalCount: 0
      },
      dynamicData: [],
      /**
       * 客户唤醒分页
       */
      wakePage: {
        page: 1,
        pageSize: 4,
        totalCount: 0
      },
      wakeMaxLen: -1,
      nowWakeIndex: 4,
      chanceList: [],
      num: 0
      /**
       * 营销分页
       */
      // marketRankPage: {
      //   page: 1,
      //   pageSize: 5,
      //   totalCount: 0
      // }
    }
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.intervalTimer)
    next()
  },
  mounted () {
    if (window.localStorage.isProbation === 'true') {
      this.probation = true
      console.log(window.localStorage.probation)
      this.probationDate = window.localStorage.probation
      console.log(this.probationDate)
      this.$store.commit('ADSENTER', {adsEnter: false})
    }
    this.getAdsToken()
    /**
     * 获取用户权限
     * @type {[type]}
     */
    this.serverLevel = window.localStorage.serverLevel
    this.recommandRight = JSON.parse(localStorage.user).hasActivity
    // 选中一级菜单
    this.$store.dispatch('setNavIndex', 0)
    /**
     * 初始化各种统计信息
     */
    this.getWebStaticsInfo()
    this.getInquireInfo()
    if (this.recommandRight) {
      this.getRecommendInfo()
    }
    this.getSchoolInfo()
    this.getBirthdayInfo()
    this.initPie()
    this.getCurrOnline()
    this.getLeadInfo()
    this.getMaketInfo()
    this.getMaketRank()
    this.isAds({'dictCode': 'SWITCH'})
    // this.mailCheck()
    // 流量概览
    this.flowBrowse()
    // 客户最近动态
    this.dynamic({'size': 5, 'page': this.dynamicPage.page})
    // this.dynamic()
    // 客户唤醒
    this.customersWake()
//    this.customerWake()
    // 商机推荐
    if (this.serverLevel === '1') {
      this.getChanceListFunc()
    }
  },
  destroyed () {
    let cycleObj = this.cycleObj
    clearInterval(cycleObj)
  },
  components: {
    ChanceCarouselTwo
  },
  computed: {
    adsEnter () {
      if (window.localStorage.isAds) {
        if (window.localStorage.isAds === 'show') {
          return this.$store.state.index.adsEnter
        }
      }
    }
  },
  methods: {
    pieCount () {
      this.initPie()
    },
    ChanceRight () {
      return Util.hasRightByCode('CC')
    },
    // 获取商机推荐列表
    getChanceListFunc () {
      let myDate = new Date()
      let myDate2 = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      let year = myDate.getFullYear()
      let year2 = myDate2.getFullYear()
      let month = (myDate.getMonth() < 9 ? '0' : '') + (myDate.getMonth() + 1)
      let month2 = (myDate2.getMonth() < 9 ? '0' : '') + (myDate2.getMonth() + 1)
      let day = (myDate.getDate() < 10 ? '0' : '') + myDate.getDate()
      let day2 = (myDate2.getDate() < 10 ? '0' : '') + myDate2.getDate()
      let datastr = year + '-' + month + '-' + day
      let datastr2 = year2 + '-' + month2 + '-' + day2
      let params = {
        page: 1,
        size: 10,
        startTime: datastr,
        endTime: datastr2
      }
      enquiriesAPI.getCommonEnquiries(params).then(res => {
        if (res.data.code === 0) {
          let records = res.data.data.records
          records.forEach((item) => {
            item.isShow = false
            item.enquiryType = 1
            item.isMining = false
            this.chanceList.push(item)
          })
        }
        // this.dataIsload = false
        enquiriesAPI.getMicroEnquiries(params).then(res => {
          if (res.data.code === 0) {
            let records = res.data.data.records
            records.forEach((item) => {
              item.isShow = false
              item.enquiryType = 2
              this.chanceList.push(item)
            })
            // this.updateChanceList()
          }
          this.dataIsload = false
        })
      })
    },
    showImgList (index) {
      this.imglistIsShow = true
    },
    isAds (param) {
      IndexAPI.isAds(param).then(res => {
        if (!res.data.code) {
          if (res.data.data[0].dictdataCode === '1') {
            if (window.localStorage.isProbation === 'false') {
              this.$store.commit('ADSENTER', {adsEnter: true})
            }
            this.$store.commit('ADSBAR', {adsBar: true})
          }
        }
      })
    },
    getAdsToken () {
      LoginAPI.getLoginToken().then(res => {
        if (res.data.data) {
          this.adsToken = res.data.data
          localStorage.token = res.data.data
        }
      })
    },
    // 关闭ads入口
    closeAds () {
      this.adsEnter = false
      this.$store.commit('ADSENTER', {adsEnter: false})
      window.localStorage.isAds = ''
    },
    /**
     * 验证邮箱有效性
     */
    mailCheck () {
      let _this = this
      IndexAPI.mailCheck().then((res) => {
        if (!res.data.code) {
        } else {
          _this.checkVisible = true
          _this.notice = res.data.message
        }
      })
    },
    /**
     * 客户最近动态
     *
     */
    dynamic (param) {
      IndexAPI.dynamicRecent(param).then((res) => {
        if (!res.data.code) {
          this.isLoading.dynamic = false
          this.dynamicData = res.data.data.records
          for (var i = 0; i < this.dynamicData.length; i++) {
            let socail = this.dynamicData[i].socialContent
            this.dynamicData[i].socialContent = JSON.parse(socail)
          }
          console.log(this.dynamicData.socialContent)
          this.dynamicPage.totalCount = res.data.data.totalCount
        }
      })
    },
    /**
     * 跳转到联系人详情页
     */
    toContact (id) {
      let params = {
        contactId: id,
        actionType: -1,
        contactType: 0,
        messageType: 'mail'
      }
      this.$store.dispatch('setNavIndex', 5)
      this.$router.push({
        path: '/contactDetail',
        query: params
      })
    },
    /**
     *
     */
    toContactIt (id) {
      this.$store.dispatch('setNavIndex', 5)
      this.$router.push({
        path: '/contactDetail',
        query: {'contactId': id, 'contactType': 0}
      })
    },
    /**
     * 忽略该联系人
     */
    ignoreIt (id, index) {
      IndexAPI.customerWake({'paging': false}).then((res) => {
        if (!res.data.code) {
          for (var i = 0; i < res.data.data.records.length; i++) {
            if (res.data.data.records[i].avatar !== null && res.data.data.records[i].avatar !== '') {
              res.data.data.records[i].avatar = Util.checkUrl(res.data.data.records[i].avatar)
            }
          }
          this.wakeListTotal = res.data.data.records
          IndexAPI.customerignoreWake({'contactId': id}).then((res) => {
            if (!res.data.code) {
              this.nowWakeIndex = 4
              this.nowWakeIndex = this.nowWakeIndex * this.wakePage.page
              this.wakeMaxLen--
              if (this.nowWakeIndex < this.wakeListTotal.length) {
                console.log('ll')
                this.wakeList.splice(index, 1, this.wakeListTotal[this.nowWakeIndex])
                this.wakePage.totalCount--
              } else {
                console.log('oo')
                this.wakeList.splice(index, 1)
                this.wakePage.totalCount--
              }
            }
          })
        }
      })
    },
    /**
     * 客户唤醒
     *
     */
    customersWake () {
      let param = {
        'page': this.wakePage.page,
        'size': this.wakePage.pageSize
      }
      IndexAPI.customerWake(param).then((res) => {
        if (!res.data.code) {
          this.isLoading.wake = false
          for (var i = 0; i < res.data.data.records.length; i++) {
            if (res.data.data.records[i].avatar !== null && res.data.data.records[i].avatar !== '') {
              res.data.data.records[i].avatar = Util.checkUrl(res.data.data.records[i].avatar)
            }
          }
          this.wakeList = res.data.data.records
          this.wakeMaxLen = this.wakeList.length
          this.wakePage.totalCount = res.data.data.totalCount
        }
      })
    },
    /**
     * 网站统计
     * @return {[type]} [description]
     */
    initTable (arruv, arrinq) {
      let dataAxis = []
      let data2Axis = []
      let data = []
      let data2 = []
      if (!arruv) {
        return
      }
      if (!arrinq) {
        return
      }
      for (let key in arruv) {
        dataAxis.push(arruv[key].date)
        data.push(arruv[key].uv)
      }
      for (let key2 in arrinq) {
        data2Axis.push(arrinq[key2].date)
        data2.push(arrinq[key2].count)
      }
      /**
       * 阴影 为最大值
       * @param  {[type]} let item          of data [description]
       * @return {[type]}     [description]
       */
      // for (let item of data) {
      //   yMax = (item > yMax ? item : yMax)
      // }
      // var dataShadow = []
      // for (var i = 0; i < data.length; i++) {
      //   dataShadow.push(yMax)
      // }
      let interval = 1
      if (this.webStaticDays === 30) {
        interval = 8
      }
      let opt = this.chartOption(dataAxis, data, interval, ['#5488F9', '#f3f7ff'])
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('web-chart'))
      // 绘制图表
      myChart.setOption(opt)

      let opt2 = this.chartOption(data2Axis, data2, interval, ['#00B8CC', '#ebfdff'])
      var myChart2 = echarts.init(document.getElementById('web2-chart'))
      myChart2.setOption(opt2)
    },
    // 流量概览
    flowBrowse () {
      let param = {'recentDays': this.flowDays, 'platform': 0}
      IndexAPI.getFlowCount(param).then((res) => {
        this.isLoading.flowLoading = false
        if (!res.data.code) {
          // let obj = res.data.data
          this.pvVal = res.data.data.sumPv
          this.uvVal = res.data.data.sumUv
          this.avgTime = res.data.data.averageUvTime
          this.avgPage = res.data.data.averagePvNum
          this.quiryCount = res.data.data.msgProductCount
          console.log(this.avgTime)
          console.log('UUUUUUUUUUU')
        }
      })
    },
    /**
     * 客户来源
     */
    initPie () {
      let dataArr = []
      IndexAPI.clientSource().then((res) => {
        this.isLoading.clientSource = false
        if (!res.data.code) {
          if (res.data.data.length === 0) {
            this.allpie0 = true
            return
          }
          res.data.data.forEach((item) => {
            switch (item.createSource) {
              case 'new_create':
                dataArr[0] = item.total === 0 ? undefined : item.total
                break
              // case 'other': dataArr[1] = item.total; break
              case 'search_and_recommend_create':
                dataArr[1] = item.total === 0 ? undefined : item.total
                break
              case 'social_monitor_create':
                dataArr[2] = item.total === 0 ? undefined : item.total
                break
              case 'mail_inbox_create':
                dataArr[3] = item.total === 0 ? undefined : item.total
                break
              case 'browse_shop_create':
                dataArr[4] = item.total === 0 ? undefined : item.total
                break
              case 'inquiry_create':
                dataArr[5] = item.total === 0 ? undefined : item.total
                break
              case 'manual_import':
                dataArr[6] = item.total === 0 ? undefined : item.total
                break
              case 'social_import':
                dataArr[7] = item.total === 0 ? undefined : item.total
                break
              case 'commercial_opportunity_create':
                dataArr[8] = item.total === 0 ? undefined : item.total
                break
            }
            // item.createSource === 'inquiry_create'
          })
          let option = {
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                return params.name + ' : ' + params.value + ' (' + (params.percent - 0).toFixed(2) + '%)'
              }
              // formatter: '{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              data: ['手动添加', '搜索推荐', '社交监控', '邮件添加', '网站注册', '网站询盘', '文件导入', '小助手导入', '商机推荐'],
              show: false
            },
//            toolbox: {
//              show: false
//            },
            calculable: true,
            series: [
              {
                name: '',
                type: 'pie',
                radius: ['45%', '65%'],
                avoidLabelOverlap: false,
                center: ['47%', '36%'],
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    formatter: function (params) {
                      return params.name + '\n' + (params.percent - 0).toFixed(2) + '%'
                    },
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
//                name: '',
//                type: 'pie',
//                radius: ['55%', '70'],
//                avoidLabelOverlap: false,
//                emphasis: {
//                  show: true,
//                  textStyle: {
//                    fontSize: '30',
//                    fontWeight: 'bold'
//                  }
//                },
//                center: ['55%', '42%'],
//                itemStyle: {
//                  normal: {
//                    label: {
//                      show: false,
//                      position: 'center'
//                      formatter: function (params) {
//                        return (params.percent - 0).toFixed(2) + '%'
//                      }
//                    }
//                  }
//                },
                data: [
                  {value: dataArr[0], name: '手动添加'},
                  // {value: dataArr[1], name: '其他'},
                  {value: dataArr[1], name: '搜索推荐'},
                  {value: dataArr[2], name: '社交监控'},
                  {value: dataArr[3], name: '邮件添加'},
                  {value: dataArr[4], name: '网站注册'},
                  {value: dataArr[5], name: '网站询盘'},
                  {value: dataArr[6], name: '文件导入'},
                  {value: dataArr[7], name: '小助手导入'},
                  {value: dataArr[8], name: '商机推荐'}
                ],
                color: ['#5488F9', '#FB509F', '#00B8CC', '#FCA21D', '#fd5656', '#2AE0E7', '#FFDC0D', '#B3D517', '#b1e182']
              }
            ]
          }
          let myChart = echarts.init(document.getElementById('client-chart'))
          // 绘制图表
          myChart.setOption(option)
        }
      })
      // this.isLoading.clientSource = false
    },
    chartOption (dataAxis, data, interval, colorarr) {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              color: 'rgba(150,150,150,0)'
            }
          }
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            interval: interval,
            inside: false,
            textStyle: {
              color: '#7C98B6'
            },
            // rotate: 45,
            formatter: function (params) {
              return params.split('-')[1] + '-' + params.split('-')[2]
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        // color: colorarr,
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLabel: {
            margin: 1,
            textStyle: {
              color: '#7C98B6',
              fontSize: '12'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            /**
             * 宽度是这边调整的
             * @type {String}
             */
            // barCategoryGap: '85%',
            showSymbol: false,
            hoverAnimation: false,
            smooth: true,
            itemStyle: {
              // normal: {color: 'rgba(0,0,0,0.05)'}
              normal: {
                color: colorarr[0],
                areaStyle: {            // 系列级个性化折线样式，横向渐变描边
                  type: 'default',
                  color: colorarr[1]
                }
              }
            },
            data: data
          }
        ]
      }
      return option
    },
    /**
     阅读率和点击率切换
      */
    changeChoose (command) {
      this.isLoading.marketRank = true
      if (command === 'read') {
        this.labelType = '阅读率'
        this.getMaketRank()
      }
      if (command === 'click') {
        this.labelType = '点击率'
        this.getClickRank()
      }
    },
    /**
     * 跳转到公司/员工详情
     */
    toDevelopDetail (event, data) {
      if (event.target.getAttribute('href') !== 'javascript:;' && event.target.parentNode.getAttribute('class') === 'r-icons') {
        return
      }
      if (data.type === 1) { // 公司
        window.open('#/companyDetail?id=' + data.thirdAccountId + '&source=recommend&keywords=')
      } else {
        window.open('#/staffDetail?id=' + data.thirdAccountId + '&source=recommend&keywords=')
      }
    },
    /**
     * 去联系人那里
     * @param  {[type]} contactId [description]
     * @param  {[type]} type      [description]
     * @return {[type]}           [description]
     */
    goToContact (contactId, type) {
      window.open('#/contactDetail?contactId=' + contactId + '&contactType=0')
    },
    /**
     * 生日发送email 按钮
     * @param  {[type]} contactId [description]
     * @param  {[type]} type      [description]
     * @return {[type]}           [description]
     */
    sendEmail (contactId, type) {
      window.open('#/contactDetail?contactId=' + contactId + '&contactType=0&messageType=mail&actionType=0')
    },
    /**
     * 精准推荐详情
     * @return {[type]} [description]
     */
    viewRecommendDetail (poolId) {
      window.open('#/ppcDetail?poolId=' + poolId)
    },
    /**
     * 点击学堂 进入文章详情
     * @return {[type]} [description]
     */
    goToArticleDetail (id) {
      window.open('#/articleDetail/' + id)
    },
    /**
     * 查看更多
     * @return {[type]} [description]
     */
    viewMore () {
      window.open('#/newsList')
    },
    viewMore2 () {
      // window.open('#/develop')
      this.$router.push({ path: '/develop' })
    },
    /**
     * 分页钩子 询盘
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    inquireHandleCurrentChange (val) {
      this.inquirePage.page = val
      this.getInquireInfo()
    },
    /**
     * 分页钩子 精准推荐
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    recommendHandleCurrentChange (val) {
      this.recommendPage.page = val
      this.getRecommendInfo()
    },
    /**
     * 分页钩子 生日
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    birthdayHandleCurrentChange (val) {
      this.birthDayPage.page = val
      this.getBirthdayInfo()
    },
    /**
     * 最近动态分页
     */
    dynamicPageChange (value) {
      this.isLoading.dynamic = true
      this.dynamicPage.page = value
      this.dynamic({'size': 5, 'page': this.dynamicPage.page})
    },
    /**
     *客户唤醒分页
    */
    wakePageChange (value) {
      this.isLoading.wake = true
      this.wakePage.page = value
      this.customersWake()
    },
    /**
     * 分页钩子 lead推荐
     */
    // leadPageChange (val) {
    //   this.leadPage.page = val
    //   this.getLeadInfo()
    // },
    /**
     * 分页钩子 营销排行
     */
    // marketPageChange (val) {
    //   this.marketRankPage.page = val
    //   this.getMaketRank()
    // },
    /**
     * 获取学堂信息
     * @return {[type]} [description]
     */
    getSchoolInfo () {
      let postObj = {
        page: 1,
        size: 4,
        paging: true
      }
      /**
       * 开启loading
       * @type {Boolean}
       */
      this.isLoading.school = true
      IndexAPI.getSchoolInfo(postObj).then((res) => {
        this.isLoading.school = false
        this.schoolList = res.data.data.records
      })
    },
    /**
     * 移除生日信息
     * @return {[type]} [description]
     */
    removeBirthdayInfo (id, index) {
      let postObj = {
        id: id
      }
      IndexAPI.removeBirthdayInfo(postObj).then((res) => {
        if (res.data.code === 0) {
          /**
           * 刷新页 refreshMaxPage 为 根据 删除前的totalCount 算出来的最大页
           * @type {[type]}
           */
          let refreshMaxPage = parseInt((this.birthDayPage.totalCount - 2) / 4) + 1
          let refreshPage = this.birthDayPage.page <= refreshMaxPage ? this.birthDayPage.page : refreshMaxPage
          /**
           * 当前要刷新的页为 当前所在页 （当前页内容删除完之后，则刷新refreshMaxPage）
           * @type {[type]}
           */
          this.birthDayPage.page = refreshPage
          this.getBirthdayInfo()
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    /**
     * 获取生日
     * @return {[type]} [description]
     */
    getBirthdayInfo () {
      let postObj = {
        page: this.birthDayPage.page,
        size: this.birthDayPage.pageSize
      }
      /**
       * 开启loading
       * @type {Boolean}
       */
      this.isLoading.birthday = true
      IndexAPI.getBirthdayInfo(postObj).then((res) => {
        this.isLoading.birthday = false
        this.birthdayList = res.data.data.records
        /**
         * 分页数据
         * @type {[type]}
         */
        this.birthDayPage.page = res.data.data.page
        this.birthDayPage.totalCount = res.data.data.totalCount
      })
    },
    /**
     * 当前在线
     */
    getCurrOnline () {
      let _this = this
      IndexAPI.currOnline({platform: 0}).then((res) => {
        if (!res.data.code) {
          _this.currOnlineData = res.data.data
          _this.sixty = 60
          _this.isLoading.currOnline = false
          _this.intervalTimer = setInterval(() => {
            if (_this.sixty === 0) {
              clearInterval(_this.intervalTimer)
              _this.getCurrOnline()
            } else {
              _this.sixty = _this.sixty - 1
            }
            // Object.assign(_this.currOnlineData, {sixty: _this.currOnlineData.sixty - 1})
            // Vue.set(_this.currOnlineData, 'sixty', _this.sixty - 1)
          }, 1000)
        }
        // else {
        //   // this.$message.error(res.message)
        // }
      })
    },
    /**
     * LEAD推荐
     */
    getLeadInfo () {
      let postObj = {
        type: 1,
        page: 1,
        size: 4
      }
      IndexAPI.leadData(postObj).then((res) => {
        if (!res.data.code) {
          this.isLoading.lead = false
          this.leadList = res.data.data
          // let inlist = res.data.data.includeList
          this.leadList.forEach((item) => {
            let iconArr = []
            item.includeList.forEach((item2) => {
              let url = item2.url && item2.url.indexOf('http://') === -1 ? 'http://' + item2.url : item2.url
              switch (item2.value) {
                case 'facebook数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-facebook', url: url})
                  break
                case 'twitter数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-twitter', url: url})
                  break
                case '邮箱数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-message', url: url})
                  break
                case '海关数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-fill', url: url})
                  break
                case '员工数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-user', url: url})
                  break
                case '电话数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-tel', url: url})
                  break
              }
            })
            item.iconArr = iconArr
          })
        }
        // this.leadPage.page = res.data.data.page
        // this.leadPage.totalCount = res.data.data.totalCount
      })
    },
    /**
     * 获取精准推荐信息
     * @return {[type]} [description]
     */
    getRecommendInfo () {
      let postObj = {
        type: 1,
        page: this.recommendPage.page,
        size: this.recommendPage.pageSize
      }
      /**
       * 开启loading
       * @type {Boolean}
       */
      this.isLoading.recommend = true
      IndexAPI.getRecommendInfo(postObj).then((res) => {
        this.isLoading.recommend = false
        this.recommendList = res.data.data.records
        /**
         * 分页数据
         * @type {[type]}
         */
        this.recommendPage.page = res.data.data.page
        this.recommendPage.totalCount = res.data.data.totalCount
      })
    },
    /**
     * 获取询盘信息
     * @return {[type]} [description]
     */
    getInquireInfo () {
      /**
       * 计算得到开始时间和结束时间
       * @type {Date}
       */
      let newdate = new Date()
      let sDate = new Date()
      let endDate = newdate.getFullYear() + '-' + (newdate.getMonth() + 1) + '-' + newdate.getDate()
      let startMillionTime = newdate.getTime() - ((30 - 1) * 24 * 60 * 60 * 1000)
      sDate.setTime(startMillionTime)
      let starttime = sDate.getFullYear() + '-' + (sDate.getMonth() + 1) + '-' + sDate.getDate()
      let postObj = {
        page: this.inquirePage.page,
        size: this.inquirePage.pageSize,
        startTime: starttime,
        endTime: endDate
      }
      /**
       * 开启loading
       * @type {Boolean}
       */
      this.isLoading.inquire = true
      IndexAPI.getInquireInfo(postObj).then((res) => {
        this.isLoading.inquire = false
        if (res.data.data) {
          this.inquireTableData = res.data.data.records
           /**
           * 分页数据
           * @type {[type]}
           */
          this.inquirePage.page = res.data.data.page
          this.inquirePage.totalCount = res.data.data.totalCount
        }
      })
    },
    /**
     * 改变统计天数
     * @param  {[type]} days [description]
     * @return {[type]}      [description]
     */
    changeStaticsDays (days) {
      this.webStaticDays = days
      this.getWebStaticsInfo()
    },
    /**
     * 改变浏览概况
     * **/
    changeFlowDays (days) {
      this.isLoading.flowLoading = true
      this.flowDays = days
      this.flowBrowse()
    },
    /**
     * 获取网站统计信息
     * @return {[type]} [description]
     */
    getWebStaticsInfo () {
      // let postObj = this.calDate(this.webStaticDays)
      let postObj = {recentDays: this.webStaticDays, platform: 0}
      /**
      /**
       * 开启loading
       * @type {Boolean}
       */
      this.isLoading.webStatics = true
      /**
       * 网站统计
       * @return {[type]} [description]
       */
      IndexAPI.getWebStaticInfo(postObj).then((res) => {
        this.isLoading.webStatics = false
        let data = res.data.data
        // this.webStatics.pv = res.data.data.shopPVCount
        // this.webStatics.uv = res.data.data.shopUVCount
        // this.webStatics.inquire = res.data.data.leaveMsgCount
        // this.webStatics.expose = res.data.data.productShowCount
        // let data =  msgProductCount: 0,
        // uv: 0,
        // conversionRate: 0,
        Object.assign(this.webStatics, data)
        /**
         * 初始化表格数据
         */
        setTimeout(() => {
          this.initTable(data.uvs, data.inquirys)
        }, 100)
      })
    },
    /**
     * 改变营销统计天数
     */
    // changeMarketDays (days) {
    //   this.marketDays = days
    //   this.getMaketInfo()
    // },
    /**
     * 获取营销邮件信息
     */
    getMaketInfo () {
      let _this = this
      IndexAPI.marketData().then((res) => {
        if (!res.data.code) {
          _this.marketData = res.data.data
          _this.isLoading.market = false
        }
      })
    },
    // 邮件阅读率排序
    getMaketRank () {
      /**
       * 开启loading
       * @type {Boolean}
       */
      IndexAPI.marketRankData().then((res) => {
        this.isLoading.marketRank = false
        if (res.data.data) {
          this.marketRankData = res.data.data
          /**
           * 分页数据
           * @type {[type]}
           */
        }
      })
    },
    // 邮件点击率排序
    getClickRank () {
      /**
       * 开启loading
       * @type {Boolean}
       */
      IndexAPI.marketClickData().then((res) => {
        this.isLoading.marketRank = false
        if (res.data.data) {
          this.marketRankData = res.data.data
          /**
           * 分页数据
           * @type {[type]}
           */
        }
      })
    }
    /**
     * 计算得到开始时间和结束时间
     * @type {Date}
     */
    // calDate (day) {
    //   let newdate = new Date()
    //   let sDate = new Date()
    //   let endDate = newdate.getFullYear() + '-' + (newdate.getMonth() + 1) + '-' + newdate.getDate()
    //   let startMillionTime = newdate.getTime() - ((day - 1) * 24 * 60 * 60 * 1000)
    //   sDate.setTime(startMillionTime)
    //   let starttime = sDate.getFullYear() + '-' + (sDate.getMonth() + 1) + '-' + sDate.getDate()
    //   let postObj = {
    //     day: day,
    //     startDate: starttime,
    //     endDate: endDate
    //   }
    //   return postObj
    // }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
@import '../../assets/style/variable.less';
@import '../../assets/style/base.less';
@import "../../assets/style/chance";


.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.margin-top16{
  margin-top:16px;
}
.helper-down{
  position: fixed;
  right: 0;
  top: 30%;
  z-index: 99;
  .el-tooltip{
    display: block;
  }
  img:hover{
    box-shadow: 2px 3px 22px -2px rgba(0,0,0,0.3);
  }
}
.helper-down-tip{
  padding: 8px;
  width: 164px;
  height: 64px;
  overflow:hidden;
  /*&.el-tooltip__popper[x-placement^="left"] .popper__arrow {*/
     /*border-left-color: #415b77;*/
  /*}*/
  &.el-tooltip__popper.is-dark .popper__arrow::after {
    border-top-color: transparent;
    border-left-color: #415b77;
    border-bottom-color: transparent;
  }
  p{
    line-height: 20px;
    font-size: 12px;
    color: #fff;
  }
  .tit-tip{
    font-size: 13px;
  }
  .chrome-tip{
    margin: 5px -8px 0 -8px;
    padding-left: 8px;
    line-height: 24px;
    border-top: 1px dashed #B0C1D4;
    color: #B0C1D4;
  }
}
.ads-tip{
  position: relative;
  width: 100.4%;
  min-width: 1200px;
  height: 50px;
  line-height: 50px;
  font-size: 13px;
  color: #fff;
  background: #FDF8E6;
  text-align: center;
  background: url('../../assets/img/adsbg.png') no-repeat;
  background-size: cover;
  z-index: 99;
  // letter-spacing: 1px;
  .use-ads{
    display: inline-block;
    margin-left: 10px;
    width:100px;
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
    font-size: 13px;
    color: #5488F9;
    background: #FFF;
    font-weight: bold;
    cursor: pointer;
    i{
      // color: #fff;
      line-height: 34px;
      margin-right: 6px;
      font-weight: normal;
    }
  }
  .del-ads{
    position: absolute;
    right: 20px;
    color: #FFF;
    line-height: 50px;
    font-size: 14px;
    cursor: pointer;
  }
}
@-moz-document url-prefix() { /*Firefox*/
  .ads-tip{
    width: 101.1%;
  }
}
.probation{
  position: relative;
  width:100.1%;
  min-width: 1200px;
  height: 50px;
  line-height: 50px;
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  background: #5488F9;
  background-size: cover;
  z-index: 99;
}
  .static-all{
    margin: 46px auto 0 auto;
    width: 450px;
    &>div{
      float: left;
      width: 67px;
      padding-left: 43px;
      text-align: left;
      label{
        font-size: 12px;
        color: #7C98B6;
      }
      p{
        margin-top: 10px;
        font-size: 40px;
      }
    }
    .static-mid{
      position: relative;
      margin: 0 55px;
      width: 88px;
      padding-left: 0;
      padding-top: 17px;
      text-align: center;
      label{
        position: absolute;
        top: 28px;
        left: 32%;
        width: 100%;
        z-index: 99;
      }
      i{
        color: #EAF0F6;
        font-size: 40.2px;
      }
    }

  }
  .static-wraper{
    position: relative;
  }
  .static-chart{
    display: inline-block;
    margin-left: 10px;
    width: 280px;
    height: 255px;
  }
  .client-chart{
    width: 100%;
    height: 405px;
  }
  .client-chart-nodata{
    margin: 22px auto 33px auto;
    // padding-top: 11px;
    width: 240px;
    height: 240px;
    line-height: 240px;
    text-align: center;
    font-size: 18px;
    border-radius: 100%;
    background-color: #EAF0F6;
    color: #7C98B6;
  }
  .forbid-client{
    .client-legend{
      position: absolute;
      bottom: 70px;
      left: 100px;
      &>p span{
        margin-right: 6px;
        margin-bottom: 10px;
        color: #4F6D95;
        i{
          display: inline-block;
          margin-right: 3px;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          /*background-color: #FCA21D;*/
        }
      }
      .client-desc{
        margin-bottom: 10px;
      }
      .client-desc1{
        margin-left:28px;
      }
      &>.client-desc span:nth-child(5) i{
        background-color: #fd5656;
      }
      &>.client-desc1 span:nth-child(1) i{
        background-color: #2AE0E7;
      }
      &>.client-desc1 span:nth-child(2) i{
        background-color: #FFDC0D;
      }
      &>.client-desc1 span:nth-child(3) i{
        background-color:  #B3D517;
      }
      &>.client-desc1 span:nth-child(4) i{
        background-color:  #b1e182;
      }
      &>.client-desc span:nth-child(1) i{
        background-color: #5488F9;
      }
      &>.client-desc span:nth-child(2) i{
        background-color: #FB509F;
      }
      &>.client-desc span:nth-child(3) i{
        background-color: #00B8CC;
      }
      &>.client-desc span:nth-child(4) i{
        background-color: #FCA21D;
      }
    }
  }
  .curr-static{
    margin: 66px auto 70px auto;
    text-align: center;
    em,span,p{
      display: block;
    }
    em{
      color: #B0C1D4;
      font-size: 12px;
    }
    span{
      height: 53px;
      line-height: 40px;
      color: #4F6D95;
      font-size: 13px;
    }
    .curr-static-high{
      text-align: center;
      span{
        display: inline-block;
        min-width: 200px;
        height: 18px;
        line-height: 18px;
        font-size: 13px;
        color: #fff;
        background-color: #5488F9;
      }
      i{
        margin: 0 3px;
      }
    }
    .big-num{
      margin: 0 4px;
      font-size: 30px;
      color: #5488F9;
      font-weight: bold;
    }
  }
  .lastest-15{
    margin: 0 auto;
    width: 88%;
    padding-left: 46px;
    border-top: 1px solid #EAF0F6;
    span{
      display: inline-block;
      width: 192px;
      font-size: 16px;
      color: #4F6D95;
      em{
        font-weight: bold;
      }
    }
    /*span.nth-child(2){*/
      /*width: 222px;*/
    /*}*/
    span:last-child{
      width: 100px;
    }
  }
  .tiny-tit{
    margin: 27px 0 12px 0;
    color: #7C98B6;
    font-size: 13px;
  }
  .market-all{
    margin: 45px auto;
    text-align: center;
    &>div{
      float: left;
      margin-bottom: 106px;
      width: 39%;
      padding-left: 11%;
      text-align: left;
      label{
        font-size: 12px;
        color: #7C98B6;
      }
      p{
        margin-top: 10px;
        font-size: 40px;
        color: #333;
      }
    }
  }
  .flow-browse{
    padding:20px 0;
    height: 180px;
    width:1200px;
    margin: 20px auto 0;
    background: #FFFFFF;
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);
    border-radius: 4px;
    &:hover{
      box-shadow:0 0 14px rgba(84, 136, 249, 0.25)
    }
    .flow-title{
      padding:0 20px;
      margin-bottom: 50px;
      .title{
        font-size: 18px;
        color: #33475B;
        letter-spacing: 0;
      }
      .fr{
        float:right;
        margin-right:10px;
        .flow-recent{
          display: inline-block;
          font-size: 13px;
          color: #7C98B6;
          line-height:20px;
          margin-left: 11px;
          cursor: pointer;
          &:hover{
            color: #5488F9;
          }
        }
        .selected{
          border-bottom: 2px solid #5488F9;
          color: #5488F9;
        }
      }
    }
    .flow-data{
      width:1200px;
      li{
        width:20%;
        float: left;
        .data-loading{
          display: inline-block;
          width:100px;
          height: 40px;
          /*background: #EAF0F6;*/
          position: relative;
          left:30%;
          background: #F5F8FA;
          .animation(loadingColor,1s,infinite);
        }
        .data{
          text-align: center;
          font-size: 40px;
          color: #33475B;
        }
        .line{
          width:2px;
          height: 60px;
          background: #EAF0F6;
          display: inline-block;
          position: relative;
          top: -69px;
          left:240px;
        }
        .name{
          text-align: center;
          font-size: 13px;
          color: #7C98B6;
          margin-top: 16px;
        }
      }
    }
  }
  .view-container{
    width:1200px;
    min-width:1200px;
    margin: 0 auto;
    font-size: 0;
    // font-size: 13px;
    // loadding 样式
    .text-loadding{
      position:absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
      background: white;
      .loading-title{
        display: inline-block;
        width:97px;
        height: 18px;
        .loadbg()
      }
      // 网站统计loadding部分
      .static-title{
        width:97px;
        height: 18px;
        .loadbg()
      }
      .static-content{
        width:145px;
        height: 33px;
        .loadbg()
      }
      .static-chart{
        margin-left: 16px;
        margin-top: 35px;
        width: 260px;
        height: 140px;
        .loadbg();
      }
      .condition-day{
        width:47px;
        height: 18px;
        .loadbg()
      }
      // 询盘loading部分
      .loading-tr{
        margin:33px auto;
        width: 531px;
        height: 18px;
        .loadbg();
        &:first-child{
          margin-top:76px;
        }
        &:nth-child(6){
          width:167px;
        }
      }
      // 精准推荐部分
      .r-head{
        .loadbg()
      }
      .r-name{
        height: 15px;
        width:158px;
        .loadbg()
      }
      .r-about{
        height: 15px;
        width:360px;
        .loadbg()
      }
      // 生日提醒
      .b-head{
        width:40px;
        height: 40px;
        .loadbg()
      }
      .b-name{
        width:91px;
        height: 12px;
        .loadbg()
      }
      .b-job{
        background: #F5F8FA;
        width:128px;
        height: 12px;
        margin:0 auto;
      }
      .b-job-title{
        width:68px;
        height: 12px;
        .loadbg()
      }
      .b-time{
        width:183px;
        height: 23px;
        margin: 0 auto;
        .loadbg()
      }
      .b-mail-btn-bg{
        width:145px;
        height: 33px;
        margin: 10px auto;
        .loadbg()
      }
      // 学堂部分
      .y-pic-wraper{
        width:252px;
        height: 170px;
        .loadbg()
      }
      .y-title{
        width:86px;
        height: 17px;
        .loadbg()
      }
      .y-about{
        width:252px;
        height: 14px;
        .loadbg()
      }
      // 当前在线
      .curr-static{
        em,p,span{
          margin: 20px auto 0 auto;
          width: 160px;
          height: 20px;
          .loadbg()
        }
      }
      .lastest-15{
        border-top: 0;
        p,span{
          margin-bottom: 10px;
          width: 80px;
          height: 20px;
          .loadbg()
        }
        span{
          width: 120px;
        }
      }
      .static-pie{
        display: block;
        margin: 0 auto;
        width: 240px;
        height: 240px;
        border-radius: 100%;
        .loadbg()
      }
      .load-tr{
        /*text-align: center;*/
        display: inline-block;
        position: relative;
        top:14px;
        margin-left:77px;
      }
      .load-td{
        display: inline-block;
        margin: 0 80px 20px 20px;
        width: 60px;
        height: 20px;
        .loadbg()
      }
    }
    .text-load{
      position: relative;
    }
    .loadbg(){
      background: #F5F8FA;
      .animation(loadingColor,1s,infinite);
    }
    .none-data-tip{
      position:absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
      margin:auto;
      width:130px;
      height: 118px;
      color:#4F6D95;
      font-size: 12px;
      text-align: center;
    }
    .loading{
      position:absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
      margin:auto;
    }
    .table-tmpl{
      /*position: relative;*/
      .el-dropdown{
        position: absolute;
        z-index: 8;
        left: 55%;
        top: 19px;
      }
      margin-top: -7px;
      .el-table__header-wrapper{
        height: 44px;
          border-bottom: 1px solid #EAF0F6;

        .is-leaf{
          .cell{
            color:#7C98B6;
            font-weight: 400;
          }
        }
      }
      .el-table__header-wrapper thead div, .el-table th{
        background: #F5F8FA;
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
          background-color: #F5F8FA;
      }
      .el-table{
        border: 1px solid #EAF0F6;
        border-bottom:none;
      }
      .el-table th.is-leaf, .el-table td {
          border-bottom: 1px solid #EAF0F6;
      }
      .el-table th, .el-table td{
        height: 50px;
      }
      .el-table .cell {
        color:#33475B;
        white-space: nowrap;
        text-overflown:ellipsis;
        overflow-x: hidden;
        font-size: 13px;
        .inquire-name{
         color:#33475B;
        }
      }
    }
    .table-tmpl-off{
      position: relative;
    }
    .page-center{
      text-align: center;
      position: relative;
      width:100%;
      /*bottom:24px;*/
      .el-pager li.active {
        margin-top:-1px;
        border:1px white solid;
        background: none;
        color:#5488F9;
        font-weight: bolder;
      }
      .el-pagination li, .el-pagination li.active + li {
          border: none;
      }
      .el-pagination{
        color:#4F6D95;
        margin:0px;
        text-align: center;
        .btn-prev, .btn-next{
          border:none;
        }
        button{
          color:#4F6D95;
        }
        button.disabled{
          color: #e4e4e4;
        }
      }
    }
    .block-title{
      padding: 24px 20px 20px 18px;
      color:@font-title-color;
      font-size: 18px;
      // padding:20px;
      a{
        color:@font-title-color;
      }
      .title-icon{
        color:#7C98B6;
        margin-top:-3px;
        font-size:14px;
        font-weight: 500;
        cursor: pointer;
      }
      .fr{
        float: right;
        margin-right: 11px;
      }
      .condition-day{
        display: inline-block;
        color:@detailTextColor;
        font-size: 13px;
        line-height: 20px;
        margin-left: 17px;
        cursor: pointer;
      }
      .condition-day:hover{
        color:#5488F9;
      }
      .view-more:hover{
        text-decoration: underline;
        color:#5488F9;
      }
      .selected{
        border-bottom: 2px solid @activeBlue;
        color:@activeBlue;
      }
      .small-tip{
        margin-left: -6px;
        font-size: 12px;
        color: #B0C1D4;
      }
    }
    .static-item{
      text-align: left;
      margin-left:60px;
      display: inline-block;
      width:230px;
      margin-top:37px;
      overflow: hidden;
      &:nth-child(-n+4):not(:nth-child(-n+2)){
        margin-top:92px;
      }
      .static-title{
        color:#7C98B6;
        font-size: 13px;
      }
      .static-content{
        font-family: HelveticaNeueLTPro-Th;
        font-weight: 300;
        letter-spacing: 0;
        color:#333333;
        font-size: 40px;
        margin-top:16px;
      }
    }
    .web-info, .inquire-customer{
      background: white;
      border-radius: 4px;
      box-shadow: 0 0 6px rgba(0,0,0,.06);
      display:inline-block;
      width:590px;
      height: 420px;
      margin-top:16px;
      vertical-align: top;
      font-size: 14px;
      position: relative;
    }
    .client-source, .inquire-box, .market-mail{
      margin-top: 16px;
    }
    .inquire-customer{
      margin-left: 17px;
    }
    .birthday-block, .ying-class-block{
      background: white;
      border-radius: 4px;
      box-shadow: 0 0 6px rgba(0,0,0,.06);
      display:inline-block;
      width: 590px;
      height: 644px;
      margin-top:17px;
      vertical-align: top;
      font-size: 14px;
      margin-bottom:30px;
      position: relative;
    }
    .ying-class-block{
      margin-left:16px;
      .y-items{
        .y-item{
          cursor: pointer;
          vertical-align: top;
          display: inline-block;
          margin-top:45px;
          margin-left:21px;
          width:253px;
          &:hover {
            .y-pic {
             transform:scale(1.2);
            }
            .y-title{
              color:@activeBlue;
            }
          }
          &:nth-child(1){
            margin-top:10px;
          }
          &:nth-child(2){
            margin-left:44px;
            margin-top:10px;
          }
          &:nth-child(4){
            margin-left:44px;
          }
          .y-title{
            font-size: 16px;
            color:@textColor;
            margin-top:8px;
            font-weight: bolder;
            transition:all 1s;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .y-about{
            color:@detailTextColor;
            font-size: 13px;
            line-height: 18px;
            margin-top:4px;
            height: 36px;
            overflow: hidden;
            letter-spacing: 1px;
          }
          .y-pic-wraper{
            overflow: hidden;
            height: 170px;
            position: relative;
            .y-pic{
              transition:all 1s;
            }

            .readed{
              font-size: 13px;
              box-sizing: border-box;
              position: absolute;
              bottom:0px;
              background: rgba(0, 0, 0, 0.37);
              background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.7));
              width:100%;
              height: 40px;
              line-height: 40px;
              padding-left:8px;
              color:white;
            }
          }
        }
      }

    }
    //最近动态部分
    .dynamicR{
      height: 438px;
    }
    .dynamic{
      position: relative;
      width:100%;
      /*height: 438px;*/
      margin-top: 16px;
      background: #FFFFFF;
      box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);
      border-radius: 4px;
      font-size: 13px;
      &:hover{
        box-shadow: 0 0 14px rgba(84, 136, 249, 0.25);
      }
      .loading-dy{
        width:1160px;
        height: 398px;
        padding: 20px;
        .loading-title{
          width:110px;
          height: 18px;
          margin-top: 10px;
          margin-bottom: 33px;
          .loadbg()
        }
        .loading-div{
          width:inherit;
          height: 18px;
          margin-bottom: 33px;
          .loadbg()
        }
      }
      .d-name{
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        color: #33475B;
        padding-left: 20px;
      }
      .d-data{
        .d-title{
          width:99.9%;
          height: 50px;
          line-height: 50px;
          background: #F5F8FA;
          border: 1px solid #EAF0F6;
          color: #7C98B6;
        }
        .dynamic-nodata{
          text-align: center;
          margin-top: 90px;
        }
        .d-list{
          width:99.9%;
          height: 44px;
          line-height: 44px;
          background: #FFF;
          border-bottom: 1px solid #EAF0F6;
          color: #7C98B6;
          &:hover{
            background: #F5F8FA;
          }
        }
        .noread{
          color: #33475B;
          font-weight: bold;
          width:99.9%;
          height: 44px;
          line-height: 44px;
          background: #FFF;
          border-bottom: 1px solid #EAF0F6;
          &:hover{
            background: #F5F8FA;
          }
        }
        li{
          float: left;
        }
        .recently{
          width:717px;
          height: inherit;
          padding-left: 30px;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .textColor{
            color: #33475B;
          }
          .textBold{
            font-weight: bold;
            color: #33475B;;
          }
          em{
          }
          .fb{
            color: #577ECE;
          }
          .tw{
            color: #48B3FE;
          }
        }
        .name{
          display: inline-block;
          height: inherit;
          width:307px;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .time{
          display: inline-block;
          height: inherit;
          width:144px;
        }
      }
      .dynamic-page{
        text-align: center;
        margin-top: 30px;
        padding-bottom: 34px;
        .el-pagination{
          text-align: center;
        }
      }
    }
    .birthday-block {
      .b-item{
        &:hover{
          background: #F5F8FA;
        }
        box-sizing: border-box;
        width:260px;
        display: inline-block;
        margin:10px 15px;
        text-align: center;
        vertical-align: top;
        height: 249px;
        .b-close{
          text-align: right;
          color:@detailTextColor;
          font-size: 17px;
          position: relative;
          height: 20px;
          width:100%;
          span{
            position: absolute;
            right:6px;
            top:6px;
            margin:15px;
            cursor: pointer;
          }
        }
        .b-head{
          width:40px;
          height:40px;
          margin: 5px auto;
          border-radius: 50%;
          overflow: hidden;
          img{
            cursor: pointer;
          }
        }
        .b-name{
          font-size: 13px;
          color:@textColor;
          font-weight: bold;
          margin:8px auto;
        }
        .b-job{
          font-size: 12px;
          color:@detailTextColor;
          height: 14px;
          line-height: 14px;

        }
        .b-job-title{
          font-size: 12px;
          line-height: 14px;
           color:@detailTextColor;
           margin:4px auto 16px auto;
           height: 14px;

        }
        .b-line{
          width:100%;
          height: 0;
          border-bottom: 1px solid #EAF0F6;
        }
        .b-time{
          font-size: 18px;
          margin-top:16px;
          color:@detailTextColor;
          .b-day{
           color:@textColor;
          }
          .b-date{
           color:@textColor;
          }
        }
        .b-mail-btn{
          font-size: 13px;
          width:140px;
          height: 28px;
          line-height: 28px;
          margin:20px auto;
          background: #5488F9;
          color:white;
          border-radius: 4px;
          cursor: pointer;
          .icon-font{
            font-size: 18px;
          }
        }
      }
    }
    .recommend-block-r{
      height: 266px;
    }
    // 精准推荐样式
    .recommend-block{
      background: white;
      border-radius: 4px;
      box-shadow: 0 0 6px rgba(0,0,0,.06);
      display:inline-block;
      width:1200px;
      /*height: 266px;*/
      margin-top:16px;
      position: relative;
      padding-bottom: 8px;
      .recommend-item{
        position: relative;
        display: inline-block;
        margin-left:10px;
        margin-right: 35px;
        // margin-left: 6px;
        height: 74px;
        width:550px;
        padding:20px 10px;
        box-sizing: border-box;
        .r-head{
          margin-top: -8px;
          width:40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          display: inline-block;
          vertical-align: top;
          cursor: pointer;
        }
        .r-info{
          display: inline-block;
          margin-left:8px;
          margin-top: -4px;
          width:450px;
          max-height: 53px;
          font-size: 13px;
          overflow: hidden;
          vertical-align: top;
          .r-name{
            color:#33475B;
            font-weight: bold;
            cursor: pointer;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            i{
              margin-right: 5px;
              color: #B0C1D4;
            }
            .wake-name{
              font-size: 13px;
              color: #7C98B6;
            }
            .wake-line{
              display: inline-block;
              width:1px;
              height: 15px;
              vertical-align: middle;
              margin-left: 3px;
              margin-right: 3px;
              background: #DFE3EB;
            }
            .wake-company{
              font-size: 12px;
              color: #7C98B6;
            }
            .light{
              color:#B0C1D4;
              position: relative;
              &:after{
                content: '';
                position: absolute;
                top:6px;
                right:2px;
                width:5px;
                height:8px;
                border-left:1px solid #DFE3EB;
              }
            }
          }
          .wake-day{
            font-size: 16px;
            color: #33475B;
            margin-top: 2px;
            span{
              font-size: 20px;
              color:  #4990E2;
            }
          }
          .r-about{
            cursor: pointer;
            line-height: 18px;
            margin-top:8px;
            color:#7C98B6;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            .key-word,.type{
              color:#00B8CC;
              margin-left:5px;
              margin-right:5px;
              &:first-child{
                margin-left:0px;
              }
            }
          }
        }
        .r-icons{
          position: absolute;
          right: 0;
          top: 31px;
          .operation{
            font-size: 13px;
            color: #4990E2;
          }
          a, i{
            margin-right: 10px;
            font-size: 13px;
          }
          .icon-message{
            color: #00B8CC;
          }
          .icon-pinterest2{
            color: #F9645F;
          }
          .icon-fill{
            color: #00A8FF;
          }
          .icon-user{
            color: #00A8FF;
          }
          .icon-tel{
            color: #5388f9;
          }
        }
      }
      .recommend-item:hover{
        background: #F5F8FA;
      }
    }
    .lead-box{
      .recommend-item{
        .r-info{
          margin-top: -4px;
          width: 350px;
        }
      }
    }
    .birthday-block:hover, .ying-class-block:hover,.recommend-block:hover,.web-info:hover, .inquire-customer:hover{
        box-shadow: 0 0 14px rgba(84, 136, 249,.25);
    }
  }
  div.check-dialog{
    .el-dialog{
      width: 620px;
      height: 320px;
      .el-dialog__header{
        padding-bottom: 15px;
        border-bottom: 1px solid #DFE3EB;
        .el-dialog__title{
          color: #33475B;
        }
      }
      .el-dialog__body{
        text-align: center;
        img{
          margin-top: 15px;
          width: 96px;
        }
        p{
          margin-top: 18px;
          color: #4F6D95;
          font-size: 13px;
        }
        .check-text{
          margin-top: 28px;
          color: #33475B;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
.el-dropdown-menu{
  background: #FFFFFF;
  border: 1px solid #CBD6E2;
  box-shadow: 0 2px 4px 0 rgba(51,71,91,0.20);
  border-radius: 8px;
}
.el-dropdown-menu__item{
  font-size: 13px;
  color: #33475B;
  letter-spacing: 0;
}
.el-dropdown-menu__item:not(.is-disabled):hover{
  background: #F4F6F8;
}
</style>
