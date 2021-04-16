// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpDemandApi', 'httpCom'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpDemandApi, httpCom) {

    new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        http: httpUser,
        httpCom: httpCom,
        jquery: $,
        logId: '',
        logInfo: {
          // id: 'TK04943724732432',
          // title: '需求名称需求名称需求名称需求名称',
          // list: [
          //   {
          //     time: '2019-02-02 14:39:21',
          //     log: '确认需求任务'
          //   },
          //   {
          //     time: '2019-02-02 14:39:21',
          //     log: '确认需求任务'
          //   }
          // ]
        }
      },
      mounted: function () { },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
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
