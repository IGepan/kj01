<template>
  <div class="detailbanner">
    <div class="mdiv">
      <a
        href="/index.html"
        class="logo"
      >
        <img
          src="/style/images/logos/blue.png"
          alt=""
        >
      </a>
      <div
        v-if="pagename"
        class="pagename"
        v-text="pagename"
      ></div>
      <ly-searchbox
        :isborder="true"
        @search-full="eventSearchFull"
      >
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ['pagename', 'http'],
  data: function () {
    return {}
  },
  created: function () { },
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
