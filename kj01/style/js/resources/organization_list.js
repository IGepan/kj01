// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/resources.js', '/style/js/libs/pagination.js', 'httpUrl'],
    function ($, Vue, dic, httpVueLoader, indexApi, pagination, httpUrl) {
      new Vue({
        el: '#index_box',
        data: {
          cmsUrl: httpUrl.cmsUrl,
          saasId: '',
          breadcrumb: [
            {
              url: '/resources',
              label: '资源'
            },
            {
              label: '研发机构'
            }
          ],
          options: {
            searchOpts: [
              {
                code: 'area', label: '省份地区', operationType: 'area', valueKey: 'area', valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 0, dictIInfos: [
                  {
                    label: '重庆市',
                    value: '重庆市',
                    code: '重庆市',
                    selected: true
                  }
                ]
              },
              { code: 'orgType', label: '机构类型', operationType: 'select', valueKey: 'orgType', valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 0, dictIInfos: [] },
              { code: 'industry', label: '服务行业', operationType: 'select', valueKey: 'serviceIndustry', valueType: 'string', isMoreShow: 1, isMore: 0, isTop: 0, dictIInfos: [] },
              {
                code: 'sort', label: '排序', operationType: 'select', valueKey: 'sortWay', valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 1, dictIInfos: [
                  {
                    label: '综合排序',
                    value: '-1',
                    selected: true
                  },
                  {
                    label: '最新',
                    value: 'time',
                    selected: false
                  }
                ]
              }
            ],
            selectOpts: [],
          },
          searchForm: {
            searchWords: '', // 在结果中搜索关键词。首页搜索框也用此参数
            serviceIndustry: '', // 服务行业，直接传cqresearchbase/ getTypes接口返回的服务行业名称
            orgType: '', // 机构类型，直接传cqresearchbase/getTypes接口返回的机构类别名称
            area: '重庆市', // 地区行政区划代码
            sortWay: '', // 排序方式 默认不传是综合排序、参数值传time根据时间排序
            page: 1,
            limit: 10
          },
          selected: false,
          dataList: [],
          count: 0,
          $pages: '',
        },
        filters: {
          formatTime: function (v) {
            if (v) {
              v = v.split(' ')[0]
              v = v.split('-')
              v.splice(1, 0, '年')
              v.splice(3, 0, '月')
              v.push('日')
              return v.join('')
            } else {
              return ''
            }
          },
          firstWord: function (v) {
            return v ? v.substr(0, 1) : ''
          }
        },
        mounted: function () {
        },
        components: {
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'sources-head': httpVueLoader('/style/components/sources_head.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
          var title = this.$utils.getReqStr('title');
          title && (this.searchForm.searchWords = title);
          var orgType = this.$utils.getReqStr('orgType');
          orgType && (this.searchForm.orgType = orgType);
          this.saasId = localStorage.getItem('saasId');
          this.getList()
          this.getIndustryTypes()
          // this.getAreaCode()
          this.addSelectOpts({
            code: "area",
            display: "重庆市",
            label: "省份地区",
            pi: "0"
          })
        },
        methods: {
          getIndustryTypes: function () {
            var vm = this;
            indexApi.getTypes({}).then(function (res) {
              if (res.code === 200) {
                var orgType = vm.searchForm.orgType
                var proitem = ''
                var di = ''
                res.data.orgType.unshift({ id: "-1", baseType: '全部' })
                res.data.serviceType.unshift({ id: "-1", serviceIndustry: '全部' })
                vm.options.searchOpts[1].dictIInfos = res.data.orgType.map(function (item, i) {
                  if (orgType) {
                    item.selected = orgType === item.baseType
                    orgType === item.baseType && (proitem = item, di = i)
                  } else {
                    item.selected = !i
                  }
                  item.label = item.baseType
                  item.value = item.id ? item.id : item.baseType
                  return item;
                })
                orgType && proitem && vm.addSelectOpts({
                  code: "orgType",
                  display: proitem.baseType,
                  label: "机构类型",
                  pi: "1",
                  di: di
                });
                vm.options.searchOpts[2].dictIInfos = res.data.serviceType.map(function (item, i) {
                  item.selected = !i
                  item.label = item.serviceIndustry
                  item.value = item.id ? item.id : item.serviceIndustry
                  return item;
                })
              }
            })
          },
          getAreaCode: function () {
            var vm = this;
            indexApi.cqAreaCode({}).then(function (res) {
              if (res.code === 200) {
                vm.options.searchOpts[0].dictIInfos = res.data.map(function (item, i) {
                  item.selected = !i
                  item.label = item.name
                  item.value = item.name
                  item.code = item.name
                  return item;
                })
              }
            })
          },
          getList: function () {
            var vm = this;
            indexApi.cqresearchbaseList(this.searchForm).then(function (res) {
              if (res.code === 200) {
                res.data && res.data.forEach(function (item) {
                  item.styles = item.imgUrl ? {
                    backgroundImage: 'url(' + httpUrl.companyApi + '/yzw/api/' + item.imgUrl + ')'
                  } : {};
                  item.itemImg = item.imgUrl ? httpUrl.companyApi + '/yzw/api/' + item.imgUrl : ''
                  item['itemUrl'] = '/resources/organization_detail.html?id=' + item.itemCode
                });
                vm.dataList = res.data
                if (!vm.$pages) {
                  vm.count = res.count || 0
                  vm.setPages()
                } else if (vm.count !== res.count) {
                  vm.count = res.count || 0
                  vm.$pages.pagination(vm.getPageOptions())
                }
              }
            })
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
          getIndex: function (_currentFocus, elArray) {
            var ItemList = Array.prototype.slice.call(elArray);
            return ItemList.indexOf(_currentFocus);
          },
          handleSetMoreItem: function (i) {
            var oitem = this.options.searchOpts[i]
            oitem.isMore = oitem.isMore ? 0 : 1;
            this.options.searchOpts[i] = oitem
          },
          handleSetSearchForm: function (e) {
            var dataset = this.getAttributeData(e.target, ['ci', 'di', 'pi', 'value']);
            var oitem = this.options.searchOpts[dataset.pi]
            var vitem = ''
            var vm = this
            if (dataset.di !== '-1') {
              vitem = dataset.di ? oitem.dictIInfos[dataset.di] : oitem.dictIInfos[e.target.selectedIndex]
              oitem.dictIInfos.forEach(function (soi, i) {
                soi.selected = i == dataset.di
              })
              oitem.selecedIndex = dataset.di
              this.options.searchOpts[dataset.pi] = oitem
              dataset.code = oitem.code
              dataset.label = oitem.label
              if (dataset.ci) {
                dataset.display = vitem.label + '·' + vitem.children[dataset.ci].label
              } else {
                dataset.display = vitem.label
              }
              if (Array.isArray(oitem.valueKey)) {
                oitem.valueKey.forEach(function (key) {
                  vm.$data.searchForm[key] = vitem.value[key] === '-1' ? '' : vitem.value[key]
                })
              } else {
                this.$data.searchForm[oitem.valueKey] = vitem.value === '-1' ? '' : oitem.valueType === 'array' ? [vitem.value] : vitem.value
              }
              if (oitem.code === 'area') {
                this.selected = false
              }
            } else {
              dataset.code = oitem.code
              dataset.label = oitem.label
              this.$data.searchForm[oitem.valueKey] = ''
              this.selected = true
            }
            oitem.code !== 'sort' && this.addSelectOpts(dataset)
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
              this.options.selectOpts.splice(flag, 1)
            } else {
              flag === -1 ? this.options.selectOpts.push(dataset) : (this.options.selectOpts[flag] = dataset)
            }
            this.$data.searchForm.page = 1
            this.getList()
          },
          handleDelSelectOpt: function (e) {
            var dataset = this.getAttributeData(e.target, ['index']);
            var delOpt = this.options.selectOpts.splice(dataset.index, 1)[0];
            var vm = this;
            var oitem;
            oitem = this.options.searchOpts[delOpt.pi];
            oitem.dictIInfos.forEach(function (soi, i) {
              soi.selected = !i
            });
            oitem.selecedIndex = -1;
            this.options.searchOpts[delOpt.pi] = oitem;
            if (Array.isArray(oitem.valueKey)) {
              oitem.valueKey.forEach(function (key) {
                vm.$data.searchForm[key] = ''
              })
            } else {
              this.$data.searchForm[oitem.valueKey] = '';
            }
            this.$data.searchForm.page = 1;
            this.getList()
          },
          getPageOptions: function () {
            var vm = this
            var sources = function () {
              var result = [];
              var count = vm.count > 100 ? 100 : vm.count
              for (var i = 1;i < count;i++) {
                result.push(i);
              }
              return result;
            }();
            return {
              dataSource: sources,
              totalNumber: this.count,
              pageNumber: this.searchForm.page,
              pageSize: this.searchForm.limit,
              pageRange: 3,
              prevText: '上一页',
              nextText: '下一页',
              callback: function (data, pagination) {
                if (vm.$data.searchForm.page !== pagination.pageNumber) {
                  vm.$data.searchForm.page = pagination.pageNumber
                  vm.getList()
                }
              }
            }
          },
          setPages: function () {
            this.$nextTick(function () {
              this.$pages = $('#pagination-container').pagination(this.getPageOptions());
            })
          },
          handleSearch: function () {
            this.$data.searchForm.page = 1
            this.getList()
          }
        }
      });
    })
});
