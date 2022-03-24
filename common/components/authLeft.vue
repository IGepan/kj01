<template>
  <div class="leftbox">
    <div class="leftbar">
<!--      <div class="user_info">-->
<!--        <div-->
<!--          class="head"-->
<!--          :style="{backgroundImage: userSeller.userPhotoMiniPath?'url('+userSeller.userPhotoMiniPath+')':'url(/common/images/defaultImg/default.gif)'}"-->
<!--        > </div>-->
<!--      </div>-->
      <div
        class="group"
        v-for="menu in meanTreeData"
        :key="menu.name"
      >
        <div
          class="name"
          v-text="menu.name"
        ></div>
        <div
          class="links"
          v-for="menuChild in menu.children"
          :key="menuChild.name"
        >
          <strong
            :class="{active: isOpen(menuChild.code)}"
            @click="menuClick(menuChild)"
          >{{menuChild.name}}<i
              class="iconfont icon-xiala"
              v-if="menuChild.children"
            ></i></strong>
          <span>
            <a
              :href="$pathPrefix+item.uri"
              v-for="item in menuChild.children"
              v-text="item.name"
              :key="item.name"
            ></a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ['jquery', 'http'],
  data: function () {
    return {
      userSeller: {},
      meanTreeData: [],
      mActivecode: ''
    }
  },
  created: function () {
    this.mActivecode = this.$utils.getReqStr('code')
  },
  mounted: function () {
    var vm = this;
    this.http.menuTree({
      code: '001.003'
    }).then(function (res) {
      vm.meanTreeData = res.result.children;
    })
    this.http.buyer().then(function (res) {
      vm.userSeller = res.result;
    })
  },
  methods: {
    menuClick: function (menu) {
      // 叶子 跳转
      if (menu.isLeaf == 1) {
        if (menu.uri.indexOf('?') == -1) {
          window.location.href = this.$pathPrefix+menu.uri + '?code=' + menu.code;
        } else {
          window.location.href = this.$pathPrefix+menu.uri + '&code=' + menu.code;
        }
      }
    },
    isOpen: function (code) {
      return this.mActivecode ? this.mActivecode.indexOf(code) !== -1 : false
    }
  }
}
</script>

<style>
.leftbar .group .links strong.active{
  background-color:#fc7f10;
  color: #fff!important;
  position: relative;
  width: 175px;
  margin-left: -30px;
  text-align: center;
  font-size: 18px;
  border-radius: 5px 5px 0px 0px;
  box-shadow: 0px 0px 5px #dfdfdf;
}
.leftbar .group .links strong.active::before{
  content: "";
  width: 0;
  height: 0;
  border-top: 15px solid  #ff5e06;
  border-left: 12px solid transparent;
  position: absolute;
  top: 40px;
  left: 0px;
}
.leftbar .group .links strong.active::after{
  content: "";
  width: 0;
  height: 0;
  border-top: 15px solid  #ff5e06;
  border-right: 12px solid transparent;
  position: absolute;
  top: 40px;
  right: 0px;
}
</style>
