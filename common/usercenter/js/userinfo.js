// JavaScript Document

require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom'],
      function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom) {

    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        httpUser: httpUser,
        httpCom: httpCom,
        formData: {
          companyName: '', //单位名称
          job: '', //职位
          headImg: '',
          userBasicId: '', // 用户基本信息主键
          userName: '', // 用户名
          displayName: '', // 用户昵称
          industryList: [], // 行业主键
          servicesList: [], // 服务领域主键
          identityType: '', // 身份类型(字典表:identity_type)
          country: '', //所在地区_国家(字典表:administrative_division)
          province: '', // 所在地区_省份(字典表:administrative_division)
          city: '', // 所在地区_城市(字典表:administrative_division)
          district: '', // 所在地区_区县(字典表:administrative_division
          location: '', // 详细地址
          attachmentIdUrl: '',
          qualifications: [],
          email: '', // 电子邮箱
          telephone: '', // 固定电话
          comment: '', // 简介
          realName: '', // 真实姓名
          visibleFlag: '1', // 自己可见
          birthday: '', // 出生年月
          sex: '1', // 性别(字典表：sex)
          scale: '', // 单位规模
          version: '', // 版本号
          code: '',// 统一社会信用代码
          focusPolicy: '', //关注的政策
          focusPolicyName: '', // 
        },
        alias: {
          organizationNames: {
            '02': '企业名称：',
            '03': '院校名称：',
            '04': '机构名称：',
            '05': '单位名称：'
          },
          scaleNames: {
            '02': '企业规模：',
            '04': '机构规模：',
            '05': '单位规模：'
          },
          industryNames: {
            '01': '所属行业：',
            '02': '所属行业：',
            '03': '重点研究领域：',
            '04': '重点研究领域：',
            '05': '主导产业：'
          },
          servicesNames: {
            '01': '服务领域：',
            '02': '服务领域：',
            '03': '重点服务领域：',
            '04': '重点服务领域：',
            '05': '重点服务领域：'
          },
          parentUnitNames: {
            '02': '归属单位：',
            '03': '所属单位：',
            '04': '所属机构：',
            '05': '上级管理部门：'
          },
          submitFun: {
            '01': 'updatePerson',
            '02': 'updateEnterprise',
            '03': 'updateSchool',
            '04': 'updateMechanism',
            '05': 'updateDepart'
          },
          subDatas: {
            '01': ['saasId', 'userBasicId', 'userName', 'displayName', 'headImg', 'industryList', 'servicesList', 'identityType', 'country', 'province', 'city', 'district', 'location', 'email', 'telephone', 'comment', 'realName', 'birthday', 'sex', 'visibleFlag', 'version'],
            '02': ['saasId', 'userBasicId', 'userName', 'displayName', 'headImg', 'industryList', 'servicesList', 'identityType', 'country', 'province', 'city', 'district', 'location', 'email', 'telephone', 'comment', 'realName', 'birthday', 'sex', 'visibleFlag', 'certificationFlag', 'organizationName', 'organizationType', 'academyType', 'scale', 'parentUnit', 'establishDate', 'contacts', 'contactsPhone', 'version', 'qualifications'],
            '03': ['saasId', 'userBasicId', 'userName', 'displayName', 'headImg', 'industryList', 'servicesList', 'identityType', 'country', 'province', 'city', 'district', 'location', 'email', 'telephone', 'comment', 'realName', 'birthday', 'sex', 'visibleFlag', 'certificationFlag', 'organizationName', 'organizationType', 'academyType', 'scale', 'parentUnit', 'establishDate', 'contacts', 'contactsPhone', 'version'],
            '04': ['saasId', 'userBasicId', 'userName', 'displayName', 'headImg', 'industryList', 'servicesList', 'identityType', 'country', 'province', 'city', 'district', 'location', 'email', 'telephone', 'comment', 'realName', 'birthday', 'sex', 'visibleFlag', 'certificationFlag', 'organizationName', 'organizationType', 'academyType', 'scale', 'parentUnit', 'establishDate', 'contacts', 'contactsPhone', 'version'],
            '05': ['saasId', 'userBasicId', 'userName', 'displayName', 'headImg', 'industryList', 'servicesList', 'identityType', 'country', 'province', 'city', 'district', 'location', 'email', 'telephone', 'comment', 'realName', 'birthday', 'sex', 'visibleFlag', 'certificationFlag', 'organizationName', 'organizationType', 'academyType', 'scale', 'parentUnit', 'establishDate', 'contacts', 'contactsPhone', 'version']
          },
          organizationTypeNames: {
            '02': '企业类型：',
            '03': '办学类型：',
            '04': '机构性质：',
            '05': '单位类型：'
          },
          organizationTypeGroups: {
            '02': '1',
            '03': '2',
            '04': '4',
            '05': '3'
          },
        },
        // 基本数据的Form数据
        baseFormData: {},
        // 初始化的Form数据
        initIdentityType: '01',
        initFormData: {},
        http: httpUser,
        jquery: $,
        imgOption: {
          size: '300,300',
          prev: 'head',
          url: httpUrl.imgUploadUrl + '/file/resource/uploadImg'
        },
        qualification: [],
        isShowMap: false,
        isCertificationed: false,
        timeEl: {},
        isSubmitDisabled: false,
        isinitData: false,
        focusList: []
      },
      watch: {
        'formData': {
          handler: function (newValue, oldValue) {
            this.isCertificationed = newValue.certificationFlag === '03';
          },
          deep: true
        }
      },
      created: function () {
        this.userNameValid();
        this.baseFormData = JSON.parse(JSON.stringify(this.formData));
        this.$httpCom.dict({ code: 'qualification' }).then(function (res) {
          if (res.code === 'rest.success') {
            this.qualification = res.result.map(function (i) {
              i.value = i.display
              return i
            })
          }
        }.bind(this))
        this.initData();
        this.getFocusPolicy();
      },
      mounted: function () {
        var vm = this;
        this.imgUploader = $('.edithead0').imgUploader(this.imgOption);
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'ly-select': httpVueLoader('/common/components/select.vue'),
        'ly-radio': httpVueLoader('/common/components/radio.vue'),
        'ly-address-select': httpVueLoader('/common/components/addressSelect.vue'),
        'auth-left': httpVueLoader('/common/components/authLeft.vue'),
        'img-uploader': httpVueLoader('/common/components/imgUploader.vue'),
        'address-map': httpVueLoader('/common/components/addressMap.vue'),
        'ly-select-level': httpVueLoader('/common/components/selectLevel1.vue'),
        'ly-select-level2': httpVueLoader('/common/components/select2level.vue'),
        'ly-mulselect': httpVueLoader('/common/seller/components/technology/mulSelect.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      methods: {
        initData: function (flag) {
          var vm = this;
          httpUser.detail().then(function (res) {
            var formData = $.extend({}, vm.formData, res.result);
            formData.attachmentIdUrl = formData.headImg.url;
            formData.qualifications.length && (formData.qualifications = formData.qualifications.map(function (t) { return t.tagId }))
            formData.headImg = formData.headImg.id;
            formData.focusPolicy = formData.focusPolicyList ? formData.focusPolicyList : [];
            vm.initIdentityType = formData.identityType = formData.identityType || '01'
            vm.formData = formData
            vm.initFormData = JSON.parse(JSON.stringify(formData));
            vm.setDefaultValue()
          });
        },
        // 获取政策列表
        getFocusPolicy: function() {
          var vm = this;
          httpUser.getFocusPolicy().then(function(res) {
            console.log(res)
            vm.focusList = res.result;
          })
        },
				/**
				 * 数据校验自定义方法
				 */
        userNameValid: function (v, o, callback) {
          httpUser.checkUserNameOnly({
            userName: v
          }).then(function (res) {
            if (res.code === 'rest.success') {
              if (res.result) {
                callback(o)
              } else {
                callback(o, '用户名重复')
              }
            } else {
              callback(o)
            }
          })
        },
        industryValid: function (v, o, callback) {
          var identityType = this.formData.identityType
          var vm = this;
          if (identityType == '03') {
            callback(o);
            return;
          }
          setTimeout(function () {
            if (vm.formData.industryList.length == 0) {
              callback(o, identityType === '01' || identityType === '02' ? '所属行业不能为空' : identityType === '05' ? '主导产业不能为空' : '重点研究领域不能为空');
            } else {
              callback(o)
            }
          }, 800)
        },
        servicesValid: function (v, o, callback) {
          var identityType = this.formData.identityType
          var vm = this;
          if (identityType == '03') {
            callback(o);
            return;
          }
          setTimeout(function () {
            if (vm.formData.servicesList.length == 0) {
              callback(o, identityType === '01' || identityType === '02' ? '服务领域不能为空' : '重点服务领域不能为空');
            } else {
              callback(o)
            }
          }, 800)
        },
        addressValid: function (v, o, callback) {
          var vm = this;
          setTimeout(function () {
            vm.getAddressValue();
            if (vm.formData.country == '' || vm.formData.province == '') {
              callback(o, '所在地区不能为空');
            } else {
              callback(o)
            }
          }, 800)
        },
        clearMsg: function (code) {
          this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '', this.$refs[code + 'El'].style = '')
        },
        handleIndustryInput: function (v) {
          v.length && this.clearMsg('industry')
        },
        handleServicesInput: function (v) {
          v.length && this.clearMsg('services')
        },
        getAddressValue: function () {
          var addressArr = this.$refs.addressRef.getSelected();
          this.formData.country = addressArr[0];
          this.formData.province = addressArr[1];
          this.formData.city = addressArr[2];
          this.formData.district = addressArr[3];
        },
        // 提交保存信息
        submitClick: function () {
          this.getAddressValue();
          var vm = this;
          // 异步获取验证信息
          $('.valiform').validate('submitValidate', function (val) {
            // 验证成功
            if (val && !vm.isSubmitDisabled) {
              var data = vm.formData
              var formData = {}
              vm.isSubmitDisabled = true
              vm.alias.subDatas[data.identityType].map(function (key) {
                formData[key] = data[key] !== undefined ? data[key] : ''
              })
              formData.focusPolicy = data.focusPolicy ? data.focusPolicy.map(item => item.tagId).join(',') : '';
              formData.focusPolicyName = data.focusPolicy ? data.focusPolicy.map(item => item.name).join(',') : '';
              formData.code = data.code;
              formData.companyName = data.companyName;
              formData.job = data.job;
              console.log(formData, formData.code)
              httpUser[vm.alias.submitFun[data.identityType]](formData).then(function (resp) {

                if (resp.code == 'rest.success') {
                  vm.$dialog.showToast('保存成功');
                  vm.$httpCom.webCommonUser().then(function (res) {
                    if (res.code === 'rest.success') {
                      vm.$utils.delCookie(dic.locaKey.USER_INFO);
                      vm.$utils.setCookie(dic.locaKey.USER_INFO, res.result);
                      localStorage.setItem(dic.locaKey.SAASID, res.result.saasId);
                      localStorage.setItem(dic.locaKey.USER_INFO, JSON.stringify(res.result));
                      vm.initData()
                    }
                  })
                } else {
                  vm.isSubmitDisabled = false
                }
              }).catch(function () {
                vm.isSubmitDisabled = false
              })
            }
          });
        },
        identityTypeChange: function (val) {
          if (val === this.initIdentityType) {
            this.formData = JSON.parse(JSON.stringify(this.initFormData));
          } else {
            this.formData = JSON.parse(JSON.stringify(this.baseFormData));
            this.formData.version = this.initFormData.version;
            this.formData.identityType = val
          }
          this.setDefaultValue()
        },
        // 特殊处理默认值
        setDefaultValue: function () {
          this.$nextTick(function () {
            var data = this.formData
            var addressArr = this.$refs.addressRef;
            var navRadioRef = null
            var vm = this
            if (addressArr) {
              data.country ? addressArr.setValues([data.country, data.province, data.city, data.district]) : addressArr.reset();
            }
            // 初始化成立日期
            (data.identityType === '03' || data.identityType === '05') && laydate.render({
              elem: '#establishDate', //指定元素
              value: data.establishDate,
              done: function (val) { //选择日期完毕的回调
                vm.formData.establishDate = val;
              }
            })
            // 初始化生日
            data.identityType === '01' && laydate.render({
              elem: '#birthday', //指定元素
              value: data.birthday,
              done: function (val) { //选择日期完毕的回调
                vm.formData.birthday = val;
              },
            })
            // 审核失败、审核中不让切换
            if (data.certificationFlag === '02' || data.certificationFlag === '03') {
              navRadioRef = this.$refs.navRef;
              if (navRadioRef) {
                navRadioRef.setDisabeld();
              }
            }
            // 清除验证
            setTimeout(function () {
              $('.valiform').validate('clear');
            }, 100)
          })
        },
        // 图片上传回调
        imgUploadSuccess: function (id, url, type) {
          this.formData.headImg = id;
          console.log(url);
          this.$set(this.formData, 'attachmentIdUrl', url);
        },
        // 地图点击后回调
        mapClick: function (mapInfo) {
          this.formData.location = mapInfo.address;
          this.formData.longitude = mapInfo.lng;
          this.formData.latitude = mapInfo.lat;
          this.isShowMap = false;
        }
      },
    });
  });
});
