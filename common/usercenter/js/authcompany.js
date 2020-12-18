// JavaScript Document

require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom, dialog) {

    window.vueDom = new Vue({
      el: '#index_box',
      httpCom: httpCom,
      mixins: [userCenter],
      data: {
        httpUser: httpUser,
        formData: {
          identityType: '02',
          id: '', //
          saasId: '', //
          userId: '', //	用户Id
          organizationName: '', // 机构名称
          organizationType: '', // 机构类型(字典表:organization_type)
          academyType: '', // 院校分类(字典表:academy_type)
          scale: '', // 规模(字典表:scale)
          parentUnit: '', // 归属单位
          establishDate: '', // 成立时间
          contacts: '', // 联系人
          contactsPhone: '', // 联系人手机
          unifiedCode: '', // 统一社会信用代码
          organizationCode: '', // 组织机构代码证
          certificatImgs: [], // 证件图片
          attachmentIdUrl: undefined,
          businessDuration: '', // 营业年限
          certificatCountry: '', // 证件所在地国家(字典表:administrati
          certificatProvince: '', // 证件所在地省份(字典表:administrative_
          certificatCity: '', // 证件所在地城市(字典表:administrative_division)
          certificatDistrict: '', // 证件所在地区县(字典表:administrative_division)
          commonLocation: '', // 常用地址
          legalPersonName: '', // 法人姓名
          legalPersonCertificatType: '', // 法人证件类型(字典表：certificate_type)
          legalPersonCertificatCode: '', // 法人证件号码
          alwaysValidFlag: '0', // 长期有效标识(字典表：yes_no)
          expireDate: '', // 到期时间
          version: '' // 版本号
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
        $(".edithead").imgUploader({
          size: "300,300",
          prev: "head",
          url: httpUrl.imgUploadUrl + '/file/resource/uploadImg'
        });
        laydate.render({
          elem: '#business', //指定元素
          value: vm.formData.businessDuration,
          done: function (val) { //选择日期完毕的回调
            vm.formData.businessDuration = val;
          },
        });
        laydate.render({
          elem: '#expireDate', //指定元素
          value: vm.formData.expireDate,
          done: function (val) { //选择日期完毕的回调
            vm.formData.expireDate = val;
          },
        });
      },
      components: {
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'ly-select': httpVueLoader('/common/components/select.vue'),
        'ly-radio': httpVueLoader('/common/components/radio.vue'),
        'ly-address-select': httpVueLoader('/common/components/addressSelect.vue'),
      },
      methods: {
        initData: function () {
          var vm = this;
          httpUser.detailEnterpriseAuthen().then(function (res) {
            vm.formData = $.extend(vm.formData, res.result);
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
				/**
				 * 地址验证
				 */
        addressValid (v, o, callback) {
          var vm = this;
          setTimeout(function () {
            vm.getAddressValue();
            if (vm.formData.country == '' || vm.formData.province == '' || vm.formData.city == '' || vm.formData.district == '') {
              callback(o, '请选择营业执照所在地');
            } else {
              callback(o);
            }
          }, 500)

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
				/**
				 * 证件图片验证
				 */
        certificatImgsValid (v, o, callback) {
          if (this.formData.certificatImgs && this.formData.certificatImgs.length > 0) {
            callback(o);
          } else {
            callback(o, '请上传证件扫描件');
          }
        },
				/**
				 * 营业年限校验
				 */
        businessValid (v, o, callback) {
          var vm = this;
          setTimeout(function () {
            v = $('#business').val();
            if (v && v != '') {
              callback(o)
            } else {
              callback(o, '营业年限不能为空');
            }
          }, 200)

        },
        getAddressValue: function () {
          var addressArr = this.$refs.addressRef.getSelected();
          this.formData.country = addressArr[0];
          this.formData.province = addressArr[1];
          this.formData.city = addressArr[2];
          this.formData.district = addressArr[3];
        },
        submitClick: function () {
          var vm = this;
          // 异步获取验证信息
          $('.valiform').validate('submitValidate', function (val) {
            // 验证成功
            if (val) {
              httpUser.updateSchoolAuthen(vm.formData).then(function () {
                if (resp.code === 'rest.success') {
                  vm.$dialog.showToast('提交成功');
                  httpUser.detailEnterpriseAuthen().then(function (res) {
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
          this.formData.headImg = id;
          this.formData.attachmentIdUrl = url;
        },
        radioChange (val) {
          this.$nextTick(function () {
            $('.valiform').validate('clear');
          })
        }
      },
    });
  });
});
