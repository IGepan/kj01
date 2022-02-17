require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader',
    '/style/js/api/index.js',
    '/style/js/libs/scroll.js',
    '/style/js/libs/swiper-5.4.1/js/swiper.min.js',
    '/style/js/libs/swiper-5.4.1/js/swiper.animate.min.js',
    '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js',
    'httpUrl', '/common/js/libs/jquery.SuperSlide.2.1.3.js','/style/js/api/policyMatch.js',],
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
              pageSize: 4,
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
              total: 0,
            },
            list: [],
            maxMoney: 0,
            typeUrl:null,
          }
        },
        created() {
          this.typeUrl=this.$utils.getReqStr('type');
          this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
          this.getPolicyNoticeList(1);
          // this.getPolicyNoticeList(2);
        },
        methods: {
          changeType(type) {
            this.searchForm.type = type;
            this.getPolicyNoticeList(this.searchForm.type);
          },
          bindPageChange(val) {
            console.log(val)
            this.searchForm.pageNum = val;
            this.getPolicyNoticeList(this.searchForm.type);
          },
          getStatus(beginDate, endDate) {
            var currenttime = new Date().getTime();
            var status = 0;
            if(beginDate && endDate) {
              var begintime = new Date(beginDate).getTime();
              var endtime = new Date(endDate).getTime();   
              if(currenttime > begintime && currenttime < endtime) {
                status = 1; // 进行中
              }
              if(begintime > currenttime) {
                status = 2; // 未开始
              }
              if(endtime < currenttime) {
                status = 3; // 已结束
              }
            }
            return status;
          },
          getPolicyNoticeList: function(type) {
            var params = JSON.parse(localStorage.getItem('policyMatchParams'));
            params = Object.assign({}, params, this.searchForm);
            params.type = type;
            this.params = params;
            console.log('-----',params)
            var _this = this;
            httpPolicy.getPolicyNoticeList(params).then(function(res) {
             
              _this.list = res.result.list.map(item => {
                return Object.assign({}, item, {status: _this.getStatus(item.executionStartDate, item.executionEndDate)})
              });
              if(type == 2) {
                _this.maxMoney = _this.list[0].money;
              }
              console.log(_this.list)
              _this.pages = res.result
            })
          }
        }
      })
    })
});
