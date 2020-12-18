// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/index.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl'],
    function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl) {
      new Vue({
        el: '#index_box',
        data: {
          cmsUrl: httpUrl.cmsUrl,
          saasId: ''
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
        },
        methods: {}
      });
    })
});
