<template>
  <div class="busness_spy">
    <!--<div class="top_prompt">外贸侦探为Beta测试版，当前您每天可提交<span class="highlighted">3</span>个侦探任务，每个任务最多呈现10条结果。且后续版本可能更改为其他功能形式</div>-->
    <!--<div class="busness_spy_placeholder"></div>-->
    <div :class="busnessSpyList.length !== 0  ? 'have-result input-contianer' : 'no-result input-contianer'">
      <el-input placeholder="商品英文关键字" v-model="searchFor" @keyup.enter.native="handClickIcon(1)" style="height:60px;" :maxlength="160">
        <el-button type="primary" slot="append" @click="handClickIcon(1)" style="height:58px;width: 80px;background-image: linear-gradient(90deg, #5488F9  0%, #00B8CC 100%);border-radius: 0px 4px 4px 0;border: none">提交</el-button>
      </el-input>
      <div class="busness_prompt" v-if="!isLoading">
        <span class="show-flag">
          <span class="flag-sub">最近提交</span>
          <span class="flag-container">
            <span class="flag" :title="item" v-for="item in recentKeywords" @click="handItem(item)">{{item}}</span>
          </span>
        </span>
        <span class="have-task">剩余提交<span class="task-num">{{remainNum}}</span>个侦探任务</span>
      </div>
    </div>
    <!--<div class="busness_spy_placeholder"></div>-->
    <div class="loading loading-circle loading-top" v-if="isLoading"></div>
    <!--<transition-group name="list">-->
      <div :class="submit === true ? 'spile busness_task_list' : 'busness_task_list'" v-if="!isLoading" v-for="busnessSpy in busnessSpyList" :key="busnessSpy">
        <!--任务处理未完成-->
        <div class="busness_task" v-if="busnessSpy.status!=2">
          <div class="task_name">
            <span class="left_desc">{{busnessSpy.createTime | time-formater-no-second}}</span>
            <span class="progress">
            <span class="progress-show" style="background: #00B8CC;">
              <span class="circle"><i class="el-icon-check"></i></span>任务创建
            </span>
            <span class="connect-line bg-ani"></span>
            <span class="progress-show" style="background-image: linear-gradient(-90deg, #15ACD7 0%, #1FA7DD 100%);">
              <span class="circle"><i class="el-icon-check"></i></span>线索采集
            </span>
            <span class="connect-line bg-gray"></span>
            <span class="progress-show bg-gray">
              <span class="circle"></span>数据分析
            </span>
            <span class="connect-line bg-gray"></span>
            <span class="progress-show bg-gray">
              <span class="circle"></span>任务完成
            </span>
          </span>
          </div>
          <!--<div class="task_name"><span class="left_desc">任务：{{busnessSpy.keywords}}</span>-->
          <!--<span class="right_desc">创建时间：{{busnessSpy.createTime | time-formater-no-second}}</span>-->
          <!--</div>-->
          <div class="task_info">
            <div class="taskName" >
              <div :title="busnessSpy.keywords" class="key-wrapper key-hover">
                {{busnessSpy.keywords}}
              </div>
              <!--<el-popover trigger="hover" placement="top" popper-class="group-popo">-->
                <!--<p>{{busnessSpy.keywords}}</p>-->
                <!--<span slot="reference" class="key-wrapper">-->
                <!--{{busnessSpy.keywords}}-->
              <!--</span>-->
              <!--</el-popover>-->
              <!--<el-tooltip class="item" effect="dark" content="busnessSpy.keywords" placement="top">-->
                <!--<span class="keywords">{{busnessSpy.keywords}}</span>-->
              <!--</el-tooltip>-->
            </div>
            <!--<div class="taskName" :title="busnessSpy.keywords">-->
              <!--{{busnessSpy.keywords}}-->
            <!--</div>-->
            <div class="task-line"></div>
            <div class="taskData">
              <div class="task_info_module">
                <p class="num">
                  <span class="color-cir"><span class="contect-cir"><span class="opp">分析中</span><span class="hidden-cir"></span></span></span>
                </p>
                <p class="desc" style="position: relative; top: -15px;">公司</p>
              </div>
              <div class="task_info_module">
                <p class="num">
                  <span class="color-cir"><span class="contect-cir"><span class="opp">分析中</span><span class="hidden-cir"></span></span></span>
                </p>
                <p class="desc" style="position: relative; top: -15px;">海关记录</p>
              </div>
              <div class="task_info_module">
                <p class="num">
                  <span class="color-cir"><span class="contect-cir"><span class="opp">分析中</span><span class="hidden-cir"></span></span></span>
                </p>
                <p class="desc" style="position: relative; top: -15px;">Linkedin联系人</p>
              </div>
              <div class="task_info_module">
                <p class="num">
                  <span class="color-cir"><span class="contect-cir"><span class="opp">分析中</span><span class="hidden-cir"></span></span></span>
                </p>
                <p class="desc" style="position: relative; top: -15px;">Facebook联系人</p>
              </div>
            </div>
          </div>
        </div>
        <!--任务处理已完成-->
        <div :class="busnessSpy.dashboard.companySize === 0 && busnessSpy.dashboard.customsSize === 0 && busnessSpy.dashboard.linkedInSize === 0 && busnessSpy.dashboard.facebookSize === 0 ? 'busness_task link_busness_info' : 'busness_task link_busness_info taskHover'" v-else @click="isShow(busnessSpy.id, busnessSpy.keywords, busnessSpy)">
          <div class="task_name">
            <span class="left_desc">{{busnessSpy.createTime | time-formater-no-second}}</span>
            <span class="progress">
            <span class="progress-show" style="background: #00B8CC;">
              <span class="circle"><i class="el-icon-check"></i></span>任务创建
            </span>
            <span class="connect-line bg-ani"></span>
            <span class="progress-show" style="background-image: linear-gradient(-90deg, #15ACD7 0%, #1FA7DD 100%);">
              <span class="circle"><i class="el-icon-check"></i></span>线索采集
            </span>
            <span class="connect-line" style="background-image: linear-gradient(-90deg, #00B8CC 0%, #5488F9 100%);"></span>
            <span class="progress-show" style="background-image: linear-gradient(-90deg, #359BE8 0%, #3F93EE 100%);">
              <span class="circle"><i class="el-icon-check"></i></span>数据分析
            </span>
            <span class="connect-line" style="background-image: linear-gradient(-90deg, #00B8CC 0%, #5488F9 100%);"></span>
            <span class="progress-show" style="background-image: linear-gradient(-90deg, #359BE8 0%, #3F93EE 100%);">
              <span class="circle"><i class="el-icon-check"></i></span>任务完成
            </span>
          </span>
          </div>
          <div class="task_info">
            <div class="taskName">
              <div :title="busnessSpy.keywords" class="key-wrapper key-hover">
                {{busnessSpy.keywords}}
                <!--<el-popover trigger="hover" placement="top" popper-class="group-popo">-->
                  <!--<p>{{busnessSpy.keywords}}</p>-->
                  <!--<span slot="reference" class="key-wrapper key-hover">-->
                    <!--{{busnessSpy.keywords}}-->
                  <!--</span>-->
                <!--</el-popover>-->
                <!--<el-tooltip class="item" effect="dark" :content="busnessSpy.keywords" placement="top">-->
                  <!--<span class="keywords">{{busnessSpy.keywords}}</span>-->
                <!--</el-tooltip>-->
              </div>
            </div>
            <div class="task-line"></div>
            <div class="taskData">
              <div class="task_info_module">
                <p class="num">{{busnessSpy.dashboard.companySize}}</p>
                <p class="desc">公司</p>
              </div>
              <div class="task_info_module">
                <p class="num">{{busnessSpy.dashboard.customsSize}}</p>
                <p class="desc">海关记录</p>
              </div>
              <div class="task_info_module">
                <p class="num">{{busnessSpy.dashboard.linkedInSize}}</p>
                <p class="desc">Linkedin联系人</p>
              </div>
              <div class="task_info_module">
                <p class="num">{{busnessSpy.dashboard.facebookSize}}</p>
                <p class="desc">Facebook联系人</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!--</transition-group>-->
  </div>
</template>

<script>
  import DevelopAPI from '@/api/developAPI'
  export default{
    name: 'BusnessSpy',
    data () {
      return {
        searchFor: '',
        page: 1,
        pageSize: 100,
        busnessSpyList: [],   // 数据列表
        isLoading: true,
        display: false,
        remainNum: 3,
        totalCount: 0,
        timer: '',
        recentKeywords: [],
        submit: false,
        raise: false,
        noTab: 0
      }
    },
    computed: {
    },
    destroyed () {
      clearInterval(this.timer)
    },
    mounted () {
      this.page = 1
      this.getTaskListFunc()
      this.timer = setInterval(() => {
        this.page = 1
        this.getTaskListFunc()
      }, 60000)
    },
    methods: {
      // 分页每页条数改变回调方法
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getTaskListFunc()
      },
      // 分页页码改变回调方法
      handleCurrentChange (val) {
        this.page = val
        this.getTaskListFunc()
      },
      handItem (val) {
        this.searchFor = val
      },
      // 提交创建任务
      handClickIcon (val) {
        this.noTab = 0
        if (val === 1) {
          if (this.searchFor === '') {
            this.$message({message: '商品任务关键字不能为空', type: 'error'})
            return
          }
        } else {
          this.searchFor = val
        }
        let params = {
          keywords: this.searchFor
        }
        DevelopAPI.addTask(params).then(res => {
          if (res.data.code === 0) {
            this.remainNum--
            for (var i = 0; i < this.recentKeywords.length; i++) {
              if (this.searchFor !== this.recentKeywords[i]) {
                this.noTab++
              }
            }
            if (this.noTab === this.recentKeywords.length) {
              if (this.recentKeywords.length > 4) {
                this.recentKeywords.splice(4, 1)
                this.recentKeywords.unshift(this.searchFor)
              } else {
                this.recentKeywords.unshift(this.searchFor)
              }
            }
            this.submit = true
            this.page = 1
            let cur = {
              createTime: new Date(),
              dashboard: {
                companySize: 0,
                customsSize: 0,
                facebookSize: 0,
                relativeContactsSize: 0
              },
              keywords: this.searchFor
            }
//            this.busnessSpyList.unshift(cur)
            setTimeout(() => {
              this.submit = false
              this.busnessSpyList.unshift(cur)
              this.raise = false
            }, 800)

            this.searchFor = ''
            console.log(this.busnessSpyList)
//             this.getTaskListFunc()
//            setTimeout(() => {
//              this.submit = false
//              this.getTaskListFunc()
//            }, 500)
          } else {
            this.$message({message: res.data.message, type: 'error'})
          }
        })
      },
      linkBusness (id, keyword) {
//        let linkurl = '/tradeDetectDetail?taskId=' + id + '&taskName=' + keyword
        let linkurl = '/tradeSearch?taskId=' + id + '&taskName=' + keyword
        this.$router.push({path: linkurl})
      },
      isShow (id, keyword, busnessSpy) {
        if (busnessSpy.dashboard.companySize === 0 && busnessSpy.dashboard.customsSize === 0 && busnessSpy.dashboard.linkedInSize === 0 && busnessSpy.dashboard.facebookSize === 0) {
//          return
        } else {
          this.linkBusness(id, keyword)
        }
      },
      // 获取任务列表
      getTaskListFunc () {
        this.display = false
        this.isLoading = true
        let params = {
          page: this.page,
          pageSize: this.pageSize
        }
        DevelopAPI.getTaskList(params).then(res => {
          let resdata = res.data
          if (resdata.code === 0) {
            this.isLoading = false
            this.busnessSpyList = resdata.data.records
            this.totalCount = resdata.data.totalCount
            this.recentKeywords = resdata.data.recentKeywords
            this.remainNum = resdata.data.leftSubmitTimes
            if (this.totalCount === 0) {
              this.display = true
            }
          } else {
            this.display = true
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  /*.ist-enter-active, .list-leave-active {*/
    /*transition: all 2s;*/
  /*}*/
  /*.list-enter, .list-leave-to {*/
    /*transform: translateY(0);*/
  /*}l*/
  body div.el-popover.group-popo {
    padding: 10px;
    min-width: 20px;
    background: #415b77;
    color: #fff;
    border-radius: 4px;
    .popper__arrow::after{
    border-bottom-color: #415b77;
    border-top-color: #415b77;
    }
  }
  .top_prompt{
    position: absolute;
    width:100%;
    left:0px;
    top:149px;
    background: #FDF8E6;
    padding:17px 0;
    text-align: center;
    font-size: 13px;
    color: #4F6D95;
    line-height: 18px;
    z-index: 20;
    .highlighted{
      font-size: 13px;
      color: #FFA726;
      margin:0 2px;
    }
  }
  .busness_spy_placeholder{
    width:100%;
    height:70px;
  }
  .busness_spy{
    margin-bottom: 30px;
    .paging-column{
      float: right;
      padding: 20px;
    }
    .no-result{
      width:800px;
      margin: 160px auto 94px;
    }
    .input-contianer{
      .el-input{
        .el-input__inner{
          height:60px;
          width:720px;
          .el-input-group__append{
            background-image: linear-gradient(90deg, #00B8CC 0%, #5488F9 100%);
          }
        }
      }
      .el-input .el-input-group__append{
        /*background: #5488F9;*/
        color:#fff;
      }
    }
    .have-result{
      width:800px;
      margin: 60px auto 94px;
      transition:All 2.0s ease-in-out;
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  .taskHover{
    cursor: pointer;
  }
  .busness_spy{
    .busness_prompt{
      margin-top:10px;
      font-size: 13px;
      color: #4F6D95;
      letter-spacing: 0px;
      line-height: 18px;
      .show-flag{
        float: left;
        .flag-sub{
          vertical-align: top;
          display: inline-block;
          height: 24px;
          line-height: 24px;
        }
      }
      .have-task{
        float: right;
        .task-num{
          padding: 0 5px;
          font-size: 13px;
          color: #5488F9;
        }
      }
      .flag-container{
        display: inline-block;
        height: 24px;
        width:600px;
        .flag{
          display: inline-block;
          padding: 0 8px;
          height: 22px;
          line-height: 22px;
          font-size: 13px;
          margin-left: 8px;
          background: rgba(84,136,249,0.10);
          border: 1px solid rgba(84,136,249,0.20);
          border-radius: 4px;
          cursor: pointer;
          max-width: 94px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
    .busness_task_list:hover{
      box-shadow: 0 0 14px rgba(84, 136, 249,.25);
    }
    .spile{
      transform: translateY(258px);
      transition: all 1.0s ease-in-out;
    }
    .busness_task_list{
      /*transform: translateY(100px);*/
      margin-top:4px;
      .link_busness_info{
      }
      .busness_task{
        margin-top:36px;
        background: #FFFFFF;
        box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.08);
        border-radius: 4px;
        .task_name{
          padding: 23px 60px 23px 40px;
          background: #F5F8FA;
          border: 1px solid #DFE3EB;
          display: inline-block;
          width:1100px;
          border-left: 2px;
          border-radius: 4px 4px 0 0;
          .left_desc{
            display: inline-block;
            width:210px;
            font-size: 14px;
            color: #7C98B6;
          }
          .progress{
            padding-left: 67px;
            .progress-show{
              display: inline-block;
              width:80px;
              height: 22px;
              line-height: 22px;
              border-radius: 100px;
              font-size: 12px;
              color: #FFFFFF;
              .circle{
                display: inline-block;
                width:14px;
                height: 14px;
                margin-left: 6px;
                margin-right: 2px;
                vertical-align: text-bottom;
                border-radius: 50%;
                background: #fff;
                .el-icon-check{
                  color: #00B8CC;
                  font-size: 8px;
                  position: relative;
                  top:-4px;
                  transform: scale(0.7);
                }
              }
            }
            .bg-color{
              background: #00B8CC;
            }
            .connect-line{
              display: inline-block;
              width:156px;
              height: 2px;
              vertical-align: middle;
            }
            .bg-gray{
              background: #B0C1D4;
            }
            .bg-ani{
              background-image: linear-gradient(90deg, #00B8CC 0%, #5488F9 100%);
            }
          }
          .right_desc{
            float:right;
            color: #7C98B6;
          }
        }
      }
      .task_info{
        overflow:hidden;
        height:142px;
        font-size: 0;
        border: 1px solid #fff;
        border-radius: 0 0 4px 4px;
        .taskName{
          display: inline-block;
          width:210px;
          float: left;
          height: 100%;
          line-height: 138px;
          vertical-align: top;
          text-align: center;
          font-size: 20px;
          color: #33475B;
          text-overflow: ellipsis;
          overflow: hidden;
          padding: 0 20px;
          .key-wrapper{
            width: 100%;
            display: inline-block;
            margin: 58px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 26px;
            line-height: 26px;
          }
          .key-hover:hover{
            color: #5488F9;
          }
          .keywords{
            width:100%;
            overflow: hidden;
            height: 22px;
            text-overflow: ellipsis;
            display: inline-block;
            margin: 60px 0;

          }
        }
        .task-line{
          display: inline-block;
          width:1px;
          height: 120px;
          margin-bottom: 10px;
          background: #DFE3EB;
        }
        .taskData{
          display: inline-block;
          height: 100%;
          width:940px;
        }
        .task_process{
          float:left;
          width:930px;
          height:100%;
          .process_desc{
            padding:50px 35px 68px 35px;
            overflow:hidden;
            .process_module{
              display: block;
              width:25%;
              box-sizing: border-box;
              float: left;
              font-size: 13px;
              color: #33475B;
              line-height: 18px;
              .label{
                margin-top:24px;
              }
              .process_line{
                position:relative;
              }
              .process_line:after{
                content: '';
                width: 265px;
                height: 6px;
                background: #EAF0F6;
                position: absolute;
                top: 7px;
              }
              .current_after,.after{
                .circle{
                  background: #00B8CC;
                }
              }
              .after.process_line:after{
                background:#00B8CC;
              }
              .current_after.process_line:after{
                background: -webkit-linear-gradient(left, #00B8CC , #5488F9); /* Safari 5.1 - 6.0 */
                background: -o-linear-gradient(right, #00B8CC, #5488F9); /* Opera 11.1 - 12.0 */
                background: -moz-linear-gradient(right, #00B8CC, #5488F9); /* Firefox 3.6 - 15 */
                background: linear-gradient(to right, #00B8CC , #5488F9); /* 标准的语法 */
              }
              .current{
                .circle{
                  background: #5488F9;
                }
              }
              .circle{
                width:20px;
                height:20px;
                border-radius: 10px;
                display: inline-block;
                background: #EAF0F6;
              }
            }
            .process_module:nth-child(1){
              .circle{
                margin-left:30px;
              }
            }
            .process_module:nth-child(2){
              text-align: center;
            }
            .process_module:nth-child(3){
              text-align: center;
            }
            .process_module:nth-child(4){
              text-align: right;
              .circle{
                margin-right:30px;
              }
            }
          }
        }
        .task_desc{
          float:left;
          width:269px;
          border-left: 1px solid #DFE3EB;
          height:100%;
          font-size: 20px;
          color: #7C98B6;
          line-height: 180px;
          text-align: center;
        }
        .task_info_module{
          width:25%;
          float: left;
          text-align: center;
          position: relative;
          top: 50%;
          transform: translateY(-50%);
            .num{
              font-size: 36px;
              color: #5488F9;
              line-height: 36px;
              margin-bottom:10px;
              .color-cir{
                display: inline-block;
                width: 48px;
                height: 48px;
                background-image: linear-gradient(10deg, #00B8CC 0%, #5488F9 100%);
                border-radius: 50%;
                .contect-cir{
                  font-size: 12px;
                  color: #C5D0DE;
                  display: inline-block;
                  width: 40px;
                  height: 40px;
                  background: #fff;
                  border-radius: 50%;
                  position: relative;
                  top: 4px;
                  .opp{
                    position: relative;
                    top:2px;
                    z-index: 99;
                  }
                  .hidden-cir{
                    display: inline-block;
                    width:25px;
                    height: 25px;
                    position: relative;
                    background: #fff;
                    top:-12px;
                    left: 14px;
                    border-radius: 50%;
                  }
                }
              }
            }
          .desc{
            font-size: 13px;
            color: #33475B;
            line-height: 18px;
          }
        }
      }
    }
  }
</style>
