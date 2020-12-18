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
              label: '优选企业'
            }
          ],
          options: {
            searchOpts: [
              { code: 'area', label: '省份地区', operationType: 'area', valueKey: ['areaCode', 'areaLevel'], valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 0, dictIInfos: [] },
              {
                code: 'registered', label: '注册资本', operationType: 'select', valueKey: ['registeredMin', 'registeredMax'], valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 0, dictIInfos: [
                  {
                    label: '全部',
                    value: { registeredMin: '-1', registeredMax: '-1' },
                    selected: true
                  },
                  {
                    label: '0-100万',
                    value: { registeredMin: '0', registeredMax: '100' },
                    selected: false
                  },
                  {
                    label: '100-200万',
                    value: { registeredMin: '100', registeredMax: '200' },
                    selected: false
                  },
                  {
                    label: '200-500万',
                    value: { registeredMin: '200', registeredMax: '500' },
                    selected: false
                  },
                  {
                    label: '500-1000万',
                    value: { registeredMin: '500', registeredMax: '1000' },
                    selected: false
                  },
                  {
                    label: '1000万以上',
                    value: { registeredMin: '1000', registeredMax: '' },
                    selected: false
                  }
                ]
              },
              { code: 'industry', label: '行业门类', operationType: 'select', valueKey: 'industryId', valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 0, dictIInfos: [] },
              {
                code: 'tags', label: '企业标签', operationType: 'select', valueKey: 'tags', valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 0, dictIInfos: [
                  {
                    label: '全部',
                    value: '-1',
                    selected: true
                  },
                  {
                    label: '高新技术企业',
                    value: 'highTechFirm',
                    selected: false
                  },
                  {
                    label: '国家级科技型企业',
                    value: 'middleMinFirm',
                    selected: false
                  },
                  {
                    label: '市级科技型企业',
                    value: 'cqMiddleMinFirm',
                    selected: false
                  },
                  {
                    label: '牛羚',
                    value: 'gnuFirm',
                    selected: false
                  },
                  {
                    label: '瞪羚',
                    value: 'gazelleFirm',
                    selected: false
                  },
                  {
                    label: '独角兽',
                    value: 'uniconFirm',
                    selected: false
                  },
                  {
                    label: '新型研发机构',
                    value: 'newResearchOrg',
                    selected: false
                  },
                  {
                    label: '新型高端研发机构',
                    value: 'newHighResearchOrg',
                    selected: false
                  }
                ]
              },
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
            tags: '', // 企业标签 复选查询逗号隔开，传值示例：tags=middleMinFirm,gnuFirm 高新技术企业：highTechFirm；国家级科技型企业：middleMinFirm；市级科技型企业：cqMiddleMinFirm；牛羚：gnuFirm；瞪羚：gazelleFirm；独角兽：uniconFirm；新研机构：newResearchOrg；新型高端：newHighResearchOrg；
            registeredMin: '', // 注册资本 最小
            industryId: '', // 行业门类 复选查询逗号隔开
            registeredMax: '', // 注册资本 最大
            areaCode: '500000', // 地区行政区划代码
            areaLevel: '1', // 地区级别
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
          var tags = this.$utils.getReqStr('tags');
          var tName, ti;
          tags && (this.searchForm.tags = tags, this.options.searchOpts[3].dictIInfos.forEach(function (item, i) {
            if (item.value === tags) {
              item.selected = true
              tName = item.label
              ti = i
            } else {
              item.selected = false
            }
          }), this.addSelectOpts({
            code: "tags",
            display: tName,
            label: "企业标签",
            pi: "3",
            di: ti
          }));
          this.saasId = localStorage.getItem('saasId');
          this.getList()
          this.getIndustryTypes()
          this.getAreaCode()
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
            indexApi.industryListType({}).then(function (res) {
              if (res.code === 200) {
                res.data.unshift({ id: "-1", name: '全部' })
                vm.options.searchOpts[2].dictIInfos = res.data.map(function (item, i) {
                  item.selected = !i
                  item.label = item.name
                  item.value = item.id
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
                  item.value = {
                    'areaCode': item.code,
                    'areaLevel': item.level
                  }
                  return item;
                })
              }
            })
          },
          getList: function () {
            var vm = this;
            indexApi.enterprisecqList(this.searchForm).then(function (res) {
              if (res.code === 200) {
                res.data && res.data.forEach(function (item) {
                  item['label'] = item.highTechFirm ? '高新技术企业' : item.uniconFirm ? '独角兽' : item.gazelleFirm ? '瞪羚' : item.gnuFirm ? '牛羚' : item.newHighResearchOrg ? '新型高端研发机构' : item.newResearchOrg ? '新型研发机构' : item.middleMinFirm ? '国家级科技型企业' : item.cqMiddleMinFirm ? '市级科技型企业' : ''
                  item['itemUrl'] = '/resources/enterprise_detail.html?id=' + item.id
                });
                vm.dataList = res.data || []
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
              oitem.valueKey.forEach(function (key) {
                vm.$data.searchForm[key] = ''
              })
              this.selected = true
            }
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
