// JavaScript Document

require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'seller', 'httpUser', 'httpStore', 'jqValidate', 'httpUrl', 'jqSelect'], function ($, Vue, dic, httpVueLoader, userCenter, seller, httpUser, httpStore, jqValidate, httpUrl, jqSelect) {
    window.vueDom = new Vue({
      el: '#store_box',
      mixins: [userCenter, seller],
      data: {
        httpUser: httpUser,
        formData: {
          headImg: '',
          userBasicId: '', // 用户基本信息主键
          userName: '', // 用户名
          displayName: '', // 用户昵称
          industryIds: '', // 行业主键
          servicesIds: '', // 服务领域主键
          identityType: '01', // 身份类型(字典表:identity_type)
          country: '', //所在地区_国家(字典表:administrative_division)
          province: '', // 所在地区_省份(字典表:administrative_division)
          city: '', // 所在地区_城市(字典表:administrative_division)
          district: '', // 所在地区_区县(字典表:administrative_division)
          location: '', // 详细地址
          attachmentIdUrl: undefined,
          email: '', // 电子邮箱
          telephone: '', // 固定电话
          comment: '', // 简介
          realName: '', // 真实姓名
          visibleFlag: '1', // 自己可见
          birthday: '', // 出生年月
          sex: '1', // 性别(字典表：sex)
          scale: '', // 单位规模
          version: '' // 版本号
        },
        http: httpStore,
        jquery: $,
        provincePid: '',
        cityPid: '',
        districtPid: '',
        industrySelectList: [],
        servicesSelectList: [],
      },
      watch: {
        activeTabsIndex (val) {
          console.log(val)
          if (val != 0) {
            this.formData.identityType = '02'
          } else {
            this.formData.identityType = '01'
          }
        }
      },
      created () {
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
      },
      components: {
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'ly-select': httpVueLoader('/common/components/select.vue'),
        'ly-radio': httpVueLoader('/common/components/radio.vue'),
        'ly-address-select': httpVueLoader('/common/components/addressSelect.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      methods: {
        initData () {
          var vm = this;
          httpUser.detail().then(function (res) {
            if (res.code != 'rest.success') {
              return;
            }
            res.result.identityType = '01';
            vm.formData = $.extend(vm.formData, res.result);
            laydate.render({
              elem: '#birthday', //指定元素
              value: vm.formData.birthday,
              done: function (val) { //选择日期完毕的回调
                vm.formData.birthday = val;
              },
            });
            var addressArr = vm.$refs.addressRef;
            addressArr.setValues([vm.formData.country, vm.formData.province, vm.formData.city, vm.formData.district]);
            httpUser.industrySelect().then(function (res) {
              vm.industrySelectList = res.result;
              vm.industrySel = $("#industrySelect").mySelect({
                mult: true, //true为多选,false为单选
                option: vm.industrySelectList,
                onChange: function (vals) { //选择框值变化返回结果
                  vm.formData.industryIds = vals;
                }
              })
              console.log(vm.formData.industryIds)
              vm.industrySel.setResult(vm.formData.industryIds);
            })
            httpUser.servicesSelect().then(function (res) {
              vm.servicesSelectList = res.result;
              vm.serviceSel = $("#servicesSelect").mySelect({
                mult: true, //true为多选,false为单选
                option: vm.servicesSelectList,
                onChange: function (vals) { //选择框值变化返回结果
                  vm.formData.servicesIds = vals;
                }
              });
              vm.serviceSel.setResult(vm.formData.servicesIds);
            })
          })

        },
        industryValid (v, o, callback) {
          if (!this.industrySel || this.formData.industryIds.length == 0) {
            callback(o, '所属行业不能为空')
          } else {
            callback()
          }
        },
        servicesValid (v, o, callback) {
          if (!this.serviceSel || this.formData.servicesIds.length == 0) {
            callback(o, '服务领域不能为空');
          } else {
            callback()
          }
        },
        addressValid (v, o, callback) {
          var vm = this;
          setTimeout(function () {
            vm.getAddressValue();
            if (vm.formData.country == '' || vm.formData.province == '' || vm.formData.city == '' || vm.formData.district == '') {
              callback(o, '所在地区不能为空');
            } else {
              callback()
            }
          }, 800)

        },
        initSelect () {
          var vm = this;
          vm.$nextTick(function () {

            if (vm.servicesSelectList && vm.servicesSelectList.length > 0) {
              vm.serviceSel = $("#servicesSelect1").mySelect({
                mult: true, //true为多选,false为单选
                option: vm.servicesSelectList,
                onChange: function (vals) { //选择框值变化返回结果
                  vm.formData.servicesIds = vals;
                }
              });
            }
            if (vm.industrySelectList && vm.industrySelectList.length > 0) {
              vm.serviceSel.setResult(vm.formData.servicesIds);
              vm.industrySel = $("#industrySelect1").mySelect({
                mult: true, //true为多选,false为单选
                option: vm.industrySelectList,
                onChange: function (vals) { //选择框值变化返回结果
                  vm.formData.industryIds = vals;
                }
              });
              vm.industrySel.setResult(vm.formData.industryIds);
            }
          })
        },
				/**
				 * 个人修改
				 */
        submitClick () {
          this.getAddressValue();
          var vm = this;
          //					// 异步获取验证信息
          $('.valiform').validate('submitValidate', function (val) {
            // 验证成功
            if (val) {
              httpUser.updatePerson(vm.formData).then(function () {
                vm.$dialog.showToast('修改成功')
              })
            } else {
              console.log('验证失败')
            }
          });
        },
				/**
				 * 企业修改
				 */
        updateEnterprise () {
          // 获取地区
          this.getAddressValue();
          var vm = this;
          // 异步获取验证信息
          $('.valiform').validate('submitValidate', function (val) {
            // 验证成功
            if (val) {
              httpUser.updateEnterprise(vm.formData).then(function () {
                vm.$dialog.showToast('修改成功')
              })
            } else {
              console.log('验证失败')
            }
          });
        },
				/**
				 * 修改高校信息
				 */
        updateSchool () {
          var vm = this;
          // 获取地区
          vm.getAddressValue();
          // 异步获取验证信息
          $('.valiform').validate('submitValidate', function (val) {
            // 验证成功
            if (val) {
              httpUser.updateSchool(vm.formData).then(function () {
                vm.$dialog.showToast('修改成功')
              })
            } else {
              console.log('验证失败')
            }
          });

        },
				/**
				 * 修改政府团体信息
				 */
        updateDepart () {
          // 获取地区
          this.getAddressValue();
          var vm = this;
          // 异步获取验证信息
          $('.valiform').validate('submitValidate', function (val) {
            // 验证成功
            if (val) {
              httpUser.updateDepart(vm.formData).then(function () {
                vm.$dialog.showToast('修改成功')
              })
            } else {
              console.log('验证失败')
            }
          });
        },
        getAddressValue () {
          var addressArr = this.$refs.addressRef.getSelected();
          this.formData.country = addressArr[0];
          this.formData.province = addressArr[1];
          this.formData.city = addressArr[2];
          this.formData.district = addressArr[3];
        },
				/**
				 * 用户名校验
				 */
        userNameValid (v, o, callback) {
          httpUser.checkUserNameOnly({
            userName: v
          }).then(function (res) {
            if (res.code !== 'rest.success') {
              callback(o, res.desc)
            } else {
              callback()
            }
          })
        },
        tabChange () {
          var vm = this;
          this.initSelect();
          this.$nextTick(function () {
            var addressArr = vm.$refs.addressRef;
            if (addressArr) {
              addressArr.setValues([vm.formData.country, vm.formData.province, vm.formData.city, vm.formData.district]);
            }
          })
        },
        identityTypeChange (val) {
          var vm = this;
          this.$nextTick(function () {
            this.initSelect();
            laydate.render({
              elem: '#establishDate', //指定元素
              value: vm.formData.establishDate,
              done: function (val) { //选择日期完毕的回调
                vm.formData.establishDate = val;
              },
            });
            var addressArr = vm.$refs.addressRef;
            if (addressArr) {
              addressArr.setValues([vm.formData.country, vm.formData.province, vm.formData.city, vm.formData.district]);
            }
          })

        },
				/**
				 * 图片上传回调
				 */
        imgUploadSuccess (id, url, type) {
          this.formData.headImg = id;
          this.formData.attachmentIdUrl = url;
        }
      },
    });
  });
});
