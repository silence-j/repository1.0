<template>
  <div>
    <div class="enquiries">
      <p class="left_menu">
        <template v-if="serverLevel === '1'">
          <span :class="enquiriesType==0?'curr':''" @click="enquiriesType=0">询盘池</span>
          <em>|</em>
        </template>
        <span :class="enquiriesType==1?'curr':''" @click="enquiriesType=1">官网询盘</span>
      </p>
      <div class="select-section" v-if="enquiriesType==1">
        <div class="select-container">
        <el-select class="choose-time" :class="visible?'active':''" v-model="timeValue" placeholder="最近7天" @visible-change="visibleChange" @change="chooseTime" size="small">
          <el-option
          class="time-option"
          v-for="(option,index) in timeItems"
          :label="option.label"
          :key="index"
          :value="option.timeValue">
          </el-option>
        </el-select>
        </div>
      </div>
    </div>
    <div v-show="enquiriesType==0" style="margin-top:10px;margin-bottom: 30px">
      <!--初始化数据加载 start-->
      <div class="load-container" v-if="isInitLoad">
        <div class="loading loading-circle"></div>
      </div>
      <!--初始化数据加载 end-->
      <!--询盘池start-->
      <div v-if="!isInitLoad">
        <!--普通询盘-->
        <div class="common_enquiries moudle_floatleft" v-if="!commonIsNoData">
        <!--翻页数据加载end start-->
        <!--<div class="load-container common_load" >-->
          <!--<div class="loading loading-circle"></div>-->
        <!--</div>-->
          <div class="common_enquirie common_load_module" v-for="item in 5" :key="item" v-if="commonEnquiriesLoad && !microEnquiriesLoad">
            <div class="top_info">
              <p class="title"></p>
              <p class="desc"></p>
              <p class="classify"></p>
            </div>
            <div class="bottom_opt">
              <span class="time"></span>
              <span class="right_double_btn">
                 <em></em>
                 <em></em>
              </span>
            </div>
          </div>
          <!--翻页数据加载end-->
          <commonEnquiries v-if="!commonEnquiriesLoad" v-for="(commonEnquirie, index) in commonEnquirielist" :commonEnquirie="commonEnquirie" :key="commonEnquirie" :commonOpenIndex="fCommonOpenIndex" :index="index" @openCommon="openCommonIndexFunc"></commonEnquiries>
          <!--分页start-->
          <div class="bottom-change-page" v-if="!commonEnquiriesLoad && commonTotalPages>1">
          <p class="opt-center">
            <el-button @click="prePage" :disabled="commonPage==1?true:false">< 上一页</el-button>
            <el-button @click="nextPage" :disabled="commonPage==commonTotalPages?true:false">下一页 ></el-button>
          </p>
        </div>
        </div>
        <!--微询盘-->
        <div class="micro_enquiries" :class="!commonIsNoData?'limitwidth':'moudle_floatleft'">
          <!--数据加载 start-->
          <div class="load-container micro_load" v-if="!commonEnquiriesLoad && microEnquiriesLoad">
            <div class="data_load loading-circle"></div>
          </div>
          <!--数据加载 end-->
          <microEnquiries v-for="(microEnquiries, index) in microEnquirieslist" :microEnquiries="microEnquiries" :key="microEnquiries" @addSure="addMicroSureFunc" v-if="!microEnquiriesLoad" :microOpenIndex="fMicroOpenIndex" :index="index" @openMicro="openMicroIndexFunc"></microEnquiries>
          <el-pagination
            layout="prev, pager, next, sizes, jumper"
            :page-sizes="[7, 10, 20, 30]"
            @current-change="microCurrentChange"
            @size-change="microSizeChange"
            :current-page="microPage"
            :page-size="microPageSize"
            :total="microTotalCount"
            v-if="microTotalCount>microPageSize && !microEnquiriesLoad">
          </el-pagination>
        </div>
      </div>
      <!--询盘池end-->
      <!--普通询盘和微询盘都无数据展示start-->
      <div class="no-data" v-if="commonEnquirielist.length==0 && microEnquirieslist.length==0 && !microEnquiriesLoad && !microEnquiriesLoad ">
        <div class="center-section">
          <img src="../../assets/img/monitor/social-noData.png">
          <div class="publish-over" style="margin-top: 10px;">
            <p>尚未为您匹配到合适数据</p>
          </div>
        </div>
      </div>
      <!--无数据展示end-->
    </div>
    <!--官网询盘start-->
    <inquiryMonitor v-show="enquiriesType==1" :spacingTime="spacingTime"></inquiryMonitor>
    <!--官网询盘end-->
  </div>
</template>

<script>
  import commonEnquiries from './enquiriesPool/commonEnquiries'
  import microEnquiries from './enquiriesPool/microEnquiries'
  import inquiryMonitor from './inquiryMonitor'
  import enquiriesAPI from '@/api/enquiriesAPI'
  export default{
    data () {
      return {
        enquiriesType: 0,
        dataIsload: true,
        timeValue: 'option-1',
        timeItems: [
          {
            timeValue: 'option-1',
            label: '全部'
          }, {
            timeValue: 'option-2',
            label: '最近7天'
          }, {
            timeValue: 'option-3',
            label: '最近15天'
          }, {
            timeValue: 'option-4',
            label: '最近30天'
          }
        ],
        visible: false,
        firstClick: true,
        spacingTime: -1,
        commonEnquiriesLoad: true,
        microEnquiriesLoad: true,
        commonEnquirielist: [],
        microEnquirieslist: [],
        commonPage: 1,
        commonPageSize: 5,
        commonTotalPages: 1,
        microPage: 1,
        microPageSize: 7,
        microTotalCount: 7,
        isInitLoad: true,
        commonIsNoData: false,
        serverLevel: 1,
        fCommonOpenIndex: -1,
        fMicroOpenIndex: -1
      }
    },
    computed: {
    },
    components: {
      commonEnquiries,
      microEnquiries,
      inquiryMonitor
    },
    watch: {
    },
    mounted () {
      this.serverLevel = window.localStorage.serverLevel
      this.isInitLoad = true
      this.getCommonEnquiriesFunc()
      this.getMicroEnquiriesFunc()
      /**
       * 当 权限 不是超级盈店 时候，隐藏询盘池，只展现官网询盘
       */
      if (this.serverLevel !== '1') {
        this.enquiriesType = 1
      }
    },
    methods: {
      openMicroIndexFunc (index) {
        this.fMicroOpenIndex = index
      },
      openCommonIndexFunc (index) {
        this.fCommonOpenIndex = index
      },
      // 获取微询盘
      getMicroEnquiriesFunc () {
        this.microEnquiriesLoad = true
        let params = {
          page: this.microPage,
          size: this.microPageSize
        }
        enquiriesAPI.getMicroEnquiries(params).then(res => {
//          let microEnquiries = []
          if (res.data.code === 0) {
            let records = res.data.data.records
            this.microEnquirieslist = records
            this.microTotalCount = res.data.data.totalCount
//            records.forEach((item) => {
//              item.isShow = false
//              // item.page = 1
//              microEnquiries.push(item)
//            })
//            this.microEnquirieslist = microEnquiries
          }
          this.microEnquiriesLoad = false
          if (!this.commonEnquiriesLoad && !this.microEnquiriesLoad) {
            this.isInitLoad = false
          }
        })
      },
      microCurrentChange (page) {
        this.fMicroOpenIndex = -1
        this.microPage = page
        this.getMicroEnquiriesFunc()
      },
      // 微询盘数量变更
      microSizeChange (pageSize) {
        this.fMicroOpenIndex = -1
        this.microPageSize = pageSize
        this.getMicroEnquiriesFunc()
      },
      // 获取普通询盘
      getCommonEnquiriesFunc () {
        this.commonEnquiriesLoad = true
        this.commonEnquirielist = []
        this.commonIsNoData = true
        let params = {
          page: this.commonPage,
          size: this.commonPageSize
        }
        enquiriesAPI.getCommonEnquiries(params).then(res => {
          if (res.data.code === 0) {
            let records = res.data.data.records
            if (records.length === 0 && this.commonPage === 1) {
              this.commonIsNoData = true
            } else if (records.length > 0) {
              this.commonIsNoData = false
            }
            this.commonTotalPages = res.data.data.totalPages
            this.commonEnquirielist = records
//            records.forEach((item) => {
//              item.isShow = false
//              // item.imglistIsShow = false
//              this.commonEnquirielist.push(item)
//            })
          }
          this.commonEnquiriesLoad = false
          if (!this.commonEnquiriesLoad && !this.microEnquiriesLoad) {
            this.isInitLoad = false
          }
        })
      },
      // 上一页
      prePage () {
        if (this.commonPage > 1) {
          this.fCommonOpenIndex = -1
          this.commonPage = this.commonPage - 1
          this.getCommonEnquiriesFunc()
        }
      },
      // 下一页
      nextPage () {
        if (this.commonPage < this.commonTotalPages) {
          this.fCommonOpenIndex = -1
          this.commonPage = this.commonPage + 1
          // this.commonEnquiriesLoad = true
          this.getCommonEnquiriesFunc()
        }
      },
      microIsLoad (value) {
        this.microEnquiriesLoad = value
        if (!this.commonEnquiriesLoad && !value) {
          this.dataIsload = false
        }
      },
      commonIsLoad (value) {
        this.commonEnquiriesLoad = value
        if (!this.microEnquiriesLoad && !value) {
          this.dataIsload = false
        }
      },
      visibleChange () {
        if (this.firstClick) {
          this.firstClick = false
          this.visible = true
        } else {
          this.firstClick = true
          this.visible = false
        }
      },
      addCommonSureFunc (value) {
      },
      addMicroSureFunc (value) {
        let list = this.microEnquirieslist
        list.forEach((item, index) => {
          if (item.inquiryId === value.id) {
            item.enquiryPerson.contactsPersonId = value.personId
          }
        })
      },
      /*
       * 下拉框选择时间改变
       * */
      chooseTime (time) {
        switch (time) {
          case 'option-1' :
            this.spacingTime = -1
            break
          case 'option-2' :
            this.spacingTime = 7
            break
          case 'option-3' :
            this.spacingTime = 15
            break
          case 'option-4' :
            this.spacingTime = 30
            break
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/base.less';
  @import "../../assets/style/chance";
  .micro_load{
    height: 700px;
    padding-top: 343px;
  }
  .loadbg(){
    background: #F5F8FA;
    .animation(loadingColor,1s,infinite);
  }
  .common_load_module{
    .top_info{
      .title{
        width: 153px;
        height: 22px;
        .loadbg()
      }
      .desc{
        width: 364px;
        height: 40px;
        .loadbg()
      }
      .classify{
        width: 277px;
        height: 20px;
        .loadbg()
      }
    }
    .bottom_opt{
      .time{
        width: 95px;
        height: 18px;
        .loadbg()
      }
    }
  }
  .micro_enquiries {
    display: inline-block;
    width: 100%;
    vertical-align: top;
    background: #fff;
  }
  .micro_enquiries.limitwidth{
    width: 780px;
  }
  .one-row-confine{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .one-row-confine-two{
    height: 20px;
    overflow: hidden;
  }
  .enquiries{
    .select-section{
      display: inline-block;
      float: right;
      .select-container{
        .el-select{
          .el-input__inner{
            width:168px;
          }
        }
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  .enquiries{
    padding:10px 20px;
    background: #fff;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
    border-radius: 4px;
    font-size: 0px;
    color: #7C98B6;
    line-height: 18px;
    overflow:hidden;
    .select-section{
      display: inline-block;
      float: right;
    }
    .left_menu{
      display: inline-block;
      line-height: 24px;
      vertical-align: top;
      span{
        font-size: 13px;
        cursor: pointer;
        line-height: 30px;
      }
      .curr{
        color: #33475B;
        font-weight: 600;
      }
      em{
        font-size: 13px;
        padding:0 16px;
      }
    }
  }
</style>
