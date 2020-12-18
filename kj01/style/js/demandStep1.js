// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpCom', 'jqValidate', 'dialog'], function ($, Vue, dic, httpVueLoader, httpCom, jqValidate, dialog) {
    Vue.component('ly-searchbox', httpVueLoader('/style/components/searchbox.vue'))
    window.vueDom = new Vue({
      el: '#index_box',
      data: {
        jquery: $,
        options: {},
        dialogVisible: false,
        demandForm: {
          industry: [],
          planName: '',
          budget: '',
          period: '',
          sceneId: '',
          contents: [],
          servicesTags: []
        },
        queryData: {
          sceneId: '',
          vauleId: []
        },
        searchInfo: {},
        selectedServices: [],
        // type 可选值 [01 单选 02 多选] 标准码 diagnosis_column_type
        // customItemFlag 项目类别(1是自定义项目 0是通用项目))
        customForm: [],
        httpCom: httpCom
      },
      watch: {
      },
      computed: {
        sumServers: function () {
          return this.searchInfo.servicesField1ViewList ? this.searchInfo.servicesField1ViewList.reduce(function (sum, item) {
            return sum + item.servicesField2ViewList.reduce(function (ssum, sitem) {
              return ssum + sitem.servicesField3ViewList.length;
            }, 0)
          }, 0) : 0
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
      },
      methods: {
        // 初始化数据
        initData () {
          // 获取上一步数据 或者 修改数据
          var demandData = null
          demandData = sessionStorage.getItem('step1demandForm') || sessionStorage.getItem('update2DemandForm')
          sessionStorage.removeItem('step1demandForm')
          sessionStorage.removeItem('update2DemandForm')
          if (demandData) {
            demandData = JSON.parse(demandData)
            !demandData.contents && (demandData.contents = [])
            this.demandForm = demandData
            this.queryData.sceneId = demandData.sceneId
            if (demandData.customForm) {
              this.selectedServices = demandData.selectedServices
              this.customForm = demandData.customForm
              this.searchInfo = demandData.searchInfo
            } else {
              this.getOption('diagnosis_column_type')
              this.getSelectItemList()
              this.getSelectByScene()
            }
          } else {
            document.location = '/demand.html'
            return
          }
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
                codes.dictIInfos.unshift({ id: "-1", value: -1, display: "不限", selected: true })
                vm.options[codes.code] = codes.dictIInfos
              })
            }
          })
        },
        // 获取自定义表单
        getSelectItemList: function () {
          var vm = this
          httpCom.selectItemList({ sceneId: this.demandForm.sceneId }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result = res.result.map(function (column) {
                column.columnValue = column.type === '02' ? [] : ''
                return column
              })
              vm.customForm = res.result
            }
          })
        },
        // 获取场景
        getSelectByScene: function () {
          var vm = this
          httpCom.selectByScene(this.queryData).then(function (res) {
            if (res.code === 'rest.success') {
              vm.selectedServices = []
              if (res.result.servicesField1ViewList) {
                res.result.servicesField1ViewList.forEach(function (servicesField1, level1) {
                  servicesField1.servicesField2ViewList.forEach(function (servicesField2, level2) {
                    servicesField2.servicesField3ViewList.forEach(function (services, level3) {
                      services.selected = true
                      vm.selectedServices.push([level1, level2, level3])
                    })
                  })
                })
              } else {
                res.result = {
                  minPrice: 0,
                  servicesField1ViewList: []
                }
              }
              vm.$set(vm, 'searchInfo', res.result)
            }
          })
        },
        // 处理单选选中后的二次点击取消选中
        customChangeValue: function (ci, vi) {
          var column = this.customForm[ci]
          var columnV = this.customForm[ci].valueViewList[vi]
          column.type === '01' && column.columnValue === columnV.vauleId && (this.customForm[ci].columnValue = '')
        },
        // 精准匹配
        setCustomParams: function () {
          var params = []
          var contents = []
          var temp
          var display
          params = this.customForm.reduce(function (params, custom) {
            display = ''
            if (custom.columnValue) {
              temp = JSON.parse(JSON.stringify(custom, function (k, v) {
                return k === 'type' || k === 'valueViewList' ? undefined : v
              }))
              if (custom.columnType === '1') {
                custom.type === '01' && params.push(custom.columnValue)
                custom.type === '02' && (params = params.concat(custom.columnValue))
                temp.columnValue = custom.valueViewList.reduce(function (vals, val) {
                  custom.columnValue.indexOf(val.vauleId) !== -1 && (vals = vals.concat(val.value))
                  return vals
                }, []).join(',')
              }
              contents.push(temp)
            }
            return params
          }, [])
          this.demandForm.contents = contents
          this.queryData.vauleId = params
          this.getSelectByScene()
          this.dialogVisible = false
        },
        // 选择服务项目
        selectItem: function (i, si, ti) {
          var opt = this.searchInfo.servicesField1ViewList[i].servicesField2ViewList[si].servicesField3ViewList[ti]
          var vm = this
          if (opt.selected) {
            var tvalue = '' + i + si + ti;
            this.selectedServices.some(function (value, i) {
              if (value.join('') === tvalue) {
                vm.selectedServices.splice(i, 1)
              }
            })
          } else {
            this.selectedServices.push([i, si, ti])
          }
          opt.selected = !opt.selected
          this.$set(this.searchInfo.servicesField1ViewList[i].servicesField2ViewList[si].servicesField3ViewList, ti, opt)
        },
        // 获取数据
        getSelectedServices: function () {
          var vm = this
          var servicesTags = []
          var queryIds = {}
          this.selectedServices.forEach(function (indexs) {
            var one = vm.searchInfo.servicesField1ViewList[indexs[0]]
            var tow = one.servicesField2ViewList[indexs[1]]
            var selected = tow.servicesField3ViewList[indexs[2]]
            var qservice = {
              servicesLevel: one.servicesLevel1Type,
              servicesTypeId: tow.serviceType2Id,
              servicesId: selected.serviceId
            }
            servicesTags.push({ tagId: selected.serviceId, tagType: '02', name: selected.serviceName })
            queryIds[selected.serviceId] = {
              qIds: [],
              qservice: qservice
            }
          })
          return {
            servicesTags: servicesTags,
            queryIds: queryIds
          }
        },
        handleUpdate: function () {
          var info = {}
          info.industry = this.demandForm.industry
          info.planName = this.demandForm.planName
          info.budget = this.demandForm.budget
          info.period = this.demandForm.period
          info.sceneId = this.demandForm.sceneId
          sessionStorage.setItem('update1DemandForm', JSON.stringify(info))
          document.location = '/demand.html'
        },
        // 进入下一步处理
        submit: function () {
          var vm = this
          var services
          if (this.selectedServices.length) {
            services = this.getSelectedServices()
            vm.demandForm.servicesTags = services.servicesTags
            vm.demandForm.queryIds = services.queryIds
            vm.demandForm.selectedServices = this.selectedServices
            vm.demandForm.customForm = this.customForm
            vm.demandForm.searchInfo = this.searchInfo
            sessionStorage.setItem('step2demandForm', JSON.stringify(vm.demandForm))
            document.location = '/demand-step3.html'
          } else {
            vm.$dialog.showToast('请至少选择一项服务!');
          }
        }
      }
    });
  });
});
