<template>
  <div class="record-wrapper">
    <div v-if="isLoading" class="loading loading-circle"></div>
    <div v-else>
      <h1 class="title">近期采购记录</h1>
      <div class="record-no-data" v-if="!localData.length">
        <img src="../../../../assets/img/empty-contact.png" alt="">
        <p>暂无数据</p>
      </div>
      <div>
        <div class="record-item" 
        v-for="(item, index) in localData"
        :key="index">
          <div class="send-info">
            <p class="city-name" :title="item.loadingPort">{{item.loadingPort}}</p>
            <i class="icon-font traffic">&#xe6b0;</i>
            <p class="reciver-name" :title="item.unloadingPort">{{item.unloadingPort}}</p>
            <p class="code-title" v-if="item.hsCode">Hs Code</p>
            <p class="code-num" v-if="item.hsCode">{{item.hsCode}}</p>
            <p class="time">{{item.arrivaldate|time-formater-no-hour}}</p>
          </div>
          <div class="location-info">
            <span class="weight-and-count">
              <p class="weight">{{item.weightKg}} KG</p>
              <p class="quantity">{{item.quantity}} Piece</p>
            </span>
            <span class="line"></span>
            <span class="name-and-desc">
              <p class="name">{{item.exporter}}</p>
              <p class="desc" :title="item.details">{{item.details}}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import developAPI from '@/api/developAPI'
export default {
  name: '',
  data () {
    return {
      isLoading: true,
      localData: []
    }
  },
  watch: {
    data (newVal, oldVal) {
      if (newVal.name !== oldVal.name) {
        this.getRecord()
      }
    }
  },
  mounted () {
  },
  computed: {

  },
  props: {
    data: {
      type: Object
    }
  },
  components: {
  },
  methods: {
    getRecord () {
      let now = this.timeToString(new Date())
      let stratTime = Date.parse(new Date()) - 12 * 30 * 24 * 60 * 60 * 1000
      let startDate = this.timeToString(stratTime)
      let params = {
        companyName: this.data.name,
        startDate,
        endDate: now
      }
      developAPI.getTrendRecord(params).then(res => {
        if (!res.data.code) {
          this.isLoading = false
          this.localData = Array.from(res.data.data.data).slice(0, 5)
        }
      })
    },
    timeToString (val) {
      let time = new Date(val)
      let year = time.getFullYear()
      let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
      let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
      return `${year}-${month}-${day}`
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .record-wrapper{
    width: 100%;
    height: 613px;
    background-color: #fff;
    margin-bottom: 16px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    .loading{
      position: relative;
      top: 265px;
      margin: 0 auto;
    }
    .title{
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #dfe3eb;
      text-indent: 30px;
      font-weight: 500;
      font-size: 18px;
      color: #33475b;
    }
    .record-no-data{
      width: 100%;
      height: 534px;
      img{
        display: block;
        width: 100px;
        height: auto;
        margin: 178px auto 0;
      }
      p{
        text-align: center;
        font-size: 13px;
        line-height: 20px;
        color: #33475b;
      }
    }
    .record-item{
      width: 100%;
      overflow: hidden;
      .location-info{
        height: 74px;
        padding: 16px 30px;
        box-sizing: border-box;
        border-bottom: 1px solid #e5eaf1;
        margin-bottom: 8px;
        .weight-and-count{
          display: inline-block;
          width: 150px;
          .weight{
            font-size: 20px;
            color: #33475b;
            margin-bottom: 5px;
            font-weight: 600;
          }
          .quantity{
            max-width: 90%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
            color: #7c98b6;
          }
        }
        .line{
          display: inline-block;
          width: 1px;
          height: 40px;
          margin: 0 26px;
          background-color: #dfe3eb;
        }
        .name-and-desc{
          display: inline-block;
          width: 420px;
          .name{
            font-size: 20px;
            font-weight: 600;
            color: #33475b;
            margin-bottom: 5px;
            max-width: 95%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .desc{
            font-size: 14px;
            color: #7c98b6;
            max-width: 95%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .send-info{
        width: 100%;
        height: 30px;
        line-height: 12px;
        padding: 9px 30px;
        box-sizing: border-box;
        background-color: #f5f8fa;
        // border-top: 1px solid #dfe3eb;
        .city-name{
          display: inline-block;
          width: 140px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: top;
          font-size: 13px;
          color: #33475b;
        }
        .traffic{
          color: #b0c1d4;
          vertical-align: top;
          font-size: 13px;
          margin: 0 30px;
        }
        .reciver-name{
          display: inline-block;
          vertical-align: top;
          font-size: 13px;
          color: #33475b;
          width: 170px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .code-title{
          display: inline-block;
          vertical-align: top;
          font-size: 13px;
          color: #7c98b6;
          margin-left: 40px;
          margin-right: 15px;
        }
        .code-num{
          display: inline-block;
          vertical-align: top;
          font-size: 14px;
          color: #33475b;
        }
        .time{
          display: inline-block;
          width: 100px;
          font-size: 13px;
          color: #4f6d95;
          vertical-align: top;
          text-align: right;
          float: right;
        }
      }
    }
  }
</style>
