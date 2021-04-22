require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'jqValidate', 'httpVueLoader', 'seller', 'jqSelect', 'addpatentKey', 'httpCom', 'httpDemandApi', 'fileSaver'], function ($, Vue, httpStore, httpUrl, dic, jqValidate, httpVueLoader, seller, jqSelect, addpatentKey, httpCom, httpDemandApi, fileSaver) {

    window.vueDom = new Vue({
      el: '#store_box',
      data: {
        detailList: {},
        formData: {},
        options: {
          'demand_status': [],
          'demand_type': []
        },
        jquery: $,
        http: httpStore,
        httpCom: httpCom
      },
      mixins: [seller, addpatentKey],
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.getDetail();
        this.getOptions([
          { "code": "demand_type" },
          { "code": "demand_status" },
          { "code": "demand_stage" },
          { "code": "certification_status" }
        ]);
      },
      mounted: function () {
      },
      methods: {
        fileSaveAs: function (file) {
          var url = httpUrl.imgUploadUrl + '/file/download?filePath=' + file.path;
          //this.$utils.openNewTable(url);
          saveAs(url, file.name);
        },
        getDetail: function () {
          var vm = this;
          httpDemandApi.didDetail({ id: this.$utils.getReqStr('id') }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.logList && res.result.logList.some(function (log, i) {
                if (!log.opTime) {
                  res.result.logList[i ? i - 1 : i].selected = true
                  return true
                }
              });
              vm.detailList = res.result
            }
          });
        },
        getOptions: function (keys) {
          var vm = this
          httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (codes) {
                codes.dictIInfos.unshift({ id: '-1', value: '', display: "不限" })
                vm.options[codes.code] = codes.dictIInfos
              })
            }
          })
        }
      }
    });
  });
});
