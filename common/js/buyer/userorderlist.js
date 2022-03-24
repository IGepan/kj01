// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpOrderApi', 'httpCom', 'jqValidate', 'dialog', 'httpUrl', 'fileSaver'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpOrderApi, httpCom, jqValidate, dialog, httpUrl, fileSaver) {

    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        showFull: false,
        http: httpUser,
        httpCom: httpCom,
        fileUrl: httpUrl.baseUrl + '/order/downloadBill?orderId=',
        jquery: $,
        orderTabs: {
          '01': {
            url: this.$pathPrefix+'/common/buyer/order?orderStatusFilter=01&code=001.001.001.001',
            label: '所有订单'
          },
          '011': {
            url: '/common/buyer/order?orderStatusFilter=011&code=001.001.001.001',
            label: '待卖家确认'
          },
          '02': {
            url: this.$pathPrefix+'/common/buyer/order?orderStatusFilter=02&code=001.001.001.001',
            label: '待付款'
          },
          '03': {
            url: this.$pathPrefix+'/common/buyer/order?orderStatusFilter=03&code=001.001.001.001',
            label: '待验收/待收货'
          },
          '04': {
            url: this.$pathPrefix+'/common/buyer/order?orderStatusFilter=04&code=001.001.001.001',
            label: '已完成'
          },
          '05': {
            url: this.$pathPrefix+'/common/buyer/order?orderStatusFilter=05&code=001.001.001.001',
            label: '待评价'
          }
        },
        options: {},
        queryForm: {
          pageNum: 1,	// 	第几页	是	[string]		查看
          pageSize: 10,	// 	每页显示多少行	是	[string]		查看
          orderBy: '',	// 	排序字段	是	[string]		查看
          id: '',	// 	'id'	是	[string]		查看
          orderType: '',	// 	订单类型(字典表：order_type)	是	[string]		查看
          orderStatus: '',	// 	订单状态(字典表：order_status)	是	[string]		查看
          evaluateFlag: '',	// 	评价状态(字典表：yes_no)	是	[string]
          orderCreateTimeStart: '',	// 	下单时间开始	是	[string]		查看
          orderCreateTimeEnd: '',	// 	下单时间结束	是	[string]		查看
          orderStatusFilter: '',	// 	订单状态(字典表：order_status_filter)	是	[string]		查看
          diagnosisId: '',	// 需求诊断Id	是	[string]
          total: 0
        },
        orderList: [],
        isOrderSelectedAll: '',
        isOpenCancel: false,
        isOpenAccept: false,
        cancelOrderForm: {
          id: '',
          cancelReason: '',
          cancelComment: '',
          version: 0
        },
        cancelReasonOptions: [],
        acceptOrderInfo: null,
        isSubmitDisabled: false,
        pages:0,
        pageCount: 4
      },
      watch: {
        isOrderSelectedAll: function (newVal, oldval) {
          this.orderList.forEach(function (item) {
            item.selected = newVal
          })
        },
        'queryForm.orderCreateTimeStart': function (newVal, oldval) {
          this.queryForm.orderCreateTimeEnd && new Date(newVal) > new Date(this.queryForm.orderCreateTimeEnd) && this.$dialog.showToast('开始时间不能大于结束时间！')
        },
        'queryForm.orderCreateTimeEnd': function (newVal, oldval) {
          this.queryForm.orderCreateTimeStart && new Date(this.queryForm.orderCreateTimeStart) > new Date(newVal) && this.$dialog.showToast('开始时间不能大于结束时间！')
        }
      },
      created: function () {
        var state = this.queryForm.orderStatusFilter = this.$utils.getReqStr('orderStatusFilter')
        this.orderTabs[state].selected = true
        var diagnosisId = this.$utils.getReqStr('diagnosisId')
        diagnosisId && (this.queryForm.diagnosisId = diagnosisId)
        this.initData();
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/newtoper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'pages': httpVueLoader(this.$pathPrefix+'/style/components/pages.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      mounted: function () {
        laydate.render({
          elem: '#timeStart',
          format: 'yyyy-MM-dd HH:mm:ss',
          startkey: 'orderCreateTimeStart',
          endkey: 'orderCreateTimeEnd',
          vm: this,
          showBottom: false,
          done: function (value, date, endDate) { //选择日期完毕的回调
            this.vm.queryForm[this.startkey] = value;
          }
        })
        laydate.render({
          elem: '#timeEnd',
          format: 'yyyy-MM-dd HH:mm:ss',
          startkey: 'orderCreateTimeStart',
          endkey: 'orderCreateTimeEnd',
          vm: this,
          showBottom: false,
          done: function (value, date, endDate) { //选择日期完毕的回调
            this.vm.queryForm[this.endkey] = value;
          }
        })
      },
      methods: {
        initData: function () {
          this.getOrderList()
          this.getOptions('order_type')
          this.getOptions('order_status')
          this.getOptions('yes_no')
          this.getOptions('cancel_reason')
        },
        getOrderList: function () {
          var vm = this
          httpOrderApi.buyerSelectByPage(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              vm.orderList = res.result.list
              vm.queryForm.total = res.result.totla
              res.result.isview = res.result.navigatepageNums.indexOf(res.result.pages) === -1
              vm.pages = res.result
            } else {
              vm.orderList = []
              vm.queryForm.total = 0
              vm.pages =0;
            }
          })
        },
        bindPageChange: function (e) {
          this.queryForm.pageNum = e;
          this.getOrderList()
        },
        showSearchrow: function () {
          this.showFull = !this.showFull
        },
        getOptions: function (key) {
          var vm = this
          httpCom.dict({ code: key }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.options[key] = res.result
            }
          })
        },
        changeSelected: function () {
          this.isOrderSelectedAll = this.orderList.every(function (item) {
            return item.selected
          })
        },
        getOrderVos: function () {
          var flag = this.orderList.some(function (order) {
            return order.selected && (order.orderStatus !== '008' && order.orderStatus !== '007')
          })
          return flag ? !flag : this.orderList.reduce(function (vos, order) {
            order.selected && vos.push({ id: order.id, version: order.version })
            return vos
          }, [])
        },
        deleteOne: function (id, v) {
          var vm = this
          var options = {
            title: '温馨提示',
            texts: '您确认删除此订单吗？',
            callback: function () {
              httpOrderApi.buyerDelete({
                id: id,
                version: v
              }).then(function (res) {
                if (res.code == 'rest.success') {
                  vm.$dialog.showToast('删除成功！')
                  vm.getOrderList()
                }
              })
            }
          }
          this.$dialog.confirm(options)
        },
        deleteBatch: function () {
          var vm = this
          var deleteVos = this.getOrderVos()
          if (deleteVos) {
            if (deleteVos.length) {
              httpOrderApi.buyerDeleteBatch({
                deleteVos: deleteVos
              }).then(function (res) {
                if (res.code == 'rest.success') {
                  vm.$dialog.showToast('批量删除成功！')
                  vm.getOrderList()
                }
              })
            } else {
              vm.$dialog.showToast('请选择需要删除的订单！')
            }
          } else {
            vm.$dialog.showToast('选中订单数据异常！')
          }
        },
        setCancelInfo: function (id, version) {
          this.cancelOrderForm = {
            id: id,
            cancelReason: '',
            cancelComment: '',
            version: version
          }
          this.isOpenCancel = true
        },
        saveCancelInfo: function () {
          var vm = this
          $('.cancelOrderForm').validate('submitValidate', function (val) {
            if (val && !vm.isSubmitDisabled) {
              vm.isSubmitDisabled = true
              httpOrderApi.buyerCancel(vm.cancelOrderForm).then(function (res) {
                if (res.code == 'rest.success') {
                  vm.$dialog.showToast('取消订单成功！')
                  vm.getOrderList()
                  vm.cancelDialog('isOpenCancel')
                  vm.isSubmitDisabled = false
                }
              }).catch(function (reason, data) {
                vm.isSubmitDisabled = false
              })
            }
          })
        },
        setAcceptOrderInfo: function (order) {
          this.acceptOrderInfo = order
          this.isOpenAccept = true
        },
        saveAcceptInfo: function () {
          var order = this.acceptOrderInfo
          var vm = this
          !vm.isSubmitDisabled && (
            vm.isSubmitDisabled = true,
            httpOrderApi.buyerCheck({ id: order.id, version: order.version }).then(function (res) {
              if (res.code == 'rest.success') {
                vm.$dialog.showToast('确认验收成功！')
                vm.getOrderList()
                vm.cancelDialog('isOpenAccept')
                vm.isSubmitDisabled = false
              }
            }).catch(function (reason, data) {
              vm.isSubmitDisabled = false
            }))
        },
        cancelDialog: function (type) {
          this[type] = false
          this.acceptOrderInfo = null
          this.cancelOrderForm = {
            id: '',
            cancelReason: '',
            cancelComment: '',
            version: ''
          }
        },
        receipt: function (id, v) {
          var vm = this
          var options
          !vm.isSubmitDisabled(options = {
            title: '温馨提示',
            texts: '您确认此订单收货了吗？',
            callback: function () {
              vm.isSubmitDisabled = true
              httpOrderApi.buyerReceipt({
                id: id,
                version: v
              }).then(function (res) {
                if (res.code == 'rest.success') {
                  vm.$dialog.showToast('操作成功！')
                  vm.getOrderList()
                  vm.isSubmitDisabled = false
                }
              })
            }
          },
            this.$dialog.confirm(options)
          )
        },
        payment: function (id) {
          var vm = this
          var options
          !vm.isSubmitDisabled && (options = {
            title: '温馨提示',
            texts: '您确认支付此订单吗？',
            callback: function () {
              vm.isSubmitDisabled = true
              httpOrderApi.buyerpayment({
                id: id
              }).then(function (res) {
                if (res.code == 'rest.success') {
                  vm.$dialog.showToast('操作成功！')
                  vm.getOrderList()
                  vm.isSubmitDisabled = false
                }
              })
            }
          },
            this.$dialog.confirm(options)
          )
        },
        notFun: function () {
          this.$dialog.showToast('敬请期待')
        },
        evaluate: function (id) {
          location.href = this.$pathPrefix+'/common/buyer/evaluate/orderDetail.html?code=001.001.001.001&id=' + id
        },
        savefile: function (e) {
          httpOrderApi.getFileBlob(e.target.href).then(function (res) {
            saveAs(res, e.target.getAttribute('data-name') + '.pdf', { type: 'application/pdf;charset=utf-8' })
          })
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
