<template>
  <div :class="{headerBg:isBg}">
<div class="mdiv">
  <div class="shopdiv">
    <a class="logo" :href=$pathPrefix+"/index.html"  >
<!--      <img @error="imgError(webInfo)" @load="successLoadImg"  :src="webInfo.logoUrl" alt=""  width="226" height="66"/></a>-->
      <img v-if="webInfo.logoUrl" :src="webInfo.logoUrl" width="226" height="66" />
      <img v-if="!webInfo.logoUrl" :src="Url">
    </a>

    <ly-searchbox
      :is-input-line="true"
      :is-search-shop="true"
      :default-value="defaultValue"
      @search-full="eventSearchFull"
      @search-shop="eventSearchShop"
    >
    </ly-searchbox>
    </div>
  </div>
  </div>
</template>

<script>
module.exports = {
  props: ['type', 'http', 'defaultValue'],
  data: function () {
    return {
      webInfo:'',
      Url:'/style/images/logos/blue-h66.png',
      isBg:false
    }
  },
  mounted: function () {
    window.addEventListener("setItem", (e) => {
      if(e.key==='webInfo'){
        let info=JSON.parse(e.newValue)
        this.webInfo=info?info:'';
        console.log(this.webInfo,'[[[')
      }
    });
    var url = window.location.href
    if (url.indexOf('/kaizhou/') > 0) {
      this.isBg=true
    }
  },
  methods: {

      eventSearchFull: function (d) {
      if (d.type !== 'resource' && d.type !== 'ticket') {
        this.$utils.openNewTable('/searchList.html?type=' + d.type + '&word=' + d.searchKey + '&page=1')
      } else {
        this.$dialog.showToast('搜索敬请期待');
      }
    },
    eventSearchShop: function (d) {
      if (d.type !== 'demand') {
        this.$emit('searchshop', d)
      } else {
        this.eventSearchFull(d);
      }
    },
  }
}
</script>
<style scoped>
   .headerBg{
     background: url(/common/template/t01/images/bg.png) 0% 0% / cover no-repeat;
     width: 100%;
     height: 98px;
   }
  .shopdiv {
    width: 100%;
  }
  .shopdiv::after {
    clear: both;
    content: '';
    display: block;
  }
</style>

