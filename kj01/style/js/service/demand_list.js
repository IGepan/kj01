// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/service.js', '/style/js/libs/pagination.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl'],
    function ($, Vue, dic, httpVueLoader, indexApi, pagination, owlCarousel, httpUrl) {
      new Vue({
        el: '#index_box',
        data: {
          cmsUrl: httpUrl.cmsUrl,
          saasId: '',
          breadcrumb: [
            {
              url: '/service',
              label: '服务'
            },
            {
              label: '企业需求列表'
            }
          ],
          dicOptsSet: [
            { code: 'industry_level1_type', label: '所属行业', operationType: 'select', childIndex: -1, valueKey: 'industryLevel', valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 0 },
            { code: 'demand_type', label: '需求类型', operationType: 'select', childIndex: -1, valueKey: 'demandType', valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 0 },
            { code: 'price', label: '需求价格', operationType: 'select', childIndex: -1, valueKey: 'budget', valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 0 },
            { code: 'time_scope', label: '需求时间', operationType: 'select', childIndex: -1, valueKey: 'timeScope', valueType: 'string', isMoreShow: 0, isMore: 0, isTop: 0 }
          ],
          options: {
            searchOpts: [],
            selectOpts: [],
          },
          searchForm: {
            title: '',
            province: '',
            pageNum: 1,	// 	第几页	是	[string]		查看
            pageSize: 10,	// 	每页显示多少行	是	[string]		查看
            orderBy: 'createTime desc',	// 	排序字段	是	[string]		查看
          },
          provinceDisplay: '所在地区',
          provinceOptions: [],
          selected: false,
          dataList: [],
          count: 0,
          $pages: '',
          recommendList: [],
          hotList: [],
          hotName: '',
          theHerList: [],
          ykrlist: [],
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
          'service-head': httpVueLoader('/style/components/service_head2.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
          var demandType = this.$utils.getReqStr('demandType')
          demandType && (this.searchForm.demandType = demandType)
          this.saasId = localStorage.getItem('saasId');
          var title = this.$utils.getReqStr('title');
          title && (this.searchForm.title = title);
          this.getDicList(this.dicOptsSet);
          this.getProvince()
          this.getGoodsByPage('051', 'theHerList')
          this.getShopByPage('052', 'recommendList')
          this.getList()
          this.getYKRData()
        },
        methods: {
          getDicList: function (keys) {
            var vm = this
            this.$httpCom.dictList({ dictInfos: keys }).then(function (res) {
              if (res.code === 'rest.success') {
                var opts = []
                var sortOpts = {
                  code: 'order_by',
                  label: '排序',
                  operationType: 'switchover',
                  valueKey: 'orderBy',
                  valueType: 'switchover',
                  isTop: 1,
                  isMoreShow: 0,
                  isMore: 0,
                  childIndex: -1,
                  dictIInfos: [
                    {
                      id: 'order_by_1',
                      values: ['createTime desc', 'createTime asc'],
                      selectedIndex: 0,
                      selected: true,
                      display: '综合排序'
                    },
                    {
                      id: 'order_by_3',
                      values: ['createTime desc', 'createTime asc'],
                      selected: false,
                      selectedIndex: 0,
                      display: '发布时间'
                    }
                  ]
                }
                opts = res.result.map(function (codes, i) {
                  var value = vm.searchForm[keys[i].valueKey]
                  codes.dictIInfos.unshift({ id: "-1", value: -1, display: '全部' });
                  codes.dictIInfos.forEach(function (dic, i) {
                    dic.children = []
                    if(value) {
                      dic.selected = value === dic.value
                    } else {
                      dic.selected = !i
                    }
                  })
                  codes.valueType = keys[i].valueType
                  codes.label = keys[i].label
                  codes.operationType = keys[i].operationType
                  codes.isTop = keys[i].isTop
                  codes.valueKey = keys[i].valueKey
                  codes.isMoreShow = keys[i].isMoreShow
                  codes.isMore = keys[i].isMore
                  codes.childIndex = keys[i].childIndex
                  return codes
                });
                opts.unshift(sortOpts)
                vm.options.searchOpts = opts;
              }
            })
          },
          getSetChild: function (pi, di, searchType, value) {
            var vm = this
            var data = {}
            data[searchType ? 'servicesLevel1Type' : 'industryLevel1Type'] = value
            this.$httpCom[searchType ? 'servicesSelect' : 'industrySelect'](data).then(function (res) {
              if (res.code === 'rest.success') {
                res.result.unshift({ id: -1, name: "不限", selected: true })
                res.result.forEach(function (item, i) {
                  item.selected = !i
                  item.value = item.id
                  item.display = item.name
                  item.valueKey = searchType ? 'servicesTypeId' : 'industryTypeId'
                  item.valueType = 'string'
                })
                vm.options.searchOpts[pi].dictIInfos[di].children = res.result
              }
            })
          },
          getProvince: function () {
            var vm = this
            this.$httpCom.dict({ code: 'administrative_division', parentId: 0 }).then(function (res) {
              if (res.code == 'rest.success') {
                let v = vm.searchForm.province
                res.result.unshift({ id: "-1", value: -1, display: "不限", parentId: "0" })
                res.result.forEach(function (item, i) {
                  if (v) {
                    item.selected = v === item.value
                    v === item.value && (vm.provinceDisplay = item.display)
                  } else {
                    item.selected = !i
                  }
                })
                vm.provinceOptions = res.result
              }
            })
          },
          getList: function () {
            var vm = this;
            this.$httpCom['demandByPage'](this.searchForm).then(function (res) {
              if (res.code === 'rest.success') {
                var demandType = vm.searchForm.demandType
                var industry = vm.searchForm['industryLevel']
                var fun = function (item) {
                  item.tagNames && (item.isTagMatched = !!industry, item.tagNames = item.tagNames.split(','));
                  item.itemUrl = '/common/demanddetail.html?id=' + item.id
                  item.isDemandTypeMatched = item.demandType === demandType
                }
                res.result.list.forEach(fun);
                vm.dataList = res.result.list
                if (!vm.$pages) {
                  vm.count = res.result.total || 0
                  vm.setPages()
                } else if (vm.count !== res.result) {
                  vm.count = res.result.total || 0
                  vm.$pages.pagination(vm.getPageOptions())
                }
              } else {
                vm.dataList = []
                vm.count = 0
              }
            })
          },
          getShopByPage: function (columnId, key) {
            var vm = this;
            indexApi.selectShopByPage({
              columnId: columnId
            }).then(function (res) {
              if (res.code === 'rest.success') {
                res.result.forEach(function (item) {
                  item.itemUrl = item.shopIndexUrl
                  item.styles = {
                    backgroundImage: 'url(' + item.shopLogo + ')'
                  }
                  item.itemImg = item.shopLogo
                  item.title = item.shopName
                  item.viewtag = item.userServices
                })
                vm[key] = res.result
              }
            })
          },
          getGoodsByPage: function (columnId, key) {
            var vm = this;
            indexApi.selectGoodsByPage({
              columnId: columnId
            }).then(function (res) {
              if (res.code === 'rest.success') {
                res.result.forEach(function (item) {
                  item.itemUrl = item.detailAddress
                  item.styles = {
                    backgroundImage: 'url(' + item.goodsImgUrl + ')'
                  }
                  item.itemImg = item.goodsImgUrl
                  item.title = item.goodsName
                  item.viewtag = item.serviceName || item.industryName || item.shopName
                })
                vm[key] = res.result
              }
            })
          },
          getYKRData: function () {
            var vm = this;
            indexApi.getykrlist({
              channelType: "WEB",
              mSort: "DESC",
              pageNum: 1,
              pageSize: 3
            }).then(function (res) {
              if (res.code === '20000') {
                res.data.list.forEach(function (item, i) {
                  item.itemUrl = '/yukuairong/detail.html?id=' + item.id
                  item.styles = {
                    backgroundImage: 'url(/image/service/ykr-img-' + i + '.jpg)'
                  }
                  item.itemImg = '/image/service/ykr-img-' + i + '.jpg'
                  item.title = item.name
                  item.viewtag = item.productTypeName
                })
                vm.ykrlist = res.data.list
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
          initTheHer: function () {
            this.$nextTick(function () {
              setTimeout(function () {
                $('#theHer').owlCarousel({
                  items: 1,
                  autoplay: 3000,
                  autoHeight: true,
                  nav: true,
                  loop: true,
                  navText: ['<span class="iconfont icon-fanhui"></span>', '<span class="iconfont icon-gengduokuozhe"></span>'],
                  transitionStyle: 'fade'
                });
              }, 500);
            })
          },
          setHotView: function (v) {
            var list = v === '004' ? this.ykrlist : this.theHerList
            if ((v === '010' || v === '004') && list.length) {
              this.hotList = list
              this.hotName = v === '004' ? '渝快融' : '疯核桃'
              this.initTheHer()
            } else {
              this.hotList = []
              this.hotName = ''
            }
          },
          bindChangeProvince: function (i, v) {
            var vm = this
            this.$set(this, 'provinceOptions', this.provinceOptions.map(function (opt, oi) {
              opt.selected = false
              if (oi === i) {
                opt.selected = true
                vm.searchForm.province = opt.value === -1 ? '' : opt.value
              }
              return opt
            }))
            this.provinceDisplay = v === '不限' ? '所在地区' : v;
            this.getList();
          },
          handleSetMoreItem: function (i) {
            var oitem = this.options.searchOpts[i]
            oitem.isMore = oitem.isMore ? 0 : 1;
            this.options.searchOpts[i] = oitem
          },
          handleSetSearchForm: function (e) {
            var dataset = this.getAttributeData(e.target, ['ci', 'di', 'pi', 'value']);
            var oitem = this.options.searchOpts[dataset.pi]
            var vm = this;
            var t = oitem.dictIInfos[dataset.di]
            var ct;
            oitem.dictIInfos.forEach(function (soi, i) {
              soi.selected = i == dataset.di
              // 修正其他选项
              soi.children && soi.children.length && soi.children.forEach(function (child, ci) {
                child.selected = !ci
              })
              soi.children && !soi.children.length && soi.value !== -1 && (oitem.code === 'services_level1_type' || oitem.code === 'industry_level1_type') && vm.getSetChild(dataset.pi, '' + i, oitem.code === 'services_level1_type', soi.value)
              // 子选项选择
              soi.children && soi.children.length && dataset.ci && i == dataset.di && soi.children.forEach(function (child, ci) {
                child.selected = ci == dataset.ci
              })
            })
            oitem.childIndex = dataset.di
            this.options.searchOpts[dataset.pi] = oitem
            dataset.code = oitem.code
            dataset.label = oitem.label
            if (dataset.ci) {
              ct = t.children[dataset.ci]
              dataset.display = t.display + ' · ' + ct.display
              // 修正子选项值
              if (dataset.ci && dataset.value === '-1') {
                // dataset.value = t.value
                dataset.display = t.display
              }
            } else {
              dataset.display = t.display
            }
            if (oitem.operationType !== 'switchover') {
              // 时间筛选特殊处理
              oitem.code === 'time_type' && (this.$data.searchForm['activeStartTimeFrom'] = '', this.$data.searchForm['activeStartTimeTo'] = '', $('#stime').val(''), $('#etime').val(''));
              if (ct && ct.valueKey) {
                this.$data.searchForm[ct.valueKey] = dataset.value === '-1' ? '' : ct.valueType === 'array' ? [dataset.value] : dataset.value
                this.$data.searchForm[ct.valueKey + 'Name'] = ct.display
              } else {
                this.$data.searchForm[oitem.valueKey] = dataset.value === '-1' ? '' : oitem.valueType === 'array' ? [dataset.value] : dataset.value
                  if(!t.children.length){
                      let key=oitem.code === 'services_level1_type'? 'servicesTypeId' : 'industryTypeId';
                      this.$data.searchForm[key]='';
                      this.$data.searchForm[key + 'Name'] = ''
                  }
                  // 清理子选项的值
                if (t.children.length && t.children[0].valueKey) {
                  ct = t.children[0]
                  this.$data.searchForm[ct.valueKey] = ''
                  this.$data.searchForm[ct.valueKey + 'Name'] = ''
                }
              }
            } else {
              t.selectedIndex = t.selectedIndex ? 0 : 1
              this.$data.searchForm[oitem.valueKey] = t.values[t.selectedIndex];
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
            dataset.code === 'services_level1_type' && this.setHotView(dataset.value)
            this.$data.searchForm.pageNum = 1
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
              // 修正其他选项
              soi.children && soi.children.length && soi.children.forEach(function (child, ci) {
                child.selected = !ci
              })
              soi.children && soi.children.length && (soi.children[1].valueKey, vm.$data.searchForm[soi.children[1].valueKey] = '')
            });
            oitem.childIndex = -1;
            this.options.searchOpts[delOpt.pi] = oitem;
            this.$data.searchForm[oitem.valueKey] = '';
            // 时间筛选特殊处理
            oitem.code === 'time_type' && (this.$data.searchForm['activeStartTimeFrom'] = '', this.$data.searchForm['activeStartTimeTo'] = '', $('#stime').val(''), $('#etime').val(''));
            this.$data.searchForm.pageNum = 1;
            this.getList()
          },
          getPageOptions: function () {
            var vm = this
            var sources = function () {
              var result = [];
              var count = vm.count
              for (var i = 1;i < count;i++) {
                result.push(i);
              }
              return result;
            }();
            return {
              dataSource: sources,
              totalNumber: this.count,
              pageNumber: this.searchForm.pageNum,
              pageSize: this.searchForm.pageSize,
              pageRange: 3,
              prevText: '上一页',
              nextText: '下一页',
              callback: function (data, pagination) {
                if (vm.$data.searchForm.pageNum !== pagination.pageNumber) {
                  vm.$data.searchForm.pageNum = pagination.pageNumber
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
            this.$data.searchForm.pageNum = 1
            this.getList()
          },
          bindChangeSearchTitle: function (e) {
            this.$data.searchForm.title = e
            this.$data.searchForm.pageNum = 1
            this.getList()
          },
          handleOnLineConsult: function (i) {
            var data = this.dataList[i]
            if (data.userId) {
              this.$root.$chat_im.connect(data.userId);
            }
          }
        }
      });
    })
});
