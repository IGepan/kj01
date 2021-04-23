<template>
  <header id="page-header">
    <div class="container">
      <div class="row align-items-center justify-content-between">
        <div class="col">
          <a class="logo" href="./"><img class="img-fluid" src="images/logo-1.png" alt=""></a>
        </div>
        <div class="col-6">
          <div class="input-group search-top">
            <el-select v-model="type">
              <el-option class="el-same"
                  v-for="item in mailServiceTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" >
              </el-option>
            </el-select>
            <input type="text" v-model="title" class="form-control" aria-label="">
            <button class="btn btn-link btn-search" @click="handelSearch()"><i class="iconfont icon-search"></i></button>
          </div>
        </div>
        <div class="col-2">
          <div class="shopping-cart" @click="goCart">
            <i class="iconfont icon-cart" ></i>
            购物车
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
module.exports = {
  props: ["hidenuser", "topClass", "codeUrl", "codeTitle"],
  data: function() {
    return {
      toper: "header_mail", //组件引用判断
      title:'',
      type:'',
      mailServiceTypeList:[],
      mailSite:{},
      eActive:false
    };
  },
  created: function() {
    this.title = this.$utils.getReqStr('title')||'';
    this.type = this.$utils.getReqStr('type')||'';
    this.getType()
    this.mailSiteDetail()
  },
  methods: {
    handelSearch:function () {
      var vm=this;
      location.href='/mail/sub1.html?title='+vm.title+'&type='+vm.type
      // if(this.props.value==this.searchForm.type.name){
      //   this.eActive=index
      // }


    },
    goCart:function () {
      location.href='/common/servicetrade/shopping_cart.html'
    },
    getType:function (){
      var vm=this;
      this.$httpCom.mailServiceType().then(function (res) {
        if (res.code === 'rest.success') {
          vm.mailServiceTypeList = res.result
        }
      })
    },
    mailSiteDetail:function (){
      var vm=this;
      this.$httpCom.mailSiteDetail().then(function (res) {
        if (res.code === 'rest.success') {
          vm.mailSite = res.result
        }
      })
    }
  }
};
</script>

