// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/aindex.js', '/style/js/api/atindex.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl'],
    function ($, dic, Vue, httpVueLoader, indexApi, indexApit, owlCarousel, httpUrl) {
    new Vue({
      el: '#index_box',
      data: {
        saasId: '',
        options: {},
        numberCounts: [
          {
            icon: 'icon-activity',
            count: 0,
            unit: '场',
            key: 'activeNum',
            label: '活动场次'
          },
          {
            icon: 'icon-jingjiren',
            count: 0,
            unit: '次',
            key: 'serverNum',
            label: '服务人次'
          },
          {
            icon: 'icon-jigou',
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
        hotActivtyList: [],
        activtyList: [],
        activtyList1: [],
        topicList: [],
        excellenceUserList: [],
        monthlyFocusList: [],
        topicSearchForm: {
          pageNum: 1,
          pageSize: 2,
          topicCustomTag: ''
        },
        activtySearchForm: {
          pageNum: 1,
          pageSize: 3,
          orderBy: 'sort asc,activeStartTime desc',
          activeType: ''
        },
        tabNavs0: [],
        tabNavs1: [],
        tabNavs2: [],
        currentUserPage: 1,
        userMaxPages: 0
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
        },
        fomatPolicyDesc: function (v) {
          return v ? v.substr(0, 92).replace(' ', '') + '...' : ''
        },
        fomatNewsDesc: function (v) {
          return v ? v.substr(0, 72).replace(' ', '') + '...' : ''
        }
      },
      mounted: function () {
        $(function(){
          $('#hotImgBox').owlCarousel({
            items: 1,
            autoplay: 3000,
            loop: true,
            autoplayHoverPause: true,
            autoHeight: true,
            transitionStyle: 'fade'
          });
        });
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'user-heads': httpVueLoader('/style/components/user-heads.vue'),
        'sub-head': httpVueLoader('/style/components/asub_head.vue'),
        'number-grow': httpVueLoader('/style/components/number.vue'),
        'web-footer': httpVueLoader('/style/components/web_footer.vue')
      },
      created: function () {
        this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
        this.saasId = localStorage.getItem('saasId');

        this.getDicList([
            { code: 'topic_custom_tag'},
          ]);
        this.getNumbers();
        this.getActivtyList('hotActivtyList')
        this.getExcellenceUserList();
        this.getMonthlyFocusList();
      },
      methods: {
        getNumbers: function () {
          var vm = this;
          indexApi.getActiveStatistics({}).then(function (res) {
            res.result && vm.$data.numberCounts.forEach(function(item) {
              item.count = res.result[item.key] || 0
            })
          })
        },
        getActivtyList: function (key) {
          var vm = this;
          this.activtySearchForm.pageSize = key === 'activtyList' ? '4' : '3'
          indexApi.selectIssuePage(this.activtySearchForm).then(function (res) {
            res.result && res.result.list.forEach(function (item) {
              //政策直播间单独提出来
              if(item.activeType === '218340665870780082'){
                item.itemUrl = '/livedetail.html?id=' + item.id
              }else{
                item.itemUrl = '/adetail.html?id=' + item.id
              }

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
            vm[key] = res.result ? res.result.list : []
            key === 'hotActivtyList' && vm.inithot()
          })
        },
        inithot: function () {
          $(function () {
            $('#hotActivtyList').owlCarousel({
              items: 1,
              autoplay: 3000,
              loop: true,
              autoplayHoverPause: true,
              autoHeight: true,
              transitionStyle: 'fade'
            });
          });
        },
        getTopicList: function () {
          var vm = this;
          indexApit.selectPortalPage(this.topicSearchForm).then(function (res) {
            if (res.code === 'rest.success') {
              res.result && res.result.list && res.result.list.forEach(function (item) {
                item.styles = {
                  backgroundImage: 'url(' + item.posterUrl + ')'
                }
                item.sponsor = item.sponsor ? item.sponsor.split('ぶんかつ')[0] : ''
                item.activeStartTimeDisplay && item.activeEndTimeDisplay && (item.activeShowTime = item.activeStartTimeDisplay[8] + ' ~ ' + item.activeEndTimeDisplay[8]);
                item.itemImg = item.posterUrl
                item.itemUrl = '/atdetail.html?id=' + item.id
              })
              vm.topicList = res.result && res.result.list || []
            }
          })
        },
        getExcellenceUserList: function () {
          var vm = this;
          indexApi.selectExcellentSponsor({
            pageNum: this.currentUserPage,
            pageSize: 4
          }).then(function (res) {
            res.result && res.result.list.forEach(function(item){
              item.itemUrl = '#' // '/adetail.html?id' + item.id
              item.styles = {
                backgroundImage: 'url(' + item.header + ')'
              }
              item.itemImg = item.header
            });
            vm.excellenceUserList = res.result ? res.result.list : []
            vm.userMaxPages = res.result.pages
          })
        },
        getMonthlyFocusList: function () {
          var vm = this;
          indexApi.selectPopularity({
            pageNum: 1,
            pageSize: 3
          }).then(function (res) {
            res.result && res.result.list.forEach(function(item){
              item.itemUrl = '/adetail.html?id=' + item.id
            });
            vm.monthlyFocusList = res.result ? res.result.list : []
          })
        },
        getDicList: function (keys) {
          var vm = this
          this.$httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              var opts = []
              indexApi.getTree([
                {
                  type: '11'
                }
              ]).then(function (res) {
                if (res.code === 'rest.success') {
                  res.result[0].forEach(function (item, i) {
                    if (item.children) {
                      item.children.forEach(function (sitem, si) {
                        sitem.value = sitem.id
                        sitem.display = sitem.name
                        sitem.selected = !si
                      })
                    }
                  })
                  res.result[0].splice(1, 0, opts[0])
                  res.result[0].forEach(function (item, i) {
                    vm['tabNavs' + i] = item.children
                    if (!i) {
                      vm.handleActivtySwitchTo(item.children[0].value, 'activtyList', -1)
                    } else if (i === 1) {
                      vm.handleBrandSwitchTo(item.children[0].value, -1)
                    } else {
                      vm.handleActivtySwitchTo(item.children[0].value, 'activtyList1', -1)
                    }
                  })
                }
              });
              opts = res.result.map(function (codes, i) {
                codes.dictIInfos.forEach(function (dic, di) {
                  dic.selected = !di
                })
                codes.dictIInfos.splice(2, 1);
                codes.children = codes.dictIInfos
                return codes
              });
            }
          })
        },
        handleActivtySwitchTo: function (value, key, index) {
          if (index !== -1) {
            this['tabNavs' + (key === 'activtyList' ? 0 : 2)].forEach(function (dic, di) {
              dic.selected = di === index
            })
          }
          this.activtySearchForm.activeType = value
          this.getActivtyList(key)
        },
        handleBrandSwitchTo: function (value, index) {
          if (index !== -1) {
            this['tabNavs1'].forEach(function (dic, di) {
              dic.selected = di === index
            })
          }
          this.topicSearchForm.topicCustomTag = value
          this.getTopicList()
        },
        handleMore: function (index) {
          var dict = ''
          this['tabNavs' + index].forEach(function (dic, di) {
            dic.selected && (dict = dic)
          })
          if (dict.id==='218340665870780082'){
            location.href='/livelist.html?type=' + dict.parentId
          }else {
            location.href = index==2 ? '/alist.html?type=' + dict.parentId : '/atList.html'
          }
        },
        handleRefresh: function () {
          if (this.userMaxPages > this.currentUserPage) {
            this.currentUserPage++
            this.getExcellenceUserList()
          } else {
            this.currentUserPage = 1
            this.getExcellenceUserList()
          }
        },
        handleToUrl: function (e) {
          e.preventDefault();
          this.$dialog.showToast('敬请期待')
        },
        handleColSelected: function (ni, id, flag) {
          if (flag) {
            this.collectionCancel(ni, id, flag);
          } else {
            this.colSelected(ni, id, flag);
          }
        },
        colSelected: function (ni, id, flag) {
          var vm = this;
          indexApi.selected({
            storeId: id,
            type: '08'
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.excellenceUserList[ni].collectFlag = 1;
              vm.$dialog.showToast("收藏成功")
            }
          })
        },
        collectionCancel: function (ni, id, flag) {
          var vm = this;
          indexApi.cancel({
            goodsId:  id
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.excellenceUserList[ni].collectFlag = 0;
              vm.$dialog.showToast("取消成功")
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
        handleUrlBtn: function (e) {
          var dataset = this.getAttributeData(e.currentTarget, ['url', 'pullurl', 'onLine', 'code']);
          var isFlag = true
          var url = dataset.url || ''
          if (url.indexOf('/activity/add') !== -1) {
            if (this.userInfo && this.userInfo.userName) {
              if(this.userInfo.userTypes && this.userInfo.userTypes.indexOf('001') === -1) {
                url = '';
                isFlag = false;
                this.$refs.lytoper.openBuyerConfirm()
              }
            } else {
              url = '';
              isFlag = false;
              window.location.href = '/common/login.html';
            }
          }
          if (url.indexOf('/moreSignup.html') !== -1) {
            if (this.userInfo && this.userInfo.userName) {
              if(this.userInfo.userTypes && this.userInfo.userTypes.indexOf('001') === -1) {
                url = '';
                isFlag = false;
                this.$refs.lytoper.openBuyerConfirm()
              }
            } else {
              url = '';
              isFlag = false;
              window.location.href = '/common/login.html';
            }
            if (dataset.onLine === '1') {
              url = dataset.pullurl
            }
            if (dataset.code === '0307') {
              url = ''
              isFlag= false
            }
          }
          if (!url && isFlag) {
            this.$dialog.showToast('敬请期待')
          }
          if (url && isFlag) {
            this.$utils.openNewTable(url)
          }
        }
      }
    });
  })
});
