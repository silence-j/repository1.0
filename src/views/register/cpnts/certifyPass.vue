<template>
  <div id="container">
    <div id="header">
      <div class="left">
        <img src="../../../assets/img/logo.svg" alt="">
        <span class="line"></span>
        <span class="shop">创建店铺</span>
      </div>
      <div class="right">
        <b class="icon-font">&#xe676;</b>
        <span>0571-56581798</span>
      </div>
    </div>
    <!--认证提交成功（new）-->
    <div class="new-success" v-if="defaultShow">
      <div class="new-bg">
        <img src="../../../assets/img/past.png" class="img" alt="">
        <p class="new-submit">认证提交成功</p>
        <p class="fourty">您已成功提交认证,并将开始为期48小时的试用</p>
        <el-button class="tryIt" @click="beginTrip">开始试用</el-button>
        <p class="line-today">试用到期后将无法继续登录账号,销售专员将会在1~2个工作日内与你联系,付款后即可开始跨境电商之旅</p>
      </div>
    </div>


    <!--账户到期（new）-->
    <div class="new-success" v-if="accountShow">
      <div class="new-bg">
        <img src="../../../assets/img/asset.png" class="img" alt="">
        <p class="new-submit">很抱歉,你的账户已到期</p>
        <p class="fourty">客户服务热线 : 400-780-5353</p>
        <!--<el-button class="tryIt">开始试用</el-button>-->
        <p class="line-today" style="margin-top: 154px;">销售专员将会在1-2个工作日内与你联系,付款后即可开始跨境电商之旅！若30个工作日未付款,系统将关闭您的账户</p>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'certify',
    data () {
      return {
        defaultShow: true,
        accountShow: false,
        shopStatus: -1,
        faultReason: ''
      }
    },
    mounted: function () {
    },
    methods: {
      beginTrip () {
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  body {
    background: white;
    #container {
      width: 1200px;
      height: 768px;
      margin: 0 auto;
      .new-success{
        width:1200px;
        height: 668px;
        border: 1px solid #CBD6E2;
        background: #fff;
        .new-bg{
          width:884px;
          height: 504px;
          background: url(../../../assets/img/register/new-bg.png) no-repeat;
          text-align:center;
          margin: 100px auto 0;
          .img{
            margin-top: 60px;
          }
          .new-submit{
            margin-top: 25px;
            font-size: 20px;
            color: #1F2D3D;
          }
          .fourty{
            margin-top: 16px;
            font-size: 13px;
            color: #4F6D95;
          }
          .tryIt{
            margin-top: 65px;
            width:140px;
            height: 40px;
            background: #5488F9;
            border-radius: 4px;
            color: #fff;

          }
          .line-today{
            margin-top: 54px;
            width:860px;
            height: 42px;
            line-height: 42px;
            text-align: center;
            background: #F2F2F2;
            font-size: 13px;
            color: #7C98B6;
            margin-left: 14px;
          }

        }
      }
    }
    #header {
      overflow: hidden;
      margin-bottom: 20px;
    }
    #header .left {
      float: left;
    }
    #header .left .line {
      display: inline-block;
      width:2px;
      height: 20px;
      background:  #CBD6E2;
      margin: 0 16px;
    }
    #header .left .shop {
      display: inline-block;
      font-size: 14px;
      color: #33475B;
      vertical-align: super;
    }
    #header .left img {
      display: inline-block;
      width: 23%;
      vertical-align: text-bottom;
    }
    #header .right {
      float: right;
      padding-top: 14px;
    }
    #header .right b {
      display: inline-block;
      vertical-align: bottom;
      font-size: 18px;
      color: #5488F9;
      margin-right: 5px;
    }
    #header .right span {
      display: inline-block;
      font-size: 18px;
      color: #5488F9;
    }
  }
</style>
