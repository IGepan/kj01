<template>
  <div class="leftbox">
    <div class="leftbar">
      <div class="user_info">
        <div
          class="head"
          :style="{backgroundImage: userSeller.userPhotoMiniPath?'url('+userSeller.userPhotoMiniPath+')':'url(/common/images/defaultImg/default.gif)'}"
        > </div>
        <div
          class="name"
          v-text="userSeller.shopName||''"
        ></div>

        <div class="clear">
          <div class="level"><span v-text="'LV'+(userSeller.level||0)"></span>等级</div>
          <div class="honor"><span v-text="userSeller.credit||0"></span>信誉</div>
        </div>
      </div>
      <!--<seller-tree :http='http' class="leftbar"></seller-tree>-->
      <div
        class="group"
        v-for="menu in meanTreeData"
        :key="menu.id"
      >
        <div
          class="name"
          v-text="menu.name"
        ></div>
        <div
          class="links"
          v-for="menuChild in menu.children"
          :key="menuChild.id"
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
              :href="item.uri"
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
  props: ['http'],
  data: function () {
    return {
      userSeller: {},
      meanTreeData: [],
      mActivecode: ''
    }
  },
  created: function () {
    this.mActivecode = this.$utils.getReqStr('code')
    var vm = this;
    this.http.menuTree({
      code: '001.004'
    }).then(function (res) {
      vm.meanTreeData = res.result.children;
    })
    this.initUserInfo();
  },
  methods: {
    initUserInfo: function () {
      var vm = this;
      this.http.buyer().then(function (res) {
        vm.userSeller = res.result;
      })
    },
    menuClick: function (menu) {
      // 叶子 跳转
      if (menu.isLeaf == 1) {
        //if (menu.code !== '001.001.003.001') {
        if (menu.uri.indexOf('?') == -1) {
          window.location.href = this.$pathPrefix+menu.uri + '?code=' + menu.code;
        } else {
          window.location.href = this.$pathPrefix+menu.uri + '&code=' + menu.code;
        }
        // } else {
        //   this.$dialog.showToast('敬请期待！')
        // }
      }
    },
    isOpen: function (code) {
      return this.mActivecode ? this.mActivecode.indexOf(code) !== -1 : false
    }
  }
}
</script>

<style>
</style>
