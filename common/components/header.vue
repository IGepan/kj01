<template>
  <div class="userbanner">
    <div class="mdiv">
      <a
        href="/index.html"
        class="logo"
      ><img
          src="/style/images/logos/center.png"
          alt=""
        /></a>
      <div class="umenu">
        <!-- <a
          v-if="isConference"
          href="/activity/?code=001.004.001.003"
          :class="{'active': type === 'conference'}"
        >活动中心</a> -->
        <a
          v-if="isConference"
          href="/activity/list.html?code=001.004.001.001"
          :class="{'active': type === 'conference'}"
        >活动中心</a>
        <a
          v-if="type === 'seller'"
          href="/common/seller/index.html"
          :class="{'active': type === 'seller'}"
        >
          卖家中心
        </a>
        <a
          v-else
          href="/common/buyer/index.html"
          :class="{'active': type === 'buyer'}"
        >用户中心</a>
        <a
          href="/common/usercenter/user_information.html?code=001.003.001.001"
          :class="{'active': type === 'account'}"
        >账号管理</a>
        <a
          v-if="!isConference"
          href="/common/usercenter/user_message.html"
          :class="{'active': type === 'message'}"
        >消息</a>
      </div>
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
  props: ['type', 'http'],
  data: function () {
    return {
      isConference: true,
      internal: ''
    }
  },
  created: function () {
    var userInfo = JSON.parse(this.$utils.getCookie('USER_INFO'))
    if ((this.type === 'buyer' || this.type === 'conference' || this.type === 'account' || this.type === 'message') && userInfo && userInfo.userTypes && userInfo.userTypes.indexOf('002') !== -1) {
      this.internal = {
        label: '卖家中心',
        url: '/common/seller/index.html'
      }
    }
    if (this.type === 'seller' && userInfo && userInfo.userTypes && userInfo.userTypes.indexOf('001') !== -1) {
      this.internal = {
        label: '用户中心',
        url: '/common/buyer/index.html'
      }
    }
  },
  components: {
    'ly-searchbox': httpVueLoader('/style/components/searchbox.vue')
  },
  methods: {
    eventSearchFull: function (d) {
      if (d.type !== 'resource' && d.type !== 'ticket') {
        this.$utils.openNewTable('/searchList.html?type=' + d.type + '&word=' + d.searchKey + '&page=1')
      } else {
        this.$dialog.showToast('搜索敬请期待');
      }
    }
  }
}

</script>

<style scoped>
</style>
