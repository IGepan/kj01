<template>
 <div class="policy-right">          
  <a v-if="userInfo && userInfo.userName" href="/policyNoticeLog.html" class="item item1">
      <div>
            政策速递
        <div class="set">第一时间获取政策动态</div>
      </div>                                                              
  </a>
  <a v-else href="/common/login.html" class="item item1">
      <div>
            政策速递
        <div class="set">第一时间获取政策动态</div>
      </div>                                                              
  </a>        
  <a v-if="userInfo && userInfo.userName" href="/policyMatchLogin.html" class="item item2">
      <div>
          政策智配
        <div class="set">依托大数据，智能匹配政策</div>
      </div>
  </a>                    
  <a v-else href="/common/login.html" class="item item2">
      <div>
          政策智配
        <div class="set">依托大数据，智能匹配政策</div>
      </div>
  </a>
  <a v-if="userInfo && userInfo.userName" href="/answer/autoanswer.html" target="_blank" class="item item3">
      <div>
          政策答人
        <div class="set">你问我答，在线一对一</div>
      </div>
  </a>
  <a v-else href="/common/login.html" target="_blank" class="item item3">
      <div>
          政策答人
        <div class="set">你问我答，在线一对一</div>
      </div>
  </a>                            
  <a href="/declarationHelper/list.html" class="item item4">
      <div>
          申报助手
        <div class="set">手把手教你申报项目</div>
      </div>
  </a>
  </div>  
</template>

<script>
module.exports =  {
  data() {
    return {
      userInfo: {}
    } 
  },
  created() {

   this.$utils.getCookie('USER_INFO') && (this.userInfo = JSON.parse(localStorage.getItem('USER_INFO')))
   console.log('查看：-----------------------》',this.userInfo)
  }
}
</script>

<style >
 /*  2021.01.12  */
.policy-right {
  margin-top: 20px;
    padding: 20px;
    display: flex;
    /*flex-direction: column;*/
    flex: 1;
    /*min-height: 400px;*/
  clear: both;
  background: #FFFFff;
}

.policy-right .item {
    display: flex;
    align-items: center;
    justify-content:space-between;
    margin-right: 20px;
    flex: 1;
    background-size: cover;
    background-repeat: no-repeat;
    font-size: 16px;
    height: 90px;
  padding-left: 20px;
}
.policy-right .item:last-child {
    margin-bottom: 0;
  margin-right: 0;
}
.policy-right .item .set {
    margin-top: 10px;
    font-size: 12px;
  font-weight: normal!important;
    color: #c38462;
}
.policy-right .item1 {
    background-image: url(../images/v2/index/sudi.png);
    color: #ff5e06;
  font-weight: bold;
}
.policy-right .item2 {
    background-image: url(../images/v2/index/zhipei.png);
    color: #ff5e06;
  font-weight: bold;
}
.policy-right .item3 {
    background-image: url(../images/v2/index/daren.png);
    color: #ff5e06;
  font-weight: bold;
}
.policy-right .item4 {
    background-image: url(../images/v2/index/zhushou.png);
    color: #ff5e06;
  font-weight: bold;
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
