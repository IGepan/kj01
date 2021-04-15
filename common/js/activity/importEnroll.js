// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', '/common/js/httpApi/activity.js', 'dialog', 'httpUrl'],
    function ($, Vue, dic, httpVueLoader, userCenter, httpUser, activityApi, dialog, httpUrl) {
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
          columnHead: {},
          flieName: '',
          isSubmitDisabled: false
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
          'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
          'header-bar': httpVueLoader('/common/components/header.vue'),
          'buyer-left': httpVueLoader('/common/components/conferenceLeft.vue'),
          'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
        },
        mounted: function () {
          this.$refs.enrollUrl.setAttribute('href', 'participation.html?code=001.004.001.001&id=' + this.queryForm.activeId);
        },
        methods: {
          initData: function () {
            this.queryForm.activeId = this.$utils.getReqStr('id');
            this.getHeader()
          },
          getHeader: function () {
            var vm = this
            activityApi.enrollHeader({ activeId: this.queryForm.activeId }).then(function (res) {
              if (res.code === 'rest.success') {
                vm.columnHead = res.result;
              }
            })
          },
          handleFileChange: function (e) {
            console.log(e)
            this.flieName = e.target.files[0].name
          },
          handleSubmit: function (e) {
            var vm = this;
            var formData = new FormData();//获取表单中的文件
            formData.append('activeId', this.queryForm.activeId)
            var file = $("#file")[0].files[0]
            if (file) {
              this.$dialog.showLoading()
              formData.append('file', file)
              activityApi.importEnrollCVS(formData, function (res) {
                vm.$dialog.hideLoading()
                if (res.code === 'rest.success') {
                  vm.$dialog.showToast('导入成功！即将返回列表页');
                  setTimeout(function () {
                    window.location.href = 'participation.html?code=001.004.001.001&id=' + vm.queryForm.activeId
                  }, 1900)
                } else {
                  if(res.code==='msg.activity.csv.error'){
                    this.$dialog.showToast('文件格式不正确！');
                  }else {
                    this.$dialog.showToast(res.desc);
                  }
                }
              }, function (err) {
                this.$dialog.showToast('系统错误');
              })
            } else {
              this.$dialog.showToast('请先选择文件');
            }
          },
          handleBack: function () {
            var referrer = document.referrer
            var toUrl = referrer
            if (!referrer || referrer.indexOf('/reg.html') !== -1 || referrer.indexOf('/common/login.html') !== -1) {
              toUrl = this.$pathPrefix+'/index.html'
            }
            window.location.href = toUrl
          }
        }
      });
    });
});
