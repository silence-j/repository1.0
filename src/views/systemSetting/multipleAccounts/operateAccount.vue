<template>
  <div class="operateAccount-dialog">
    <el-dialog title="删除账户" v-model="dialogDeleteAcc" class="add-dialog" @close="closeDelete" top="20%">
      <div class="operate-box">
        <h4>您确定要删除以下用户吗？</h4>
        <div class="account-detail">
          <img :src="item.avatar || defaultPhoto" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
          <p class="personName" :title="item.name">{{item.name}}</p>
          <p class="mailAddress" :title="item.loginAccount">{{item.loginAccount}}</p>
        </div>
      </div>
      <span slot="footer" class="add-dialog-footer">
        <el-button type="primary" @click="confirmDelete" class="add-btn confirm" :disabled="deleteButton">确定</el-button>
        <el-button type="primary" @click="closeDelete" class="add-btn cancel">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="重置密码" v-model="dialogResetPwd" class="add-dialog" @close="closeReset" top="20%">
      <div class="operate-box">
        <h4>您确定要重置以下用户的密码吗？</h4>
        <div class="account-detail">
          <img :src="item.avatar || defaultPhoto" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
          <p class="personName" :title="item.name">{{item.name}}</p>
          <p class="mailAddress" :title="item.loginAccount">{{item.loginAccount}}</p>
        </div>
      </div>
      <span slot="footer" class="add-dialog-footer">
        <el-button type="primary" @click="confirmReset" class="add-btn confirm" :disabled="confirmButton">确定</el-button>
        <el-button type="primary" @click="closeReset" class="add-btn cancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import mulAccountApi from '@/api/mulAccountApi'
  export default {
    name: 'addAccount',
    data () {
      return {
        defaultPhoto: '/static/img/default_avatar.jpg', // 保存默认头像
        deleteButton: false, // 保存删除按钮的禁用状态
        confirmButton: false // 保存重置按钮的禁用状态
      }
    },
    props: {
      item: Object
    },
    mounted () {
    },
    computed: {
      dialogDeleteAcc () {
        this.deleteButton = false
        return this.$store.state.setting.dialogDeleteAcc
      },
      dialogResetPwd () {
        this.confirmButton = false
        return this.$store.state.setting.dialogResetPwd
      }
    },
    methods: {
      /*
      * 关闭删除账户
      * */
      closeDelete () {
        this.$store.commit('SETTING_DELETEACCOUNT', {dialogDeleteAcc: false})
      },
      /*
       * 关闭重置密码
       * */
      closeReset () {
        this.$store.commit('SETTING_RESETPASSWORD', {dialogResetPwd: false})
      },
      /*
      * 确定删除子账户
      * */
      confirmDelete () {
        this.deleteButton = true
        let params = {
          userId: this.item.id
        }
        mulAccountApi.delChildAccount(params).then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '删除子账户成功',
              type: 'success'
            })
            this.closeDelete()
            this.$store.dispatch('getChildAccList')
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
            this.deleteButton = false
          }
        })
      },
      /*
       * 确定重置密码
       * */
      confirmReset () {
        this.confirmButton = true
        let params = {
          userId: this.item.id
        }
        mulAccountApi.sendResetMail(params).then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '重置密码的邮件已发送至邮箱，请注意查收',
              type: 'success'
            })
            this.closeReset()
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
            this.confirmButton = false
          }
        })
      }
    },
    components: {
    }
  }

</script>

<style lang='less' rel="stylesheet/less">
  @import '../../../assets/style/variable';
  .operateAccount-dialog{
    .add-dialog{
      .el-dialog{
        width: 390px;
        border-radius: 4px;
        box-shadow: 0 0 8px rgba(0,0,0,.08);
      }
      .el-dialog__header{
        padding: 13px 16px;
        border-bottom: 1px solid #DFE3EB;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        span{
          line-height: 21px;
          color: @textColor;
          font-size: 14px;
          font-weight: bolder;
        }
        .el-dialog__close{
          line-height: 21px;
          font-size: 14px;
          color: @detailTextColor;
        }
      }
      .el-dialog__body{
        padding: 0 30px;
        .operate-box{
          h4{
            line-height: 20px;
            margin: 15px 0 8px 0;
            font-size: 13px;
            font-weight: normal;
            color: @textColor;
          }
          .account-detail{
            padding: 16px 20px;
            background: @loadingColor;
            img{
              float: left;
              width: 40px;
              height: 40px;
              margin-right: 8px;
              border-radius: 50%;
            }
            p{
              &.personName{
                line-height: 20px;
                margin-top: 2px;
                margin-bottom: 1px;
                font-size: 14px;
                color: @facebookColor;
              }
              &.mailAddress{
                line-height: 18px;
                margin: 0;
                color: @detailTextColor;
                font-size: 12px;
              }
            }
          }
        }
      }
      .el-dialog__footer{
        overflow: hidden;
        padding: 65px 35px 20px;
        text-align: left;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        .add-btn{
          width: 120px;
          height: 32px;
          padding: 0;
          &.cancel{
            width: 50px;
            color: @mainFontColor;
            background: #fff;
            border: none;
          }
          span{
            line-height: 18px;
            font-size: 13px;
          }
        }
      }
    }
  }
</style>
