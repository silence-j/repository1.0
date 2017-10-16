<template>
  <div>
    <div class="topMenu">
      <div class="top-title">客户开发</div>
      <ul class="menu">
        <router-link  v-for="(mItem,mindex) in menuList" :to="{ path: mItem.url}" :key="mindex" v-if="mItem.url !== '/develop' || serverLevel!=='0'">
            <li :class="{curr:mindex===selectedSubNav}" @click="changeMenu(mindex)" v-html="mItem.title">
            </li>
        </router-link>
        <div class="operate-container" id="email_marketing" v-if="selectedSubNav == 3 && isShowSearch">
          <el-input
            class="email-search"
            placeholder="请输入推广标题"
            icon="search"
            v-model="searchText"
            @keyup.enter.native="search"
            :on-icon-click="search">
          </el-input>
          <el-button type="primary" class="btn" @click="addEmailMarketFunc" v-if="max!=0">新增邮件推广</el-button>
          <el-button type="primary" class="btn" v-else>新增邮件推广</el-button>
        </div>
      </ul>
    </div>
    <div class="router-view">
      <router-view></router-view>
    </div>
  </div>

</template>
<script>
import emailMarketApi from '@/api/emailMarketApi'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      selectedSubNav: 0,
      serverLevel: '1',
      searchText: '',
      isShowSearch: true,
      isBind: false,
      max: localStorage.getItem('max'),
      total: localStorage.getItem('total'),
      hitPer: 0,
      menuListCopy: [],
      menuList: [
        {
          title: '<i class="icon-font">&#xe6ae;</i>外贸侦探',
          url: '/tradeDetect',
          code: 'BD'
        },
        {
          title: '<i class="icon-font">&#xe690;</i>发现客户',
          url: '/develop',
          code: 'BA'
        },
        {
          title: '<i class="icon-font">&#xe67e;</i>社交推广',
          url: '/extension',
          code: 'BB'
        },
        {
          title: '<i class="icon-font">&#xe6c2;</i>邮件营销',
          url: '/emailmarketing',
          code: 'BC'
        }
      ],
      pageName: this.$route.path
    }
  },
  mounted () {
    this.serverLevel = window.localStorage.serverLevel
    this.menuListCopy = this.menuList
    this.rightCompute(this.menuList)
    this.isBindEmail()
  },
  computed: {
    ...mapGetters(['allRights'])
  },
  methods: {
    /**
     * 【当前页面被取消了权限，刷新当前页面，这时候弹出到工作台页面】
     * @return {Boolean} [description]
     */
    isRouterInRightArray () {
      let thisRouterPath = this.$router.currentRoute.fullPath
      let isHasRight = this.menuList.some(function (it) {
        return it.url === thisRouterPath
      })
      if (!isHasRight) {
        this.$router.push({ path: '/index' })
      }
    },
    /**
     * 根据路由 设置selectedSubNav
     */
    setSelectedTab () {
      this.$store.dispatch('setNavIndex', '')
      for (let menuIndex in this.menuList) {
        if (this.$route.path === this.menuList[menuIndex].url) {
          this.selectedSubNav = parseInt(menuIndex)
        }
      }
      if (this.$route.path.indexOf('emailmarket') > 0) {
        this.selectedSubNav = 3
      }
      /**
       * 设置一级菜单
       * @type {[type]}
       */
      let usid = localStorage.userId
      let avaiableTopMenue = JSON.parse(localStorage['topBar' + usid])
      console.log(avaiableTopMenue)
      for (let menu in avaiableTopMenue) {
        if (avaiableTopMenue[menu].title === '客户开发') {
          // 选中一级菜单
          this.$store.dispatch('setNavIndex', parseInt(menu))
        }
      }
    },
    /**
     * 权限重新计算
     * @return {[type]} [description]
     */
    rightCompute (mlist) {
      if (!sessionStorage.functions) {
        return
      }
      let myRights = JSON.parse(sessionStorage.functions)
      let newMenuList = []
      for (let i in mlist) {
        if (this.isInRightArray(mlist[i], myRights)) {
          /**
           * 邮件营销 这边要做serverlever判断, 只有 serverlever  是1的情况下,才会显示邮件营销tab
           * @param  {[type]} mlist[i].code [description]
           * @return {[type]}               [description]
           */
          if (mlist[i].code === 'BC') {
            if (this.serverLevel === '1' || this.serverLevel === '2') {
              newMenuList.push(mlist[i])
            }
          } else {
            newMenuList.push(mlist[i])
          }
        }
      }
      this.menuList = newMenuList
      this.setSelectedTab()
    },
    /**
     * 当前权限是否在权限数组里
     * @param  {[type]}  thisRight  [description]
     * @param  {[type]}  rightArray [description]
     * @return {Boolean}            [description]
     */
    isInRightArray (thisRight, rightArray) {
      let isIn = rightArray.some(function (it) {
        return it.code === thisRight.code
      })
      return isIn
    },
    changeMenu (mindex) {
      this.selectedSubNav = mindex
    },
    /**
     * 搜索关键字过滤
     * @param queryString
     * @param cb
     */
    querySearchAsync (queryString, cb) {
      if (queryString.length < 2) {
        cb([])
        return
      }
      if (this.curTimer) {
        clearTimeout(this.curTimer)
      }
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
    /**
     * 过滤方法
     * @param queryString
     * @returns {function(*)}
     */
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    /**
     *  搜索
     */
    search () {
      if (this.searchText === '' || this.searchText === null) {
        this.$message.error('请输入推广标题')
        return
      }
      this.$store.commit('DEVELOP_KEYWORD', {keyWord: this.searchText})
    },
    /**
     * 新增邮件推荐
     */
    addEmailMarketFunc () {
      if (this.isBind) {
        if (parseInt(this.total) >= parseInt(this.max)) {
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
    // 获取统计数据
    getMarketStatisticFunc () {
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
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path.indexOf('emailmarketing') > 0) {
        this.isShowSearch = true
      } else {
        this.isShowSearch = false
      }
//      if (to.path.indexOf('chanceRecommend') > 0) {
//        this.selectedSubNav = 0
//      }
    },
    allRights: function () {
      this.rightCompute(this.menuListCopy)
      /**
       * 判断在没有权限的情况下 手动输入路由
       */
      this.isRouterInRightArray()
    }
  }
}
</script>
<style lang='less'>
@import '../../assets/style/nav/subNav.less';
#email_marketing.operate-container{
  float: right;
  margin-top:0px;
  font-size:0px;
  a{
    margin-left:0px;
  }
  .email-search{
    width:240px;
    margin-right: 16px;
    .el-icon-search:hover+.el-input__inner{
      border-color:#CBD6E3;
    }
  }
  .el-autocomplete{
    width:240px;
    margin-right:10px;
    .el-input__inner{
      height:34px;
      font-size:13px;
    }
    .el-input-group__append{
      padding: 0px 10px;
      .contact-list-search{
        padding:9px 8px;
      }
    }
  }
  .el-button{
    font-size:13px;
  }
}
 .topMenu{
   .menu li{
     position: relative;
     .mark{
       position: absolute;
       right: -27px;
       top: 2px;
       background: #FF3B6E;
       color: #fff;
       font-size: 12px;
       padding: 2px 3px;
       border-radius: 2px;
       transform: scale(0.75);
     }
   }
 }
</style>
