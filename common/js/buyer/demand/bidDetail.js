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
        bidDetailId: '',
        bidDetailList: {},
        formData: {},
        baseFilePath: httpUrl.imgUploadUrl,
      },
      mounted: function () { },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'buyer-left': httpVueLoader('/common/components/buyerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        var id = this.$utils.getReqStr('id')
        if (id) {
          this.didDetailId = id
          this.getbidDetailList()
        }
      },
      methods: {
        getbidDetailList: function () {
          var vm = this
          httpDemandApi.didDetail({ id: this.didDetailId }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.bidDetailList = res.result
            }
          })
        },
        fileSaveAs: function (file) {
          var url = httpUrl.imgUploadUrl + '/file/download?filePath=' + file.path;
          // this.$utils.openNewTable(url);
          saveAs(url, file.name);
        },
        // fileSaveAs: function(i){
        //   var fileInfo = this.bidDetailList.demandFiles[i]
        //   saveAs(this.baseFilePath + '/file/download?filePath=' + fileInfo.path, fileInfo.name)
        // },
        // fileSaveT: function(t){
        //   var fileInfo = this.bidDetailList.bidFiles[t]
        //   saveAs(this.baseFilePath + '/file/download?filePath=' + fileInfo.path, fileInfo.name)
        // },
        // fileSaveK: function(k){
        //   var fileInfo = this.bidDetailList.checkFiles[k]
        //   saveAs(this.baseFilePath + '/file/download?filePath=' + fileInfo.path, fileInfo.name)
        // }
      }
    });
  });
});
