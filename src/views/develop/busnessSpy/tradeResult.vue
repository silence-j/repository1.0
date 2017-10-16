<template>
  <div>
    <div class="main-cards" v-for="item in searchResult">
      <!--搜索结果小卡片-->
      <div class="card" >
        <div class="card-title" v-if="item.name !== '' && item.name !== null" :title="item.name">{{item.name}}</div>
        <div class="card-webset">
          <a :href="item.website" target="_blank" class="web" v-if="item.website !== '' && item.website !== null">{{item.website}}</a>
        </div>
        <div class="card-line"></div>
        <div class="card-info">
          <span class="info-title">国家: </span>
          <img :src="'../../../../static/img/ImageFlag/' + item.baseInfo.address.country + '.png' || '../../../../static/img/ImageFlag/common.png'" alt="" v-if="item.baseInfo !== null">
          <img src="../../../../static/img/ImageFlag/common.png" alt="" v-if="item.baseInfo === null">
          <span class="info-country" v-if="item.baseInfo !== null"> {{item.baseInfo.address.country}}</span>
        </div>
        <div class="card-info">
          <span class="info-title">贸易记录: </span>
          <span class="info-country">{{item.dashboard.customsSize}}条</span>
        </div>
        <div class="card-info">
          <span class="info-title">相关联系人: </span>
          <span class="info-country">{{item.dashboard.relativeContactsSize}}人</span>
        </div>
        <div class="card-desc" v-if="item.baseInfo !== null">
          <span v-if="item.baseInfo.address.address !== null || item.baseInfo.address.address !== ''">{{item.baseInfo.address.address}}</span>
          <span v-if="item.baseInfo.address.city !== null || item.baseInfo.address.city !== ''">{{item.baseInfo.address.city}}</span>
          <span v-if="item.baseInfo.address.state !== null || item.baseInfo.address.state !== ''">{{item.baseInfo.address.state}}</span>
          <span v-if="item.baseInfo.address.country !== null || item.baseInfo.address.country !== ''">{{item.baseInfo.address.country}}</span>
        </div>
        <div class="card-desc" v-if="item.baseInfo === null || (item.baseInfo.address.address === '' && item.baseInfo.address.city === '' && item.baseInfo.address.state === '' && item.baseInfo.address.country === '')">
          暂无地址
        </div>
      </div>
      <div class="card-operation">
        <el-button @click="toDetail(item.id)">查看详情</el-button>
        <!--<span class="operation" @click="add(item)" ><em class="icon-font">&#xe6ad;</em>联系人</span>-->
        <span class="operation" @click="add(item, index)" v-if="item.added === false"><em class="icon-font">&#xe6ad;</em> 联系人</span>
        <span class="operation" v-if="item.added === true" @click='toContact(item.contactsId)'><em class="icon-font icon-eye"></em> 查看</span>
      </div>
    </div>
    <!--loading-->
    <div class="loadingAll" v-show="isMore">
      <ul>
        <li class="loading-trade" v-for="item in 3">
          <div class="loading-card">
            <p class="loading-title"></p>
            <p class="loading-name"></p>
            <p class="loading-info"></p>
            <p class="loading-to"></p>
            <p class="loading-to"></p>
            <p class="loading-desc"></p>
          </div>
          <div class="loading-operation"></div>
        </li>
      </ul>
      <!--circle loading-->
      <div class="up-download">
        <div class="loading loading-circle img-load"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import exploreAPI from '@/api/exploreAPI'
  export default{
    name: 'tradeResult',
    props: {
      searchResult: Array,
      isMore: Boolean
    },
    data () {
      return {
        showMore: false,
        userId: window.localStorage.userId
      }
    },
    computed: {

    },
    components: {

    },
    mounted () {
      console.log(this.searchResult)
      console.log(this.searchResult.isMore)
      console.log(this.searchResult[0].name)
    },
    watch: {
    },
    methods: {
//      跳转到联系人详情页
      toContact (id) {
        window.open('#/contactDetail?contactId=' + id + '&contactType=1')
      },
//      跳转公司详情页
      toDetail (id) {
        this.$router.push({
          path: '/busnessSpyItem',
          query: {companyId: id}
        })
      },
      //      添加公司联系人
      add (item) {
        let params = {
          type: 1,
          userId: this.userId,
          socialAccountType: 6,
          name: item.name,
          address: '',
          thirdAccountId: item.id,
          createSource: 'recommend_search_create',
          thirdInfoList: JSON.stringify(item.socialInfoList),
          companySize: '',
          sales: '',
          website: item.website,
          mainProduct: item.mainProduct
        }
        if (item.baseInfo !== null && item.baseInfo !== undefined) {
          params.address = JSON.stringify(item.baseInfo.address)
          params.companySize = item.baseInfo.companySize
          params.sales = item.baseInfo.sales
        }
        exploreAPI.addContact(params).then(res => {
          if (!res.data.code) {
            item.added = true
            item.contactsId = res.data.data.id
            this.$message.success('添加联系人成功')
          } else {
            this.$message({message: '添加失败', type: 'error'})
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @keyframes loadingColor {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-webkit-keyframes loadingColor {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-moz-keyframes loadingColor {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-ms-keyframes loadingColor{
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-o-keyframes loadingColor{
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  .animation(@animation-name, @animation-duration, @animation-iteration-count){
    animation: @arguments;
    -webkit-animation: @arguments;
    -moz-animation: @arguments;
    -ms-animation: @arguments;
    -o-animation: @arguments;
  }
  .main-cards{
    width:380px;
    background: #fff;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
    border-radius: 4px;
    float: left;
    margin-right: 30px;
    margin-bottom: 20px;
    .card{
      /*width:245px;*/
      padding: 30px 20px;
      .card-title{
        height: 25px;
        line-height: 25px;
        font-size: 18px;
        color: #33475B;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .card-webset{
        height: 18px;
        line-height: 18px;
        font-size: 13px;
        color: #5488F9;
        margin-top: 2px;
        margin-bottom: 10px;
        .web{
          font-size: 13px;
          color: #5488F9;
          &:hover{
            text-decoration: underline;
          }
        }
      }
      .card-line{
        width:80px;
        background: #DFE3EB;
        margin-bottom: 10px;
        border: 1px solid #DFE3EB;
      }
      .card-info{
        line-height: 18px;
        margin-bottom: 4px;
        .info-title{
          font-size: 13px;
          color: #7C98B6;
          margin-right: 3px;
        }
        img{
          display: inline-block;
          width:16px;
          height: 10px;
          border-radius: 2px;
          background: pink;
        }
        .info-country{
          font-size: 13px;
          color: #4F6D95;
        }
      }
      .card-desc{
        font-size: 13px;
        color: #4F6D95;
        height: 40px;
        line-height: 20px;
        margin-top: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -ms-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
    .card-operation{
      font-size: 0;
      .el-button{
        width:254px;
        height: 40px;
        border: none;
        border-radius: inherit;
        color: #fff;
        background-image: linear-gradient(to right, #99B8FB 60%, #5488F9 100%);
        &:hover{
          background: rgba(84,136,249,0.80);
        }
      }
      .operation{
        display: inline-block;
        font-size: 13px;
        width:126px;
        height: 40px;
        line-height: 40px;
        background: #F5F8FA;
        vertical-align: bottom;
        text-align: center;
        color: #7C98B6;
        cursor: pointer;
        &:hover{
          color: #5488F9;
        }
      }
    }
  }
  .loadingAll{
    clear: both;
  }
  .up-download{
    overflow: hidden;
    height:40px;
    background: #fff;
    width:100%;
    margin-top:10px;
    .animation(loadingColor,1s,infinite);
    .loading{
      margin: 0 auto;
    }
  }
  .main-cards:nth-child(3n){
    margin-right: 0;
  }
</style>
