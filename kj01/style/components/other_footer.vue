<template>
  <div class="footer">
    <div class="main_copyright"> Copyright 2017 - 2019 易智网 版权所有 <a
        href="http://www.beian.miit.gov.cn/"
        target="_blank"
      >渝ICP备09050127号-36</a> </div>
  </div>
</template>
<script>
module.exports = {
  data: function () {
    return {
      isConference: true
    }
  },
  created: function () {
    // document.title = this.isConference ?(document.title? document.title.split('-')[0] + '-科技创新综合服务平台' :'易智网-科技创新综合服务平台'): document.title.split('-')[0] + '-成渝城市群综合科技服务平台'
    document.title = '易智网';

  }
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
</style>
