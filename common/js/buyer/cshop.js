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
        labels: [
          {
            url: '?code=001.001.003.005',
            label: '收藏的店铺',
            selected: true
          }
        ],
        queryForm: {
          pageNum: 1,	// 	第几页	是	[string]		查看
          pageSize: 10,	// 	每页显示多少行	是	[string]		查看
          type: '02'
        },
        orderList: [],
        isOrderSelectedAll: false,
        cancelReasonOptions: [],
        pages: 0,
        pageCount: 4,
        total: 0
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
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/newtoper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'pages': httpVueLoader(this.$pathPrefix+'/style/components/pages.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      filters: {
        clearHtmlTag: function (v) {
          v = v.replace(/<\/?.+?>/g, "").replace(/ /g, "")
          return v.length > 70 ? v.substr(0, 70) + '···' : v
        }
      },
      methods: {
        initData: function () {
          this.getOrderList()
        },
        getOrderList: function () {
          var vm = this
          httpOrderApi.goodsSelectByPage(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.list = res.result.list.map(function (o) {
                o.newplanName = ''
                o.isUpdate = false
                return o
              })
              vm.orderList = res.result.list
              vm.total = res.result.total
              res.result.isview = res.result.navigatepageNums.indexOf(res.result.pages) === -1
              vm.pages = res.result;
            } else {
              vm.orderList = []
              vm.total = 0
              vm.pages = 0;
            }
          })
        },
        bindPageChange: function (e) {
          this.queryForm.pageNum = e;
          this.getOrderList()
        },
        changeSelected: function () {
          this.isOrderSelectedAll = this.orderList.every(function (item) {
            return item.selected
          })
        },
        getOrderVos: function () {
          return this.orderList.reduce(function (vos, order) {
            order.selected && vos.push(order.storeId)
            return vos
          }, [])
        },
        deleteOne: function (id) {
          var vm = this
          httpOrderApi.goodscancel({
            goodsId: id
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
            httpOrderApi.goodscancelBatch({
              storeIds: deleteVos
            }).then(function (res) {
              if (res.code == 'rest.success') {
                if (res.result) {
                  vm.$dialog.showToast('有 ' + res.result + ' 个商品删除失败')
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
