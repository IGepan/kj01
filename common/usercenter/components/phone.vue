<template>
  <div class="info-Box">
    <div class="box-title">手机绑定</div>
    <div class="content-Box">
      <validate-dialog
        v-if='isShowDialog'
        @onsuccess='onSuccess'
        @onclose='isShowDialog = false'
        ref='validateRef'
      >
      </validate-dialog>
      <template v-if="isBind">
        <div class="info-content">
          <span v-text="'您已绑定的手机号是'+ info.sphone +'。  已绑定'"></span>
        </div>
      </template>
      <template v-else>
        <div class="form-box">
          <div class="form-item">
            <label for="">常用手机：</label>
            <div class="form-item-content">
              <input
                type="text"
                class="input"
                v-model="info.phone"
                @blur="checkPhone"
                placeholder="请输入常用手机"
              >
              <span
                class="errormsg"
                ref="errPhone"
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
              >绑定手机</button>
            </div>
          </div>
        </div>
      </template>
      <div class="info-tips">
        <p><span class="iconfont icon-tishi smallcolor"></span>温馨提醒：</p>
        <p class="smallcolor">手机绑定成功后，重要事件提醒（选标/中标）时，可及时收到邮件提醒。</p>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: 'bindPhone',
  inject: [
    'api',
    'httpUrl',
    'dic'
  ],
  data: function () {
    return {
      isBind: true,
      isShowDialog: false,
      isNextDisabled: true,
      verification: {
        text: '获取验证码',
        isDisabled: true
      },
      info: {
        phone: '',
        sphone: '',
        verification: ''
      },
      ischeck: true
    }
  },
  created: function () {
    console.log(1)
    this.getUserPhone()
  },
  methods: {
    getUserPhone: function () {
      var vm = this;
      this.api.getUserPhone().then(function (res) {
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
        businessType: this.dic.businessType.bindphone,
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
    checkPhone: function (value) {
      var vm = this
      if (this.info.phone) {
        this.api.checkPhone({ phone: this.info.phone }).then(function (res) {
          if (!res.result) {
            vm.$refs.errPhone.innerText = ''
            vm.ischeck = true
            vm.verification.isDisabled = false
          } else {
            vm.$refs.errPhone.innerText = '手机已绑定'
            vm.ischeck = false
            vm.verification.isDisabled = true
          }
        })
      }
    },
    handleBindSubmit: function () {
      var vm = this;
      if (this.ischeck) {
        if (this.info.verification) {
          this.isNextDisabled = true;
          this.api.bindingPhone({ phone: this.info.phone, validateContent: this.info.verification }).then(function (res) {
            vm.isBind = true;
            if (res.code === 'rest.success') {
              vm.$dialog.showToast('绑定成功！');
              vm.isBind = true;
            } else {
              // vm.$dialog.showToast('绑定失败！');
              vm.isNextDisabled = false;
            }
          }).catch(function (error) {
            vm.$dialog.showToast('网络异常，请重试！');
            vm.isNextDisabled = false;
          });
        }
      }
    }
  }
}
</script>
