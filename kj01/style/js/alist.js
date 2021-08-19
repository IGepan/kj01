// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/aindex.js', 'laydate', 'httpUrl'],
      function ($, Vue, httpVueLoader, indexApi, laydate, httpUrl) {
        new Vue({
          el: '#index_box',
          data: {
            saasId: '',
            breadcrumb: [
              // {
              //   url: '/aindex.html',
              //   label: '活动'
              // },
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
            numberCounts: [
              {
                url: '/style/images/aindex/huod.png',
                count: 0,
                unit: '场',
                key: 'activeNum',
                label: '活动场次'
              },
              {
                url: '/style/images/aindex/fuwu.png',
                count: 0,
                unit: '次',
                key: 'serverNum',
                label: '服务人次'
              },
              {
                url: '/style/images/aindex/qiye.png',
                count: 0,
                unit: '家',
                key: 'orgServerNum',
                label: '服务企业'
              },
              // {
              //   icon: 'icon-duijie',
              //   count: 0,
              //   unit: '次',
              //   key: 'signNum',
              //   label: '活动对接'
              // }
            ],
            searchtitle:{
              type: String,
              default: ''
            },
            searchValue: '',
            options: {
              searchOpts: [],
              selectOpts: [],
              navIndexOpts: {
                '218340665862391473': 1,
                '218340665912723126':2,
                '235442740417007107':3,
                '390092837996355585':4
              }
            },
            Aindex:'',
            navIndex: 0,
            dataList: [],
            New:[],
            newList:[],
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
              activeIndex: '',// 活动索引
              activeCIndex:'',//子集索引
              topicCustomTag:'',
              title: '', //
              orderBy: ''
            },
            isActive:false,
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
            'number-grow': httpVueLoader('/style/components/number.vue'),
            'pages': httpVueLoader('/style/components/pages.vue'),
            'web-footer': httpVueLoader('/style/components/web_footer.vue')
          },
          created: function () {
            this.initData();
            this.getNumbers();
            // this.getNewList()
            this.searchtitle && (this.searchValue = this.searchtitle)
          },
          methods: {
            handleSearch: function () {
              if (location.pathname === '/alist.html') {
                this.$emit('search', this.searchValue)
              } else {
                location.href = '/alist.html?title=' + this.searchValue
              }
            },

            initData: function () {
              console.log('init data')
              var vm = this
              this.saasId = localStorage.getItem('saasId');
              var type = this.$utils.getReqStr('type')
              var title = this.$utils.getReqStr('title')
              this.searchtitle = this.searchForm.title = title || ''
              this.searchForm.activeType = type || ''
              type && (this.navIndex = this.options.navIndexOpts[type]);
              this.getDicList(this.dicOptsSet);
              if(this.searchForm.activeType == '390092837996355585'){
                this.searchForm.activeIndex === '3'
              }
              this.getDataList(function(){
                // 首次进入页面，展开二级导航
                $('.searchkeys span').eq(vm.searchForm.activeIndex).trigger('click')
              });
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
            getNumbers: function () {
              var vm = this;
              indexApi.getActiveStatistics({}).then(function (res) {
                res.result && vm.$data.numberCounts.forEach(function(item) {
                  item.count = res.result[item.key] || 0
                })
              })
            },
            getDataList: function (call) {
              var vm = this;
              if (this.searchForm.activeIndex === '3') {
                this.isActive = true//隐藏默认排序
                //品牌活动
                var searchForm = this.searchForm
                // 检查二级是否点击 topicCustomTag
                try {
                  for(let item of vm.options.searchOpts[0].dictIInfos[3].children){
                    item.selected ? searchForm.topicCustomTag = item.value:''
                  }
                }catch (e){}
                // selectPortalPage品牌活动接口
                indexApi.selectPortalPage(searchForm).then(function (res) {
                  if (res.code === 'rest.success') {
                    res.result && res.result.list && res.result.list.forEach(function (item) {
                      item.styles = {
                        backgroundImage: 'url(' + item.posterUrl + ')'
                      }
                      if (Array.isArray(item.activeTypeDisplay) && item.activeTypeDisplay.length) {
                        item.activeTypeDisplay = item.activeTypeDisplay[0].name
                      } else {
                        item.activeTypeDisplay = item.tagName
                      }
                      item.activeStartTimeDisplay && item.activeEndTimeDisplay && (item.activeShowTime = item.activeStartTimeDisplay[8] + ' ~ ' + item.activeEndTimeDisplay[8]);
                      item.itemImg = item.posterUrl
                      item.itemUrl = '/atdetail.html?id='+item.id
                    })
                    vm.dataList = res.result && res.result.list || []
                    vm.pages = res.result || ''
                    res.result.isview = res.result.navigatepageNums.indexOf(res.result.pages) === -1

                  }
                  // 执行回调
                  if(typeof call === 'function') call()
                })
              }
              else {
                this.isActive = false
                //其他类型数据接口
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
                  // 执行回调
                  if(typeof call === 'function') call()
                })
              }
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

              console.log(dataset)
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
                      type: '11'//企业学堂等活动类型
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
                        item.display = item.name?item.name:item.objName
                        if (activeType) {
                          if (activeType === item.id) {
                            dataset.di = '' + i;
                            dataset.display = item.name?item.name:item.objName
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
                          // item.children=item.children.filter(function (s) {
                          //   return s.id!='218340665870780082';
                          // });
                          item.children.unshift({ id: "-1", id: -1, name: '不限', selected: true })
                          item.children.forEach(function (sitem, si) {
                            sitem.value = sitem.id
                            sitem.display = sitem.name?sitem.name:sitem.objName
                            if (activeType && selecedIndex === -1) {
                              if (activeType === sitem.id) {
                                dataset.di = '' + i;
                                dataset.ci = '' + si
                                dataset.display = (item.name?item.name:item.objName) + '·' + (sitem.name?sitem.name:sitem.objName)
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
              var vm = this
              var dataset = this.getAttributeData(e.target, ['ci', 'di', 'pi', 'value','name']);
              var oitem = this.options.searchOpts[dataset.pi]
              console.log(e,oitem,'e')
              // 设置活动名称
              this.searchForm.activeTypeDisplay = dataset.name || 'null'
              this.searchForm.activeIndex = dataset.di
              this.searchForm.activeCIndex =dataset.ci //品牌活动子集
              if (this.searchForm.activeTypeDisplay === '品牌活动') {
                //品牌活动加入子集类型
                indexApi.selectActive({
                  dictInfos:[
                    {
                      code:"topic_custom_tag",
                      isTop:0,
                      label:"品牌",
                      operationType:"select",
                      valueKey:"topicCustomTag",
                      valueType:"string"
                    }]}).then(function (res) {
                  if (res.code === 'rest.success') {
                    //子集加入不限
                    var list = [{"id":-1,id: -1,"name":"不限","selected":true,"display":"不限"}]
                    vm.options.searchOpts[0].dictIInfos[3].children = list.concat(res.result[0].dictIInfos || [])

                  }
                })
              }
              // 判断当前父级是哪一个分类
              setTimeout(function(){
                var isbrand = $('.searchkeys').eq(0).find('.active').data('name') == '品牌活动'
                vm.options.searchOpts.forEach((item, idx) => {
                  if(idx != 0) vm.$set(item,'disabled', isbrand)//品牌活动禁用其他筛选
                })
                // 还原其他选项
                if(isbrand){
                  vm.options.searchOpts.forEach(function (soi, i){
                    console.log(soi.dictIInfos)
                    if(i!=0) {
                      soi.dictIInfos.forEach(function (dit,idx){
                        dit.selected = idx == 0
                      })
                    }
                  })
                  console.log(vm.options.selectOpts,'vm.options.selectOpts')
                  let list = []
                  for(let item of vm.options.selectOpts) {
                    if(item.display=='默认排序' || item.display.indexOf('品牌活动') > -1) list.push(item)
                  }
                  vm.options.selectOpts = list
                }
              },100)


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
              // console.log(oitem.dictIInfos)
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
              this.addSelectOpts(dataset,e)
            },
            addSelectOpts: function (dataset,e) {
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
              var vm = this
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
              // 如果清空的是品牌活动，则解除筛选限制
              if(dataset.name.indexOf('品牌活动') > -1) {
                this.options.searchOpts.forEach((item, idx) => {
                  if (idx != 0) this.$set(item, 'disabled', false)
                })
                //还原初始状态
                this.searchForm.activeTypeDisplay = '全部'
                this.searchForm.activeIndex = '0'
              }
              this.getDataList()
            },
            bindSearchValue: function (e) {
              this.searchForm.title = e
              this.getDataList()
            }
          }
        });
      })
});
