<template>
  <div>
      <div class="headerBox">
        <div class="mdiv">
          <div class="headers">
            <a class="header-logo" href="/index.html">
              <img src="./style/images/logos/bsublogo.png" alt="">
            </a>
            <div class="header-text">
              <div>科技创新</div>
              <div>综合服务平台</div>
            </div>
          </div>
        </div>
      </div>
<!--      <div class="machHeader">-->
<!--        <div class="mdiv">-->
<!--          <div class="h1">政策智配</div>-->
<!--          <div class="steps" :class="{steps1: currentStep < 4, steps2: currentStep == 2 || currentStep == 3, steps3: currentStep == 3}">-->
<!--            <div class="item item1"> -->
<!--              <div class="numbers"> -->
<!--                <div class="circle">1</div>-->
<!--                <div class="line">-->
<!--                  <div class="line1"></div>-->
<!--                  <div class="line2"></div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="text">选择诊断企业</div>-->
<!--            </div>-->
<!--            <div class="item item2"> -->
<!--              <div class="numbers"> -->
<!--                <div class="circle">2</div>-->
<!--                <div class="line">-->
<!--                  <div class="line1"></div>-->
<!--                  <div class="line2"></div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="text">完善企业信息</div>-->
<!--            </div>-->
<!--            <div class="item item3">-->
<!--              <div class="numbers">-->
<!--                <div class="circle">3</div>-->
<!--              </div>-->
<!--             <div class="text">查看诊断报告</div>-->
<!--            </div>            -->
<!--          </div>-->
<!--      </div>-->
<!--      </div>    -->
  </div>
</template>

<script>
module.exports = {
  name: 'policyMatch_head',
  props: {
    currentStep: {
      type: String,
      default: ''
    },
  },
  data() {
    return {

    }
  },
  created() {
  }
 }
</script>

<style scoped>
.headerBox {
  background-color: #ffffff;

 }
 .headers {
  display: flex;
  width: 100%;
  height: 100px;
  align-items: center;
 }
.header-logo {
  display: flex;
 }
 .header-logo {
  display: flex;
  align-items: center;
 }
 .header-logo a {
  display: flex;
  width: 170px;
  height: 50px;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
 }
 .header-logo a img {
  width: 100%;
 }
 .header-text {
  font-family: XinYeNianTi;
  font-size: 24px;
  color: #01c8f2;
 }
 .machHeader {
   height: 164px;
   background: blue url('../images/poindex/bg_head.jpg') no-repeat;
   background-size: 100% 100%;
   
 }
 .machHeader .mdiv {
   display: flex;
   align-items: center;
   justify-content: space-between;
   height: 100%;
 }

.machHeader .mdiv:after {
  content: initial;
}
 .machHeader .h1 {
   margin: 0;
   color: #fff;
   height: 100%;
   line-height: 164px;
   font-size: 40px;
 }
 .machHeader .steps {
   display: flex;
   height: 80px;
 }
 .machHeader .steps .item {
  position: relative;
 }
  .machHeader .steps .item .numbers {
    margin-bottom: 10px;
    display: inline-flex;
    align-items: center;  
  }
 .machHeader .steps .item:last-child {
   padding-right: 50px; 
 }
 .machHeader .steps .item .text {
   position: absolute;
   left: -20%;
   color: #fff;
 }
 .machHeader .steps .circle {
   display: inline-flex;
   align-items: center;
   justify-content: center;
   border: 4px solid #fff;
   border-radius: 50%;  
   color: #fff;
   font-size: 18px;
   width: 40px;
   height: 40px;
   background: #fff;
   color: #38cbf2;
 }
.machHeader .steps .line {
   margin-left: -2px;
   display: flex;
   width: 100px;
   background: #fff;
   border-top: 2px solid #fff;
   border-bottom: 2px solid #fff;
}
.machHeader .steps .line1 { 
  margin-left: 2px;
  height: 4px;
  width: 50%;
}
.machHeader .steps .line2 {
  margin-right: -2px;
  height: 4px;
  width: 50%;
}
.machHeader .steps1 .item1 .circle {
  background: #38cbf2;
  color: #fff;
}
.machHeader .steps1 .item1 .line1 {   
   background: #38cbf2;
}
.machHeader .steps2 .item1 .line2 {
  background: #38cbf2;
  color: #fff;
}
.machHeader .steps2 .item2 .circle {
  background: #38cbf2;
  color: #fff;
}
.machHeader .steps2 .item2 .line1 {   
   background: #38cbf2;
}
.machHeader .steps3 .item2 .line2 {   
   background: #38cbf2;
}
.machHeader .steps3 .item3 .circle {   
   background: #38cbf2;
   color: #fff;
}
</style>