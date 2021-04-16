var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpOrderApi', 'httpCom', 'fileSaver', 'dialog', 'httpUrl'], function ($, Vue, dic, httpVueLoader, httpOrderApi, httpCom, fileSaver, dialog, httpUrl) {
    Vue.component('ly-searchbox', httpVueLoader(this.$pathPrefix+'/style/components/searchbox.vue'))
    new Vue({
      el: '#index_box',
      data: {
        http: httpOrderApi,
        detailInfo: {},
        httpCom: httpCom
      },
      computed: {
        sumGoodsPrices: function () {
          return this.detailInfo.details ? this.detailInfo.details.reduce(function (sum, detail) {
            return sum += (detail.number * detail.protocolPrice)
          }, 0) : 0
        }
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
          httpOrderApi.sellerDetail({ id: id }).then(function (res) {
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
              res.result.details.forEach(function (d) {
                d.show = 0
              })
              vm.$data.detailInfo = res.result
            }
          })
        },
        showUpdate: function (si) {
          this.detailInfo.details[si].show = 1
        },
        priceBulr: function (si) {
          var sku = this.detailInfo.details[si]
          if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(sku.updatePrice.trim())) {
            this.$dialog.showToast('协议单价必须为正整数或正小数！')
          } else {
            sku.protocolPrice = sku.updatePrice
            sku.show = false
          }
        },
        submitUpdate: function () {
          var vm = this
          httpOrderApi.sellerChangePrice({ id: this.detailInfo.id, orderDetails: this.detailInfo.details }).then(function (res) {
            if (res.code == 'rest.success') {
              location.reload(true)
            }
          })
        },
        fileSaveAs: function (file, name) {
          var url = httpUrl.imgUploadUrl + '/file/download?filePath=' + file;
          //this.$utils.openNewTable(url);
          saveAs(url, name);
        }
      }
    })
  })
})
