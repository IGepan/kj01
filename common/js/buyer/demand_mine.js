// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpOrderApi', 'httpCom', 'jqValidate', 'dialog', 'httpUrl'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpOrderApi, httpCom, jqValidate, dialog, httpUrl) {
    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        showFull: false,
        http: httpUser,
        httpCom: httpCom,
        jquery: $,
        options: {
          sceneList: []
        },
        queryForm: {
          pageNum: 1,	// 	第几页	是	[string]		查看
          pageSize: 10,	// 	每页显示多少行	是	[string]		查看
          orderBy: '',	// 	排序字段	是	[string]		查看
          title: '',	// 	'id'	是	[string]		查看
          tagIdList: [],	// 	行业二级或三级Id
          sceneId: '',	// 	场景Id
          startDate: '',	// 		发布开始时间
          endDate: ''	// 	发布结束时间
        },
        orderList: [],
        pages: 1,
        pageCount: 4
      },
      watch: {
        isOrderSelectedAll: function (newVal, oldval) {
          this.orderList.forEach(function (item) {
            item.selected = newVal
          })
        },
        'queryForm.startDate': function (newVal, oldval) {
          this.queryForm.endDate && new Date(newVal) > new Date(this.queryForm.endDate) && this.$dialog.showToast('开始时间不能大于结束时间！')
        },
        'queryForm.endDate': function (newVal, oldval) {
          this.queryForm.startDate && new Date(this.queryForm.startDate) > new Date(newVal) && this.$dialog.showToast('开始时间不能大于结束时间！')
        }
      },
      created: function () {
        this.initData();
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'ly-select-level': httpVueLoader('/common/components/selectLevel.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      mounted: function () {
        laydate.render({
          elem: '#timeStart',
          format: 'yyyy-MM-dd HH:mm:ss',
          startkey: 'startDate',
          endkey: 'endDate',
          vm: this,
          showBottom: false,
          done: function (value, date, endDate) { //选择日期完毕的回调
            this.vm.queryForm[this.startkey] = value;
          }
        })
        laydate.render({
          elem: '#timeEnd',
          format: 'yyyy-MM-dd HH:mm:ss',
          startkey: 'startDate',
          endkey: 'endDate',
          vm: this,
          showBottom: false,
          done: function (value, date, endDate) { //选择日期完毕的回调
            this.vm.queryForm[this.endkey] = value;
          }
        })
      },
      methods: {
        initData: function () {
          this.getSceneList()
          this.getOrderList()
        },
        getOrderList: function () {
          var vm = this
          var data = JSON.parse(JSON.stringify(this.queryForm))
          data.tagIdList = data.tagIdList.map(function (tag) {
            return tag.tagId
          })
          httpOrderApi.diagnosisByPage(data).then(function (res) {
            if (res.code === 'rest.success') {
              vm.orderList = res.result.list
              vm.queryForm.total = res.result.totla
              vm.pages = res.result.pages;
            } else {
              vm.orderList = []
              vm.queryForm.total = 0
              vm.pages = 0;
            }
          })
        },
        getSceneList: function () {
          var vm = this
          httpCom.sceneList({}).then(function (res) {
            if (res.code === 'rest.success') {
              vm.options['sceneList'] = res.result
            }
          })
        },
        notFun: function () {
          this.$dialog.showToast('敬请期待')
        },
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.queryForm.pageNum = index;
            this.getOrderList();
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
        }
      }
    });
  });
});
