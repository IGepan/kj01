require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader',
    '/style/js/api/index.js',
    '/style/js/libs/scroll.js',
    '/style/js/libs/swiper-5.4.1/js/swiper.min.js',
    '/style/js/libs/swiper-5.4.1/js/swiper.animate.min.js',
    '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js',
    'httpUrl', '/common/js/libs/jquery.SuperSlide.2.1.3.js','/style/js/api/policymatch.js',],
    function ($, Vue, dic, httpVueLoader, indexApi, scroll, Swiper, animate, owlCarousel, httpUrl, superSlide, httpPolicy) {
      new Vue({
        el: '#matchLogin_box',
				components: {
					'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue'),
          'policymatch-head': httpVueLoader('/style/components/policyMatch_head.vue'),
          'pages': httpVueLoader('/style/components/pages.vue'),
				},        
				data() {
          return {
            companyList: [{
              name: '重庆市科学技术研究院',
              isCheck: true,
            }],
            userInfo: {},
            searchForm: {
              pageNum: 1,
              pageSize: 10,
              type: '1', // 排序方式(字典表:sort_type)
            },        
            params: {name: ''},
            pages: {
              endRow: 8,
              hasNextPage: true,
              hasPreviousPage: false,
              isFirstPage: true,
              isLastPage: false,
              navigateFirstPage: 1,
              navigateLastPage: 8,
              navigatePages: 8,
              navigatepageNums: [1, 2, 3, 4, 5, 6, 7, 8],
              nextPage: 2,
              pageNum: 1,
              pageSize: 8,
              pages: 337,
              prePage: 0,
              size: 8,
              startRow: 1,
              total: 2692,
            },
            list: [],
          }
        },
        created() {
          this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
          this.getPolicyNoticeList();
        },
        methods: {
          changeType(type) {
            this.searchForm.type = type;
            this.getPolicyNoticeList();
          },
          bindPageChange(val) {
            console.log(val)
            this.searchForm.pageNum = val;
            this.getPolicyNoticeList();
          },
          getPolicyNoticeList: function() {
            var params = JSON.parse(localStorage.getItem('policyMatchParams'));
            params = Object.assign({}, params, this.searchForm);
            this.params = params;
            console.log('-----',params)
            var _this = this;
            httpPolicy.getPolicyNoticeList(params).then(function(res) {
              console.log(res.result)
              _this.list = res.result.list;
              _this.pages = res.result
            })
          }
        }
      })
    })
});
