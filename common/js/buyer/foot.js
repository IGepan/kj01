// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser','/style/js/api/mail.js', 'httpCom', 'fileSaver'],
      function ($, Vue, dic, httpVueLoader, userCenter, httpUser, indexApi, httpCom, fileSaver) {

    new Vue({
      el: '#index_box',
      data: function () {
        return {
          http: httpUser,
          httpCom: httpCom,
          jquery: $,
          fileUploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
          uploadData: {
            system: 'ts'
          },
          options: {
            operations: [
              {
                id: 1,
                display: '修改',
                value: 'updateAppraise'
              },
              {
                id: 2,
                display: '追评',
                value: 'addappraise'
              }
            ]
          },
          queryForm: {
            pageNum: 1,	// 	第几页	是	[string]		查看
            pageSize: 10,	// 	每页显示多少行	是	[string]		查看
            orderBy: '',	// 	排序字段	是	[string]		查看
            keyWord: '',	// 		关键字
            evaluateType: '',	// 评价类型(字典表：evaluate)
            total: 0
          },
          updateForm: {},
          tempForm: {},
          isOpenUpdateDialog: false,
          apendForm: {
            fileIds: []
          },
          formData: {
            pageSize: 20,
            pageNum:1
          },
          footList:[],
          show:false,
          isOpenAppendDialog: false,
          isSubmitDisabled: false,
          orderList: [],
          pages: 1,
          pageCount: 4
        }
      },
      watch: {},
      filters: {
        getOperations: function (o, v, s) {
          var r = []
          v === '1' && r.push(o[0])
          s === '1' && r.push(o[1])
          return r
        },
        formatPrice2: function (flag, v, n, m) {
          if (flag === '1') {
            return '面议'
          } else {
            if (typeof v !== 'undefined') {
              return (v / 10000).toFixed(2)
            } else if (!v && !m) {
              return (n / 10000).toFixed(2)
            } else {
              return (n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)
            }
          }
        },
      },
      mounted: function () { },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-star': httpVueLoader('/common/components/starts.vue'),
        'ly-upload': httpVueLoader('/common/components/upload.vue'),
        'ly-checkbox': httpVueLoader('/components/checkbox.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
        'pages': httpVueLoader('/style/components/pages.vue')
      },
      created: function () {
        this.selectByPage()
      },
      methods: {
        selectByPage: function () {
          var vm = this
          indexApi.selectMailGoodsPrint(this.formData).then(function (res) {
            if (res.code === 'rest.success') {
              vm.footList = res.result
              vm.$data.pages = res.result.pageInfo || ''
            }
          })
        },
        handelRemove: function (id) {
          var vm = this
          var ids = new Array(id);
          for (var i = 0; i < vm.footList.list.length; i++) {
            for (var j = 0; j < vm.footList.list[i].datalist.length; j++) {
              var data = vm.footList.list[i].datalist[j]
              if (data.id === id) {
                vm.footList.list[i].datalist.splice(j, 1)
                if (vm.footList.list[i].datalist.length == 0) {
                  vm.footList.list.splice(i, 1)
                }
              }
            }
          }
        },
        handelMore: function () {
          var vm = this
          if (vm.footList.hasNextPage) {

            indexApi.selectMailGoodsPrint(this.formData).then(function (res) {
              if (res.code === 'rest.success') {
                for (var i = 0; i < res.result.list.length; i++) {
                  if (vm.footList.list.length == 0) {
                    vm.footList.list.push(res.result.list[i])
                    return;
                  }
                  var group = res.result.list[i].date
                  var last = vm.footList.list[vm.footList.list.length - 1].date
                  if (group === last) {
                    for (var j = 0; j < res.result.list[i].datalist.length; j++) {
                      vm.footList.list[vm.footList.list.length - 1].datalist.push(res.result.list[i].datalist[j])
                    }
                  } else {
                    vm.footList.list.push(res.result.list[i])
                  }
                }
                vm.$data.pages = res.result.pageInfo || ''
                vm.footList.hasNextPage = res.result.hasNextPage

              }
            })
          }

        },
        // 移入
        mouseOver() {
          this.show = true
        },
        // 移出
        mouseLeave() {
          this.show = false
        },
        bindPageChange: function (e) {
          this.formData.pageNum = e
          this.handelMore()
        },
      }
    });
  });
});
