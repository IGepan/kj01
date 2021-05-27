var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpStoret01', 'httpCom', 'dialog'], function ($, Vue, dic, httpVueLoader, httpStoret01, httpCom, dialog) {
    Vue.component('ly-searchbox', httpVueLoader('/style/components/searchbox.vue'))
    new Vue({
      el: '#index_box',
      data: {
        http: httpStoret01,
        httpCom: httpCom,
        defaultValue: {},
        goodsList: [],
        technologyList:[],
        productList:[],
        shopInfo: {},
        statisticsInfo: {},
        total: 0,
        filters: [
          {
            value: false,
            label: '综合排序',
            seleced: true
          },
          {
            value: false,
            label: '时间排序'
          },
          {
            value: false,
            label: '价格排序'
          }
        ],
        categoryCode: '',
        shopCode: '',
        shopaccess: '',
        formData: {
          pageNum: 1,
          pageSize: 10,
          shopCode: '',
          goodsName: '',
          technologyName:'',//技术
          productName:'',//产品
          categoryCode: '',
          orderSales: '',
          order: '',
          homePageFlag: '',
          roofFlag: ''
        },
        pages: 1,
        pageCount: 4,
        transformSearchTypes: {
          'demand': '01',
          'shop': '02',
          'technology': '03',
          'service': '04',
          'product': '05',
          'resource': '06'
        }
      },
      created: function () {
        var id = this.$utils.getReqStr('id');
        var p = this.$utils.getReqStr('p');
        var word = this.$utils.getReqStr('word');
        word = word !== null ? decodeURIComponent(word) : ''
        this.defaultValue = {
          type: this.transformSearchTypes[id],
          searchKey: word
        }
        this.categoryCode = id
        this.formData.categoryCode = dic.goodsCategoryCode[id]
        this.formData.homePageFlag = p
        this.shopCode = this.formData.shopCode = this.$utils.getReqStr('code');
        this.shortCode = this.$utils.getReqStr('shortCode');
        this.shopAccess()
      },
      filters: {
        formatPrice2: function (flag, v, n, m) {
          if (flag === '2') {
            return '面议'
          }if(flag === "3"){
            return '查看价格详情'
          }else {
            if (typeof v !== 'undefined') {
              return (v / 10000).toFixed(2)
            } else if (!v && !m) {
              return (n / 10000).toFixed(2)
            } else {
              return (n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)
            }
          }
        },
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper_mail.vue'),
        'ly-header': httpVueLoader('/common/template/t01/components/defaultHeader.vue'),
        'ly-store-info': httpVueLoader('/common/template/t01/components/defaultStoreInfo.vue'),
        'ly-menu-nav': httpVueLoader('/common/template/t01/components/defaultMenuNav.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      methods: {
        // 获取产品
        selectpByPage: function () {
          var vm = this;
          var data = JSON.parse(JSON.stringify(this.formData, function (k, v) {
            return v ? v : undefined
          }))
          this.http.selectByMailShopPage(data).then(function (res) {
            if (res.code === 'rest.success') {
              vm.goodsList = res.result.list;
              vm.technologyList = res.result.list;
              vm.productList = res.result.list;
              vm.total = res.result.total;
              vm.pages = res.result.pages;
            }
          })
        },
        handleFilter: function (i) {
          if (this.filters[i].seleced) {
            if (!this.filters[i].value) {
              this.filters[i].value = true
            } else {
              this.filters[i].value = false
            }
          } else {
            this.filters = this.filters.map(function (item, index) {
              if (index === i) {
                item.seleced = true
                item.value = true
              } else {
                item.seleced = false
                item.value = false
              }
              return item
            })
          }
          if (i) {
            if (i === 1) {
              this.formData.orderBy= 'createTime asc'
            }
            if (i === 2) {
              this.formData.orderBy= 'minPrice asc,price asc'
            }
          } else {
            this.formData.orderBy =''
          }
          this.selectpByPage()
        },
        handleEnshrine: function (flag, id, i, e) {
          var vm = this
          e.stopPropagation();
          e.preventDefault()
          if (flag === '0') {
            this.http.selected({
              storeId: id,
              type: '01'
            }).then(function (res) {
              if (res.code === 'rest.success') {
                vm.goodsList[i].collectFlag = '1'
                vm.goodsList[i].collectCount += 1
                vm.technologyList[i].collectFlag = '1'
                vm.technologyList[i].collectCount += 1
                vm.productList[i].collectFlag = '1'
                vm.productList[i].collectCount += 1
                vm.$dialog.showToast("收藏成功")
              }
            })
          } else {
            this.http.cancel({ goodsId: id }).then(function (res) {
              if (res.code === 'rest.success') {
                vm.goodsList[i].collectFlag = '0'
                vm.goodsList[i].collectCount -= 1
                vm.technologyList[i].collectFlag = '1'
                vm.technologyList[i].collectCount -= 1
                vm.productList[i].collectFlag = '1'
                vm.productList[i].collectCount -= 1
                vm.$dialog.showToast("取消成功")
              }
            })
          }
        },
        shopAccess: function () {
          var vm = this
          this.http.shopAccess({ shopCode: this.shopCode, shortCode: this.shortCode }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.selectpByPage()
              vm.statistics();
              vm.indexInfo();
            } else {
              vm.$dialog.showToast(res.desc)
            }
          })
        },
        searchShop: function (data) {
          this.formData.goodsName = decodeURIComponent(data.searchKey)
          this.formData.technologyName = decodeURIComponent(data.searchKey)
          this.formData.productName = decodeURIComponent(data.searchKey)
          this.selectpByPage()
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
        },
        // 店铺综合统计
        statistics: function () {
          var vm = this;
          httpStoret01.statistics({
            shopCode: this.shopCode
          }).then(function (res) {
            vm.statisticsInfo = res.result;
          })
        },
        // 取得店铺首页基础信息
        indexInfo: function () {
          var vm = this;
          httpStoret01.indexInfo({
            shopCode: this.shopCode
          }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.shopInfo = res.result;
            }
          })
        },
        /**
         * 收藏点击
         */
        colSelectedClick: function (info) {
          if (info.collectionFlag === '1') {
            this.collectionCancel(info.shopId);
          } else {
            this.colSelected(info.shopId);
          }
        },
        /**
         * 收藏
         */
        colSelected: function (storeId) {
          var vm = this;
          this.http.selected({
            storeId: storeId,
            type: '02'
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.shopInfo.collectionFlag = '1';
              vm.$dialog.showToast("收藏成功")
            }
          })
        },
        /**
         * 取消收藏
         */
        collectionCancel: function (storeId) {
          var vm = this;
          this.http.cancel({
            goodsId: storeId
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.shopInfo.collectionFlag = '0';
              vm.$dialog.showToast("取消成功")
            }
          })
        },
      }
    })
  })
})
