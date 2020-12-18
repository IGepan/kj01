// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'img_captcha', 'vue', 'httpLogin', 'httpUrl', 'base64', 'dic', 'validate', 'httpVueLoader'], function ($, captcha, Vue, httpLogin, httpUrl, base64, dic, validate, httpVueLoader) {
    new Vue({
      el: '#reg_box',
      data: {
        form: {
          phone: '',
          validateContent: '',
          password: '',
          protocolReadFlag: false
        },
        codeTime: 60,
        isDisabled: false,
        codeBtnText: '发送验证码',
        phoneErrorMsg: '',
        protocolReadFlagErrorMsg: '',
        isPhoneError: false,
        isShowDialog: false,
        protocol: [
          {
            title: '服务协议详情',
            content: ''
          }, {
            title: '隐私保护协议',
            content: ''
          }
        ],
        isSubmitDisabled: false,
        protocolType: 0
      },
      mounted: function () {
        var vm = this;
        vm.$httpCom.protocol({
          protocolType: 1
        }).then(function (res) {
          if (res.result) {
            vm.protocol[0].content = res.result.protocolContact;
          }
        })
        vm.$httpCom.protocol({
          protocolType: 5
        }).then(function (res) {
          if (res.result) {
            vm.protocol[1].content = res.result.protocolContact;
          }
        })
      },
      components: {
        'validate-dialog': httpVueLoader('/common/components/validateDialog.vue'),
        'ly-footer': httpVueLoader('/style/components/main_footer.vue')
      },
      methods: {
        showMsg: function (d) {
          var defaults = {
            msg: "",
            type: "error"
          }
          var opts = $.extend(defaults, d);
          var cln = opts.type == "error" ? "error" : opts.type == "success" ? "success" : "";
          $('#msg').removeClass().addClass(cln).html(opts.msg);
        },
        agreeClick: function (type) {
          this.protocolType = type
          $(".cover").css("display", "table").hide().fadeIn(300);
        },
        clsClick: function () {
          $(".cover").fadeOut(300);
        },
				/**
				 * 校验手机
				 */
        validatePhone: function () {
          // 空校验
          if (this.form.phone == '') {
            this.isPhoneError = true;
            this.phoneErrorMsg = '请输入手机号';
          }
          // 格式校验
          var phone = this.form.phone;
          if (!(/^1\d{10}$/.test(phone))) {
            this.isPhoneError = true;
            this.phoneErrorMsg = '请输入正确的手机号';
            return false;
          }
        },
				/**
				 * 发送短信
				 */
        sendClick: function (event) {
          event.preventDefault() //阻止form表单默认提交
          this.validatePhone();
          if (this.isPhoneError) {
            return;
          }
          this.isShowDialog = true;
          var vm = this;
          setTimeout(function () {
            vm.$refs.validateRef.initImg(captcha, httpUrl);
          }, 200)
        },
        regClick: function (event) {
          // 手机校验
          this.validatePhone();
          if (this.isPhoneError) {
            event.preventDefault() //阻止form表单默认提交
            return;
          }
          var vm = this;
          !vm.isSubmitDisabled && $("#reg_form").validate({
            rules: {
              validateContent: {
                required: true,
              },
              password: {
                required: true,
                rangelength: [6, 16]
              },
              protocolReadFlag: {
                required: true
              }
            },
            messages: {
              validateContent: {
                required: "<span class='form_error'>请输入验证码</span>"
              },
              password: {
                required: "<span class='form_error'>请输入密码</span>",
                rangelength: "<span class='form_error'>密码格式不正确</span>"
              },
              protocolReadFlag: {
                required: "<span class='form_error'>协议必须阅读</span>"
              }
            },
            submitHandler: function (form, event) {
              event.preventDefault() //阻止form表单默认提交
              var param = JSON.parse(JSON.stringify(vm.form));

              vm.isSubmitDisabled = true
              param.password = $.base64.encode(param.password)
              param.protocolReadFlag = param.protocolReadFlag ? 1 : 0
              httpLogin.register(param).then(function (res) {
                if (res.code === 'rest.success') {
                  vm.$dialog.showToast('注册成功');
                  setTimeout(function () {
                    window.location.href = '/common/login.html'
                  }, 1000)
                } else {
                  vm.isSubmitDisabled = false
                }
              }).catch(function () {
                vm.isSubmitDisabled = false
              })
            }
          })
        },
        phoneChange: function () {
          var vm = this;
          vm.phoneErrorMsg = '';
          httpLogin.checkPhone({
            phone: vm.form.phone
          }).then(function (data) {
            if (data.code != 'rest.success') {
              vm.phoneErrorMsg = data.desc;
              vm.isPhoneError = true;
            } else {
              vm.isPhoneError = false;
            }
          }, function (data) {

          })
        },
				/**
				 * 滑块验证成功
				 */
        onSuccess: function (captchaData) {
          var vm = this;
          vm.isShowDialog = false;
          vm.isDisabled = true
          httpLogin.sendCaptchaCode({
            validateSrc: this.form.phone,
            businessType: dic.businessType.reg,
            type: 'slider',
            token: captchaData.token,
            code: captchaData.code
          }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.codeBtnText = vm.codeTime;
              var interval = setInterval(function () {
                vm.codeBtnText--;
                if (vm.codeBtnText == 0) {
                  clearInterval(interval);
                  vm.isDisabled = false
                  vm.codeBtnText = '发送验证码'
                }
              }, 1000)
              vm.$dialog.showToast('验证码已发送');
            } else {
              vm.$dialog.showToast('验证码发送失败');
              vm.isDisabled = false
            }
          }).catch(function (error) {
            vm.$dialog.showToast('验证码发送失败');
            vm.isDisabled = false
          });
        }
      }
    })
  })
})
