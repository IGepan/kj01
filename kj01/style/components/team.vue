<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add" style="float:right;
    top: 0;margin-bottom: 10px" >增加</el-button>
    <div v-for="(tag ,ni) in keywords" :key="ni">
      <el-form ref="ruleForm" :rules="rule"  :model="tag" class="contfrom">
      <el-button
          v-if="issubmit!==1 && ni>0"
          icon="el-icon-close" circle  class="closebox" size="mini" @click="handleClose(tag)"></el-button>

      <el-form-item label="姓名" class="el-text leftbox" prop="name">
        <el-input placeholder="请输入姓名"
                  v-model="tag.name"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="身份证号码" class="el-text leftbox" prop="idNumber">
        <el-input placeholder="请输入身份证号码"
                  v-model="tag.idNumber"
                  maxlength="18"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="技术经纪（理）人证书号" class="el-text leftbox" prop="certificateNo">
        <el-input placeholder="请输入证书号"
                  v-model="tag.certificateNo"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="发证机构" class="el-text leftbox" prop="certificateOrgan">
        <el-input placeholder="请输入发证机构"
                  v-model="tag.certificateOrgan"
                  clearable></el-input>
      </el-form-item>
      </el-form>
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
    // type: Array,
    issubmit: Number,
    isvalid: Number,
  },

  watch: {
    value:{
      immediate:true,
      handler(value){
        if(value){
          this.keywords = value
          console.log(this.keywords,'oooo')
        }
      }
    },
    issubmit:{
      deep:true,
      immediate:true,
      handler(val){
        console.log(val,'de')
      }
    },
    isvalid:{
      deep:true,
      immediate:true,
      handler(val){
        console.log(val,'val')
        if(val==1){
          this.validateForm()
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
      rule: {
        name: [
          {required: true, message: '请输入姓名',trigger: 'blur'},
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        idNumber: [
          {required: true,  validator: (rule, value, callback) => {
              if(!value){
                callback(new Error('请输入身份证号'));
              }
              else if (!/^[1-9]\d{5}(18|19|20)\d{2}(0[1-8]|1[0-2])(0[1-9]|[12][0-9]|3[01])\d{3}[0-9xX]$/.test(value)) {
                callback(new Error('请填写正确的身份证号'));
              } else {
                callback();
              }
            },trigger: 'blur'},
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        certificateNo: [
          {required: true, message: '请输入技术经纪（理）人证书号',trigger: 'blur'},
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        certificateOrgan: [
          {required: true, message: '请输入发证机构',trigger: 'blur'},
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  created: function () {

  },
  methods: {
    // 校验数据
    validateForm () {
      let flag = null
      this.$refs.ruleForm[0].validate(valid => {
        if (valid) {
          flag = true
        } else {
          flag = false
        }
      })
      return flag
    },
    handleClose(tag) {
      this.keywords.splice(this.keywords.indexOf(tag), 1);
      console.log(this.keywords,'---')
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
      this.keywords.push({id:'',contractName:'',contractAmount:'',contractNumber:'', contractTurnover:'',});
      this.$emit('input',this.keywords)
      console.log(this.keywords,'---')

    },
  }
}
</script>
<style >
.contfrom .el-form-item__label{
  padding-left: 15px!important;
}
.noshow{
  display: none;
}
.contfrom{
  margin-top: 20px;
  padding-bottom: 20px;
  border: 1px solid rgb(221, 221, 221);
  /*background: rgb(234, 248, 251);*/
  display: flex;
  width: 100%;
  text-align: center;
}
.closebox{
  float: right;
  /*margin-bottom: -40px;*/
  z-index: 999;
  position: absolute;
  right: 0;
  background-color: rgb(221, 221, 221);
  margin-top: -10px;
  margin-right: -15px;font-size: 16px;
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
