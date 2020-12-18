<template>
  <div class="calendarDayResultBox">
    <div class="calendarDayResultTop"><span class="calendarDayResultTop-title">{{boxTitle}}</span></div>
    <div class="calendarDayResultList">
      <template v-for="(ccitem, index) in dataList">
        <div class="calendarDay-item" :key="'today_'+index">
          <a :href="ccitem.itemUrl" :title="ccitem.title" target="_blank">
            <h4 class="line title">{{ccitem.title}}</h4>
            <div class="time"><i class="iconfont icon-lishijilu"></i>{{ccitem.activeStartTimeDisplay[9]}}&nbsp;&nbsp;{{ccitem.activeStartTimeDisplay[3]}}&nbsp;{{ccitem.weekday}}</div>
            <div class="line address" v-if="!ccitem.onLineFlag || ccitem.onLineFlag === '0'"><i class="iconfont icon-dingweixian"></i>{{ccitem.cityShow}}</div>
            <div class="onLine" v-else><i class="iconfont icon-xianshanghuodong"></i>线上活动</div>
          </a>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
module.exports = {
  props: {
    boxTitle: {
      type: String,
      default: ''
    },
    dataList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data: function () {return {}},
  created: function() {},
  methods: {}
}
</script>

<style>
.calendarDayResultBox {
  padding: 20px;
}

.calendarDayResultTop-title {
  position: relative;
	font-size: 16px;
	line-height: 16px;
	color: #343334;
	font-weight: bold;
	display: inline-block;
	text-indent: 15px;
}
.calendarDayResultTop-title::before {
  position: absolute;
  content: '';
  display: inline-block;
  width: 6px;
  height: 12px;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
	background-color: #018fff;
	border-radius: 3px;
}
.calendarDayResultList {
  width: 100%;
}
.calendarDay-item {
  padding-bottom: 36px;
  padding-left: 20px;
  position: relative;
  overflow: hidden;
}

.calendarDay-item .title {
  padding: 0;
  font-size: 16px;
  line-height: 16px;
  color: #343334;
  margin: 0;
  font-weight: normal;
}
.calendarDay-item .time, .calendarDay-item .address, .calendarDay-item .onLine {
	font-size: 12px;
	line-height: 12px;
	color: #9496a5;
	margin-top: 12px;
}
.calendarDay-item .time {
  margin-top: 15px;
}

.calendarDay-item .iconfont {
  margin-right: 5px;
  font-size: 12px;
}
.calendarDay-item:first-child {
  margin-top: 27px;
}
.calendarDay-item::before {
  content: '';
  display: block;
  width: 4px;
  height: 4px;
  background-color: #ffffff;
  border-radius: 50%;
  border: solid 2px #9496a5;
  position: absolute;
  top: 1px;
  left: 2px;
  z-index: 1;
}
.calendarDay-item::after {
  content: '';
  display: block;
  width: 2px;
  height: 100%;
  background-color: #e6e7f1;
  border-radius: 1px;
  position: absolute;
  left: 5px;
  top: 0;
}
.calendarDay-item:last-child {
  padding-bottom: 0;
}
.calendarDay-item:last-child::after {
  display: none;
}

.calendarDay-item:hover .title {
  color: #ff8a00;
}
.calendarDay-item:hover::before {
  border-color: #ff8a00;
  width: 8px;
  height: 8px;
  left: 0
}
</style>
