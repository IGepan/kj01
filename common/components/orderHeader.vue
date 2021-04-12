<template>
  <div class="detailbanner">
    <div class="mdiv">
      <a :href="$pathPrefix+'/index.html'" class="logo"><img :src="webInfo.logoUrl?webInfo.logoUrl:'/style/images/logos/blue-h66.png'" alt="" /></a>
      <div
        v-if="pagename"
        class="pagename"
        v-text="pagename"
      ></div>
      <ly-searchbox
        :isborder="true"
        @search-full="eventSearchFull"
      ></ly-searchbox>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ['pagename', 'http'],
  data: function () {
    return {
      webInfo:''
    }
  },
  created: function () {
     window.addEventListener("setItem", (e) => {
                if(e.key==='webInfo'){
                    let info=JSON.parse(e.newValue)
                    this.webInfo=info?info:'';
                }
            });
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
