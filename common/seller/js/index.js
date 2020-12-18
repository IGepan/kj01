require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'httpVueLoader', 'seller', 'httpOrderApi', 'httpStore', 'httpStoret01', 'httpCom'], function ($, Vue, httpStore, httpUrl, dic, httpVueLoader, seller, httpOrderApi, httpStore, httpStoret01, httpCom) {

    new Vue({
      el: '#store_box',
      data: {
        isConference: true,
        meanTree: [],
        userSeller: {},
        http: httpStore,
        orderList: [],
        queryForm: {
          pageNum: 1,	// 	第几页	是	[string]		查看
          pageSize: 3,	// 	每页显示多少行	是	[string]		查看
          orderBy: 'createTime',	// 	排序字段	是	[string]		查看
          orderStatusFilter: '01',	// 	订单状态(字典表：order_status_filter)	是	[string]		查看
        },
        formData: {
          pageNum: 1,
          pageSize: 4,
          categoryId: '82779310439534201', // 类目Id
        },
        attentionList: [],
        selectedAmount: '010',
        whoConcernList: [],
        tradeUserList: [],
        moreurl: '',
        httpCom: httpCom,
        demandlist: [],
        visitList: ''
      },
      mixins: [seller],
      components: {
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      filters: {
        filtersTips: function (v, evaluated) {
          var t = ''
          switch (v) {
            case '005':
              t = '订单正在等待买家付款'
              break;
            case '007':
              t = evaluated ? '您的订单已评价。' : '您还未对订单进行评价，赶快去评价吧。'
              break;
            case '001':
              t = '订单正在等您确认。'
              break;
            case '002':
              t = '订单正在处理中，您可提交验收申请。'
              break;
            case '003':
              t = '订单正在等您发货。'
              break;
            case '004':
              t = '您已提交验收申请，等待买家验收确认。'
              break;
            case '008':
              t = '订单已取消，点击查看详情'
              break;
          }
          return t
        }
      },
      created: function () {
        this.handleOrdertabs('01')
        this.gettradeUser()
        this.getSellerInfo()
        this.getAmountList('010')
        this.getselectDemandByPage()
      },
      mounted: function () {
        $(".orderclick").click(function () {
          $(this).addClass("active").siblings(".orderclick").removeClass("active");
        });
      },
      methods: {
        getSellerInfo: function () {
          var vm = this
          httpStore.userSeller(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              vm.userSeller = res.result
              vm.getwhoConcern()
            }
          });
          httpStoret01.visitselectShopNum(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              vm.visitList = res.result
            }
          })
        },
        getOrderList: function () {
          var vm = this
          httpOrderApi.sellerSelectByPage(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              vm.orderList = res.result.list
            } else {
              vm.orderList = []
            }
          })
        },
        getAmountList: function (type) {
          this.moreurl = type === '010' ? '/seller/technical_list.html?categoryId=82779310439534201&code=product' : type === '009' ? '/seller/technical_list.html?categoryId=82779310439534200&code=service' : '/seller/technical_list.html?categoryId=82515756322918000&code=technology-all'
          var vm = this;
          this.formData.categoryId = type === '010' ? '82779310439534201' : type === '009' ? '82779310439534200' : '82515756322918000'
          this.selectedAmount = type
          httpStore.goodsSelectByPage(this.formData).then(function (res) {
            if (res.code == 'rest.success') {
              vm.attentionList = res.result.list
            }
          })
        },
        gettradeUser: function () {
          var vm = this
          httpOrderApi.tradeUserList({ pageSize: 3 }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.tradeUserList = res.result
            } else {
              vm.tradeUserList = []
            }
          })
        },
        getwhoConcern: function () {
          var vm = this
          httpOrderApi.whoConcern({ pageSize: 3, shopCode: vm.userSeller.shopCode }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.whoConcernList = res.result
            } else {
              vm.whoConcernList = []
            }
          })
        },
        handlePushArticle: function () {
          location.href = this.selectedAmount === '010' ? '/common/seller/addpatent.html?code=001.002.002.003&categoryId=82779310439534201' : this.selectedAmount === '009' ? '/common/seller/addpatent.html?code=001.002.002.002&categoryId=82779310439534200' : '/common/seller/addpatent.html?code=001.002.002.001.001&categoryId=82515756322918000'
        },
        handleOrdertabs: function (type) {
          this.queryForm.orderStatusFilter = type
          this.getOrderList()
        },
        getselectDemandByPage: function () {
          var vm = this
          httpStore.selectDemandByPage({ columnId: '162' }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.demandlist = res.result
            }
          })
        },
        handleShowTips: function (e) {
          if (this.isConference) {
            e.preventDefault();
            this.$dialog.showToast('敬请期待');
          }
        }
      }
    });
  });
});
