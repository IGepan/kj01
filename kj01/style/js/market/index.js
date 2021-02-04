require(['/common/js/require.config.js'], function () {
 require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/market.js', 'httpUrl', '/style/js/libs/scroll.js'],
  function ($, dic, Vue, httpVueLoader, indexApi, httpUrl, scroll) {
   new Vue({
    el: '#index_box',
    data: {
     dicOptsSet: [
      { code: 'industry_level1_type' },
      { code: 'demand_type' },
      { code: 'comprehensive_search' },
      { code: 'transaction_mode' }
     ],
     searchTypes: [],
     cascadeList: [],
     tagList: [],
     isshow: false,
     userInfo: '',
     buttons: [
      {
       label: '我有技术，快速发布',
       url: '/common/seller/addpatent.html?code=technology-all&categoryId=82515756322918000'
      },
      {
       label: '我有难题，在线招标',
       url: '/common/buyer/demand/add.html?code=001.001.002.002'
      }
     ],
     buttons2: [
      {
       label: '技术合同登记',
       url: '/other/checkin.html'
      },
      {
       label: '技术评估',
       url: '/other/assessment.html'
      },
      {
       label: '技术挂牌交易',
       url: '/other/transaction.html'
      },
      {
       label: '交易公示',
       url: '/other/publicity.html'
      }
     ],
     navslist: [
      {
       label: '首页',
       url: '/',
       selected: true
      },
      {
       label: '找技术',
       url: '/service/results_list.html'
      },
      {
       label: '找专利',
       url: '/service/results_list.html?categoryCode=001.002'
      },
      {
       label: '找需求',
       url: '/service/demand_list.html'
      },
      {
       label: '找供应商',
       url: '/service/organization_list.html'
      },
      {
       label: '技术经纪人',
       url: '/market/technicalBroker.html'
      }
     ],
     orderList: [],
     orderParams: {
      'pageNum': 1,
      'pageSize': 10,
      'saasFlag': false
     },
     dealList: [],
     dealParams: {
      'pageNum': 1,
      'pageSize': 10,
      'orderBy': 'createTime desc',
      'categoryCode': '001,010'
     },
     tabsList: [
      {
       label: '机械',
       selected: true,
       industryLevel: '001',
       id: '199937241001233762'
      },
      {
       label: '汽车',
       selected: false,
       industryLevel: '002',
       id: '199937241370332515'
      },
      {
       label: '集成电路',
       selected: false,
       industryLevel: '003',
       id: '199937241714265444'
      },
      {
       label: '物联网',
       selected: false,
       industryLevel: '004',
       id: '199937242058198373'
      },
     ],
     buttons3: [],
     viewList: [],
     viewParams: {
      'pageNum': 1,
      'pageSize': 8,
      'orderBy': 'createTime desc',
      'categoryCode': '001,010',
      'industryLevel': '001'
     },
     viewList: [],
     demand_type: [],
     issueList: [],
     issueParams: {
      'pageNum': 1,
      'pageSize': 10,
      'orderBy': 'createTime desc'
     },
     demandList: [],
     demandParams: {
      'pageNum': 1,
      'pageSize': 6,
      'orderBy': 'createTime desc',
      'demandType': '02'
     },
     shopList: [],
     shopParams: {
      'pageNum': 1,
      'pageSize': 8,
      'orderBy': 'createTime desc',
      'isContainIdentityTypeSelf': '0'
     },
     serveList: [],
     serveParams: {
      'pageNum': 1,
      'pageSize': 4,
      'orderBy': 'createTime desc',
      'categoryCode': '009',
      'servicesLevel': '003'
     },
     counts: [
      {
       imgurl: '/style/images/market/polygon1.png',
       count: 0,
       unit: '项',
       key: 'techCount',
       label: '技术成果',
       url: '/service/results_list.html'
      },
      {
       imgurl: '/style/images/market/polygon4.png',
       count: 0,
       unit: '项',
       key: 'demandCount',
       label: '企业需求',
       url: '/service/demand_list.html'
      },
      {
       imgurl: '/style/images/market/polygon3.png',
       count: 0,
       unit: '家',
       key: 'shopCount',
       label: '服务机构',
       url: '/service/organization_list.html'
      },
      {
       imgurl: '/style/images/market/polygon2.png',
       count: 0,
       unit: '条',
       key: 'serviceCount',
       label: '服务资源',
       url: '/service/resource_list.html'
      }
     ],
    },
    components: {
     'ly-toper': httpVueLoader('/style/components/toper.vue'),
     'market_header': httpVueLoader('/style/components/market_header.vue'),
     'web-footer': httpVueLoader('/style/components/web_footer.vue')
    },
    created: function () {
     this.getDicList(this.dicOptsSet);
     this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO))),
      this.getOrderList() // 最近成交
     this.getGoodsList(this.dealParams, 'dealList') // 最新发布
     this.getGoodsList(this.viewParams, 'viewList') // 机械
     // this.getAchievement()
     this.getDemand(this.demandParams, 'demandList') // 获取需求
     this.getDemand(this.issueParams, 'issueList') // 最新发布
     this.getShopList() // 推荐供应商
     this.getGoodsList(this.serveParams, 'serveList') // 推荐服务
     this.getCounts()
    },
    methods: {
     getCounts: function () {
      var vm = this;
      indexApi.statistics({
       code: "serviceTotal"
      }).then(function (res) {
       if (res.code === 'rest.success') {
        vm.counts.forEach(function (item, i) {
         item.count = parseInt(res.result.serviceTotal[0][item.key])
        })
       }
      })
     },
     initScroll: function () {
      this.$nextTick(function () {
       $('.listsScroll').myScroll({
        speed: 40, //数值越大，速度越慢
        rowHeight: 720
       });
      })
     },
     getShopList: function () {
      var vm = this
      indexApi.shopselectByPage(vm.shopParams).then(function (res) {
       if (res.code === 'rest.success') {
        vm.shopList = res.result.list
       }
      })
     },
     getDemand: function (params, dataKey) {
      var vm = this
      indexApi.demandselectbByPage(params).then(function (res) {
       if (res.code === 'rest.success') {
        vm.$data[dataKey] = res.result.list
       }
      })
     },
     handleTabsList: function (index) {
      var vm = this
      vm.tabsList.forEach(function (item, i) {
       item.selected = i === index && (vm.viewParams.industryLevel = item.industryLevel)
      });
      this.getGoodsList(this.viewParams, 'viewList')
     },
     // getAchievement: function () {
     //  var vm = this
     //  indexApi.selectAchievement().then(function (res) {
     //   if (res.code === 'rest.success'){
     //    vm.buttons3 = res.result
     //   }
     //  })
     // },
     // 最新发布
     getGoodsList: function (params, dataKey) {
      var vm = this
      indexApi.goodsselectbByPage(params).then(function (res) {
       if (res.code === 'rest.success') {
        vm.$data[dataKey] = res.result.list
        vm.$nextTick(function () {
         $('.issueList').myScroll({
          speed: 90, //数值越大，速度越慢
          rowHeight: 78
         });
        })
       }
      })
     },
     // 最近成交
     getOrderList: function () {
      var vm = this
      indexApi.orderselectpByPage(vm.orderParams).then(function (res) {
       if (res.code === 'rest.success') {
        vm.orderList = res.result.list
        vm.initScroll();
       }
      })
     },
     // 敬请期待
     showToast: function () {
      this.$dialog.showToast('敬请期待')
     },
     // 根据字典表获取数据
     getDicList: function (keys) {
      var vm = this
      vm.$httpCom.dictList({ dictInfos: keys }).then(function (res) {
       if (res.code === 'rest.success') {
        res.result && res.result.length && res.result.forEach(function (item, index) {
         if (item.code === 'industry_level1_type') {
          var list = res.result[index].dictIInfos
          list.splice(list.length-2,2)
          vm.cascadeList = list
         } else if (item.code === 'demand_type') {
          res.result[index].dictIInfos.forEach(function (item) {
           if (item.display !== '其他') {
            vm.demand_type.push(item)
           }
          });
          //科技服务放在最前面
          vm.demand_type.unshift(vm.demand_type[1]);
          vm.demand_type.splice(2,1)
         } else if (item.code === 'comprehensive_search') {
          vm.searchTypes = res.result[index].dictIInfos
         } else if (item.code === 'transaction_mode') {
          res.result[index].dictIInfos.forEach(function (item) {
           if (item.display !== '其他') {
            vm.buttons3.push(item)
           }
          })
         }
        })
       }
      })
     },
     // 获取二级级联
     getTagList: function (id) {
      var vm = this
      indexApi.industryselect({ industryLevel1Type: id }).then(function (res) {
       if (res.code === 'rest.success')
        vm.tagList = res.result
      })
     },
     // 鼠标移入获取二级级联
     toggleShow: function (val) {
      this.getTagList(val)
     },
     handleUrlBtn: function (e) {
      var url = e.currentTarget.dataset ? e.currentTarget.dataset.url : e.currentTarget.getAttribute('data-url');
      var isFlag = true
      !url && (url = '')
      if (url.indexOf('/common/buyer') !== -1) {
       if (this.userInfo && this.userInfo.userName) {
        if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('001') === -1) {
         url = '';
         isFlag = false;
         this.$refs.lytoper.openBuyerConfirm()
        }
       } else {
        url = '';
        isFlag = false;
        window.location.href = '/common/login.html';
       }
      }
      if (url.indexOf('/common/seller') !== -1) {
       if (this.userInfo && this.userInfo.userName) {
        if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('002') === -1) {
         url = '';
         isFlag = false;
         this.$dialog.showToast('您还不是服务商，请先入驻成为服务商！')
        }
       } else {
        url = '';
        isFlag = false;
        window.location.href = '/common/login.html';
       }
      }
      if (url.indexOf('/activity/add') !== -1) {
       if (this.userInfo && this.userInfo.userName) {
        if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('001') === -1) {
         url = '';
         isFlag = false;
         this.$refs.lytoper.openBuyerConfirm()
        }
       } else {
        url = '';
        isFlag = false;
        window.location.href = '/common/login.html';
       }
      }
      if (url && isFlag) {
       this.$utils.openNewTable(url)
      }
      if (!url && isFlag) {
       this.$dialog.showToast('敬请期待')
      }
     },
    },
   })
  })
})
