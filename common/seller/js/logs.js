require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'jqValidate', 'httpVueLoader', 'seller', 'jqSelect', 'addpatentKey', 'httpCom', 'httpDemandApi'], function ($, Vue, httpStore, httpUrl, dic, jqValidate, httpVueLoader, seller, jqSelect, addpatentKey, httpCom, httpDemandApi) {
    ;
    new Vue({
      el: '#store_box',
      mixins: [seller, addpatentKey],
      data: {
        http: httpStore,
        httpCom: httpCom,
        formData: {},
        jquery: $,
        logId: '',
        logInfo: []
      },
      mounted: function () { },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        var id = this.$utils.getReqStr('id')
        if (id) {
          this.logId = id
          this.getLogs()
        }
      },
      methods: {
        getLogs: function () {
          var vm = this
          httpDemandApi.selectLog({ id: this.logId }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.logInfo = res.result
            }
          })
        }
      }
    });
  });
});
