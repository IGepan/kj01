<template>
  <div>
    <div style="width:100%;height:288px;" ref="echarts"></div>
  </div>
</template>
<script>

module.exports = {
  name: 'echartsBar',
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
          left: '4%',
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
          data: this.chartData
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
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      })
    }
  }
}
</script>
