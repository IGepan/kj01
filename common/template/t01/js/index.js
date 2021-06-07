// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'dialog', 'httpStoret01', 'carousel', 'httpCom'], function ($, Vue, dic, httpVueLoader, dialog, httpStoret01, carousel, httpCom) {
    Vue.component('ly-searchbox', httpVueLoader(this.$pathPrefix+'/style/components/searchbox.vue'))
    new Vue({
      el: '#index_box',
      data: {
        http: httpStoret01,
        httpCom: httpCom,
        statisticsInfo: {},
        shopInfo: {
          collectionFlag: '0'
        },
        formData: {
          hasContentFlag: false,
          pageNum: 1,
          pageSize: 5,
        },
        tag: {
          cactag1: 0,
          cactag2: 0,
          cactag3: 0,
          opt1: false,
          opt2: false,
          opt3: false
        },
        pages: 1,
        total: 0,
        shopSelectFst: [],
        evaluateList: [],
        shopStatistics: {}, // 店铺统计
        goodsForm: {
          pageNum: 1,
          pageSize: 4,
          shopCode: '',
          categoryCode: '',
          homePageFlag: '1',
        },
        similarList: [], // 同类机构
        latestGoodsList: [], // 店铺动态数据
        whoConcernList: [], // 近期访客
        technologyList: [], // 推荐技术
        productList: [], // 推荐产品
        serviceList: [], // 推荐服务
        shopCode: '',
        activeIndex: 0
      },
      created: function () {
        this.shopCode = this.goodsForm.shopCode = this.$utils.getShopCode();
        this.shortCode = this.$utils.getReqStr('shortCode');
        this.commentSelectpByPage('init');
        this.selectpByPage({ shopCode: this.shopCode });
        this.shopAccess();
        this.selectFst();
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
      mounted: function () {

        var owl = $(".custom");
        owl.owlCarousel({
          items: 1,
          loop: true,
          dots: true,
          autoplay: true,
          autoplayTimeout: 5000,
          nav: true,
          navText: ["", ""]
        });
      },


      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/template/t01/components/defaultHeader.vue'),
        'ly-store-info': httpVueLoader('/common/template/t01/components/defaultStoreInfo.vue'),
        'ly-menu-nav': httpVueLoader('/common/template/t01/components/defaultMenuNav.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      methods: {
        formatPrice: function (flag, v, n, m) {
          if (flag == '2') {
            return '面议'
          }if(flag == "3"){
            return '查看价格详情'
          }else {
            if (typeof v !== 'undefined' ) {
              if (v >= 10000) {
                return  '￥'+((v / 10000).toFixed(2) + '万元');
              }else {
                return '￥'+ v + '元'
              }
            } else if (!v && !m ) {
              if (n >= 10000) {
                return  '￥'+((n / 10000).toFixed(2)+"万元");
              }else {
                return  '￥'+n+"元";
              }
            } else {
              if(n && m >= 10000){
                return '￥'+((n / 10000).toFixed(2) +'万元'+ '-' + (m / 10000).toFixed(2)+'万元');
              }else{
                return  '￥'+(n+"元" + '-' +m+'元')
              }

            }
          }
        },
        updatePull () {
          var vm = this;
          this.$nextTick(function () {
            setTimeout(function () {
              var o = vm.$refs.cac.querySelectorAll('.cnt-about-content');
              for (var i = 0, l = o.length;i < l;i++) {
                if (o[i].scrollHeight > o[i].offsetHeight) {
                  vm.tag['opt' + (i + 1)] = 1;
                }
              }
            }, 300);
          });
        },
        togglePull: function (i) {
          var key = 'cactag' + (i + 1);
          this.tag[key] = !this.tag[key];
        },
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.formData.pageNum = index;
            this.commentSelectpByPage();
          }
        },
        isMore: function () {
          var pageNum = this.formData.pageNum;
          var row = parseInt(pageNum / 2);
          var index = row * 2 - 1;
          return !(index + 4 > this.pages);
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
        handlehasContentFlagchange: function (v) {
          this.commentSelectpByPage()
        },
        handleComment: function (type) {
          this.activeIndex = type;
          this.formData.pageNum = 1;
          this.formData.evaluateResult = '';
          this.formData.hasAddContentFlag = '';
          switch (type) {
            case 1:
              this.formData.evaluateResult = [4, 5];
              break;
            case 2:
              this.formData.evaluateResult = [1, 2];
              break;
            case 3:
              this.formData.hasAddContentFlag = 1;
              break;
          }
          this.commentSelectpByPage()
        },
        commentSelectpByPage: function (type) {
          var vm = this;
          var data = JSON.parse(JSON.stringify(this.formData, function (k, v) {
            if (k === 'hasContentFlag') {
              return v ? 1 : '';
            }
            return v
          }))
          data.shopCode = this.shopCode;
          this.http.evaluateSelectpByPage(data).then(function (res) {
            if (res.code === 'rest.success') {
              vm.evaluateList = res.result.list;
              vm.pages = res.result.pages;
              vm.total = res.result.total;
              if (type === 'init') {
                vm.statisticsInfo.countTotal = vm.total;
              }
            }
          })
        },
        selectFst: function () {
          var vm = this;
          this.http.selectFst({
            shopCode: vm.shopCode
          }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.shopSelectFst = res.result;
            }
          })
        },
        // 店铺综合统计
        statistics: function () {
          var vm = this;
          httpStoret01.statistics({
            shopCode: this.shopCode
          }).then(function (res) {
            res.result.sumCount = res.result.prodCount + res.result.resCount + res.result.serviceCount + res.result.techCount;
            res.result.countTotal;
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
              vm.updatePull();
            }
          })
        },
        // 取得同类机构
        similar: function () {
          var vm = this;
          httpStoret01.similar({
            shopCode: this.shopCode,
            pageSize: 4
          }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.similarList = res.result;
            }
          })
        },
        // 取得店铺最新商品
        latestGoods: function () {
          var vm = this;
          httpStoret01.latestGoods({
            shopCode: this.shopCode,
            pageSize: 5
          }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.latestGoodsList = res.result;
            }
          })
        },
        // 取得关注当前店铺的用户
        whoConcern: function () {
          var vm = this;
          httpStoret01.whoConcernList({
            shopCode: this.shopCode,
            pageSize: 5
          }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.whoConcernList = res.result;
            }
          })
        },
        toList (code) {
          var url = 'list.html?id=' + this.getType(code);
          this.$utils.openNewTable(url);
        },
        jumpTo (o) {
          this.$utils.openNewTable(this.$pathPrefix+o.goodsDetailUrl);
        },
        // 获取产品
        selectpByPage: function (param, type) {
          var vm = this;
          httpStoret01.selectpByPage(param).then(function (res) {
            if (res.code === 'rest.success') {
              vm.technologyList = res.result.list.slice(0, 2);
            }
          })
        },
        onLineConsult: function () {
          if (this.shopInfo.shopId) {
            this.$root.$chat_im.connect(this.shopInfo.userId);
          }
        },
        colSelectedClick: function (info) {
          if (info.collectionFlag === '1') {
            this.collectionCancel(info.shopId);
          } else {
            this.colSelected(info.shopId);
          }
        },
        getType (type) {
          var dic = {
            '001': 'technology',
            '009': 'service',
            '010': 'product'
          };
          type = (type.split('.'))[0];
          for (var k in dic) {
            if (type.indexOf(k) > -1) {
              return dic[k];
            }
          }
          return dic['001'];
        },
        handleEnshrine: function (flag, id, i, type, e) {
          var vm = this;
          if (flag === '0') {
            this.http.selected({
              storeId: id,
              type: '01'
            }).then(function (res) {
              if (res.code === 'rest.success') {
                vm[type][i].collectFlag = '1'
                vm[type][i].collectCount = vm[type][i].collectCount + 1
                vm.$dialog.showToast("收藏成功")
              }
            })
          } else {
            this.http.cancel({ goodsId: id }).then(function (res) {
              if (res.code === 'rest.success') {
                vm[type][i].collectFlag = '0'
                vm[type][i].collectCount = vm[type][i].collectCount - 1
                vm.$dialog.showToast("取消成功")
              }
            })
          }
        },
        shopAccess: function () {
          var vm = this
          this.http.shopAccess({ shopCode: this.shopCode, shortCode: this.shortCode }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.statistics();
              vm.indexInfo();
              vm.whoConcern();
              vm.latestGoods();
              vm.similar();
              for (var key in dic.goodsCategoryCode) {
                if (dic.goodsCategoryCode.hasOwnProperty(key)) {
                  var param = JSON.parse(JSON.stringify(vm.goodsForm));
                  param.categoryCode = dic.goodsCategoryCode[key];
                }
              }
            } else {
              vm.$dialog.showToast(res.desc)
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
        }
      }
    });
  });
});
