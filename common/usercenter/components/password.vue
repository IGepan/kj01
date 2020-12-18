<template>
  <div class="info-Box">
    <div
      class="box-title"
      v-text="isPassword ? '修改登录密码':'设置登录密码'"
    ></div>
    <div class="content-Box">
      <validate-dialog
        v-if='isShowDialog'
        @onsuccess='onSuccess'
        @onclose='isShowDialog = false'
        ref='validateRef'
      >
      </validate-dialog>
      <template v-if="!tabView">
        <div class="info-content">
          <span v-text="'当前密码: ' + (isPassword ? '已设置' : '未设置')"></span><button
            class="bind-line-btn"
            @click="handleTabBindForm"
            v-text="isPassword ? '修改密码' : '设置密码'"
          ></button>
        </div>
      </template>
      <template v-if="tabView">
        <div class="forgot-step">
          <div class="forgot-step-num active">
            <div class="forgot-tracker right"></div>
            <span>1</span>
            <div>安全验证</div>
          </div>
          <div
            class="forgot-step-num"
            :class="{active: step}"
          >
            <div class="forgot-tracker left"></div>
            <span>2</span>
            <div>重置密码</div>
          </div>
        </div>
        <template v-if="!step">
          <div class="form-box mt44">
            <div class="form-item">
              <label for="">手机号码：</label>
              <div class="form-item-content">
                <input
                  type="text"
                  class="input"
                  readonly
                  placeholder="请输入绑定的手机号码"
                  v-model="info.sphone"
                >
              </div>
            </div>
            <div class="form-item">
              <label for="">验&nbsp; 证&nbsp; 码：</label>
              <div class="form-item-content">
                <div class="input-group verification">
                  <input
                    type="text"
                    class="input"
                    maxlength="6"
                    v-model="info.verification"
                    placeholder="请输入验证码"
                  >
                  <div class="input-group__append">
                    <button
                      class="btn-text"
                      type="button"
                      @click="handleSendClick"
                      :disabled="verification.isDisabled"
                      v-text="verification.text"
                    ></button>
                  </div>
                </div>
                <div class="item-tips">
                  如果您绑定的手机号无法接收短信，请 <span
                    class="orage"
                    style="cursor: pointer;"
                    onclick="window.open('http://www.kj01.cn/service.htm?arg=10113491&amp;style=4&amp;kflist=off&amp;kf=edwinzuo&amp;zdkf_type=1&amp;lnk_overflow=0&amp;callback_id6ds=10152438&amp;language=zh-cn&amp;charset=gbk&amp;referer={hz6d_referer}&amp;keyword=http%3A%2F%2Fwww.kjy01.com%2Findex.html&amp;tfrom=1&amp;tpl=crystal_blue', '_blank', 'height=600,width=800,top=50,left=200,status=yes,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,titlebar=no')"
                  ><i class="iconfont icon-fuwu"></i>联系客服</span> 进行处理。
                </div>
              </div>
            </div>
            <div class="form-item">
              <label for=""></label>
              <div class="form-item-content">
                <button
                  class="btnbig"
                  :disabled="isNextDisabled"
                  @click="handleNext"
                >下一步</button>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="form-box mt44">
            <div
              class="form-item"
              v-if="isPassword"
            >
              <label
                style="width: 85px;"
                for=""
              >旧密码：</label>
              <div class="form-item-content">
                <input
                  type="password"
                  maxlength="16"
                  minlength="6"
                  class="input"
                  v-model="password.oldpwd"
                >
              </div>
            </div>
            <div class="form-item">
              <label
                style="width: 85px;"
                for=""
              >新密码：</label>
              <div class="form-item-content">
                <input
                  type="password"
                  maxlength="16"
                  minlength="6"
                  class="input"
                  v-model="password.newpwd"
                >
              </div>
            </div>
            <div class="form-item">
              <label
                style="width: 85px;"
                for=""
              >确认新密码：</label>
              <div class="form-item-content">
                <input
                  type="password"
                  maxlength="16"
                  minlength="6"
                  class="input"
                  v-model="password.verifypwd"
                >
              </div>
            </div>
            <div class="form-item">
              <label for=""></label>
              <div class="form-item-content">
                <button
                  class="btnbig"
                  :disabled="isNextDisabled"
                  @click="handleSubmit"
                >重置密码</button>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: 'repwd',
  inject: [
    'api',
    'httpUrl',
    'dic'
  ],
  data: function () {
    return {
      isPassword: true,
      tabView: false,
      step: false,
      verification: {
        text: '获取验证码',
        isDisabled: false
      },
      info: {
        sphone: '',
        phone: '',
        verification: ''
      },
      password: {
        oldpwd: '',
        newpwd: '',
        verifypwd: ''
      },
      isShowDialog: false,
      isNextDisabled: true,
      interval: null
    }
  },
  created: function () {
    console.log(1)
    this.getisPassword()
    this.getUserPhone()
  },
  methods: {
    getisPassword: function () {
      var vm = this;
      this.api.isPassword().then(function (res) {
        vm.isPassword = res.result
      }).catch(function (error) {
        vm.$dialog.showToast('网络异常，请重试！');
      });
    },
    getUserPhone: function () {
      var vm = this;
      this.api.getUserPhone().then(function (res) {
        if (res.code === 'rest.success') {
          vm.info.phone = res.result.phone;
          vm.info.sphone = res.result.sphone;
        }
      }).catch(function (error) {
        vm.$dialog.showToast('网络异常，请重试！');
      });
    },
    /**
     * 发送短信
     */
    handleSendClick: function () {
      this.isShowDialog = true;
      var vm = this;
      setTimeout(function () {
        if (vm.$refs.validateRef) {
          vm.$refs.validateRef.initImg(captcha, vm.httpUrl);
        }
      }, 200)
    },
    /**
     * 滑块验证成功
     */
    onSuccess: function (captchaData) {
      var vm = this;
      vm.isShowDialog = false;
      vm.verification.isDisabled = true
      this.captchaData = captchaData;
      this.api.sendCaptchaCode({
        validateSrc: this.info.phone,
        businessType: this.dic.businessType.pwd,
        type: 'slider',
        token: captchaData.token,
        code: captchaData.code
      }).then(function (res) {
        if (res.code === 'rest.success') {
          vm.verification.text = 60;
          vm.interval = setInterval(function () {
            vm.verification.text--;
            if (vm.verification.text == 0) {
              clearInterval(vm.interval);
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
    handleNext: function () {
      var vm = this;
      if (this.info.verification) {
        this.isNextDisabled = true;
        this.api.checkCaptchaCode({ validateSrc: this.info.phone, captchaCode: this.info.verification, businessType: this.dic.businessType.pwd }).then(function (res) {
          if (res.code === 'rest.success') {
            vm.step = true;
          } else {
            // vm.$dialog.showToast('验证码错误！');
          }
          vm.isNextDisabled = false;
        }).catch(function (error) {
          vm.$dialog.showToast('网络异常，请重试！');
          vm.isNextDisabled = false;
        });
      } else {
        vm.$dialog.showToast('请填写验证码！');
      }
    },
    checkpwd: function () {
      var flag = true
      if (!this.password.oldpwd) {
        flag = false
        this.$dialog.showToast('请输入旧密码！');
      } else if (16 < this.password.oldpwd.length || this.password.oldpwd.length < 6) {
        flag = false
        this.$dialog.showToast('密码长度为6-16位！');
      } else if (!this.password.newpwd) {
        flag = false
        this.$dialog.showToast('请输入新密码！');
      } else if (16 < this.password.newpwd.length || this.password.newpwd.length < 6) {
        flag = false
        this.$dialog.showToast('密码长度为6-16位！');
      } else if (this.password.newpwd !== this.password.verifypwd) {
        flag = false
        this.$dialog.showToast('新密码和确认密码不一致！');
      }
      return flag
    },
    handleSubmit: function () {
      var vm = this;
      if (this.checkpwd()) {
        this.isNextDisabled = true;
        this.isPassword ? this.api.changePassword({ oldPassword: $.base64.encode(this.password.oldpwd), newPassword: $.base64.encode(this.password.verifypwd) }).then(function (res) {
          if (res.code === 'rest.success') {
            vm.$dialog.showToast('修改成功！');
            vm.resetdata()
          } else {
            // vm.$dialog.showToast('修改失败！');
            vm.isNextDisabled = false;
          }
        }).catch(function (error) {
          vm.$dialog.showToast('网络异常，请重试！');
          vm.isNextDisabled = false;
        }) : this.api.setPassword({ newPassword: $.base64.encode(this.password.verifypwd) }).then(function (res) {
          if (res.code === 'rest.success') {
            vm.$dialog.showToast('设置成功！');
            vm.resetdata()
          } else {
            // vm.$dialog.showToast('设置失败！');
            vm.isNextDisabled = false;
          }
        }).catch(function (error) {
          vm.$dialog.showToast('网络异常，请重试！');
          vm.isNextDisabled = false;
        });
      }
    },
    resetdata: function () {
      var vm = this
      vm.step = false;
      vm.isNextDisabled = false
      vm.isPassword = true
      vm.tabView = false
      vm.info.verification = ''
      vm.password = {
        oldpwd: '',
        newpwd: '',
        verifypwd: ''
      }
      clearInterval(vm.interval);
      this.verification = {
        text: '获取验证码',
        isDisabled: false
      }
    },
    handleTabBindForm: function () {
      this.tabView = true
    },
  }
}
</script>
