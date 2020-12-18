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
              url: '/resources/equipment_list.html',
              label: '仪器设备'
            },
            {
              label: '详情'
            }
          ],
          activeId: '',
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
            indexApi.equipmentinstrumentDetail({ id: this.activeId }).then(function (res) {
              if (res.code === 200) {
                var item = res.data
                item.styles = item.imgUrl ? {
                  backgroundImage: 'url(' + httpUrl.companyApi + '/yzw/api/' + item.imgUrl + ')'
                } : {};
                item.itemImg = item.imgUrl ? httpUrl.companyApi + '/yzw/api/' + item.imgUrl : ''
                item.impress = item.impress ? item.impress.split(',') : []
                item.fields = item.field ? item.field.split(',') : []
                vm.detail = item || ''
              }
            })
          }
        }
      });
    })
});
