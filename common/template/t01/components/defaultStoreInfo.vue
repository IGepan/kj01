<template>
  <div class="mdiv sore_info">
    <span
      class="name fl mr5"
      v-text="shopInfo.shopName"
    ></span>
    <span
      class="rz fl"
      style="display: inline-block"
      title="实名认证"
    ></span>
    <template v-if='shopInfo.tagList'>
      <span
        class="fw fl"
        style="display: inline-block "
        v-for='(tag, index) in shopInfo.tagList'
        :key="index"
      >
        <img
          style="width:60px;height:20px;vertical-align: middle"
          :src="tag.tagValueLogo"
          :title="tag.tagValueDisplay"
        >
      </span>
    </template>
    <span class="fw fl"> 服务 <i
        class="oranges"
        v-text='statisticsInfo.evaluateResult'
      ></i>
    </span>
    <span class="fw fl"> 速度 <i
        class="oranges"
        v-text='statisticsInfo.shopEvaluateSpeed'
      ></i>
    </span>
    <span class="fw fl"> 质量 <i
        class="oranges"
        v-text='statisticsInfo.shopEvaluateQuality'
      ></i>
    </span>
    <span class="h17line fl">
    </span>
    <span
      class="scale fl"
      v-text="'机构规模：'+(shopInfo.scaleDisplay||'')"
    ></span>
    <!-- <button
      class="attention"
      @click='colSelectedClick(shopInfo, "02")'
      :class="{active: shopInfo.collectionFlag === '1'}"
      v-text="shopInfo.collectionFlag === '1'?'已收藏':'收藏店铺'"
    ></button> -->
  </div>
</template>

<script>
module.exports = {
  props: ['http', 'code'],
  data: function () {
    return {
      shopInfo: {},
      statisticsInfo: {}
    }
  },
  mounted () {
    this.statistics();
    this.indexInfo();
  },
  methods: {
    /**
     * 取得店铺首页基础信息
     */
    indexInfo: function () {
      var vm = this;
      this.http.indexInfo({
        shopCode: this.code
      }).then(function (res) {
        vm.shopInfo = res.result;
        vm.$emit('shopInfo', vm.shopInfo);
      })
    },
    /**
     * 店铺综合统计
     */
    statistics: function () {
      var vm = this;
      this.http.statistics({
        shopCode: this.code
      }).then(function (res) {
        vm.statisticsInfo = res.result;
      })
    },
    /**
     * 收藏点击
     */
    colSelectedClick: function (info) {
      if (info.collectionFlag === '1') {
        this.collectionCancel(info.shopId);
      } else {
        this.colSelected(info.shopId);
      }
    },
    /**
     * 收藏
     */
    colSelected: function (storeId, info) {
      var vm = this;
      this.http.selected({
        storeId: storeId,
        type: '02'
      }).then(function (res) {
        if (res.code == 'rest.success') {
          vm.shopInfo.collectionFlag = '1';
          vm.$dialog.showToast("收藏成功")
        }
      })
    },
    /**
     * 取消收藏
     */
    collectionCancel: function (storeId) {
      var vm = this;
      this.http.cancel({
        goodsId: storeId
      }).then(function (res) {
        if (res.code == 'rest.success') {
          vm.shopInfo.collectionFlag = '0';
          vm.$dialog.showToast("取消成功")
        }
      })
    }
  },
}

</script>

<style>
</style>
