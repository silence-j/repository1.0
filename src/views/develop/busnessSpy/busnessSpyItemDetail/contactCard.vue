<template>
  <div class="card-wrapper">
    <el-button v-if="!this.data.added && showAddBtn" icon="plus" class="add-btn" @click="addContact">联系人</el-button>
    <el-button v-else class="show-btn" @click="showContact"><i class="icon-font eye">&#xe60c;</i>查看</el-button>
    <p class="contact-name" :title="data.name">
      <i class="icon-font">&#xe6d8;</i>
      {{data.name}}
    </p>
    <p class="position" :title="data.position">{{data.position}}</p>
    <div class="card-btn-group">
      <a :href="data.socialInfoList[0].homepageUrl" target="_blank">
        <span class="left-btn" :class="(unlockShow && hasMail && company.website) ? '' : 'only-one'">{{leftBtnText}}</span>
      </a>
      <span class="right-btn" v-if="unlockShow && hasMail && company.website" @click="unlockOrSend">{{(typeof hasMail === 'string') ? hasMail : unlockShow}}</span>
    </div>
  </div>
</template>
<script>
import developAPI from '@/api/developAPI'
import exploreAPI from '@/api/exploreAPI'
export default {
  name: '',
  data () {
    return {
      hasMail: true,
      contactId: '',
      showAddBtn: true
    }
  },
  props: {
    data: {
      type: Object
    },
    company: {
      type: Object
    }
  },
  mounted () {
    this.contactId = this.data.contactsId
  },
  computed: {
    leftBtnText () {
      if (this.data.socialInfoList.length > 0) {
        if (this.data.socialInfoList[0].homepageUrl.indexOf('facebook') >= 0) {
          return 'Facebook'
        } else if (this.data.socialInfoList[0].homepageUrl.indexOf('linkedin') >= 0) {
          return 'Linkedin'
        }
      }
      return false
    },
    unlockShow () {
      if (this.data.mail) {
        return this.data.mail
      } else if (this.data.hasUnlocked) {
        return false
      } else {
        return '解锁邮箱'
      }
    }
  },
  components: {
  },
  methods: {
    unlockOrSend () {
      if (this.unlockShow !== '解锁邮箱') {
        window.location.href = 'mailto:' + this.unlockShow
      } else {
        let params = {
          relativeContactsId: this.data.id,
          platform: this.data.socialInfoList[0].platform,
          website: this.company.website,
          firstName: this.data.firstName,
          lastName: this.data.lastName
        }
        developAPI.unlockMailAdress(params).then(res => {
          if (!res.data.code) {
            if (res.data.data.mail) {
              this.hasMail = res.data.data.mail
            } else {
              this.hasMail = false
              this.$message.success('未找到联系人邮箱')
            }
          }
        })
      }
    },
    addContact () {
      let socialAccountType = this.leftBtnText === 'Facebook' ? 0 : 3
      let params = {
        type: 0,
        name: this.data.name,
//        avatar: this.data.socialInfoList[0].avatar,
        mail: this.data.mail,
        socialAccountType,
        thirdAccountId: this.data.id,
        createSource: 'recommend_create',
        remark: this.data.remark,
        website: this.company.webUrl,
        companyId: this.company.id,
        companyName: this.company.name,
        position: this.data.position,
        thirdInfoList: JSON.stringify(this.data.socialInfoList)
      }
      exploreAPI.addContact(params).then(res => {
        if (!res.data.code) {
          this.$message.success('添加联系人成功')
          this.showAddBtn = false
          this.contactId = res.data.data.id
        }
      })
    },
    showContact () {
      window.open(`#/contactDetail?contactId=${this.contactId}&contactType=0`)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .card-wrapper{
    position: relative;
    width: 100%;
    height: 99px;
    margin-bottom: 16px;
    border: 1px solid #cbd6e3;
    border-radius: 4px;
    overflow: hidden;
    .add-btn, .show-btn{
      position: absolute;
      top: 19px;
      right: 16px;
      padding: 7px 9px;
    }
    .show-btn{
      padding: 7px 18px;
      .eye{
        margin-right: 3px;
      }
    }
    .contact-name{
      font-size: 14px;
      color: #475669;
      line-height: 14px;
      margin: 19px 0 6px 16px;
      max-width: 160px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .position{
      font-size: 13px;
      color: #7c98b6;
      margin-left: 16px;
      max-width: 160px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .card-btn-group{
      position: absolute;
      bottom: 0;
      height: 30px;
      width: 100%;
      background-color: #f5f8fa;
      color: #556f8a;
      line-height: 30px;
      text-align: center;
      border-top: 1px solid #cbd6e3;
      .left-btn, .right-btn{
        color: #556f6a;
        display: inline-block;
        vertical-align: top;
        width: 30%;
        font-size: 13px;
        cursor: pointer;
        &:hover{
          color: #fff;
          background-color: #76a0fa;
        }
      }
      .only-one{
        width: 100%;
      }
      .right-btn{
        width: calc(~"70% - 1px");
        border-left: 1px solid #cbd6e3;
      }
    }
  }
</style>
