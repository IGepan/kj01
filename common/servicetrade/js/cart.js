var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpCartApi', 'httpCom', 'dialog'], function ($, Vue, dic, httpVueLoader, httpCartApi, httpCom, dialog) {
    Vue.component('ly-searchbox', httpVueLoader('/style/components/searchbox.vue'))
    new Vue({
      el: '#index_box',
      data: {
        http: httpCartApi,
        shopCode: '',
        cartList: [],
        popularList: [],
        httpCom: httpCom
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/orderHeader.vue'),
        'ly-footer': httpVueLoader('/style/components/main_footer.vue')
      },
      created: function () {
        this.getList()
        this.getPopularList()
      },
      filters: {
        sumPrice: function (price, num) {
          return (price * num).toFixed(2)
        }
      },
      computed: {
        selecedSumNum: function () {
          return this.cartList.reduce(function (sumNum, item) {
            return sumNum += item.skus.reduce(function (itemNum, sku) {
              if (sku.stock && sku.isActive) {
                itemNum += sku.number
              }
              return itemNum
            }, 0)
          }, 0)
        },
        selecedSumPrice: function () {
          return this.cartList.reduce(function (sumPrice, item) {
            return sumPrice += item.skus.reduce(function (itemPrice, sku) {
              if (sku.stock && sku.isActive) {
                itemPrice += sku.price !== undefined ? (sku.number * sku.price) : (sku.number * sku.minPrice)
              }
              return itemPrice
            }, 0)
          }, 0)
        },
        isSeletced: function () {
          return this.cartList.filter(function (shop) {
            if (shop.efficacyFlag) {
              shop.skus = shop.skus.filter(function (sku) {
                return sku.efficacyFlag
              })
            }
            return shop.efficacyFlag
          }).every(function (item) {
            return item.isActive && item.skus.every(function (sku) {
              return sku.isActive
            })
          })
        }
      },
      methods: {
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
        getList: function () {
          var vm = this
          httpCartApi.shopcarSelect().then(function (res) {
            if (res.code == 'rest.success') {
              res.result.forEach(function (shop) {
                shop.skus.forEach(function (sku) {
                  sku.isActive = false
                })
                shop.isActive = false
              })
              vm.$data.cartList = res.result
            }
          })
        },
        selecedFull: function () {
          var flag = this.isSeletced
          this.cartList.forEach(function (shop) {
            if (shop.efficacyFlag) {
              shop.skus.forEach(function (sku) {
                sku.efficacyFlag && (sku.isActive = !flag && sku.number < sku.stock)
              })
              if (shop.skus.filter(function (sku) {
                return sku.efficacyFlag
              }).every(function (si) { return si.isActive })) {
                shop.isActive = true
              } else {
                shop.isActive = false
              }
            }
          })
        },
        changeNum: function (sku, flag) {
          var number = flag ? sku.number + 1 : sku.number - 1
          var vm = this;
          httpCartApi.shopcarChangeNum({
            skuId: sku.skuId,
            num: number
          }).then(function (res) {
            if (res.code == 'rest.success') {
              sku.number = number
              vm.updateCartInfo();
            }
          })
        },
        deleteOne: function (skuId, i, s) {
          var vm = this
          httpCartApi.shopcarDelete({
            skuId: skuId
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.cartList[i].skus.splice(s, 1)
              vm.updateCartInfo();
              if (!vm.cartList[i].skus.length) {
                vm.cartList.splice(i, 1)
              }
            }
          })
        },
        deleteBatch: function () {
          var vm = this
          var skuIds = this.getSkuIds()
          if (skuIds.length) {
            httpCartApi.shopcarDeleteBatch({
              skuIds: skuIds.join(',')
            }).then(function (res) {
              if (res.code == 'rest.success') {
                vm.updateCartInfo();
                vm.cartList = vm.cartList.filter(function (item) {
                  return item.isActive ? false : item.skus = item.skus.filter(function (sku) {
                    return !sku.isActive
                  })
                })
              }
            })
          } else {
            this.$dialog.showToast('请先选中需要删除的商品！');
          }
        },
        getSkuIds: function () {
          return this.cartList.reduce(function (skus, item) {
            item.skus.forEach(function (sku) {
              if (sku.isActive) {
                skus.push(sku.skuId)
              }
            })
            return skus
          }, [])
        },
        oneSelecedItem: function (i, s) {
          var sku = this.cartList[i].skus[s]
          var flag = !sku.isActive
          if (sku.efficacyFlag) {
            this.cartList[i].skus[s].isActive = flag && sku.number < sku.stock
            if (sku.number > sku.stock) {
              this.$dialog.showToast(sku.goodsName + '-商品库存不足，库存为：' + sku.stock);
            }
            if (this.cartList[i].skus.filter(function (sku) {
              return sku.efficacyFlag
            }).every(function (si) { return si.isActive })) {
              this.cartList[i].isActive = true
            } else {
              this.cartList[i].isActive = false
            }
          }
        },
        selecedShopSkus: function (i) {
          var shop = this.cartList[i]
          var flag = !shop.isActive
          if (shop.efficacyFlag) {
            shop.skus.forEach(function (sku) {
              sku.efficacyFlag && (sku.isActive = flag && sku.number < sku.stock)
            })
            if (shop.skus.filter(function (sku) {
              return sku.efficacyFlag
            }).every(function (si) { return si.isActive })) {
              shop.isActive = true
            } else {
              shop.isActive = false
            }
          }
        },
        subtractNumber: function (i, s) {
          var sku = this.cartList[i].skus[s]
          if (sku.number > 1) {
            this.changeNum(sku, false)
          }
        },
        addNumber: function (i, s) {
          var sku = this.cartList[i].skus[s]
          if (sku.number < sku.stock) {
            this.changeNum(sku, true)
          }
        },
        settleAccounts: function () {
          var skuIds = this.getSkuIds()
          if (skuIds.length) {
            sessionStorage.setItem('orderInfo', JSON.stringify({ skuIds: skuIds, source: '02' }))
            location.href = '/common/servicetrade/order.html'
          } else {
            this.$dialog.showToast('请先选中购买的商品！');
          }
        },
        getPopularList: function () {
          var vm = this
          httpCartApi.popularList({ pageSize: 5 }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.$data.popularList = res.result
            }
          })
        }
      }
    })
  })
})
