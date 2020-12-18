<template>
  <div class="number-grow-warp">
    <span ref="numberGrow" :data-time="time" :data-value="value">0</span>
  </div>
</template>

<script>
module.exports = {
  props: {
    time: {
      type: Number,
      default: 2
    },
    value: {
      type: Number,
      default: 720000
    }  
  },
  data: function () {
    return {}
  },
  watch: {
    value: function (n, o) {
      if (n !== o) {
        this.numberGrow(this.$refs.numberGrow)
      }
    }
  },
  created: function() {},
  methods: {
    numberGrow: function (ele) {
      var _this = this
      var step = (_this.value * 10) / (_this.time * 1000)
      var current = 0
      var start = 0
      var t = setInterval(function () {
        start += step
        if (start > _this.value) {
          clearInterval(t)
          start = _this.value
          t = null
        }
        if (current === start) {
          return
        }
        current = t ? start.toFixed(0) : start;
        ele.innerHTML = current.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
      }, 10)
    }
  },
  mounted: function () {
    this.numberGrow(this.$refs.numberGrow)
  }
}
</script>

<style>
.number-grow-warp{
  display: inline-block;
}
</style>
