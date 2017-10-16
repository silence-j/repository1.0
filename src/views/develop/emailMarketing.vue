<template>
  <div class="extension-container email-market">
    <emailLiftMenu @spreadSure="spreadFunc" @statusChange="statusChangeFunc"></emailLiftMenu>
    <div class="right-content-model margin-left16" :class="{spread: !expansion}">
      <!--顶部信息展示start-->
      <div class="top-info-display">
        <div class="info-display sent-rate">
          <div class="image-display"><i class="icon-sendall"></i></div>
          <div class="desc-load" v-if="marketStatisticload">
            <p class="data"></p>
            <p class="data-desc"></p>
          </div>
          <div class="desc" v-else>
            <p class="data"><span>{{ total | dataIsNull}}</span>/<span style="font-size: 14px;">{{ max | dataIsNull }}</span></p>
            <p class="data-desc">发送总量</p>
          </div>
        </div>
        <div class="info-display delivery-rate">
          <div class="image-display"><i class="icon-sendrate"></i></div>
          <div class="desc-load" v-if="marketStatisticload">
            <p class="data"></p>
            <p class="data-desc"></p>
          </div>
          <div class="desc" v-else>
            <p class="data">{{ arrivePer }}%</p>
            <p class="data-desc">送达率</p>
          </div>
        </div>
        <div class="info-display read-rate">
          <div class="image-display"><i class="icon-rendrate"></i></div>
          <div class="desc-load" v-if="marketStatisticload">
            <p class="data"></p>
            <p class="data-desc"></p>
          </div>
          <div class="desc" v-else>
            <p class="data">{{ readPer }}%</p>
            <p class="data-desc">阅读率</p>
          </div>
        </div>
        <div class="info-display click-rate">
          <div class="image-display"><i class="icon-clickrate"></i></div>
          <div class="desc-load" v-if="marketStatisticload">
            <p class="data"></p>
            <p class="data-desc"></p>
          </div>
          <div class="desc" v-else>
            <p class="data">{{ hitPer }}%</p>
            <p class="data-desc">点击率</p>
          </div>
        </div>
      </div>
      <!--顶部信息展示end-->
      <div class="data-list-five margin-top16" :class="tableDisplay()">
        <!--表数据模块start-->
        <ul class="list-header">
          <li class="checkbox">
            <el-checkbox v-model="isChecked" @change="checkAll" :disabled="isNoData"></el-checkbox>
          </li>
          <li class="title" v-show="!hasChecked">推广标题</li>
          <li class="sent-rate" v-show="!hasChecked">发送量（封）</li>
          <li class="delivery-rate" v-show="!hasChecked">送达率</li>
          <li class="read-rate" v-show="!hasChecked">阅读率</li>
          <li class="click-rate" v-show="!hasChecked">点击率</li>
          <li class="check-num" v-show="hasChecked">
            <span class="number">
              已选中<b v-text="checkedNum"></b>项
            </span>
            <span class="delete icon-buttons" @click="deleteMes()">
              <i class="icon-font">&#xe679;</i>删除
            </span>
          </li>
        </ul>
        <div class="list-container" v-if="!isListLoading">
          <ul class="list-body" v-for="(item, index) in emialMarketList" :key="index" @click="displayInfoFunc(item)">
            <li class="checkbox">
              <el-checkbox v-model="item.checked" @change="checkMes(item)"></el-checkbox>
            </li>
            <li class="title">
              <div class="limit-width">
                <p class="label">
                  <span class="limit limit_title" :title="item.title" @click.stop="linkStatis(item.id)" v-if="item.status === 1">{{ item.title }}</span>
                  <span class="limit limit_title" :title="item.title" v-else>{{ item.title }}</span>
                  <i class="icon-font" v-if="item.status==-1" style="color:#FFA726;" title="草稿">&#xe672;</i>
                  <i class="icon-font" v-if="item.status==0" style="color:#00B8CC;" title="计划中">&#xe685;</i>
                </p>
                <p class="time" v-if="item.status!=-1">发送时间：{{ item.sendTime | timeformater }}</p>
                <p class="time" v-else>发送时间：-</p>
              </div>
            </li>
            <li class="sent-rate">
              <p>{{ item.total | dataIsNull}}</p>
            </li>
            <li class="delivery-rate">
              <p>{{ item.arrivePer }}%</p>
            </li>
            <li class="read-rate">
              <p>{{ item.readPer }}%</p>
            </li>
            <li class="click-rate">
              <p>{{ item.hitPer }}%</p>
            </li>
            <li class="operate" v-if="!infoIsShow && expansion">
              <el-tooltip effect="dark" content="删除" placement="top">
                <i class="icon-font" @click.stop="deleteMatket(item)">&#xe679;</i>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top" v-if="item.status!=1">
                <i class="icon-font" @click.stop="editMarket(item.id)">&#xe68a;</i>
              </el-tooltip>
              <el-tooltip effect="dark" content="再次发送" placement="top" v-if="item.status==1">
                <i class="icon-font reSend" @click.stop="againSend(item)">&#xe749;</i>
              </el-tooltip>
            </li>
          </ul>
        </div>
        <!--数据加载 start-->
        <div class="load-container" v-if="isListLoading">
          <div class="loading loading-circle"></div>
        </div>
        <!--数据加载 end-->
        <!--无列表数据提示 start-->
        <div class="no-data email" v-if="nodata">
          <img src="../../../src/assets/img/monitor/emailMarket_empty.png" alt="" style="width:141px;" />
          <p class="no-create-desc" v-if="statusType == 0">您还未创建过营销邮件，可点击新增开始邮件营销</p>
          <p class="no-create-desc" v-else>暂无数据</p>
          <el-button type="primary" class="add" @click="addLink" v-if="statusType == 0">新增</el-button>
        </div>
        <!--无列表数据提示 end-->
        <!--搜索表数据提示 start-->
        <div class="no-data email" v-if="searchIsNodata">
          <img src="../../../src/assets/img/develop/no-search-result.png" alt="" style="width:141px;" />
          <p class="no-create-desc">抱歉！没有找到与“<span>{{ keyWord }}</span>”相关的数据</p>
          <p class="desc-second">换个关键词再次搜索看看吧</p>
        </div>
        <!--搜索无列表数据提示 end-->
        <!--表数据模块end-->
        <!--分页模块start-->
        <div class="paging-column" v-if="emialMarketList.length > 0 && totalCount>10 && !isListLoading">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            :total="totalCount"
            :layout="layout">
          </el-pagination>
        </div>
        <!--分页模块end-->
      </div>
      <emailMarketInfo v-if="infoIsShow" @close="infoClose" :marketInfo="displayMarketInfo" @updateData="updateDataFunc"></emailMarketInfo>
      <deleteEmailPop :config="deleteConfig" @sure="configOk"></deleteEmailPop>
    </div>
  </div>
</template>

<script>
  import emailLiftMenu from './emailMarket/emailLiftMenu.vue'
  import emailMarketInfo from './emailMarket/emailMarketInfo.vue'
  import emailMarketApi from '@/api/emailMarketApi'
  import deleteEmailPop from './emailMarket/deleteEmailPop.vue'
//  import { mapGetters } from 'vuex'
  export default{
    name: 'extension',
    data () {
      return {
        marketStatisticload: true,
        isBind: false,
        expansion: true,  // 左侧菜单是否展开
        isNoData: true,
        checkedNum: 0,
        emialMarketList: [],
        isChecked: false,
        hasChecked: false,
        isListLoading: true,  // 数据是否正在加载
        infoIsShow: false,   // 是否展示详细信息
        deleteMultiple: false, // 是否是 header 删除按钮
        receiptPopIsShow: false, // 收件人列表弹框
        nodata: false,
        searchIsNodata: false,
        pageSize: 10,
        currentPage: 1,    // 当前页
        totalCount: 0,      // 总条数
        totalpage: 0, // 总页数
        statusType: 0,
        max: 0,
        total: 0,
        arrivePer: 0,    // 到达率
        readPer: 0,    // 阅读率
        hitPer: 0,    // 点击率
        filtDataType: 0,
        removeId: '',
        deleteParams: {
          spreadId: ''
        },
        displayMarketInfo: {},
        reSendConfig: {
          visible: false,
          notice: '您是否确认再次发送?',
          sureText: '确定',
          cancelText: '取消',
          callback: null,
          isLoading: false
        }, // 重发弹窗配置
        deleteConfig: {
          visible: false,
          notice: '您是否确认删除?',
          message: [],
          sureText: '删除',
          cancelText: '取消',
          callback: null
        }, // 删除弹窗配置
        recommendPage: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        }, // 分页初始配置
        layout: 'prev, pager, next, sizes, jumper, ->'
      }
    },
    computed: {
      keyWord () {
        return this.$store.state.develop.keyWord
      }
    },
    watch: {
      keyWord () {
        if (this.keyWord !== '' && this.keyWord !== null) {
          this.infoIsShow = false
          this.layout = 'prev, pager, next, sizes, jumper, ->'
          this.isNoData = true
          this.currentPage = 1
          this.deleteParams.spreadId = ''
          this.emialMarketList = []
          this.checkedNum = 0
          this.hasChecked = false
          this.isChecked = false
          this.searchIsNodata = false
          this.getMarketListFunc('2')
        }
      }
    },
    mounted () {
      this.isBindEmail()
      this.getMarketStatisticFunc()
      this.getMarketListFunc('1')
    },
    methods: {
      linkStatis (id) {
        this.$router.push({
          path: '/emailCenter',
          query: {'id': id}
        })
      },
      // 获取统计数据
      getMarketStatisticFunc () {
        this.marketStatisticload = true
        emailMarketApi.getMarketStatistic().then(res => {
          if (res.data.code === 0) {
            let marketstatis = res.data.data
            this.max = marketstatis.max
            this.total = marketstatis.total
            this.arrivePer = marketstatis.arrivePer
            this.readPer = marketstatis.readPer
            this.hitPer = marketstatis.hitPer
            localStorage.setItem('max', this.max)
            localStorage.setItem('total', this.total)
            localStorage.setItem('arrivePer', this.arrivePer)
            localStorage.setItem('readPer', this.readPer)
            localStorage.setItem('hitPer', this.hitPer)
            this.marketStatisticload = false
          }
        })
      },
      // 获取邮件推送列表数据 loadtype:1 普通获取邮件列表 2 搜索邮件列表
      getMarketListFunc (loadtype) {
        this.isListLoading = true
        this.searchIsNodata = false
        this.nodata = false
        this.deleteParams.spreadId = ''
        this.checkedNum = 0
        this.hasChecked = false
        this.isChecked = false
        let type = this.statusType
        let params = {
          page: this.currentPage,
          size: this.pageSize
        }
        if (type === 0) {   // 全部
        } else if (type === 1) {  // 已发送
          params.status = 1
        } else if (type === 2) {    // 计划中
          params.status = 0
        } else if (type === 3) {    // 草稿箱
          params.status = -1
        }
        if (this.keyWord !== '') {
          params.keyword = this.keyWord
        }
        emailMarketApi.getMarketList(params).then(res => {
          if (res.data.code === 0) {
            this.totalCount = res.data.data.totalCount
            this.emialMarketList = res.data.data.records
            this.emialMarketList.forEach((value, index) => {
              if (value.checked === undefined) {
                value.checked = false
              }
            })
            if (this.emialMarketList.length === 0) {
              this.isNoData = true
              if (loadtype === '1') {
                this.nodata = true
              } else {
                this.searchIsNodata = true
              }
            } else {
              this.nodata = false
              this.isNoData = false
              this.searchIsNodata = false
            }
          } else {
            this.emialMarketList = []
            this.isNoData = true
            if (loadtype === '1') {
              this.nodata = true
            } else {
              this.searchIsNodata = true
            }
          }
          this.isListLoading = false
        })
      },
      // 分页每页条数改变回调方法
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.currentPage = 1
        this.getMarketListFunc('1')
      },
      // 分页页码改变回调方法
      handleCurrentChange (val) {
        this.currentPage = val
        this.isListLoading = true
        this.getMarketListFunc('1')
      },
      // 编辑邮件
      editMarket (id) {
        if (this.isBind) {
          this.$store.commit('DEVELOP_ISMENUCLICK', false)
          this.$router.push({path: '/emailTopMenu?id=' + id})
        } else {
          this.$message.error('请先绑定邮箱')
        }
      },
      // 子页面详情响应
      spreadFunc (msg) {
        this.expansion = msg
      },
      /*
       * body 中 CheckBox的选中功能
       * */
      checkMes (item) {
        if (item.checked) {
          this.checkedNum ++
        } else {
          this.checkedNum --
        }
        if (this.checkedNum === this.emialMarketList.length) {
          this.isChecked = true
          this.hasChecked = true
        } else {
          this.isChecked = false
          if (this.checkedNum > 0) {
            this.hasChecked = true
          } else {
            this.hasChecked = false
          }
        }
      },
      /*
       * header 中 CheckBox的全选功能
       * */
      checkAll () {
        if (this.isChecked) {
          this.checkedNum = this.emialMarketList.length
          this.hasChecked = true
        } else {
          this.checkedNum = 0
          this.hasChecked = false
        }
        this.emialMarketList.forEach((item, index) => {
          item.checked = this.isChecked
        })
      },
      // 删除邮件
      deleteMatket (item) {
        this.deleteParams.spreadId = ''
        this.deleteParams.spreadId = item.id
        let title = [item.title]
        Object.assign(this.deleteConfig, {visible: true, notice: '确定删除以下推广邮件：', message: title})
      },
      /*
       * 批量删除
       * */
      deleteMes (item) {
        this.deleteParams.spreadId = ''
        this.deleteConfig.message = []
        if (item) {
          this.item = item
          this.deleteMultiple = false
          this.deleteParams.spreadId = item.id
        } else {
          this.deleteMultiple = true
          this.emialMarketList.forEach((value, index) => {
            if (value.checked) {
              if (this.deleteParams.spreadId === '' || this.deleteParams.spreadId === null) {
                this.deleteParams.spreadId = value.id
              } else {
                this.deleteParams.spreadId += ';' + value.id
              }
              this.deleteConfig.message.push(value.title)
            }
          })
        }
        this.deleteConfig.visible = true
      },
      // 子组件删除回调父组件
      configOk () {
        let id = this.deleteParams.spreadId
        let params = {
          mailMarketingIds: id
        }
        emailMarketApi.deleteMarket(params).then(res => {
          if (res.data.code === 0) {    // 删除成功
            this.getMarketListFunc('1')
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {  // 删除失败
            this.$message.error(res.data.message)
          }
        })
      },
      // 子组件切换筛选
      statusChangeFunc (msg) {
        this.statusType = msg
        this.infoIsShow = false
        this.layout = 'prev, pager, next, sizes, jumper, ->'
        this.isNoData = true
        this.currentPage = 1
        this.deleteParams.spreadId = ''
        this.emialMarketList = []
        this.checkedNum = 0
        this.hasChecked = false
        this.isChecked = false
        this.searchIsNodata = false
        this.$store.commit('DEVELOP_KEYWORD', {keyWord: ''})
        console.log(this.keyWord)
        this.getMarketListFunc('1')
      },
      /**
       * 邮件详情展示
       */
      displayInfoFunc (item) {
        let id = item.id
        let params = {
          mailMarketingId: id
        }
        emailMarketApi.getMarketDetail(params).then(res => {
          if (res.data.code === 0) {
            this.displayMarketInfo = res.data.data
            this.displayMarketInfo.isBind = this.isBind
            this.infoIsShow = true
            this.layout = 'prev, pager, next, sizes'
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      /**
       * table表不同结构展示
       */
      tableDisplay () {
        if (this.infoIsShow) {
          return 'no-operate-table'
        } else if (!this.expansion) {
          return 'no-operate-tableTwo'
        }
      },
      // 子组件关闭响应父组件
      infoClose () {
        this.infoIsShow = false
        this.layout = 'prev, pager, next, sizes, jumper, ->'
      },
      // 子组件数据删除或者修改响应父组件
      updateDataFunc (msg) {
        if (msg === '1') {
          this.infoIsShow = false
          this.layout = 'prev, pager, next, sizes, jumper, ->'
        }
        this.getMarketListFunc('1')
      },
      // 判断邮箱是否绑定
      isBindEmail () {
        emailMarketApi.getChannelList().then(res => {
          if (res.data.code === 0) {
            let channelList = res.data.data
            let _this = this
            channelList.forEach(function (channel) {
              if (channel.channelId === 'MAIL') {
                if (channel.emailAddress !== '' && channel.emailAddress !== null && channel.bindingTag === 1) {
                  _this.isBind = true
                } else {
                  _this.isBind = false
                }
              }
            })
          } else {
            this.isBind = false
          }
        })
      },
      // 点击新增判断跳转
      addLink () {
        if (this.isBind) {
          if (this.total > this.max) {
            this.$message.error('发送邮件达到上限')
          } else {
            this.$store.commit('DEVELOP_SENDINFO', {first: {}, second: [], third: {}, four: {}})
            this.$store.commit('DEVELOP_ISMENUCLICK', false)
            this.$router.push({path: '/emailTopMenu'})
          }
        } else {
          this.$message.error('请先绑定邮箱')
        }
      },
      // 重新发送
      againSend (item) {
        let id = item.id
        this.$router.push({
          path: '/emailTopMenu',
          query: {'id': id, 'activeMenu': 1}
        })
//        let params = {
//          mailMarketingId: id
//        }
//        emailMarketApi.getMarketDetail(params).then(res => {
//          if (res.data.code === 0) {
//            let emailInfo = res.data.data
//            let receiverList = emailInfo.receivers
//            let params = {
//              title: emailInfo.title,
//              content: emailInfo.content,
//              contentArr: emailInfo.contentArr,
//              totalCount: emailInfo.totalCount,
//              sender: emailInfo.sender,
//              receivers: JSON.stringify(receiverList),
//              subject: emailInfo.subject
//            }
//            emailMarketApi.addMarketSend(params).then(res => {
//              if (res.data.code === 0) {
//                this.$message({
//                  message: '重新发送成功',
//                  type: 'success'
//                })
//                this.getMarketListFunc('1')
//              } else {
//                this.$message.error(res.data.message)
//              }
//            })
//          } else {
//            console.log('邮件详情查询失败')
//          }
//        })
      }
    },
    filters: {
      dataIsNull (value) {
        if (value === '' || value === null) {
          return 0
        } else {
          return value
        }
      },
      timeformater (value) {
        if (value !== '' && value !== null) {
          let time = new Date(value)
          let year = time.getFullYear()
          let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
          let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
          let hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
          let minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
          return year + '/' + month + '/' + day + ' ' + hour + ':' + minute
        } else {
          return '-'
        }
      }
    },
    components: {
      emailLiftMenu,
      emailMarketInfo,
      deleteEmailPop
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/variable';
  @import "../../assets/style/base";
  @import '../../assets/style/page';

  .load-container{
    margin: 150px 0 65px 0;
  }
  // .paging-column {
  //   padding: 16px 0 30px 0;
  //   overflow: hidden;
  //   background: #fff;
  //   .el-pagination {
  //     text-align: right;
  //     margin: 20px;
  //   }
  //   .el-pagination {
  //     white-space: nowrap;
  //     padding: 2px 5px;
  //     color: rgb(72, 78, 106);
  //   }
  // }
  .limit{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .limit-width{

  }
  .margin-left16{
    margin-left:16px;
  }
  .margin-top16{
    margin-top:16px;
  }
  .email-left-menu{
    float:left;
    width:208px;
    padding:19px 0px 22px 16px;
    overflow:hidden;
    position: relative;
    background: #FFFFFF;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
    border-radius: 4px;
    transition: width 0.2s;
    .menu-shrink{
      position: absolute;
      right: -10px;
      top: 50%;
      font-size: 30px;
      margin-top:-15px;
      color: #CBD6E2;
      cursor: pointer;
    }
    li{
      line-height: 20px;
      height: 20px;
      font-size: 14px;
      margin-bottom:19px;
      color: #4F6D95;
      position: relative;
      cursor: pointer;
      white-space: nowrap;
      i{
        font-size:11px;
        margin-right: 10px;
        margin-top:2px;
        display: inline-block;
      }
    }
    li:hover{
      color: #5488F9;
    }
    .active:before{
      content: '';
      width:4px;
      height:16px;
      background: #5488F9;
      position: absolute;
      left: -17px;
      top: 2px;
    }
   li.active{
     color: #5488F9;
   }
  }
  .email-market{
    width:100%;
    overflow: hidden;
    .right-content-model.spread{
      width:1127px;
      transition: width 0.2s;
      .top-info-display{
        .info-display{
          .image-display{
            margin-left:71px;
          }
        }
      }
    }
    .right-content-model{
      float:right;
      width:958px;
      .top-info-display{
        width:100%;
        overflow:hidden;
        background: #FFFFFF;
        box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
        border-radius: 4px;
        padding:35px 0 34px 0;
        .info-display{
          width:25%;
          float: left;
          position:relative;
          .image-display{
            margin-left:20px;
            width:46px;
            height: 46px;
            border-radius: 8px;
            text-align: center;
            display: inline-block;
            vertical-align: bottom;
            i{
              font-size: 18px;
              line-height: 48px;
            }
          }
          .desc{
            display: inline-block;
            margin-left:20px;
            .data{
              font-size: 24px;
              color: #33475B;
              line-height: 33px;
            }
            .data-desc{
              font-size: 13px;
              color: #7C98B6;
              line-height: 18px;
            }
          }
          .desc-load{
            .animation(loadingColor,1s,infinite);
            display: inline-block;
            margin-left:20px;
            .data{
              height: 24px;
              width:33px;
              background: #EAF0F6;
            }
            .data-desc{
              margin-top:6px;
              height: 12px;
              width:95px;
              background: #EAF0F6;
            }
          }
        }
        .info-display:after{
          content: '';
          width:2px;
          height:20px;
          background: #EAF0F6;
          position: absolute;
          right: 0px;
          top: 19px;
        }
        .sent-rate{
          .image-display{
            background: #ECF2FF;
            i{
              color: #5488F9;
            }
          }
        }
        .delivery-rate{
          .image-display{
            background: #DFF9FC;
            i{
              color: #00B8CC;
            }
          }
        }
        .read-rate{
          .image-display{
            background: #FDF3E4;
            i{
              color: #FFA726;
            }
          }
        }
        .click-rate{
          .image-display{
            background: #EAF7FF;
            i{
              color: #0998F5;
            }
          }
        }
      }
    }
    .no-operate-table.data-list-five{
      overflow:hidden;
      width: calc(~'100% - 418px');
      transition: width 0.2s;
      .list-header li,.list-body li{
        &.checkbox{
           width: 12.83%;
         }
        &.title{
           width: 34%;
         }
        &.sent-rate{
           width: 18.22%;
         }
        &.delivery-rate{
           width: 13.1%;
         }
        &.read-rate{
           width: 11.7%;
         }
        &.click-rate{
           width: 10.15%;
        }
      }
    }
    .no-operate-tableTwo.data-list-five{
      transition: width 0.2s;
      .list-header li:first-child,.list-body li:first-child{
        padding-left:28px;
      }
      .list-header li,.list-body li{
        &.checkbox{
           width: 6.85%;
         }
        &.title{
           width: 49.2%;
         }
        &.sent-rate{
           width: 12.1%;
         }
        &.delivery-rate{
           width: 11.8%;
         }
        &.read-rate{
           width: 11.1%;
         }
        &.click-rate{
           width: 8.95%;
        }
      }
    }
    .data-list-five{
      background: #FFFFFF;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      min-height:556px;
      display: inline-block;
      width: 100%;
      .list-header{
        overflow: hidden;
        background: #F5F8FA;
        border: 1px solid #DFE3EB;
        li{
          line-height: 48px;
          height:48px;
          font-size: 13px;
          color: #33475B;
          font-weight: 600;
        }
        .check-num{
          font-size: 13px;
          color: #7C98B6;
          line-height: 46px;
          .number{
            margin-right:10px;
          }
          .delete{
            cursor: pointer;
            padding:0 15px;
            i{
              margin-right:5px;
            }
          }
        }
      }
      .list-body:hover{
        background: #EAF0F6;
        .operate{
          display:block;
          i{
            color: #5488F9;
          }
        }
      }
      .list-body{
        padding:16px 0;
        overflow: hidden;
        border-bottom:1px solid #EAF0F6;
        cursor: pointer;
        .label{
          font-size: 13px;
          color: #5488F9;
          letter-spacing: 0;
          .limit_title{
            max-width: 65%;
            display: inline-block;
            margin-right: 3px;
          }
          i{
            vertical-align: top;
            display: inline-block;
            margin-top: 2px;
          }
        }
        .time{
          font-size: 12px;
          color: #7C98B6;
          letter-spacing: 0;
          line-height: 17px;
          margin-top:6px;
        }
      }
      .list-header li:first-child,.list-body li:first-child{
        padding-left:20px;
      }
      .list-header li,.list-body li{
        box-sizing: border-box;
        text-align:left;
        float:left;
        &.checkbox{
           width: 7.22%;
         }
        &.title{
           width: 28.2%;
        }
        &.sent-rate{
           width: 14.3%;
        }
        &.delivery-rate{
           width: 13.9%;
        }
        &.read-rate{
           width: 13.2%;
        }
        &.click-rate{
           width: 10.5%;
        }
        &.operate{
           width: 12.68%;
           display:none;
          i{
            color: #B0C1D4;
            font-size: 14.1px;
            margin-right:20px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .email{
    .no-create-desc{
      font-size: 16px;
      color: #33475B;
      letter-spacing: 0;
      margin-top:16px;
      span{
        font-weight: 600;
      }
    }
    .desc-second{
      font-size: 13px;
      color: #7C98B6;
      line-height: 18px;
      margin-top:8px;
    }
    .add{
      width:100px;
    }
  }
</style>
