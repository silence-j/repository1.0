<template>
  <div class="contactDesc">
    <div class="loading loading-circle" v-if="descLoading"></div>
    <div class="top-header" v-else>
      <img class="avatar" v-if="avatar!==''&& avatar &&!type" :src="avatar" @click="avatarDialog=true" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
      <img class="avatar" v-if="avatar!==''&& avatar &&type" :src="avatar" @click="avatarDialog=true" onerror="javascript:this.src='/static/img/default_comp.png'">
      <img class="avatar" v-if="(avatar===''||!avatar)&&!type" src="../../../../assets/img/default_avatar.png" @click="avatarDialog=true">
      <img class="avatar" v-if="(avatar===''||!avatar)&&type" src="../../../../assets/img/default_comp.png" @click="avatarDialog=true">
      <span class="desc-detail">
      <span class="name" :title="desc.name">{{desc.name}}</span>
      <span v-if="$route.query.contactType == 0" class="desc" style="color:#33475B;" :title="desc.describe">{{desc.describe}}</span>
      <a v-else class="desc" :href="fullWebUrl" :title="desc.describe" style="color: #5488F9;" target="_blank">{{desc.describe}}</a>
    </span>
      <span v-if="$route.query.contactType == 0" class="editor icon-font" style="font-size: 16px;" @click="editorPerson=true">&#xe68a;</span>
      <span v-else class="editor icon-edit icon-font" style="font-size: 16px;" @click="editorCompany=true"></span>
    </div>
    <el-dropdown trigger="click" class="operate" @command="deleteShow" v-if="deleteRight()">
      <el-button type="default" class="gray-btn">
        操作<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown" class="dropdown-menu">
        <el-dropdown-item>删除{{type?'公司':'联系人'}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog v-model="editorPerson">
      <el-form :model="personForm" label-position="top" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item class="editor-name firstName" label="firstName" prop="firstName" >
          <el-input v-model="personForm.firstName" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item class="editor-name" label="lastName">
          <el-input v-model="personForm.lastName" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="personForm.position" maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePerson('ruleForm')">确 定</el-button>
        <el-button @click="editorPerson = false" type="text">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog v-model="editorCompany">
      <el-form :model="companyForm" label-position="top" :rules="rulesCompany" ref="companyForm" label-width="100px" class="demo-ruleForm">
        <el-form-item class="editor-company-name" label="公司名称" prop="name">
          <el-input v-model="companyForm.name" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="公司官网" prop="url">
          <el-input v-model="companyForm.url" maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="companyForm.name===''" @click="updateCompany('companyForm')">确 定</el-button>
        <el-button @click="editorCompany = false" type="text">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog v-model="deleteDialog" class="delete-dialog">
      <span>
        <i class="warning el-icon-warning"></i>
        <span class="text">确定删除以下{{type?'公司':'联系人'}}：</span>
      </span>
      <div class="content">
        <p :title="desc.name">{{desc.name}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteContact">删除</el-button>
        <el-button type="text" @click="deleteDialog = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="上传头像" v-model="avatarDialog" class="avatar-upload">
      <div class="upload-body">
        <img :src="preImg">
        <span class="avatar-info">
          <el-button @click="materialOptions.show=true">选择</el-button>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadAvatar">保存</el-button>
        <el-button @click="avatarDialog = false" type="text">取 消</el-button>
      </span>
    </el-dialog>
    <uploadMaterial
    :options="materialOptions"
    @confirmInsert="confirmInsert"
    @cancelInsert="materialOptions.show=false"></uploadMaterial>
  </div>
</template>

<script>
  import contactInfoApi from '../../../../../src/api/contactInfoApi'
  import Util from '@/common/Util.js'
  import uploadMaterial from '@/components/uploadMaterial'
  export default{
    data () {
      let validateFristName = (rule, value, callback) => {
        if (value.trim() === '') {
          this.compError = false
          callback(new Error('firstName 不能为空'))
          callback()
        } else {
          this.compError = false
          callback()
        }
      }
      let validateUrl = (rule, value, callback) => {
        let rep = /^(http|https):\/\/([a-zA-Z\d][a-zA-Z\d-_]+\.)+[a-zA-Z\d-_][^ ]*$/
        if (value === '' || value === null) {
          this.compError = true
          callback()
        } else {
          if (rep.test(value)) {
            this.compError = false
            callback()
          } else {
            this.compError = false
            callback(new Error('域名不合法'))
            callback()
          }
        }
      }
      return {
        deleteDialog: false,
        avatarDialog: false,
        editorPerson: false,
        editorCompany: false,
        file: '',
        preImg: '',
        type: '',
        avatar: '',
        personForm: {
          contactId: '',
          firstName: '',
          lastName: '',
          position: ''
        },
        companyForm: {
          companyId: this.$route.query.contactId,
          name: '',
          url: ''
        },
        rules: {
          firstName: [
            { required: true, message: '请输入firstName', trigger: 'blur' },
            { validator: validateFristName, trigger: 'blur' }
          ]
        },
        rulesCompany: {
          name: [
            { required: true, message: '请输入companyName', trigger: 'blur' }
          ],
          url: [
            {validator: validateUrl, trigger: 'blur'}
          ]
        },
        materialOptions: {
          multiple: false,
          size: 20,
          type: 'img',
          show: false,
          reload: true
        }
      }
    },
    mounted () {
      this.type = parseInt(this.$route.query.contactType)
    },
    components: {
      uploadMaterial
    },
    methods: {
       /**
       * 删除权限
       */
      deleteRight () {
        if (this.type === 1) {  // 公司删除权限
          return Util.hasRightByCode('DBB')
        } else {
          return Util.hasRightByCode('DAB')
        }
      },
      deleteShow () {
        this.deleteDialog = true
      },
      updatePerson (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            contactInfoApi.contactPersonUpdate(this.personForm).then(res => {
              if (!res.data.code) {
                this.$message.success('更新联系人信息成功')
                location.reload()
                this.editorPerson = false
              }
            })
          } else {
            return false
          }
        })
      },
      updateCompany (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            contactInfoApi.contactCompanyUpdate(this.companyForm).then(res => {
              if (!res.data.code) {
                location.reload()
                this.$message.success('更新公司信息成功')
                this.editorCompany = false
              } else {
                this.$message.error(res.data.message)
              }
            })
          } else {
            return false
          }
        })
      },
      deleteContact () {
        if (parseInt(this.$route.query.contactType)) {
          let params = [{
            contactsId: this.$route.query.contactId,
            contactsType: 1
          }]
          contactInfoApi.deleteCompanyList({contactses: JSON.stringify(params)}).then(res => {
            if (!res.data.code) {
              this.$message.success('删除公司成功')
              this.$router.push({path: '/contact', query: {type: this.type}})
            }
          })
        } else {
          contactInfoApi.deletePersonList({contactIds: this.$route.query.contactId}).then(res => {
            if (!res.data.code) {
              this.$router.push({path: '/contact', query: {type: this.type}})
              this.$message.success('删除联系人成功')
            }
          })
        }
      },
      /**
       * 修改头像
       * @param event
       */
      confirmInsert (file) {
        this.preImg = file.src
        this.materialOptions.show = false
      },
      uploadAvatar () {
        let formData = new FormData()
        formData.append('avatarUrl', this.preImg)
        formData.append('contactsId', this.$route.query.contactId)
        formData.append('contactsType', parseInt(this.$route.query.contactType))
        contactInfoApi.uploadAvatar(formData).then(res => {
          if (!res.data.code) {
            this.avatarDialog = false
            this.avatar = res.data.data.url
            this.$message.success('上传图片成功！')
          } else {
            this.$message.error('上传图片失败！')
          }
        })
      }
    },
    computed: {
      fullWebUrl: function () {
        if (this.desc.describe !== null && this.desc.describe !== '') {
          return Util.checkUrl(this.desc.describe)
        } else {
          return ''
        }
      },
      desc () {
        this.personForm = {
          contactId: this.$route.query.contactId,
          firstName: this.$store.getters.desc.firstName,
          lastName: this.$store.getters.desc.lastName,
          position: this.$store.getters.desc.describe
        }
        this.companyForm = {
          companyId: this.$route.query.contactId,
          name: this.$store.getters.desc.name,
          url: this.$store.getters.desc.describe
        }
        this.preImg = this.$store.getters.desc.avatar
        this.avatar = this.$store.getters.desc.avatar
        return this.$store.getters.desc
      },
      descLoading () {
        return this.$store.getters.descLoading
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../../assets/style/base";
  .contactDesc{
    .el-dialog {
      width: 395px;
    }
    .el-dialog__header{
      border: none;
    }
    .el-dialog__body{
      padding: 0 27px;
    }
    .el-dialog__footer{
      text-align: left;
      padding: 0 27px 30px 27px;
      button{
        padding: 9px 28px;
      }
    }
    .top-header{
      .editor:hover{
        color: @textareaBorder;
      }
    }
    .avatar-upload{
      .el-dialog {
        width: 436px;
      }
      .el-dialog__header{
        padding: 15px 20px;
        border-bottom: 1px solid @textBorderColor;
      }
      .el-dialog__body{
        padding: 20px;
        img{
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }
        .avatar-info{
          position: relative;
          margin-left: 20px;
          vertical-align: top;
          width: 290px;
          display: inline-block;
          button{
            padding: 10px 30px;
          }
          .file{
            position: absolute;
            top: 0;
            left: 0;
            border: 1px solid;
            width: 87px;
            height: 34px;
            opacity: 0;
          }
          .text{
            display: inline-block;
            margin-top: 20px;
            color: #7C98B6;
          }
        }
      }
      .el-dialog__footer{
        margin-top: 30px;
      }
    }
  }
  .delete-dialog{
    .el-dialog{
      width: 500px;
      .warning{
        font-size: 30px;
        color: @yellow;
        margin-right: 10px;
      }
      .text{
        vertical-align: text-top;
        font-weight: bold;
      }
    }
    .el-dialog__header{
      border: none;
    }
    .el-dialog__body{
      padding: 10px 40px;
      .content{
        padding-left: 44px;
        .info-text{
          display: inline-block;
          margin: 10px 0;
          font-size: 12px;
        }
        p{
          font-size: 18px;
          font-weight: bold;
          margin: 10px 0;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          max-width: 250px;
        }
      }
    }
    .el-dialog__footer{
      text-align: left;
      padding: 15px 84px 55px;
      button{
        padding: 10px 25px;
      }
    }
  }
  .delete-dialog{
    .el-dialog{
      .warning{
        font-size: 30px;
        color: @tipError;
        margin-right: 10px;
      }
      .el-button--primary{
        background-color: @tipError;
        border: 0;
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../../assets/style/base";
  @import "../../../../assets/style/variable";
  .editor-name{
    width: 155px;
    display: inline-block;
    margin-bottom: 20px;
  }
  .editor-company-name{
    margin-bottom: 20px;
  }
  .firstName {
    margin-right: 20px;
  }
  .dropdown-menu{
    margin: 5px 0;
    padding: 6px 0;
    border-radius: 4px;
    .el-dropdown-menu__item{
      padding: 0 10px;
      &:not(.is-disabled):hover{
        background-color: #F4F6F8;;
      }
    }
  }
  .contactDesc{
    width: 350px;
    padding: 20px;
    min-height: 140px;
    border-radius: 4px;
    box-shadow: 0 0 20px #DFE3EB;
    background: @white;
    .avatar{
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .desc-detail{
      width: 250px;
      display: inline-block;
      vertical-align: top;
      font-size: 13px;
      margin-left: 10px;
      .name{
        width: 250px;
        line-height: 24px;
        display: inline-block;
        font-size: 18px;
        font-weight: bold;
      }
      .desc{
        width: 250px;
        line-height: 20px;
        display: inline-block;
        margin-top: 5px;
      }
    }
    .editor{
      float: right;
      color: #B0C1D4;
      cursor: pointer;
    }
    .operate{
      margin-top: 25px;
      button{
        margin-left: 135px;
        padding: 10px 0;
        width: 80px;
        i{
          font-size: 10px;
          margin-left: 10px;
        }
      }
    }
  }
</style>
