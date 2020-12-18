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
              label: '专利列表'
            }
          ],
          options: {
            searchOpts: [
              {
                code: 'search-key', label: '搜索项', operationType: 'area', valueKey: 'searchKey', valueType: 'string', isMore: 0, isOpen: 1, isIndependent: 1, isTop: 0, dictIInfos: [
                  {
                    label: '专利名称',
                    value: 'name',
                    selected: true
                  },
                  {
                    label: '专利类型',
                    value: 'type',
                    selected: true
                  },
                  {
                    label: '专利号',
                    value: 'number',
                    selected: true
                  },
                  {
                    label: '分类号',
                    value: 'class',
                    selected: true
                  },
                  {
                    label: '申请日期',
                    value: 'apply-date',
                    selected: true
                  },
                  {
                    label: '发布日期',
                    value: 'public-date',
                    selected: true
                  },
                  {
                    label: '摘要',
                    value: 'abs',
                    selected: true
                  },
                  {
                    label: '申请人',
                    value: 'applicant',
                    selected: true
                  },
                  {
                    label: '发明人',
                    value: 'inventor',
                    selected: true
                  },
                  {
                    label: '代理人',
                    value: 'agent',
                    selected: true
                  },
                  {
                    label: '代理机构',
                    value: 'agency',
                    selected: true
                  },
                  {
                    label: '申请人所在地',
                    value: 'address',
                    selected: true
                  }
                ]
              },
              {
                code: 'search-value', label: '搜索值', operationType: 'input', valueKey: 'searchValue', valueType: 'string', isMore: 0, isOpen: 1, isIndependent: 1, isTop: 0, dictIInfos: []
              },
              {
                code: 'type', label: '专利类型', operationType: 'select', valueKey: 'type', valueType: 'string', isMore: 0, isOpen: 1, isIndependent: 0, isTop: 0, dictIInfos: [
                  {
                    label: '全部',
                    value: '-1',
                    selected: true
                  },
                  {
                    label: '实用新型',
                    value: '实用新型',
                    selected: false
                  },
                  {
                    label: '外观设计',
                    value: '外观设计',
                    selected: false
                  },
                  {
                    label: '发明专利',
                    value: '发明专利',
                    selected: false
                  }
                ]
              },
              {
                code: 'status', label: '法律状态', operationType: 'select', valueKey: 'status', valueType: 'string', isMore: 0, isOpen: 1, isIndependent: 0, isTop: 0, dictIInfos: [
                  {
                    label: '全部',
                    value: '-1',
                    selected: true
                  },
                  {
                    label: '在审',
                    value: '在审',
                    selected: false
                  },
                  {
                    label: '有效',
                    value: '有效',
                    selected: false
                  },
                  {
                    label: '失效',
                    value: '失效',
                    selected: false
                  }
                ]
              },
              {
                code: 'appDate', label: '申请年份', operationType: 'select', valueKey: 'appDate', valueType: 'string', isMore: 0, isOpen: 1, isIndependent: 0, isTop: 0, dictIInfos: [
                  {
                    label: '全部',
                    value: '-1',
                    selected: true
                  }
                ]
              },
              {
                code: 'pubDate', label: '公开年份', operationType: 'select', valueKey: 'pubDate', valueType: 'string', isMore: 0, isOpen: 1, isIndependent: 0, isTop: 0, dictIInfos: [
                  {
                    label: '全部',
                    value: '-1',
                    selected: true
                  }
                ]
              },
              {
                code: 'area', label: '申请人所在地', operationType: 'select', valueKey: 'area', valueType: 'string', isMore: 0, isOpen: 1, isIndependent: 0, isTop: 0, dictIInfos: []
              },
              {
                code: 'sort', label: '排序', operationType: 'select', valueKey: 'sortWay', valueType: 'string', isMore: 0, isOpen: 1, isIndependent: 0, isTop: 1, dictIInfos: [
                  {
                    label: '申请日',
                    value: 'appDate',
                    selected: true
                  },
                  {
                    label: '公开日',
                    value: 'pubDate',
                    selected: false
                  }
                ]
              }
            ],
            selectOpts: [],
          },
          searchForm: {
            searchValue: '', // 搜索项
            searchKey: 'name', // 搜索值
            type: '', // 专利类型（新型实用、外观专利、发明专利）
            status: '', // 法律状态（在审、有效、失效）
            appDate: '', // 申请年份 （如2015）
            pubDate: '', // 公开年份 （如2015）
            area: '', // 申请人所在地 （如重庆）
            sortWay: '', // 排序方式 默认不传是综合排序、参数值传time根据时间排序
            page: 1,
            limit: 10
          },
          hotKeys: [
            { keyType: 'name', keyName: 'searchValue', keyValue: '应急管理', keyLabel: '应急管理' },
            { keyType: 'name', keyName: 'searchValue', keyValue: '疫情', keyLabel: '疫情' },
            { keyType: 'name', keyName: 'searchValue', keyValue: '知识创新', keyLabel: '知识创新' },
            { keyType: 'name', keyName: 'searchValue', keyValue: '人工智能', keyLabel: '人工智能' }
          ],
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
          title && (this.searchForm.searchValue = title);
          this.saasId = localStorage.getItem('saasId');
          for (var index = 2020;index >= 1980;index--) {
            this.options.searchOpts[4].dictIInfos.push({
              label: index,
              value: index,
              selected: false
            })
            this.options.searchOpts[5].dictIInfos.push({
              label: index,
              value: index,
              selected: false
            })
          }
          this.getList()
          this.getAreaCode()
        },
        methods: {
          getList: function () {
            var vm = this;
            var data = JSON.parse(JSON.stringify(this.searchForm));
            !data.searchValue && (data.searchKey = '');
            indexApi.patentList(data).then(function (res) {
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
                  vm.count ? vm.$pages.show().pagination(vm.getPageOptions()) : vm.$pages.hide()
                }
              }
            })
          },
          getAreaCode: function () {
            var vm = this;
            indexApi.cqAreaCode({}).then(function (res) {
              if (res.code === 200) {
                res.data.unshift({ value: "-1", name: '全部' })

                vm.options.searchOpts[6].dictIInfos = res.data.map(function (item, i) {
                  item.selected = !i
                  item.label = item.name
                  item.value = item.value ? item.value : item.name
                  return item;
                })
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
          handleSetOpenItem: function (i) {
            var oitem = this.options.searchOpts[i]
            oitem.isOpen = oitem.isOpen ? 0 : 1;
            this.options.searchOpts[i] = oitem
          },
          handleSetMoreItem: function (i) {
            var oitem = this.options.searchOpts[i]
            oitem.isMore = oitem.isMore ? 0 : 1;
            this.options.searchOpts[i] = oitem
          },
          handleSetSearchForm: function (e) {
            var dataset = this.getAttributeData(e.target.children.length ? e.target : e.currentTarget, ['ci', 'di', 'pi', 'value']);
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
              this.$pages = this.count ? $('#pagination-container').pagination(this.getPageOptions()) : $('#pagination-container').hide().pagination(this.getPageOptions());
            })
          },
          handleToUrl: function (e) {
            e.preventDefault();
            this.$dialog.showToast('专利传递服务正在升级中，敬请期待！')
          },
          handleSearch: function () {
            this.$data.searchForm.page = 1
            this.getList()
          },
          handleSetHotKey: function (i) {
            var vkey = this.hotKeys[i]
            this.$data.searchForm['searchKey'] = vkey.keyType
            this.$data.searchForm[vkey.keyName] = vkey.keyValue
            this.handleSearch()
          }
        }
      });
    })
});
