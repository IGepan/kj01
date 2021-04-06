// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/libs/pagination.js', 'httpUrl'],
    function ($, Vue, dic, httpVueLoader, pagination, httpUrl) {
      new Vue({
        el: '#index_box',
        data: {
          cmsUrl: httpUrl.cmsUrl,
          saasId: '',
          options: {
            searchOpts: [
              {
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
                    id: 'order_by_4',
                    values: ['publishDate-desc', 'publishDate-asc'],
                    selected: true,
                    isView: true,
                    selectedIndex: 0,
                    display: '发布时间'
                  },
                  {
                    id: 'order_by_2',
                    values: ['visitNum-desc', 'visitNum-asc'],
                    selectedIndex: 0,
                    selected: false,
                    display: '热度'
                  }
                ]
              }
            ],
            selectOpts: [],
            dictTypeInfos: [
              {
                id: 'select_type_1',
                value: 'policy',
                selected: true,
                display: '政策'
              },
              {
                id: 'select_type_2',
                value: 'activity',
                selected: false,
                display: '活动'
              },
              {
                id: 'select_type_3',
                value: 'searchList',
                selected: false,
                display: '易智商城'
              },
              {
                id: 'select_type_4',
                value: 'shopByPage',
                selected: false,
                display: '服务机构'
              },
              {
                id: 'select_type_5',
                value: 'searchList',
                selected: false,
                display: '技术成果'
              },
              {
                id: 'select_type_6',
                value: 'demandByPage',
                selected: false,
                display: '企业需求'
              },
              {
                id: 'select_type_7',
                value: 'contentList',
                selected: false,
                display: '科技资讯'
              },
              {
                id: 'select_type_8',
                value: '',
                selected: false,
                display: '科技资源'
              }
            ]
          },
          searchForm: {
            title: '',
            goodsName: '',
            shopName: '',
            status: '',
            demandStatus: '',
            pageNum: 1,	// 	第几页	是	[string]		查看
            pageSize: 10,	// 	每页显示多少行	是	[string]		查看
            channelIds: 115, // CMS条件
            isApi: true, // CMS条件
            channelOption: 0, // CMS条件
            format: 0, // CMS条件
            orderBy: 'publishDate-desc',	// 	排序字段	是	[string]		查看
          },
          typeValue: {
            fun: 'policy',
            index: 0
          },
          dataList: [],
          count: 0,
          $pages: '',
          hotKeys: [
            { keyType: 'name', keyName: 'searchValue', selected: false, keyValue: '疫情政策', keyLabel: '疫情政策' },
            { keyType: 'name', keyName: 'searchValue', selected: false, keyValue: '减税降费', keyLabel: '减税降费' },
            { keyType: 'name', keyName: 'searchValue', selected: false, keyValue: '技术创新', keyLabel: '技术创新' },
            { keyType: 'name', keyName: 'searchValue', selected: false, keyValue: '成果转化', keyLabel: '成果转化' },
            { keyType: 'name', keyName: 'searchValue', selected: false, keyValue: '资金扶持', keyLabel: '资金扶持' },
            { keyType: 'name', keyName: 'searchValue', selected: false, keyValue: '知识产权', keyLabel: '知识产权' }
          ]
        },
        filters: {
          // formatPrice: function (v, n, m) {
          //   return typeof v !== 'undefined' ? v : n + '-' + m
          // },
          formatTime1: function (v, t) {
            if (v) {
              v = v.split(' ')[0]
              v = v.split('.')
              v.splice(1, 0, '年')
              v.splice(3, 0, '月')
              v.push('日')
              return t ? ' ~ ' + v.join('') : v.join('')
            } else {
              return ''
            }
          }
        },
        watch: {
          'searchForm.status': function (v) {
            this.typeValue.fun === 'activity' && this.handleSearch();
          },
          'searchForm.demandStatus': function (v) {
            this.typeValue.fun === 'demandByPage' && this.handleSearch();
          },
        },
        mounted: function () {
        },
        components: {
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
          this.saasId = localStorage.getItem('saasId');
          var title = this.$utils.getReqStr('title');
          title && (this.searchForm.title = title);
          this.handleSearch()
        },
        methods: {
          getList: function () {
            var vm = this;
            var fun = this.typeValue.fun
            var index = this.typeValue.index
            var data = JSON.parse(JSON.stringify(this.searchForm))
            this.$httpCom[fun](data).then(function (res) {
              if (res.code === 'rest.success' || res.code === '200') {
                var fun = function (item) {
                  var locationShow = []
                  var imgUrl = item.goodsImg && item.goodsImg.url || item.posterUrl || item.shopLogo
                  item.typeIndex = index
                  item.styles = imgUrl ? {
                    backgroundImage: 'url(' + imgUrl + ')'
                  } : {};
                  item.title = item.title || item.goodsName || item.shopName
                  item.itemImg = imgUrl ? imgUrl : ''
                  item.provinceDisplay && locationShow.push(item.provinceDisplay);
                  if (item.cityDisplay && item.cityDisplay !== '县' && item.cityDisplay !== '市辖区') {
                    locationShow.push(item.cityDisplay)
                  } else {
                    item.districtDisplay && locationShow.push(item.districtDisplay)
                  }
                  !item.cityShow && (item.cityShow = item.shopProvinceDisplay || locationShow.join(' · '))
                  item.shopStyles = item.shopLogoUrl ? {
                    backgroundImage: 'url(' + item.shopLogoUrl + ')'
                  } : {};
                  item.shopItemImg = item.shopLogoUrl ? item.shopLogoUrl : ''
                  item.evaluateResult = item.evaluateResult ? parseFloat(item.evaluateResult).toFixed(1) : 0
                  item.evaluateResult && (item.evaluateStyle = {
                    width: Math.floor(item.evaluateResult / 5 * 100) + '%'
                  })
                  item.sponsor && (item.sponsor = item.sponsor.split('ぶんかつ')[0])
                  item.quan = item.innovationVouchersList && item.innovationVouchersList.length
                  if (Array.isArray(item.activeTypeDisplay) && item.activeTypeDisplay.length) {
                    item.activeTypeDisplay = item.activeTypeDisplay[0].name
                  } else {
                    item.activeTypeDisplay = ''
                  }
                  item.industryNames && (item.industryNames = item.industryNames.split(','));
                  item.servicesNames && (item.servicesNames = item.servicesNames.split(','));
                  switch (index) {
                    case 0:
                      item.itemUrl = '/podetail.html?id=' + item.id
                      break;
                    case 1:
                      item.itemUrl = '/adetail.html?id=' + item.id
                      break;
                    case 3:
                      item.itemUrl = item.shopIndexUrl
                      break;
                    case 2:
                    case 4:
                      item.itemUrl = item.goodsDetailUrl
                      break;
                    case 5:
                      item.itemUrl = '/common/demanddetail.html?id=' + item.id
                      break;
                    case 6:
                      item.itemUrl = item.url
                      break;
                  }
                }
                index !== 6 ? res.result.list.forEach(fun) : res.body.forEach(fun);
                vm.dataList = index !== 6 ? res.result.list : res.body
                if (!vm.$pages) {
                  vm.count = res.totalCount || res.result.total || 0
                  vm.setPages()
                } else if (vm.count !== res.result) {
                  vm.count = res.totalCount || res.result.total || 0
                  vm.$pages.pagination(vm.getPageOptions())
                }
              } else {
                vm.dataList = []
                vm.count = 0
              }
            })
          },
          handleSetMoreItem: function (i) {
            var oitem = this.options.searchOpts[i]
            oitem.isMore = oitem.isMore ? 0 : 1;
            this.options.searchOpts[i] = oitem
          },
          changeSetType: function (index) {

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
          handleSetSearchForm: function (e) {
            var dataset = this.getAttributeData(e.currentTarget, ['ci', 'di', 'pi', 'value']);
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
              soi.children && !soi.children.length && soi.value !== -1 && (oitem.code === 'services_level1_type_kj01' || oitem.code === 'industry_level1_type') && vm.getSetChild(dataset.pi, '' + i, oitem.code === 'services_level1_type_kj01', soi.value)
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
                dataset.value = t.value
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
            oitem.valueKey === 'servicesLevel' && this.setHotView(dataset.value)
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
            this.$data.searchForm.goodsName = this.searchForm.title
            this.$data.searchForm.shopName = this.searchForm.title
            this.$data.searchForm.pageNum = 1
            this.getList()
          },
          handleOnLineConsult: function (i) {
            var data = this.dataList[i]
            if (data.userId) {
              this.$root.$chat_im.connect(data.userId);
            }
          },
          handleSetSearchType: function (ki) {
            var vm = this
            var dictIInfos =[
              {
                id: 'order_by_4',
                values: ['publishDate-desc', 'publishDate-asc'],
                selected: false,
                selectedIndex: 0,
                display: '发布时间'
              },
              {
                id: 'order_by_1',
                values: ['sort asc,activeStartTime desc', 'activeStartTime asc'],
                selected: false,
                selectedIndex: 0,
                display: '活动时间'
              },
              {
                id: 'order_by_3',
                values: ['createTime desc', 'createTime asc'],
                selected: false,
                selectedIndex: 0,
                display: '发布时间'
              },
              {
                id: 'order_by_2',
                values: ['salesVolume desc', 'salesVolume asc'],
                selectedIndex: 0,
                selected: false,
                display: '热度'
              },
              {
                id: 'order_by_5',
                values: ['visitNum-desc', 'visitNum-asc'],
                selectedIndex: 0,
                selected: false,
                display: '热度'
              },
              {
                id: 'order_by_6',
                values: ['visitNumber desc', 'visitNumber asc'],
                selectedIndex: 0,
                selected: false,
                display: '热度'
              },
              {
                id: 'order_by_7',
                values: ['4', '5'],
                selectedIndex: 0,
                selected: false,
                display: '发布时间'
              }
            ]
            var indexs = [[0, 4], [1, 5], [2, 3], [3], [2, 3], [2],[6], []]
            this.options.dictTypeInfos.forEach(function (item, i) {
              item.selected = ki === i;
              ki === i && (vm.typeValue.fun = item.value, vm.typeValue.index = ki);
            })
            this.options.searchOpts[0].dictIInfos = dictIInfos.filter(function (item, i) {
              return indexs[ki].indexOf(i) !== -1
            });
            7 > ki && (this.options.searchOpts[0].dictIInfos[0].selected = true);
            switch (ki) {
              case 0:
                this.searchForm.orderBy = 'publishDate-desc'
                this.searchForm.categoryCode = ''
                break;
              case 1:
                this.searchForm.orderBy = 'sort asc,activeStartTime desc'
                this.searchForm.categoryCode = ''
                break;
              case 3:
                this.searchForm.categoryCode = ''
                this.searchForm.orderBy = 'salesVolume desc'
                break;
              case 2:
              case 4:
              case 5:
                this.searchForm.categoryCode = ki === 5 ? '' : ki === 4 ? '001,010' : '009'
                this.searchForm.orderBy = 'createTime desc'
                break;
              case 6:
                this.searchForm.orderBy = '4'
                this.searchForm.categoryCode = ''
                break;
              default:
			          location.href = '/resources/'
                break;
            }

            this.searchForm.demandStatus = ''
            this.searchForm.status = ''
            this.handleSearch();
          },
          handleEnshrine: function (flag, id, i) {
            var vm = this
            typeof vm.dataList[i].collectCount === 'string' && (vm.dataList[i].collectCount = parseInt(vm.dataList[i].collectCount))
            if (!flag) {
              this.$httpCom.selected({
                storeId: id,
                type: '01'
              }).then(function (res) {
                if (res.code === 'rest.success') {
                  vm.dataList[i].collectFlag = !flag
                  vm.dataList[i].collectCount += 1
                  vm.$dialog.showToast("收藏成功")
                }
              })
            } else {
              this.$httpCom.cancel({ goodsId: id }).then(function (res) {
                if (res.code === 'rest.success') {
                  vm.dataList[i].collectFlag = !flag
                  vm.dataList[i].collectCount -= 1
                  vm.$dialog.showToast("取消成功")
                }
              })
            }
          },
          handleSetSearchKey: function (ki) {
            var hotkey = this.hotKeys[ki]
			      this.searchForm.title = hotkey.keyValue
            this.handleSearch();
          }
        }
      });
    })
});
