<template>
  <div>
  <el-input
      class="input-new-tag"
      v-model="inputValue"
      ref="save"
      placeholder="请输入名称，没有则填写无"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm">
  </el-input>
  <el-button type="primary" icon="el-icon-plus" @click="showInput" style="margin-bottom: 10px">增加</el-button>
  <br>
  <el-tag style="white-space: normal"
      :key="ni"
      v-for="(tag,ni) in dynamicTags"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)">
    {{tag}}
  </el-tag>
</div>
</template>

<script>
module.exports = {
  props: {
    value:Array
  },

  watch: {
    value:{
      immediate:true,
      handler(value){
        if(value){
          this.dynamicTags = this.value
        }
      }
    }
  },
  computed: {
  },
  data: function () {
    return {
      inputValue: '',
      dynamicTags: []//关键字数组
    }
  },
  created: function () {

  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      // this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.save.focus();
        console.log(this.$refs.save.focus())
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      // this.inputVisible = false;
      this.inputValue = '';
      this.$emit('input', this.dynamicTags)
    },
  }
}
</script>

<style>
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  max-width: 100%;
  height: auto!important;
  word-wrap: break-word!important;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-bottom: 10px;
  /*margin-left: 10px;*/
  vertical-align: bottom;
}
</style>
