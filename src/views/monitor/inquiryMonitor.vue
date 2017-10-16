<template>
  <div class="inquiry-monitor">
    <div class="list-container" :style="{width:isShowDetail?inquiryListWidth:''}" :class="isNoData?'list-no-data':''">
      <!--<div class="select-section" :style="{width:isShowDetail?inquiryListWidth:''}">-->
        <!--<div class="select-container">-->
          <!--<el-select class="choose-time" :class="visible?'active':''" v-model="timeValue" placeholder="最近7天" @visible-change="visibleChange" @change="chooseTime">-->
            <!--<el-option-->
              <!--class="time-option"-->
              <!--v-for="(option,index) in timeItems"-->
              <!--:label="option.label"-->
              <!--:key="index"-->
              <!--:value="option.timeValue">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</div>-->
      <!--</div>-->
      <div class="inquiry-panel" ref="panelHeight">
        <div class="inquiry-list" :style="{width:isShowDetail?inquiryListWidth:''}">
          <ul class="list-header">
            <li class="contact">联系人</li>
            <li class="email">邮件地址</li>
            <div class="hide-container" v-if="!isShowDetail">
              <li class="origin">询盘来源</li>
              <li class="content">询盘内容</li>
              <li class="time">监控时间</li>
            </div>
          </ul>
          <ul v-for="(item,index) in inquiryList" @click="showDetail(item,index)" class="list-body" :class="curClickIndex == index?'clicked':''" v-if="!isNoData && !isListLoading">
            <li class="contact">
              <img :src="item.contactAvatar || defaultAvatar" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
              <p class="personName" :title="item.personName">{{item.personName}}</p>
              <p class="company" :title="item.company">{{item.company}}</p>
            </li>
            <li class="email" :title="item.email">{{item.email}}</li>
            <div class="hide-container" v-if="!isShowDetail">
              <li class="origin" :title="item.source">{{item.source || '-'}}</li>
              <li class="content" :title="item.content">{{item.content}}</li>
              <li class="time">{{item.createTime | time-formater-has-hour}}</li>
              <li class="operate">
                <el-tooltip effect="dark" content="查看" placement="top">
                  <i class="icon-font iconFont-eye">&#xe60c;</i>
                </el-tooltip>
                <el-tooltip v-if="serverLevel==='1'" effect="dark" content="回复" placement="top">
                  <i class="icon-font iconFont-reply" @click="linkMailReply($event,item)" v-if="item.contactId">&#xe62f;</i>
                  <i class="icon-font iconFont-reply disabled" @click="stopPropagation($event)" v-else>&#xe62f;</i>
                </el-tooltip>
              </li>
            </div>
          </ul>
          <div class="page-container" v-if="!isNoData && !isListLoading&&recommendPage.totalCount>recommendPage.pageSize">
            <el-pagination
              layout="prev, pager, next, sizes, jumper"
              @current-change="recommendCurrentChange"
              @size-change="sizeChange"
              :page-sizes="[10, 20, 30, 40]"
              :current-page="recommendPage.page"
              :page-size="recommendPage.pageSize"
              :total="recommendPage.totalCount">
            </el-pagination>
          </div>
          <div class="load-container" v-if="isListLoading">
            <div class="loading loading-circle"></div>
          </div>
          <div class="no-data" v-if="isNoData && !isListLoading">
            <div class="center-section">
              <img src="../../assets/img/monitor/noData.png">
              <div class="publish-over">
                <p>暂无数据，发送的询盘可在这里显示追踪结果</p>
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
          <span class="operate-time">
            {{item.createTime | time-formater-has-hour}}
          </span>
          <span class="operate-source">
            询盘来源：<span class="source-span text-bold" :title="item.source">{{item.source || '-'}}</span>
          </span>
          <span v-if="serverLevel==='1' && item.contactId" class="operate-reply" @click="linkMailReply">
            <i class="icon-font">&#xe62f;</i><strong>回复</strong>
          </span>
          <span v-if="serverLevel==='1' && !item.contactId" class="operate-reply disabled">
            <i class="icon-font">&#xe62f;</i><strong>回复</strong>
          </span>
        </div>
        <div class="inquiry-content">
          <div v-if="item.details.length>0" class="product-info">
            <img :src="item.details[0].productPicWhole" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
            <div class="right-info">
              <p>{{item.details[0].productName}}</p>
              <p>{{item.details[0].productPrice}}</p>
            </div>
          </div>
          <div class="message first-child">
            <span class="title">First Name</span>
            <span class="content">{{item.firstName || '-'}}</span>
          </div>
          <div class="message">
            <span class="title">Last Name</span>
            <span class="content">{{item.lastName || '-'}}</span>
          </div>
          <div class="message">
            <span class="title">Company</span>
            <span class="content">{{item.company || '-'}}</span>
          </div>
          <div class="message">
            <span class="title">Email</span>
            <span class="content">{{item.email || '-'}}</span>
          </div>
          <div class="message">
            <span class="title">phone</span>
            <span class="content">{{item.phone || '-'}}</span>
          </div>
          <div class="message">
            <span class="title">Comment</span>
            <span class="content" style="max-height:300px;" :title="item.content">{{item.content || '-'}}</span>
          </div>
        </div>
      </div>
      <div class="detail-content buffer" v-else>
        <div class="detail-operate"></div>
        <div class="inquiry-content">
          <div class="product-info">
            <span></span>
            <div class="right-info">
              <p></p>
            </div>
          </div>
          <div class="message first-child"></div>
          <div class="message"></div>
          <div class="message"></div>
          <div class="message"></div>
          <div class="message"></div>
          <div class="message"></div>
        </div>
      </div>
    </div>
    <div class="clearBoth"></div>
  </div>
</template>

<script>
  import MonitorAPI from '@/api/monitorAPI'

  export default{
    props: {
      spacingTime: Number
    },
    data () {
      return {
        defaultAvatar: '../../static/img/default_avatar.png',
        serverLevel: '1',
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
        timeValue: 'option-1',
        inquiryList: [],
        item: {},
        params: {},
        contactId: '',
        inquiryListWidth: '640px',  // 列表宽度
        isShowDetail: false,  // 是否展示详情
        visible: false,
        firstClick: true,
        isDataBuffer: true, // 详情是否缓冲
        isListLoading: false, // 列表是否正在加载
        isNoData: false, // 当前列表是否有数据
        curClickIndex: -1, // 当前展示详情的索引
        recommendPage: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        } // 分页初始配置
      }
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
        if (this.mindex === 2) {
          this.recommendPage = {
            page: 1,
            pageSize: 10,
            totalCount: 0
          }
          this.getInquiryList()
        }
      },
      spacingTime () {
        if (this.spacingTime !== -1) {
          this.getSpecificTime(this.spacingTime)
        } else {
          this.params = {}
        }
        this.getInquiryList()
      }
    },
    mounted () {
      this.serverLevel = window.localStorage.serverLevel
      this.getInquiryList()
    },
    methods: {
      /*
       * 控制 select 被选中的状态
       * */
      visibleChange () {
        if (this.firstClick) {
          this.firstClick = false
          this.visible = true
        } else {
          this.firstClick = true
          this.visible = false
        }
      },
      /*
       * 下拉框选择时间改变
       * */
      chooseTime (time) {
        switch (time) {
          case 'option-1' :
            this.params = {}
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
        this.getInquiryList()
      },
      /**
       * 计算得到开始时间和结束时间
       * @type {Number}
       */
      getSpecificTime (recentlyTime) {
        let newDate = new Date()
        let sDate = new Date()
        let endTime = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
        let startMillionTime = newDate.getTime() - ((recentlyTime - 1) * 24 * 60 * 60 * 1000)
        sDate.setTime(startMillionTime)
        let startTime = sDate.getFullYear() + '-' + (sDate.getMonth() + 1) + '-' + sDate.getDate()
        this.params.endTime = endTime
        this.params.startTime = startTime
        this.params.page = 1
      },
      /**
       * 询盘监控列表
       * @return {[type]} [description]
       */
      getInquiryList () {
        this.isListLoading = true
        this.params.page = this.recommendPage.page
        this.params.size = this.recommendPage.pageSize
        MonitorAPI.getInquiryList(this.params).then(res => {
          if (res.data.code === 0) {
            this.isListLoading = false
            this.inquiryList = res.data.data.records
            if (this.inquiryList.length > 0) {
              this.isNoData = false
            } else {
              this.isNoData = true
            }
            // console.log(this.inquiryList)
            this.recommendPage.page = res.data.data.page
            this.recommendPage.totalCount = res.data.data.totalCount
          }
        })
      },
      /**
       * 询盘监控详情
       * @return {[type]} [description]
       */
      showDetail (item, index) {
        this.curClickIndex = index
        this.isShowDetail = true
        this.isDataBuffer = true
        this.contactId = item.contactId
        let param = {
          id: item.id
        }
        MonitorAPI.getInquiryDetail(param).then(res => {
          if (res.data.code === 0) {
            this.isDataBuffer = false
            this.item = res.data.data
            console.log(this.item)
          }
        })
      },
      closeDetail () {
        this.curClickIndex = -1
        this.isShowDetail = false
      },
      /**
       * 询盘回复
       * @return {[type]} [description]
       */
      /**
       * 邮件回复
       * @return {[type]} [description]
       */
      linkMailReply (event, item) {
        console.log(item)
        event.stopPropagation()
        let params = {
          contactId: '',
          contactType: 0,
          messageType: 'mail'
        }
        if (item) {
          params.contactId = item.contactId
        } else {
          params.contactId = this.contactId
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
      * 阻止 回复按钮 点击出现详情
      * */
      stopPropagation (event) {
        event.stopPropagation()
      },
      /*
       * currentPage 改变触发
       * */
      recommendCurrentChange (page) {
        this.recommendPage.page = page
        this.getInquiryList()
      },
      sizeChange (pageSize) {
        this.recommendPage.pageSize = pageSize
        this.getInquiryList()
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/variable';
  @import '../../assets/style/page';
  .inquiry-monitor{
    margin-top:10px;
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
      min-height: 898px;
      background: @white;
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
      &.list-no-data{
        height: 580px;
      }
    }
    .select-section{
      width: 1200px;
      height: 60px;
      padding: 12px 20px;
      box-sizing: border-box;
      .select-container{
        float: right;
      }
    }
    .inquiry-panel{
      overflow: hidden;
      .inquiry-list{
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
          white-space:nowrap;
          text-overflow:ellipsis;
          &.contact{
            width: 230px;
            p{
              line-height: 18px;
              &.personName{
                overflow: hidden;
                margin-top: 1px;
                margin-bottom: 2px;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: bolder;
              }
              &.company{
                overflow: hidden;
                color: @detailTextColor;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          &.email{
            width: 210px;
            font-weight: bolder;
          }
          &.origin{
            width: 150px;
          }
          &.content{
            width: 340px;
          }
          &.time{
            width: 160px;
          }
          &.operate{
            width: 100px;
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
                  cursor: not-allowed;
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
        }
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
              float: left;
              width: 40px;
              height: 40px;
              margin-right: 8px;
              border-radius: 50%;
              vertical-align: middle;
            }
          }
        }
        // .page-container{
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
              &.source-span{
                display: inline-block;
                max-width: 100px;
                overflow: hidden;
                margin-right: 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: top;
              }
            }
            &.operate-reply{
              color: @textColor;
              cursor: pointer;
              i{
                margin-right: 5px;
                color: @detailTextColor;
              }
              &.disabled{
                color: @disabledColor;
                cursor: not-allowed;
              }
            }
          }
        }
        .inquiry-content{
          margin-top: 56px;
          font-size: 13px;
          color: @textColor;
          .product-info{
            padding-bottom: 16px;
            border-bottom: 1px dotted #DFE3EB;
            img{
              display: inline-block;
              width: 64px;
              height: 64px;
            }
            .right-info{
              display: inline-block;
              vertical-align: top;
              p{
                width: 428px;
                line-height: 18px;
                margin-left: 10px;
                word-break: break-all;
                &:last-child{
                  margin-top: 5px;
                }
              }
            }
          }
          .message{
            padding: 12px 0 8px;
            line-height: 21px;
            border-top: 1px dotted #DFE3EB;
            ::-webkit-scrollbar{
              width: 6px;
              background-color: #FFF;
            }
            ::-webkit-scrollbar-thumb{
              border-radius: 4px;
              background-color: @inputBorderColor;
            }
            &.first-child{
              margin-top: 12px;
              border-top: none;
            }
            span{
              display: inline-block;
              &.title{
                width: 78px;
                margin-right: 42px;
                vertical-align: top;
                color: @detailTextColor;
              }
              &.content{
                width: 367px;
                max-height: 105px;
                line-height: 21px;
                overflow-y: auto;
                word-break: break-all;
              }
            }
          }
        }
      }
      .detail-content.buffer{
        .detail-operate{
          float: left;
          width: 500px;
          height: 30px;
          background: @loadingColor;
        }
        .inquiry-content{
          .product-info{
            padding-bottom: 16px;
            border: none;
            span{
              display: inline-block;
              width: 64px;
              height: 64px;
              background: @loadingColor;
            }
            .right-info{
              display: inline-block;
              p{
                margin-top: 0;
                width: 420px;
                height: 64px;
                background: @loadingColor;
              }
            }
          }
          .message{
            width: 500px;
            height: 22px;
            padding: 0;
            margin-top: 12px;
            margin-bottom: 24px;
            border: none;
            background: @loadingColor;
            &.first-child{
              margin-top: 12px;
            }
          }
        }
      }
    }
  }
</style>
