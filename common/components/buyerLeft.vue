<template>
  <div class="leftbox">
    <div class="leftbar">
<!--      <div class="user_info">-->
<!--        <div-->
<!--          class="head"-->
<!--          :style="{backgroundImage: userSeller.userPhotoMiniPath?'url('+userSeller.userPhotoMiniPath+')':'url(/common/images/defaultImg/default.gif)'}"-->
<!--        > </div>-->
<!--        <div-->
<!--          class="name"-->
<!--          v-text="userSeller.shopName||''"-->
<!--        ></div>-->

<!--        <div class="clear">-->
<!--          <div class="level"><span v-text="'LV'+(userSeller.level||0)"></span>等级</div>-->
<!--          <div class="honor"><span v-text="userSeller.credit||0"></span>信誉</div>-->
<!--        </div>-->
<!--      </div>-->
      <!--<seller-tree :http='http' class="leftbar"></seller-tree>-->
      <div class="group"
           v-for="(menu,index) in meanTreeData3">
        <div class="name" @click="dropTechDown(menu)">{{menu.name}}
          <i class="iconfont icon-xiala"
             :class="{openT:!menu.opened}"
        ></i></div>
        <div
            class="links"
            :style="{'display':menu.opened?'none':'block' }"
            v-for="menuChild in menu.children"
            :key="menuChild.name">
          <strong
              :class="{active:isTech(menuChild)}"
              @click="techClick(menuChild)"
          >{{menuChild.name}}</strong>
        </div>
      </div>
      <div
        class="group"
        v-for="(menu,index) in meanTreeData"
        :key="index"
      >
        <div class="name"  @click="dropDown(menu)">{{menu.name}}
          <i class="iconfont icon-xiala"
             :class="{openT:menu.opened}"

          ></i></div>
        <div
          class="links"
          :style="{'display':mActivecode==menuChild.code?!menu.opened?'block':'none':menu.opened?'block':'none' }"
          v-for="menuChild in menu.children"
          :key="menuChild.name"
        >
          <strong
            :class="{active: isOpen(menuChild.code)}"
            @click="menuClick(menuChild)"
          >{{menuChild.name}}</strong>
          <span>
            <a
              :href="$pathPrefix+item.uri"
              v-for="item in menuChild.children"
              v-text="item.name"
              :key="item.name"
            ></a>
          </span>
        </div>
      </div>
      <div
          class="group"
          v-for="menu in meanTreeData2"
          :key="menu.name"
      >
        <div
            class="name"
            @click="dropDown(menu)"
        >{{menu.name}}
          <i class="iconfont icon-xiala"
             :class="{openT:menu.opened}"

          ></i></div>
        <div
            class="links"
            :style="{'display':mActivecode==menuChild.code?!menu.opened?'block':'none':menu.opened?'block':'none' }"
            v-for="menuChild in menu.children"
            :key="menuChild.name"
        >
          <strong
              :class="{active: isOpen(menuChild.code)}"
              @click="menuClick(menuChild)"
          >{{menuChild.name}}</strong>
          <span>
            <a
                :href="$pathPrefix+item.uri"
                v-for="item in menuChild.children"
                v-text="item.name"
                :key="item.name"
            ></a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: ['jquery', 'http','type'],
  data: function () {
    return {
      userSeller: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isDown:true,
      meanTreeData: [],
      meanTreeData2: [],
      showDetail:-1,
      meanTreeData3: [
        {
          name: "技术转移",
        children:[{
          url: "/common/usercenter/user_market_auth_form.html",
          active: false,
          icon: "el-icon-s-check",
          name: "资格认证",
          index: 0,
        },
        // {
        //   url: "/common/usercenter/user_market_form.html",
        //   active: false,
        //   icon: "el-icon-message-solid",
        //   name: "培训报名",
        //   index: 1,
        // },
        {
          url: "/common/usercenter/user_market_tech_achievements.html",
          active: false,
          icon: "el-icon-s-finance",
          name: "技术成果管理",
          index: 1,
        },

        {
          url: "/common/usercenter/user_market_tech_require.html",
          active: false,
          icon: "el-icon-s-help",
          name: "技术需求管理",
          index: 2,
        },
        {
          url: "/common/usercenter/user_market_tech_transfer.html",
          active: false,
          icon: "el-icon-s-platform",
          name: "技转业务管理",
          index: 3,
        },
        {
          url: "/common/usercenter/user_market_business_management.html",
          active: false,
          icon: "el-icon-s-cooperation",
          name: "我的业务管理",
          index: 4,
        },
        {
          url: "/common/usercenter/user_market_business_order.html",
          active: false,
          icon: "el-icon-s-order",
          name: "我的订单",
          index: 5,
        },
        {
          url: "/common/usercenter/user_market_form.html",
          active: false,
          icon: "el-icon-message-solid",
          name: "培训报名",
          index: 6,
        },
        {
          url: "https://study.kj01.cn/uc/index",
          active: false,
          icon: "el-icon-s-custom",
          name: "我的培训",
          target: true,
          index: 7,
        },
        {
          url: "/common/usercenter/user_market_tech_collection.html",
          active: false,
          icon: "el-icon-s-claim",
          name: "收藏",
          index: 8,
        },]
        }
      ],
      mActivecode: ''
    }
  },
  created: function () {
    this.mActivecode = this.$utils.getReqStr('code')
    if(this.mActivecode!==''){
      this.$set(v,'opened', v.opened)
    }
  },
  mounted: function () {
    var vm = this;
    this.http.menuTree({
      code:'001.001'
    }).then(function (res) {
      vm.meanTreeData = res.result.children;
    })
    this.http.menuTree({
      code: '001.004'
    }).then(function (res) {
      vm.meanTreeData2 = res.result.children;
    })
    var ID = this.$utils.getReqStr('classId');
    if(ID){
      this.meanTreeData3[6].name='培训报名'
    }else {
      this.meanTreeData3[6].name='报名信息管理'
    }
    this.initUserInfo();
    this.checkSite();
  },
  methods: {
    initUserInfo: function () {
      var vm = this;
      this.http.buyer().then(function (res) {
        vm.userSeller = res.result;
      })
    },
    dropDown:function(v){
        this.$set(v,'opened', !v.opened)
        // v.children.forEach(item=>{
        //   if(this.mActivecode==item.code){
        //     console.log(item,'--')
        //     v.opened=true
        //   }
        // })
    },
    dropTechDown:function(v){
      this.$set(v,'opened', !v.opened)
      // v.children.forEach(item=>{
      //   if(this.mActivecode==item.code){
      //     console.log(item,'--')
      //     v.opened=true
      //   }
      // })
    },
    //判断分站点
    checkSite: function () {
      var url = window.location.href
      var vm = this;
      if (url.indexOf('/site/') > 0) {
        vm.meanTreeData3.forEach((item) =>{
          if(item.index!==7){
            item.url=this.$pathPrefix+item.url
          }
        })
      }
    },
    techClick:function (menu){
      console.log(menu,'url')
      window.location.href = this.$pathPrefix+menu.url
    },
    menuClick: function (menu) {
      // 叶子 跳转
      if (menu.isLeaf == 1) {
        //if (menu.code !== '001.001.003.001') {
        if (menu.uri.indexOf('?') == -1) {
          window.location.href = this.$pathPrefix+menu.uri + '?code=' + menu.code;
        } else {
          window.location.href = this.$pathPrefix+menu.uri + '&code=' + menu.code;
        }
        // } else {
        //   this.$dialog.showToast('敬请期待！')
        // }
      }
    },
    isOpen: function (code) {
      return this.mActivecode ? this.mActivecode.indexOf(code) !== -1 : false
    },
    isTech: function (code) {
      return this.type==code.index ? true : false
    }
  }
}
</script>

<style>
.leftbox{
  min-height: calc(100vh - 120px)!important;
}
.leftbar .group{
  padding: 10px 18px!important;
}
.leftbar .group .name{
  font-weight: normal!important;
  cursor: pointer;
}
.leftbar .group .links{
  color: #666!important;
}
.leftbar .group .name i{
  font-size: 12px;
  color:#fc7f10;
  transition: transform 0.3s;
  -webkit-transition: transform 0.3s;

}
.openT{
  transform : rotate(-180deg)
}
.leftbar .group .links strong.active{
  background-color:#fc7f10;
  color: #fff!important;
  position: relative;
  width: 175px;
  margin-left: -30px;
  text-align: center;
  font-size: 18px;
  border-radius: 5px 5px 0px 0px;
  box-shadow: 0px 0px 5px #dfdfdf;
}
.leftbar .group .links strong.active::before{
  content: "";
  width: 0;
  height: 0;
  border-top: 15px solid  #ff5e06;
  border-left: 12px solid transparent;
  position: absolute;
   top: 40px;
  left: 0px;
}
.leftbar .group .links strong.active::after{
  content: "";
  width: 0;
  height: 0;
  border-top: 15px solid  #ff5e06;
  border-right: 12px solid transparent;
  position: absolute;
  top: 40px;
  right: 0px;
}
</style>
