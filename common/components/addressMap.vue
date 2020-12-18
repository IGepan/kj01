<template>
  <div class="map_box">
    <div class="cover"></div>
    <div class="ctr">
      <div class="map_content">
        <div class="map_search">
          <input
            type="text"
            placeholder="查找地点"
            v-model="keyWords"
            @keyup="mapKeyup"
          >
          <button @click="mapSearch"></button>
        </div>
        <div
          class="map_cls"
          @click="celClick"
        >

        </div>
        <div id="allmap"></div>
        <div class="map_info">
          <div
            class="tips"
            v-if="edit"
          >请修改并确认详细地址</div>
          <div
            class="city"
            v-text="city"
          ></div>
          <input
            type="text"
            ref='address'
            v-model="address"
            :disabled="!edit"
            :placeholder="edit?'请填写详细地址':'请选择一个地点'"
            @keyup="addressKeyup"
          ><button
            :disabled="!address"
            @click="callBack"
          >确定</button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
module.exports = {
  props: ['location', 'tcity'],
  data: function () {
    return {
      map: undefined,
      geoc: undefined,
      mValue: this.value,
      keyWords: "",
      marker: undefined,
      address: "",
      edit: "",
      city: "",
      lng: "",
      lat: ""
    }
  },
  mounted: function () {
    var vm = this;
    this.map = new BMap.Map("allmap");
    // 设置中心点
    var point = new BMap.Point(116.331398, 39.897445);
    this.map.centerAndZoom(point, 20);
    this.marker = new BMap.Marker(point);           // 创建标注
    this.map.addOverlay(this.marker);
    this.geoc = new BMap.Geocoder();
    // 获取当前位置
    this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    var geolocation = new BMap.Geolocation();
    if (this.location && this.tcity) {
      this.geoc.getPoint(this.location, function (point) {
        if (point) {
          vm.map.centerAndZoom(point, 16);
          vm.map.addOverlay(new BMap.Marker(point));
        }
      }, this.tcity);
    } else {
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          vm.map.centerAndZoom(r.point, 15);
          vm.map.addOverlay(new BMap.Marker(r.point));
        }
        else {
          vm.$dialog.showToast("获取当前位置失败");
        }
      });
    }
    this.map.addControl(new BMap.NavigationControl(
      {
        type: BMAP_NAVIGATION_CONTROL_ZOOM, //缩放控件类型 仅包含缩放按钮
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT, //右下角
        offset: new BMap.Size(1, 1) //进一步控制缩放按钮的水平竖直偏移量
      }
    ));
    // 添加点击事件
    this.map.addEventListener("click", this.mapClick);
    this.map.addEventListener("DOMMouseScroll", this.mapMouseScroll);
  },
  methods: {
    mapClick: function (e) {
      // if (!e.overlay) {
      this.map.clearOverlays()
      var point = new BMap.Point(e.point.lng, e.point.lat);
      this.marker = new BMap.Marker(point);        // 创建标注
      this.map.addOverlay(this.marker);
      // }
      this.edit = true;
      var vm = this;
      var pt = e.point;
      this.geoc.getLocation(pt, function (rs) {
        //addressComponents对象可以获取到详细的地址信息
        var addComp = rs.addressComponents;
        vm.address = addComp.street + "" + addComp.streetNumber;
        vm.city = addComp.province + " " + addComp.city + " " + addComp.district;
        vm.$refs.address.focus();
        vm.lng = pt.lng;
        vm.lat = pt.lat;
        // var site = addComp.province + "" + addComp.city + "" + addComp.district + "" + addComp.street + "" + addComp.streetNumber;
        //
      });
    },
    celClick: function () {
      this.$emit("cel");
    },
    mapSearch: function () {
      var local = new BMap.LocalSearch(this.map, {
        renderOptions: { map: this.map }
      });
      if (this.keyWords) {
        local.search(this.keyWords);
      }
    },
    mapKeyup: function (e) {
      if (e.keyCode === 13) {
        this.mapSearch();
      }
    },
    addressKeyup: function (e) {
      if (e.keyCode === 13) {
        this.callBack();
      }
    },
    callBack: function () {
      if (this.address) {
        this.$emit('success', { address: this.address, lng: this.lng, lat: this.lat });
      }
    }
  },
}
  </script>
  <style scoped>
.map_box {
  position: fixed;
  display: table;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 999;
}
#allmap {
  height: 60vh;
  position: relative;
  z-index: 2000 !important;
}
.ctr {
  display: table-cell;
  vertical-align: middle;
}
.map_content {
  position: relative;
  width: 60vw;
  height: 60vh;
  margin: 0 auto;
}
.map_search {
  position: absolute;
  z-index: 2001;
  left: 10px;
  top: 10px;
  width: 300px;
  height: 40px;
  border: 1px solid #007cff;
  background-color: rgba(255, 255, 255, 0.8);
}
.map_search input {
  display: block;
  padding: 0 15px;
  float: left;
  width: 260px;
  height: 38px;
  line-height: 38px;
  font-size: 16px;
  background-color: transparent;
}
.map_search button {
  float: left;
  width: 38px;
  height: 38px;
  background-color: #007cff;
  color: #fff;
  font-family: 'iconfont';
  font-size: 20px;
  text-align: center;
  line-height: 46px;
  cursor: pointer;
}
.map_search button:after {
  content: '\e65b';
}
.map_cls {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2001;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  line-height: 44px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s;
}
.map_cls:after {
  content: '\e67a';
  font-family: 'iconfont';
  font-size: 24px;
  color: #f00;
  transition: all 0.5s;
}
.map_cls:hover {
  background-color: #f00;
}
.map_cls:hover:after {
  color: #fff;
}
.map_info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  height: 60px;
  background-color: #fff;
  z-index: 2001;
}
.map_info input {
  padding: 0 10px;
  width: 90%;
  height: 40px;
  border: 1px solid #f60;
}
.map_info .city {
  position: absolute;
  right: 10%;
  margin-right: 20px;
  line-height: 38px;
  color: #666;
  font-size: 12px;
  pointer-events: none;
}
.map_info button {
  width: 10%;
  height: 40px;
  background-color: #f60;
  color: #fff;
  cursor: pointer;
}
.map_info input:disabled {
  background-color: #eee;
  color: #ccc;
  border-color: #ccc;
}
.map_info button:disabled {
  background-color: #ccc;
  color: #666;
}
.map_info .tips {
  position: absolute;
  left: 10px;
  top: -40px;
  padding: 0 10px;
  height: 36px;
  line-height: 36px;
  border: 1px solid #f60;
  border-radius: 5px;
  background-color: #ffc197;
  color: #bb0b00;
  font-size: 14px;
}
.map_info .tips:after {
  content: '';
  display: block;
  position: absolute;
  left: 10px;
  top: 29px;
  width: 0px;
  height: 0px;
  border: 5px solid #ffc197;
  border-color: #ffc197 #ffc197 transparent transparent;
  transform: rotate(135deg);
  box-shadow: 1px -1px 0 0 #f60;
}
</style>
