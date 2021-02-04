// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/atindex.js', 'httpUrl'],
    function ($, Vue, httpVueLoader, indexApi, httpUrl) {
    new Vue({
      el: '#index_box',
      data: {
        cmsUrl: httpUrl.cmsUrl,
        saasId: '',
        breadcrumb: [
          {
            url: '/aindex.html',
            label: '活动'
          },
          {
            label: '品牌活动'
          }
        ],
        recommendList: [],
        dicOptsSet: [
          { code: 'topic_custom_tag', label: '品牌', operationType: 'select', valueKey: 'topicCustomTag', valueType: 'string', isTop: 0 }
        ],
        options: {
          searchOpts: [],
          selectOpts: [],
        },
        searchForm: {
          pageNum: 1,
          pageSize: 7
        },
        seriesList: [
        ],
        navIndex: 2,
        pages: '',
      },
      filters: {
        formatTime: function (v) {
          return v ? v.split(' ')[0] : ''
        }
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'sub-head': httpVueLoader('/style/components/asub_head.vue'),
        'pages': httpVueLoader('/style/components/pages.vue'),
        'aside-today': httpVueLoader('/style/components/asideToday.vue'),
        'web-footer': httpVueLoader('/style/components/web_footer.vue')
      },
      created: function () {
        var type = this.$utils.getReqStr('type')
        this.searchForm.topicCustomTag = type || ''
        this.saasId = localStorage.getItem('saasId');
        this.getDicList(this.dicOptsSet);
        this.getRecommendList()
        this.getTopicList()
      },
      methods: {
        getDicList: function (keys) {
          var vm = this
          this.$httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              var opts = []
              opts = res.result.map(function (codes, i) {
                var value = vm.searchForm[keys[i].valueKey]
                var dataset = {
                  code: 'topic_custom_tag',
                  di: '',
                  display: '',
                  label: keys[i].label,
                  pi: ''+i,
                  ci: '',
                  value: value
                };
                value && keys[i].valueType === 'array' && (value = value[0]);
                codes.dictIInfos.unshift({ id: "-1", value: -1, display: codes.code === 'policy_file_type' ? '全部政策' : '全部'})
                codes.dictIInfos.forEach(function (dic, di) {
                  if (value) {
                    if (value === dic.value) {
                      dataset.di = '' + di;
                      dataset.display = dic.display
                      dic.selected = true
                    } else {
                      dic.selected = false
                    }
                  } else {
                    dic.selected = !di
                  }
                })
                codes.valueType = keys[i].valueType
                codes.label = keys[i].label
                codes.operationType = keys[i].operationType
                codes.valueKey = keys[i].valueKey
                codes.isTop = keys[i].isTop
                dataset.di && vm.addSelectOpts(dataset)
                return codes
              })
              vm.options.searchOpts = opts;
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
          this.getTopicList()
          this.getRecommendList()
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
          this.getTopicList()
        },
        getRecommendList: function () {
          var vm = this;
          //品牌相关活动
          indexApi.selectRelatedActive({
            topicCustomTag: vm.searchForm.topicCustomTag,
            pageSize: 8
          }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result  && res.result.forEach(function (item) {
                var a = [];
                if (item.onLineFlag === '0') {
                  item.cityShow && a.push(item.cityShow);
                  item.location && a.push(item.location);
                }
                item.cityShow = a.join('');
                item.itemUrl = '/adetail.html?id=' + item.id
              })
              vm.$data.recommendList = res.result || []
            }
          })
          // indexApi.selectIssuePage({pageNum: 1, pageSize: 8, sortType: "02"}).then(function (res) {
          //   if (res.code === 'rest.success') {
          //     res.result && res.result.list && res.result.list.forEach(function (item) {
          //       var a = [];
          //       if (item.onLineFlag === '0') {
          //         item.cityShow && a.push(item.cityShow);
          //         item.location && a.push(item.location);
          //       }
          //       item.cityShow = a.join('');
          //       item.itemUrl = '/adetail.html?id=' + item.id
          //     })
          //     vm.$data.recommendList = res.result && res.result.list || []
          //   }
          // })
        },
        getTopicList: function () {
          var vm = this;
          indexApi.selectPortalPage(this.searchForm).then(function (res) {
            if (res.code === 'rest.success') {
              res.result && res.result.list && res.result.list.forEach(function (item) {
                item.styles = {
                  backgroundImage: 'url(' + item.posterUrl + ')'
                }
                item.activeStartTimeDisplay && item.activeEndTimeDisplay && (item.activeShowTime = item.activeStartTimeDisplay[8] + ' ~ ' + item.activeEndTimeDisplay[8]);
                item.itemImg = item.posterUrl
                item.itemUrl = '/atdetail.html?id='+item.id
              })
              vm.$data.seriesList = res.result && res.result.list || []
              res.result.isview = res.result.navigatepageNums.indexOf(res.result.pages) === -1
              vm.$data.pages = res.result || ''
            }
          })
        },
        bindPageChange: function (e) {
          this.searchForm.pageNum = e
          this.getTopicList()
        }
      }
    });
  })
});
