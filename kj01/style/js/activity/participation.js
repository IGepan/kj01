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
          auditSituation: '', // 审核情况(audit_situation)
          enrollDateFrom: '', // 活动开始时间起
          enrollDateTo: '', // 活动开始时间止
          total: 0
        },
        columnHead: [],
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
          this.getOptions('audit_situation')
        },
        getHeader: function () {
          var vm = this
          activityApi.enrollHeader({ activeId: this.queryForm.activeId }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.columnHead = res.result;
              vm.getOrderList();
            }
          })
        },
        getOrderList: function () {
          var vm = this
          activityApi.enrollByPage(this.queryForm).then(function (res) {
            if (res.code === 'rest.success') {
              vm.orderList = res.result.list
              vm.orderList.forEach((item)=>{
                let arr=[]
                let flg=item.enrollDetails.some((items,index)=>{
                  if(items.columnType==='19'){
                    return true
                  }else{
                    return false
                  }
                });
                if(!flg){
                  item.enrollDetails.push({
                       columnType:'19',
                       value:''
                  })
                }
              })
              vm.queryForm.total = res.result.total
              vm.pages = res.result.pages;
            } else {
              vm.orderList = []
              vm.queryForm.total = 0
              vm.pages = 0;
            }
          })
        },
        getOptions: function (key) {
          var vm = this
          this.$httpCom.dict({ code: key }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.options[key] = res.result
            }
          })
        },
        handleAudit: function (id, flag) {
          var vm = this
          activityApi.audit({ id: id, auditSituation: flag, noPassReason: flag === '01' ? '通过' : '不予通过' }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.getHeader()
            }
            vm.$dialog.showToast(res.desc);
          })
        },
        handleSetAuditSituation: function (type) {
          this.queryForm.auditSituation = type
          this.getOrderList();
        },
        handleExportExcel: function () {
          var vm = this
          activityApi.enrollListExport({ activeId: this.queryForm.activeId }).then(function (res) {
            saveAs(res, vm.queryForm.activeId + '.xls')
          })
        },
        handleImportExcel: function () {
          this.$utils.openNewTable('importEnroll.html?code=001.004.001.001&id=' + this.queryForm.activeId)
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
