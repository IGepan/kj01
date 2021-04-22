var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpEvaluateApi', 'httpCom', 'dialog'], function ($, Vue, dic, httpVueLoader, evaluate, httpCom, dialog) {

    new Vue({
      el: '#index_box',
      data: {
        options: {},
        fileUploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
        uploadData: {
          system: 'ts'
        },
        detailInfo: {},
        evaluateData: {
          bid: '',
          evaluateList: []
        },
        isSubmitDisabled: false
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/orderHeader.vue'),
        'ly-star': httpVueLoader('/common/components/starts.vue'),
        'ly-upload': httpVueLoader('/common/components/upload.vue'),
        'ly-checkbox': httpVueLoader('/components/checkbox.vue'),
        'ly-footer': httpVueLoader('/style/components/main_footer.vue')
      },
      created: function () {
        this.evaluateData.bid = this.$utils.getReqStr('id')
        this.getOptions([
          { "code": "evaluate_item", group: 1 },
          { "code": "evaluate_item", group: 2 },
          { "code": "buyer_effect" },
          { "code": "evaluate" }
        ])
        this.getOrderInfo()
      },
      methods: {
        getOrderInfo: function () {
          var vm = this
          evaluate.detailSpe({ orderId: this.evaluateData.bid }).then(function (res) {
            if (res.code == 'rest.success') {
              var evaluateList = []
              var evaluateOne = {
                evaluateType: '', // 评价类型(字典表：evaluate)	是
                oId: '', // 评价主体Id(只有是商品时前端传商品Id)	是
                anonymityFlag: '', // 匿名标识(字典表：yes_no)（可以为空）
                skuId: '', // skuId（买家评价订单时才传）
                comment: '', // 评价内容（可以为空）	是
                fileIds: [], //	评价内容附件Ids（可以为空）	是
                resultVoList: [ // 评价结果	是
                  {
                    evaluateResultId: '',	// 评价结果Id，新增评价不传	是
                    evaluateId: '',	// 评价Id，新增评价不传	是
                    evaluateItem: '',	// 评价项目 (字典表：evaluate_item)	是
                    evaluateResult: '' // 评价结果	是
                  }
                ],
                tagVoList: [ // 标签集合	是
                  {
                    tagCode: '', // 标签code - 数据字典key
                    tagType: '' // 标签类型，数据字典code。买家评价店铺时传buyer_effect
                  }
                ]
              }

              //*****************************转换主体评价内容*********************************** */
              evaluateList.push({
                evaluateType: '002', // 评价类型(字典表：evaluate)	是
                resultVoList: vm.options.evaluate_item1.map(function (item) {
                  return {
                    display: item.display,
                    evaluateItem: item.value,
                    evaluateResult: 0
                  }
                }),
                tagVoList: vm.options.buyer_effect.map(function (tag) {
                  return {
                    display: tag.display,
                    tagCode: tag.value,
                    tagType: 'buyer_effect',
                    selected: false
                  }
                })
              })
              //*****************************转换商品评价内容*********************************** */
              res.result.orderDetailList.forEach(function (sku) {
                evaluateList.push({
                  evaluateType: '001', // 评价类型(字典表：evaluate)	是
                  oid: sku.goodsId, // 评价主体Id(只有是商品时前端传商品Id)	是
                  anonymityFlag: 0, // 匿名标识(字典表：yes_no)（可以为空）
                  skuId: sku.skuId, // skuId（买家评价订单时才传）
                  comment: '', // 评价内容（可以为空）	是
                  fileIds: [], //	评价内容附件Ids（可以为空）	是
                  resultVoList: vm.options.evaluate_item2.map(function (item) {
                    return {
                      display: item.display,
                      evaluateItem: item.value,
                      evaluateResult: 0
                    }
                  })
                })
              })
              //*****************************转换结束*********************************** */
              vm.$data.evaluateData.evaluateList = evaluateList
              vm.$data.detailInfo = res.result
            }
          })
        },
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
        handleTagUpdate: function (i) {
          var tag = this.evaluateData.evaluateList[0].tagVoList[i]
          tag.selected = !tag.selected
          this.$set(this.evaluateData.evaluateList[0].tagVoList, i, tag)
        },
        handleUploadSuccess: function (successInfo) {
          this.evaluateData.evaluateList[successInfo.exp.index + 1].fileIds.push(successInfo.data)
        },
        checkData: function () {
          return this.evaluateData.evaluateList.every(function (item) {
            return item.resultVoList.every(function (item) {
              return item.evaluateResult
            })
          })
        },
        handleRemoveImg: function (pi, i) {
          this.evaluateData.evaluateList[pi].fileIds.splice(i, 1)
        },
        getData: function () {
          var data
          if (this.checkData()) {
            data = JSON.parse(JSON.stringify(this.evaluateData), function (k, v) {
              if (k === 'tagVoList') {
                var t = v.filter(function (tag) {
                  return tag.selected
                }).map(function (tag) {
                  delete tag.selected
                  return tag
                })
                return t
              }
              if (k === 'display') {
                return undefined
              }
              if (k === 'fileIds' && v.length) {
                return v.map(function (f) { return f.id })
              }
              // if (k === 'anonymityFlag') {
              //   return v ? 1 : 0
              // }
              return v
            })
          } else {
            this.$dialog.showToast('请为项目评分！')
          }
          return data
        },
        submitUpdate: function () {
          var vm = this
          var data = this.getData()
          if (data && !this.isSubmitDisabled) {
            this.isSubmitDisabled = true
            evaluate.buyerinsertFst(data).then(function (res) {
              if (res.code == 'rest.success') {
                this.$dialog.showToast('评价成功，3秒后将关闭页面！')
                location = vm.$pathPrefix+'/common/buyer/order/?orderStatusFilter=01&code=001.001.001.001'
              } else {
                vm.isSubmitDisabled = false
              }
            }).catch(function (reason, data) {
              vm.isSubmitDisabled = false
            })
          }
        },
        routerBack: function () {
          location = vm.$pathPrefix+'/common/buyer/order/?orderStatusFilter=01&code=001.001.001.001'
        }
      }
    })
  })
})
