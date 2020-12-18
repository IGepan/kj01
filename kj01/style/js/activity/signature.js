// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', '/style/js/api/activity.js', 'jqValidate', 'dialog', 'httpUrl', 'fileSaver', 'laydate'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, activityApi, jqValidate, dialog, httpUrl, fileSaver, laydate) {
    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        showFull: false,
        http: httpUser,
        options: {},
        queryForm: {
          pageNum: 1,	// 	第几页	是	[string]		查看
          pageSize: 10,	// 	每页显示多少行	是	[string]		查看
          orderBy: '',	// 	排序字段	是	[string]		查看
          activeId: '', // 活动名称
          signDateFrom: '', // 活动开始时间起
          signDateTo: '', // 活动开始时间止
          total: 0
        },
        columnHead: {
          columns: [],
          title: '',
          activeEndTime: '',
          activeStartTime: '',
          isNeverExpires: '0',
          noEnrollSignNum: 0,
          signNum: 0
        },
        orderList: [],
        isSubmitDisabled: false,
        pages: 1,
        pageCount: 4
      },
      watch: {
        isOrderSelectedAll: function (newVal, oldval) {
          this.orderList.forEach(function (item) {
            item.selected = newVal
          })
        }
      },
      created: function () {
        this.initData();
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/conferenceLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      mounted: function () {
      },
      methods: {
        initData: function () {
          this.queryForm.activeId = this.$utils.getReqStr('id');
          this.getHeader()
        },
        getHeader: function () {
          var vm = this
          activityApi.signHeader({ activeId: this.queryForm.activeId }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.columns = res.result.columns.concat([
                {
                  columnName: "是否报名",
                  columnType: "10",
                  columnTypeDisplay: "是否报名",
                  displayWeight: 100
                },
                {
                  columnName: "签到次数",
                  columnType: "10",
                  columnTypeDisplay: "签到次数",
                  displayWeight: 100
                },
                {
                  columnName: "操作",
                  columnType: "10",
                  columnTypeDisplay: "操作",
                  displayWeight: 100
                }
              ])
              vm.columnHead = res.result;
              vm.getOrderList();
            }
          })
        },
        getOrderList: function () {
          var vm = this
          activityApi.signByPage(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.list.forEach(function(item){
                let d = item.signDetails
                item.signDetails = d.concat([
                  {
                    value: item.isEnroll ? '是' : '否'
                  },
                  {
                    value: item.signNum
                  }
                ])
              })
              vm.orderList = res.result.list
              vm.queryForm.total = res.result.total
              vm.pages = res.result.pages;
            } else {
              vm.orderList = []
              vm.queryForm.total = 0
              vm.pages = 0;
            }
          })
        },
        handleViewDates: function (i) {
          var dates = this.orderList[i].signDates
          var html = '<div class="dates"><div class="date-row"><label>序号</label><span class="text">签到时间</span></div>' + dates.map(function(date, i){
            return '<div class="date-row"><label>' + (i+1) + '</label><span class="text">' + date + '</span></div>'
          }).join('') + '</div>'
          var options = {
            title: '签到时间',
            width: '300px',
            texts: html,
            buttons: []
          }
          this.$dialog.confirm2(options)
          console.log(dates)
        },
        handleExportExcel: function () {
          var vm = this
          activityApi.signListExport({ activeId: this.queryForm.activeId }).then(function (res) {
            saveAs(res, vm.queryForm.activeId + '.xls')
          })
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
