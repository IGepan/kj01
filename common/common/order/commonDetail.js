var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpCom', 'dialog', 'httpUrl', 'fileSaver'], function ($, Vue, dic, httpCom, dialog, httpUrl, fileSaver) {
    new Vue({
      el: '#index_box',
      data: {
        detailInfo: {}
      },
      created: function () {
        this.getOrderInfo(this.$utils.getReqStr('id'), this.$utils.getReqStr('code'))
      },
      methods: {
        getOrderInfo: function (id, code) {
          var vm = this
          httpCom.commonOrder({ id: id, shortCode: code || '' }).then(function (res) {
            if (res.code == 'rest.success') {
              let l = res.result.logList.length
              res.result.logList.some(function (log, i) {
                if (!log.opTime) {
                  res.result.notimei = i
                }
                return !log.opTime
              })
              res.result.logfull = 0
              res.result.logList[l - 1].opTime && (res.result.notimei = l, res.result.logfull = 1)
              vm.$data.detailInfo = res.result
            }
          })
        },
        fileSaveAs: function (file, name) {
          var url = httpUrl.imgUploadUrl + '/file/download?filePath=' + file;
          saveAs(url, name);
        }
      }
    })
  })
})
