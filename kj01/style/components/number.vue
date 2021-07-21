<template>
  <div class="number-grow-warp">
    <span :style="styles" ref="numberGrow" :data-time="time" class="number-grow" :data-value="value">0</span>

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
    },
    color: {
      type: String,
      default: '#ff8110'
    }
  },
  data: function () {
    return {
      styles: {
        color: ''
      }
    }
  },
  watch: {
    value: function (n, o) {
      if (n !== o) {
        this.numberGrow(this.$refs.numberGrow)
      }
    }
  },
  created: function() {
    this.styles.color = this.color
  },
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
  transform: translateZ(0);
  margin-right: 10px;
  float: left;
}
.number-grow {
	font-family: MicrosoftYaHei;
	font-size: 24px;
  line-height: 24px;
  /*font-weight: bold;*/
	letter-spacing: 0px;
  margin:0;
  display: block;
	color: #ff8110;
}
</style>
