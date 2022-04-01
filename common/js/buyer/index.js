// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpOrderApi', 'httpCom', '/style/js/api/policyMatch.js','/style/js/api/aindex.js',
        '/style/js/api/mail.js','/style/js/api/technologyMarket.js'],
      function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpOrderApi, httpCom, httpPolicy,httpActive,httpMall,httpTeach) {

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
          pageSize: 2,	// 	每页显示多少行	是	[string]		查看
          orderBy: 'createTime',	// 	排序字段	是	[string]		查看
          orderStatusFilter: '01',	// 	订单状态(字典表：order_status_filter)	是	[string]		查看
        },
        shopList: [],
        selectedAmount: '009',
        attentionList: [],
        hotList: [],
        hotType: '105',
        policyList: [],
        isNotSite: true,
        isSite:false,
          siteUrl: '',
        userSeller: {},
        dataList:{},
        searchForm:{
          activeIndex: "0",
        pageNum:1,
        pageSize:8,
        sortType: "01"
      },
        chooseGoods: [],
        techAchiList:[],
        goodFormData: {
          chosenFlag: '1',
          pageSize:3,
          orderBy: "createTime desc"
        },
        arl:'',
        userInfo:{},
        aIndex:0,
        expertList:[
            {title:'易智网技术开发高级项目经理 · 左良',text:'擅长领域：项目沟通与管理、需求分析与架构设计、系统集成与开发、平台运行与维护',tit:1, url:'/common/images/man.png',phone:'13594015226'},
          {title:'易智网资深科技政策咨询专家 · 仵改田',text:'擅长领域：高企申报、专精特新、研发加计扣除、科研项目申报、技术合同登记、科技成果转化等相关科技政策解读',tit:2,url:'/common/images/woman.png',phone:'18983891180'},
          {title:'易智网易智商城金牌顾问 · 刘成渠',text:'擅长领域：知识产权、工商财税、补贴申报、科技金融、招商入驻、企业需求诊断、定制化服务',tit:3,url:'/common/images/man.png',phone:'18883581918'},
            ]
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
        var host=window.location.host
        if(host=='www.kj01.cn'){
          this.arl="https://"+host
        }else{
          this.arl="http://"+host
        }
        console.log(this.host,'host')
        if (url.indexOf('/site/') > 0) {
          this.isSite=true
        }
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/newtoper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
        'web-footer': httpVueLoader(this.$pathPrefix+'/style/components/web_footer.vue'),
      },
      created: function () {
        this.getOption('comprehensive_search')
        this.handleOrdertabs('01')
        this.getSelectByPage()
        this.getAmountList('009')
        this.getSelectShopByPage('105')
        this.getUserInfo();
        this.checkSite();
        this.initUserInfo();
        this.select(3);
        this.getActive();

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
        select:function (val){
          this.aIndex=val
        },
        initUserInfo: function () {
          var vm = this;
          this.http.buyer().then(function (res) {
            vm.userSeller = res.result;
          })
        },
        getImgPath(path) {
          return httpUrl.fileShowUrl + '/resource/' + path;
        },
        //服务
        getMailGoods: function () {
          var vm = this
          httpMall.selectMailGoods(this.goodFormData).then(function (res) {
            if (res.code === 'rest.success') {
              vm.chooseGoods = res.result.list
            }
          })
        },
        // 技术成果列表查询
        getTechAchiList: function () {
          var _this = this;
          var form = {
            "pageParam": {
              "current": 1,
              "order": "desc",
              "size": 3,
              "sort": "id"
            },
            "payload": {
              "certificationFlag": 2,
            }
          };
          httpTeach.tech_achi_list(form).then(function (res) {
            if (res.code === true) {
              _this.techAchiList = res.data.records
            }
          })
          // httpTeach.tech_achi_list2().then(function (res) {
          //   if (res.code === true) {
          //     _this.techAchiList = res.data.records
          //   }
          // })
        },
        // 订单信息
        getOrderList: function () {
          var vm = this
          httpOrderApi.buyerSelectByPage(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              vm.orderList = res.result.list
              vm.queryForm.total = res.result.total
            }
          })
        },
        evaluate: function (id) {
          location.href = this.$pathPrefix+'/common/buyer/evaluate/orderDetail.html?code=001.001.001.001&id=' + id
        },
        // 行业关注
        getAmountList: function (code) {
          var vm=this
          this.selectedAmount = code
           if(this.isSite){
             httpUser.amountList({ pageSize: 4, categoryCode: code }).then(function (res) {
               if (res.code === 'rest.success') {
                 vm.$set(vm, 'attentionList', res.result)
               } else {
                 vm.$set(vm, 'attentionList', [])
               }
             })
           }else {
             if(code=='009'){
               this.getMailGoods();
             }else if(code=='001'){
               this.getTechAchiList();
             }
           }

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
            _this.userInfo=res.result
            var params = _this.getPlocyParams(res.result);
            // _this.getPolicyNoticeList(params);
          });
        },
        getActive:function (){
          var vm = this;
          httpActive.selectIssuePage(this.searchForm).then(function (res) {
            // console.log('res',res.result)
            vm.dataList = res.result ? res.result.list[0] : []
            // _this.getPolicyNoticeList(params);
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
