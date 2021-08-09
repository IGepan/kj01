<template>
  <div>
  <el-input
      class="input-new-tag"
      v-model="inputValue"
      ref="save"
      placeholder="请输入名称，没有则填写无"
  >
  </el-input>
  <el-button type="primary" icon="el-icon-plus" @click="showInput" style="margin-bottom: 10px" >增加</el-button>
  <br>
  <el-tag style="white-space: normal"
      :key="ni"
      v-for="(tag,ni) in keyword"
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
          this.keyword = this.value
        }
      }
    }
  },
  computed: {
  },
  data: function () {
    return {
      temp:"&amp;",
      inputValue: '',
      keyword: [],//关键字数组
      save:'',
    }
  },
  created: function () {

  },
  methods: {
    handleClose(tag) {
      this.keyword.splice(this.keyword.indexOf(tag), 1);
    },

    showInput() {
      // this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.save.focus();
        console.log(this.$refs.save.focus())
      });
      this.handleInputConfirm()
      this.$emit('input', this.keyword)
    },

    handleInputConfirm() {
        if (this.inputValue) {
          this.keyword.push(this.inputValue);
        }
        this.inputValue = '';

      // let inputValue = this.inputValue;
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
