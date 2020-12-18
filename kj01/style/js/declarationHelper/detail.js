require(['/common/js/require.config.js'], function () {
 require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/helper.js', 'dic','fileSaver'], function ($, Vue, httpVueLoader, indexApi, dic,fileSaver) {
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
      label: '申报助手',
      url: '/declarationHelper/list.html'
     },
     {
      label: '详情'
     }
    ],
    detailList: [],
    detail:''
   },
   components: {
    'ly-toper': httpVueLoader('/style/components/toper.vue'),
    'user-heads': httpVueLoader('/style/components/user-heads.vue'),
    'sub-head': httpVueLoader('/style/components/sub-head.vue'),
    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
   },
   created: function () {
    var id = this.$utils.getReqStr('id')
    this.getDetail(id)
   },
   methods: {
    getDetail: function (id) {
     var vm = this
     indexApi.assistantDetail({ id: id }).then(function (res) {
      if (res.code === 'rest.success') {
       vm.$data.detail = res.result
       vm.$data.detailList = res.result.types
       vm.$data.detailList.length && vm.$data.detailList.forEach(function (element) {
        if (element.connectionFile.length) {
         element.connectionFile.forEach(function (item) {
          item.flieType = item.name.substring(item.name.lastIndexOf(".") + 1)
          item.flieType = dic.imgs.indexOf(item.flieType) !== -1 ? 'tupian' : item.flieType
          item.flieType = dic.zips.indexOf(item.flieType) !== -1 ? 'yasuobao' : item.flieType
          item.flieType = dic.doc.indexOf(item.flieType) !== -1 ? 'word' : item.flieType
          item.flieType = dic.excel.indexOf(item.flieType) !== -1 ? 'excel' : item.flieType
          item.flieType = dic.ppt.indexOf(item.flieType) !== -1 ? 'ppt' : item.flieType
         })
        }
       })
      }
     })
    },
    handleFileSaveAs(i,fi) {
     var fileInfo = this.detailList[i].connectionFile[fi]
     if(fileInfo.canDownload === '1'){
      saveAs(httpUrl.imgUploadUrl + '/file/download?filePath=' + fileInfo.path, fileInfo.name)
     }
    },
    handleViewDetail(id){
     window.open('/ddetail.html?id=' + id)
    }
   }
  })
 })
})