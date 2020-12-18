// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', '/style/js/api/topic.js', 'jqValidate', 'dialog', 'httpUrl', 'laydate'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, activityApi, jqValidate, dialog, httpUrl, laydate) {
    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        showFull: false,
        http: httpUser,
        m_more: false,
        index: -1,
        options: {},
        columnHead: [
          {
            displayWeight: '200',
            columnName: '标题'
          },
          {
            displayWeight: '',
            columnName: '系列活动（场）'
          },
          {
            displayWeight: '200',
            columnName: '主办单位'
          },
          {
            displayWeight: '',
            columnName: '状态'
          },
          {
            displayWeight: '',
            columnName: '审核结果'
          },
          {
            displayWeight: '',
            columnName: '活动时间'
          },
          {
            displayWeight: '',
            columnName: '上架'
          },
          {
            displayWeight: '',
            columnName: '操作'
          }
        ],
        queryForm: {
          pageNum: 1,	// 	第几页	是	[string]		查看
          pageSize: 10,	// 	每页显示多少行	是	[string]		查看
          orderBy: '',	// 	排序字段	是	[string]		查看
          keyWord: '', // 关键字
          status: '', // 活动状态(字典表：topic_status)
          auditSituation: '', // 审核情况(字典表：audit_situation)
          activeStartTimeFrom: '', // 活动开始时间起
          activeStartTimeTo: '', // 活动开始时间止
          total: 0
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
        laydate.render({
          elem: '#time',
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss',
          startkey: 'activeStartTimeFrom',
          endkey: 'activeStartTimeTo',
          vm: this,
          done: function (value, date, endDate) { //选择日期完毕的回调
            this.vm.queryForm[this.startkey] = value;
          }
        })

        laydate.render({
          elem: '#time1',
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss',
          startkey: 'activeStartTimeFrom',
          endkey: 'activeStartTimeTo',
          vm: this,
          done: function (value, date, endDate) { //选择日期完毕的回调
            this.vm.queryForm[this.endkey] = value;
          }
        })
        var vm = this;
        document.addEventListener('click', function () {
          vm.index = -1;
        });
      },
      methods: {
        showMore: function (i) {
          this.index = i;
        },
        initData: function () {
          this.getOrderList()
          this.getOptions('topic_status')
          this.getOptions('audit_situation')
        },
        getOrderList: function () {
          var vm = this
          if (!this.endIsGreaterThanThebeginning(this.queryForm.activeStartTimeFrom, this.queryForm.activeStartTimeTo)) {
            activityApi.selectByPage(this.queryForm).then(function (res) {
              if (res.code === 'rest.success') {
                res.result.list.forEach(function (item) {
                  item.sponsor && (item.sponsor = item.sponsor.split('ぶんかつ').join('<br>'))
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
          } else {
            this.$dialog.showToast('活动时间开始时间不能大于结束时间')
          }
        },
        endIsGreaterThanThebeginning: function (begin, end) {
          return new Date(begin).getTime() > new Date(end).getTime();
        },
        getOptions: function (key) {
          var vm = this
          this.$httpCom.dict({ code: key }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.unshift({ id: "18322084" + key, value: "", display: "请选择" })
              vm.options[key] = res.result
              vm.$nextTick(function () {
                this.queryForm.status = ''
                this.queryForm.auditSituation = ''
              })
            }
          })
        },
        handlePutawayOrSoldout: function (id, upperFlag) {
          var vm = this
          var options = {
            title: '温馨提示',
            width: '300px',
            texts: upperFlag ? '确认上架吗？' : '确认下架吗?',
            buttons: [
              {
                label: '确认',
                fun: function () {
                  activityApi.shelf({ id: id, upperFlag: upperFlag }).then(function (res) {
                    if (res.code === 'rest.success') {
                      vm.getOrderList()
                    }
                    vm.$dialog.showToast(res.desc);
                  })
                  return 1
                }
              },
              {
                label: '关闭'
              }
            ]
          }
          this.$dialog.confirm2(options)
        },
        handleDelete: function (id) {
          var vm = this
          var options = {
            title: '温馨提示',
            width: '300px',
            texts: '确认删除吗？',
            buttons: [
              {
                label: '确认',
                fun: function () {
                  activityApi.delete({ id: id }).then(function (res) {
                    if (res.code === 'rest.success') {
                      vm.getOrderList()
                    }
                    vm.$dialog.showToast(res.desc);
                  })
                  return 1
                }
              },
              {
                label: '关闭'
              }
            ]
          }
          this.$dialog.confirm2(options)
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
        },
        isActiveLock: function (id) {
          var vm = this
          activityApi.isActiveLock({}).then(function(res){
            if (res.code === 'rest.success') {
              vm.$utils.openNewTable(id ? 'add.html?code=001.004.001.002&type=edit&id=' + id: 'add.html?code=001.004.001.002', '_self')
            }
          });
        }
      }
    });
  });
});
