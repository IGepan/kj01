<template>
  <div class="mdiv">
    <a
      v-for="menu in navList"
      :key="menu.code"
      :href="menu.url"
      :class="[{active: categoryCode === menu.code}, menu.class]"
      v-text="menu.label"
    >
      服务
    </a>
  </div>
</template>

<script>
module.exports = {
  props: ['type'],
  data: function () {
    return {
      categoryCode: '',
      shortCode: '',
      navList: [
        {
          url: 'index.html',
          label: '店铺首页',
          class: 'nav_item',
          code: 'index'
        },
        {
          url: 'list.html?id=technology',
          label: '技术',
          class: 'nav_item',
          code: 'technology'
        },
        {
          url: 'list.html?id=service',
          label: '服务',
          class: 'nav_item',
          code: 'service'
        },
        {
          url: 'list.html?id=product',
          label: '产品',
          class: 'nav_item',
          code: 'product'
        },
        // {
        //   url: 'list.html?id=resource',
        //   label: '资源',
        //   class: 'nav_item',
        //   code: 'resource'
        // },
        {
          url: 'list_finished.html?id=finish',
          label: '已成交',
          class: 'nav_item',
          code: 'finish'
        }/*,
        {
          url: 'about.html',
          label: '关于我们',
          class: 'nav_item',
          code: 'about'
        }*/
      ]
    }
  },
  watch: {
    type: function (newVal, oldVal) {
      this.categoryCode = newVal;
    }
  },
  created: function () {
    var shortCode = this.$utils.getReqStr('shortCode');
    shortCode && this.navList.forEach(function (menu, i) {
      menu.url = menu.url + (i === 0 || i === 5 ? '?shortCode=' + shortCode : '&shortCode=' + shortCode)
    })
  },
  mounted: function () {
    if (!this.type || this.type === '') {
      this.categoryCode = this.$utils.getReqStr('id');
    } else {
      this.categoryCode = this.type;
    }

  },
  methods: {

  },
}

</script>

<style>
</style>
