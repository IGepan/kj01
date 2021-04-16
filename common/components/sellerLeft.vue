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
          :title="userSeller.shopName"
        ></div>
        <div class="data_perfection">
          <a
            style="display: inline-block"
            v-if="userSeller.frozenFlag === '1'"
            href="frozen.html"
          >解冻</a><a
            style="display: inline-block"
            v-else
          >正常</a><span>|</span>
          <a
            style="display: inline-block;margin-left: -5px"
            :href="userSeller.activeFlag === '1' ? $pathPrefix+userSeller.shopIndexUrl : ''"
            target="_blank"
            @click="handleOpenShop($event)"
          >进入店铺</a>
        </div>
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
          :class="{active: isOpen(menuChild.code)}"
          :key="menuChild.id"
        >
          <strong
            @click="menuClick(menuChild, $event)"
            :class="{active: isOpen(menuChild.code)}"
          >{{menuChild.name}}<i
              class="iconfont icon-xiala"
              v-if="menuChild.children"
            ></i></strong>
          <span>
            <a
              @click="menuClick(item)"
              v-for="item in menuChild.children"
              v-text="item.name"
              :key="item.id"
              :class="{active: isOpen(item.code)}"
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
      code: '001.002'
    }).then(function (res) {
      vm.meanTreeData = res.result.children;
    })
    this.initUserInfo();
  },
  methods: {
    initUserInfo: function () {
      var vm = this;
      this.http.userSeller().then(function (res) {
        vm.userSeller = res.result;
      })
    },
    menuClick: function (menu, e) {
      // 叶子 跳转
      if (menu.isLeaf == 1) {
        if (menu.uri.indexOf('?') == -1) {
          window.location.href = this.$pathPrefix+menu.uri + '?code=' + menu.code;
        } else {
          window.location.href = this.$pathPrefix+menu.uri + '&code=' + menu.code;
        }
      } else if (menu.children) {
        $(e.srcElement).parents(".links").toggleClass("active");
      }
    },
    isOpen: function (code) {
      return this.mActivecode ? this.mActivecode.indexOf(code) !== -1 : false
    },
    handleOpenShop: function (e) {
      if (this.userSeller.activeFlag !== '1') {
        var options = {
          title: '温馨提示',
          texts: '请先激活店铺！',
          buttons: ['现在就去', '稍后激活'],
          callback: function () {
            location = this.$pathPrefix+'/common/seller/activate.html?code=001.002.001.003'
          }
        }
        this.$dialog.confirm(options)
        e.preventDefault();
      }
    }
  }
}
</script>

<style>
</style>
