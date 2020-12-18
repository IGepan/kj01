// JavaScript Document

require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom) {

    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        httpUser: httpUser,
        httpCom: httpCom,
        formData: {
          identityType: '01',
          id: '',
          userId: '', // 用户id
          realName: '', // 真实姓名
          // birthday: '', // 出生年月
          sex: '1', // 性别(字典表：sex)
          personalCertificateType: '', // 证件类型(字典表：personal_certificate_t
          personalCertificateCode: '', // 证件号码
          personalCertificateAttachmentId1: '', // 证件附件1Id
          personalCertificateAttachmentId2: '', // 证件附件2Id
          expireDate: '', // 到期时间
          workAddress: '', // 工作地址
          alwaysValidFlag: '0', // 长期有效标识(字典表：yes_no)
          attachmentIdUrl1: undefined,
          attachmentIdUrl2: undefined,
          version: '', // 版本号
        },
        provincePid: '',
        cityPid: '',
        districtPid: '',
        industrySelectList: [],
        servicesSelectList: [],
      },
      created: function () {
        this.initData();
      },
      mounted: function () {
        var vm = this;
        //				this.$dialog.confirm({})
        $(".img1").imgUploader({
          size: "300,300",
          prev: "head",
          url: httpUrl.imgUploadUrl + '/file/resource/uploadImg'
        });
        $(".img2").imgUploader({
          size: "300,300",
          prev: "head",
          url: httpUrl.imgUploadUrl + '/file/resource/uploadImg'
        });
      },
      components: {
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'ly-select': httpVueLoader('/common/components/select.vue'),
        'ly-radio': httpVueLoader('/common/components/radio.vue'),
      },
      methods: {
        initData: function () {
          var vm = this;
          httpUser.detailPersonAuthen().then(function (res) {
            vm.formData = $.extend(vm.formData, res.result);
            vm.formData.attachmentIdUrl1 = vm.formData.personalCertificateAttachment1.url;
            vm.formData.attachmentIdUrl2 = vm.formData.personalCertificateAttachment2.url;
            vm.formData.personalCertificateAttachmentId1 = vm.formData.personalCertificateAttachment1.id;
            vm.formData.personalCertificateAttachmentId2 = vm.formData.personalCertificateAttachment2.id;
          })
          httpUser.industrySelect().then(function (res) {
            vm.industrySelectList = res.result;
            $("#industrySelect").mySelect({
              mult: true,//true为多选,false为单选
              option: vm.industrySelectList,
              onChange: function (vals) {//选择框值变化返回结果
                vm.formData.industryIds = vals;
              }
            });
          })
          httpUser.servicesSelect().then(function (res) {
            vm.servicesSelectList = res.result;
            $("#servicesSelect").mySelect({
              mult: true,//true为多选,false为单选
              option: vm.servicesSelectList,
              onChange: function (vals) {//选择框值变化返回结果
                vm.formData.servicesIds = vals;
              }
            });
          })
        },
        submitClick: function () {
          var vm = this;
          // 异步获取验证信息
          $('.valiform').validate('submitValidate', function (val) {
            if (val) {
              httpUser.updatePersonAuthen(vm.formData).then(function (resp) {
                if (resp.code === 'rest.success') {
                  vm.$dialog.showToast('提交成功');
                  httpUser.detailPersonAuthen().then(function (res) {
                    vm.formData = $.extend(vm.formData, res.result);
                  })
                }
              })
            }
          });
        },
				/**
				 * 图片上传回调
				 */
        imgUploadSuccess (id, url, type) {
          if (type === '01') {
            this.formData.personalCertificateAttachmentId1 = id;
            this.formData.attachmentIdUrl1 = url;
          } else {
            this.formData.personalCertificateAttachmentId2 = id;
            this.formData.attachmentIdUrl2 = url;
          }
        },
				/**
				 * 到期时间验证
				 */
        expireDateValid (v, o, callback) {
          var vm = this;
          setTimeout(function () {
            v = vm.formData.expireDate;
            if (vm.formData.alwaysValidFlag == '1' || (v && v != '')) {
              callback(o)
            } else {
              callback(o, '证件到期时间不能为空');
            }
          }, 200)
        },
      },
    });
  });
});
