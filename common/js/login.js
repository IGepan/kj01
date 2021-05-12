require(['/common/js/require.config.js'], function () {
  require(['jquery', 'img_captcha', 'vue', 'httpLogin', 'httpUrl', 'base64', 'dic', 'validate', 'httpVueLoader'], function ($, captcha, Vue, httpLogin, httpUrl, base64, dic, validate, httpVueLoader) {
    new Vue({
      el: '#login_box',
      data: {
        select: false,
        form: {
          username: '',
          auth_type: 'userName',
          token: '',
          code: '',
          password: ''
        },
        m_third_login: false,
        phoneErrorMsg: '',
        isShowDialog: false,
        isPhoneError: false,
        isDisabled: false,
        isSubmitDisabled: false,
        codeTime: 60,
        captchaData: {},
        m_host: ['kj01.liyantech.cn', 'kj.kjy01.com', 'www.kj01.cn','intell.liyantech.cn','www.znhpt.com','www.yzw.com'],
        codeBtnText: '发送验证码',
        webInfo:''
      },
      components: {
        'validate-dialog': httpVueLoader('/common/components/validateDialog.vue'),
        'ly-footer': httpVueLoader('/style/components/main_footer.vue')
      },
      created: function () {
        // this.m_third_login = this.m_host.indexOf(document.location.host) === -1;
        // console.log(this.m_host)
      },
      mounted: function () {
        var that = this;
        if(location.href.indexOf('/site/')>-1){
          that.getPublicDetail()
        }
        $(".slider").on("mousedown", function () {
          if (!that.form.token) {
            $("#captcha").find("canvas").stop().hide()
            $("#captcha").find("canvas").show();
          }
        });
        $(".select").on("click", function () {
          $(this).find("ul").show();
          $(this).addClass("active");
          that.select = true;
          return false;
        });
        $(".select").on("click", "li", function () {
          var t = $(this).text();
          $(this).parents(".select").find("dt").text(t);
          $(this).parents(".select").removeClass("active");
          $(this).parents("ul").hide();
          that.select = false;
          return false;
        });
        $("body").click(function () {
          if (that.select) {
            $(".select").removeClass("active");
            $(".select").find("ul").hide();
          }
        });
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
        openThird: function (type) {
          var origin = document.location.origin;
          var defurl = origin + '/index.html';
          var url, c;
          switch (type) {
            case 'qq':
              c = encodeURIComponent(origin + '/common/openLogin.html?type=qq&forward=' + (document.referrer || defurl));
              url = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101827022&state=liyan&redirect_uri=' + c;
              break;
            case 'wx':
              c = encodeURIComponent(origin + '/common/openLogin.html?type=wx&forward=' + (document.referrer || defurl));
              url = 'https://open.weixin.qq.com/connect/qrconnect?response_type=code&scope=snsapi_login&appid=wx7c0e8d13212bd69b&state=liyan&redirect_uri=' + c;
              break;
            default: return;
          }
          this.$utils.openNewTable(url);
        },
				/**
				 * 验证成功
				 */
        toSuccess: function (m) {
          this.form.token = m.token;
          this.form.code = m.code;
          $("#captcha").find("canvas").delay(500).fadeOut(500);
          this.showMsg({
            msg: "验证成功",
            type: "success"
          })
        },
				/**
				 * 清除验证信息
				 */
        cleanMsg: function () {
          this.showMsg({
            msg: ""
          });
          $("#captcha").find("canvas").fadeOut(500);
        },
				/**
				 * 显示验证信息
				 */
        showMsg: function (d) {
          var defaults = {
            msg: "",
            type: "error"
          }
          var opts = $.extend(defaults, d);
          var cln = opts.type == "error" ? "error" : opts.type == "success" ? "success" : "";
          $('#msg').removeClass().addClass(cln).html(opts.msg);
        },
				/**
				 * 登录方式切换点击
				 */
        tabsClick: function (index, event) {
          var i = index;
          this.form.username = '';
          this.form.password = '';
          this.form.token = '';
          this.form.code = '';
          this.isPhoneError = false;
          this.isDisabled = false
          this.phoneErrorMsg = ''
          this.form.auth_type = index == 0 ? 'userName' : 'phone';
          this.cleanMsg();
          $(event.srcElement).addClass("active").siblings("li").removeClass("active");
          $(".login_form").find(".form_item").eq(i).fadeIn(200).siblings(".form_item").hide();
        },
				/**
				 * 点击登录
				 */
        loginClick: function (event) {
          var vm = this;
          $("#login_form").validate({
            rules: {
              username: {
                required: true,
              },
              password: {
                required: true,
              },
              phone: {
                required: true,
              },
              code: {
                required: true,
              }
            },
            messages: {
              username: {
                required: "<span class='form_error'>请输入用户名</span>"
              },
              password: {
                required: "<span class='form_error'>请输入密码</span>"
              },
              phone: {
                required: "<span class='form_error'>请输入手机号</span>"
              },
              code: {
                required: "<span class='form_error'>请输入验证码</span>"
              }
            },
            submitHandler: function (form, event) {
              event.preventDefault() //阻止form表单默认提交
              if (vm.form.auth_type == 'phone') {
                vm.loginSubmit();
              } else {
                vm.isShowDialog = true;
                setTimeout(function () {
                  if (vm.$refs.validateRef) {
                    vm.$refs.validateRef.initImg(captcha, httpUrl);
                  }
                }, 200)
              }
            }
          })
        },
				/**
				 * 校验手机
				 */
        validatePhone: function () {
          var phone = this.form.username;
          this.isPhoneError = false;
          this.phoneErrorMsg = ''
          // 空校验
          if (phone == '') {
            this.isPhoneError = true;
            this.phoneErrorMsg = '请输入手机号';
          }
          // 格式校验
          if (!(/^1[34578]\d{9}$/.test(phone))) {
            this.isPhoneError = true;
            this.phoneErrorMsg = '请输入正确的手机号';
          } else {

          }
        },
        checkPhone: function () {
          var vm = this
          var phone = this.form.username;
          this.isPhoneError = false;
          this.phoneErrorMsg = ''
          if (/^1[34578]\d{9}$/.test(phone)) {
            httpLogin.checkPhone({ phone: phone }).then(function (res) {
              if (res.code === 'rest.success') {
                vm.isPhoneError = true;
                vm.isDisabled = true
                vm.phoneErrorMsg = '手机号未注册！';
              } else {
                vm.isDisabled = false
              }
            })
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
            if (vm.$refs.validateRef) {
              vm.$refs.validateRef.initImg(captcha, httpUrl);
            }
          }, 200)
        },
				/**
				 * 滑块验证成功
				 */
        onSuccess: function (captchaData) {
          var vm = this;
          vm.isShowDialog = false;
          vm.isDisabled = true
          this.captchaData = captchaData;
          if (this.form.auth_type == 'userName') { // 登录滑块验证
            this.loginSubmit();
          } else { // 发短信滑块验证
            httpLogin.sendCaptchaCode({
              validateSrc: this.form.username,
              businessType: dic.businessType.login,
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
        },
        /**
         * 跳转注册
         */
        handelReg: function () {
          var url = location.href
          if (url.indexOf('?') > 0) {
            var suffixUrl = url.substring(url.indexOf('?') + 1);

          }
          location.href=this.$pathPrefix+'/common/reg.html'+'?'+suffixUrl
        },
        loginSubmit: function () {
          var vm = this;
          vm.form.token = this.captchaData.token;
          vm.form.code = this.captchaData.code;
          var param = JSON.parse(JSON.stringify(vm.form));
          !vm.isSubmitDisabled && (this.isSubmitDisabled = true,
            param.password = $.base64.encode(param.password),
            httpLogin.oauth(param).then(function (data) {
              if (data.code == 'rest.success') {
                vm.$utils.delCookie(dic.locaKey.LOGIN_INFO);
                vm.$utils.setCookie(dic.locaKey.LOGIN_INFO, data.result);
                vm.$httpCom.webCommonUser().then(function (res) {
                  if (res.code === 'rest.success') {

                    var referrer = document.location.referrer
                    var toUrl = referrer
                    vm.$utils.delCookie(dic.locaKey.USER_INFO);
                    vm.$utils.setCookie(dic.locaKey.USER_INFO, res.result);
                    localStorage.setItem(dic.locaKey.SAASID, res.result.saasId);
                    localStorage.setItem(dic.locaKey.USER_INFO, JSON.stringify(res.result));
                    if (!referrer || referrer.indexOf('/reg.html') !== -1 || (referrer.indexOf('/seller') !== -1 && res.result.userTypes.indexOf('002') === -1) || referrer.indexOf('/common/login.html') !== -1 || referrer.indexOf('/forgotpwd.html') !== -1) {
                      var url = this.window.location.href
                      if (url.indexOf('?') > 0) {
                        var suffixUrl=url.substring(url.indexOf('?')+1);
                        if (suffixUrl.indexOf('=')) {
                          toUrl=this.$pathPrefix+suffixUrl.substring(suffixUrl.indexOf('=')+1)
                        }
                      }else {
                        toUrl = this.$pathPrefix+'/index.html'
                      }
                    }
                    window.location.href = toUrl
                  }
                  vm.isSubmitDisabled = false
                }).catch(function () {
                  vm.isSubmitDisabled = false
                })
              } else {
                vm.isSubmitDisabled = false
                vm.$dialog.showToast(data.desc);
              }
            }).catch(function () {
              vm.isSubmitDisabled = false
            })
          )
        }
      }
    });
  });
});
