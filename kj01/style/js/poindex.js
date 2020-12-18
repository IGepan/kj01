// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/poindex.js', 'httpUrl'],
    function ($, Vue, httpVueLoader, indexApi, httpUrl) {
      new Vue({
        el: '#index_box',
        data: {
          cmsUrl: httpUrl.cmsUrl,
          saasId: '',
          options: {
            imgopts: [
              '/image/poindex/1.jpg',
              '/image/poindex/2.jpg',
              '/image/poindex/3.jpg'
            ]
          },
          numberCounts: [
            {
              icon: 'icon-zhengce',
              count: 0,
              unit: '条',
              key: 'publishPolicyCount',
              label: '收录政策'
            },
            {
              icon: 'icon-zhengcejiedu1',
              count: 0,
              unit: '条',
              key: 'policyExplainCount',
              label: '政策解读'
            },
            {
              icon: 'icon-activity',
              count: 0,
              unit: '场',
              key: 'policyExplainActiveCount',
              label: '政策活动'
            },
            {
              icon: 'icon-hetong',
              count: 0,
              unit: '次',
              key: 'enterpriseServiceCount',
              label: '政策服务'
            }
          ],
          policyList: [],
          activeHot: '',
          activeHotList: [],
          activeList: [],
          policyaList: [],
          newsList: [],
          ptabsNavs: [],
          tabsNavs: [
            {
              label: '政策精要',
              active: 1,
            },
            {
              label: '解读评论',
              active: 0,
            }
          ],
          viewList: [],
          heads: [
            '/image/head.jpg',
            '/image/head.jpg',
            '/image/head.jpg'
          ],
          helperList: [],
          show: 0,
          policyResList:[]
        },
        filters: {
          formatTime: function (v) {
            return v ? v.split(' ')[0] : ''
          },
          fomatPolicyTitle: function (v) {
            return !v ? '' : v.length < 60 ? v : v.replace(' ', '').substr(0, 50) + '...'
          },
          fomatNewsDesc: function (v) {
            return v ? v.substr(0, 72).replace(' ', '') + '...' : ''
          },
          fomatNewsTime: function (v, t) {
            if (v) {
              v = v.split(' ')[0]
              v = v.split('-')
              v.splice(1, 0, '年')
              v.splice(3, 0, '月')
              v.push('日')
              return t ? ' ~ ' + v.join('') : v.join('')
            } else {
              return ''
            }
          },
        },
        mounted: function () {
        },
        components: {
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'user-heads': httpVueLoader('/style/components/user-heads.vue'),
          'sub-head': httpVueLoader('/style/components/sub-head.vue'),
          'number-grow': httpVueLoader('/style/components/number.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          this.saasId = localStorage.getItem('saasId');
          this.getNumbers()
          this.getPList1('01')
          this.getPList('009', 'policyaList')
          this.getAList('007', 'activeHot')
          this.getcmsList()
          this.getDicList([
            { code: 'policy_file_type' }
          ])
          this.getAssistant()
          this.getPolicyRes()
        },
        methods: {
          getDicList: function (keys) {
            var vm = this
            this.$httpCom.dictList({ dictInfos: keys }).then(function (res) {
              if (res.code === 'rest.success') {
                //排除7，8 政策精要，平台动态
                 var r = res.result[0].dictIInfos.filter(function (s) {
                       return s.value<=6;
                  });
                vm.ptabsNavs = r.map(function (dic, i) {
                    dic.selected = !i
                    dic.itemUrl = '/polist.html?fileType=' + dic.value
                    return dic

                })
              }
            })
          },
          getAList: function (id, dataKey) {
            var vm = this;
            indexApi.selectActiveByPage({
              columnId: id,
              saasId: this.saasId
            }).then(function (res) {
              if (res.code === 'rest.success') {
                if (dataKey === 'activeHot') {
                  if (res.result) {
                    res.result.length && res.result.forEach(function (item, i) {
                      item.poster && (item.styles = {
                        backgroundImage: 'url(' + item.poster.url + ')'
                      }, item.imgUrl = item.poster.url || '')
                      item.itemUrl = '/adetail.html?id=' + item.contentId
                      item.selected = !i
                    });
                    vm.$data['activeHotList'] = res.result.splice(0, 3)
                    vm.$data[dataKey] = vm.$data['activeHotList'][0];
                    vm.$data['viewList'] = vm.$data['activeList'] = res.result || []
                  }
                } else {
                  vm.$data[dataKey] = res.result
                }
              }
            })
          },
          getPList1: function (type) {
            var vm = this;
            indexApi.selectPolicyByPage1({
              pageNum: 1,
              pageSize: 5,
              policyFileType: [type]
            }).then(function (res) {
              if (res.code === 'rest.success') {
                var d = new Date().getTime() - 7 * 24 * 60 * 60 * 1000
                res.result && res.result.list && res.result.list.forEach(function (item, i) {
                  var a = [];
                  item.countryDisplay && a.push(item.countryDisplay);
                  item.provinceDisplay && a.push(item.provinceDisplay);
                  item.cityDisplay && item.cityDisplay !== '县' && item.cityDisplay !== '市辖区' && item.cityDisplay !== '市级' && a.push(item.cityDisplay);
                  item.districtDisplay && a.push(item.districtDisplay);
                  item.address = a.join(' · ');
                  item.itemUrl = '/podetail.html?id=' + item.id
                  item.policyFileType = item.policyFileType && item.policyFileType.split(',')[0];
                  item.policyFileTypeDisplay = item.policyFileTypeDisplay && item.policyFileTypeDisplay[0];
                  item.isNew = d < new Date(item.publishDate).getTime()
                })
                vm.$data.policyList = res.result.list || []
              }
            })
          },
          getPList: function (id, dataKey) {
            var vm = this;
            var imgopts = this.options.imgopts;
            indexApi.selectPolicyByPage({
              columnId: id,
              saasId: this.saasId
            }).then(function (res) {
              if (res.code === 'rest.success') {
                res.result && res.result.forEach(function (item, i) {
                  item.itemUrl = '/podetail.html?id=' + item.contentId
                  item.imgUrl = '' // imgopts[i]
                  item.policyFileType = item.policyFileType && item.policyFileType.split(',')[0];
                  item.policyFileTypeDisplay = item.policyFileTypeDisplay && item.policyFileTypeDisplay[0];
                })
                vm.$data[dataKey] = res.result || []
              }
            })
          },
          getNumbers: function () {
            var vm = this;
            indexApi.getWebPolicyStatistics({}).then(function (res) {
              res.result && vm.$data.numberCounts.forEach(function (item) {
                item.count = res.result[item.key] || 0
              })
            })
          },
          getcmsList: function () {
            var vm = this;
            indexApi.contentList({
              pageNum: 1, pageSize: 4 ,limit:4, policyFileType: ["07"],
              orderBy: "publishDate-desc"
            }).then(function (res) {
              res.result.list && res.result.list.forEach(function (item) {
                item.keyWord = item.keyWord ? item.keyWord.split(',') : [];
                // item.titleImg = res.domain + item.titleImg;

              });
              vm.$data.newsList = res.result.list || []
            })
          },
          //申报助手
          getAssistant: function () {
            var vm = this;
            indexApi.assistantSelectByPage({ pageNum: 1, pageSize: 4 ,limit:3}).then(function (res) {
              if (res.code === 'rest.success') {
                vm.$data.helperList = res.result.list
              }
            })
          },
          //政策答人
          getPolicyRes: function () {
            var vm = this;
            indexApi.policyResSelectByPage({ pageNum: 1, pageSize: 2 ,limit:4}).then(function (res) {
              if (res.code === 'rest.success') {
                vm.$data.policyResList = res.result.list
              }
            })
          },
          handleSetHot: function (i) {
            this.activeHotList.forEach(function (item, ti) {
              item.selected = ti === i
            });
            this.activeHot = this.activeHotList[i]
          },
          handlePTabsNav: function (i) {
            var type = ''
            this.ptabsNavs.forEach(function (item, ti) {
              item.selected = ti === i
              ti === i && (type = item.value)
            })
            this.getPList1(type)
          },
          handleTabsNav: function (i) {
            this.tabsNavs.forEach(function (item, ti) {
              item.active = ti === i
            })
            this.show = i
            // this.viewList = i ? this.policyaList : this.activeList
          },
          handleMoreList: function (e) {
            location.href = '/polist.html'
          },
          handleMoreNewsList: function (e) {
            location.href = this.cmsUrl
            this.show === 0 ? location.href = cmsUrl : location.href = '/polist.html'
          },
          handleMoreHelperList: function (e) {
            location.href = '/declarationHelper/list.html'
          },
          handleAnswer: function (e){
            location.href = '/answer/index.html'
          }
        }
      });
    })
});
