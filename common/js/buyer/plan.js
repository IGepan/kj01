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
        options: {},
        queryForm: {
          pageNum: 1,	// 	第几页	是	[string]		查看
          pageSize: 10,	// 	每页显示多少行	是	[string]		查看
          total: 0
        },
        orderList: [],
        isOrderSelectedAll: false,
        cancelReasonOptions: [],
        pages: 1,
        pageCount: 4
      },
      watch: {
        isOrderSelectedAll: function (newVal, oldval) {
          this.orderList.forEach(function (item) {
            item.selected = newVal
          })
        }
      },
      created: function () {
        this.initData();
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      mounted: function () { },
      methods: {
        initData: function () {
          this.getOrderList()
        },
        getOrderList: function () {
          var vm = this
          httpOrderApi.planByPage(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.list = res.result.list.map(function (o) {
                o.newplanName = ''
                o.isUpdate = false
                return o
              })
              vm.orderList = res.result.list
              vm.queryForm.total = res.result.totla
              vm.pages = res.result.pages;
            } else {
              vm.orderList = []
              vm.queryForm.total = 0
              vm.pages = 0;
            }
          })
        },
        changeSelected: function () {
          this.isOrderSelectedAll = this.orderList.every(function (item) {
            return item.selected
          })
        },
        getOrderVos: function () {
          return this.orderList.reduce(function (vos, order) {
            order.selected && vos.push({ id: order.id, version: order.version })
            return vos
          }, [])
        },
        deleteOne: function (id, v) {
          var vm = this
          httpOrderApi.plandelete({
            id: id,
            version: v
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.$dialog.showToast('删除成功！')
              vm.getOrderList()
            }
          })
        },
        deleteBatch: function () {
          var vm = this
          var deleteVos = this.getOrderVos()
          if (deleteVos.length) {
            httpOrderApi.plandeleteBatch({
              idList: deleteVos
            }).then(function (res) {
              if (res.code == 'rest.success') {
                if (res.result) {
                  vm.$dialog.showToast('有 ' + res.result + ' 个方案删除失败')
                } else {
                  vm.$dialog.showToast('批量删除成功！')
                }
                vm.getOrderList()
              }
            })
          } else {
            vm.$dialog.showToast('请选择需要删除的方案！')
          }
        },
        planupdate: function (oi) {
          var vm = this
          var o = this.orderList[oi]
          httpOrderApi.planupdate({
            id: o.id,
            planName: o.newplanName,
            version: o.version
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.$dialog.showToast('修改成功！')
              vm.getOrderList()
            }
          })
        },
        notFun: function () {
          this.$dialog.showToast('敬请期待')
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
