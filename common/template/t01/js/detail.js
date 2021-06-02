var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['httpUrl', 'jquery', 'vue', 'dic', 'httpVueLoader', 'httpStoret01', 'dialog', 'fileSaver', 'httpCom', 'httpCartApi'], function (httpUrl, $, Vue, dic, httpVueLoader, httpStoret01, dialog, fileSaver, httpCom, httpCartApi) {
    Vue.component('ly-searchbox', httpVueLoader(this.$pathPrefix+'/style/components/searchbox.vue'))
    new Vue({
      el: '#index_box',
      data: {
        http: httpStoret01,
        baseFilePath: httpUrl.imgUploadUrl,
        httpCom: httpCom,
        pid: '',
        isShow: '',
        detailType: '',
        fullList: [],
        shopCode: '',
        detailInfo: {
          // upperShelfflag: -1
        }, // 店铺基本信息
        latestGoodsList: [], // 店铺动态数据
        whoConcernList: [], // 近期访客
        statisticsInfo: {
          categoryCode: '001',
          imgList: []
        },
        selectImgIndex: 0,
        shopInfo: {},
        tabIndex: 1,
        names: {
          '001': {
            name: '技术',
            value: 'technology'
          },
          '010': {
            name: '产品',
            value: 'product'
          },
          '009': {
            name: '服务',
            value: 'service'
          },
          '011': {
            name: '资源',
            value: 'resource'
          }
        },
        sumEv: 0,
        total: 0,
        evaluateList: [],
        evaluateInfo: {},
        avgEvaluateResult: 0,
        carForm: {
          skuId: '',
          goodsId: '',
          number: 1
        },
        formData: {
          pageNum: 1,
          pageSize: 4,
          goodsId: ''
        },
        evaluateForm: {
          pageNum: 1,
          pageSize: 6,
          goodsId: '',
          hasContentFlag: false,
          total: 0
        },
        tradedList: '',
        tradedForm: {
          pageNum: 1,
          pageSize: 4,
        },
        pages: 1,
        pageCount: 4,
        msgInfo: '',
        userInfo: null
      },
      watch: {
        'evaluateForm.hasContentFlag': function () {
          this.getEvaluateSelectpByPage()
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
        this.formData.goodsId = this.evaluateForm.goodsId = this.pid = this.$utils.getReqStr('id');
        this.shopCode = this.$utils.getShopCode();
        this.shortCode = this.$utils.getReqStr('shortCode');
        this.userInfo = JSON.parse(this.$utils.getCookie(dic.locaKey.USER_INFO));
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
        formatPrice: function (flag, v, n, m) {
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
        formatPrice2: function (flag, v, n, m) {
          if (flag === '2') {
            return '面议'
          }else if (flag === '0') {
            if (typeof v !== 'undefined') {
              return '￥' + v + '元';
            }else if (n !== 'undefined') {
              return '￥' + n + '元';
            }
          }else {
            return '￥' + n + '-' + m + '元'
          }

        },
        updateCartInfo: function () {
          if (!this.component_toper) {
            for (var i = 0, l = this.$children.length;i < l;i++) {
              if (this.$children[i].toper === 'toper') {
                this.component_toper = this.$children[i];
                break;
              }
            }
          }
          //防止没有加载完成操作会报错的情况
          if (this.component_toper) {
            this.component_toper.updateCartInfo();
          }
        },
        cutout(cellValue) {
          if (cellValue.indexOf(',') > 0) {
            return cellValue.replace(/\,/g, '</br>');
          }else {
            return cellValue;
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
              vm.getInfo(vm.$utils.getReqStr('c'))
              vm.getGoodsStatistics()
              vm.getEvaluateSelectpByPage()
              vm.getorderSelectpByPage()
              vm.saveFootprint(vm.formData.goodsId)
            } else if (res.code === "msg.shop.info.frozened") {
              vm.$data.isShow = 2;
              vm.selectpByPage()
            } else {
              vm.$dialog.showToast(res.desc)
            }
          })
        },
        getInfo: function (c) {
          var vm = this
          this.http.goodsDetailInfo({ id: this.pid, c: c || '' }).then(function (res) {
            if (res.code === 'rest.success') {
              var imgList = []
              var videoList = []
              var adjunctList = []
              res.result.additionalList = res.result.additionalList.filter(function (i) {
                return i.serviceType === '009'
              })
              res.result.keyWords = res.result.keyWord ? res.result.keyWord.split(',') : []
              res.result.categoryCode = res.result.categoryCode.split('.')[0]
              vm.detailType = vm.names[res.result.categoryCode].value
              res.result.attachmentList.forEach(function (item) {
                switch (item.attachmentType) {
                  case '01':
                    imgList.push({ url: item.fileInfoView.url, type: true })
                    break;
                  case '02':
                    imgList.shift({ url: item.fileInfoView.url, type: false })
                    break;
                  case '03':
                    videoList.push(item.fileInfoView.url)
                    break;
                  default:
                    adjunctList.push({ url: item.fileInfoView.path, name: item.fileInfoView.name })
                    break;
                }
              })
              res.result.stock = res.result.stock ? res.result.stock : 0
              res.result.collectionNum = parseInt(res.result.collectionNum)
              res.result.imgList = imgList
              res.result.videoList = videoList
              res.result.adjunctList = adjunctList
              vm.$data.detailInfo = res.result
              vm.carForm.skuId = res.result.skuId
              vm.carForm.number = res.result.number ? res.result.number : 1
              vm.carForm.goodsId = res.result.id
              vm.selectpByPage()
              vm.$data.isShow = 1;
            } else {
              vm.$data.isShow = 0;
              if (res.code === 'msg.goods.noUp') {
                vm.$data.msgInfo = 0;
              } else if (res.code === 'msg.goods.deleted') {
                vm.$data.msgInfo = 1;
              }
              vm.selectpByPage()
            }
          })
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
        onLineConsult: function () {
          if (this.shopInfo.shopId) {
            this.$root.$chat_im.connect(this.shopInfo.userId);
          }
        },
        telConsult: function () {
          this.$dialog.showToast('敬请期待');
        },
        buyNow: function () {
          var vm = this
          if (this.userInfo && this.userInfo.userTypes && this.userInfo.userTypes.indexOf('001') !== -1) {
            sessionStorage.setItem('orderInfo', JSON.stringify({
              skuIds: [{
                goodsId: vm.detailInfo.id,
                skuId: vm.detailInfo.skuId,
                number: vm.carForm.number
              }], source: '01'
            }))
            httpCartApi.buyNow({
              list: [{
                goodsId: vm.detailInfo.id,
                skuId: vm.detailInfo.skuId,
                number: vm.carForm.number
              }]
            }).then(function (res) {
              if (res.code == 'rest.success') {
                res.result.length && res.result.forEach(function (shop) {
                  shop.details.forEach(function (sku) {
                    sku.requirement = ''
                    sku.protocolPrice = sku.price !== undefined ? sku.price : ''
                    sku.subtotal = sku.price !== undefined ? (sku.number * sku.price) : (sku.number * sku.minPrice)
                  })
                  shop.comment = ''
                  shop.payMode = '001'
                })
                location.href = vm.$pathPrefix+'/common/servicetrade/order.html'
                vm.$data.shopList = res.result
              } else {
                vm.$dialog.showToast(res.desc)
              }
            })
          } else {
            this.$refs.topbar.openBuyerConfirm()
          }
        },
        addNum: function () {
          if (this.carForm.number > 1) {
            this.carForm.number -= 1
          }
        },
        subtractNum: function () {
          if (this.carForm.number < this.detailInfo.stock) {
            this.carForm.number += 1
          }
        },
        buyCart: function () {
          var vm = this
          if (this.userInfo && this.userInfo.userTypes && this.userInfo.userTypes.indexOf('001') !== -1) {
            this.http.shopcarAdd(this.carForm).then(function (res) {
              if (res.code === 'rest.success') {
                vm.$dialog.showToast("加入购物车成功")
                vm.updateCartInfo();
              }
            })
          } else {
            this.$refs.topbar.openBuyerConfirm()
          }
        },
        handleEnshrine: function (flag, e, id, i) {
          var vm = this
          e.stopPropagation();
          e.preventDefault()
          if (flag === '0') {
            this.http.selected({
              storeId: id ? id : this.$data.pid,
              type: '01'
            }).then(function (res) {
              if (res.code === 'rest.success') {
                if (id) {
                  vm.fullList[i].collectFlag = '1'
                  vm.fullList[i].collectionNum += 1
                } else {
                  vm.detailInfo.collectionFlag = '1'
                  vm.detailInfo.collectionNum += 1
                }
                vm.$dialog.showToast("收藏成功")
              }
            })
          } else {
            this.http.cancel({ goodsId: id ? id : this.$data.pid }).then(function (res) {
              if (res.code === 'rest.success') {
                if (id) {
                  vm.fullList[i].collectFlag = '0'
                  vm.fullList[i].collectionNum -= 1
                } else {
                  vm.detailInfo.collectionFlag = '0'
                  vm.detailInfo.collectionNum -= 1
                }
                vm.$dialog.showToast("取消成功")
              }
            })
          }
        },
        getGoodsStatistics: function (id) {
          var vm = this;
          httpStoret01.evaluateStatistics({
            goodsId: this.pid
          }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.evaluateInfo = res.result;
              vm.avgEvaluateResult = parseInt(res.result.avgEvaluateResult) || 0
            }
          })
        },
        getEvaluateSelectpByPage: function (id) {
          var vm = this;
          var data = JSON.parse(JSON.stringify(this.evaluateForm, function (k, v) {
            if (k === 'hasContentFlag') {
              return v ? 1 : 0
            }
            return v
          }))
          httpStoret01.evaluateSelectpByPage(data).then(function (res) {
            if (res.code === 'rest.success') {
              vm.evaluateList = res.result.list;
              vm.pages = res.result.pages;
              vm.sumEv = res.result.total
            }
          })
        },
        selecedTab: function (v) {
          this.tabIndex = v
        },
        handleImgClick: function (v) {
          this.selectImgIndex = v
        },
        selectpByPage: function () {
          var vm = this;
          var data = JSON.parse(JSON.stringify(this.formData, function (k, v) {
            return v ? v : undefined
          }))
          this.http.goodsSimilarByPage(data).then(function (res) {
            if (res.code === 'rest.success') {
              vm.fullList = res.result.list;
            }
          })
        },
        randomPage: function () {
          this.formData.pageNum = this.formData.pageNum >= 10 ? 1 : this.formData.pageNum + 1
          this.selectpByPage()
        },
        fileSaveAs: function (i, e) {
          e.preventDefault()
          e.stopPropagation()
          var fileInfo = this.detailInfo.adjunctList[i]
          saveAs(this.baseFilePath + '/file/download?filePath=' + fileInfo.url, fileInfo.name, { type: 'application/pdf;charset=utf-8' })
          // target="_blank" : href = "baseFilePath + '/file/download?filePath=' + adjunct.url"
        },
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.evaluateForm.pageNum = index;
            this.getOrderList();
          }
        },
        isShowPage: function (index) {
          var pageNum = this.evaluateForm.pageNum;
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
          var pageNum = this.evaluateForm.pageNum;
          var row = parseInt(pageNum / 2);
          var index = row * 2 - 1;
          return !(index + 4 > this.pages);
        },
        getorderSelectpByPage: function () {
          var vm = this;
          var data = JSON.parse(JSON.stringify(this.formData, function (k, v) {
            return v ? v : undefined
          }))
          httpStoret01.orderSelectpByPage(data).then(function (res) {
            if (res.code === 'rest.success') {
              vm.tradedList = res.result.list;
              vm.pages = res.result.pages
              vm.total = res.result.total
            }
          })
        },
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.tradedForm.pageNum = index;
            this.getOrderList();
          }
        },
        isShowPage: function (index) {
          var pageNum = this.tradedForm.pageNum;
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
          var pageNum = this.tradedForm.pageNum;
          var row = parseInt(pageNum / 2);
          var index = row * 2 - 1;
          return !(index + 4 > this.pages);
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
        /**
         * 保存足迹
         */
        saveFootprint: function (storeId) {
          this.http.saveFootprint({
            id: storeId
          })
        }
      }
    })
  })
})
