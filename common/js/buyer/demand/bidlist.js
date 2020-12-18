// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpDemandApi', 'httpCom'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpDemandApi, httpCom) {
    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        http: httpUser,
        httpCom: httpCom,
        jquery: $,
        queryForm: {
          pageNum: '1', //当前页
          pageSize: '10', //每页的数量
          total: '100', //总记录条数
          pages: '3', //总页数
          prePage: '0', //前一页
          nextPage: '2', //下一页
          navigatePages: '2', //导航页码数
          navigatepageNums: '[1,2,3]', //所有导航页号
          navigateFirstPage: '1', //导航条上的第一页
          navigateLastPage: '3', //导航条上的最后一页
        },
        did: '',
        bidInfo: [],
        isViewBidBtn: true,
        pages: 1,
        pageCount: 4
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        var id = this.$utils.getReqStr('id');
        if (id) {
          this.did = id
          this.getBidInfo()
        }
      },
      // filters: {
      //   filtersBid: function (v1, v2) {
      //     if (v1 === '1' && v2 === '1') {
      //       return '已中标'
      //     } else if (v1 === '1' && v2 === '0') {
      //       return '未中标'
      //     } else {
      //       return '待选标'
      //     }
      //     return ''
      //   }
      // },
      methods: {
        getBidInfo: function () {
          var vm = this
          httpDemandApi.selectBidByPage({ id: this.did }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.isViewBidBtn = !res.result.list.some(function (bid) {
                return bid.existsBid === '1' && bid.bidFlag === '1'
              })
              vm.bidInfo = res.result.list
              vm.pages = res.result.pages;
            }
          })
        },
        winningBid: function (bid) {
          var vm = this
          var options = {
            title: '设置中标',
            texts: '<div class="form-view_item form-view_name">投标者名称：' + bid.shopName + '</div><div class="form-view_choose">是否选定 ' + bid.shopName + ' 为中标者</div><div class="form-view_type">设置中标后，系统将自动生成协议</div>',
            buttons: [
              {
                label: '确认',
                fun: function () {
                  httpDemandApi.winningBid({ demandId: vm.did, id: bid.bidId, version: bid.version }).then(function (res) {
                    if (res.code === 'rest.success') {
                      vm.$dialog.showToast(res.desc)
                      vm.getBidInfo()
                    }
                  })
                  return 1
                }
              },
              {
                label: '取消'
              }
            ]
          }
          this.$dialog.confirm2(options)
        },
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.queryForm.pageNum = index;
            this.getBidInfo();
          }
        },
        isShowPage: function (index) {
          var pageNum = this.queryForm.pageNum;
          var row = parseInt(pageNum / 2);
          if (row == 0 || row == 1) {
            if (1 <= index && index <= 4) {
              return true;
            } else {
              return false;
            }
          } else {
            if (row * 2 - 1 <= index && index <= row * 2 + 2) {
              return true;
            } else {
              return false;
            }
          }
        },
        isMore: function () {
          var pageNum = this.queryForm.pageNum;
          var row = parseInt(pageNum / 2);
          var index = row * 2 - 1;
          return !(index + 4 > this.pages);
        },
      },
    });
  });
});
