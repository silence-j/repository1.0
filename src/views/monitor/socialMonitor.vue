<template>
  <div class="social-monitor">
    <div class="list-container" :style="{width:isShowDetail?socialListWidth:'',float:isShowDetail?'left':''}" :class="isNoData?'list-no-data':''">
      <div class="search-section">
        <div class="right-side">
          <FilterChoose></FilterChoose>
          <el-button type="primary" @click="addPost">
            <i class="icon-font">&#xe68a;</i>发帖
          </el-button>
        </div>
      </div>
      <div class="content-section" :style="{width:isShowDetail?socialListWidth:''}" v-if="!isListLoading && !isNoData">
        <div class="new-info" :style="{width:isShowDetail?socialListWidth:''}" v-if="newMesNumber > 0" @click="pullNewMes">
          <i class="icon-font">&#xe629;</i>
          您有<a>{{newMesNumber}}</a>条新消息
        </div>
        <div v-for="(item,index) in socialList" class="recycle-box" @click="showDetail(item,index)" :class="curClickIndex == index?'clicked':''">
          <div class="left-side">
            <img class="head-photo" :src="item.avatar" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
            <div class="main-text" :class="isShowDetail?'show-detail':''">
              <span class="channel">
                <i class="icon-font iconFont-facebook" v-if="item.socialAccountType == 0 || item.socialAccountType == 1">&#xe6d9;</i>
                <i class="icon-font iconFont-twitter" v-if="item.socialAccountType == 2">&#xe6d2;</i>
              </span>
              <span class="sender">
                {{item.sender}}
                <span class="screenName" v-if="item.socialAccountType == 2">&lt;@{{item.senderScreenName}}&gt;</span>
              </span>

              <span v-if="item.opportunityType == 3">
                在Facebook上赞了与你
                <span class="receiver">&lt;{{item.socialAccountName}}&gt;</span>
                相关的内容
              </span><!-- 赞 -->
              <span v-if="item.opportunityType == 4">
                在Facebook上评论了你
                <span class="receiver">&lt;{{item.socialAccountName}}&gt;</span>
                的帖子
              </span><!-- 评论 -->
              <span v-if="item.opportunityType == 5">
                在Facebook上转发了你
                <span class="receiver">&lt;{{item.socialAccountName}}&gt;</span>
                的POST
              </span><!-- 转发 -->
              <span v-if="item.opportunityType == 6">
                在你的Facebook
                <span class="receiver">&lt;{{item.socialAccountName}}&gt;</span>
                上留了言
              </span><!-- 留言 -->
              <span v-if="item.opportunityType == 7">
                在Twitter上关注了你
                <span class="receiver">&lt;@{{item.socialAccountName}}&gt;</span>
              </span><!-- 关注 -->
              <span v-if="item.opportunityType == 8">
                在Twitter上赞了与你
                <span class="receiver">&lt;@{{item.socialAccountName}}&gt;</span>
                相关的内容
              </span><!-- 喜欢 -->
              <span v-if="item.opportunityType == 9">
                在Twitter上提到了你
                <span class="receiver">&lt;@{{item.socialAccountName}}&gt;</span>
              </span><!-- 提到 -->
              <span v-if="item.opportunityType == 10">
                在Twitter上转推了你
                <span class="receiver">&lt;@{{item.socialAccountName}}&gt;</span>
                的推文
              </span><!-- 转推 -->
              <span v-if="item.opportunityType == 11">
                在Facebook上评论了你
                <span class="receiver">&lt;{{item.socialAccountName}}&gt;</span>
                的帖子
              </span><!-- 二级评论 -->
            </div>
            <div class="main-text time-text" :class="isShowDetail?'show-detail':''" v-if="isShowDetail">
              <span>{{item.sendTime | time-formater-has-hour}}</span>
            </div>
          </div>
          <div class="right-side" v-show="!isShowDetail">
            <span class="time">{{item.sendTime | time-formater-has-hour}}</span>
          </div>
        </div>
        <div class="page-container">
          <el-pagination
            layout="prev, pager, next, jumper"
            @current-change="recommendCurrentChange"
            :current-page="recommendPage.page"
            :page-size="recommendPage.pageSize"
            :total="recommendPage.totalCount">
          </el-pagination>
           <!--  @size-change="sizeChange"
            :page-sizes="[10, 20, 30, 40]" -->
        </div>
      </div>
      <div class="load-container" v-if="isListLoading">
        <div class="loading loading-circle"></div>
      </div>
      <div class="no-data" v-if="isNoData && !isListLoading">
        <div class="center-section">
          <img src="../../assets/img/monitor/social-noData.png">
          <div class="publish-over">
            <p>您还没有社交监控数据</p>
            <span>人们在社交媒体上与你互动时，他们期待着快速的回应。使用社交监控，您可以响应
每个社交网络的互动情况，使您和您的受众比以往任何时候都更加接近。</span>
            <el-button @click="bindAccount" v-if="bindingList.length == 0">绑定社交账号</el-button>
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
        <a :href="item.socialUrl || facebookUrl" target="_blank"><img class="base-photo" :src="item.avatar" onerror="javascript:this.src='/static/img/default_avatar.jpg'"></a>
        <div class="main-panel">
          <p class="sender">
            <span><a :href="item.socialUrl || facebookUrl" target="_blank">{{item.sender}}</a></span>
            <span class="send-time">{{item.sendTime | time-formater-has-hour}}</span>
          </p>
          <p class="screenName">
            <span v-if="item.socialAccountType == 0 || item.socialAccountType == 1">
              <i class="icon-font iconFont-facebook">&#xe6d9;</i>
              <span class="channel">Facebook</span>
            </span>
            <span v-if="item.socialAccountType == 2">
              <i class="icon-font iconFont-twitter">&#xe6d2;</i>
              <span class="channel">
                <a :href="item.socialUrl" target="_blank">@{{item.senderScreenName}}</a>
              </span>
            </span>
          </p>
          <el-button v-if="item.socialAccountType == 2" @click="socialFollow">
            <i class="icon-font" v-show="!item.followed">&#xe612;</i>
            <i class="icon-font isFollow" v-show="item.followed">&#xe626;</i>
            {{item.followed?'已关注':'关注'}}
          </el-button>
          <p class="contact">
            <span v-if="item.isAdded == 0">
              <span class="icon-block no-added"></span>
              <span class="text-block">Lead</span>
              <span><a @click="addContact">(添加联系人)</a></span>
            </span>
            <span v-if="item.isAdded == 1">
              <span class="icon-block"></span>
              <span class="text-block">联系人</span>
              <span><a @click="watchContact">(查看联系人)</a></span>
            </span>
          </p>
          <div class="follow" v-if="item.socialAccountType != 0 && item.socialAccountType != 1">
            <p class="following">
              <span class="number">{{item.focusCount || '-'}}</span>
              <span>关注</span>
            </p>
            <p class="followed">
              <span class="number">{{item.followCount || '-'}}</span>
              <span>被关注</span>
            </p>
          </div>
          <div class="main-text">
            <div class="other-text" v-if="item.opportunityType == 7">
              <span>关注了你</span>
            </div>
            <div class="content-text" v-else>
              <ShowMore :text="item.content" :len="288" :type="item.socialAccountType"></ShowMore>
            </div>
          </div>
          <ImgGroup :item="item" v-if="item.isShared == 0 && item.images && item.images.length>0"></ImgGroup>
          <div class="original-container" v-if="item.isShared == 1 || (item.opportunityType == 9 && item.originalData.content)">
            <div class="original" v-if="item.originalData.content">
              <ShowMore :text="item.originalData.content" :len="288" :type="item.socialAccountType"></ShowMore>
            </div>
            <ImgGroup :item="item.originalData" v-if="item.originalData.images.length>0"></ImgGroup>
          </div>
          <div class="comment-group" v-if="item.comments && item.comments.length > 0 ">
            <div v-for="(firComItem,index) in item.comments" class="fir-comment-group">
              <div class="comment-container">
                <ShowMore :text="firComItem.content" :len="148"></ShowMore>
                <ImgGroup :item="firComItem" v-if="firComItem.images.length>0"></ImgGroup>
                <div class="comment-text">
                  <p>{{firComItem.sendTime | time-formater-has-hour}}</p>
                  <Operate @reply="reply(1)" @approve="approve" :item="item"></Operate>
                </div>
                <slot></slot>
              </div>
            </div>
          </div>
          <Operate @reply="reply(1)" @share="share(2)" @approve="approve" :item="item" v-if="item.opportunityType != 3 && item.opportunityType != 4 && item.opportunityType != 7 && item.opportunityType != 11"></Operate>
          <!-- 评论/回复 浮框 -->
          <div class="textarea-container" v-show="isShowTextarea">
            <ContentArea :item="item" :type="type"></ContentArea>
          </div>
          <div class="btn-social-group" v-show="isShowTextarea">
            <el-button :class="isTextEmpty?'disabled':''" @click="sendMessage">回复</el-button>
          </div>
          <!-- 回复/动作的内容 -->
          <div class="reply-cont">
            <div v-for="val in item.userOperations">
              <p class="dosth" v-if="val.operateType == 11"><i class="icon-font">&#xe62f;</i> 你&lt;{{val.sender}}&gt;回复了
                <span v-if="item.socialAccountType != 0&&item.socialAccountType != 1">@</span>{{val.receiver}}<span v-if="item.socialAccountType == 0||item.socialAccountType == 1">的帖子</span>
              </p>
              <p class="dosth" v-else-if="val.operateType == 10"><i class="icon-font">&#xe71a;</i> 你&lt;{{val.sender}}&gt;转推了@{{val.receiver}} </p>
              <p class="time">{{val.operateTime | time-formater-has-hour}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-content buffer" v-if="isDataBuffer">
        <span class="base-photo"></span>
        <div class="main-panel">
          <p class="sender"></p>
          <p class="screenName"></p>
          <p class="button-buffer"></p>
          <p class="contact">
            <span class="icon-block"></span>
            <span class="contact-buffer"></span>
          </p>
          <div class="follow">
            <span class="follow-buffer"></span>
          </div>
          <div class="main-text">
            <span class="text-buffer long"></span>
            <span class="text-buffer short"></span>
            <span class="text-buffer short"></span>
            <span class="text-buffer long"></span>
          </div>
        </div>
      </div>
    </div>
    <AddExtension></AddExtension>
    <div class="clearBoth"></div>
  </div>
</template>

<script>
  import MonitorAPI from '@/api/monitorAPI'
  import Operate from './common/operate.vue'
  import ImgGroup from './common/imgGroup.vue'
  import ContentArea from './common/contentArea.vue'
  import FilterChoose from './common/filter-choose.vue'
  import ShowMore from '../../components/showMore.vue'
  import AddExtension from '../develop/extension/addExtension.vue'

  export default{
    beforeRouteLeave (to, from, next) {
      clearInterval(this.intervalTimer)
      next()
    },
    data () {
      return {
        userId: window.localStorage.userId,
        socialList: [], // 社交监控列表
        item: {},
        newMesNumber: 0,
        socialListWidth: '640px',
        isShowDetail: false,
        isShowTextarea: false,
        pullTag: 0, // 是否拉取新消息
        isClickPullNews: false, // 是否点击拉取新消息
        type: -1, // 操作类型 回复：1 转发：2
        isTextEmpty: false,
        isDataBuffer: true, // 详情是否在缓冲
        isListLoading: false, // 列表是否正在加载
        isNoData: false, // 当前列表是否有数据
        accountType: -1, // 保存账号类型
        curClickIndex: -1, // 当前展示详情的索引
        recommendPage: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        }, // 分页初始配置
        facebookUrl: '', // 保存facebook个人主页的跳转链接
        curContactId: '', // 保存添加联系人返回的id
        curContactType: -1, // 保存添加联系人 判断的类型
        intervalTimer: null
      }
    },
    mounted () {
      let timeOut = 3 * 60 * 1000 // 3minutes
      this.getSocialList()
      this.intervalTimer = setInterval(() => {
        this.getNewMesNumber()
      }, timeOut)
    },
    computed: {
      textContent () {
        if (this.$store.state.monitor.textContent) {
          this.isTextEmpty = false
        } else {
          this.isTextEmpty = true
        }
        return this.$store.state.monitor.textContent
      },
      isLimit () {
        return this.$store.state.monitor.isLimit
      },
      opportunityType () {
        return this.$store.state.monitor.opportunityType
      },
      bindingList () {
        return this.$store.state.monitor.bindingList
      },
      timerMonitor () {
        return this.$store.state.monitor.timerMonitor
      },
      mindex () {
        return this.$store.state.monitor.mindex
      }
    },
    watch: {
      textContent () {
        if (this.textContent) {
          this.isTextEmpty = false
        } else {
          this.isTextEmpty = true
        }
      },
      opportunityType () {
        this.getSocialList()
      },
      item () {
        let curList = this.item
        let curHtml = document.createElement('div')
        curHtml.innerHTML = curList.content
        let linkGroup = curHtml.querySelectorAll('a')
        if (linkGroup.length > 0) {
          if (curList.socialAccountType === 2 && (curList.opportunityType === 8 || curList.opportunityType === 9 || curList.opportunityType === 10)) {
            linkGroup[linkGroup.length - 1].parentNode.removeChild(linkGroup[linkGroup.length - 1])
          }
        }
        curList.content = curHtml.innerText

        if (curList.originalData.content) {
          let oriHtml = document.createElement('div')
          oriHtml.innerHTML = curList.originalData.content
          let linkGroup = oriHtml.querySelectorAll('a')
          if (linkGroup.length > 0) {
            if (curList.socialAccountType === 2 && (curList.opportunityType === 8 || curList.opportunityType === 9 || curList.opportunityType === 10)) {
              linkGroup[linkGroup.length - 1].parentNode.removeChild(linkGroup[linkGroup.length - 1])
            }
          }
          curList.originalData.content = oriHtml.innerText
        }
      },
      timerMonitor () {
        if (this.mindex === 0) {
          this.accountType = -1
          this.opportunityType = ''
          this.pullTag = 0
          this.recommendPage = {
            page: 1,
            pageSize: 10,
            totalCount: 0
          }
          this.getSocialList()
        }
      }
    },
    methods: {
      /**
       * 社交监控列表
       * @return {[type]} [description]
       */
      getSocialList () {
        let params = {
          socialAccountType: this.accountType,
          opportunityType: this.opportunityType,
          page: this.recommendPage.page,
          size: this.recommendPage.pageSize,
          pullTag: this.pullTag
        }
        this.isListLoading = true
        MonitorAPI.getSocialList(params).then(res => {
          if (res.data.code === 0) {
            this.getNewMesNumber()
            this.isListLoading = false
            this.pullTag = 0
            this.socialList = res.data.data.records
            if (this.socialList.length > 0) {
              this.isNoData = false
              this.isShowDetail = true
              this.showDetail(this.socialList[0], 0)
            } else {
              this.isNoData = true
            }
            this.recommendPage.page = res.data.data.page
            this.recommendPage.totalCount = res.data.data.totalCount
            console.log(this.socialList)
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
            this.isNoData = true
            this.isListLoading = false
          }
        })
      },
      /**
       * 拉取新消息个数
       * @return {[type]} [description]
       */
      getNewMesNumber () {
        MonitorAPI.getNewMesNumber().then(res => {
          if (res.data.code === 0) {
            this.newMesNumber = res.data.data
          }
        })
      },
      /*
      * 点击新消息提示
      * */
      pullNewMes () {
//        this.pullTag = 1
        this.isClickPullNews = true
        this.getSocialList()
      },
      /**
       * 发帖按钮
       */
      addPost () {
        this.$store.commit('DEVELOP_ADDEXTENSION', { isAddExtension: true })
        this.$store.commit('DEVELOP_ADDSUCCESS', { isAddSuccess: false })
//        this.$store.commit('DEVELOP_ADDEXTENSION', { isAddExtension: true })
      },
      /**
       * 社交列表详情
       * @return {[type]} [description]
       */
      showDetail (item, index) {
        this.type = -1
        this.curClickIndex = index
        this.isShowDetail = true
        this.isDataBuffer = true
        this.isShowTextarea = false
        if (item.socialAccountType === 0 || item.socialAccountType === 1) {
          this.facebookUrl = 'https://www.facebook.com/' + item.socialAccountId
        }
        let params = {
          itemId: item.itemId
        }
        MonitorAPI.getSocialDetail(params).then(res => {
          if (res.data.code === 0) {
            this.isDataBuffer = false
            this.item = res.data.data
          }
        })
      },
      /*
      * 关闭社交列表详情
      * */
      closeDetail () {
        this.curClickIndex = -1
        this.isShowDetail = false
        this.isShowTextarea = false
      },
      /*
      * 关注 / 取消关注
      * */
      socialFollow () {
        let params = {
          socialAccountId: this.item.socialAccountId,
          screenName: this.item.senderScreenName,
          socialAccountType: this.item.socialAccountType
        }
        if (this.item.followed) {
          MonitorAPI.destroyFollow(params).then(res => {
            if (res.data.code === 0) {
              this.$message({
                message: '取消关注成功',
                type: 'success'
              })
              this.$set(this.item, 'followed', false)
            }
          })
        } else {
          MonitorAPI.createFollow(params).then(res => {
            if (res.data.code === 0) {
              this.$message({
                message: '关注成功',
                type: 'success'
              })
              this.$set(this.item, 'followed', true)
            }
          })
        }
      },
      /*
      * 添加联系人
      * */
      addContact () {
        let params = {
          userId: this.userId,
          avatar: this.item.avatar,
          socialAccountType: this.item.socialAccountType,
          socialAccountId: this.item.socialAccountId,
          socialAccountUrl: this.item.socialUrl,
          senderScreenName: this.item.senderScreenName,
          name: this.item.sender
        }
        switch (this.item.socialAccountType) {
          case 0 : params.contactsType = 0
            break
          case 1 : params.contactsType = 1
            break
          case 2 : params.contactsType = 0
            break
          case 3 : params.contactsType = 0
            break
          case 4 : params.contactsType = 1
            break
        }
        switch (this.item.socialAccountType) {
          case 0 : params.createSource = 'social_presentation_fb_create'
            break
          case 1 : params.createSource = 'social_presentation_fb_create'
            break
          case 2 : params.createSource = 'social_presentation_twitter_create'
            break
        }
        MonitorAPI.addContact(params).then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '添加联系人成功',
              type: 'success'
            })
            this.curContactId = res.data.data.id
            this.curContactType = params.contactsType
            this.$set(this.item, 'isAdded', 1)
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      },
      /*
      * 查看联系人
      * */
      watchContact () {
        let params = {
          contactId: '',
          contactType: -1
        }
        if (this.curContactId) {
          params.contactId = this.curContactId
        } else {
          params.contactId = this.item.contactInfo.id
        }
        if (this.curContactType !== -1) {
          params.contactType = this.curContactType
        } else {
          params.contactType = this.item.contactInfo.type
        }
        this.$router.push({path: '/contactDetail', query: params})
      },
      /**
       * 操作 — 点赞
       */
      approve () {
        let params = {
          userId: this.userId,
          itemId: this.item.itemId,
          socialContentId: '',
          socialAccountId: '',
          socialAccountType: '',
          isLike: 0
        }
        if (this.item.opportunityType === 4 || this.item.opportunityType === 11) {
          params.socialAccountId = this.item.comments[0].socialAccountId
          params.socialContentId = this.item.comments[0].socialContentId
          params.socialAccountType = this.item.comments[0].socialAccountType
        } else {
          params.socialAccountId = this.item.socialAccountId
          params.socialContentId = this.item.socialContentId
          params.socialAccountType = this.item.socialAccountType
        }
        if (this.item.opportunityStatus === 0) {
          params.isLike = 1
        }
        MonitorAPI.socialLike(params).then(res => {
          if (res.data.code === 0) {
            if (this.item.opportunityStatus === 0) {
              this.item.opportunityStatus = 1
              this.$message({
                message: '点赞成功',
                type: 'success'
              })
            } else {
              this.item.opportunityStatus = 0
              this.$message({
                message: '取消点赞成功',
                type: 'success'
              })
            }
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      },
      /**
       * 操作 — 回复
       */
      reply (type) {
        if (this.type === type) {
          this.type = -1
          this.isShowTextarea = !this.isShowTextarea
        } else {
          this.type = 1
          this.isShowTextarea = true
        }
      },
      /**
       * 操作 — 转发（转推）
       */
      share (type) {
        if (this.type === type) {
          this.type = -1
          this.isShowTextarea = !this.isShowTextarea
        } else {
          this.type = 2
          this.isShowTextarea = true
        }
      },
      /*
      * 发送 回复 / 转发 / 转推 消息
      * */
      sendMessage () {
        let params = {
          userId: this.userId,
          socialContentId: '',
          socialAccountType: -1,
          content: this.textContent,
          opportunityId: this.item.itemId
        }
        if (this.item.opportunityType === 4 || this.item.opportunityType === 11) {
          if (this.item.opportunityType === 4) {
            params.socialContentId = this.item.comments[0].socialContentId
          } else {
            params.socialContentId = this.item.comments[0].firstLevelContentId
          }
          params.socialAccountType = this.item.comments[0].socialAccountType
        } else {
          params.socialContentId = this.item.socialContentId
          params.socialAccountType = this.item.socialAccountType
        }
        if (this.isLimit) {
          this.$message({
            message: '输入内容超过字符数限制',
            type: 'error'
          })
          return
        }
        if (!this.textContent) {
          this.$message({
            message: '输入内容不能为空',
            type: 'error'
          })
          return
        }
        if (this.type === 1) { // 回复，评论
          MonitorAPI.socialReply(params).then(res => {
            if (res.data.code === 0) {
              this.isShowTextarea = false
              this.type = -1
              this.$message({
                message: '回复成功',
                type: 'success'
              })
              this.refreshSocialDetail()
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            }
          })
        } else if (this.type === 2) { // 转推、分享
          if (typeof params.screenName === 'undefined') {
            this.$set(params, 'screenName', this.item.senderScreenName)
          }
          MonitorAPI.socialShare(params).then(res => {
            if (res.data.code === 0) {
              this.isShowTextarea = false
              this.type = -1
              if (this.item.socialAccountType === 2) {
                this.$message({
                  message: '转推成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '转发成功',
                  type: 'success'
                })
              }
              this.refreshSocialDetail()
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              })
            }
          })
        }
      },
      refreshSocialDetail () {
        MonitorAPI.getSocialDetail({itemId: this.item.itemId}).then(res => {
          if (res.data.code === 0) {
            this.isDataBuffer = false
            this.item = res.data.data
          }
        })
      },
      /*
       * currentPage 改变触发
       * */
      recommendCurrentChange (page) {
        console.log('OOOOO')
        this.recommendPage.page = page
        this.getSocialList()
      },
      // sizeChange (pageSize) {
      //   this.recommendPage.pageSize = pageSize
      //   this.getSocialList()
      // },
      /*
      * 绑定社交账号跳转
      * */
      bindAccount () {
        this.$router.push({path: '/channelList'})
      }
    },
    components: {
      Operate,
      ImgGroup,
      ContentArea,
      FilterChoose,
      ShowMore,
      AddExtension
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/variable';
  @import '../../assets/style/page';
  .choose-state,.choose-time{
    border-radius: 4px;
    .el-input__inner{
      height: 34px;
      font-size: 13px;
      color: @textColor;
    }
    &.choose-state{
      width: 120px;
      margin-right: 10px;
    }
    &.choose-time{
      width: 200px;
    }
  }
  .state-option,.time-option{
    &.selected{
      color: @textColor;
      background-color: @white;
      &.hover{
        background-color: rgba(2,170,170,.09);
      }
    }
    &.hover{
      background-color: rgba(2,170,170,.09);
    }
  }
  .el-select-dropdown{
    border-radius: 4px;
  }
  .social-monitor{
    .iconFont-facebook{
      color: @facebookColor;
    }
    .iconFont-twitter{
      color: @twitterColor;
    }
    .describe span{
      word-break: break-all;
    }
    padding-bottom: 30px;
    .list-container{
      overflow: hidden;
      width: 1200px;
      min-height: 898px;
      background: @white;
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
      &.list-no-data{
        height: 580px;
      }
      .search-section{
        height: 59px;
        line-height: 59px;
        padding-right:20px;
        /*padding: 12px 20px;*/
        overflow: hidden;
        border-bottom: 1px solid #DFE3EB;
        .right-side{
          float: right;
          font-size:0px;
          .filter-select{
            padding-top: 14px;
          }
          .el-button{
            width: 120px;
            height: 34px;
            margin-left: 16px;
            margin-top:14px;
            color: @white;
            /*background: @activeBlue;*/
            font-size: 12px;
            font-weight: 300;
            border-radius: 4px;
            border: none;
            &:hover{
              background: rgb(118, 160, 250);
              border-color: rgb(118, 160, 250);
            }
            i{
              margin-right: 6px;
            }
          }
        }
      }
      .content-section{
        float: left;
        width: 100%;
        padding-bottom: 20px;
        box-sizing: border-box;
        .new-info{
          height: 44px;
          line-height: 44px;
          text-align: center;
          color: @base-weak;
          background: #FFFAEA;
          cursor: pointer;
          i{
            margin-right: 3px;
            font-size: 14px;
            color: #FFC000;
          }
          a{
            margin: 0 1px;
            color: #FFC000;
          }
        }
        .recycle-box{
          overflow: hidden;
          padding: 14px 20px;
          font-size: 13px;
          cursor: pointer;
          border-bottom: 1px solid @textBorderColor;
          &:hover,&.clicked{
            background: #F5F8FA;
          }
          .left-side{
            float: left;
            width: 624px; // socialListWidth - 16px
            .head-photo{
              float: left;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              vertical-align: middle;
            }
            .main-text{
              line-height: 40px;
              &.show-detail{
                line-height: 18px;
                margin-top: 2px;
              }
              &.time-text{
                margin-left: 56px;
                color: @textColor;
                &.show-detail{
                  line-height: 18px;
                  &.time-text{
                    color: @detailTextColor;
                  }
                }
              }
              .channel{
                margin-left: 8px;
                i{
                  margin-left: 8px;
                  font-size: 10px;
                }
              }
              .sender{
                margin-right: 3px;
                // color: @link;
              }
              .receiver{
                // color: @link;
              }
            }
            &:hover{
              .main-text{
                color:#5488F9;
              }
            }
          }
          .right-side{
            float: right;
            line-height: 40px;
            color: @textColor;
          }
        }
      }
      // .page-container{
      //   float: right;
      //   width: 100%;
      //   margin-top: 16px;
      //   margin-right: 16px;
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
        margin: 197px 0 65px 0;
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
            /*background: @activeBlue;*/
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
        overflow: hidden;
        padding: 20px;
        .base-photo{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .main-panel{
          float: right;
          width: 450px;
          margin-bottom: 20px;
          .sender,.screenName{
            height: 22px;
            line-height: 22px;
            font-size: 16px;
            letter-spacing: 0;
          }
          .sender{
            color: @textColor;
            a{
              color: @textColor;
              font-weight: bolder;
            }
            .send-time{
              float: right;
              font-size: 13px;
              color: @detailTextColor;
            }
          }
          .screenName{
            i{
              font-size: 14px;
            }
            .channel{
              color: @detailTextColor;
              a{
                color: @detailTextColor;
              }
            }
          }
          .el-button{
            width: 80px;
            height: 28px;
            margin-top: 8px;
            padding: 0;
            text-align: center;
            font-size: 13px;
            color: @cancel;
            border: 1px solid @inputBorderColor;
            i{
              margin-right: 4px;
              margin-bottom: 2px;
              vertical-align: top;
            }
            i.isFollow{
              color: @success;
            }
          }
          .contact{
            margin-top: 16px;
            color: @textColor;
            .icon-block{
              display: inline-block;
              width: 12px;
              height: 12px;
              margin-right: 4px;
              border-radius: 1px;
              background: @activeBlue;
              vertical-align: top;
              &.no-added{
                background: #F86563;
              }
            }
            .text-block{
              font-weight: bolder;
            }
            a{
              color: @link;
              cursor: pointer;
            }
          }
          .follow{
            margin-top: 16px;
            p{
              display: inline-block;
              margin-right: 55px;
              text-align: center;
              span{
                display: block;
                font-size: 12px;
                &.number{
                  margin-bottom: 8px;
                  font-size: 16px;
                  color: @activeBlue;
                }
              }
            }
          }
          .original-container{
            padding: 16px 10px;
            margin-top: 16px;
            border: 1px solid @inputBorderColor;
            border-radius: 4px;
            .original{
              span{
                line-height: 17px;
                font-size: 14px;
              }
            }
          }
          .comment-group{
            overflow-y: auto;
            max-height: 175px;
            margin-top: 16px;
            padding:0 16px 16px;
            background: @loadingColor;
            border-radius: 4px;
            .fir-comment-group{
              margin-top: 16px;
              .comment-container{
                .describe{
                  font-size: 14px;
                  color: @detailTextColor;
                  a{
                    word-break: break-all;
                  }
                }
                .comment-text{
                  margin-top: 10px;
                  p{
                    display: inline-block;
                    font-size: 13px;
                    color: @detailTextColor;
                  }
                  .operate-container{
                    float: right;
                    margin-top: 0;
                    li:last-child{
                      margin-right: 0;
                    }
                  }
                }
              }
            }
          }
          .main-text{
            margin-top: 24px;
            margin-bottom: 16px;
            span{
              line-height: 20px;
              font-size: 14px;
              a{
                word-break: break-all;
              }
            }
            .other-text{
              height: 50px;
              line-height: 50px;
              padding-left: 16px;
              border-radius: 4px;
              background: #F5F8FA;
            }
          }
          .btn-social-group{
            .el-button{
              margin: 10px 0 0;
              color: @white;
              background: @activeBlue;
              border: none;
              &.disabled{
                color: @disabledColor;
                background: @textBorderColor;
                border: 1px solid #DFE3EB;
              }
            }
          }
          .reply-cont{
            margin-top: 25px;
            line-height: 24px;
            font-size: 13px;
            .time{
              margin-bottom: 12px;
              color: #7C98B6;
            }
            .icon-font{
              margin-right: 5px;
              color: #7C98B6;
              font-size: 14px;
            }
          }
        }
      }
      .detail-content.buffer{
        .base-photo{
          display: inline-block;
          background: @loadingColor;
        }
        .main-panel{
          .sender,.screenName{
            width: 400px;
            background: @loadingColor;
          }
          .button-buffer{
            width: 80px;
            height: 30px;
            margin-top: 8px;
            font-size: 13px;
            background: @loadingColor;
          }
          .contact{
            margin-top: 16px;
            .icon-block{
              background: @loadingColor;
            }
            .contact-buffer{
              display: inline-block;
              width: 100px;
              height: 12px;
              background: @loadingColor;
            }
          }
          .follow{
            .follow-buffer{
              display: inline-block;
              width: 150px;
              height: 36px;
              background: @loadingColor;
            }
          }
          .main-text{
            .text-buffer{
              display: inline-block;
              height: 30px;
              margin-bottom: 16px;
              background: @loadingColor;
              &.long{
                width: 400px;
                height: 60px;
              }
              &.short{
                display: block;
                width: 200px;
              }
            }
          }
        }
      }
    }
    .clearBoth{
      clear: both;
    }
  }
</style>
