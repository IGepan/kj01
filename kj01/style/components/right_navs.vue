<template>
 <div class="policy-right">          
  <a v-if="userInfo && userInfo.userName" href="/common/buyer/index.html" class="item item1">
      <div>
          <div class="line1"></div>
            政策速递  
      </div>                                                              
  </a>
  <a v-else href="/common/login.html" class="item item1">
      <div>
          <div class="line1"></div>
            政策速递  
      </div>                                                              
  </a>        
  <a v-if="userInfo && userInfo.userName" href="/policyMatchLogin.html" class="item item2">
      <div>
          <div class="line1"></div>
          政策智配
      </div>
  </a>                    
  <a v-else href="/common/login.html" class="item item2">
      <div>
          <div class="line1"></div>
          政策智配
      </div>
  </a>
  <a v-if="userInfo && userInfo.userName" href="/answer/autoanswer.html" target="_blank" class="item item3">
      <div>
          <div class="line1"></div>
          政策答人
      </div>
  </a>
  <a v-else href="/common/login.html" target="_blank" class="item item3">
      <div>
          <div class="line1"></div>
          政策答人
      </div>
  </a>                            
  <a href="/declarationHelper/list.html" class="item item4">
      <div>
          <div class="line1"></div>
          申报助手
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
  }
}
</script>

<style >
 /*  2021.01.12  */
.policy-right {
    margin: 0 20px 0 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 400px;
}

.policy-right .item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    flex: 1;
    background-size: cover;
    background-repeat: no-repeat;
    font-size: 16px;
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
    background-image: url(../images/v2/index/zcsd.jpg);   
    color: #11CBF2;   
}
.policy-right .item2 {
    background-image: url(../images/v2/index/zczp.jpg);
    color: #FF6345;  
}
.policy-right .item3 {
    background-image: url(../images/v2/index/zcdr.jpg);
    color: #6070FF;  
}
.policy-right .item4 {
    background-image: url(../images/v2/index/sbzs.jpg);
    color: #27A2FF;  
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