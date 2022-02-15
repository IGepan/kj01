// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpOrderApi', 'httpCom', '/style/js/api/policyMatch.js',],
      function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpOrderApi, httpCom, httpPolicy) {

    new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        isConference:true,
        // isConference: true,
        http: httpUser,
        httpCom: httpCom,
        jquery: $,
        isNewMain: false,
        orderList: [],
        queryForm: {
          pageNum: 1,	// 	第几页	是	[string]		查看
          pageSize: 3,	// 	每页显示多少行	是	[string]		查看
          orderBy: 'createTime',	// 	排序字段	是	[string]		查看
          orderStatusFilter: '01',	// 	订单状态(字典表：order_status_filter)	是	[string]		查看
        },
        shopList: [],
        selectedAmount: '010',
        attentionList: [],
        hotList: [],
        hotType: '105',
        policyList: [],
        isNotSite: true,
        isSite:false,
          siteUrl: ''
      },
      filters: {
        filtersTips: function (v, evaluated) {
          var t = ''
          switch (v) {
            case '005':
              t = '您提交了订单，等待付款'
              break;
            case '007':
              t = evaluated ? '您的订单已评价。' : '您还未对订单进行评价，赶快去评价吧。'
              break;
            case '001':
              t = '您的订单已提交，等待卖家确认。'
              break;
            case '002':
              t = '卖家正在为您工作中，请耐心等待。'
              break;
            case '003':
              t = '订单正在等待卖家发货。'
              break;
            case '004':
              t = '您的订单已工作完成，等待您进行验收确认。'
              break;
            case '008':
              t = '您提交的订单已取消，点击查看详情'
              break;
          }
          return t
        }
      },
      mounted: function () {
        $(".orderclick").click(function () {
          $(this).addClass("active").siblings(".orderclick").removeClass("active");
        });
        var url = window.location.href
        if (url.indexOf('/site/') > 0) {
          this.isSite=true
        }
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.getOption('comprehensive_search')
        this.handleOrdertabs('01')
        this.getSelectByPage()
        this.getAmountList('010')
        this.getSelectShopByPage('105')
        this.getUserInfo();
        this.checkSite();
      },
      methods: {
        checkSite: function () {
          var url = window.location.href
          var vm = this;
          if (url.indexOf('/site/') > 0) {
            vm.isNotSite = false;
            vm.siteUrl = url.substring(0,url.indexOf("/common"))
          }else{
              vm.isNotSite = true
          }
        },
        // 订单信息
        getOrderList: function () {
          var vm = this
          httpOrderApi.buyerSelectByPage(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              vm.orderList = res.result.list
              vm.queryForm.total = res.result.totla
            }
          })
        },
        evaluate: function (id) {
          location.href = this.$pathPrefix+'/common/buyer/evaluate/orderDetail.html?code=001.001.001.001&id=' + id
        },
        // 行业关注
        getAmountList: function (code) {
          var vm = this
          this.selectedAmount = code
          httpUser.amountList({ pageSize: 4, categoryCode: code }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.$set(vm, 'attentionList', res.result)
            } else {
              vm.$set(vm, 'attentionList', [])
            }
          })
        },
        // 为你推荐
        getSelectShopByPage: function (value) {
          var vm = this
          this.hotType = value;
          if(value==='105'){
            httpUser.selectShopRecommend().then(function (res) {
              if (res.code === 'rest.success') {
                vm.hotList = res.result
              }
            })
          }else{
            httpUser.selectShopExpert().then(function (res) {
              if (res.code === 'rest.success') {
                vm.hotList = res.result
              }
            })
          }
        },
        // 人脉圈
        getSelectByPage: function () {
          var vm = this
          httpUser.selectByPage({
            pageNum: 1,
            pageSize: 3,
            type: '02'
          }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.shopList = res.result.list
            }
          })
        },
        getOption: function (key) {
          var vm = this
          // 判断是否是新的皮肤
          this.$httpCom.dict({ code: key }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.isNewMain = res.result[0].display === '综合'
            }
          })
        },
        handleOrdertabs: function (type) {
          this.queryForm.orderStatusFilter = type
          this.getOrderList()
        },
        handleShowTips: function () {
					window.open(location.origin+'/demand.html')
          //this.$dialog.showToast('敬请期待');
        },
        // 获取用户信息
        getUserInfo: function(){
          var _this = this;
          httpUser.detail().then(function (res) {
            // console.log('res',res.result)
            var params = _this.getPlocyParams(res.result);
            _this.getPolicyNoticeList(params);
          });
        },
        getPlocyParams: function(data) {
          var params = {};
          params.name = data.organizationName;
          params.socialCreditCode = '';
          params.registeredTime = data.establishDate;
          params.industry = data.industryList ? data.industryList.map(item => item.name).join(',') : '';
          params.city = data.country + ','+ data.city;
          params.enterpriseQualification = '';
          params.enterpriseType = data.organizationTypeDisplay;
          params.pageNum = 1;
          params.pageSize = 10;
          return params;
        },
        // 获取速配接口
        getPolicyNoticeList: function(params) {
          console.log('-----',params)
          var _this = this;
          httpPolicy.getPolicyNoticeList(params).then(function(res) {
            _this.policyList = res.result.list;
          })
        }
      }
    });
  });
});
