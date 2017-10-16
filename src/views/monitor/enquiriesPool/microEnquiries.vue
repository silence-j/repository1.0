<template>
  <!--微询盘start-->
    <div class="micro_enquirie">
        <div class="left_display" v-show="microOpenIndex!=index" v-if="microEnquiries.oriVideo&&microEnquiries.oriVideo.length>0">
          <i class="icon-font vedio_display">&#xe61f;</i>
          <img :src="vedio.coverurl" v-for="(vedio, index) in microEnquiries.oriVideo" v-if="index==0" @click.stop="videoLink(vedio.targeturl)" :class="{'canclick':vedio.targeturl!=''&&vedio.targeturl!=null}" />
        </div>
        <div class="left_display" v-show="microOpenIndex!=index" :class="{'image_displays':microEnquiries.oriPic&&microEnquiries.oriPic.length>1}" v-else-if="microEnquiries.oriPic&&microEnquiries.oriPic.length>0">
          <img :src="img.url" v-for="(img, index) in microEnquiries.oriPic" v-if="index==0" />
        </div>
        <div class="middel_info" :class="microOpenIndex!=index?'confine-width-one':'confine-width-two'">
          <p class="time"><i class="icon-font">&#xe67f;</i>{{microEnquiries.enquiryTime | time-formater-no-second}}</p>
          <div class="content rough" :class="microOpenIndex!=index?'one-row-confine-two':''" v-if="microEnquiries.enquiryPerson.contactsPersonId==''||microEnquiries.enquiryPerson.contactsPersonId==null">
            <p ref="content">
              {{microEnquiries.oriContent==''?'暂无数据':microEnquiries.oriContent}}
              <a :href="getLinkUrl(link.text)" v-for="(link,index) in microEnquiries.oriLink" v-if="microEnquiries.oriLink&&link.href!=''&&link.href!=null" :key="link" target="_blank"><span v-if="index!==0">,</span>{{link.text}}
              </a>
            </p>
            <span class="omit" v-if="contentIsHaveOmit">...</span>
          </div>
          <div class="content" :class="commonOpenIndex!=index?'one-row-confine-two':''" v-else>
            <p ref="content">
              {{microEnquiries.oriContent==''?'暂无数据':microEnquiries.oriContent}}
              <a :href="getLinkUrl(link.text)" v-for="(link,index) in microEnquiries.oriLink" v-if="microEnquiries.oriLink&&link.href!=''&&link.href!=null" :key="link" target="_blank"><span v-if="index!==0">,</span>{{link.text}}
              </a>
            </p>
            <span class="omit" v-if="contentIsHaveOmit">...</span>
          </div>
          <carouselChange v-show="microOpenIndex==index" v-if="microEnquiries.oriPic&&microEnquiries.oriPic.length>0&&(microEnquiries.oriVideo==''||microEnquiries.oriVideo==null)" :imageList="microEnquiries.oriPic" @nextPageSure="nextPageFunc"></carouselChange>
          <p class="video" v-show="microOpenIndex==index" v-else v-for="(vedio, index) in microEnquiries.oriVideo" v-if="vedio.coverurl!=''&&vedio.coverurl!=null" @click.stop="videoLink(vedio.targeturl)">
            <i class="icon-font big_vedio_display">&#xe61f;</i>
            <img :src="vedio.coverurl" />
          </p>
          <p class="info">
            <span class="logo canclick" @click.stop="linkPageHome(microEnquiries.enquiryPerson)">
              <img :src="microEnquiries.enquiryPerson.avatar" alt="" v-if="microEnquiries.enquiryPerson.avatar!=''&&microEnquiries.enquiryPerson.avatar!=null">
              <img src="/static/img/default-head.png" alt="" v-else>
            </span>
            <span class="name one-row-confine text_canclick" @click.stop="linkPageHome(microEnquiries.enquiryPerson)">
              {{microEnquiries.enquiryPerson.firstname}} {{microEnquiries.enquiryPerson.lastname}}
            </span>
          </p>
          <div class="desc" :class="microOpenIndex!=index?'one-row-confine-two':''" ref="desc"><p>{{microEnquiries.enquiryContent}}</p> <span class="omit" v-if="descIsHaveOmit">...</span></div>
        </div>
        <div class="right_opt">
          <el-button type="primary" class="right_btn" size="small" @click="addPersonFunc(microEnquiries,$event)" v-if="microEnquiries.enquiryPerson.contactsPersonId==''||microEnquiries.enquiryPerson.contactsPersonId==null"><i class="icon-font">&#xe6ad;</i>联系人</el-button>
          <el-button type="primary" class="right_btn" size="small" @click="selPerson(microEnquiries.enquiryPerson.contactsPersonId)" v-else>查看联系人</el-button>
          <el-button type="default" class="right_btn" size="small" @click="sendOpen(index)" v-if="microOpenIndex!=index && canSel" ref="selbtn">查看</el-button>
          <el-button type="default" class="right_btn" size="small" @click="sendOpen(-1)" v-if="microOpenIndex==index && canSel" ref="sqbtn">收起</el-button>
        </div>
    </div>
  </div>
  <!--微询盘end-->
</template>

<script>
  import carouselChange from '@/components/carouselChange/carouselChange.vue'
  import enquiriesAPI from '@/api/enquiriesAPI'
  import Util from '@/common/Util.js'
  export default{
    props: {
      microEnquiries: Object,
      microOpenIndex: Number,
      index: Number
    },
    data () {
      return {
        isAddIng: false,  // 联系人是否正在添加中
        canSel: false,
        contentIsHaveOmit: false,
        descIsHaveOmit: false
      }
    },
    computed: {
    },
    components: {
      carouselChange
    },
    watch: {
    },
    mounted () {
      if (this.$refs.content.clientHeight <= 20) {
        this.contentIsHaveOmit = false
      } else {
        this.contentIsHaveOmit = true
      }
      if (this.$refs.desc.clientHeight <= 20) {
        this.descIsHaveOmit = false
      } else {
        this.descIsHaveOmit = true
      }
      if (this.$refs.content.clientHeight <= 20 && this.$refs.desc.clientHeight <= 20 && (!this.microEnquiries.oriPic || this.microEnquiries.oriPic.length === 0) && (this.microEnquiries.oriVideo === '' || this.microEnquiries.oriVideo === null)) {
        this.canSel = false
      } else {
        this.canSel = true
      }
    },
    methods: {
      sendOpen (index) {
        if (index === -1) {
          this.contentIsHaveOmit = true
          this.descIsHaveOmit = true
        } else {
          this.contentIsHaveOmit = false
          this.descIsHaveOmit = false
        }
        this.$emit('openMicro', index)
      },
      getLinkUrl (url) {
        return Util.checkUrl(url)
      },
      nextPageFunc (value) {
        console.log(value)
      },
      // 视频链接跳转
      videoLink (url) {
        window.open(url)
      },
      linkPageHome (obj) {
        let homepage = obj.fbHomepage
        let fbid = obj.fbID
        if (homepage !== '' && homepage !== null) {
          window.open(homepage)
        } else if (fbid !== '' && fbid !== null) {
          window.open('https://www.facebook.com/profile.php?id=' + fbid)
        }
      },
      // 微询盘当前页变更
      // 添加联系人
      addPersonFunc (item, event) {
        if (!this.isAddIng) {
          this.isAddIng = true
          if (this.isExecution) {
            return
          }
          this.isExecution = true
          let enquiryPerson = item.enquiryPerson
          let id = item.inquiryId
          let params = {
            firstName: enquiryPerson.firstname,
            lastName: enquiryPerson.lastName,
            microRecommendId: item.recommendId,
            createSource: 'commercial_opportunity_create'
          }
          if (enquiryPerson.avatar !== '' && enquiryPerson.avatar !== null) {
            params.avatar = enquiryPerson.avatar
          }
          let sociaes = []
          let homepageurl = ''
          let homepage = enquiryPerson.fbHomepage
          let fbid = enquiryPerson.fbID
          if (homepage !== '' && homepage !== null) {
            homepageurl = homepage
          } else if (fbid !== '' && fbid !== null) {
            homepageurl = 'https://www.facebook.com/profile.php?id=' + fbid
          }
          sociaes.push({'platform': 0, 'url': homepageurl, 'socialId': enquiryPerson.fbID})
          params.sociaes = JSON.stringify(sociaes)
          enquiriesAPI.addPerson(params).then(res => {
            if (res.data.code === 0) {
              let personId = res.data.data.personId
              item.enquiryPerson.contactsPersonId = personId
              this.isAddIng = false
              let valueObj = {
                id: id,
                personId: personId
              }
              this.$emit('addSure', valueObj)
//            this.enquirielist.forEach((item, index) => {
//              if (item.inquiryId === id) {
//                item.enquiryPerson.contactsPersonId = personId
//              }
//            })
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
            this.isExecution = false
          })
        }
      },
      // 查看联系人
      selPerson (id) {
        this.$router.push({
          path: '/contactDetail',
          query: {'contactType': 0, 'contactId': id}
        })
      }
    }
  }
</script>
<!--<style lang="less" rel="stylesheet/less">-->
  <!--.micro_enquiries{-->
    <!--.micro_enquirie{-->
      <!--.right_opt{-->
        <!--.el-button&#45;&#45;default{-->
          <!--width:80px;-->
          <!--height:30px;-->
          <!--margin-left:0px;-->
        <!--}-->
        <!--.el-button&#45;&#45;primary{-->
          <!--width:80px;-->
          <!--height:30px;-->
          <!--margin-left:0px;-->
          <!--margin-bottom:8px;-->
          <!--.icon-font{-->
            <!--margin-right:4px;-->
          <!--}-->
        <!--}-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</style>-->

