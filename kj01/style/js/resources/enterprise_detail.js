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
              url: '/resources/enterprise_list.html',
              label: '优选企业'
            },
            {
              label: '详情'
            }
          ],
          pageNavs: [
            {
              label: '企业简介',
              isShow: false,
              active: true,
              hashUrl: '#企业简介'
            },
            {
              label: '工商信息',
              isShow: true,
              active: true,
              hashUrl: '#工商信息'
            },
            {
              label: '知识产权',
              isShow: true,
              active: false,
              hashUrl: '#知识产权'
            }
          ],
          activeId: '',
          isFixed: false,
          detail: ''
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
          'sources-head': httpVueLoader('/style/components/sources_head.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
          this.activeId = this.$utils.getReqStr('id')
          this.saasId = localStorage.getItem('saasId');
          this.getDeatil()
        },
        methods: {
          getDeatil: function () {
            var vm = this;
            indexApi.enterprisecqDetail({ id: this.activeId }).then(function (res) {
              if (res.code === 200) {
                var item = res.data
                item.enterpriseInfo['taglabel'] = item.enterpriseInfo.highTechFirm ? '高新技术企业' : item.enterpriseInfo.uniconFirm ? '独角兽' : item.enterpriseInfo.gazelleFirm ? '瞪羚' : item.enterpriseInfo.gnuFirm ? '牛羚' : item.enterpriseInfo.newHighResearchOrg ? '新型高端研发机构' : item.enterpriseInfo.newResearchOrg ? '新型研发机构' : item.enterpriseInfo.middleMinFirm ? '国家级科技型企业' : item.enterpriseInfo.cqMiddleMinFirm ? '市级科技型企业' : ''
                vm.detail = item || ''
              }
            })
          },
          handSetPageNavActive: function (i) {
            this.pageNavs.forEach(function (nav, ni) {
              nav.active = ni === i
            })
          }
        }
      });
    })
});
