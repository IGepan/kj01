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
        phoneErrorMsg: '',
        protocolReadFlagErrorMsg: '',
        isPhoneError: false,
        isShowDialog: false,
        isSubmitDisabled: false,
        protocolType: 0,
        webInfo:''
      },
      components: {
        'validate-dialog': httpVueLoader('/common/components/validateDialog.vue'),
        'ly-footer': httpVueLoader('/style/components/main_footer.vue')
      },
      methods: {
        getPublicDetail(){
          let vm=this;
          this.$httpCom.publicDetail().then(function(res) {
            if (res.code === "rest.success") {
              vm.webInfo = res.result;
              vm.monitorSetItem('webInfo', JSON.stringify(vm.webInfo));
            }
          });
        },
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

            submitHandler: function (form, event) {
              event.preventDefault() //阻止form表单默认提交
              var param = JSON.parse(JSON.stringify(vm.form));

              vm.isSubmitDisabled = true
              param.password = $.base64.encode(param.password)
              param.protocolReadFlag = param.protocolReadFlag ? 1 : 0
              httpLogin.registerForOurself(param).then(function (res) {
                if (res.code === 'rest.success') {
                  vm.$dialog.showToast('注册成功');
                  setTimeout(function () {
                    var suffixUrl;
                    var url = this.window.location.href
                    if (url.indexOf('?') > 0) {
                      suffixUrl = url.substring(url.indexOf('?') + 1);

                    }
                    if (suffixUrl) {
                      window.location.href = this.$pathPrefix+'/common/login.html'+suffixUrl;
                    }
                    // window.location.href = this.$pathPrefix+'/common/login.html';
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

      }
    })
  })
})
