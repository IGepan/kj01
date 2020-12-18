require(['/common/js/require.config.js'], function () {
 require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/answer.js','httpUrl'], function ($, Vue, httpVueLoader, indexApi,httpUrl) {
  new Vue({
   el: '#index_box',
   data: {
    cmsUrl: httpUrl.cmsUrl,
    breadcrumb: [
     {
      label: '资讯',
      url: '/poindex.html'
     },
     {
      label: '政策问答',
      url: '/answer/index.html'
     },
     {
      label: '政策问答列表'
     }
    ],
    qadetail: [],
    pages: {},
    searchForm: {
     pageNum: "1",
     pageSize: "10",
     type: ''
    },
    typeDisplay:''
   },
   components: {
    'ly-toper': httpVueLoader('/style/components/toper.vue'),
    'user-heads': httpVueLoader('/style/components/user-heads.vue'),
    'sub-head': httpVueLoader('/style/components/sub-head.vue'),
    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
    'pages': httpVueLoader('/style/components/pages.vue'),
   },
   created: function () {
    var type = this.$utils.getReqStr('type')
    this.searchForm.type = type
    this.getQadetail(this.searchForm)
   },
   methods: {
    getQadetail: function (searchForm) {
     var vm = this
     indexApi.selectByType(searchForm).then(function (res) {
      if (res.code === 'rest.success') {
       vm.$data.qadetail = res.result.list
       vm.typeDisplay = vm.$data.qadetail[0].typeDisplay
       vm.$data.pages = res.result
      }
     })
    },
    bindPageChange: function (e) {
     this.$data.searchForm.pageNum = e;
     this.getQadetail(this.$data.searchForm)
    }
   }
  })
 })
})