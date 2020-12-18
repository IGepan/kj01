<template>
  <div>
    <div style="width:100%;height:288px;" ref="echarts"></div>
  </div>
</template>
<script>

module.exports = {
  name: 'echartsLine',
  props: {
    chartsData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    colors: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data: function () {
    return {
    }
  },
  created: function () {
  },
  mounted: function () {
    const vm = this
    vm.$nextTick(()=> {
      vm.initData()
    })
  },
  methods: {
    initData: function () {
      const vm = this
      // 基于准备好的dom，初始化echarts实例
      var initChart = echarts.init(this.$refs.echarts)
      // 绘制图表
      initChart.setOption({
        grid: [{
          top: '10%',
          left: '6%',
          right: '3%'
        }],
        color: this.colors,
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 1,
            end: 35
          }
        ],
        xAxis: [{
          boundaryGap: false,
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }],
        yAxis: [
          {
            axisLabel: {
              // formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }
        ]
      })
    }
  }
}
</script>
