// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'img_captcha', 'vue', 'httpLogin', 'httpUrl', 'base64', 'dic', 'validate', 'httpVueLoader'], function ($, captcha, Vue, httpLogin, httpUrl, base64, dic, validate, httpVueLoader) {
    new Vue({
      el: '#reg_box',
      data: {
        forward: '',
        code: '',
        form: {
          phone: '',
          validateContent: '',
          password: '',
          protocolReadFlag: true
        },
        codeTime: 60,
        isDisabled: false,
        codeBtnText: '发送验证码',
        phoneErrorMsg: '',
        protocolReadFlagErrorMsg: '',
        isPhoneError: false,
        isShowPwd: false,
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
        this.$httpCom.protocol({
          protocolType: 1
        }).then(function (res) {
          if (res.result) {
            // $(".cover").css("display", "table").hide().fadeIn(300);
            vm.protocol[0].content = res.result.protocolContact;
          }
        })
        this.$httpCom.protocol({
          protocolType: 5
        }).then(function (res) {
          if (res.result) {
            // $(".cover").css("display", "table").hide().fadeIn(300);
            vm.protocol[1].content = res.result.protocolContact;
          }
        })
      },
      created: function () {
        var $this = this;
        var url;
        this.forward = this.$utils.getReqStr('forward');
        this.code = this.$utils.getReqStr('code');
        this.type = this.$utils.getReqStr('type');
        if (!this.forward || !this.code || !this.type) {
          $dialog.showToast('非法访问');
          setTimeout(function () {
            window.location.href = '/common/login.html';
          }, 1000);
          return;
        }
        switch (this.type) {
          case 'qq':
            url = '/open/qqLogin';
            break;
          case 'wx':
            url = '/open/wxLogin';
            break;
          default: return;
        }
        this.$http.post(httpUrl.baseUrl + url, { code: this.code }).then(function (res) {
          if (res.code === 'rest.success') {
            if (res.result.isComplete) {
              // var ob = { 'access_token': res.result.token };
              // localStorage.setItem(dic.locaKey.USER_INFO, JSON.stringify(ob));
              res.result.access_token = res.result.token
              $this.$utils.delCookie(dic.locaKey.LOGIN_INFO);
              $this.$utils.setCookie(dic.locaKey.LOGIN_INFO, res.result);
              setTimeout(function () {
                $this.$httpCom.webCommonUser().then(function (res) {
                  if (res.code === 'rest.success') {
                    $this.$utils.delCookie(dic.locaKey.USER_INFO);
                    $this.$utils.setCookie(dic.locaKey.USER_INFO, res.result);
                    localStorage.setItem(dic.locaKey.SAASID, res.result.saasId);
                    localStorage.setItem(dic.locaKey.USER_INFO, JSON.stringify(res.result));
                    window.location.href = $this.forward;
                  }
                });
              }, 200);
            }
          }
        });
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
          this.isPhoneError = false;
          var phone = this.form.phone;
          if (!(/^1[34578]\d{9}$/.test(phone))) {
            this.isPhoneError = true;
            this.phoneErrorMsg = '请输入正确的手机号';
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
              event.preventDefault();
              var param = {
                openCode: vm.code,
                phone: vm.form.phone,
                type: vm.type,
                token: vm.token,
                code: vm.form.validateContent,
                password: vm.isShowPwd ? $.base64.encode(vm.form.password) : ''
              };
              vm.isSubmitDisabled = true
              vm.$http.post(httpUrl.baseUrl + '/open/completeInfo', param).then(function (res) {
                if (res.code === 'rest.success') {
                  // var ob = { 'access_token': res.result.token };
                  // localStorage.setItem(dic.locaKey.USER_INFO, JSON.stringify(ob));
                  res.result.access_token = res.result.token
                  vm.$utils.delCookie(dic.locaKey.LOGIN_INFO);
                  vm.$utils.setCookie(dic.locaKey.LOGIN_INFO, res.result);
                  setTimeout(function () {
                    vm.$httpCom.webCommonUser().then(function (res) {
                      if (res.code === 'rest.success') {
                        vm.$utils.delCookie(dic.locaKey.USER_INFO);
                        vm.$utils.setCookie(dic.locaKey.USER_INFO, res.result);
                        localStorage.setItem(dic.locaKey.SAASID, res.result.saasId);
                        localStorage.setItem(dic.locaKey.USER_INFO, JSON.stringify(res.result));
                        window.location.href = vm.forward;
                      }
                    });
                  }, 200);
                } else if (res.code === 'msg.error.codeInvalid') {
                  setTimeout(function () {
                    window.location.href = '/common/login.html';
                  }, 1000);
                }
                vm.isSubmitDisabled = false
              }).catch(function () {
                vm.isSubmitDisabled = false
              });
            }
          })
        },
        phoneChange: function () {
          var vm = this;
          vm.phoneErrorMsg = '';
          this.validatePhone();
          if (!this.isPhoneError) {
            httpLogin.checkPhone({
              phone: vm.form.phone
            }).then(function (data) {
              if (data.code !== 'rest.success') {
                $dialog.confirm({
                  texts: '该手机号已注册，需要输入原密码，是否继续绑定？', callback: function () {
                    vm.isShowPwd = true;
                  }, cancel: function () {
                    vm.form.phone = '';
                    vm.isShowPwd = false;
                  }
                });
              } else {
                vm.isShowPwd = false;
              }
            }, function (data) {

            })
          }
        },
				/**
				 * 滑块验证成功
				 */
        onSuccess: function (captchaData) {
          var vm = this;
          vm.isShowDialog = false;
          vm.isDisabled = true;
          vm.token = captchaData.token;
          httpLogin.sendCaptchaCode({
            validateSrc: this.form.phone,
            businessType: dic.businessType.bindphone,
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
