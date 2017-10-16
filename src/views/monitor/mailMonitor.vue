<template>
  <div class="mail-monitor">
    <div class="list-container" :style="{width:isShowDetail?mailListWidth:''}" :class="isNoData?'list-no-data':''">
      <div class="select-section" :style="{width:isShowDetail?mailListWidth:''}">
        <div class="select-container">
          <el-select class="choose-state" :class="visibleChangeFir?'active':''" v-model="stateValue" placeholder="全部状态" @visible-change="visibleChange('state')" @change="stateFilter">
            <el-option
              class="state-option"
              v-for="(option,index) in stateItems"
              :label="option.label"
              :key="index"
              :value="option.stateValue">
            </el-option>
          </el-select>
          <el-select class="choose-time" :class="visibleChangeSec?'active':''" v-model="timeValue" placeholder="最近7天" @visible-change="visibleChange('time')" @change="timeFilter">
            <el-option
              class="time-option"
              v-for="(option,index) in timeItems"
              :label="option.label"
              :key="index"
              :value="option.timeValue">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="mail-panel" ref="panelHeight">
        <div class="mail-list" :style="{width:isShowDetail?mailListWidth:''}">
          <ul class="list-header">
            <li class="contact">联系人</li>
            <li class="title">邮件标题</li>
            <div class="hide-container" v-if="!isShowDetail">
              <li class="state">邮件状态</li>
              <li class="openNum">
                打开次数
                <span class="sort-operate">
                  <i class="el-icon-caret-top" :class="orderBy == 'OPERATE_TIME ASC'?'active':''" @click="sortList('OPERATE_TIME ASC')"></i>
                  <i class="el-icon-caret-bottom" :class="orderBy == 'OPERATE_TIME DESC'?'active':''" @click="sortList('OPERATE_TIME DESC')"></i>
                </span>
              </li>
              <li class="time">
                监控时间
                <span class="sort-operate">
                  <i class="el-icon-caret-top" :class="orderBy == 'VISIT_DATE ASC'?'active':''" @click="sortList('VISIT_DATE ASC')"></i>
                  <i class="el-icon-caret-bottom" :class="orderBy == 'VISIT_DATE DESC'?'active':''" @click="sortList('VISIT_DATE DESC')"></i>
                </span>
              </li>
            </div>
          </ul>
          <div class="list-content" :style="{width:isShowDetail?mailListWidth:''}" v-if="!isListLoading && !isNoData">
            <ul v-for="(item,index) in mailList" @click="showDetail(item, index)" class="list-body" :class="curClickIndex == index?'clicked':''">
              <li class="contact">
                <img :src="item.contactsAvatar || defaultAvatar" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
                <span class="receive-box" :title="item.contactName">{{item.personal || '-'}}</span>
              </li>
              <li class="title">
                <span :title="item.mailSubject">{{item.subject}}</span>
              </li>
              <div class="hide-container" v-if="!isShowDetail">
                <!--<li class="state">{{item.status == 0?'已收到':item.status == 1?'已打开':'已回复'}}</li>-->
                <li class="state">{{item.status == 0?'已送达':item.status == 1?'已打开':'已点击'}}</li>
                <li class="openNum">{{item.count}}</li>
                <li class="time">{{item.createTime | time-formater-has-hour}}</li>
                <li class="operate">
                  <el-tooltip effect="dark" content="查看" placement="top">
                    <i class="icon-font iconFont-eye">&#xe60c;</i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="回复" placement="top">
                    <i class="icon-font iconFont-reply" @click="linkMailReply($event,item)" :class="item.contactsId?'':'disabled'">&#xe62f;</i>
                  </el-tooltip>
                </li>
              </div>
            </ul>
            <div class="page-container">
              <el-pagination
                layout="prev, pager, next, sizes, jumper"
                :page-sizes="[10, 20, 30, 40]"
                @current-change="recommendCurrentChange"
                @size-change="sizeChange"
                :current-page="recommendPage.page"
                :page-size="recommendPage.pageSize"
                :total="recommendPage.totalCount">
              </el-pagination>
            </div>
          </div>
          <div class="load-container" :style="{width:isShowDetail?mailListWidth:''}" v-if="isListLoading">
            <div class="loading loading-circle"></div>
          </div>
          <div class="no-data" v-if="isNoData && isBindMail && !isListLoading">
            <div class="center-section">
              <img src="../../assets/img/monitor/noData.png">
              <div class="publish-over">
                <p>暂无邮件追踪数据</p>
              </div>
            </div>
          </div>
          <div class="no-data" v-if="isNoData && !isBindMail && !isListLoading">
            <div class="center-section">
              <img src="../../assets/img/monitor/no-bindMail.png">
              <div class="publish-over">
                <p>还未绑定邮箱，点击绑定邮箱地址</p>
                <el-button @click="bindMail">绑定邮箱</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-section" v-if="isShowDetail">
      <div class="head-title">
        <span>详情</span>
        <i class="icon-font" @click="closeDetail">&#xe602;</i>
      </div>
      <div class="detail-content" v-if="!isDataBuffer">
        <div class="detail-operate">
          <span class="operate-state">
            状态：<span class="text-bold">{{mailStatusMsg}}</span>
          </span>
          <span class="operate-num">
            打开次数：<span class="text-bold">{{openTimes}}</span>
          </span>
          <span class="operate-reply" :class="contactsId?'':'disabled'" @click="linkMailReply">
            <i class="icon-font">&#xe62f;</i><strong>回复</strong>
          </span>
        </div>
        <div class="mail-content">
          <p class="detail-title text-bold">{{item.subject}}</p>
          <p class="people" v-if="item.receiver && item.receiver.length > 0">
            收件人：
            <span v-for="(person,index) in item.receiver" v-if="index < 5 || item.receiverShowMore">
              <span class="detail-name text-bold" :title="person.contacts?person.contacts.name:person.name">{{person.contacts?person.contacts.name:person.name}}</span>
              <span class="mail-address">
                &lt;<span class="detail-screenName" :title="person.screenName">{{person.screenName}}</span>&gt;
                <span v-show="item.receiver.length > 1 && index < item.receiver.length - 1">;&nbsp;</span>
              </span>
            </span>
            <span class="showMore" v-if="item.receiver.length > 5 && !item.receiverShowMore" @click="personShowMore('receiver')">显示更多</span>
          </p>
          <p class="people" v-if="item.coyper && item.coyper.length > 0">
            抄送人：
            <span v-for="(person,index) in item.coyper" v-if="index < 5 || item.coyperShowMore">
              <span class="detail-name text-bold" :title="person.name">{{person.name}}</span>
              <span class="mail-address">
                &lt;<span class="detail-screenName" :title="person.screenName">{{person.screenName}}</span>&gt;
                <span v-show="item.coyper.length > 1 && index < item.coyper.length - 1">;&nbsp;</span>
              </span>
            </span>
            <span class="showMore" v-if="item.coyper.length > 5 && !item.coyperShowMore" @click="personShowMore('coyper')">显示更多</span>
          </p>
          <p class="people" v-if="item.secreter && item.secreter.length > 0">
            密送人：
            <span v-for="(person,index) in item.secreter" v-if="index < 5 || item.secreterShowMore">
              <span class="detail-name text-bold" :title="person.name">{{person.name}}</span>
              <span class="mail-address">
                &lt;<span class="detail-screenName" :title="person.screenName">{{person.screenName}}</span>&gt;
                <span v-show="item.secreter.length > 1 && index < item.secreter.length - 1">;&nbsp;</span>
              </span>
            </span>
            <span class="showMore" v-if="item.secreter.length > 5 && !item.secreterShowMore" @click="personShowMore('secreter')">显示更多</span>
          </p>
          <p class="people">
            发件人：
            <span>
              <span class="detail-name text-bold" :title="item.sender.name">{{item.sender.name}}</span>
              <span class="mail-address">&lt;<span class="detail-screenName" :title="item.sender.screenName">{{item.sender.screenName}}</span>&gt;</span>
            </span>
          </p>
          <div class="mail-text" v-html="item.content"></div>
          <div class="enclosure" v-if="item.messageFile && item.messageFile.length>0">
            <p v-for="(file,index) in item.messageFile">
              <i class="icon-font">&#xe7bc;</i>
              <a :href="file.filePath" target="_blank"><span>{{file.fileName}}</span></a>
            </p>
          </div>
        </div>
      </div>
      <div class="detail-content buffer" v-if="isDataBuffer">
        <div class="detail-operate"></div>
        <div class="mail-content">
          <p class="detail-title"></p>
          <p class="people"></p>
          <p class="people"></p>
          <p class="people"></p>
          <p class="people"></p>
          <div class="mail-text"></div>
          <div class="mail-image"></div>
          <div class="enclosure"></div>
        </div>
      </div>
    </div>
    <div class="clearBoth"></div>
  </div>
</template>

<script>
  import MonitorAPI from '@/api/monitorAPI'

  export default{
    data () {
      return {
        userId: window.localStorage.userId,
        defaultAvatar: '../../static/img/default_avatar.png',
        stateItems: [
          {
            stateValue: 'option-1',
            label: '全部状态'
          }, {
            stateValue: 'option-2',
            label: '已送达'
          }, {
            stateValue: 'option-3',
            label: '已打开'
          }, {
            stateValue: 'option-4',
            label: '已点击'
          }],
          /* {
            stateValue: 'option-4',
            label: '已回复'
          } */
        timeItems: [
          {
            timeValue: 'option-1',
            label: '全部'
          }, {
            timeValue: 'option-2',
            label: '最近7天'
          }, {
            timeValue: 'option-3',
            label: '最近15天'
          }, {
            timeValue: 'option-4',
            label: '最近30天'
          }
        ],
        stateValue: 'option-1',
        curStatus: -1, // 当前筛选状态
        timeValue: 'option-2',
        startTime: '', // 开始时间
        visibleChangeFir: false,
        visibleChangeSec: false,
        firstClick: true,
        secondClick: true,
        mailList: [],
        channelList: [],
        item: {},
        hasEnclosure: false, // 是否包含附件
        isDataBuffer: false, // 详情数据是否缓冲
        isListLoading: false, // 列表是否正在加载
        isNoData: false, // 当前列表是否有数据
        isBindMail: false, // 当前是否绑定邮箱
        mailListWidth: '640px',  // 列表宽度
        isShowDetail: false,  // 是否展示详情
        curClickIndex: -1, // 当前展示详情的索引
        mailStatusMsg: '', // 保存列表邮件状态
        openTimes: -1, // 保存列表打开次数
        contactsId: '', // 保存邮件人是否是联系人
        contactsType: -1, // 保存列表记录
        messageId: '', // 保存列表记录
        bindingMail: {}, // 保存绑定邮箱信息
        recommendPage: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        }, // 分页初始配置
        orderBy: 'VISIT_DATE DESC' // 保存列表排序参数
      }
    },
    mounted () {
      this.getChannelList()
      this.getSpecificTime(7)
      this.getMailList()
    },
    computed: {
      timerMonitor () {
        return this.$store.state.monitor.timerMonitor
      },
      mindex () {
        return this.$store.state.monitor.mindex
      }
    },
    watch: {
      timerMonitor () {
        if (this.mindex === 1) {
          this.orderBy = 'VISIT_DATE DESC'
          this.recommendPage = {
            page: 1,
            pageSize: 10,
            totalCount: 0
          }
          this.curStatus = -1
          this.getSpecificTime(7)
          this.getMailList()
        }
      }
    },
    methods: {
      /*
      * 控制 select 被选中的状态
      * */
      visibleChange (type) {
        if (type === 'state') {
          if (this.firstClick) {
            this.firstClick = false
            this.visibleChangeFir = true
          } else {
            this.firstClick = true
            this.visibleChangeFir = false
          }
        } else {
          if (this.secondClick) {
            this.secondClick = false
            this.visibleChangeSec = true
          } else {
            this.secondClick = true
            this.visibleChangeSec = false
          }
        }
      },
      /*
       * 获取绑定渠道列表
       * */
      getChannelList () {
        MonitorAPI.getChannelList().then(res => {
          if (res.data.code === 0) {
            this.channelList = res.data.data
            this.channelList.forEach((value, i) => {
              if (value.channelId === 'MAIL') {
                this.bindingMail = value
                this.bindingMail.bindingTag === 1 ? this.isBindMail = true : this.isBindMail = false
              }
            })
          }
        })
      },
      /*
       * 状态筛选改变
       * */
      stateFilter (status) {
        this.isShowDetail = false
        switch (status) {
          case 'option-1' :
            this.curStatus = -1
            break
          case 'option-2' :
            this.curStatus = 0
            break
          case 'option-3' :
            this.curStatus = 1
            break
          case 'option-4' :
            this.curStatus = 2
            break
        }
        this.getMailList()
      },
      /*
       * 时间筛选改变
       * */
      timeFilter (time) {
        this.isShowDetail = false
        switch (time) {
          case 'option-1' :
            this.startTime = ''
            break
          case 'option-2' :
            this.getSpecificTime(7)
            break
          case 'option-3' :
            this.getSpecificTime(15)
            break
          case 'option-4' :
            this.getSpecificTime(30)
            break
        }
        this.getMailList()
      },
      /**
       * 计算得到开始时间和结束时间
       * @type {Number}
       */
      getSpecificTime (recentlyTime) {
        let newDate = new Date()
        let sDate = new Date()
        let startMillionTime = newDate.getTime() - ((recentlyTime - 1) * 24 * 60 * 60 * 1000)
        sDate.setTime(startMillionTime)
        this.startTime = sDate.getFullYear() + '-' + (sDate.getMonth() + 1) + '-' + sDate.getDate()
      },
      /**
       * 询盘监控列表排序
       * @return {[type]} [description]
       */
      sortList (type) {
        if (this.orderBy !== type) {
          this.orderBy = type
          this.getMailList()
        }
      },
      /**
       * 询盘监控列表
       * @return {[type]} [description]
       */
      getMailList () {
//        let params = {
//          page: this.recommendPage.page,
//          size: this.recommendPage.pageSize,
//          status: this.curStatus,
//          startTime: this.startTime,
//          orderBy: this.orderBy
//        }
//        this.isListLoading = true
//        MonitorAPI.getMailList(params).then(res => {
//          if (res.data.code === 0) {
//            this.isListLoading = false
//            this.mailList = res.data.data.records
//            this.mailList.length > 0 ? this.isNoData = false : this.isNoData = true
//            this.recommendPage.page = res.data.data.page
//            this.recommendPage.totalCount = res.data.data.totalCount
//          }
//        })
        let params = {
          page: this.recommendPage.page,
          size: this.recommendPage.pageSize,
          startTime: this.startTime
        }
        if (this.curStatus !== -1) {
          params.status = this.curStatus
        }
        this.isListLoading = true
        MonitorAPI.getMailLog(params).then(res => {
          if (res.data.code === 0) {
            let resdata = res.data.data
            console.log(resdata)
            this.isListLoading = false
            this.mailList = resdata.records
            this.mailList.length > 0 ? this.isNoData = false : this.isNoData = true
            this.recommendPage.page = resdata.page
            this.recommendPage.totalCount = resdata.totalCount
          }
        })
      },
      /**
       * 邮件监控详情
       * @return {[type]} [description]
       */
      showDetail (item, index) {
//        this.openTimes = item.openTimes
//        this.mailStatusMsg = item.status === 0 ? '已收到' : item.status === 1 ? '已打开' : '已回复'
//        this.contactsId = item.contactsId
//        this.contactsType = item.contactsType
//        this.messageId = item.messageId
//        this.curClickIndex = index
//        this.isShowDetail = true
//        this.isDataBuffer = true
//        let params = {
//          userId: this.userId,
//          messageId: item.messageId
//        }
//        MonitorAPI.getMailDetail(params).then(res => {
//          if (res.data.code === 0) {
//            this.isDataBuffer = false
//            this.item = res.data.data
//            this.$set(this.item, 'receiverShowMore', false)
//            this.$set(this.item, 'secreterShowMore', false)
//            this.$set(this.item, 'coyperShowMore', false)
//            console.log(this.item)
//          }
//        })
        this.openTimes = item.count  // 邮件打开次数
        this.mailStatusMsg = item.status === 0 ? '已送达' : item.status === 1 ? '已打开' : '已点击'
        this.contactsId = item.contactsId  // 联系人id
        this.contactsType = item.contactsType // 联系人类型
        this.messageId = item.extendId   // 邮件消息id
        this.sendId = item.sendId   // 发送的邮件ID
        this.curClickIndex = index
        this.isShowDetail = true
        this.isDataBuffer = true
        let params = {
          extendId: item.extendId
        }
        MonitorAPI.getMailDetailNew(params).then(res => {
          if (res.data.code === 0) {
            this.isDataBuffer = false
            this.item = res.data.data
            this.$set(this.item, 'receiverShowMore', false)
            this.$set(this.item, 'secreterShowMore', false)
            this.$set(this.item, 'coyperShowMore', false)
            // console.log(this.item)
          }
        })
      },
      closeDetail () {
        this.curClickIndex = -1
        this.isShowDetail = false
      },
      /*
      * 点击显示更多 展示 person详情
      * */
      personShowMore (type) {
        switch (type) {
          case 'secreter' : this.item.secreterShowMore = true
            break
          case 'receiver' : this.item.receiverShowMore = true
            break
          case 'coyper' : this.item.coyperShowMore = true
            break
        }
      },
      /**
       * 邮件回复
       * @return {[type]} [description]
       */
      linkMailReply (event, item) {
        let params = {
          contactId: '',
          actionType: 0,
          messageId: '',
          contactType: -1,
          messageType: 'mail'
        }
        if (item) {
          event.stopPropagation()
          params.contactId = item.contactsId
          params.contactType = item.contactsType
          params.messageId = item.messageId
        } else {
          params.contactId = this.contactsId
          params.contactType = this.contactsType
          params.messageId = this.messageId
        }
        if (params.contactId) {
          this.$router.push({path: '/contactDetail', query: params})
        } else {
          this.$message({
            message: '该用户未添加到联系人',
            type: 'error'
          })
        }
      },
      /*
       * currentPage 改变触发
       * */
      recommendCurrentChange (page) {
        this.recommendPage.page = page
        this.getMailList()
      },
      sizeChange (pageSize) {
        this.recommendPage.pageSize = pageSize
        this.getMailList()
      },
      /*
      * 绑定邮箱
      * */
      bindMail () {
        this.$router.push({path: '/channelList'})
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/variable';
  @import '../../assets/style/page';
  .mail-monitor{
    ::-webkit-input-placeholder {
      color: @textColor;
    }
    :-moz-placeholder {
      color: @textColor;
    }
    ::-moz-placeholder {
      color: @textColor;
    }
    :-ms-input-placeholder {
      color: @textColor;
    }
    .text-bold{
      font-weight: bolder;
    }
    padding-bottom: 30px;
    .clearBoth {
      clear: both;
    }
    .list-container{
      float: left;
      width: 1200px;
      height: 898px;
      background: @white;
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
      &.list-no-data{
        height: 580px;
      }
      .select-section{
        width: 1200px;
        height: 60px;
        padding: 12px 20px;
        box-sizing: border-box;
        .select-container{
          float: right;
          font-size: 0;
          .choose-state{
            width:120px;
            margin-right: 8px;
          }
        }
      }
      .mail-panel{
        overflow: hidden;
        .mail-list{
          float: left;
          width: 1200px;
          .list-header li{
            font-weight: bold;
          }
          .list-header li,.list-body li{
            overflow: hidden;
            padding-left: 20px;
            font-size: 13px;
            color: @textColor;
            box-sizing: border-box;
            &.contact{
              width: 212px;
              .receive-box{
                display: inline-block;
                overflow: hidden;
                width: 130px;
                white-space: nowrap;
                text-overflow: ellipsis;
                vertical-align: top;
                font-weight: bolder;
              }
              span{
                margin-left: 5px;
              }
            }
            &.title{
              width: 425px;
              font-weight: bolder;
              span{
                display: inline-block;
                overflow: hidden;
                width: 390px;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            &.state{
              width: 130px;
            }
            &.openNum{
              width: 130px;
            }
            &.time{
              width: 190px;
            }
            &.operate{
              visibility: hidden;
              text-align: center;
              color: @disabledColor;
              i{
                font-size: 16px;
                cursor: pointer;
                &:hover{
                  color: @activeBlue;
                }
                &.iconFont-eye{
                  font-size: 18px;
                  margin-right: 16px;
                }
                &.iconFont-reply{
                  vertical-align: top;
                  &.disabled{
                    color: @disabledColor;
                  }
                }
              }
            }
          }
          .list-header{
            height: 46px;
            line-height: 46px;
            background: #F5F8FA;
            font-size: 13px;
            border-top: 1px solid #DFE3EB;
            border-bottom: 1px solid #DFE3EB;
            li{
              float: left;
            }
            .sort-operate{
              position: relative;
              font-size: 10px;
              i{
                font-weight: 100;
              }
              .el-icon-caret-top,.el-icon-caret-bottom{
                position: absolute;
                top: -1px;
                color: #B0C1D4;
                cursor: pointer;
                transform: scale(0.7)
              }
              .el-icon-caret-bottom{
                top: 6px;
              }
              .active{
                color: #02AAAA;
              }
            }
          }
          .list-content{
            .list-body{
              height: 40px;
              padding: 15px 0;
              border-bottom: 1px solid @textBorderColor;
              &:hover,&.clicked{
                background: #F5F8FA;
                .operate{
                  visibility: visible;
                }
              }
              li{
                float: left;
                line-height: 40px;
                img{
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  vertical-align: middle;
                }
              }
            }
          }
          // .page-container{
          //   box-sizing: border-box;
          //   margin-top: 16px;
          //   padding-right: 16px;
          //   text-align: right;
          //   .el-pagination{
          //     margin: 0;
          //     color: #4F6D95;
          //     .btn-prev{
          //       margin-right: 10px;
          //       border-right: 1px solid rgb(209, 213, 229);
          //       border-radius: 4px;
          //     }
          //     .btn-next{
          //       margin: 0;
          //       border-left: 1px solid rgb(209, 213, 229);
          //       border-radius: 4px;
          //     }
          //     li{
          //       margin-right: 10px;
          //       border: 1px solid rgb(209, 213, 229);
          //       border-radius: 4px;
          //       &.active{
          //         border: none;
          //       }
          //     }
          //     .el-pager li.active + li {
          //       border-left: 1px solid rgb(209, 213, 229);
          //     }
          //   }
          // }
          .load-container{
            margin: 150px 0 65px 0;
          }
          .no-data{
            height: 370px;
            padding-top: 106px;
            .center-section{
              display: inline-block;
              width: 494px;
              text-align: center;
              p{
                margin-top: 24px;
                margin-bottom: 16px;
                font-size: 16px;
                color: @textColor;
              }
              span{
                display: inline-block;
                line-height: 18px;
                font-size: 13px;
                color: #7C98B6;
              }
              .el-button{
                width: 120px;
                height: 34px;
                line-height: 34px;
                padding: 0;
                margin-top: 40px;
                font-size: 13px;
                font-weight: 100;
                background: @activeBlue;
                border: none;
                span{
                  color: @white;
                }
              }
              .publish-over{
                span{
                  display: block;
                }
              }
            }
          }
        }
      }
    }
    .detail-section{
      float: left;
      width: 550px;
      height: 898px;
      margin-left: 10px;
      background: @white;
      border-radius: 4px;
      box-shadow: 0 0 6px rgba(0,0,0,.06);
      .head-title{
        height: 59px;
        line-height: 60px;
        padding: 0 20px;
        font-size: 18px;
        border-bottom: 1px solid @textBorderColor;
        span{
          color: @textColor;
        }
        i{
          float: right;
          font-size: 16px;
          color: @detailTextColor;
          cursor: pointer;
        }
      }
      .detail-content{
        padding: 16px 20px;
        .detail-operate{
          float: right;
          height: 18px;
          font-size: 13px;
          color: @detailTextColor;
          span{
            margin-right: 12px;
            span{
              color: @textColor;
            }
            &.operate-reply{
              color: @textColor;
              cursor: pointer;
              &.disabled{
                color: @disabledColor;
              }
              i{
                margin-right: 5px;
                color: @detailTextColor;
              }
            }
          }
        }
        .mail-content{
          margin-top: 52px;
          font-size: 13px;
          color: @textColor;
          .detail-title{
            margin-bottom: 18px;
            font-size: 16px;
          }
          .people{
            line-height: 18px;
            margin-bottom: 8px;
            color: @detailTextColor;
            .detail-name{
              display: inline-block;
              max-width: 80px;
              vertical-align: text-top;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .showMore{
              text-decoration: underline;
              color: @link;
              cursor: pointer;
            }
            span{
              color: @textColor;
              .mail-address{
                color: @detailTextColor;
                .detail-screenName{
                  display: inline-block;
                  max-width: 220px;
                  vertical-align: text-top;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  color: @detailTextColor;
                }
              }
            }
          }
          .mail-text{
            max-height: 340px;
            overflow-y: auto;
            line-height: 20px;
            margin-top: 32px;
            margin-bottom: 24px;
            font-size: 14px;
            word-break: break-all;
            img{
              width: 512px;
              margin: 24px 0;
            }
          }
          .enclosure{
            p{
              i{
                margin-right: 3px;
                vertical-align: middle;
                font-size: 16px;
                color: @link;
              }
              span{
                line-height: 21px;
                color: #4F6D95;
              }
            }
          }
        }
      }
      .detail-content.buffer{
        padding: 16px 30px 16px 20px;
        .detail-operate{
          float: none;
          height: 18px;
          background: @loadingColor;
        }
        .mail-content{
          margin-top: 34px;
          .detail-title{
            height: 20px;
            background: @loadingColor;
          }
          .people{
            width: 350px;
            height: 18px;
            margin-bottom: 10px;
            background: @loadingColor;
          }
          .mail-text{
            width: 450px;
            height: 50px;
            margin-top: 32px;
            margin-bottom: 24px;
            background: @loadingColor;
          }
          .mail-image{
            width: 500px;
            height: 150px;
            margin-bottom: 24px;
            background: @loadingColor;
          }
          .enclosure{
            width: 200px;
            height: 20px;
            background: @loadingColor;
          }
        }
      }
    }
  }
</style>
