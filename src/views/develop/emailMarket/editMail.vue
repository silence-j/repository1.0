<template>
  <div class="edm-container">
    <div class="edm-wrapper">
      <div class="edm-main" 
      ref="wrapper"
      @dragover="outerover" 
      @dragleave="outerleave" 
      @drop="outerdrop" 
      >
        <draggable v-model="mailLayout" :options="dragOptions" @end="commitMailLayout">
          <transition-group type="transition" :name="'flip-list'">
            <div v-for="(item,index) in mailLayout" :key="index" :data-index="index"  class="layout-wrapper">
              <div class="tip-wrapper-top" :data-index="index" @dragleave="dragleave" @dragover="dragover" @drop="drop" v-show="item.topShow">松开在此处添加模块</div>
              <div class="edit-layout">
                <span class="icon-font move"
                @mousedown="mousedown" 
                @mouseup="mouseup" 
                @mouseout="mouseup">&#xe655;</span>
                <span class="class icon-font delete" 
                :data-index="index" 
                @click="deleteContent">&#xe679;</span>
                <span class="icon-font edit" 
                :data-index="index" 
                :data-type="item.type" 
                @click="editContent">&#xe68a;</span>
              </div>
              <div class="layout" :class="item.type" 
              :data-index="index" 
              :key="index" 
              @dragenter="dragenter" 
              @dragover="dragover" 
              @dragleave="dragleave" 
              @drop="drop" 
              v-html="item.content">
              </div>
              <div class="tip-wrapper-bottom" 
              :data-index="index" 
              @dragleave="dragleave" 
              v-show="item.bottomShow">松开在此处添加模块</div>
            </div>
          </transition-group>
        </draggable>
        <el-dialog v-model="dialogVisible" size="tiny">
          <div class="delete-tip">
            <span class="icon-font">&#xe629;</span>
            <span class="tip-content">是否确认删除？</span>
            <div class="btn-wrapper">
              <el-button type="danger" @click="confirmDelete">确 定</el-button>
              <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="edm-tmpl" v-show="!openEditor">
      <div class="edm-tmpl-title">模块</div>
      <ul class="tmpl-list">
        <li class="tmpl-item" 
        draggable="true" 
        v-for="(item,index) in tmplList" 
        @drag="drag" 
        @dragstart="dragstart" 
        @dragend="dragend" 
        :key="index" 
        :data-type="item.type">
          <span class="item-icon icon-font" v-html="item.icon"></span>
          <h3 class="item-name">{{item.name}}</h3>
        </li>
      </ul>
    </div>
    <div :class="editorType" class="editor-wrapper" v-show="openEditor">
      <div class="editor-title">{{editorTitle}}</div>
      <editor 
      :content="layContent" 
      @change="updateText" 
      v-show="!imgEditor"
      @errmessage="tipErr" 
      @sucmessage="tipSuc"></editor>
      <div v-if="imgEditor">
        <imgUpload :defaultSrc="imgUrl" @imgChange="updateImg"></imgUpload>
        <p class="upload-tip">图片支持JPG,JPEG,PNG和GIF图片格式，大小支持2M以内</p>
      </div>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </div>
  </div>
</template>
<script>
  import draggable from 'vuedraggable'
  // 左侧列表的拖拽移位
  import VueHtml5Editor from 'longxi-vue-html5-editor'
  // 富文本编辑器
  import $ from 'jquery'
  import imgUpload from '../../../components/imgUpload'
  // 上传图片组件
  const editor = new VueHtml5Editor({
    name: 'vue-html5-editor',
    language: 'zh-cn',
    showModuleName: true,
    visibleModules: [
      'text',
      'color',
      'font',
      'align',
      'list',
      'link',
      'unlink',
      'tabulation',
      'hr',
      'eraser',
      'undo',
      'keyword'
    ],
    icons: {
      text: 'icon-edit',
      color: 'icon-Shape1',
      font: 'icon-wenzi',
      align: 'icon-alignleft',
      list: 'icon-list',
      link: 'icon-link',
      unlink: 'icon-unlink',
      tabulation: 'icon-table',
      hr: 'icon-hr',
      eraser: 'icon-delete',
      undo: 'icon-iconfresh',
      keyword: 'icon-tequan'
    }
  })
  export default {
    name: 'editMail',
    data () {
      return {
        tmplList: [
          {
            name: '文本',
            type: 'text',
            icon: '&#xe647;'
          },
          {
            name: '图片',
            type: 'img',
            icon: '&#xe649;'
          },
          {
            name: '底部',
            type: 'footer',
            icon: '&#xe64a;'
          }
        ],
        // 邮件编辑内容 以数组形式存储
        mailLayout: [
          {
            content: `<img src="https://qiniu.onloon.co/maildefault.png" class="cur-img" style="width:100%;height:auto;" alt="" />`,
            type: 'img',
            topShow: false,
            bottomShow: false
          },
          {
            content: '<p style="font-size:18px;line-height:30px;text-align:justify;">您可以自定义您的邮件内容，自由排版，添加图片，特征词，文字以及链接。</p>',
            type: 'text',
            // topshow为上方提示框  bottom为下方提示框
            topShow: false,
            bottomShow: false
          },
          {
            content: `<div style="padding:30px;text-align:center;text-align:center;font-size:12px;line-height:18px;color: #324751;">
              <p>
                If you have any Suggestions or comments, please don't forget to contact our customer service.
                <br />
                <br />
                We will serve you wholeheartedly
                <br />
                <br />
                This email is system mail. Please do not reply
              </p>
            </div>`,
            type: 'footer',
            topShow: false,
            bottomShow: false
          }
        ],
        // dragenter事件进入左侧时，把这个块的位置存储下来
        enterOffset: 0,
        // flag 用来判断是不是draggable插件  如果不是才走自己的方法 否则会冲突
        notDraggable: false,
        // 移动icon是否被拖住
        moveIconDown: false,
        // 存储编辑框的类型
        editorType: 'text',
        // 控制是否显示右侧编辑器
        openEditor: false,
        // 点击编辑按钮时，记录你所要编辑的index
        editorIndex: 0,
        // 记录要删除的index
        deleteIndex: 0,
        // 删除弹出框
        dialogVisible: false,
        // 是否为图片编辑器
        imgEditor: false,
        imgUrl: ''
      }
    },
    components: {
      draggable,
      editor,
      imgUpload
    },
    watch: {
      openEditor (newVal, oldVal) {
        if (newVal === true) {
          this.$emit('openEditor', true)
        } else {
          this.$emit('openEditor', false)
        }
      }
    },
    computed: {
      dragOptions () {
        return {
          animation: 0,
          ghostClass: 'ghost',
          disabled: !this.moveIconDown
        }
      },
      // 使编辑器获取到你所要操作的内容
      layContent () {
        return this.mailLayout[this.editorIndex].content
      },
      // 编辑器title
      editorTitle () {
        if (this.editorType === 'text') {
          return '文本'
        } else if (this.editorType === 'img') {
          return '图片'
        } else {
          return '底部'
        }
      }
    },
    mounted: function () {
      // let isEdit = this.$route.query.id
      let draftContentArr
      if (this.$store.getters.ismenuclick) {
        let emc = this.$store.state.develop.emailContentList
        if (emc && emc.length !== 0) {
          draftContentArr = JSON.parse(this.$store.state.develop.emailContentList)
          this.mailLayout = draftContentArr
        }
      }
      this.commitMailLayout()
    },
    methods: {
      dragstart (event) {
        // 开始drag 标记notdraggable为true 走自己写的方法
        this.notDraggable = true
        // 记录所拖拽的模块的type
        let type = event.target.dataset.type
        event.dataTransfer.setData('text/type', type)
      },
      drag (event) {
        // console.log(drag)
      },
      dragend (event) {
        // drag结束，notsraggable flag变为false
        this.notDraggable = false
        this.commitMailLayout()
      },
      dragenter (event) {
        if (this.notDraggable === true) {
          // 如果target是左侧元素的子元素，找到它们的祖先layout-wrapper
          let layWrapper = $(event.target).parents('.layout-wrapper')[0]
          // 73是顶部的两个bar的高度 enterOffset现在就是wrapper的偏移量加上高度的一般 也就是上下变换的临界值
          this.enterOffset = layWrapper.offsetTop + 73 + (layWrapper.clientHeight / 2)
          event.dataTransfer.dropEffect = 'copy'
          event.preventDefault()
          // event.stopPropagation()
        }
      },
      dragover (event) {
        if (this.notDraggable === true) {
          let layWrapper = $(event.target).parents('.layout-wrapper')[0]
          let index = parseInt(layWrapper.dataset.index)
          // 获取container滚动条的高度
          let scrollOffset = this.$refs.wrapper.scrollTop
          // 鼠标的偏移量
          let mouseOffset = event.pageY + scrollOffset
          let klass = event.target.className
          event.dataTransfer.dropEffect = 'copy'
          // 如果鼠标在wrapper的上半部分 上方提示 反之 下方提示
          if (mouseOffset <= this.enterOffset && klass !== 'tip-wrapper-top') {
            this.mailLayout[index].bottomShow = false
            this.mailLayout[index].topShow = true
          } else if (mouseOffset > this.enterOffset && klass !== 'tip-wrapper-top') {
            this.mailLayout[index].topShow = false
            this.mailLayout[index].bottomShow = true
          } else if (klass === 'tip-wrapper-top') {
            this.mailLayout[index].topShow = true
          }
          event.preventDefault()
          // event.stopPropagation()
        }
      },
      dragleave (event) {
        if (this.notDraggable === true) {
          event.stopPropagation()
          let layWrapper = $(event.target).parents('.layout-wrapper')[0]
          let index = parseInt(layWrapper.dataset.index)
          let scrollOffset = this.$refs.wrapper.scrollTop
          let mouseOffset = event.pageY + scrollOffset - 60
          let klass = event.target.className
          if (mouseOffset > layWrapper.offsetTop + 73) {
            this.mailLayout[index].bottomShow = false
            this.mailLayout[index].topShow = false
          } else if (klass === 'tip-wrapper-top') {
            this.mailLayout[index].topShow = false
          } else {
            this.mailLayout[index].topShow = true
          }
        }
      },
      drop (event) {
        if (this.notDraggable === true) {
          let layWrapper = $(event.target).parents('.layout-wrapper')[0]
          let index = parseInt(layWrapper.dataset.index)
          let content
          let scrollOffset = this.$refs.wrapper.scrollTop
          let mouseOffset = event.pageY + scrollOffset
          let klass = event.target.className
          let type = event.dataTransfer.getData('text/type')
          if (type === 'text') {
            content = '<p style="font-size:18px;line-height:30px;text-align:justify;">您可以自定义您的邮件内容，自由排版，添加图片，特征词，文字以及链接。</p>'
          } else if (type === 'img') {
            content = `<img src="https://qiniu.onloon.co/maildefault.png" class="cur-img" style="width:100%;height:auto;" alt="" />`
          } else {
            content = `<div style="padding:30px;text-align:center;text-align:center;font-size:12px;line-height:18px;color: #324751;">
              <p>
                If you have any Suggestions or comments, please don't forget to contact our customer service.
                <br />
                <br />
                We will serve you wholeheartedly
                <br />
                <br />
                This email is system mail. Please do not reply
              </p>
            </div>`
          }
          if (klass === 'tip-wrapper-top') {
            this.mailLayout[index].topShow = false
            this.mailLayout.splice(index, 0, {
              content,
              type,
              topShow: false,
              bottomShow: false
            })
          } else if (mouseOffset <= this.enterOffset) {
            this.mailLayout[index].topShow = false
            this.mailLayout.splice(index, 0, {
              content,
              type,
              topShow: false,
              bottomShow: false
            })
          } else if (mouseOffset > this.enterOffset) {
            this.mailLayout[index].bottomShow = false
            this.mailLayout.splice(index + 1, 0, {
              content,
              type,
              topShow: false,
              bottomShow: false
            })
          }
        }
      },
      mousedown (event) {
        this.moveIconDown = true
      },
      mouseup (event) {
        this.openEditor = false
        this.imgEditor = false
        this.moveIconDown = false
      },
      editContent (event) {
        this.openEditor = true
        this.imgEditor = false
        this.editorIndex = event.target.dataset.index
        this.editorType = event.target.dataset.type
        if (event.target.dataset.type === 'text' && this.mailLayout[this.editorIndex].content === '<p style="font-size:18px;line-height:30px;text-align:justify;">您可以自定义您的邮件内容，自由排版，添加图片，特征词，文字以及链接。</p>') {
          this.mailLayout[this.editorIndex].content = ''
          let editor = document.getElementsByClassName('vue-html5-editor')[0].children[1]
          this.$nextTick(() => {
            editor.focus()
          })
        }
        if (event.target.dataset.type === 'img') {
          this.imgUrl = $(event.target).parents('.layout-wrapper').find('.img img')[0].currentSrc
          this.imgEditor = true
        }
      },
      updateText (newVal) {
        this.mailLayout[this.editorIndex].content = newVal
      },
      updateImg (val) {
        this.mailLayout[this.editorIndex].content = `<img src="${val.urlWhole}" class="cur-img" style="max-width:100%;height:auto;" alt="" />`
        this.imgUrl = val.urlWhole
        this.commitMailLayout()
      },
      saveEdit (event) {
        this.openEditor = false
        this.imgEditor = false
        this.commitMailLayout()
      },
      commitMailLayout () {
        let arr = ''
        // 把数组中的content放进trtd里 拼接为一个字符串
        for (let item of this.mailLayout) {
          if (item.type === 'text') {
            arr += `<tr><td valign="top" style="width:100%;">${item.content}</td></tr><tr height="20"></tr>`
          } else if (item.type === 'img') {
            arr += `<tr><td valign="top" style="width:100%;text-align:center;">${item.content}</td></tr><tr height="20"></tr>`
          } else if (item.type === 'footer') {
            arr += `<tr><td aglin="center" valign="top" cellpadding="0" style="width:100%;background-color: #f0f1f2;">
              <table cellpadding="30" cellspacing="0" width="100%">
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
      </table>`.replace(/<a href=/, `<a target="_blank" href=`)
        this.$store.commit('DEVELOP_EMAILCONTENTLIST', JSON.stringify(this.mailLayout))
        this.$store.commit('DEVELOP_SENDINFO', {third: tableContent})
      },
      deleteContent (event) {
        this.deleteIndex = event.target.dataset.index
        this.dialogVisible = true
      },
      confirmDelete () {
        this.editorIndex = 0
        this.openEditor = false
        this.imgEditor = false
        this.dialogVisible = false
        if (this.mailLayout.length === 1) {
          this.$message.error('无法删除，内容不可为空')
        } else {
          this.mailLayout.splice(this.deleteIndex, 1)
          this.commitMailLayout()
        }
      },
      tipErr (val) {
        this.$message.error(val)
      },
      tipSuc (val) {
        this.$message.success(val)
      },
      outerover (e) {
        if (this.notDraggable === true) {
          e.dataTransfer.dropEffect = 'copy'
          let a = e.target.className
          let b = e.offsetY
          let c = (e.target.childNodes[0] && e.target.childNodes[0].clientHeight) ? (e.target.childNodes[0].clientHeight + 20) : 0
          if (a === 'edm-main' && b > c) {
            this.mailLayout[this.mailLayout.length - 1].bottomShow = true
          }
          event.preventDefault()
        }
      },
      outerleave (e) {
        if (this.notDraggable === true) {
          let a = e.target.className
          let b = e.offsetY
          let c = (e.target.childNodes[0] && e.target.childNodes[0].clientHeight) ? (e.target.childNodes[0].clientHeight + 20) : 0
          if (a === 'edm-main' && b > c) {
            this.mailLayout[this.mailLayout.length - 1].bottomShow = false
          }
        }
      },
      outerdrop (e) {
        if (this.notDraggable === true) {
          this.mailLayout[this.mailLayout.length - 1].bottomShow = false
          let a = e.target.className
          let b = e.offsetY
          let c = e.target.childNodes[0] ? (e.target.childNodes[0].clientHeight + 20) : 0
          if ((a === 'edm-main' && b > c) || a === 'tip-wrapper-bottom') {
            let content
            let type = e.dataTransfer.getData('text/type')
            if (type === 'text') {
              content = '<p style="font-size:18px;line-height:30px;text-align:justify;">您可以自定义您的邮件内容，自由排版，添加图片，特征词，文字以及链接。</p>'
            } else if (type === 'img') {
              content = `<img src="https://qiniu.onloon.co/maildefault.png" class="cur-img" style="width:100%;height:auto;" alt="" />`
            } else {
              content = `<div style="padding:30px;text-align:center;text-align:center;font-size:12px;line-height:18px;color: #324751;">
                <p>
                  If you have any Suggestions or comments, please don't forget to contact our customer service.
                  <br />
                  <br />
                  We will serve you wholeheartedly
                  <br />
                  <br />
                  This email is system mail. Please do not reply
                </p>
              </div>`
            }
            this.mailLayout.splice(this.mailLayout.length, 0, {
              content,
              type,
              topShow: false,
              bottomShow: false
            })
          }
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .flip-list-move {
    transition: transform 0.2s;
  }
  .ghost {
    opacity: .5;
    background: #C8EBFB;
  }
  .edm-container{
    width: 1200px;
    margin: 0 auto;
    font-size: 0;
    .edm-wrapper{
      vertical-align: top;
      display: inline-block;
      width: 780px;
      margin-right: 30px;
      .edm-main{
        width: 100%;
        height: 686px;
        padding: 20px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 0 8px rgba(0,0,0,0.08);
        overflow-y: scroll;
        .el-dialog{
          width: 360px;
          height: 180px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          .el-dialog__header{
            padding: 0
          }
          .delete-tip{
            .icon-font{
              font-size: 27px;
              color: #ff3b6e;
              margin-right: 10px;
            }
            .tip-content{
              font-size: 14px;
              color: #33475b;
              font-weight: 600;
            }
            .btn-wrapper{
              margin-top: 36px;
              margin-left: 40px;
              .el-button--danger{
                background-color: #ff3b6e;
                padding: 9px 24px;
              }
              .el-button--default{
                border: none;
                padding: 0 9px;
                color: #4f6d95;
              }
            }
          }
        }
        .layout-wrapper{
          min-height: 46px;
          margin-bottom: 20px;
          position: relative;
          border:3px solid transparent;
          .edit-layout{
            display: none;
            position: absolute;
            top: 0;
            color: #fff;
            width: 100%;
            height: 44px;
            box-sizing: border-box;
            background-color: rgba(80, 109, 149, 0.6);
            .move{
              display: inline-block;
              font-size: 22px;
              padding-left:10px;
              padding-top: 13px;
              cursor: move;
            }
            .edit{
              display: inline-block;
              float: right;
              font-size: 16px;
              padding-right: 16px;
              margin-top: 16px;
              border-right: 1px solid #fff;
              cursor: pointer;
            }
            .delete{
              display: inline-block;
              float: right;
              font-size: 16px;
              padding-right: 16px;
              padding-top: 16px;
              margin-left: 16px;
              cursor: pointer;
            }
          }
          &:hover{
            border:3px dashed #5488f9;
            .edit-layout{
              display: block;
            }
          }
          .text{
            width: 100%;
            height: auto;
            font-size: 12px;
            line-height: 1.5;
            text-align: justify;
          }
          .img{
            text-align: center;
            width: 100%;
            height: auto;
          }
          .footer{
            width: 100%;
            height: auto;
            color: #324751;
            background-color: #f0f1f2;
            line-height: 1.5;
            box-sizing: border-box;
            text-align: center;
          }
          .layout{
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
          .tip-wrapper-top, .tip-wrapper-bottom{
            width: 100%;
            height: 50px;
            line-height: 50px;
            border: 1px dashed #333;
            font-size: 18px;
            color: #246e7b;
            text-align: center;
            background-color: #e3f3f5;
            opacity: 0.8;
          }
        }
      }
    }
    .edm-tmpl{
      vertical-align: top;
      width: 390px;
      height: 476px;
      display: inline-block;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(0,0,0,0.08);
      .edm-tmpl-title{
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background-color: #F5F8FA;
        font-size: 18px;
        color: #33475b;
        font-weight: 600;
        padding-left: 30px;
        box-sizing: border-box;
      }
      .tmpl-list{
        display: flex;
        height: 426px;
        padding: 20px;
        box-sizing: border-box;
        flex-wrap: wrap;
        justify-content: space-between;
        .tmpl-item{
          width: 103px;
          height: 109px;
          border: 1px solid #cbd6e3;
          border-radius: 4px;
          padding: 20px 10px;
          text-align: center;
          box-sizing: border-box;
          .item-icon{
            display: block;
            margin-top: 8px;
            font-size: 48px;
            color: #bdc1d3;
          }
          .item-name{
            font-size: 13px;
            color: #32475a;
            line-height: 13px;
            margin-top: 5px;
          }
        }
      }
    }
    .editor-wrapper{
      vertical-align: top;
      width: 390px;
      height: 686px;
      display: inline-block;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(0,0,0,0.08);
      .editor-title{
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background-color: #F5F8FA;
        font-size: 18px;
        color: #33475b;
        font-weight: 600;
        padding-left: 30px;
        box-sizing: border-box;
      }
      .img-box{
        margin-top: 20px;
        margin-left: 30px;
      }
      .upload-tip{
        color: #7c98b6;
        margin-top: 16px;
        padding: 0 30px;
        line-height: 21px;
        font-size: 13px;
      }
      .vue-html5-editor{
        font-size: 12px;
        border:none;
        border-top-left-radius: 4;
        border-top-left-radius: 4;
        .toolbar{
          ul{
            border-bottom: 0;
            li{
              width: 92px;
              .icon{
                display: inline;
                vertical-align: top;
                font-size: 14px;
              }
            }
          }
        }
        .content{
          width: 330px;
          margin-left: 30px;
          border: 1px solid #dfe3eb;
          height: 444px;
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
      }
      .el-button{
        width: 90px;
        height: 34px;
        font-size: 13px;
        margin-top: 20px;
        margin-left: 30px;
      }
    }
  }
</style>
