<template>
  <div class="depthcontact-card-wrapper">
    <el-button v-if="!data.added && showAddBtn" icon="plus" class="add-btn" @click="addContact">联系人</el-button>
    <el-button v-else class="show-btn" @click="showContact"><i class="icon-font eye">&#xe60c;</i>查看</el-button>
    <p class="contact-name">{{data.name}}</p>
    <p class="email-address">{{data.mail ? data.mail : '-'}}</p>
  </div>
</template>
<script>
import exploreAPI from '@/api/exploreAPI'
export default {
  name: '',
  data () {
    return {
      showAddBtn: true,
      contactId: ''
    }
  },
  mounted () {
    this.contactId = this.data.contactsId
  },
  computed: {
    socialType () {
      if (this.data.socialInfoList.length > 0) {
        if (this.data.socialInfoList[0].homepageUrl.indexOf('facebook') >= 0) {
          return 'Facebook'
        } else if (this.data.socialInfoList[0].homepageUrl.indexOf('linkedin') >= 0) {
          return 'Linkedin'
        }
      }
      return false
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
  components: {
  },
  methods: {
    addContact () {
      let socialAccountType = this.socialType === 'Facebook' ? 0 : 3
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
.depthcontact-card-wrapper{
  position: relative;
  width: 100%;
  height: 60px;
  padding: 15px 16px;
  box-sizing: border-box;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #cbd6e3;
  .add-btn, .show-btn{
    position: absolute;
    top: 15px;
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
    font-size: 13px;
    color: #7c98b6;
    margin-bottom: 6px;
  }
  .email-address{
    max-width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    color: #475669;
  }
  // &:hover{
  //   background-color: #bdf3fe;
  //   .add-btn{
  //     color: #fff;
  //     background-color: #5488f9;
  //   }
  // }
}
</style>
