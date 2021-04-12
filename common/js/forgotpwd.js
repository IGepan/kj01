// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'img_captcha', 'vue', 'httpLogin', 'httpUrl', 'base64', 'dic', 'validate', 'httpVueLoader'], function ($, captcha, Vue, httpLogin, httpUrl, base64, dic, validate, httpVueLoader) {
    new Vue({
      el: '#reg_box',
      data: {
        step: 0,
        code: '',
        phone: '',
        name: '',
        pwd_1: '',
        pwd_2: '',
        error: {},
        noError: true,
        btn_disabled: true,
        btn_code_disabled: true,
        isShowDialog: false,
        codeTime: 60,
        codeBtnText: '发送验证码',
        webInfo:'',
      },
      components: {
        'validate-dialog': httpVueLoader('/common/components/validateDialog.vue'),
        'ly-footer': httpVueLoader('/style/components/main_footer.vue')
      },
      mounted(){
        if(location.href.indexOf('/site/')>-1){
          this.getPublicDetail()
        }
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
        toService: function () {
          window.open('http://www.kj01.cn/service.htm?arg=10113491&amp;style=4&amp;kflist=off&amp;kf=edwinzuo&amp;zdkf_type=1&amp;lnk_overflow=0&amp;callback_id6ds=10152438&amp;language=zh-cn&amp;charset=gbk&amp;referer={hz6d_referer}&amp;keyword=http%3A%2F%2Fwww.kjy01.com%2Findex.html&amp;tfrom=1&amp;tpl=crystal_blue', '_blank', 'height=600,width=800,top=50,left=200,status=yes,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,titlebar=no');
        },
        toStep: function (n) {
          if (this.btn_disabled) return;
          if (n === 1) {
            this.step = 1;
            this.btn_disabled = true;
          } else if (n === 2) {
            this.checkCode();
          }
        },
        validateType: function (type, key, value) {
          this.$set(this.error, key, '');
          switch (type) {
            case 'pwd':
              if (!/^[\w_\.!@#\$\^&\*\+-~`%]{6,16}$/.test(value)) {
                this.throwError(key, '请输入6-16位密码（字母、数字、特殊符号，区分大小写）');
              }
              break;
            case 'phone':
              if (!/^1\d{10}$/.test(value)) {
                this.throwError(key, '请输入正确的手机号');
              }
              break;
            case 'code':
              if (!/^\d{6}$/.test(value)) {
                this.throwError(key, '请输入正确的验证码');
              }
              break;
            case 'name':
              if (value.length < 1 || value.length > 20) {
                this.throwError(key, '请输入用户名(20字符以内)');
              }
              break;
          }
        },
        validate: function (n, cb) {
          this.error = {};
          this.noError = true;
          if (n === 1) {
            this.validateType('name', 'name', this.name);
          } else if (n === 2) {
            this.validateType('phone', 'phone', this.phone);
            this.validateType('code', 'code', this.code);
          } else if (n === 3) {
            this.validateType('pwd', 'pwd_1', this.pwd_1);
            this.validateType('pwd', 'pwd_2', this.pwd_2);
            if (this.noError && this.pwd_1 !== this.pwd_2) {
              this.throwError('pwd_2', '两次密码不一致');
            }
          } else if (n === 4) {
            this.validateType('phone', 'phone', this.phone);
          }
          cb.call(this, this.noError);
        },
        throwError: function (key, err) {
          this.noError = false;
          this.$set(this.error, key, err);
        },
        sendCode: function () {
          var $this = this;
          if (!$this.btn_code_disabled) {
            $this.isShowDialog = true;
            setTimeout(function () {
              $this.$refs.validateRef.initImg(captcha, httpUrl);
            }, 300);
          }
        },
        onSuccess: function (captchaData) {
          var vm = this;
          vm.isShowDialog = false;
          vm.btn_code_disabled = true;
          vm.token = captchaData.token;
          httpLogin.sendCaptchaCode({
            validateSrc: this.phone,
            businessType: dic.businessType.pwd,
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
                  vm.btn_code_disabled = false
                  vm.codeBtnText = '发送验证码'
                }
              }, 1000)
              vm.$dialog.showToast('验证码已发送');
            } else {
              vm.$dialog.showToast('验证码发送失败');
              vm.btn_code_disabled = false
            }
          }).catch(function (error) {
            vm.$dialog.showToast('验证码发送失败');
            vm.btn_code_disabled = false
          });
        },
        checkPhone: function () {
          var $this = this;
          this.validate(4, function (v) {
            if (v) {
              $this.btn_code_disabled = true;
              $this.btn_disabled = true;
              $this.$http.get(httpUrl.baseUrl + '/user/checkUserNameAndPhone', { userName: this.name, phone: this.phone }).then(function (res) {
                if (res.code === 'rest.success') {
                  $this.btn_code_disabled = $this.btn_disabled = !res.result;
                  if (!res.result) {
                    $this.$set($this.error, 'phone', '手机号码与用户名不匹配');
                  }
                }
              });
            }
          });
        },
        checkCode: function () {
          var $this = this;
          this.validate(2, function (v) {
            if (v) {
              $this.btn_disabled = true;
              $this.$http.post(httpUrl.baseUrl + '/verify/checkCaptchaCode', {
                userName: this.name, captchaCode: this.code, validateSrc: this.phone,
                businessType: dic.businessType.pwd
              }).then(function (res) {
                if (res.code === 'rest.success') {
                  $this.step = 2;
                }
                $this.btn_disabled = false;
              });
            }
          });
        },
        checkUserName: function () {
          var $this = this;
          this.validate(1, function (v) {
            if (v) {
              $this.$http.get(httpUrl.baseUrl + '/user/checkUserName', { userName: this.name }).then(function (res) {
                if (res.code === 'rest.success') {
                  $this.btn_disabled = !res.result;
                  if (!res.result) {
                    $this.$set($this.error, 'name', '用户名不存在');
                  }
                }
              });
            }
          });
        },
        resetPwd: function () {
          var $this = this;
          this.validate(3, function (v) {
            if (v) {
              $this.btn_disabled = true;
              $this.$http.post(httpUrl.baseUrl + '/user/resetPassword', { validateContent: this.code, userName: this.name, phone: this.phone, newPassword: $.base64.encode($this.pwd_1) }).then(function (res) {
                if (res.code === 'rest.success') {
                  $this.btn_disabled = false;
                  $dialog.showToast('修改密码成功，正在跳转至登录页...');
                  setTimeout(function () {
                    window.location.href = this.$pathPrefix+'/common/login.html';
                  }, 2000);
                } else {
                  $dialog.showToast('修改密码失败，正在刷新页面...');
                  setTimeout(function () {
                    window.location.reload();
                  }, 2000);
                }
              });
            }
          });
        }
      }
    })
  })
})
