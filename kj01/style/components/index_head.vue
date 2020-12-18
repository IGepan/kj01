<template>
  <div class="index-head">
    <div class="mdiv logInfos">
      <a
        class="logo"
        href="/"
      >
        <img
          src="/style/images/logos/mian_l.png"
          alt=""
        >
      </a>
      <div class="logRight">
        <div class="searchbox">
          <input
            class="input-search"
            placeholder="技术创新 疫情防控 项目申报 人工智能"
            v-model="searchKey"
            type="text"
          >
          <button
            class="btn-search"
            type="button"
            @click="searchFull"
          >搜 索</button>
        </div>
        <span class="iconfont icon-ico">
          <div class="qrcode">
            <img
              src="/style/images/index/qrcode.jpg"
              alt=""
            >
            <div class="qrcode-text">扫描二维码</div>
          </div>
        </span>
      </div>
    </div>
    <nav class="menus">
      <li class="active"><span>首页</span></li>
      <li><a href="/poindex.html"><span>资讯</span></a></li>
      <li><a href="/aindex.html"><span>活动</span></a></li>
      <li><a href="/service"><span>服务</span></a></li>
      <li><a href="/resources"><span>资源</span></a></li>
      <li><a href=""><span>关于我们</span></a></li>
    </nav>
  </div>
</template>
<script>
module.exports = {
  data: function () {
    return {
      searchKey: ''
    }
  },
  methods: {
    searchFull: function () {
      location.href = '/search/?title=' + this.searchKey
      // this.$dialog.showToast('敬请期待！')
      // this.$emit('search-full', this.getData())
    }
  }
}
</script>

<style>
img {
  max-width: 100%;
}
.index-head {
  background-color: #fff;
}
.logInfos {
  height: 80px;
  vertical-align: middle;
}
.logo {
  display: inline-block;
  float: none;
  padding-top: 7px;
  vertical-align: middle;
}
.logRight {
  float: right;
  position: relative;
  margin-top: 20px;
  font-size: 0;
}
.searchbox {
  display: inline-block;
  vertical-align: middle;
  height: 40px;
  border: 2px solid #018fff;
  font-size: 0;
}
.searchbox + .icon-ico {
  color: #018fff;
  display: inline-block;
  margin-left: 16px;
  vertical-align: middle;
  position: relative;
}
.qrcode {
  position: absolute;
  right: -110px;
  top: -11px;
  padding: 13px;
  width: 100px;
  opacity: 0;
  background-color: #ffffff;
  box-shadow: 0px 0px 16px 0px rgba(5, 14, 64, 0.15);
  border: solid 1px #e6e7f1;
  animation: 0.3s ease-in;
}
.qrcode::before {
  content: '';
  display: block;
  position: absolute;
  background-color: white;
  width: 10px;
  height: 10px;
  top: 10px;
  left: -5px;
  transform: rotateZ(45deg);
}
.qrcode-text {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 15px;
  letter-spacing: 0px;
  color: #018fff;
  font-weight: bold;
}
.searchbox + .icon-ico:hover .qrcode,
.searchbox + .icon-ico:active .qrcode {
  opacity: 1;
}
.input-search {
  display: inline-block;
  width: 358px;
  padding: 0 10px;
  line-height: 36px;
  vertical-align: middle;
}
.btn-search {
  background-color: #018fff;
  display: inline-block;
  vertical-align: middle;
  width: 98px;
  cursor: pointer;
  font-size: 16px;
  line-height: 36px;
  color: #fff;
}
.menus {
  height: 60px;
  background-color: #018fff;
  box-shadow: 0px 2px 0px 0px rgba(161, 161, 161, 0.3);
  vertical-align: middle;
  text-align: center;
  font-size: 0;
}
.menus li {
  display: inline-block;
  vertical-align: middle;
}
.menus li span {
  font-family: MicrosoftYaHei;
  display: inline-block;
  padding: 0 30px;
  font-size: 20px;
  color: #ffffff;
  line-height: 60px;
}
.menus li.active span,
.menus li:hover span {
  background-color: #095fec;
  font-weight: bold;
}
</style>
