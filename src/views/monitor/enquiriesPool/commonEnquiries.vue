<template>
  <div class="common_enquirie">
      <div class="top_info">
        <p class="title">{{commonEnquirie.oriTitle}}</p>
        <p class="desc" :class="commonOpenIndex!=index?'second-row-confine':''" v-html="commonEnquirie.enquiryContent"></p>
        <div class="contraction-module" v-show="commonOpenIndex==index">
          <div v-for="oriObj in oriContentExtObjs" class="info" v-if="oriContentExtObjs.length>0">
            <span>{{oriObj.key}}:</span>
            <span class="info_desc">{{oriObj.value}}</span>
            <!--<p v-if="oriObj.key=='邮箱'">-->
              <!--<span>{{oriObj.key}}&nbsp;:&nbsp;</span>-->
              <!--<span v-if="oriObj.value!=''&&oriObj.value!=null">{{oriObj.value}}</span>-->
              <!--<span v-else-if="email!=''&&email!=null">{{email}}</span>-->
              <!--<span v-else class="info_desc">-->
                <!--<el-button type="primary" size="small" @click="emailGigFunc(commonEnquirie.enquiryCompany.domain)">邮箱深度挖掘</el-button>-->
              <!--</span>-->
            <!--</p>-->
            <!--<p v-else>-->
              <!--<span>{{oriObj.key}}:</span>-->
              <!--<span class="info_desc">{{oriObj.value}}</span>-->
            <!--</p>-->
          </div>
          <p class="info" v-if="commonEnquirie.enquiryCompany.name">
            <span>公司：</span><span class="info_desc">{{commonEnquirie.enquiryCompany.name}}</span>
          </p>
          <p class="info" v-if="commonEnquirie.enquiryPerson.firstname!==''&&commonEnquirie.enquiryPerson.firstname!==null">
            <span>联系人：</span><span class="info_desc">{{commonEnquirie.enquiryPerson.firstname}}</span>
          </p>
          <p class="info" v-if="commonEnquirie.enquiryCompany.mail">
            <span>邮箱：</span><span class="info_desc">{{commonEnquirie.enquiryCompany.mail}}</span>
          </p>
          <p class="info" v-if="(commonEnquirie.enquiryCompany.mail==''||commonEnquirie.enquiryCompany.mail==null)&&commonEnquirie.enquiryCompany.domain!==''&&commonEnquirie.enquiryCompany.domain!==null">
            <span>邮箱：</span>
            <span v-if="email!=''&&email!=null" class="info_desc">{{email}}</span>
            <span v-else class="info_desc"><el-button type="primary" size="small" @click="emailGigFunc(commonEnquirie)" :disabled="isMining">邮箱深度挖掘</el-button></span>
          </p>
          <p class="info" v-if="commonEnquirie.enquiryCompany.addressCountry">
            <span>国家：</span><span class="info_desc">{{commonEnquirie.enquiryCompany.addressCountry}}</span>
          </p>
          <p class="info" v-if="commonEnquirie.enquiryCompany.addressLocality">
            <span>地址：</span><span class="info_desc">{{commonEnquirie.enquiryCompany.streetAddress}}</span>
          </p>
          <p class="info" v-if="commonEnquirie.enquiryCompany.telephone">
            <span>电话：</span><span class="info_desc">{{commonEnquirie.enquiryCompany.telephone}}</span>
          </p>
          <p class="info" v-if="commonEnquirie.enquiryCompany.fax">
            <span>传真：</span><span class="info_desc">{{commonEnquirie.enquiryCompany.fax}}</span>
          </p>
          <p class="info" v-if="commonEnquirie.enquiryCompany.website">
            <span>官网：</span><span class="info_desc text_canclick"><a :href="commonEnquirie.enquiryCompany.website" target="_blank">{{commonEnquirie.enquiryCompany.website}}</a></span>
          </p>
        </div>
        <p class="classify" :class="commonOpenIndex!=index?'one-row-confine':''" v-if="(commonEnquirie.enquiryCatagory.localName!=''&&commonEnquirie.enquiryCatagory.localName!=null)||(commonEnquirie.enquiryCatagory.oriName!=''&&commonEnquirie.enquiryCatagory.oriName!=null)">分类：{{commonEnquirie.enquiryCatagory.localName || commonEnquirie.enquiryCatagory.oriName}}</p>
      </div>
      <div class="bottom_opt">
        <span class="time"><i class="icon-font">&#xe67f;</i>{{commonEnquirie.enquiryTime | time-formater-no-hour}}</span>
        <span class="right_double_btn">
           <el-button type="default" class="right_btn" size="small" @click="sendOpen(index)" v-if="commonOpenIndex!=index">查看</el-button>
           <el-button type="default" class="right_btn" size="small" @click="sendOpen(-1)" v-if="commonOpenIndex==index">收起</el-button>
           <el-button type="primary" class="right_btn" size="small" @click="addCompanyFunc($event)" v-if="isShowAdd()">
             <i class="icon-font">&#xe6ad;</i>联系人
           </el-button>
           <el-button type="primary" class="right_btn" size="small" @click="selCompany()" v-if="!isShowAdd()">查看联系人</el-button>
        </span>
      </div>
    </div>
</template>

<script>
  import enquiriesAPI from '@/api/enquiriesAPI'
  export default{
    props: {
      commonEnquirie: Object,
      commonOpenIndex: Number,
      index: Number
    },
    data () {
      return {
        isExecution: false,
        email: '',
        oriContentExtObjs: [],
        isAddIng: false,  // 联系人是否正在添加中
        isMining: false
      }
    },
    computed: {
    },
    components: {
    },
    watch: {
    },
    mounted () {
      // return JSON.parse(this.commonEnquirie.oriContentExt)
      let objArray = []
      // let isHaveEmail = false
      // let emailObj = {}
//      let commonConpanyInfo = this.commonEnquirie.enquiryCompany
//      if (commonConpanyInfo.name !== '' && commonConpanyInfo.name !== null) {
//        let obj = {
//          key: '公司',
//          value: commonConpanyInfo.name
//        }
//        objArray.push(obj)
//      }
      if (this.commonEnquirie.enquiryContentExt !== '' && this.commonEnquirie.enquiryContentExt !== null) {
        let ori = JSON.parse(this.commonEnquirie.enquiryContentExt)
        let itemobj = ''
        for (itemobj in ori) {
          let obj = {
            key: itemobj,
            value: ori[itemobj]
          }
          objArray.push(obj)
//          if (itemobj === '公司') {
//            objArray.splice(0, 1, obj)
//          } else if (itemobj === '联系人') {
//            objArray.splice(1, 1, obj)
//          } else if (itemobj === '邮箱') {
//            isHaveEmail = true
//            objArray.splice(2, 1, obj)
//          } else {
//            objArray.push(obj)
//          }
//          if (itemobj === '邮箱') {
//            isHaveEmail = true
//            emailObj = obj
//          } else {
//            objArray.push(obj)
//          }
        }
      }
//      if (!isHaveEmail && commonConpanyInfo.domain !== '' && commonConpanyInfo.domain !== null && (commonConpanyInfo.mail === '' || commonConpanyInfo.mail === null)) {
//        // 对象里面没有‘邮箱字段’，可挖掘，公司信息中不存在邮箱信息
//        let obj = {
//          key: '邮箱',
//          value: ''
//        }
//        objArray.splice(1, 1, obj)
//      } else if (commonConpanyInfo.mail !== '' && commonConpanyInfo.mail !== null) {
//        // 公司信息中存在邮箱信息(不管对象是否有邮箱字段，是否可挖掘)
//        emailObj = {
//          key: '邮箱',
//          value: commonConpanyInfo.mail
//        }
//        objArray.splice(1, 1, emailObj)
//      } else if (isHaveEmail) {
//        // 对象中有邮箱字段
//        if (emailObj && emailObj.key !== '' && emailObj.key !== null) {
//          objArray.splice(1, 1, emailObj)
//        }
//      }
      this.oriContentExtObjs = objArray
    },
    methods: {
      sendOpen (index) {
        this.$emit('openCommon', index)
      },
      isShowAdd () {
        let enquiryCompany = this.commonEnquirie.enquiryCompany
        let enquiryPerson = this.commonEnquirie.enquiryPerson
        if ((enquiryPerson.contactsPersonId === '' || enquiryPerson.contactsPersonId === null) && (enquiryCompany.contactsCompanyId === '' || enquiryCompany.contactsCompanyId === null)) {  // 已添加
          return true
        }
        if ((enquiryCompany.telephone !== '' && enquiryCompany.telephone !== null) || (enquiryCompany.mail !== '' && enquiryCompany.mail !== null)) {   // 有邮箱或者电话才可能添加联系人
          if (enquiryPerson.firstname !== '' && enquiryPerson.firstname !== null && enquiryPerson.contactsPersonId !== '' && enquiryPerson.contactsPersonId !== null) {  // 联系人
            return false
          } else if ((enquiryPerson.firstname === '' || enquiryPerson.firstname === null) && enquiryCompany.contactsCompanyId !== '' && enquiryCompany.contactsCompanyId !== null) {  // 公司
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      },
      // 普通询盘深度挖掘
      emailGigFunc (obj) {
        let enquiryCompany = obj.enquiryCompany
        let enquiryPerson = obj.enquiryPerson
        let params = {
          domain: enquiryCompany.domain
        }
        if (enquiryPerson.firstname !== '' && enquiryPerson.firstname !== null) {  // 普通询盘  联系人邮箱挖掘
          params.firstname = enquiryPerson.firstname
          params.lastname = enquiryPerson.lastname
          enquiriesAPI.emailPersonGig(params).then(res => {
            this.isMining = true
            if (res.data.code === 0) {
              let mail = res.data.data.mail
              // enquiryCompany.mail = mail
              if (mail !== '' && mail !== null) { // 挖掘数据成功
                this.email = mail
              } else {   // 没有挖掘到数据
                this.$message({message: '很抱歉，没有挖掘到数据'})
              }
            } else {   // 挖掘数据失败
              this.$message({
                message: '数据挖掘失败',
                type: 'error'
              })
            }
          })
        } else {
          enquiriesAPI.emailCommendGig(params).then(res => {
            this.isMining = true
            if (res.data.code === 0) {
              let mail = res.data.data.mail
              // enquiryCompany.mail = mail
              if (mail !== '' && mail !== null) { // 挖掘数据成功
                this.email = mail
              } else {   // 没有挖掘到数据
                this.$message({message: '很抱歉，没有挖掘到数据'})
              }
            } else {
              this.$message({
                message: '数据挖掘失败',
                type: 'error'
              })
            }
          })
        }
//        this.oriContentExtObjs[2].value = '312541415@qq.com'
//        this.email = '312541415@qq.com'
//        console.log(this.oriContentExtObjs[2].value)
      },
      // 传统询盘描述
      getChanceDetail (oriContentExt) {
//        var ori = JSON.parse(oriContentExt)
//        let str = ''
//        let itemobj = ''
//        for (itemobj in ori) {
//          str = str + '<p class="info">' + itemobj + '：<span>' + ori[itemobj] + '</span></p>'
//        }
//        let str = '<input type="button" value="邮箱深度挖掘" class="mining">'
        // return str
      },
      // 添加联系人
      addCompanyFunc (event) {
        if (!this.isAddIng) {
          this.isAddIng = true
          if (this.isExecution) {
            return
          }
          this.isExecution = true
          let enquiryCompany = this.commonEnquirie.enquiryCompany
          let enquiryPerson = this.commonEnquirie.enquiryPerson
          let dataType = 1
          if (enquiryPerson.firstname === '' || enquiryPerson.firstname === null) {  // 公司
            dataType = 1
          } else { // 联系人
            dataType = 0
          }
          let address = [{
            type: 0,
            address: enquiryCompany.streetAddress,  // 详细地址
            city: enquiryCompany.addressRegion,   // 城市
            state: '',   // 省，洲
            country: enquiryCompany.addressCountry,  // 国家
            postcode: enquiryCompany.postcode
          }]
          let params = {
            type: dataType,
            userId: window.localStorage.userId,
            avatar: enquiryCompany.logo,
            address: JSON.stringify(address),
            remark: enquiryCompany.intro,
            industry: enquiryCompany.industry,
            website: enquiryCompany.website,
            companySize: enquiryCompany.size,
            mainProduct: enquiryCompany.product,
            tradRecommendId: this.commonEnquirie.recommendId,
            createSource: 'commercial_opportunity_create'
          }
          let telephones = []
          let telephone = enquiryCompany.telephone  // 电话
          let fax = enquiryCompany.fax  // 传真
          if (dataType === 0) {  // 联系人
            params.name = enquiryPerson.firstname
            params.companyName = enquiryCompany.name
          } else {
            params.name = enquiryCompany.name
          }
          if (telephone !== '' && telephone !== null) {
            telephones.push({
              type: 8,
              telephone: telephone
            })
          }
          if (fax !== '' && fax !== null) {
            telephones.push({
              type: 7,
              telephone: fax
            })
          }
          if (telephones.length > 0) {
            params.telephone = JSON.stringify(telephones)
          }
          if (enquiryCompany.mail !== '' && enquiryCompany.mail !== null) {
            params.mail = enquiryCompany.mail
          } else if (this.email !== '' && this.email !== null) {
            params.mail = this.email
          }
//        let sociaes = []
//        let homepageurl = ''
//        let homepage = enquiryCompany.fbHomepage
//        let fbid = enquiryCompany.fbID
//        if (homepage !== '' && homepage !== null) {
//          homepageurl = homepage
//        } else if (fbid !== '' && fbid !== null) {
//          homepageurl = 'https://www.facebook.com/profile.php?id=' + fbid
//        }
//        sociaes.push({'platform': 0, 'url': homepageurl, 'socialId': enquiryCompany.fbID})
//        params.sociaes = JSON.stringify(sociaes)
          enquiriesAPI.addCompany(params).then(res => {
            if (res.data.code === 0) {
              let personId = res.data.data.id
              if (dataType === 1) { // 公司
                this.commonEnquirie.enquiryCompany.contactsCompanyId = personId
              } else {  // 联系人
                this.commonEnquirie.enquiryPerson.contactsPersonId = personId
              }
              this.isAddIng = false
//            this.enquirielist.forEach((item, index) => {
//              if (item.inquiryId === id) {
//                item.enquiryCompany.contactsPersonId = personId
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
      selCompany () {
        let enquiryCompany = this.commonEnquirie.enquiryCompany
        let enquiryPerson = this.commonEnquirie.enquiryPerson
        if (enquiryPerson.firstname === '' || enquiryPerson.firstname === null) {  // 公司
          let id = enquiryCompany.contactsCompanyId
          this.$router.push({
            path: '/contactDetail',
            query: {'contactType': 1, 'contactId': id}
          })
        } else {  // 联系人
          let id = enquiryPerson.contactsPersonId
          this.$router.push({
            path: '/contactDetail',
            query: {'contactType': 0, 'contactId': id}
          })
        }
      }
    }
  }
</script>
