<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add" style="float:right;position: absolute;right: 0;z-index: 99;
    top: 0;" >增加</el-button>
    <div v-for="(tag,ni) in keywords" :key="ni">
      <el-button icon="el-icon-close" circle  class="closebox" size="mini" @click="handleClose(tag)"></el-button>
      <el-input
         type="textarea"
          v-model="tag.value"
          ref="save"
          placeholder="请按（名称、简介、建设时间）填写，没有则填写无"
      >
      </el-input>
    </div>


<!--  <el-tag style="white-space: normal"-->
<!--      :key="ni"-->
<!--      v-for="(tag,ni) in keyword"-->
<!--      closable-->
<!--      :disable-transitions="false"-->
<!--      @close="handleClose(tag)">-->
<!--   {{tag}}-->
<!--  </el-tag>-->
</div>
</template>

<script>
module.exports = {
  props: {
    value: Array,
    type: String
  },

  watch: {
    value:{
      immediate:true,
      handler(value){
        if(value){
          this.keywords = this.value
        }
      }
    }
  },
  computed: {
  },
  data: function () {
    return {
      inputValue:'',
      keywords: [],//关键字数组
    }
  },
  created: function () {

  },
  methods: {
    handleClose(tag) {
      this.keywords.splice(this.keywords.indexOf(tag), 1);
    },
    showInput() {
      // this.inputVisible = true;
      // this.$nextTick(() => {
      //   this.$refs.save.focus();
      //   console.log(this.$refs.save.focus())
      // });
      // this.handleInputConfirm()

      this.$emit('input', this.keyword)
    },
    add(tag){
      this.keywords.push({type:this.type,value:''});
      this.$emit('input',this.keywords)
      console.log(this.keywords)
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
.closebox{
  float: right;
  margin-bottom: -40px;
  z-index: 999;
  position: relative;
  background-color: rgb(221, 221, 221);
  margin-top: 10px;
  margin-right: -10px;font-size: 16px
}
.el-textarea textarea{
  min-height: 200px!important;
  margin-top: 20px;
}
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
