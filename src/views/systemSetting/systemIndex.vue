<template>
    <div class="left-menu-small">
      <div class="big-title">设置</div>
      <div class="menu">
        <router-link :to="{ path: '/setAccount' }" class="option">
          <p>账号设置</p>
        </router-link>
        <!--<router-link :to="{ path: '/setCompany' }" class="option">
          <p>公司设置</p>
        </router-link>-->
        <router-link v-if="keyWordRight()" :to="{ path: '/setKeyword' }" class="option">
          <p>关键字设置</p>
        </router-link>
        <router-link v-if="bindingRight()" :to="{ path: '/channelList' }" class="option">
          <p>绑定账号</p>
        </router-link>
        <router-link v-if="isFatherRight" :to="{ path: '/setMulAccount' }" class="option">
          <p>多账号设置</p>
        </router-link>
        <router-link v-if="accountFollowRight()" :to="{ path: '/trackManage' }" class="option">
          <p>跟踪代码管理</p>
        </router-link>
        <router-link v-if="messageRight()" :to="{ path: '/setMessenger' }" class="option">
          <p>Messenger管理</p>
        </router-link>
      </div>
    </div>
</template>
<script>

import Util from '@/common/Util'
export default {
  name: 'systemIndex',
  data () {
    return {
      serverLevel: '1',
      /**
       * 是否是主账号
       * @type {Boolean}
       */
      isFatherRight: true
    }
  },
  components: {
  },
  methods: {
    keyWordRight () {
      return Util.hasRightByCode('GA') && this.serverLevel !== '0'
    },
    bindingRight () {
      return Util.hasRightByCode('GB')
    },
    accountFollowRight () {
      return Util.hasRightByCode('GC')
    },
    messageRight () {
      return Util.hasRightByCode('GE')
    }
  },
  created () {
    /**
     * 权限模块
     * 普通 0
     * 引航版/普及版2
     * 超级盈店1
     * 如果 是普通用户 ，点击客户开发直接跳转到的是 社交推广tab,(客户开发tab被隐藏)
     * @type {[type]}
     */
    this.serverLevel = window.localStorage.serverLevel
    this.isFatherRight = (window.localStorage.subUserId === window.localStorage.userId) && (this.serverLevel === '1')
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/list.less';
</style>
