require(['/common/js/require.config.js'], function () {
 require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/helper.js'], function ($, Vue, httpVueLoader, indexApi) {
  new Vue({
   el: '#index_box',
   data: {
    breadcrumb: [
     {
      label: '资讯',
      url: '/poindex.html'
     },
     {
      label: '项目申报',
      url: '/declaration.html'
     },
     {
      label: '申报助手'
     }
    ],
    tabList: [],
    helperList: [],
    pages: {},
    searchForm: {
     pageNum: 1,
     pageSize: 6,
     type: ''
    },
   },
   components: {
    'ly-toper': httpVueLoader('/style/components/toper.vue'),
    'user-heads': httpVueLoader('/style/components/user-heads.vue'),
    'sub-head': httpVueLoader('/style/components/sub-head.vue'),
    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
    'pages': httpVueLoader('/style/components/pages.vue'),
   },
   created: function () {
    this.getDicList([{ code: 'assistant_type' }])
    this.getAssistant()
   },
   methods: {
    getDicList: function (key) {
     var vm = this
     this.$httpCom.dictList({ dictInfos: key }).then(function (res) {
      if (res.code === 'rest.success') {
       res.result[0].dictIInfos.unshift({ id: "-1", display: "全部", value: '' })
       vm.tabList = res.result[0].dictIInfos.map(function (dic, i) {
        dic.selected = !i
        dic.itemUrl = '/declarationHelper/list.html?type=' + dic.value
        return dic
       })
      }
     })
    },
    getAssistant: function () {
     var vm = this
     indexApi.assistantSelectByPage(this.searchForm).then(function (res) {
      if (res.code === 'rest.success') {
       vm.$data.helperList = res.result.list
       vm.pages = res.result
      }
     })
    },
    bindPageChange: function (e) {
     this.$data.searchForm.pageNum = e;
     this.getAssistant()
    },
    tabChange: function (value, i) {
     this.$data.searchForm.type = value
     this.tabList.forEach((item, ti) => {
      item.selected = ti === i
     });
     this.getAssistant()
    }
   }
  })
 })
})