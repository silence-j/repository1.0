<template>
  <div class="preview-wrapper">
    <div class="nav">
      <span class="nav-item icon-font mac" :class="btnType==='mac'?'active':''" @click="changeView" data-type="mac">&#xe611;</span>
      <span class="nav-item icon-font pad" :class="btnType==='pad'?'active':''" @click="changeView" data-type="pad">&#xe610;</span>
      <span class="nav-item icon-font phone" :class="btnType==='phone'?'active':''" @click="changeView" data-type="phone">&#xe60f;</span>
    </div>
    <div class="preview-window" :class="contentType">
      <div class="preview-main" v-html="tableContent"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        // 用来标记哪个按钮被点击
        btnType: 'phone',
        // 标记view的class
        contentType: 'phonewindow',
        // 从内容编辑页面存储的DOM数组，在这个页面重新渲染
        tableContent: ''
      }
    },
    components: {

    },
    mounted: function () {
      // 内容编辑页拿来的数组
      let emailContentList = JSON.parse(this.$store.state.develop.emailContentList)
      let arr = ''
      // 把数组中的content放进trtd里 拼接为一个字符串
      for (let item of emailContentList) {
        if (item.type === 'text') {
          arr += `<tr><td valign="top" style="width:100%;">${item.content}</td></tr><tr height="20"></tr>`
        } else if (item.type === 'img') {
          arr += `<tr><td valign="top" style="width:100%;text-align:center;">${item.content}</td></tr><tr height="20"></tr>`
        } else if (item.type === 'footer') {
          arr += `<tr><td aglin="center" valign="top" cellpadding="0" style="width:100%;background-color: #f0f1f2;">
            <table cellpadding="30" cellspacing="0">
              <tr>
                <td aglin="center">${item.content}</td>
              </tr>
            </table>
          </td></tr><tr height="20"></tr>`
        }
      }
      let tableContent = `
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td align="center" valign="top" bgcolor="#ffffff">
              <table width="750" border="0" cellspacing="0" cellpadding="0" bgcolor="#fff" style="text-align: left">
                <tbody>
                  ${arr}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>`
      this.tableContent = tableContent.replace(/<a href=/, `<a target="_blank" href=`)
    },
    methods: {
      changeView (e) {
        this.btnType = e.target.dataset.type
        this.contentType = `${e.target.dataset.type}window`
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .preview-wrapper{
    position: relative;
    left: calc(~"-50vw + 600px");
    width: 99.6vw;
    min-height: calc(~"100vh - 116px");
    background-color: #cad6e2;
    text-align: center;
    .nav{
      display: inline-flex;
      flex-wrap: wrap;
      justify-content: space-around;
      width: 182px;
      height: 34px;
      padding: 0 15px;
      margin-top: 30px;
      margin-bottom: 25px;
      box-sizing: border-box;
      border-left: 1px solid #b0c1d3;
      border-right: 1px solid #b0c1d3;
      .nav-item{
        color: #1d98b6;
        cursor: pointer;
      }
      .mac{
        font-size: 26px;
        padding-top: 3.5px;
      }
      .pad{
        font-size: 21px;
        padding-top: 5px;
      }
      .phone{
        font-size: 19px;
        padding-top: 6.5px;
      }
      .active{
        color: #5488f9;
      }
    }
    .preview-window{
      i{
        font-style: italic;
      }
      h1{
        font-size: 2em;
      }
      h2{
        font-size: 1.5em;
      }
      h3{
        font-size: 1.17em;
      }
      h4{
        font-size: 1em;
      }
      h5{
        font-size: 0.83em;
      }
      h6{
        font-size: 0.67em;
      }
      ol{
        padding-left: 20px;
        li{
          list-style: decimal;
        }
      }
      ul{
        padding-left: 20px;
        li{
          list-style: disc;
        }
      }
    }
    .phonewindow{
      position: relative;
      margin: 0 auto;
      width: 432px;
      height: 884px;
      background: url(../../../assets/img/develop/iphone.png) no-repeat;
      background-size: 100%;
      padding-bottom: 220px;
      ::-webkit-scrollbar{
        width: 3px;
        height: 3px;
      }
      .preview-main{
        width: 100%;
        overflow-y: scroll;
        position: absolute;
        width: calc(~"100% - 62px");
        top: 101px;
        left: 33px;
        max-height: 668px;
        ::-webkit-scrollbar{
          width: 3px;
          height: 3px;
        }
      }
    }
    .padwindow{
      position: relative;
      margin: 0 auto;
      width: 845px;
      height: 1172px;
      background: url(../../../assets/img/develop/ipad.png) no-repeat;
      background-size: 100%;
      padding-bottom: 167px;
      ::-webkit-scrollbar{
        width: 3px;
        height: 3px;
      }
      .preview-main{
        width: 100%;
        overflow-y: scroll;
        position: absolute;
        width: calc(~"100% - 92px");
        top: 101px;
        left: 49.5px;
        max-height: 971px;
      }
    }
    .macwindow{
      position: relative;
      margin: 0 auto;
      width: 1200px;
      padding-bottom: 30px;
      .preview-main{
        position: static;
        width: 100%;
      }
    }
  }
</style>
