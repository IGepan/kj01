var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'fileSaver', 'httpOrderApi', 'httpCom', 'dialog', 'httpUrl'], function ($, Vue, dic, httpVueLoader, fileSaver, httpOrderApi, httpCom, dialog, httpUrl) {
    Vue.component('ly-searchbox', httpVueLoader(this.$pathPrefix+'/style/components/searchbox.vue'))
    new Vue({
      el: '#index_box',
      data: {
        http: httpOrderApi,
        detailInfo: {},
        httpCom: httpCom
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/orderHeader.vue'),
        'ly-footer': httpVueLoader('/style/components/main_footer.vue')
      },
      created: function () {
        this.getOrderInfo(this.$utils.getReqStr('id'))
      },
      methods: {
        getOrderInfo: function (id) {
          var vm = this
          httpOrderApi.buyerDetail({ id: id }).then(function (res) {
            if (res.code == 'rest.success') {
              let l = res.result.logList.length
              res.result.logList.some(function (log, i) {
                if (!log.opTime) {
                  res.result.notimei = i
                }
                return !log.opTime
              })
              res.result.logfull = 0
              res.result.logList[l - 1].opTime && (res.result.notimei = l, res.result.logfull = 1)
              vm.$data.detailInfo = res.result
            }
          })
        },
        fileSaveAs: function (file, name) {
          var url = httpUrl.imgUploadUrl + '/file/download?filePath=' + file;
          //this.$utils.openNewTable(url);
          saveAs(url, name);
        },
        goPay(id){
          window.open(this.$pathPrefix+'/common/servicetrade/qrcode.html?id=' + id,'_blank')
        }
      }
    })
  })
})
