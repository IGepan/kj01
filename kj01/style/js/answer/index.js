require(['/common/js/require.config.js'], function () {
 require(['jquery','vue', 'httpVueLoader', '/style/js/api/answer.js','httpUrl'], function ($,Vue, httpVueLoader, indexApi,httpUrl) {
  new Vue({
   el: '#index_box',
   data: {
    cmsUrl: httpUrl.cmsUrl,
    breadcrumb: [
     {
      label: '政策资讯',
      url: '/polist.html'
     },
     {
      label: '政策问答'
     }
    ],
    answerList: [],
    pages: {},
    searchForm: {
     pageNum: "1",
     pageSize: "4",
     limit: '5'
    },
   },
   components: {
    'ly-toper': httpVueLoader('/style/components/toper.vue'),
    'user-heads': httpVueLoader('/style/components/user-heads.vue'),
    'sub-head': httpVueLoader('/style/components/sub-head.vue'),
    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
    'pages': httpVueLoader('/style/components/pages.vue'),
   },
   created:function() {
    this.getAnswerList()
   },
   methods: {
    getAnswerList: function () {
     var vm = this
     indexApi.selectByPage(vm.searchForm).then(function(res){
      if(res.code === 'rest.success'){
       vm.$data.answerList = res.result.list
       vm.$data.pages = res.result
      }
     })
    },
    bindPageChange: function (e) {
     this.$data.searchForm.pageNum = e;
     this.getAnswerList()
    }
   }
  })
 })
})
