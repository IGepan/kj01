<template>
  <div class="headerBox">
   <div style="padding-left: 50px">
    <div class="headers">
     <div class="header-logo">
      <a >
       <img src="./style/images/logos/bsublogo.png" alt="">
      </a>
<!--      <div class="header-text" v-if="navIndex === 0">-->
<!--       <div>科技创新</div>-->
<!--       <div>综合服务平台</div>-->
<!--      </div>-->
<!--       <div class="header-text" v-else-if="navIndex===7">-->
<!--         <div style="font-size: 35px;font-weight: bold;">平台动态</div>-->
<!--       </div>-->
<!--       <div class="header-text" v-if="navIndex===8">-->
<!--         <div style="font-size: 35px;font-weight: bold;">关于我们</div>-->
<!--       </div>-->
     </div>
     <div class="searchBox">
       <ul><li v-for="(nav,index) in navs" :key="index"><a :href="nav.url" :class="{active: nav.active}" >{{ nav.label }}</a></li></ul>
      <div class="search">
       <input type="text" class="input" placeholder="请输入关键词搜索" v-model="searchKey">
       <span class="iconfont icon-fangdajing" @click="searchFull"></span>
      </div>
     </div>
    </div>

   </div>
  </div>
</template>
<script>
module.exports = {
  props: {
    isfixed: {
      type: Boolean,
    },
    navIndex: {
      type: [String, Number],
      default: 0,
    },
  },
  data: function () {
    return {
      searchKey: "",
      navs: [
        {
          label: '首页',
          url: '/index.html',
        },
        {
          label: '政策资讯',
          url: '/polist.html'
        },
        // {
        //   label: '科技服务',
        //   url: '/service'
        // },
        {
          label: "技术转移",
          url: "/technologyMarket/index.html",
        },
        // {
        //   label: '科技金融',
        //   url: '/scindex.html'
        // },
        {
          label: '易智商城',
          url: '/mall/index.html'
        },
        {
          label: '活动中心',
          url: '/alist.html'
        },
        // {
        //   label: '创新资源',
        //   url: '/resources'
        // },
        {
          label: '科技智库',
          url: 'http://www.castss.com/'
        },
        // {
        //   label: '全景数据',
        //   url: 'http://datamap.kj01.cn/'
        // },
        {
         label:"平台动态",
         url:"/platform.html"
        },
        {
          label: '关于我们',
          // url: '/about2.html'
          url: '/about.html'
        }

      ]
    }
  },
  created: function () {
    this.navs[this.navIndex].active = 1;
  },
  watch: {
    navIndex: function (v) {
      this.navs.forEach(function (item, i) {
        item.active = v === i;
      });
    },
  },
  methods: {
    // alerta: function (i) {
    //   alert(i)
    // },
    searchFull: function () {
      location.href = "/search/?title=" + this.searchKey;
      // this.$dialog.showToast('敬请期待！')
      // this.$emit('search-full', this.getData())
    },
  },
};
</script>

<style>
.headerBox {
  background-color: #ffffff;
}
.headers {
  display: flex;
  width: 100%;
  height: 65px;
  /*justify-content: space-between;*/
  align-items: center;
}
.header-logo {
  display: flex;
}
.header-logo {
  display: flex;
  align-items: center;
}
.header-logo a {
  display: flex;
  width: 170px;
  height: 50px;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
}
.header-logo a img {
  width: 100%;
}
.header-text {
  font-family: XinYeNianTi;
  font-size: 24px;
  color: #01c8f2;
}
.searchBox {
  display: flex;
  align-items: center;
}
.searchBox ul li{
  margin-right: 20px;
  float: left;
}
.searchBox a {
  font-size: 18px;
  color: #1f2024;
  padding: 0 10px;

}
.searchBox .active {
  color: #ff5e06;
  font-weight: 600;
  position: relative;
}
.searchBox .active::after {
  position: absolute;
  content: "";
  display: block;
  margin-top: 5px;
  width: 100%;
  height: 2px;
  border-radius: 1px;
  background-color: #ff5e06;
}
.searchBox a:hover {
  position: relative;
  color: #ff5e06;
  font-weight: 600;
}
.searchBox a:hover::after {
  position: absolute;
  content: "";
  display: block;
  margin-top: 5px;
  width: 100%;
  height: 2px;
  border-radius: 1px;
  background-color: #ff5e06;
}
.search {
	background-color: #fff5f0;
	border-radius: 20px;
 display: flex;
  /*display: none;*/
 align-items: center;
}
.search .iconfont {
  width: 58px;
  height: 38px;
  line-height: 43px;
  display: inline-flex;
  color: #ff5e06;
  font-size: 24px;
  justify-content: center;
  cursor: pointer;
  border-radius: 20px;
}
.search:hover {
  position: relative;
  border-radius: 0 20px 20px 0;
  border: solid 1px #ff5e06;
  border-left: none;
}
.search:hover .input {
  position: absolute;
  display: inline-block;
  height: 40px;
  width: 336px;
  right: 55px;
  border-radius: 20px 0 0 20px;
  background-color: #fff5f0;
  border: solid 1px #ff5e06;
  border-right: none;
  z-index: 9999;
}
.search .input::-webkit-input-placeholder {
  font-size: 14px;
  color: #7b7e8a;
}
.search .input {
  display: none;
}
</style>
