<template>
  <div
    class="search"
    :class="{'searchBorder': false, 'searchInputLine': isInputLine}"
  >
    <a
      v-if="internal"
      :href="internal.url"
      v-text="internal.label"
    ></a>
  </div>
</template>
<script>
module.exports = {
  props: [
    'value',
    // 默认值
    'defaultValue',
    // 是否开启搜索本店
    'isSearchShop',
    // 是否启用边框
    'isborder',
    // 内部使用 跳转卖家和卖家中心对象
    'internal',
    // 输入框线
    'isInputLine'
  ],
  data: function () {
    return {
      searchTypes: [],
      searchData: {
        type: '',
        searchKey: ''
      },
      transformSearchTypes: {
        '01': 'all',
        '02': 'shop',
        '03': 'service',
        '04': 'source',
        '05': 'ticket'
      },
      transformShopStypes: {
        'all': '01',
        'service': '03',
        'source': '04'
      }
    }
  },
  watch: {
    searchTypes: function (v) {
      !this.searchData.type && (this.searchData.type = v[0].value)
    },
    'searchData.searchKey': function (v) {
      this.$emit('input', v)
    },
    'defaultValue': function (v) {
      this.searchData.type = v.type
    }
  },
  created: function () {
    var shop = location.pathname.indexOf('/shop/') !== -1;
    var shopIndex = shop && location.pathname.indexOf('/index.html') !== -1;
    var shopList = shop && location.pathname.indexOf('/list.html') !== -1;
    var listType = shop && this.$utils.getReqStr('id');
    var type = ''
    this.defaultValue && (this.searchData = this.defaultValue);
    this.$emit('update:isSearchShop', false)
    // this.getOption('comprehensive_search')
    // if (shop) {
    //   shopIndex && (type = 'all');
    //   listType === 'service' && (type = 'service');
    //   (listType === 'product' || listType === 'technology') && (type = 'source');
    //   this.searchData.type = this.transformShopStypes[type];
    // }
  },
  methods: {
    getOption: function (key) {
      var vm = this
      this.$httpCom.dict({ code: key }).then(function (res) {
        if (res.code === 'rest.success') {
          vm.searchTypes = res.result
        }
      })
    },
    getData: function () {
      var data = JSON.parse(JSON.stringify(this.searchData))
      data.searchKey = encodeURIComponent(data.searchKey)
      data.type = this.transformSearchTypes[data.type]
      return data
    },
    searchShop: function () {
      // this.$dialog.showToast('敬请期待！')
      // this.$emit('search-shop', this.getData())
    },
    searchFull: function () {
      location.href = '/search/?title=' + this.searchData.searchKey
      // this.$dialog.showToast('敬请期待！')
      // this.$emit('search-full', this.getData())
    }
  }
}
</script>
<style scoped>
.input-search:first-child {
  border-left: 2px solid #2649a1;
  width: 260px;
}
</style>
