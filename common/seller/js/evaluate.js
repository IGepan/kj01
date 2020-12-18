require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'jqValidate', 'httpVueLoader', 'jqSelect', 'httpCom', 'httpEvaluateApi', 'laydate'], function ($, Vue, httpStore, httpUrl, dic, jqValidate, httpVueLoader, jqSelect, httpCom, evaluate, laydate) {

    window.vueDom = new Vue({
      el: '#store_box',
      data: {
        jquery: $,
        http: httpStore,
        options: {
          evaluate2: [],
          yes_no: []
        },
        formData: {
          pageNum: 1,
          pageSize: 5,
          orderBy: '', // 类目Id
          keyWord: '', // 类目Id
          evaluateType: '', // 类目Id
          replyFlag: '', // 类目Id
          addCntFlag: '', // 类目Id
          cntEmptyFlag: '', // 类目Id
          startDate: '', // 类目Id
          endDate: '', // 类目Id
        },
        eList: [],
        isSubmitDisabled: false,
        pages: 1,
        total: 0
      },
      mounted: function () {
        var vm = this
        laydate.render({
          elem: '#timeStart',
          format: 'yyyy-MM-dd HH:mm:ss',
          startkey: 'startDate',
          type: 'datetime',
          done: function (value, date, endDate) { //选择日期完毕的回调
            vm.formData[this.startkey] = value;
          }
        })
        laydate.render({
          elem: '#timeEnd',
          format: 'yyyy-MM-dd HH:mm:ss',
          endkey: 'endDate',
          type: 'datetime',
          done: function (value, date, endDate) { //选择日期完毕的回调
            vm.formData[this.endkey] = value;
          }
        })
      },
      components: {
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.initData();
      },
      methods: {
        initData: function () {
          this.getOptions([
            { "code": "evaluate", group: 2 },
            { "code": "yes_no" }
          ])
          this.handleSearchList()
        },
        // 获取多个标准码
        getOptions: function (keys) {
          var vm = this
          httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (codes) {
                codes.dictIInfos.unshift({ id: '-1', value: '', display: "全部" })
                vm.options[codes.code + (codes.group || '')] = codes.dictIInfos
              })
            }
          })
        },
        handleSearchList: function () {
          var vm = this;
          evaluate.selectByPage(this.formData).then(function (res) {
            if (res.code == 'rest.success') {
              vm.eList = res.result.list;
              vm.pages = res.result.pages;
              vm.total = res.result.total
            }
          })
        },
        handleResetSearch: function () {
          this.formData.keyWord = ''
          this.formData.evaluateType = ''
          this.formData.replyFlag = ''
          this.formData.addCntFlag = ''
          this.formData.cntEmptyFlag = ''
          this.formData.startDate = ''
          this.formData.endDate = ''
          this.handleSearchList();
        },
        handleReplySubmit: function (ei) {
          var row = this.eList[ei]
          if (row.reply) {
            var vm = this;
            !vm.isSubmitDisabled && (vm.isSubmitDisabled = true, evaluate.insert({ contentId: row.contentDetailsViewList.slice(-1)[0].evaluateContentId, reply: row.reply }).then(function (res) {
              if (res.code == 'rest.success') {
                vm.$dialog.showToast('回复成功！')
                vm.handleSearchList();
              }
              vm.isSubmitDisabled = false
            }).catch(function () {
              vm.isSubmitDisabled = false
            })
            )
          } else {
            this.$dialog.showToast('请输入回复内容！')
          }
        },
        isShowPage: function (index) {
          var pageNum = this.formData.pageNum;
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
          var pageNum = this.formData.pageNum;
          var row = parseInt(pageNum / 2);
          var index = row * 2 - 1;
          return !(index + 4 > this.pages);
        },
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.formData.pageNum = index;
            this.chooseAllList = [];
            $('#chooseall').find(".chooseall").removeClass("active")
            $(".sciencelist").find(".choosesingle").removeClass("active");
            this.handleSearchList();
          }
        }
      }
    });
  });
});
