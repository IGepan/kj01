// JavaScript Document

require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'img_captcha', 'httpVueLoader', 'userCenter', 'httpUser', 'httpStore', 'httpUrl', 'httpCom'], function ($, Vue, dic, captcha, httpVueLoader, userCenter, httpUser, httpStore, httpUrl, httpCom) {

    Vue.component('validate-dialog', httpVueLoader('/common/components/validateDialog.vue'))
    window.vueDom = new Vue({
      el: '#index_box',
      data: {
        isConference:true,
        // isConference: true,
        httpCom: httpCom,
        jquery: $,
        http: httpUser,
        dic: dic,
        isShowDialog: false,
        isBind: false,
        platform: '',
        step: 1,
        isNextDisabled: false,
        isProtocol: false,
        verification: {
          text: '获取验证码',
          isDisabled: false
        },
        info: {
          phone: '',
          sphone: '',
          verification: ''
        },
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'auth-left': httpVueLoader('/common/components/authLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.code = this.$utils.getReqStr('code')
        this.getUserPhone()
        this.platform = this.isConference ? '易智网' : '成渝城市群'
      },
      methods: {
        getUserPhone: function () {
          var vm = this;
          httpStore.getUserPhone().then(function (res) {
            if (res.code === 'rest.success') {
              vm.info.phone = res.result.phone;
              vm.info.sphone = res.result.sphone;
              vm.info.phone && (vm.isBind = true)
            }
          }).catch(function (error) {
            vm.$dialog.showToast('网络异常，请重试！');
          });
        },
        /**
         * 滑块验证成功
         */
        onSuccess: function (captchaData) {
          var vm = this;
          vm.isShowDialog = false;
          vm.verification.isDisabled = true
          this.captchaData = captchaData;
          httpStore.sendCaptchaCode({
            validateSrc: this.info.phone,
            businessType: this.dic.businessType.destroy,
            type: 'slider',
            token: captchaData.token,
            code: captchaData.code
          }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.verification.text = 60;
              var interval = setInterval(function () {
                vm.verification.text--;
                if (vm.verification.text == 0) {
                  clearInterval(interval);
                  vm.verification.isDisabled = false
                  vm.verification.text = '获取验证码'
                }
              }, 1000)
              vm.$dialog.showToast('验证码已发送');
              vm.isNextDisabled = false;
            } else {
              // vm.$dialog.showToast('验证码发送失败');
              vm.verification.isDisabled = false
            }
          }).catch(function (error) {
            vm.$dialog.showToast('验证码发送失败');
            vm.verification.isDisabled = false
          });
        },
        cheackv: function () {
          if (this.info.verification && this.info.verification.length === 6) {
            return true
          }
          this.$dialog.showToast('请正确填写验证码！');
          return false
        },
        handleNext: function () {
          var vm = this;
          if (this.isProtocol) {
            httpStore.checkAccountDestroy().then(function (res) {
              if (res.code === 'rest.success') {
                vm.step = 2
              }
            }).catch(function (error) {
              vm.$dialog.showToast('网络异常，请重试！');
            });
          } else {
            this.$dialog.showToast('请先勾选阅读账号注销须知！');
          }
        },
        handleSendClick: function () {
          this.isShowDialog = true;
          var vm = this;
          setTimeout(function () {
            if (vm.$refs.validateRef) {
              vm.$refs.validateRef.initImg(captcha, httpUrl);
            }
          }, 200)
        },
        handleBindSubmit: function () {
          var vm = this;
          if (this.cheackv()) {
            vm.isNextDisabled = true
            httpStore.accountDestroy({ captchaCode: this.info.verification }).then(function (res) {
              if (res.code === 'rest.success') {
                vm.step = 3
                vm.isNextDisabled = false
              } else {
                vm.isNextDisabled = false
              }
            }).catch(function (error) {
              vm.$dialog.showToast('网络异常，请重试！');
              vm.isNextDisabled = false
            });
          }
        },
        handleCancel: function () {
          this.$utils.openNewTable('/common/usercenter/user_information.html?code=001.003.001.001', '_self');
        },
        handleIndex: function () {
          this.$utils.delCookie('USER_INFO');
          this.$utils.delCookie('LOGIN_INFO');
          localStorage.removeItem('USER_INFO');
          localStorage.removeItem('saasId');
          window.location.href = '/'
        },
        handleShowProtocol: function (e) {
          var vm = this
          vm.$httpCom.protocol({
            protocolType: 8
          }).then(function (res) {
            if (res.result) {
              var options = {
                class: 'full',
                title: '账号注销须知',
                texts: res.result.protocolContact,
                buttons: [
                  {
                    label: '确认阅读',
                    fun: function () {
                      vm.isProtocol = true
                      return 1
                    }
                  }
                ]
              }
              vm.$dialog.confirm2(options)
            }
          })
        }
      },
    });
  });
});
