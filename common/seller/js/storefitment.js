require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'httpVueLoader', 'seller', 'httpCom'], function ($, Vue, httpStore, httpUrl, dic, httpVueLoader, seller, httpCom) {

    new Vue({
      el: '#store_box',
      data: {
        uploadHeader: {},
        uploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
        uploadData: {
          system: 'ts'
        },
        tempIndex: 0,
        meanTree: [],
        userSeller: {},
        http: httpStore,
        templateList: [],
        formList: [],
        http: httpStore,
        isSubmitDisabled: false,
        activeTemplate: undefined, // 当前选中模板
        httpCom: httpCom
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
        var vm = this;
        httpStore.shoptempletSelectByPage({
          pageNum: 1,
          pageSize: 3
        }).then(function (res) {
          vm.templateList = res.result.list;
          vm.activeTemplate = vm.templateList[0];
          vm.initTemp(vm.templateList[0].id);
        })

      },
      mounted: function () {

      },
      methods: {
        initTemp: function (id) {
          var vm = this;
          httpStore.shopsetInit({
            templetId: id
          }).then(function (resp) {
            vm.formList = resp.result;
            vm.$nextTick(function () {
              if (vm.$refs.colorRef) {
                vm.$refs.colorRef[0].initColor();
              }
            })
          })
        },
        imgUploadSuccess: function (successInfo) {
          if (successInfo.exp.controlType == '02') {
            successInfo.exp.defaultValueList.push({
              url: successInfo.data.url,
              value: successInfo.data.id
            });
          } else if (successInfo.exp.controlType == '03') {
            successInfo.exp.defaultValueList = [{
              url: successInfo.data.url,
              value: successInfo.data.id
            }]
          }

        },
				/**
				 * 预览
				 */
        previewClick: function () {
          var vm = this;
          var param = this.getParams();
          httpStore.shopsetPreview(param).then(function (res) {
            // window.location.href = res.result.previewAddress;
            window.open(vm.$pathPrefix+res.result.previewAddress);
          })
        },
				/**
				 * 保存
				 */
        saveClick: function () {
          var vm = this;
          var param = this.getParams();
          !vm.isSubmitDisabled && (vm.isSubmitDisabled = true, httpStore.shopsetUpdate(param).then(function (res) {
            if (res.code === 'rest.success') {
              vm.$dialog.showToast('保存成功');
            }
            vm.isSubmitDisabled = false
          }).catch(function () {
            vm.isSubmitDisabled = false
          })
          )
        },
				/**
				 * 获取上传参数
				 */
        getParams: function () {
          var params = {
            templetId: this.activeTemplate.id,
            propertyList: []
          }
          for (var item of this.formList) {
            for (var defa of item.defaultValueList) {
              params.propertyList.push({
                propertyId: item.propertyId,
                value: defa.value,
                controlType: item.controlType
              })
            }
          }
          return params;
        },
				/**
				 * 删除图片
				 */
        delImgClick: function (pIndex, index) {
          this.formList[pIndex].defaultValueList.splice(index, 1)
        },
				/**
				 * 获取模板详情
				 * @param {Object} id
				 */
        shoptempletDetail: function (id) {
          var vm = this;
          httpStore.shoptempletDetail({
            templetId: id
          }).then(function (res) {
            vm.formList = res.result;
            vm.$nextTick(function () {
              if (vm.$refs.colorRef) {
                vm.$refs.colorRef[0].initColor();
              }
            })
          })
        },
				/**
				 * 获取其他模板默认信息
				 * @param {Object} temp
				 * @param {Object} index
				 */
        otherTemplateClick: function (temp, index) {
          if (index == 0) {
            this.initTemp(temp.id);
          } else {
            this.shoptempletDetail(temp.id);
          }
        }
      }
    });
  });
});
