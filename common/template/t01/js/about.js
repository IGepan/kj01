var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpStoret01', 'httpCom', 'dialog'], function ($, Vue, dic, httpVueLoader, httpStoret01, httpCom, dialog) {
    Vue.component('ly-searchbox', httpVueLoader(this.$pathPrefix+'/style/components/searchbox.vue'))
    new Vue({
      el: '#index_box',
      data: {
        isHide: true,
        isBtnHide: false,
        isTrue: false,
        http: httpStoret01,
        httpCom: httpCom,
        shopCode: '',
        shopInfo: {}, // 店铺基本信息
        shopStatistics: {}, // 店铺统计
        shopSelectFst: {}, // 店铺资质
        pages: 1,
        pageCount: 4,
        total: 0,
        evaluateList: [],
        formData: {
          pageNum: 1,
          pageSize: 6,
          shopCode: '',
          evaluateResult: '',
          hasAddContentFlag: '',
          hasContentFlag: false,
        }
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/template/t01/components/defaultHeader.vue'),
        'ly-store-info': httpVueLoader('/common/template/t01/components/defaultStoreInfo.vue'),
        'ly-menu-nav': httpVueLoader('/common/template/t01/components/defaultMenuNav.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.shopCode = this.formData.shopCode = this.$utils.getShopCode();
        this.shortCode = this.$utils.getReqStr('shortCode');
        this.shopAccess()
      },
      methods: {
        onShow: function () {
          this.isHide = !this.isHide;
        },
        // 获取店铺基本信息
        indexInfo: function () {
          var vm = this;
          this.http.indexInfo({
            shopCode: vm.shopCode
          }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.shopInfo = res.result;
              // vm.map = new BMap.Map("allmap");
              // 设置中心点
              // var point = new BMap.Point(res.result.longitude, res.result.latitude);
              // var marker = new BMap.Marker(point);  // 创建标注
              // vm.map.centerAndZoom(point, 20);
              // vm.geoc = new BMap.Geocoder();
              // vm.map.addOverlay(marker);               // 将标注添加到地图中
              // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
              var geolocation = new BMap.Geolocation();
              if (!res.result.longitude && !res.result.latitude) {
                geolocation.getCurrentPosition(function (r) {
                  if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var mk = new BMap.Marker(r.point);
                    vm.map.addOverlay(mk);
                    vm.map.panTo(r.point);
                  }
                  else {
                    vm.$dialog.showToast("获取当前位置失败");
                  }
                });
              }
              vm.map.addControl(new BMap.NavigationControl(
                {
                  type: BMAP_NAVIGATION_CONTROL_ZOOM, //缩放控件类型 仅包含缩放按钮
                  anchor: BMAP_ANCHOR_BOTTOM_RIGHT, //右下角
                  offset: new BMap.Size(1, 1) //进一步控制缩放按钮的水平竖直偏移量
                }
              ));
            }
          })
        },
        // 获取店铺统计信息
        statistics: function () {
          var vm = this;
          this.http.statistics({
            shopCode: vm.shopCode
          }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.shopStatistics = res.result;
            }
          })
        },
        // 筛选当前店铺所有资质，资质图片选择一张，最开始传的那张
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
        getOption: function (key) {
          var vm = this
          httpCom.dict({ code: key }).then(function (res) {
            if (res.code === 'rest.success') {
              vm['searchType'] = res.result
            }
          })
        },
        commentSelectpByPage: function () {
          var vm = this;
          var data = JSON.parse(JSON.stringify(this.formData, function (k, v) {
            if (k === 'hasContentFlag') {
              return v ? 1 : 0
            }
            return v
          }))
          this.http.evaluateSelectpByPage(data).then(function (res) {
            if (res.code === 'rest.success') {
              vm.evaluateList = res.result.list;
              vm.pages = res.result.pages;
              vm.total = res.result.total;
              vm.$nextTick(function () {
                if ($('.summary').height() <= 204) {
                  vm.isBtnHide = false;

                } else {
                  vm.isBtnHide = true;
                  vm.isHide = false;

                }
                vm.isTrue = true;
              })
            }
          })
        },
        handlehasContentFlagchange: function (v) {
          this.commentSelectpByPage()
        },
        handleComment: function (type) {
          switch (type) {
            case 0:
              this.formData.evaluateResult = ''
              this.formData.hasAddContentFlag = ''
              break;
            case 1:
              this.formData.evaluateResult = [4, 5]
              this.formData.hasAddContentFlag = ''
              break;
            case 2:
              this.formData.evaluateResult = [1, 2]
              this.formData.hasAddContentFlag = ''
              break;
            case 3:
              this.formData.evaluateResult = ''
              this.formData.hasAddContentFlag = 1
              break;
          }
          this.commentSelectpByPage()
        },
        shopAccess: function () {
          var vm = this
          this.http.shopAccess({ shopCode: this.shopCode, shortCode: this.shortCode }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.indexInfo()
              vm.statistics()
              vm.selectFst()
              vm.commentSelectpByPage()
            } else {
              vm.$dialog.showToast(res.desc)
            }
          })
        },
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.formData.pageNum = index;
            this.commentSelectpByPage();
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
        onLineConsult: function () {
          if (this.shopInfo.shopId) {
            this.$root.$chat_im.connect(this.shopInfo.userId);
          }
        },
        telConsult: function () {
          dialog.showToast('敬请期待');
        },
        handleEnshrine: function (flag, id) {
          var vm = this
          if (flag === '0') {
            this.http.selected({
              storeId: id,
              type: '02'
            }).then(function (res) {
              if (res.code === 'rest.success') {
                vm.indexInfo()
                vm.$dialog.showToast("收藏成功")
              }
            })
          } else {
            this.http.cancel({ goodsId: id }).then(function (res) {
              if (res.code === 'rest.success') {
                vm.indexInfo()
                vm.$dialog.showToast("取消成功")
              }
            })
          }
        },
      }
    })
  })
})
