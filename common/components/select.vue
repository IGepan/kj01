<template>
  <div class="">
    <select
      style="width:100%"
      name=""
      @change='change($event)'
      v-model="mValue"
    >
      <option
        :value="item.value"
        v-for="(item, index) in selectList"
        v-text="item.display"
        :key="index"
      ></option>
    </select>
  </div>
</template>
<script>
module.exports = {
  props: ['code', 'group', 'parentId', 'http', 'value'],
  data: function () {
    return {
      selectList: [],
      mValue: this.value,
    }
  },
  mounted () {
    this.initData();
  },
  watch: {
    parentId: function (val) {
      this.initData();
    },
    group: function (val) {
      this.initData();
    },
    code: function (val) {
      this.initData();
    },
    value (val) {
      this.mValue = val;
    },
    mValue (val) {
      this.$emit("input", val);
    }
  },
  methods: {
    initData (code, parentId, group) {
      var code = code || this.code;
      var group = group || this.group;
      var parentId = parentId || this.parentId;
      var vm = this;
      if (code && code != '') {
        this.$httpCom.dict({
          code: code,
          group: group,
          parentId: parentId
        }).then(function (res) {
          vm.selectList = res.result;
        })
      }
    },
    change (e) {
      this.$emit('change', this.selectList[e.srcElement.value]);
    },
    clearData () {
      this.selectList = [];
    }
  }
}
</script>

<style scoped>
</style>
