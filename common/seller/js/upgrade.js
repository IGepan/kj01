require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'httpVueLoader', 'httpCom', 'seller', 'jqValidate'], function ($, Vue, httpStore, httpUrl, dic, httpVueLoader, httpCom, seller, jqValidate) {

    new Vue({
      el: '#store_box',
      data: {
        http: httpStore,
        httpCom: httpCom,
        fileUploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
        uploadData: {
          system: 'ts'
        },
        dataForm: {
          certificationFlagDisPlay:'',
          noPassReason:'',
          contractNo:'',
          files: []
        }
      },
      mixins: [seller],
      components: {
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'color-template': httpVueLoader('./components/colorTemplate.vue'),
        'ly-upload': httpVueLoader('/common/components/upload.vue'),
        'pic-template': httpVueLoader('./components/picTemplate.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.getInitData()
      },
      methods: {
        //初始化数据
        getInitData: function () {
          httpStore.upgradeDetail().then(res => {
            if (res.code === 'rest.success') {
              res.result && (this.dataForm = res.result) && res.result.files && (this.dataForm.files = res.result.files || [])
            }
          })
        },
        //图片上传成功
        handleUploadSuccess: function (successInfo) {
          this.dataForm.files.push(successInfo.data)
          this.$forceUpdate()
        },
        //删除图片
        handleDelFile: function (i) {
          this.dataForm.files.splice(i, 1)
          this.$forceUpdate()
        },
        saveClick: function () {
          var vm = this;
          let form = {}
          let fileList = []
          vm.dataForm.files && vm.dataForm.files.length && vm.dataForm.files.forEach(element => {
            element.id && fileList.push(element.id)
          });
          form.contractNo = vm.dataForm.contractNo
          form.files = fileList
          form.version = vm.dataForm.version
          httpStore.validateActive().then(res => {
            if (res.code === 'msg.shop.info.pleaseActive') {
              var options = {
                title: '温馨提示',
                texts: '请先激活店铺！',
                buttons: ['现在就去', '稍后激活'],
                callback: function () {
                  location = vm.$pathPrefix+'/common/seller/activate.html?code=001.002.001.003'
                }
              }
              this.$dialog.confirm(options)
            } else {
              httpStore.upgradeSave(form).then(res => {
                if (res.code === 'rest.success') {
                  vm.$dialog.showToast('保存成功');
                  vm.getInitData()
                }
              })
            }
          })
        }
      }
    });
  });
});
