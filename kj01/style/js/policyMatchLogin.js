require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader',
    '/style/js/api/index.js',
    '/style/js/libs/scroll.js',
    '/style/js/libs/swiper-5.4.1/js/swiper.min.js',
    '/style/js/libs/swiper-5.4.1/js/swiper.animate.min.js',
    '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js',
    'httpUrl', '/common/js/libs/jquery.SuperSlide.2.1.3.js'],
    function ($, Vue, dic, httpVueLoader, indexApi, scroll, Swiper, animate, owlCarousel, httpUrl, superSlide) {
      new Vue({
        el: '#matchLogin_box',
				components: {
					'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue'),
          'policymatch-head': httpVueLoader('/style/components/policyMatch_head.vue'),
				},        
				data() {
          return {
            companyList: [{
              name: '重庆市科学技术研究院',
              isCheck: true,
            }],
            userInfo: {},
          }
        },
        created() {
          this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
        }
      })
    })
});
