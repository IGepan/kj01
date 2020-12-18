<template>
  <div
    class="expslt mySelect"
    :id="'mulSelect'+index"
  ></div>
</template>
<script>
module.exports = {
  props: ['code', 'group', 'parentId', 'value', 'index'],
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
      this.mulSelect && this.mulSelect.setResult(val);
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
        vm.$httpCom.dict({
          code: code,
          group: group,
          parentId: parentId
        }).then(function (res) {
          vm.selectList = res.result;
          vm.selectList.forEach(function (item, index) {
            item.name = item.display;
            item.id = item.value;
          })
          vm.mulSelect = $("#mulSelect" + vm.index).mySelect({
            mult: true, //true为多选,false为单选
            option: vm.selectList,
            onChange: function (vals) { //选择框值变化返回结果
              vm.mValue = vals;
            }
          })
          vm.mulSelect.setResult(vm.mValue);
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
