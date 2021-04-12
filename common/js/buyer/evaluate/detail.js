// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpEvaluateApi', 'httpCom', 'fileSaver'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpEvaluateApi, httpCom, fileSaver) {

    new Vue({
      el: '#index_box',
      data: function () {
        return {
          http: httpUser,
          httpCom: httpCom,
          jquery: $,
          infos: {}
        }
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-star': httpVueLoader('/common/components/starts.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.handleGetOrderInfo()
      },
      methods: {
        handleGetOrderInfo: function () {
          var vm = this
          httpEvaluateApi.buyerDetail({ evaluateId: this.$utils.getReqStr('id') }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.infos = res.result
            }
          })
        },
      }
    });
  });
});
