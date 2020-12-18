<template>
  <div class="stars-box">
    <span class="stars">
      <i
        class="iconfont"
        v-for="(star, i) in itemNum"
        :key="i"
        :class="{'icon-wujiaoxing': i >= value, 'icon-star_full': i < value, 'yellow': value > 2 && value < itemNum && i < value, red: value === itemNum }"
        @mouseover="handleSatrUpdate(star)"
        @click="handleSatrUpdate(star)"
      ></i>
    </span>
    <span
      class="star-tips"
      v-if="isTips"
      :class="{yellow: value > 2 && value < itemNum, orange: value === itemNum}"
      v-text="value + '分 ' + msg[value]"
    ></span>
  </div>
</template>
<script>
module.exports = {
  props: {
    // v-model绑定值
    'value': Number,
    // 是否不能操作
    'disabled': {
      type: Boolean,
      default: false
    },
    // 是否显示提示文字
    'isTips': {
      type: Boolean,
      default: true
    },
    // 星星数量
    'itemNum': {
      type: Number,
      default: 5
    },
    // 提示类容
    'tips': {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data: function () {
    return {
      msg: ['', '不满', '不满', '满意', '满意', '惊喜']
    }
  },
  created: function () {
    this.tips.length && (this.msg = this.tips)
  },
  methods: {
    handleSatrUpdate: function (i) {
      !this.disabled && this.$emit('input', i)
    }
  }
}
</script>
<style>
.stars {
  width: 164px;
  display: inline-block;
  vertical-align: middle;
}
.stars .iconfont {
  font-size: 30px;
  color: #6f6f6f;
}
.stars .iconfont.red {
  color: #ff3c00 !important;
}
.stars .iconfont.yellow {
  color: #ff9600 !important;
}
.star-tips {
  font-size: 12px;
  padding: 2px 10px;
  border: 1px solid #6f6f6f;
  color: #6f6f6f;
}
.star-tips::before {
  content: '';
  display: inline-block;
  background: #fff;
  width: 5px;
  height: 5px;
  border-top: 1px solid;
  border-left: 1px solid;
  transform: rotate(-45deg);
  margin-left: -9px;
  position: relative;
  top: -2px;
  left: -5px;
  border-color: #6f6f6f;
}
.star-tips.yellow,
.star-tips.yellow::before {
  color: #ff9600;
  border-color: #ff9600;
}
.star-tips.orange,
.star-tips.orange::before {
  color: #ff3c00;
  border-color: #ff3c00;
}
</style>
