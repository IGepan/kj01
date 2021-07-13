<template>
  <div class="userbanner">
    <div class="mdiv">
      <a :href="$pathPrefix + '/index.html'" class="logo"
        ><img
          :src="
            webInfo.logoUrl
              ? webInfo.logoUrl
              : '/style/images/logos/blue-h66.png'
          "
          alt=""
      /></a>
      <div class="umenu">
        <a
          v-if="isConference"
          :href="
            $pathPrefix + '/common/activity/list.html?code=001.004.001.001'
          "
          :class="{ active: type === 'conference' }"
          >活动管理</a
        >
        <a
          v-if="type === 'seller'"
          :href="$pathPrefix + '/common/seller/index.html'"
          :class="{ active: type === 'seller' }"
        >
          卖家中心
        </a>
        <a
          v-else
          :href="$pathPrefix + '/common/buyer/index.html'"
          :class="{ active: type === 'buyer' }"
          >用户中心</a
        >
        <a
          :href="
            $pathPrefix +
            '/common/usercenter/user_information.html?code=001.003.001.001'
          "
          :class="{ active: type === 'account' }"
          >账号管理</a
        >

        <a
          :href="$pathPrefix + '/common/usercenter/user_market_auth_form.html'"
          :class="{ active: type === 'market' }"
          >技术转移</a
        >
        <a
          v-if="!isConference"
          :href="$pathPrefix + '/common/usercenter/user_message.html'"
          :class="{ active: type === 'message' }"
          >消息</a
        >
      </div>
      <!--分站暂时没有搜索框      -->
      <ly-searchbox
        :is-input-line="true"
        :internal.sync="internal"
        @search-full="eventSearchFull"
      ></ly-searchbox>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ["type", "http"],
  data: function () {
    return {
      isConference: true,
      internal: "",
      webInfo: "",
      locations: location.href,
    };
  },
  created: function () {
    this.getPublicDetail();
    var userInfo = JSON.parse(this.$utils.getCookie("USER_INFO"));
    if (
      (this.type === "buyer" ||
        this.type === "conference" ||
        this.type === "account" ||
        this.type === "market" ||
        this.type === "message") &&
      userInfo &&
      userInfo.userTypes &&
      userInfo.userTypes.indexOf("002") !== -1
    ) {
      this.internal = {
        label: "卖家中心",
        url: this.$pathPrefix + "/common/seller/index.html",
      };
    }
    if (
      this.type === "seller" &&
      userInfo &&
      userInfo.userTypes &&
      userInfo.userTypes.indexOf("001") !== -1
    ) {
      this.internal = {
        label: "用户中心",
        url: this.$pathPrefix + "/common/buyer/index.html",
      };
    }
  },
  components: {
    "ly-searchbox": httpVueLoader(
      window.$pathPrefix + "/style/components/searchbox.vue"
    ),
  },
  methods: {
    getPublicDetail() {
      let vm = this;
      this.$httpCom.publicDetail().then(function (res) {
        if (res.code === "rest.success") {
          vm.webInfo = res.result;
          vm.monitorSetItem("webInfo", JSON.stringify(vm.webInfo));
        }
      });
    },
    eventSearchFull: function (d) {
      if (d.type !== "resource" && d.type !== "ticket") {
        this.$utils.openNewTable(
          "/searchList.html?type=" + d.type + "&word=" + d.searchKey + "&page=1"
        );
      } else {
        this.$dialog.showToast("搜索敬请期待");
      }
    },
  },
};
</script>

<style scoped>
.logo img {
  width: 120px;
  height: 35px;
}
</style>
