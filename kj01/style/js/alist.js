// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/aindex.js', 'laydate', 'httpUrl'],
    function ($, Vue, httpVueLoader, indexApi, laydate, httpUrl) {
      new Vue({
        el: '#index_box',
        data: {
          saasId: '',
          breadcrumb: [
            {
              url: '/aindex.html',
              label: '活动'
            },
            {
              label: '活动列表'
            }
          ],
          dicOptsSet: [
            { code: 'sort_type', label: '排序方式', operationType: 'select', valueKey: 'sortType', valueType: 'string', isTop: 1 },
            { code: 'time_type', label: '活动时间', operationType: 'select', valueKey: 'timeType', valueType: 'string', isTop: 0 },
            { code: 'yes_no', label: '线上活动', operationType: 'select', valueKey: 'onLineFlag', valueType: 'string', isTop: 0 },
            { code: 'active_status', group: 'wx', label: '活动状态', operationType: 'select', valueKey: 'status', valueType: 'string', isTop: 0 },
          ],
          searchtitle: '',
          options: {
            searchOpts: [],
            selectOpts: [],
            navIndexOpts: {
              '218340665862391473': 1,
              '218340665912723126': 3
            }
          },
          navIndex: 0,
          dataList: [],
          searchForm: {
            pageNum: 1,
            pageSize: 12,
            onLineFlag: '', // 是否线上活动(字典表：yes_no)
            timeType: '', // 时间范围(字典表:time_type)
            sortType: '01', // 排序方式(字典表:sort_type)
            activeNowTime: '', // 查询指定某天正在开展中活动
            activeStartTimeFrom: '',
            activeStartTimeTo: '',
            status: '', // 活动状态(字典表：active_status)
            activeType: '', // 活动类型
            title: '', //
            orderBy: ''
          },
          pages: {}
        },
        filters: {
          formatTime: function (v) {
            return v ? v.split(' ')[0] : ''
          },
          formatTime1: function (v) {
            var t;
            if (v) {
              t = new Date(v);
              v = v.substr(0, 16) + [' 周日', ' 周一', ' 周二', ' 周三', ' 周四', ' 周五', ' 周六'][t.getDay()]
            }
            return v || '';
          },
          formatSponsor: function (v) {

          },
          formatCity: function (v, c) {
            return c && v ? v + '·' + c : v ? v : ''
          }
        },
        components: {
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'sub-head': httpVueLoader('/style/components/asub_head.vue'),
          'pages': httpVueLoader('/style/components/pages.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          this.initData()
        },
        methods: {
          initData: function () {
            this.saasId = localStorage.getItem('saasId');
            var type = this.$utils.getReqStr('type')
            var title = this.$utils.getReqStr('title')
            this.searchtitle = this.searchForm.title = title || ''
            this.searchForm.activeType = type || ''
            type && (this.navIndex = this.options.navIndexOpts[type]);
            this.getDicList(this.dicOptsSet);
            this.getDataList();
            this.addSelectOpts(
              {
                code: "sort_type",
                di: "2",
                display: "默认排序",
                label: "排序方式",
                pi: "1",
                value: "01"
              }
            )
          },
          getDataList: function () {
            var vm = this;
            // selectIssuePage
            indexApi.selectIssuePage(this.searchForm).then(function (res) {
              res.result && res.result.list.forEach(function (item) {
                item.itemUrl = '/adetail.html?id=' + item.id
                item.styles = {
                  backgroundImage: 'url(' + item.posterUrl + ')'
                }
                item.sponsor = item.sponsor ? item.sponsor.split('ぶんかつ')[0] : ''
                if (Array.isArray(item.activeTypeDisplay) && item.activeTypeDisplay.length) {
                  item.activeTypeDisplay = item.activeTypeDisplay[0].name
                } else {
                  item.activeTypeDisplay = ''
                }
                item.itemImg = item.posterUrl
              });
              vm.dataList = res.result ? res.result.list : []
              vm.pages = res.result
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
          bindPageChange: function (e) {
            this.$data.searchForm.pageNum = e;
            this.getDataList()
          },
          getDicList: function (keys) {
            var vm = this
            this.$httpCom.dictList({ dictInfos: keys }).then(function (res) {
              if (res.code === 'rest.success') {
                var opts = []
                var activeTypeOpts = {
                  code: 'active_type',
                  label: '活动类型',
                  operationType: 'select',
                  isTop: 0,
                  valueKey: 'activeType',
                  valueType: 'string',
                  selecedIndex: -1,
                  dictIInfos: []
                }
                indexApi.getTree([
                  {
                    type: '11'
                  }
                ]).then(function (res) {
                  if (res.code === 'rest.success') {
                    var activeType = vm.searchForm.activeType;
                    var dataset = {
                      code: 'active_type',
                      di: '',
                      display: '',
                      label: "活动类型",
                      pi: "0",
                      ci: '',
                      value: "03"
                    };
                    var selecedIndex = -1
                    res.result[0].unshift({ id: "-1", id: -1, name: '全部', selected: true })

                    res.result[0].forEach(function (item, i) {
                      item.value = item.id
                      item.display = item.name
                      if (activeType) {
                        if (activeType === item.id) {
                          dataset.di = '' + i;
                          dataset.display = item.name
                          item.selected = true
                          selecedIndex = '' + i
                        } else {
                          item.selected = false
                        }
                      } else {
                        item.selected = !i
                      }
                      if (item.children) {
                        //排除政策直播间
                        item.children=item.children.filter(function (s) {
                          return s.id!='218340665870780082';
                        });
                        item.children.unshift({ id: "-1", id: -1, name: '不限', selected: true })
                        item.children.forEach(function (sitem, si) {
                          sitem.value = sitem.id
                          sitem.display = sitem.name
                          if (activeType && selecedIndex === -1) {
                            if (activeType === sitem.id) {
                              dataset.di = '' + i;
                              dataset.ci = '' + si
                              dataset.display = item.name + '·' + sitem.name
                              selecedIndex = '' + i
                              item.selected = true
                              sitem.selected = true
                            } else {
                              sitem.selected = false
                            }
                          } else {
                            sitem.selected = !si
                          }
                        })
                      }
                    })
                    activeTypeOpts.selecedIndex = selecedIndex
                    activeTypeOpts.dictIInfos = res.result[0]
                    vm.options.searchOpts = opts;
                    dataset.di && vm.addSelectOpts(dataset)
                    vm.initTime()
                  }
                });
                opts = res.result.map(function (codes, i) {
                  codes.dictIInfos.forEach(function (dic) {
                    dic.selected = false
                  })
                  codes.code !== 'sort_type' ? codes.dictIInfos.unshift({ id: "-1", value: -1, display: '全部', selected: true }) : (codes.dictIInfos[0].selected = true);
                  codes.valueType = keys[i].valueType
                  codes.label = keys[i].label
                  codes.operationType = keys[i].operationType
                  codes.isTop = keys[i].isTop
                  codes.valueKey = keys[i].valueKey
                  codes.selecedIndex = -1
                  return codes
                });
                opts.unshift(activeTypeOpts)
              }
            })
          },
          initTime: function () {
            this.$nextTick(function () {
              laydate.render({
                elem: '#stime',
                type: 'date',
                value: '',
                format: 'yyyy-MM-dd',
                startkey: 'activeStartTimeFrom',
                endkey: 'activeStartTimeTo',
                vm: this,
                trigger: 'click',
                calendar: true,
                done: function (value, date, endDate) {
                  this.vm.searchForm[this.startkey] = value;
                  this.vm.$data.searchForm['timeType'] = ''
                  this.vm.options.searchOpts[2].dictIInfos.forEach(function (item, i) {
                    item.selected = !i;
                  })
                  this.vm.addSelectOpts({
                    code: 'time_type',
                    pi: '2',
                    label: '发布时间',
                    value: value ? value : '-1',
                    type: 'activeNowTime',
                    display: value + (this.vm.searchForm[this.endkey] ? '-' + this.vm.searchForm[this.endkey] : '')
                  })
                }
              })
              laydate.render({
                elem: '#etime',
                type: 'date',
                value: '',
                format: 'yyyy-MM-dd',
                startkey: 'activeStartTimeFrom',
                endkey: 'activeStartTimeTo',
                vm: this,
                trigger: 'click',
                calendar: true,
                done: function (value, date, endDate) {
                  this.vm.searchForm[this.endkey] = value;
                  this.vm.$data.searchForm['timeType'] = ''
                  this.vm.options.searchOpts[2].dictIInfos.forEach(function (item, i) {
                    item.selected = !i;
                  })
                  this.vm.addSelectOpts({
                    code: 'time_type',
                    pi: '2',
                    label: '发布时间',
                    value: value ? value : '-1',
                    type: 'activeNowTime',
                    display: (this.vm.searchForm[this.startkey] ? this.vm.searchForm[this.startkey] + '-' : '') + value
                  })
                }
              })
            })
          },
          handleSetSearchForm: function (e) {
            var dataset = this.getAttributeData(e.target, ['ci', 'di', 'pi', 'value']);
            var oitem = this.options.searchOpts[dataset.pi]
            oitem.dictIInfos.forEach(function (soi, i) {
              soi.selected = i == dataset.di
              // 修正其他选项
              soi.children && soi.children.forEach(function (child, ci) {
                child.selected = !ci
              })
              // 子选项选择
              dataset.ci && i == dataset.di && soi.children.forEach(function (child, ci) {
                child.selected = ci == dataset.ci
              })
            })
            oitem.selecedIndex = dataset.di
            this.options.searchOpts[dataset.pi] = oitem
            dataset.code = oitem.code
            dataset.label = oitem.label
            if (dataset.ci) {
              dataset.display = oitem.dictIInfos[dataset.di].display + '·' + oitem.dictIInfos[dataset.di].children[dataset.ci].display
              // 修正子选项值
              if (dataset.ci && dataset.value === '-1') {
                dataset.value = oitem.dictIInfos[dataset.di].value
                dataset.display = oitem.dictIInfos[dataset.di].display
              }
            } else {
              dataset.display = oitem.dictIInfos[dataset.di].display
            }
            // 时间筛选特殊处理
            oitem.code === 'time_type' && (this.$data.searchForm['activeStartTimeFrom'] = '', this.$data.searchForm['activeStartTimeTo'] = '', $('#stime').val(''), $('#etime').val(''));
            this.$data.searchForm[oitem.valueKey] = dataset.value === '-1' ? '' : oitem.valueType === 'array' ? [dataset.value] : dataset.value
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
            this.$data.searchForm.pageNum = 1
            this.getDataList()
          },
          handleDelSelectOpt: function (e) {
            var dataset = this.getAttributeData(e.target, ['index']);
            var delOpt = this.options.selectOpts.splice(dataset.index, 1)[0];
            var oitem;
            oitem = this.options.searchOpts[delOpt.pi];
            oitem.dictIInfos.forEach(function (soi, i) {
              soi.selected = !i
              // 修正其他选项
              soi.children && soi.children.forEach(function (child, ci) {
                child.selected = !ci
              })
            });
            oitem.selecedIndex = -1;
            this.options.searchOpts[delOpt.pi] = oitem;
            this.$data.searchForm[oitem.valueKey] = '';
            // 时间筛选特殊处理
            oitem.code === 'time_type' && (this.$data.searchForm['activeStartTimeFrom'] = '', this.$data.searchForm['activeStartTimeTo'] = '', $('#stime').val(''), $('#etime').val(''));
            this.$data.searchForm.pageNum = 1;
            this.getDataList()
          },
          bindSearchValue: function (e) {
            this.searchForm.title = e
            this.getDataList()
            console.log(e)
          }
        }
      });
    })
});
