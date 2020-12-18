<template>
  <div class="info-Box">
    <div class="box-title">邮箱绑定</div>
    <div class="content-Box">
      <validate-dialog
        v-if='isShowDialog'
        @onsuccess='onSuccess'
        @onclose='isShowDialog = false'
        ref='validateRef'
      >
      </validate-dialog>
      <template v-if="!isUpdate && !isNewBind">
        <div class="info-content">
          <span v-text="isBind ? '您已绑定的邮箱是' + info.semail + '。' : '您还未绑定邮箱，为保护您的账号，建议您'"></span><button
            class="bind-line-btn"
            @click="handleTabBindForm"
            v-text="isBind ? '修改绑定' : '立即绑定'"
          ></button>
        </div>
      </template>
      <template v-if="isUpdate">
        <div class="forgot-step">
          <div class="forgot-step-num active">
            <div class="forgot-tracker right"></div>
            <span>1</span>
            <div>验证原邮箱</div>
          </div>
          <div
            class="forgot-step-num"
            :class="{active: step !== 1}"
          >
            <div class="forgot-tracker left"></div>
            <div class="forgot-tracker right"></div>
            <span>2</span>
            <div>绑定新邮箱</div>
          </div>
          <div
            class="forgot-step-num"
            :class="{active: step === 3}"
          >
            <div class="forgot-tracker left"></div>
            <span>3</span>
            <div>完成绑定</div>
          </div>
        </div>
        <div
          class="form-box mt44"
          v-if="step === 1"
        >
          <div class="form-item">
            <label for="">原始邮箱：</label>
            <div class="form-item-content">
              <span v-text="info.semail"></span>
            </div>
          </div>
          <div class="form-item">
            <label for="">验证码：</label>
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
                    @click="handleSendClick"
                    :disabled="verification.isDisabled"
                    v-text="verification.text"
                  ></button>
                </div>
              </div>
              <div class="item-tips">
                如果原始邮箱已无法使用，请 <span
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

        <div
          class="form-box mt44"
          v-if="step === 2"
        >
          <div class="form-item">
            <label for="">新邮箱：</label>
            <div class="form-item-content">
              <input
                type="text"
                class="input"
                v-model="newInfo.email"
                @blur="checkEmail"
                placeholder="请输入常用邮箱"
              >
              <span
                class="errormsg"
                ref="errEmail"
              ></span>
            </div>
          </div>
          <div class="form-item">
            <label for="">验证码：</label>
            <div class="form-item-content">
              <div class="input-group verification">
                <input
                  type="text"
                  class="input"
                  maxlength="6"
                  v-model="newInfo.verification"
                  placeholder="请输入验证码"
                >
                <div class="input-group__append">
                  <button
                    class="btn-text"
                    @click="handleSendClick"
                    :disabled="verification.isDisabled"
                    v-text="verification.text"
                  ></button>
                </div>
              </div>
            </div>
          </div>
          <div class="form-item">
            <label for=""></label>
            <div class="form-item-content">
              <button
                class="btnbig"
                @click="handleBindSubmit"
                :disabled="isNextDisabled"
              >确认绑定</button>
            </div>
          </div>
        </div>
      </template>
      <template v-if="isNewBind">
        <div class="form-box">
          <div class="form-item">
            <label for="">常用邮箱：</label>
            <div class="form-item-content">
              <input
                type="text"
                class="input"
                v-model="info.email"
                @blur="checkEmail"
                placeholder="请输入常用邮箱"
              >
              <span
                class="errormsg"
                ref="errEmail"
              ></span>
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
                    @click="handleSendClick"
                    :disabled="verification.isDisabled"
                    v-text="verification.text"
                  ></button>
                </div>
              </div>
            </div>
          </div>
          <div class="form-item">
            <label for=""></label>
            <div class="form-item-content">
              <button
                class="btnbig"
                @click="handleBindSubmit"
                :disabled="isNextDisabled"
              >确认绑定</button>
            </div>
          </div>
        </div>
      </template>
      <div class="info-tips">
        <p><span class="iconfont icon-tishi smallcolor"></span>温馨提醒：</p>
        <p class="smallcolor">邮箱绑定成功后，重要事件提醒（选标/中标）时，可及时收到邮件提醒。</p>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: 'bindEmail',
  inject: [
    'api',
    'httpUrl',
    'dic'
  ],
  data: function () {
    return {
      isBind: false,
      isShowDialog: false,
      isNextDisabled: true,
      verification: {
        text: '获取验证码',
        isDisabled: true
      },
      info: {
        email: '',
        semail: '',
        verification: ''
      },
      newInfo: {
        email: '',
        verification: ''
      },
      ischeck: true,
      isUpdate: false,
      isNewBind: false,
      step: 1,
      interval: null
    }
  },
  created: function () {
    console.log(1)
    this.getEmail()
  },
  methods: {
    getEmail: function () {
      var vm = this;
      this.api.getEmail().then(function (res) {
        if (res.code === 'rest.success') {
          vm.info.email = res.result.email;
          vm.info.semail = res.result.semail;
          vm.info.email && (vm.isBind = true)
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
        validateSrc: this.step === 2 ? this.newInfo.email : this.info.email,
        businessType: this.dic.businessType.bindemail,
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
    checkEmail: function (value) {
      var vm = this
      if (this.info.email || this.newInfo.email) {
        var ischeck = 0
        var message = ''
        this.step === 2 && this.newInfo.email && /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.newInfo.email) && (ischeck = 1)
        this.step === 1 && this.info.email && /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.info.email) && (ischeck = 1)
        if (ischeck) {
          this.api.emailCheck({ email: this.step === 2 ? this.newInfo.email : this.info.email }).then(function (res) {
            if (!res.result) {
              vm.$refs.errEmail.innerText = ''
              vm.ischeck = true
              vm.verification.isDisabled = false
            } else {
              vm.$refs.errEmail.innerText = '邮箱已绑定'
              vm.ischeck = false
              vm.verification.isDisabled = true
            }
          })
        } else {
          vm.$refs.errEmail.innerText = '请正确填写邮箱'
        }
      }
    },
    handleNext: function () {
      var vm = this;
      if (this.info.verification) {
        this.isNextDisabled = true;
        this.api.checkCaptchaCode({ validateSrc: this.info.email, captchaCode: this.info.verification, businessType: this.dic.businessType.bindemail }).then(function (res) {
          if (res.code === 'rest.success') {
            vm.isNextDisabled = true;
            vm.step = 2;
            clearInterval(vm.interval);
            vm.verification = {
              text: '获取验证码',
              isDisabled: true
            }
          } else {
            vm.isNextDisabled = false;
            // vm.$dialog.showToast('验证码错误！');
          }
        }).catch(function (error) {
          vm.$dialog.showToast('网络异常，请重试！');
          vm.isNextDisabled = false;
        });

      } else {
        vm.$dialog.showToast('请填写验证码！');
      }
    },
    handleBindSubmit: function () {
      var vm = this;
      if (this.ischeck) {
        if (this.isNewBind && this.info.verification) {
          this.isNextDisabled = true;
          this.api.bindingNewEmail({ email: this.info.email, validateContent: this.info.verification }).then(function (res) {
            if (res.code === 'rest.success') {
              vm.$dialog.showToast('绑定成功！');
              vm.resetdata()
            } else {
              // vm.$dialog.showToast('绑定失败！');
              vm.isNextDisabled = false;
            }
          }).catch(function (error) {
            vm.$dialog.showToast('网络异常，请重试！');
            vm.isNextDisabled = false;
          })
        }
      }
      if (this.isUpdate && this.info.verification && this.newInfo.email && this.newInfo.verification) {
        this.isNextDisabled = true;
        this.api.bindingChangeEmail({ oldEmail: this.info.email, newEmail: this.newInfo.email, oldValidateContent: this.info.verification, newValidateContent: this.newInfo.verification }).then(function (res) {
          if (res.code === 'rest.success') {
            vm.$dialog.showToast('绑定成功！');
            vm.resetdata()
          } else {
            // vm.$dialog.showToast('绑定失败！');
            vm.isNextDisabled = false;
          }
        }).catch(function (error) {
          vm.$dialog.showToast('网络异常，请重试！');
          vm.isNextDisabled = false;
        })
      } else if (this.isUpdate && !this.newInfo.verification) {
        vm.$dialog.showToast('请填写验证码！');
      }
    },
    resetdata: function () {
      this.getEmail()
      clearInterval(this.interval);
      this.verification = {
        text: '获取验证码',
        isDisabled: true
      }
      this.isUpdate = false
      this.isNewBind = false
      this.info.verification = ''
      this.newInfo.email = ''
      this.newInfo.verification = ''
      this.step = 1
    },
    handleTabBindForm: function () {
      this.isBind ? (this.isUpdate = true, this.verification.isDisabled = false) : (this.isNewBind = true)
    }
  }
}
</script>
