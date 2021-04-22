// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpDemandApi', 'httpCom', 'fileSaver', 'laydate'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpDemandApi, httpCom, fileSaver, laydate) {

    new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: function () {
        return {
          http: httpUser,
          httpCom: httpCom,
          jquery: $,
          queryForm: {
            pageNum: 1,	// 	第几页	是	[string]		查看
            pageSize: 10,	// 	每页显示多少行	是	[string]		查看
            orderBy: '',	// 	排序字段	是	[string]		查看
            keyWord: '',	// 		关键字
            startDate: '',	// 	开始日期
            endDate: '',	// 	结束日期
            status: '',	// 	状态
            total: 0
          },
          loanList: [],
          pages: 1,
          pageCount: 4,
          options: {},
        }
      },
      watch: {
        'queryForm.startDate': function (newVal, oldval) {
          this.queryForm.endDate && new Date(newVal) > new Date(this.queryForm.endDate) && this.$dialog.showToast('开始时间不能大于结束时间！')
        },
        'queryForm.endDate': function (newVal, oldval) {
          this.queryForm.startDate && new Date(this.queryForm.startDate) > new Date(newVal) && this.$dialog.showToast('开始时间不能大于结束时间！')
        }
      },
      mounted: function () {
        var vm = this
        laydate.render({
          elem: '#startDate',
          format: 'yyyy-MM-dd HH:mm:ss',
          startkey: 'startDate',
          type: 'datetime',
          done: function (value, date, endDate) { //选择日期完毕的回调
            vm.queryForm[this.startkey] = value;
          }
        })
        laydate.render({
          elem: '#endDate',
          format: 'yyyy-MM-dd HH:mm:ss',
          endkey: 'endDate',
          type: 'datetime',
          done: function (value, date, endDate) { //选择日期完毕的回调
            if (date.hours == 0 && date.minutes == 0 && date.seconds == 0) {
              this.dateTime.hours = 23;
              this.dateTime.minutes = 59;
              this.dateTime.seconds = 59;
              var yyyy = this.dateTime.year
              var MM = this.dateTime.month + 1
              var dd = this.dateTime.date
              var HH = this.dateTime.hours
              var mm = this.dateTime.minutes
              var ss = this.dateTime.seconds
              var adtime = yyyy + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + ss;
              vm.queryForm[this.endkey] = adtime;
            } else {
              vm.queryForm[this.endkey] = value;
            }
          }
        })
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.getOptions([
          { 'code': 'loan_status' },
        ])
        this.getloanselectByPage()
      },
      methods: {
        // 获取多个标准码
        getOptions: function (keys) {
          var vm = this
          httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (codes) {
                codes.dictIInfos.unshift({ id: '-1', value: '', display: "全部" })
                vm.options[codes.code] = codes.dictIInfos
              })
            }
          })
        },
        getloanselectByPage: function () {
          var vm = this
          var ob = JSON.parse(JSON.stringify(this.queryForm));
          httpUser.loanselectByPage(ob).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.list.forEach(function (o) { o.operation = '' })
              vm.loanList = res.result.list
              vm.queryForm.total = res.result.total
              vm.pages = res.result.pages;
            } else {
              vm.queryForm.total = 0
              vm.pages = 0;
            }
          })
        },
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.queryForm.pageNum = index;
            this.getloanselectByPage();
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
