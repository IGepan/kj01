<template>
  <div class="flex">
    <div
      class="flex opacity"
      @click="closeClick"
    ></div>
    <div class="captcha_box">
      <div
        class="captcha_dia"
        id="captcha_dia"
      ></div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      captcha: undefined
    }
  },
  methods: {
    initImg: function (captcha, httpUrl) {
      var vm = this;
      this.captcha = captcha.init({
        el: document.getElementById('captcha_dia'),
        onSuccess: function () {
          vm.toSuccess(this)
        },
        onFail: this.onFail,
        onRefresh: this.onRefresh,
        url: httpUrl.imgVerify
      });
    },
    toSuccess: function (captchaData) {
      this.$emit('onsuccess', captchaData)
    },
    onFail: function () {
      this.$emit('onFail')
    },
    onRefresh: function () {
      this.$emit('onRefresh')
    },
    closeClick: function () {
      this.$emit('onclose')
    }
  },
}
</script>

<style>
.flex {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.opacity {
  background: rgba(0, 0, 0, 0.5);
}
.captcha_box {
  width: 460px;
  height: 300px;
  position:absolute;
  z-index: 1000;
  margin: auto;
   left: 40%;
  bottom: 10%;
  background-color: white;
  padding-top: 50px;
  border-radius: 5px;
}
.captcha_dia {
  width: 300px;
  z-index: 1000;
  margin: auto;
}
</style>
