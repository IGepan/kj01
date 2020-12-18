// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpOrderApi', 'httpCom', 'jqValidate', 'dialog', 'httpUrl'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpOrderApi, httpCom, jqValidate, dialog, httpUrl) {

    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        showFull: false,
        http: httpUser,
        httpCom: httpCom,
        jquery: $,
        detailInfo: null
      },
      watch: {
        isOrderSelectedAll: function (newVal, oldval) {
          this.orderList.forEach(function (item) {
            item.selected = newVal
          })
        }
      },
      created: function () {
        id = this.$utils.getReqStr('id')
        id && this.getInfos(id)
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      mounted: function () {
      },
      methods: {
        getInfos: function (id) {
          var vm = this
          httpOrderApi.plandetail({ id: id }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.detailInfo = res.result
            }
          })
        },
        add: function (gid, sid, stock) {
          var vm = this
          if (stock) {
            httpOrderApi.addshopcar({ skuId: sid, goodsId: gid, number: 1 }).then(function (res) {
              if (res.code === 'rest.success') {
                this.$dialog.showToast(res.desc)
              }
            })
          } else {
            vm.$dialog.showToast('没有库存！')
          }
        }
      }
    });
  });
});
