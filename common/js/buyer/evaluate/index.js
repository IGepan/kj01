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
          fileUploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
          uploadData: {
            system: 'ts'
          },
          options: {
            operations: [
              {
                id: 1,
                display: '修改',
                value: 'updateAppraise'
              },
              {
                id: 2,
                display: '追评',
                value: 'addappraise'
              }
            ]
          },
          queryForm: {
            pageNum: 1,	// 	第几页	是	[string]		查看
            pageSize: 10,	// 	每页显示多少行	是	[string]		查看
            orderBy: '',	// 	排序字段	是	[string]		查看
            keyWord: '',	// 		关键字
            evaluateType: '',	// 评价类型(字典表：evaluate)
            total: 0
          },
          updateForm: {},
          tempForm: {},
          isOpenUpdateDialog: false,
          apendForm: {
            fileIds: []
          },
          isOpenAppendDialog: false,
          isSubmitDisabled: false,
          orderList: [],
          pages: 0,
          pageCount: 4
        }
      },
      watch: {},
      filters: {
        getOperations: function (o, v, s) {
          var r = []
          v === '1' && r.push(o[0])
          s === '1' && r.push(o[1])
          return r
        }
      },
      mounted: function () { },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-star': httpVueLoader('/common/components/starts.vue'),
        'ly-upload': httpVueLoader('/common/components/upload.vue'),
        'ly-checkbox': httpVueLoader('/components/checkbox.vue'),
        'pages': httpVueLoader(this.$pathPrefix+'/style/components/pages.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.getOptions([
          { 'code': 'evaluate', group: 1 },
          { "code": "buyer_effect" }
        ])
        this.handleGetOrderList()
      },
      methods: {
        // 获取多个标准码
        getOptions: function (keys) {
          var vm = this
          httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (codes) {
                codes.code !== 'evaluate_item' && codes.dictIInfos.unshift({ id: '-1', value: '', display: "不限" })
                vm.options[codes.code] = codes.dictIInfos
              })
            }
          })
        },
        handleGetOrderList: function () {
          var vm = this
          httpEvaluateApi.buyerForByPage(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.list.forEach(function (o) { o.operation = '' })
              vm.orderList = res.result.list
              vm.queryForm.total = res.result.total
              res.result.isview = res.result.navigatepageNums.indexOf(res.result.pages) === -1
              vm.pages = res.result;
            } else {
              vm.orderList = []
              vm.queryForm.total = 0
              vm.pages = 0;
            }
          })
        },
        bindPageChange: function (e) {
          this.queryForm.pageNum = e;
          this.handleGetOrderList()
        },
        handleReset: function () {
          this.queryForm.keyWord = ''	// 		关键字
          this.queryForm.evaluateType = ''	// 评价类型(字典表：evaluate)
          this.handleGetOrderList()
        },
        handleOrderChange: function (i) {
          var vm = this
          var order = this.orderList[i]
          order.operation && this[order.operation](order)
          order.operation && (order.operation = '', this.$set(this.orderList, i, order))
        },
        handleTagUpdate: function (i) {
          var tag = this.updateForm.tagViewList[i]
          tag.selected = !tag.selected
          this.$set(this.updateForm.tagViewList, i, tag)
        },
        // 修改评价
        updateAppraise: function (order) {
          var vm = this
          httpEvaluateApi.buyerInit({ evaluateId: order.evaluateId }).then(function (res) {
            if (res.code === 'rest.success') {
              var form = {
                evaluateId: res.result.evaluateId,
                resultDetailVoList: [],
                tagVoList: [],
                version: res.result.version
              }
              form.resultDetailVoList = res.result.resultViewList.map(function (item) {
                return {
                  evaluateResultId: item.evaluateResultId,
                  evaluateItemDisplay: item.evaluateItemDisplay,
                  evaluateResult: item.evaluateResult,
                  errorMsg: ''
                }
              })
              res.result.tagViewList && (
                form.tagViewList = vm.options.buyer_effect.map(function (tag) {
                  return {
                    evaluateId: form.evaluateId,
                    display: tag.display,
                    tagCode: tag.value,
                    tagType: 'buyer_effect',
                    selected: res.result.tagViewList.some(function (stag) {
                      return stag.tagCode === tag.value
                    })
                  }
                })
              )
              vm.updateForm = form
              vm.tempForm = JSON.parse(JSON.stringify(res.result))
              vm.isOpenUpdateDialog = true
            }
          })
        },
        handleChangeVal: function (v, i) {
          if (v < this.tempForm.resultViewList[i].evaluateResult) {
            !this.updateForm.resultDetailVoList[i].errorMsg && (this.updateForm.resultDetailVoList[i].errorMsg = '新的评分不能低于首次评分')
          } else {
            this.updateForm.resultDetailVoList[i].errorMsg && (this.updateForm.resultDetailVoList[i].errorMsg = '')
          }
        },
        handleUpdateSubmit: function () {
          var vm = this
          if (this.updateForm.resultDetailVoList.every(function (item) {
            return !item.errorMsg
          }) && !vm.isSubmitDisabled) {
            vm.isSubmitDisabled = true
            httpEvaluateApi.buyerUpdateFst(this.updateForm).then(function (res) {
              if (res.code === 'rest.success') {
                vm.$dialog.showToast('修改评价成功！')
                vm.isOpenUpdateDialog = false
                vm.handleGetOrderList()
                vm.isSubmitDisabled = false
              } else {
                vm.isSubmitDisabled = false
              }
            }).catch(function (reason, data) {
              vm.isSubmitDisabled = false
            })
          } else {
            vm.$dialog.showToast('请按要求修正评分！')
          }
        },
        // 追评
        addappraise: function (order) {
          this.apendForm = {
            evaluateId: order.evaluateId,
            comment: '',
            fileIds: [],
            version: order.version
          }
          this.isOpenAppendDialog = true
        },
        handleRemoveImg: function (i) {
          this.apendForm.fileIds.splice(i, 1)
        },
        handleUploadSuccess: function (successInfo) {
          this.apendForm.fileIds.push(successInfo.data)
        },
        handleAppendSubmit: function () {
          var vm = this

          if (this.apendForm.comment === '') {
            vm.$dialog.showToast('追评内容必填！')
          } else {
            var data
            !vm.isSubmitDisabled && (data = JSON.parse(JSON.stringify(this.apendForm, function (k, v) {
              if (k === 'fileIds') {
                return v.map(function (i) {
                  return i.id
                })
              }
              return v
            })),
              vm.isSubmitDisabled = true,
              httpEvaluateApi.buyerInsertSec(data).then(function (res) {
                if (res.code === 'rest.success') {
                  vm.$dialog.showToast('追评成功！')
                  vm.isOpenAppendDialog = false
                  vm.handleGetOrderList()
                  vm.isSubmitDisabled = false
                } else {
                  vm.isSubmitDisabled = false
                }
              }).catch(function (reason, data) {
                vm.isSubmitDisabled = false
              })
            )
          }
        },
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.queryForm.pageNum = index;
            this.getOrderList();
          }
        },
        isShowPage: function (index) {
          var pageNum = this.queryForm.pageNum;
          var row = parseInt(pageNum / 2);
          if (row == 0 || row == 1) {
            if (1 <= index && index <= 4) {
              return true;
            } else {
              return false;
            }
          } else {
            if (row * 2 - 1 <= index && index <= row * 2 + 2) {
              return true;
            } else {
              return false;
            }
          }
        },
        isMore: function () {
          var pageNum = this.queryForm.pageNum;
          var row = parseInt(pageNum / 2);
          var index = row * 2 - 1;
          return !(index + 4 > this.pages);
        }
      }
    });
  });
});
