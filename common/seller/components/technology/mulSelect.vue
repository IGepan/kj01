<template>
  <div
    class="expslt mySelect"
    :id="'mulSelect'+index"
  >
</template>
<script>
module.exports = {
  props: ['value', 'index', 'mulSelectList'],
  data: function () {
    return {
      mValue: this.value,
      mulSelect: undefined
    }
  },
  watch: {
    value (val) {
      this.mValue = val;
    },
    mValue (val) {
      this.$emit("input", val);
    }
  },
  mounted () {
    if (!this.mValue) {
      this.mValue = [];
    }
    if (!(this.mValue instanceof Array)) {
      this.mValue = [this.mValue];
    }
    this.initData();
  },
  methods: {
    initData () {
      this.mulSelectList.forEach(function (item, index) {
        item.name = item.value;
      })
      var vm = this;
      vm.mulSelect = $("#mulSelect" + this.index).mySelect({
        mult: true, //true为多选,false为单选
        option: this.mulSelectList,
        onChange: function (vals) { //选择框值变化返回结果
          vm.mValue = vals;
        }
      })
      vm.mulSelect.setResult(vm.mValue);
    },
    getValue: function () {
      var arayData = [];
      for (var it of this.mValue) {
        arayData.push({
          specId: this.mulSelectList[it].specId,
          specValue: this.mulSelectList[it].specValue,
        })
      }
      return arayData;
    },
    random: function () {
      return Math.floor(Math.random() * (upper - lower)) + lower;
    }
  }
}
</script>

<style scoped>
</style>
