<template>
  <div class="yizhi_footer">
    <div class="link other">
      <div class="linkTilte">友情链接：</div>
      <div class="link-desc">
          <a href="http://kjj.cq.gov.cn" target="_blank">重庆市科学技术局</a>
          <a href="http://www.liangjiang.gov.cn" target="_blank">重庆市两江新区管委会</a>
          <a href="http://dsjj.cq.gov.cn" target="_blank">重庆市大数据应用发展管理局</a>
<!--          <a href="http://dsjj.cq.gov.cn" target="_blank">重庆市大数据应用发展管理局</a>-->
          <a href="http://www.cqast.cn" target="_blank">重庆市科学技术协会</a>
          <a href="https://www.cqast.org.cn/Index.shtml" target="_blank">重庆市科学技术研究院</a>
          <a href="http://www.cqhte.com/index.php" target="_blank">重庆市高新技术企业协会</a>
          <a href="http://www.cqsczt.com/scsite/index/index.html" target="_blank">重庆孵化器协会</a>
          <a href="http://www.cqhitech.com/" target="_blank">重庆创新方法网</a>
      </div>
    </div>
    <div class="webBaseInfo">
      <div class="bottomLogo">
        <img
          src="/style/images/logos/bottomNew.png"
          alt=""
        >
      </div>
      <div class="bottomCode">
        <div class="imgBox">
          <img
            src="/style/images/footerCode1.jpg"
            alt=""
          >
          <div class="code-text">政策惠小程序</div>
        </div>
        <div class="imgBox">
          <img
            src="/style/images/footerCode2.jpg"
            alt=""
          >
          <div class="code-text">易智动小程序</div>
        </div>
      </div>
      <div class="bottomTelInfo">
        <div class="bottomTel">023-61365809</div>
        <div class="bottomWorker">全国免费服务热线(工作日：09:00-17:30)</div>
      </div>
    </div>
    <div class="footer">
      <div class="link">
        <a href="about.html">关于易智网</a>
<!--        <a href="#">免责声明</a>-->
        <a href="#">隐私政策</a>
        <a href="#">平台协议</a>
<!--        <a href="#">联系客服</a>-->
      </div>
      <div class="main_copyright"> Copyright © 2019 易智网 版权所有 <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
        >渝ICP备09050127号-36</a>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  data: function () {
    return {}
  },
  created: function () {
    // if (location.pathname === '/' || location.pathname === '/index.html') {
    //   document.title = document.title.split('-')[0] + '易智网-科技创新综合服务平台';
    // } else {
    //   document.title = document.title.split('-')[0] + '-易智网';
    // }
    document.title = '易智网-科技创新综合服务平台'
  },
}
</script>

<style>
#store_box,
.box {
  padding-bottom: 0px;
}
.footer {
  position: relative;
}
.yizhi_footer {
  background-image: url("../images/footer_bg.png");
  width:100%;
  height:400px;
}
.yizhi_footer .footer {
  border-top: 0;
  padding: 19px 0 67px;
  background-color: transparent;
}
.yizhi_footer .link {
  font-size: 0;
  text-align: center;
}
.yizhi_footer .link.other {
  padding: 47px 0 37px;
  display:flex;
  width:1135px;
    margin:0 auto;
}
.yizhi_footer .link .linkTilte {
  color: #ced8fb;
  font-size: 14px;
  margin-top:15px;
}
.yizhi_footer .link .link-desc{
    flex:1;
    text-align: left;
}
.yizhi_footer .link a {
  color: #ced8fb;
  padding: 0 10px;
  font-size: 14px;
  border-right: 1px solid #aeaeae;
    margin-top:15px;
    display:inline-block;
}
.yizhi_footer .link a:last-child {
  border-right-color: transparent;
}
.yizhi_footer .main_copyright {
  color: #ced8fb;
}
.yizhi_footer .main_copyright>a{
  color: #ced8fb;
}
.yizhi_footer .webBaseInfo {
  width: 1135px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  border-top: 1px solid #646b83;
  border-bottom: 1px solid #646b83;
  padding: 20px 210px;
}

.yizhi_footer .webBaseInfo .bottomLogo {
  margin-right: 32px;
}
.yizhi_footer .webBaseInfo .bottomCode {
  font-size: 0;
  margin-right: 20px;
  display: flex;
  justify-content: space-between;
}
.yizhi_footer .webBaseInfo .bottomCode .imgBox {
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
}
.yizhi_footer .webBaseInfo .bottomCode .imgBox img {
  max-width: 100%;
  width:80px;
  height:80px;
}
.yizhi_footer .webBaseInfo .bottomCode .imgBox .code-text {
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  width: 100%;
  color: #ced8fb;
}
.yizhi_footer .webBaseInfo .bottomCode .imgBox:first-child {
  padding-right: 20px;
  border-right: 1px solid #646b83;
  width: 121px;
  margin-right: 20px;
}
.yizhi_footer .webBaseInfo .bottomTelInfo {
  height: 65px;
  flex: 1;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}
.yizhi_footer .webBaseInfo .bottomTel {
  font-size: 30px;
  line-height: 24px;
  letter-spacing: 0px;
  color: #ffffff;
}
.yizhi_footer .webBaseInfo .bottomWorker {
  font-size: 14px;
  letter-spacing: 0px;
  color: #ced8fb;
}
</style>
