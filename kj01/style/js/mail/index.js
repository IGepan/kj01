// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl'],
      function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl) {
        new Vue({
          el: '#index_box',
          data: {
            saasId: '',
            mailSite: {},
            mailServiceTypeList: {},
          },
          filters: {},
          mounted: function () {},
          components: {
            'ly-toper': httpVueLoader('/style/components/toper.vue'),
            'index-head': httpVueLoader('/style/components/index_head.vue'),
            'web-footer': httpVueLoader('/style/components/web_footer.vue')
          },
          created: function () {
            this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
            this.saasId = localStorage.getItem('saasId');
            this.getMailSiteDetail();
            this.getMailServiceType();
          },
          methods: {
            getMailSiteDetail: function () {
              var vm = this
              indexApi.mailSiteDetail().then(function (res) {
                if (res.code === 'rest.success') {
                  vm.mailSite = res.result
                }
              })
            },
            getMailServiceType: function () {
              var vm = this
              indexApi.mailServiceType().then(function (res) {
                if (res.code === 'rest.success') {
                  vm.mailServiceTypeList = res.result
                }
              })
            },
          }
        });
      })
});
