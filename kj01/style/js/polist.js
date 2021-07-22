// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/polist.js', 'laydate', 'httpUrl'],
    function ($, Vue, httpVueLoader, indexApi, laydate, httpUrl) {
      new Vue({
        el: '#index_box',
        data: {
          cmsUrl: httpUrl.cmsUrl,
          saasId: '',
          breadcrumb: [
            {
              label: '政策资讯',
              url: '/polist.html'
            },
            {
              label: '政策惠'
            }
          ],
          numberCounts: [
            {
              url: '/style/images/poindex/shenbao.png',
              count: 0,
              unit: '条',
              key: 'declarationNotice',
              label: '申报通知'
            },
            {
              url: '/style/images/poindex/jiedu.png',
              count: 0,
              unit: '条',
              key: 'policyInterpretation',
              label: '政策解读'
            },
            {
              url: '/style/images/poindex/minglu.png',
              count: 0,
              unit: '场',
              key: 'publiDirectory',
              label: '公示名录'
            },
            {
              url: '/style/images/poindex/wenjian.png',
              count: 0,
              unit: '次',
              key: 'governmenDocuments',
              label: '政府文件'
            },
            {
              url: '/style/images/poindex/jingyao.png',
              count: 0,
              unit: '次',
              key: 'policyEssentials',
              label: '政策精要'
            }
          ],
          recommendList: [],
          dicOptsSet: [
            { code: 'policy_file_type', label: '文件类型', operationType: 'select', valueKey: 'policyFileType', valueType: 'array' },
            { code: 'policy_level', label: '政策层级', operationType: 'select', valueKey: 'level', valueType: 'string' },
            { code: 'publish_department', label: '归口部门', operationType: 'select', valueKey: 'publishDepartment', valueType: 'array' },
            { code: 'policy_self_tag', label: '特色分类', operationType: 'select', valueKey: 'selfTag', valueType: 'array' },
          ],
          options: {
            searchOpts: [],
            selectOpts: [],
            countryOptions: [{ "id": "0", "value": "100", "display": "中国" }],
            provinceOptions: [],
            cityOptions: [],
            districtpayOptions: []
          },
          searchForm: {
            pageNum: 1,
            pageSize: 10,
            startDate: '',
            endDate: '',
            country: '',
            province: '500000',
            city: '',
            orderBy: 'publishDate-desc',
            district: '',
            title: '',
            analyzingFlag: ''
          },
          pages: '',
          policyList: []
        },
        watch: {
          'searchForm.analyzingFlag': function (v) {
            this.$nextTick(function () {
              var display = this.getInnerHtml()
              this.addSelectOpts({
                code: 'explain',
                label: '解释',
                value: v ? 1 : '-1',
                display: '解读'
              })
            })
          }
        },
        filters: {
          formatTime: function (v) {
            return v ? v.split(' ')[0] : ''
          },
          formatTime1: function (v, t) {
            if (v) {
              v = v.split(' ')[0];
              if(v.indexOf('.')!==-1){
                v = v.split('.')
              }else if(v.indexOf('-')!==-1){
                v = v.split('-')
              }
              v.splice(1, 0, '年')
              v.splice(3, 0, '月')
              v.push('日')
              return t ? ' ~ ' + v.join('') : v.join('')
            } else {
              return ''
            }
          },
        },
        components: {
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'sub-head': httpVueLoader('/style/components/sub-head.vue'),
          'pages': httpVueLoader('/style/components/pages.vue'),
          'number-grow': httpVueLoader('/style/components/number.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue'),
          'right-navs': httpVueLoader('/style/components/right_navs.vue'),
        },
        created: function () {
          this.getNumbers();
          var title = this.$utils.getReqStr('title')
          title && (this.searchForm.title = title);
          var fileType = this.$utils.getReqStr('fileType')
          fileType && (this.searchForm.policyFileType = [fileType]);
          this.saasId = localStorage.getItem('saasId');
          this.initAddressSelectOpts('0', 'provinceOptions', 'cityOptions')
          this.getDicList(this.dicOptsSet);
          this.getPList({
            pageNum: 1,
            pageSize: 8,
            orderBy: 'visitNum-desc'
          }, 'recommendList');
          this.getSearchList()
          this.addSelectOpts({
            code: 'city',
            label: '适用地区',
            value: '重庆',
            display: '重庆'
          })

          this.addSelectOpts({
            code: 'order_by',
            label: '排序',
            value: 'publishDate-desc',
            display: '时间'
          })

        },
        methods: {
          getNumbers: function () {
            var vm = this;
            indexApi.getWebPolicyStatistics({}).then(function (res) {
              res.result && vm.$data.numberCounts.forEach(function (item) {
                item.count = res.result[item.key] || 0
              })
            })
          },
          getInnerHtml: function () {
            var labels = $.map($('.cityCode option:selected'), function (el, index) {
              return el.innerHTML !== '省级' && el.innerHTML !== '市级' && el.innerHTML !== '区级' && el.innerHTML || '';
            })
            return labels.filter(function (i) {
              return i
            }).join(',')
          },
          getDicList: function (keys) {
            var vm = this
            this.$httpCom.dictList({ dictInfos: keys }).then(function (res) {
              if (res.code === 'rest.success') {
                var opts = []
                var applyOpts = {
                  code: 'apply_status',
                  label: '申报状态',
                  operationType: 'select',
                  valueKey: 'applyStatus',
                  valueType: 'string',
                  dictIInfos: [
                    { id: "1231sdf23123", value: -1, display: '全部', selected: true },
                    { id: "1231dfds23", value: '1', display: '正在申报', selected: false },
                    { id: "9d123123", value: '2', display: '已截止', selected: false }
                  ]
                }
                var cityOpts = {
                  code: 'city',
                  label: '适用地区',
                  operationType: 'city',
                  valueKey: '',
                  dictIInfos: [{ id: "-134fff", value: '-1', display: '国家', selected: false }]
                }
                var timeOpts = {
                  code: 'time',
                  label: '发布时间',
                  operationType: 'time',
                  valueKey: ''
                }
                var orderByOpts = {
                  code: 'order_by',
                  label: '排序',
                  operationType: 'switchover',
                  valueKey: 'orderBy',
                  valueType: 'switchover',
                  dictIInfos: [
                    {
                      id: 'order_by_1',
                      values: ['publishDate-desc', 'publishDate-asc'],
                      selectedIndex: 0,
                      selected: true,
                      display: '时间'
                    },
                    {
                      id: 'order_by_3',
                      values: ['visitNum-desc', 'visitNum-asc'],
                      selected: false,
                      selectedIndex: 0,
                      display: '热度'
                    }
                  ]
                }


                opts = res.result.map(function (codes, i) {
                  var value = vm.searchForm[keys[i].valueKey]
                  value && keys[i].valueType === 'array' && (value = value[0]);
                  codes.dictIInfos.forEach(function (dic) {
                    dic.selected = false
                  })

               // //排除7，8 政策精要，平台动态
               //    if (codes.code === 'policy_file_type'){
               //      codes.dictIInfos=codes.dictIInfos.filter(function (s) {
               //        return s.value<=6;
               //      });
               //    }

                  codes.dictIInfos.unshift({ id: "-1", value: -1, display: codes.code === 'policy_file_type' ? '全部政策' : '全部', selected: true })
                  if (value) {
                    codes.dictIInfos.forEach(function (dic) {
                      dic.selected = dic.value === value
                    })
                  }
                  codes.valueType = keys[i].valueType
                  codes.label = keys[i].label
                  codes.operationType = keys[i].operationType
                  codes.valueKey = keys[i].valueKey
                  return codes
                })

                opts.splice(3, 0, applyOpts)
                opts.splice(1, 0, cityOpts)
                opts.push(timeOpts)
                opts.push(orderByOpts)
                vm.options.searchOpts = opts;
                vm.initTime()
              }
            })
          },
          getPList: function (data, dataKey) {
            var vm = this;
            indexApi.selectPolicyByPage(data).then(function (res) {
              res.result && res.result.list && res.result.list.forEach(function (item) {
                var a = [];
                item.countryDisplay && a.push(item.countryDisplay);
                item.provinceDisplay && a.push(item.provinceDisplay);
                item.cityDisplay && item.cityDisplay !== '县' && item.cityDisplay !== '市辖区' && item.cityDisplay !== '市级' && a.push(item.cityDisplay);
                item.districtDisplay && a.push(item.districtDisplay);
                item.address = a.join('');
                item.itemUrl = '/podetail.html?id=' + item.id
                if(dataKey === 'policyList'&&(item.applyStatusDisplay===1||item.applyStatusDisplay===2)){
                    item.endDate='';
                    item.startDate='';
                    if(item.onlineEndDate && item.applyEndDate){
                        item.endDate=new Date(item.onlineEndDate).getTime()<new Date(item.applyEndDate).getTime()?item.onlineEndDate:item.applyEndDate;
                        item.startDate=new Date(item.onlineEndDate).getTime()<new Date(item.applyEndDate).getTime()?item.onlineStartDate:item.applyStartDate;
                    }else{
                      item.endDate=item.applyEndDate||item.onlineEndDate;
                      item.startDate=item.applyStartDate||item.onlineStartDate
                    }
                }
              });
              vm.$data[dataKey] = res.result && res.result.list || []

              if (dataKey === 'policyList') {
                res.result.isview = res.result.navigatepageNums.indexOf(res.result.pages) === -1
                vm.$data.pages = res.result || ''
              }
            })
          },
          getSearchList: function () {
            this.getPList(this.searchForm, 'policyList')
          },
          bindPageChange: function (e) {
            this.$data.searchForm.pageNum = e;
            this.getSearchList()
          },
          getAttributeData: function (el, keys) {
            var dataset = {}
            if (el.dataset) {
              dataset = el.dataset
            } else {
              keys.forEach(function (tkey) {
                dataset[tkey] = el.getAttribute('data-' + tkey);
              })
            }
            return dataset
          },
          initAddressSelectOpts: function (pid, type, next) {
            var vm = this
            indexApi.dictSelect({ code: 'administrative_division', parentId: pid }).then(function (res) {
              if (res.code == 'rest.success') {
                var pid = '0'
                if (type === 'provinceOptions') {
                  res.result.unshift({ id: "-1", value: "", display: "省级", parentId: "0" })
                  pid = res.result[22].id
                } else if (type === 'cityOptions') {
                  res.result.unshift({ id: "-1", value: "", display: "市级", parentId: "0" })
                  pid = res.result[1].id
                } else if (type === 'districtpayOptions') {
                  res.result.unshift({ id: "-1", value: "", display: "区级", parentId: "0" })
                  pid = res.result[1].id
                }
                vm.options[type] = res.result
                if (next !== 'districtpayOptions') {
                  vm.initAddressSelectOpts(pid, next, 'districtpayOptions')
                }
              }
            })
          },
          bindChnageProvince: function () {
            this.changeAddress('cityOptions')
            this.options.searchOpts[1].dictIInfos[0].selected = false
            this.$nextTick(function () {
              var display = this.getInnerHtml()
              this.addSelectOpts({
                code: 'city',
                label: '适用地区',
                value: display ? display : '-1',
                display: display
              })
            })
          },
          bindChnageCity: function () {
            this.changeAddress('districtpayOptions')
            this.options.searchOpts[1].dictIInfos[0].selected = false
            this.$nextTick(function () {
              var display = this.getInnerHtml()
              this.addSelectOpts({
                code: 'city',
                label: '适用地区',
                value: display ? display : '-1',
                display: display
              })
            })
          },
          bindChnageDistrict: function () {
            this.options.searchOpts[1].dictIInfos[0].selected = false
            this.$nextTick(function () {
              var display = this.getInnerHtml()
              this.addSelectOpts({
                code: 'city',
                label: '适用地区',
                value: display ? display : '-1',
                display: display
              })
            })
          },
          initCity: function () {
            this.$data.searchForm.province = ''
            this.$data.searchForm.city = ''
            this.$data.searchForm.district = ''
            this.$data.searchForm.country = ''
            var oitem = this.options.searchOpts[1]
            oitem.dictIInfos.forEach(function (soi, i) {
              soi.selected = true
            })
            this.options.searchOpts[1] = oitem
          },
          changeAddress: function (type) {
            var vm = this
            var pid = 0
            if (type === 'cityOptions') {
              this.options.provinceOptions.some(function (opt) {
                if (opt.value === vm.searchForm.province) {
                  pid = opt.id
                  return true
                }
              })
            } else {
              this.options.cityOptions.some(function (opt) {
                if (opt.value === vm.searchForm.city) {
                  pid = opt.id
                  return true
                }
              })
            }
            pid !== '-1' && indexApi.dictSelect({ code: 'administrative_division', parentId: pid }).then(function (res) {
              if (res.code == 'rest.success') {
                if (type === 'cityOptions') {
                  res.result.unshift({ id: "-1", value: "", display: "市级", parentId: "0" })
                } else if (type === 'districtpayOptions') {
                  res.result.unshift({ id: "-1", value: "", display: "区级", parentId: "0" })
                }
                vm.options[type] = res.result
                if (type === 'cityOptions') {
                  vm.searchForm.city === '' && (vm.searchForm.city = res.result[0].value);
                  vm.changeAddress('districtpayOptions')
                } else {
                  vm.searchForm.district === '' && (vm.searchForm.district = res.result[0].value);
                }
              }
            })
            pid !== '-1' && (vm.options[type] = type === 'cityOptions' ? [{ id: "-1", value: "", display: "市级", parentId: "0" }] : [{ id: "-1", value: "", display: "区级", parentId: "0" }])
          },
          initTime: function () {
            this.$nextTick(function () {
              laydate.render({
                elem: '#stime',
                type: 'date',
                value: '',
                format: 'yyyy-MM-dd',
                startkey: 'startDate',
                endkey: 'endDate',
                vm: this,
                trigger: 'click',
                calendar: true,
                done: function (value, date, endDate) {
                  this.vm.searchForm[this.startkey] = value;
                  this.vm.addSelectOpts({
                    code: 'time',
                    label: '发布时间',
                    display: value + (this.vm.searchForm[this.endDate] ? '-' + this.vm.searchForm[this.endDate] : '')
                  })
                }
              })
              laydate.render({
                elem: '#etime',
                type: 'date',
                value: '',
                format: 'yyyy-MM-dd',
                startkey: 'startDate',
                endkey: 'endDate',
                vm: this,
                trigger: 'click',
                calendar: true,
                done: function (value, date, endDate) {
                  this.vm.searchForm[this.endkey] = value;
                  this.vm.addSelectOpts({
                    code: 'time',
                    label: '发布时间',
                    display: (this.vm.searchForm[this.startkey] ? this.vm.searchForm[this.startkey] + '-' : '') + value
                  })
                }
              })
            })
          },
          handleSetSearchForm: function (e) {
            var dataset = this.getAttributeData(e.target, ['di', 'pi', 'value']);
            var oitem = this.options.searchOpts[dataset.pi]
            var t = oitem.dictIInfos[dataset.di]
            oitem.dictIInfos.forEach(function (soi, i) {
              soi.selected = i == dataset.di
            })
            if (oitem.code !== 'city') {
              if (oitem.code !== 'order_by') {
                this.$data.searchForm[oitem.valueKey] = dataset.value === '-1' ? '' : oitem.valueType === 'array' ? [dataset.value] : dataset.value
              } else {
                this.$data.searchForm[oitem.valueKey] = t.values[t.selectedIndex];
                oitem.dictIInfos[dataset.di].selectedIndex = t.selectedIndex ? 0 : 1
              }
            } else {
              this.$data.searchForm.province = ''
              this.$data.searchForm.city = ''
              this.$data.searchForm.district = ''
              this.$data.searchForm.country = ''
            }
            this.options.searchOpts[dataset.pi] = oitem
            dataset.code = oitem.code
            dataset.label = oitem.label
            dataset.display = t.display
            this.addSelectOpts(dataset)
          },
          addSelectOpts: function (dataset) {
            let flag = -1;
            this.options.selectOpts.some(function (item, i) {
              if (item.code === dataset.code) {
                flag = i;
                return true
              }
            });
            if (dataset.value === '-1') {
              flag !== -1 && this.options.selectOpts.splice(flag, 1)
              dataset.code === 'city' && this.initCity()
            } else {
              flag === -1 ? this.options.selectOpts.push(dataset) : (this.options.selectOpts[flag] = dataset)
            }
            this.$data.searchForm.pageNum = 1
            this.getSearchList()
          },
          handleDelSelectOpt: function (e) {
            var dataset = this.getAttributeData(e.target, ['index']);
            var delOpt = this.options.selectOpts.splice(dataset.index, 1)[0];
            var oitem
            if (delOpt.code !== 'explain') {
              if ('time, city'.indexOf(delOpt.code) === -1) {
                oitem = this.options.searchOpts[delOpt.pi];
                oitem.dictIInfos.forEach(function (soi, i) {
                  soi.selected = !i
                })
                this.options.searchOpts[delOpt.pi] = oitem
                this.$data.searchForm[oitem.valueKey] = ''
              }
              if (delOpt.code === 'time') {
                this.$data.searchForm.startDate = ''
                this.$data.searchForm.endDate = ''
              }
              delOpt.code === 'city' && this.initCity()
            } else {
              this.$data.searchForm.analyzingFlag = 0
            }

            this.$data.searchForm.pageNum = 1
            this.getSearchList()
          },
          bindSearchValue: function (e) {
            this.searchForm.title = e
            this.getSearchList()
            console.log(e)
          },
          handleAnswer: function (e) {
            location.href = '/answer/index.html'
          }
        }
      });
    })
});
