// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', '/common/js/httpApi/activity.js', 'jqValidate', 'dialog', 'httpUrl', 'fileSaver', 'laydate'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, activityApi, jqValidate, dialog, httpUrl, fileSaver, laydate) {
    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        showFull: false,
        http: httpUser,
        m_more: false,
        index: -1,
        options: {
          active_type: []
        },
        queryForm: {
          pageNum: 1,	// 	第几页	是	[string]		查看
          pageSize: 10,	// 	每页显示多少行	是	[string]		查看
          orderBy: '',	// 	排序字段	是	[string]		查看
          title: '', // 活动名称
          activeType: '', // 活动类型(字典表：active_type)
          status: '', // 活动状态(字典表：active_status)
          activeStartTimeFrom: '', // 活动开始时间起
          activeStartTimeTo: '', // 活动开始时间止
          total: 0
        },
        orderList: [],
        isSubmitDisabled: false,
        pages: 1,
        pageCount: 4,
        pullStreamUrlDialog:false,
        pullStreamUrl:''
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
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
        'select-type': httpVueLoader('/style/components/selectType.vue')
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
        });
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
        });
        var vm = this;
        document.addEventListener('click', function () {
          vm.index = -1;
        });
      },
      methods: {
        showMore: function (item,i) {
          this.index = i;
          if(item.statusDisplay=="待审核"){
            this.$dialog.showToast('活动正在审核中！')
          }
          console.log(item,'233')
        },
        initData: function () {
          this.getOrderList()
          this.getOptions('active_status')
          this.getTree([
            {
              type: '11'
            }
          ])
        },
        getTree: function (keys) {
          var vm = this;
          activityApi.getTree(keys).then(function (res) {
            if (res.code === 'rest.success') {
              vm.options['active_type'] = res.result[0]
            }
          });
        },
        getOrderList: function () {
          var vm = this
          if (!this.endIsGreaterThanThebeginning(this.queryForm.activeStartTimeFrom, this.queryForm.activeStartTimeTo)) {
            activityApi.selectByPage(this.queryForm).then(function (res) {
              if (res.code === 'rest.success') {
                res.result.list.forEach(function (item) {
                  item.sponsor && (item.sponsor = item.sponsor.split('ぶんかつ').join('<br>'))
                  if (Array.isArray(item.activeTypeDisplay) && item.activeTypeDisplay.length) {
                    item.activeTypeDisplay = item.activeTypeDisplay[0].name
                  } else {
                    item.activeTypeDisplay = ''
                  }
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
              vm.options[key] = res.result
            }
          })
        },
        handlePutawayOrSoldout: function (id, upperFlag,version) {
          var vm = this
          var options = {
            title: '温馨提示',
            width: '300px',
            texts: upperFlag ? '确认上架吗？' : '确认下架吗?',
            buttons: [
              {
                label: '确认',
                fun: function () {
                  activityApi.shelf({ id: id, upperFlag: upperFlag,version:version}).then(function (res) {
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
        handleDelete: function (id,version) {
          var vm = this
          var options = {
            title: '温馨提示',
            width: '300px',
            texts: '确认删除吗？',
            buttons: [
              {
                label: '确认',
                fun: function () {
                  activityApi.delete({ id: id,version:version }).then(function (res) {
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
        handleGetWxCode: function (id) {
          activityApi.getWxcode({ id: id }).then(function (res) {
            saveAs(res, '活动' + id + '.jpg', { type: 'image/jpeg;charset=utf-8' })
          })
        },
        handleGetWxSignCode: function (id) {
          activityApi.getWxSignCode({ id: id }).then(function (res) {
            saveAs(res, '签到' + id + '.jpg', { type: 'image/jpeg;charset=utf-8' })
          })
        },
        handleGetWxAppSignCode: function (id) {
          activityApi.getWxAppSignCode({ id: id }).then(function (res) {
            saveAs(res, 'App签到' + id + '.jpg', { type: 'image/jpeg;charset=utf-8' })
          })
        },
        handleStartLive: function (id) {
          let vm=this
          activityApi.startLive({ id: id }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.pullStreamUrlDialog=true;
              vm.pullStreamUrl=res.result
            }
          })
        },
        handleEndLive: function (id) {
          let vm=this
          activityApi.endLive({ id: id }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.$dialog.showToast(res.desc)
            }
          })
        },
        handleStreamUrl: function (id) {
          let vm=this
          activityApi.getStreamUrl({ id: id }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.pullStreamUrlDialog=true;
              vm.pullStreamUrl=res.result
            }
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
        },
        isActiveLock: function (id) {
          var vm = this
          activityApi.isActiveLock({}).then(function(res){
            if (res.code === 'rest.success') {
              vm.$utils.openNewTable(id ? 'add.html?code=001.004.001.001&type=edit&id=' + id : 'add.html?code=001.004.001.001', '_self')
            }
          });
        },
        closeUrlDialog(){
          this.pullStreamUrlDialog=false;
        }
      }
    });
  });
});
