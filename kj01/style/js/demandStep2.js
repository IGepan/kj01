// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpCom', 'jqValidate', 'dialog', 'echarts', 'httpCom'], function ($, Vue, dic, httpVueLoader, httpCom, jqValidate, dialog, echarts, httpCom) {
    Vue.component('ly-searchbox', httpVueLoader('/style/components/searchbox.vue'))
    window.vueDom = new Vue({
      el: '#index_box',
      data: {
        jquery: $,
        options: {
          chartOptions: {
            radar: [
              {
                indicator: [
                  { text: '评分', max: 5 },
                  { text: '热度', max: 100 },
                  { text: '销量', max: 100 },
                  { text: '价格', max: 100 }
                ],
                center: ['15%', '50%'],
                radius: 95
              },
              {
                indicator: [
                  { text: '评分', max: 5 },
                  { text: '热度', max: 100 },
                  { text: '销量', max: 100 },
                  { text: '价格', max: 100 }
                ],
                radius: 95,
                center: ['50%', '50%'],
              },
              {
                indicator: [
                  { text: '评分', max: 5 },
                  { text: '热度', max: 100 },
                  { text: '销量', max: 100 },
                  { text: '价格', max: 100 }
                ],
                radius: 95,
                center: ['85%', '50%'],
              }
            ],
            series: [
              {
                type: 'radar',
                tooltip: {
                  trigger: 'item'
                },
                itemStyle: { normal: { areaStyle: { type: 'default' } } },
                data: [
                  {
                    value: [4, 73, 7, 40],
                    name: '评分最高'
                  }
                ]
              },
              {
                type: 'radar',
                radarIndex: 1,
                itemStyle: { normal: { areaStyle: { type: 'default' } } },
                data: [
                  {
                    value: [4, 90, 90, 95],
                    name: '价格最低'
                  }
                ]
              },
              {
                type: 'radar',
                radarIndex: 2,
                itemStyle: { normal: { areaStyle: { type: 'default' } } },
                data: [
                  {
                    value: [4, 90, 90, 95],
                    name: '累计销量'
                  }
                ]
              }
            ]
          }
        },
        js_chart: null,
        dialogVisible: false,
        demandForm: {
          industry: [],
          planName: '',
          price: '',
          urgency: '',
          sceneId: '02',
          servicesNames: [],
          services: [],
          selectedServices: []
        },
        queryData: {
          industryIds: [],
          servicesIds: []
        },
        baseInfo: {},
        searchInfo: [],
        filterInfo: [
          {
            label: '评分最高',
            selected: true,
            method: 'getSelectMaxScorePlan'
          },
          {
            label: '价格最低',
            method: 'getSelectMinPricePlan'
          },
          {
            label: '销量最高',
            method: 'getSelectMaxSalePlan'
          }
        ],
        isCustomInfo: false,
        collapseCustomInfo: [],
        dataInfo: [],
        httpCom: httpCom
      },
      filters: {
        formatingname: function (value) {
          if (!value) return ''
          value = value.split(',').join(' > ')
          return value
        }
      },
      computed: {
        sumPrice: function () {
          var sumprice = !this.isCustomInfo ? this.searchInfo.reduce(function (price, item) {
            return price += Number(item.minPrice)
          }, 0) : this.collapseCustomInfo.reduce(function (price, item) {
            return price += item.children.reduce(function (sp, si) {
              return sp += Number(si.minPrice)
            }, 0)
          }, 0)
          return sumprice.toFixed(2)
        },
        sumService: function () {
          return !this.isCustomInfo ? this.searchInfo.length : this.collapseCustomInfo.reduce(function (snum, item) {
            return snum += item.children.length
          }, 0)
        },
        isDisabled: function () {
          var flag = true
          if (this.isCustomInfo) {
            this.collapseCustomInfo.some(function (collapse) {
              return collapse.children.length
            }) && (flag = false)
          } else {
            this.searchInfo.length && (flag = false)
          }
          return flag;
        }
      },
      created: function () {
        this.initData();
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/orderHeader.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      mounted: function () {
        this.js_chart = echarts.init(this.$refs.js_chart)
      },
      methods: {
        // 初始化数据
        initData () {
          // 获取上一步数据
          var vm = this
          var demandData = sessionStorage.getItem('step2demandForm') || sessionStorage.getItem('customdemandForm')
          var custom = this.$utils.getReqStr('custom');
          sessionStorage.removeItem('step2demandForm')
          sessionStorage.removeItem('customdemandForm')
          if (demandData) {
            this.demandForm = JSON.parse(demandData)
            this.queryData.industryIds = this.demandForm.industry.map(function (ind) { return ind.tagId })
            this.queryData.servicesIds = this.demandForm.servicesTags.map(function (ind) { return ind.tagId })
            this.dataInfo = this.demandForm.dataInfo ? this.demandForm.dataInfo : []
            this.collapseCustomInfo = this.demandForm.collapseCustomInfo ? this.demandForm.collapseCustomInfo : this.demandForm.servicesTags.map(function (tag) {
              tag.children = []
              return tag
            })
            custom !== null && (
              this.isCustomInfo = true,
              this.$set(this, 'filterInfo', this.filterInfo.map(function (filter, fi) {
                filter.selected = false
                return filter
              }))
            )
          } else {
            document.location = '/demand.html'
            return
          }
          this.getTatisticsFacilitator()
          if (custom === null) {
            this.handleFilter(0)
            this.$nextTick(function () {
              this.getSelectMaxScorePlan()
              this.getSelectMinPricePlan()
              this.getSelectMaxSalePlan()
            })
          }
					
					console.log(this.isCustomInfo)
        },
        // 获取标准码
        getOption: function (key) {
          var vm = this
          httpCom.dict({ code: key }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.options[key] = res.result
            }
          })
        },
        // 获取多个标准码
        getOptions: function (keys) {
          var vm = this
          httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (codes) {
                codes.dictIInfos.unshift({ id: '-1', value: -1, display: '不限', selected: true })
                vm.options[codes.code] = codes.dictIInfos
              })
            }
          })
        },
        getSelectMaxScorePlan: function () {
          var vm = this
          !vm.dataInfo[0] && httpCom.selectMaxScorePlan(this.queryData).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (info) {
                vm.demandForm.queryIds[info.serviceId].qIds.push(info.goodsId)
              })
              vm.searchInfo = vm.dataInfo[0] = res.result
            } else {
              vm.searchInfo = vm.dataInfo[0] = []
            }
          }).catch(
            // 记录失败原因
            function (reason) {
              vm.searchInfo = []
            }
          );
        },
        getSelectMinPricePlan: function () {
          var vm = this
          !vm.dataInfo[1] && httpCom.selectMinPricePlan(this.queryData).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (info) {
                vm.demandForm.queryIds[info.serviceId].qIds.push(info.goodsId)
              })
              vm.searchInfo = vm.dataInfo[1] = res.result
            } else {
              vm.searchInfo = vm.dataInfo[1] = []
            }
          }).catch(
            // 记录失败原因
            function (reason) {
              vm.searchInfo = []
            }
          );
        },
        getSelectMaxSalePlan: function () {
          var vm = this
          !vm.dataInfo[2] && httpCom.selectMaxSalePlan(this.queryData).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (info) {
                vm.demandForm.queryIds[info.serviceId].qIds.push(info.goodsId)
              })
              vm.searchInfo = vm.dataInfo[2] = res.result
            } else {
              vm.searchInfo = vm.dataInfo[2] = []
            }
          }).catch(
            // 记录失败原因
            function (reason) {
              vm.searchInfo = []
            }
          );
        },
        getTatisticsFacilitator: function () {
          var vm = this
          httpCom.statisticsFacilitator(this.queryData).then(function (res) {
            if (res.code === 'rest.success') {
              vm.baseInfo = res.result
              // 评分 价格 销量
              // 评分 热度 销量 价格
              vm.options.chartOptions.series[0].data[0].value = [res.result.maxScoreScore, res.result.maxScoreHeat, res.result.maxScoreSales, res.result.maxScorePrice]
              vm.options.chartOptions.series[1].data[0].value = [res.result.minPriceScore, res.result.minPriceHeat, res.result.minPriceSales, res.result.minPricePrice]
              vm.options.chartOptions.series[2].data[0].value = [res.result.maxSalesScore, res.result.maxSalesHeat, res.result.maxSalesSales, res.result.maxSalesPrice]
              vm.js_chart.setOption(vm.options.chartOptions);
            }
          })
        },
        getDetailInfos: function (data, i) {
          var vm = this
          httpCom.getDetailInfos(data).then(function (res) {
            if (res.code === 'rest.success') {
              vm.$set(vm.collapseCustomInfo[i], 'children', vm.collapseCustomInfo[i].children.concat(res.result))
            }
          })
        },
        planInsert: function (data) {
          var vm = this
          httpCom.planInsert(data).then(function (res) {
            if (res.code === 'rest.success') {
              vm.$dialog.showToast(res.desc);
            }
          })
        },
        handleUpdate: function () {
          var info = {}
          info.industry = this.demandForm.industry
          info.planName = this.demandForm.planName
          info.budget = this.demandForm.budget
          info.period = this.demandForm.period
          info.periodName = this.demandForm.periodName
          info.sceneId = this.demandForm.sceneId
          info.sceneName = this.demandForm.sceneName
          info.contents = this.demandForm.contents
          info.selectedServices = this.demandForm.selectedServices
          info.customForm = this.demandForm.customForm
          info.searchInfo = this.demandForm.searchInfo
          sessionStorage.setItem('update2DemandForm', JSON.stringify(info))
          document.location = '/demand-step2.html'
        },
        // 过滤
        handleFilter: function (i) {
          var vm = this
          this.$set(this, 'filterInfo', this.filterInfo.map(function (filter, fi) {
            filter.selected = fi === i
            if (fi === i) {
              vm.dataInfo[i] ? vm.$set(vm, 'searchInfo', vm.dataInfo[i]) : vm[filter.method]()
            }
            return filter
          }))
          this.isCustomInfo && (this.isCustomInfo = !this.isCustomInfo);
					console.log(this.isCustomInfo)
        },
        // 自选切换
        handleCustom: function () {
          this.isCustomInfo = !this.isCustomInfo;
					console.log(this.isCustomInfo)
          this.$set(this, 'filterInfo', this.filterInfo.map(function (filter, fi) {
            filter.selected = false
            return filter
          }))
        },
        // 添加自选
        handleAddgoods: function (i) {
          this.demandForm.addIndex = i
          // 基本信息不会变化
          !this.demandForm.dataInfo && (this.demandForm.dataInfo = this.dataInfo)
          // 自定义项目可能被删除
          this.demandForm.collapseCustomInfo = this.collapseCustomInfo
          this.demandForm.customQueryData = this.demandForm.queryIds[this.collapseCustomInfo[i].tagId]
          sessionStorage.setItem('customdemandForm', JSON.stringify(this.demandForm))
          document.location = '/searchList.html?type=service&word=&page=1&select='
        },
        // 删除自选
        handleDelgoods: function (i, gi) {
          this.collapseCustomInfo[i].children.splice(gi, 1)
        },
        getBuyNowData: function () {
          var mapFun = function (goods) {
            return {
              goodsId: goods.goodsId,
              skuId: goods.skuId,
              number: 1
            }
          }
          var temp = this.isCustomInfo ? this.collapseCustomInfo.reduce(function (datas, item) {
            return datas.concat(item.children.map(mapFun))
          }, []) : this.searchInfo.map(mapFun)
          var to = {}
          var buyNowData = []
          temp.forEach(function (goods, i) {
            if (!to[goods.goodsId]) {
              to[goods.goodsId] = 1
              buyNowData.push(i)
            } else {
              to[goods.goodsId] += 1
            }
          })
          return temp.filter(function (goods, i) {
            if (buyNowData.indexOf(i) !== -1) {
              goods.number = to[goods.goodsId]
              return true
            } else {
              return false
            }
          })
        },
        // 立即购买
        handleBuyNow: function () {
          this.demandForm.buyNowData = this.getBuyNowData()
          sessionStorage.setItem('buyNowdemandForm', JSON.stringify(this.demandForm))
          document.location = '/common/servicetrade/order.html'
        },
        // 收藏
        handlePlanInsert: function () {
          var fun = function (goods) {
            return goods.goodsId
          }
          // alert('敬请期待')
          this.planInsert({
            planName: this.demandForm.planName, goodsIds: this.isCustomInfo ? this.collapseCustomInfo.reduce(function (datas, item) {
              return datas.concat(item.children.map(fun))
            }, []) : this.searchInfo.map(fun)
          })
        },
        handleTips: function () {
          this.$dialog.showToast('敬请期待');
        },
        handledemand: function () {
          location = '/common/buyer/demand/add.html?code=001.001.002.002'
        }
      }
    });
  });
});
