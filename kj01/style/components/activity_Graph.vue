<template>
  <div class="statisticsBox">
    <div class="statisticsBox_title">总体情况</div>
    <div class="overallBox">
      <template v-for="(over, index) in overall">
        <div class="overallBox_item" :key="index">
          <div class="overallBox_item_subText">{{over.count}}<span class="unit">{{over.unit}}</span></div>
          <div class="overallBox_item_text">{{over.label}}</div>
        </div>
      </template>
    </div>
    <div class="operationBox">
      <div class="operationBox_select" >
        <select-type v-model="activeType" :select-data="options.active_type"></select-type>
      </div>
      <div
        class="operationBox_btn"
        :class="{active: timeType === 6}"
        @click="handleSetTimeRange(6)"
      >最近7日</div>
      <div
        class="operationBox_btn"
        :class="{active: timeType === 29}"
        @click="handleSetTimeRange(29)"
      >最近30日</div>
      <div class="operationBox_date">
        <div class="date_select" ref="startDate">
          <input type="text" id="time" readonly placeholder="开始日期">
          <label for="time" class="icon-create-time"></label>
        </div>
        <span>至</span>
        <div class="date_select" ref="endDate">
          <input type="text" id="time1" readonly placeholder="结束日期">
          <label for="time1" class="icon-create-time"></label>
        </div>
      </div>
    </div>
    <div class="chartsBox">
      <div class="chartsBox_title">活动举办情况</div>
      <ve-histogram
        :charts-data="barChartData"
        :colors="['#38A0FF']"
      ></ve-histogram>
    </div>
    <div class="chartsBox">
      <div class="chartsBox_title">服务企业情况</div>
      <ve-line
        :charts-data="pvChartData"
        :colors="['#38A0FF']"
      ></ve-line>
    </div>
    <div class="chartsBox">
      <div class="chartsBox_title">活动服务人次</div>
      <ve-line
        :charts-data="piChartData"
        :colors="['#38A0FF']"
      ></ve-line>
    </div>
    <div class="chartsBox">
      <div class="chartsBox_title">活动参与情况</div>
      <ve-line
        :charts-data="svChartData"
        :colors="['#38A0FF']"
      ></ve-line>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: 'activityGraph',
  props: {
    dataApi: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
      date1: '',
      date2: '',
      activeType: '',
      timeType: 6,
      overall: [
        {
          count: 0,
          key: 'publishNum',
          unit: '场',
          label: '活动场次'
        },
        {
          count: 0,
          key: 'tpartiNum',
          unit: '次',
          label: '服务人次'
        },
        {
          count: 0,
          key: 'tpartiNum',
          unit: '家',
          label: '服务企业'
        },
        {
          count: 0,
          key: 'tpv',
          unit: '个',
          label: '关注用户'
        },
        {
          count: 0,
          key: 'tpv',
          unit: '个',
          label: '开展区域'
        }
      ],
      options: {
        active_type: []
      },
      areaChartData: {
        columns: ['日期'],
        rows: []
      },
      barChartData: {
        columns: ['日期'],
        rows: []
      },
      pvChartData: {
        columns: ['日期'],
        rows: []
      },
      piChartData: {
        columns: ['日期'],
        rows: []
      },
      svChartData: {
        columns: ['日期'],
        rows: []
      }
    }
  },
  components: {
    'select-type': httpVueLoader('/style/components/selectType.vue'),
    've-line': httpVueLoader('/style/components/echarts_line.vue'),
    've-histogram': httpVueLoader('/style/components/echarts_histogram.vue')
  },
  created: function () {
  },
  mounted: function () {
    laydate.render({
      elem: '#time',
      type: 'date',
      format: 'yyyy-MM-dd',
      startkey: 'date1',
      endkey: 'date2',
      vm: this,
      done: function (value, date, endDate) { //选择日期完毕的回调
        this.vm[this.startkey] = value;
        this.vm.bindStartTimeChange(value)
      }
    });
    laydate.render({
      elem: '#time1',
      type: 'date',
      format: 'yyyy-MM-dd',
      startkey: 'date1',
      endkey: 'date2',
      vm: this,
      done: function (value, date, endDate) { //选择日期完毕的回调
        this.vm[this.endkey] = value;
        this.vm.bindEndTimeChange(value)
      }
    });
    var vm = this;

    this.getTree([
      {
        type: '11'
      }
    ])

    console.log(echarts)
    this.timeSetRange(6) // && this.initData()
  },
  methods: {
    initData: function () {
      this.dataApi.statisticsGraph({
        saasId: this.GetSaasId,
        code: 'acOverall'
      }).then(res => {
        this.overall.forEach((item) => {
          item.count = res.result.data[0][item.key]
        })
      })
      this.dataApi.statisticsGraph({
        saasId: this.GetSaasId,
        code: 'acPubisher',
        startTime: this.date1,
        endTime: this.date2
      }).then(res => {
        if (res.code === 'rest.success') {
          this.areaChartData = this.formatData(res.result)
        }
      })

      this.dataApi.statisticsGraph({
        saasId: this.GetSaasId,
        code: 'acDay',
        startTime: this.date1,
        endTime: this.date2
      }).then(res => {
        if (res.code === 'rest.success') {
          this.barChartData = this.formatData(res.result)
        }
      })

      this.dataApi.statisticsGraph({
        saasId: this.GetSaasId,
        code: 'acPv',
        startTime: this.date1,
        endTime: this.date2
      }).then(res => {
        if (res.code === 'rest.success') {
          this.pvChartData = this.formatData(res.result)
        }
      })

      this.dataApi.statisticsGraph({
        saasId: this.GetSaasId,
        code: 'acParti',
        startTime: this.date1,
        endTime: this.date2
      }).then(res => {
        if (res.code === 'rest.success') {
          this.piChartData = this.formatData(res.result)
        }
      })

      this.dataApi.statisticsGraph({
        saasId: this.GetSaasId,
        code: 'acSv',
        startTime: this.date1,
        endTime: this.date2
      }).then(res => {
        if (res.code === 'rest.success') {
          this.svChartData = this.formatData(res.result)
        }
      })

    },
    formatData: function (data) {
      let columns = ['日期']
      let rows = []
      data.legend.forEach((legend) => {
        columns.push(legend.display)
      })
      rows = this.dayToDayList(this.date1, this.date2);
      rows.forEach((date) => {
        data.legend.forEach((legend) => {
          date[legend.display] = 0
          data.data.some((sdata) => {
            if ((sdata.dimension2 ? sdata.dimension2 === legend.value : true) && sdata.dimension === date['日期']) {
              date[legend.display] = parseInt(sdata.metrics)
              return true
            }
          })
        })
      })
      return {
        columns,
        rows
      }
    },
    getTree: function (keys) {
      var vm = this;
      this.dataApi.getTree(keys).then(function (res) {
        if (res.code === 'rest.success') {
          vm.options['active_type'] = res.result[0]
        }
      });
    },
    timeSetRange: function (range) {
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * range);
      this.$refs.startDate.querySelector('#time').value = this.date1 = this.GMTToStr(start);
      this.$refs.endDate.querySelector('#time1').value = this.date2 = this.GMTToStr(end);
      return 1;
    },
    GMTToStr: function (time) {
      let date = new Date(time)
      let Str = date.getFullYear() + '-' +
        this.formatdate(date.getMonth() + 1) + '-' +
        this.formatdate(date.getDate())
      return Str
    },
    formatdate: function (t) {
      t = '' + t
      return t.length > 1 ? t : '0' + t
    },
    dayToDayList: function (s, e) {
      let rows = []
      let sTime = new Date(s).getTime()
      let eTime = new Date(e)
      do {
        let nowTime = this.GMTToStr(eTime)
        rows.unshift({
          '日期': nowTime
        })
        eTime.setTime(eTime.getTime() - 3600 * 1000 * 24)
      } while (sTime <= eTime.getTime());
      return rows;
    },
    handleSetTimeRange: function (range) {
      this.timeSetRange(range) && (this.timeType = range) && this.initData()
    },
    bindStartTimeChange: function (e) {
      if (new Date(e).getTime() > new Date(this.date2).getTime()) {
        let end = new Date();
        this.date1 = this.GMTToStr(end);
        this.$dialog.showToast('开始时间不能大于截止时间！')
        return 0;
      }
      this.initData()
    },
    bindEndTimeChange: function (e) {
      if (new Date(this.date1).getTime() > new Date(e).getTime()) {
        let end = new Date();
        this.date2 = this.GMTToStr(end);
        this.$dialog.showToast('截止时间不能小于开始时间！')
        return 0;
      }
      this.initData()
    }
  }
}
</script>
<style scoped>
.wrapper-box {
  background-color: rgba(240, 242, 245, 1);
}

.operationBox_select {
  width: 250px;
  margin-right: 20px;
}
.statisticsBox {
  background-color: #fff;
  padding: 30px;
}
.statisticsBox_title {
  font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
  font-weight: 700;
  font-style: normal;
  font-size: 18px;
  text-align: left;
  letter-spacing: normal;
  color: #333333;
}
.overallBox {
  display: flex;
  width: 100%;
  height: 180px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #f2f2f2;
}
.overallBox_item {
  background-color: rgba(242, 242, 242, 1);
  flex: 1;
  height: 140px;
  margin-right: 10px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.overallBox_item:last-child {
  margin-right: 0;
}
.overallBox_item_text {
  width: 100%;
  line-height: normal;
  letter-spacing: normal;
  color: #333333;
  font-size: 16px;
  text-align: center;
  font-family: 'Arial Normal', 'Arial';
  font-weight: 400;
  font-style: normal;
  white-space: nowrap;
  text-transform: none;
  margin-top: 10px;
}
.overallBox_item_subText .unit {
  font-size: 16px;
  color: #333333;
  margin-left: 5px;
}
.overallBox_item_subText {
  width: 100%;
  font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
  font-weight: 700;
  font-style: normal;
  font-size: 28px;
  text-align: center;
  letter-spacing: normal;
  color: #42b983;
  font-size: 40px;
  line-height: normal;
}
.operationBox {
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f2f2f2;
}
.operationBox_btn {
  width: 119px;
  height: 49px;
  border-bottom: 2px solid #fff;
  text-align: center;
  font-size: 14px;
  line-height: 48px;
}
.operationBox_btn.active {
  border-bottom-color: rgba(94, 196, 101, 1);
}
.operationBox_date {
  padding-left: 30px;
}
.chartsBox {
  margin-top: 30px;
  width: 100%;
}
.chartsBox_title {
}
.date_select {
  display: inline-block;
  position: relative;
  height: 40px;
  border: 1px solid #ccc;
  line-height: 31px;
}
.date_select input {
  height: 100%;
  width: 100%;
  padding: 0 5px;
}
.icon-create-time {
  width: 18px;
  height: 18px;
  position: absolute;
  right: 5px;
  top: 50%;
  cursor: pointer;
  display: inline-block;
  transform: translateY(-50%);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 0;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTg3MTM5QTY2MTc5MTFFOEEwQjJGRkYyQTBDRTM0QjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkQwM0NGMDQ2MTdBMTFFOEEwQjJGRkYyQTBDRTM0QjkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ODcxMzlBNDYxNzkxMUU4QTBCMkZGRjJBMENFMzRCOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1ODcxMzlBNTYxNzkxMUU4QTBCMkZGRjJBMENFMzRCOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoVzpMgAAAEPSURBVHjaYmxoaGCAATExyf8w9qtXzxkZsABcapiAEgwwDAKZmWkwDVgxLjVMQP5hIP4PxcjgPw6MTc1hkEE2DJQDGyYGKgHGadNm/qeGQVRzEQvMZRSa85/qLsIJgGlGCBqzDg8ePLTds2ffs9+/f/sTNMjf30dASkrKGci0h2IdUFg+ffqMYc+eve9///6TSVRgb968bfXdu/fWAJm5QKwHUvPkyROG7dt3vAUa4gLknyHKoH///qXt3r334e3bd8D8R48eAw3Z9RpqyDlSwuj+////7ffu3b//1avXilevXnv19+9fkFevkJOOHoIMu3Tp8mGgIQ6EDCEUa4+B2G5AUvYRLMUDqeAoQIABAMKseRwm2ZWgAAAAAElFTkSuQmCC);
}
</style>
