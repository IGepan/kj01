// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/atindex.js', '/style/js/api/aindex.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl'],
    function ($, Vue, httpVueLoader, indexApi, indexApi1, owlCarousel, httpUrl) {
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
              url: '/atList.html',
              label: '品牌活动列表'
            },
            {
              label: '详情'
            }
          ],
          detail: '',
          recommendList: [],
          theHerList: [],
          navIndex: 0,
          pages: '',
          calendar: {
            days: [],
            month: 0,
            year: 0
          },
          activeNowTime: '',
          selectIndex: 0,
          dayResultList: [],
          isFixed: false,
          tabsNav: [
            {
              label: '活动介绍',
              active: true
            },
            {
              label: '活动计划',
              active: false
            }
          ],
          tabsIndex: 0
        },
        filters: {
          formatTime: function (v) {
            return v ? v.split(' ')[0] : ''
          }
        },
        mounted: function () {
          var vm = this
          document.addEventListener('scroll', function (e) {
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop
            if (scrollTop > 476) {
              !vm.isFixed && (vm.isFixed = true);
            } else {
              vm.isFixed && (vm.isFixed = false);
            }
          });
        },
        components: {
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'sub-head': httpVueLoader('/style/components/asub_head.vue'),
          'aside-today': httpVueLoader('/style/components/asideToday.vue'),
          'scroll': httpVueLoader('/style/components/scroll.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          let d = new Date()
          let dy = d.getFullYear()
          let dm = d.getMonth()
          let dd = d.getDate()
          this.saasId = localStorage.getItem('saasId');
          var id = this.$utils.getReqStr('id')
          this.calendar = {
            days: [],
            day: dd,
            week: d.getDay(),
            month: dm,
            initMonth: dm,
            initYear: dy,
            year: dy
          }
          this.activeNowTime = [dy, dm + 1, dd].map(this.formatNumber).join('/')
          id && this.getDetailInfo(id) && this.getRecommendList(id) && this.getTheHerList(id) && this.createDays();
          this.qrcodeUrl = httpUrl.baseUrl + '/active/getTopicActiveWxacode?id=' + id;
        },
        methods: {
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
          getDetailInfo: function (id) {
            var vm = this;
            indexApi.selectPortalDetail({ id: id }).then(function (res) {
              if (res.code === 'rest.success') {
                res.result.styles = {
                  backgroundImage: 'url(' + res.result.poster.url + ')'
                }
                res.result.posterUrl = res.result.poster.url
                res.result.sponsor = res.result.sponsor.split('ぶんかつ').join(' / ');

                if (res.result.cooperation.length) {
                  let cooperations = res.result.cooperation
                  let group = []
                  cooperations.forEach((cooperation) => {
                    if (group.indexOf(cooperation.cooperationType) === -1) {
                      group.push(cooperation.cooperationType)
                    }
                  })
                  cooperations = group.map((type) => {
                    return cooperations.filter((cooperation) => {
                      return cooperation.cooperationType === type
                    })
                  })
                  res.result.cooperation = cooperations
                }
                let visitNumTotal=0;
                if (res.result.topicDtls.length) {
                  res.result.topicDtls.forEach(function (item) {
                    item.itemUrl = '/adetail.html?id=' + item.activeId
                    item.styles = {
                      backgroundImage: 'url(' + item.posterUrl + ')'
                    }
                    item.itemImg = item.posterUrl
                    visitNumTotal+= Number(item.visitNum);
                  });
                }
                vm.$data.detail = res.result && res.result || ''
                vm.$data.detail.visitNum=visitNumTotal==0?res.result.visitNum:visitNumTotal
              }
            });
            return 1;
          },
          getRecommendList: function (id) {
            var vm = this;
            indexApi.selectPortalRecommend({ id: id }).then(function (res) {
              if (res.code === 'rest.success') {
                res.result && res.result.forEach(function (item) {
                  item.itemUrl = '/atdetail.html?id=' + item.id
                  item.styles = {
                    backgroundImage: 'url(' + item.posterUrl + ')'
                  }
                  item.itemImg = item.posterUrl
                });
                vm.$data.recommendList = res.result && res.result || []
              }
            });
            return 1;
          },
          getTheHerList: function (id) {
            var vm = this;
            indexApi.selectPortalIssuerActive({ id: id, size: 3 }).then(function (res) {
              if (res.code === 'rest.success') {
                res.result && res.result.forEach(function (item) {
                  item.itemUrl = '/adetail.html?id=' + item.id
                  item.styles = {
                    backgroundImage: 'url(' + item.posterUrl + ')'
                  }
                  item.itemImg = item.posterUrl
                });
                vm.$data.theHerList = res.result && res.result || []
                vm.initTheHer()
              }
            });
            return 1;
          },
          initTheHer: function () {
            this.$nextTick(function () {
              setTimeout(function () {
                $('#theHer').owlCarousel({
                  items: 1,
                  autoplay: 3000,
                  loop: true,
                  autoHeight: true,
                  transitionStyle: 'fade'
                });
              }, 500);
            })
          },
          getselectIssueMonth: function () {
            var vm = this
            indexApi1.selectIssueMonth({ year: vm.calendar.year, month: vm.calendar.month + 1 }).then(function (res) {
              if (res.code === 'rest.success') {
                var month = vm.calendar.month
                var initMonth = vm.calendar.initMonth
                var initYear = vm.calendar.initYear
                var year = vm.calendar.year
                var day = vm.calendar.day
                var d = new Date(`${year}/${month + 1}/1 11:00:00`)
                var week = d.getDay()
                var tempLength = week + vm.isMonthDays(year, month)
                var prevLength = month === 0 ? vm.isMonthDays(year - 1, 11) : vm.isMonthDays(year, month - 1);
                var temp = []
                var setI = 0;
                var selectIndex = 0
                var value = 1
                var tl = tempLength % 7;
                var rl = res.result.length
                tl && (tl = 7 - tl);
                tempLength += tl;
                while (tempLength > 0) {
                  tempLength--;
                  temp[tempLength] = 0;
                }
                tl = 1;
                vm.$data.calendar.days = temp.map((item, i) => {
                  var ri = i - week
                  if (week > i) {
                    return {
                      activeNum: 0,
                      click: 0,
                      label: 0 // prevLength - week + i + 1
                    }
                  } else if (week <= i && ri < rl) {
                    var item = res.result[ri]
                    var label = item.day
                    !setI && (selectIndex = i, setI = 1);
                    year == initYear && month === initMonth && label === day && (selectIndex = i, value = label);
                    return {
                      label: label,
                      click: 1,
                      activeNum: item.activeNum,
                      isSelect: year == initYear && month === initMonth && label === day
                    }
                  } else {
                    return {
                      activeNum: 0,
                      click: 0,
                      label: 0 // tl++
                    }
                  }
                });
                vm.selectIndex = selectIndex
                vm.handleSetDay({
                  currentTarget: {
                    dataset: {
                      index: selectIndex,
                      click: 1,
                      value: value
                    }
                  }
                })
              }
            })
            return 1;
          },
          getselectIssueToday: function () {
            var vm = this
            indexApi1.selectIssueToday({ pageNum: 1, pageSize: 100, activeNowTime: this.activeNowTime }).then(function (res) {
              if (res.code === 'rest.success') {
                res.result && res.result.list.forEach(function (item) {
                  item.itemUrl = '/adetail.html?id=' + item.id
                });
                vm.$data.dayResultList = res.result.list || []
              }
            })
            return 1;
          },
          createDays () {
            this.getselectIssueMonth()
            return 1;
          },
          isMonthDays (y, m) {
            let tm = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let ms = tm[m]
            !ms && (ms = y % 4 === 0 && y % 100 !== 0 || y % 400 === 0 ? 29 : 28);
            return ms
          },
          formatNumber (n) {
            n = n.toString()
            return n[1] ? n : '0' + n
          },
          handlePrevMonth () {
            var month = this.calendar.month
            var year = this.calendar.year
            if (month > 0) {
              this.calendar.month--
            } else if (year > 1970) {
              this.calendar.month = 11
              this.calendar.year--
            }
            this.createDays()
          },
          handleNextMonth () {
            var month = this.calendar.month
            var year = this.calendar.year
            if (month < 11) {
              this.calendar.month++
            } else if (year < 2040) {
              this.calendar.month = 0
              this.calendar.year++
            }
            this.createDays()
          },
          handleSetDay (e) {
            var month = this.calendar.month
            var year = this.calendar.year
            var vals = this.getAttributeData(e.currentTarget, ['value', 'index', 'click']);
            var click = parseInt(vals.click)
            click && (
              this.activeNowTime = [year, month + 1, vals.value].map(this.formatNumber).join('-'),
              this.selectIndex = parseInt(vals.index),
              this.getselectIssueToday()
            );
          },
          handleSetTabsIndex: function (index) {
            this.tabsNav[this.tabsIndex].active = false
            this.tabsNav[index].active = true
            this.tabsIndex = index
            window.scrollTo(0, 0)
          },
          handleShareToWeixin: function () {
            var vm = this;
            var options = {
              title: '二维码',
              width: '400px',
              texts: '<div style="text-align: center;padding: 10px;"><img src="' + this.qrcodeUrl + '" alt="" srcset=""></div>',
              buttons: []
            };
            vm.$dialog.confirm2(options)
          },
          handleShareToQQ: function () {
            var url = "https://connect.qq.com/widget/shareqq/index.html";
            var title = '精品政策-易智网';
            var summary = this.detail.title;
            var desc = this.detail.title;
            var fullUrl = [url, '?url=', encodeURIComponent(document.location.href), '&title=', title, '&summary=', summary, '&desc=', desc].join('');
            window.open(fullUrl)
          },
          handleColSelected: function () {
            if (this.detail.isCollection) {
              this.collectionCancel();
            } else {
              this.colSelected();
            }
          },
          colSelected: function () {
            var vm = this;
            indexApi.selected({
              storeId: this.detail.id,
              type: '06'
            }).then(function (res) {
              if (res.code == 'rest.success') {
                vm.detail.isCollection = 1;
                vm.detail.collectionNum++
                vm.$dialog.showToast("收藏成功")
              }
            })
          },
          collectionCancel: function () {
            var vm = this;
            indexApi.cancel({
              goodsId: this.detail.id
            }).then(function (res) {
              if (res.code == 'rest.success') {
                vm.detail.isCollection = 0;
                vm.detail.collectionNum > 0 && (vm.detail.collectionNum--);
                vm.$dialog.showToast("取消成功")
              }
            })
          }
        }
      });
    })
});
