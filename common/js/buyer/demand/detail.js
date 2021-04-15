// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'httpDemandApi', 'httpCom', 'fileSaver', 'httpUrl'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, httpDemandApi, httpCom, fileSaver, httpUrl) {
    new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        http: httpUser,
        httpCom: httpCom,
        jquery: $,
        detailId: '',
        detailList: {},
        baseFilePath: httpUrl.imgUploadUrl,
      },
      mounted: function () { },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        var id = this.$utils.getReqStr('id')
        if (id) {
          this.detailId = id
          this.getDetailList()
        }
      },
      methods: {
        getDetailList: function (id) {
          var vm = this
          httpDemandApi.detailDemand({ id: this.detailId }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.logList && res.result.logList.some(function (log, i) {
                if (!log.opTime) {
                  res.result.logList[i ? i - 1 : i].selected = true
                  return true
                }
              })
              vm.detailList = res.result
              if (vm.detailList.budget === -1) {
                vm.detailList.budget='面议'
              }
            }
          })
        },
        //验收信息-附件
        fileSaveAsCheck: function (file) {
          if(file.name.indexOf('.pdf')>-1){
            this.$utils.openNewTable('/common/buyer/demand/preview.html?id='+file.id);
          }else{
            var url = httpUrl.imgUploadUrl + '/file/download?filePath=' + file.path;
            saveAs(url, file.name)
          }
        },
        fileSaveAs: function (file, name) {
          var url = httpUrl.imgUploadUrl + '/file/download?filePath=' + file.path;
          // this.$utils.openNewTable(url);

          saveAs(url, file.name)
        },
        // fileSaveAs: function(i){
        //   var fileInfo = this.detailList.fileList[i]
        //   saveAs(this.baseFilePath + '/file/download?filePath=' + fileInfo.path, fileInfo.name)
        // },
        // fileSaveK: function(k){
        //   var fileInfo = this.detailList.bidFileList[k]
        //   saveAs(this.baseFilePath + '/file/download?filePath=' + fileInfo.path, fileInfo.name)
        // },
        // fileSaveB: function(b){
        //   var fileInfo = this.detailList.checkFileList[b]
        //   saveAs(this.baseFilePath + '/file/download?filePath=' + fileInfo.path, fileInfo.name)
        // },
      }
    });
  });
});
