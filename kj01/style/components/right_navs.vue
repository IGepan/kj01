<template>
  <div class="policy-right">
    <a v-if="userInfo && userInfo.userName" href="/policyMatchLogin.html" class="item item1">
      <div>
        <h2>政策智配</h2>
        <p>依托大数据，智能匹配政策</p>
        <button>立即匹配</button>
      </div>
    </a>
    <a v-else href="/common/login.html" class="item item1">
      <div>
        <h2>政策智配</h2>
        <p>依托大数据，智能匹配政策</p>
        <button>立即匹配</button>
      </div>
    </a>
    <div class="item item4">
      <div style="display: flex;background: #FFFFff;justify-content: space-between">
        <span>申报助手</span>
        <a href="/declarationHelper/list.html" target="_blank">更多></a>
      </div>
      <div class="list" style="margin-top:20px;" v-for="item in helperList">
       <a :href="'/declarationHelper/detail.html?id='+item.id" :title="item.title" target="_blank"><img src="/style/images/poindex/left.png"/>{{item.title}}</a>
      </div>
    </div>
    <a v-if="userInfo && userInfo.userName" href="/answer/autoanswer.html" target="_blank" class="item item3">
      <div>
        <h2>政策答人</h2>
        <p>你问我答，在线一对一</p>
        <button>发送问题</button>
      </div>
    </a>
    <a v-else href="/common/login.html" target="_blank" class="item item3">
      <div>
        <h2>政策答人</h2>
        <p>你问我答，在线一对一</p>
        <button>发送问题</button>
      </div>
    </a>
<!--    <a v-if="userInfo && userInfo.userName" href="/common/buyer/index.html" class="item item2">-->
<!--      <div>-->
<!--        <span style=" color: #ff5e06;font-weight: bold">开通政策速递</span>-->
<!--        <p>第一时间获取政策动态</p>-->
<!--      </div>-->
<!--    </a>-->
<!--    <a v-else href="/common/login.html" class="item item2">-->
<!--      <div>-->
<!--        <span style=" color: #ff5e06;font-weight: bold">开通政策速递</span>-->
<!--        <p>第一时间获取政策动态</p>-->
<!--      </div>-->
<!--    </a>-->
  </div>
</template>

<script>
module.exports =  {
  data() {
    return {
      helperList: [],
      userInfo: {}
    }
  },
  created() {
    this.$utils.getCookie('USER_INFO') && (this.userInfo = JSON.parse(localStorage.getItem('USER_INFO')))
    this.getPage();
  },
  methods:{
    getPage:function () {
      var $this = this;
      this.$http.post(httpUrl.baseUrl + '/wxApp/assistant/selectByPage',{pageNum: 1, pageSize: 4})
          .then(function (res) {
            $this.helperList = res.result.list;
          });
    }

  }
}
</script>

<style >
/*  2021.01.12  */
.policy-right {
  /*margin: 0 20px 0 20px;*/
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 400px;
}

.policy-right .item {
  display: block;
  /*display: flex;*/
  /*align-items: center;*/
  /*justify-content: center;*/
  margin-bottom: 20px;
  /*flex: 1;*/
  /*background-size: cover;*/
  /*background-repeat: no-repeat;*/
  /*font-size: 16px;*/
}
.policy-right .item:last-child {
  margin-bottom: 0;
}
.policy-right .item .line1 {
  margin-bottom: 1em;
  width: 1.5em;
  height: 3px;
}
.policy-right .item1 {
  padding:0 20px;
  height: 200px;
  background: url(../images/poindex/zp.png) no-repeat;
  background-size:cover ;
  color: #FFFFff;
}
.policy-right .item1 button{
  padding:10px 25px;
  background: #FFFFff;
  color: #ff5e06;
  border-radius: 25px;
  margin-top: 10px;
}
.policy-right .item3 button{
  padding:10px 25px;
  background: #FFFFff;
  color: #ff5e06;
  border-radius: 25px;
  margin-top: 10px;
}
.policy-right .item2 {
  text-align:center;
  padding:15px 0;
  height: 90px;
  background-image: url(../images/poindex/sd.png);
  color: #3a3a3a;
}
.policy-right .item3 {
  padding:0 20px;
  text-align: center;
  height: 184px;
  background-image: url(../images/poindex/bottom.png);
  color: #FFFFff;
}
.policy-right .item4 {
  padding: 15px;
  background: #FFFFff;
  color: #ff5e06;
}
.policy-right .item4 span{
  padding-left: 10px;
  font-weight: bold;
  border-left:2px solid #ff5e06;
}
.policy-right .item4 img{
  vertical-align: middle;
  margin-right: 15px;
}
.policy-right .item4 a{
  display: block;
  color: #3a3a3a;
  font-size: 14px;
}
.policy-right .item4 .list a{
  padding: 15px; border: 1px solid #e3eaf1;
  font-size: 16px!important;
  line-height: 36px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.policy-right .item4 .list a:hover{
  border-color:#ff5e06 ;
  color: #ff5e06;
}
.policy-right .item1 .line1 {
  background-color: #11CBF2;
}
.policy-right .item2 .line1 {
  background-color: #FF6345;
}
.policy-right .item3 .line1 {
  background-color: #6070FF
}
.policy-right .item4 .line1 {
  background-color: #27A2FF
}
/*  2021.01.12  */
</style>