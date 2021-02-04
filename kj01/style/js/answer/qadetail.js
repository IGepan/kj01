require(['/common/js/require.config.js'], function () {
 require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/answer.js','httpUrl'], function ($, Vue, httpVueLoader, indexApi,httpUrl) {
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
      label: '政策问答',
      url: '/answer/index.html'
     },
     {
      label: '详情'
     }
    ],
    detail: {}
   },
   components: {
    'ly-toper': httpVueLoader('/style/components/toper.vue'),
    'user-heads': httpVueLoader('/style/components/user-heads.vue'),
    'sub-head': httpVueLoader('/style/components/sub-head.vue'),
    'web-footer': httpVueLoader('/style/components/web_footer.vue')
   },
   created: function () {
    var str = this.$utils.getReqStr('id')
    if (str.indexOf('type') === -1) {
     id = str
    } else {
     let arr = str.split('type=')
     id = arr[0]
     let obj = {}
     obj.label = '政策问答列表'
     obj.url = '/answer/detail.html?type=' + arr[1]
     this.breadcrumb.splice(2, 0, obj)
    }
    this.getDetail({ id: id })
   },
   methods: {
    getDetail: function (id) {
     var vm = this
     indexApi.getFaqById(id).then(function (res) {
      if (res.code === 'rest.success') {
       vm.$data.detail = res.result
      }
     })
    },
   }
  })
 })
})
