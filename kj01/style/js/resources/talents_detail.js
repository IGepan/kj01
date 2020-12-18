// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/resources.js', 'httpUrl'],
    function ($, Vue, dic, httpVueLoader, indexApi, httpUrl) {
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
              url: '/resources/talents_list.html',
              label: '科技人才'
            },
            {
              label: '详情'
            }
          ],
          pageNavs: [
            {
              label: '专家介绍',
              isShow: false,
              active: true,
              hashUrl: '#专家介绍'
            },
            {
              label: '代表论文',
              isShow: true,
              active: true,
              hashUrl: '#代表论文'
            },
            {
              label: '科技成果',
              isShow: true,
              active: false,
              hashUrl: '#科技成果'
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
            indexApi.talentListDetail({ id: this.activeId }).then(function (res) {
              if (res.code === 200) {
                var item = res.data
                item.styles = {}
                //   item.avatar ? {
                //   backgroundImage: 'url(' + httpUrl.companyApi + '/yzw/api/' + item.avatar + ')'
                // } : {};
                item.itemImg = '' // item.avatar ? httpUrl.companyApi + '/yzw/api/' + item.avatar : ''
                item.impress = item.impress ? item.impress.split(',') : []
                item.fields = item.field ? item.field.split(',') : []
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
