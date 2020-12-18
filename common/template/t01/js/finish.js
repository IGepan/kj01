var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpStoret01', 'httpCom', 'dialog'], function ($, Vue, dic, httpVueLoader, httpStoret01, httpCom, dialog) {
    Vue.component('ly-searchbox', httpVueLoader('/style/components/searchbox.vue'))
    new Vue({
      el: '#index_box',
      data: {
        http: httpStoret01,
        httpCom: httpCom,
        goodsList: [],
        total: 0,
        shopCode: '',
        categoryCode: '',
        formData: {
          pageNum: 1,
          pageSize: 10,
          shopCode: '',
          orderBy: ''
        },
        totalCount: 0,
        totalProtocolPrice: 0,
        pages: 1,
        pageCount: 4
      },
      created: function () {
        this.categoryCode = this.$utils.getReqStr('id');
        this.shopCode = this.formData.shopCode = this.$utils.getShopCode();
        this.shortCode = this.$utils.getReqStr('shortCode');
        this.shopAccess()
      },
      computed: {
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/template/t01/components/defaultHeader.vue'),
        'ly-store-info': httpVueLoader('/common/template/t01/components/defaultStoreInfo.vue'),
        'ly-menu-nav': httpVueLoader('/common/template/t01/components/defaultMenuNav.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      methods: {
        tetTotalCount: function () {
          let total = 0
          this.goodsList.map((value) => {
            total += parseInt(value.protocolPrice)
          })
          console.log(total);
          return total
        },
        // 获取产品
        selectpByPage: function () {
          var vm = this;
          var data = JSON.parse(JSON.stringify(this.formData, function (k, v) {
            return v ? v : undefined
          }))
          this.http.orderSelectpByPage(data).then(function (res) {
            if (res.code === 'rest.success') {
              vm.goodsList = res.result.list;
              vm.total = res.result.total;
              vm.pages = res.result.pages;
              vm.totalCount = vm.tetTotalCount();
              if (res.result.list.length > 0) {
                vm.totalProtocolPrice = res.result.list[0].totalProtocolPrice;
              }
            }
          })
        },
        shopAccess: function () {
          var vm = this
          this.http.shopAccess({ shopCode: this.shopCode, shortCode: this.shortCode }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.selectpByPage()
            } else {
              vm.$dialog.showToast(res.desc)
            }
          })
        },
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.formData.pageNum = index;
            this.selectpByPage();
          }
        },
        isShowPage: function (index) {
          var pageNum = this.formData.pageNum;
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
          var pageNum = this.formData.pageNum;
          var row = parseInt(pageNum / 2);
          var index = row * 2 - 1;
          return !(index + 4 > this.pages);
        }
      }
    })
  })
})
