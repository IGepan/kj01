var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpEvaluateApi', 'httpCom', 'dialog'], function ($, Vue, dic, httpVueLoader, evaluate, httpCom, dialog) {

    new Vue({
      el: '#index_box',
      data: {
        detailInfo: {},
        options: {},
        isSubmitDisabled: false,
        evaluateData: {
          bid: '',
          evaluateList: []
        }
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/orderHeader.vue'),
        'ly-star': httpVueLoader('/common/components/starts.vue'),
        'ly-footer': httpVueLoader('/style/components/main_footer.vue')
      },
      created: function () {
        this.evaluateData.bid = this.$utils.getReqStr('id')
        this.getOptions([
          { 'code': 'evaluate_item', group: 3 }
        ])
        this.getOrderInfo()
      },
      methods: {
        // 获取多个标准码
        getOptions: function (keys) {
          var vm = this
          httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (codes) {
                vm.options[codes.code + (codes.group || '')] = codes.dictIInfos
              })
            }
          })
        },
        getOrderInfo: function () {
          var vm = this
          evaluate.detailBuyer({ orderId: this.evaluateData.bid }).then(function (res) {
            if (res.code == 'rest.success') {
              var evaluateList = []
              //*****************************转换主体评价内容*********************************** */
              evaluateList.push({
                evaluateType: '003', // 评价类型(字典表：evaluate)	是
                comment: '',
                resultVoList: vm.options.evaluate_item3.map(function (item) {
                  return {
                    display: item.display,
                    evaluateItem: item.value,
                    evaluateResult: 0
                  }
                })
              })
              //*****************************转换结束*********************************** */
              vm.$data.evaluateData.evaluateList = evaluateList
              vm.$data.detailInfo = res.result
            }
          })
        },
        submitUpdate: function () {
          var vm = this
          if (this.evaluateData.evaluateList[0].resultVoList[0].evaluateResult > 0) {
            if (this.evaluateData.evaluateList[0].comment.length > 0) {
              !vm.isSubmitDisabled && (vm.isSubmitDisabled = true, evaluate.sellerinsertFst(this.evaluateData).then(function (res) {
                if (res.code == 'rest.success') {
                  location = '/common/seller/order/?orderStatusFilter=01&code=001.002.003.001'
                }
                vm.isSubmitDisabled = false
              }).catch(function () {
                vm.isSubmitDisabled = false
              })
              )
            } else {
              this.$dialog.showToast('请填写评价内容！')
            }
          } else {
            this.$dialog.showToast('请选择评分！')
          }
        },
        routerBack: function () {
          location = '/common/seller/order/?orderStatusFilter=01&code=001.002.003.001'
        }
      }
    })
  })
})
