<template>
  <div class="headerBox">
    <div class="mmdiv">
      <div class="headers">
        <div class="header-logo">
          <a href="/index.html" class="header-logo_box">
            <img src="/style/images/logos/bsublogo.png" alt="" />
          </a>
          <span class="header-logo_text" v-text="name"></span>
        </div>
        <div class="navslist navs_list">
          <a
            v-for="(item, index) in techList"
            :key="index"
            :class="{ active: item.active }"
            @click="clickTech(item)"
          >
            {{ item.value }}
          </a>
        </div>
<!--        <div class="search_box">-->
<!--          <input-->
<!--            type="text"-->
<!--            placeholder="请输入关键词搜索"-->
<!--            v-model="searchData.title"-->
<!--          />-->
<!--          <span class="iconfont icon-fangdajing"> 检索 </span>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>


<script>
module.exports = {
  props: {
    name: {
      type: String,
      default: "技术转移",
    },
    navIndexs:{
      type:Number
    }
  },

  data: function () {
    return {
      searchData: {
        url: "/service/resource_list.html?title=",
        title: "",
      },

      techList: [
        {
          id: 0,
          value: "首页",
          href: "/technologyMarket/index.html",
          impro: "index",
        },
        {
          id: 1,
          value: "技术成果汇",
          href: "/technologyMarket/tech_achievements.html",
          impro: "tech_achievements",
        },
        {
          id: 2,
          value: "技术需求汇",
          href: "/technologyMarket/tech_requirements.html",
          impro: "tech_requirements",
        },
        {
          id: 3,
          value: "投资机构",
          href: "/technologyMarket/investment_institutions.html",
          impro: "investment_institutions",
        },
        {
          id: 4,
          value: "技术经纪人",
          href: "/technologyMarket/technical_manager.html",
          impro: "technical_manager",
        },
        {
          id: 5,
          value: "技术机构",
          href: "/technologyMarket/service_organization.html",
          impro: "service_organization",
        },
        {
          id: 6,
          value: "认证入库",
          href: "/technologySchool/certification_warehousing.html",
          impro: "certification_warehousing",
        },
      ],
    };
  },

  watch: {
    navIndex: function (v) {
      this.techList.forEach(function (item, i) {
        item.active = v === i;
      });
    },
  },
  created: function () {
    var _this = this;
    var navIndexs = _this.$utils.validatesEmpty(
      _this.$utils.getCookie("navIndex")
    )
      ? _this.$utils.getCookie("navIndex")
      : 0;
    var url = window.location.href;
    console.log(url);

    if (url.indexOf("?") > -1) {
      url = url.split("?")[0];
    }
    url = url.split("/");
    url = url[url.length - 1];
    var urlList = _this.techList;
    console.log(urlList,'000');
    for (let i = 0; i < urlList.length; i++) {
      const element = urlList[i];
      if (url.indexOf(element.impro) > -1) {
        navIndexs = element.id;
      }
    }
    _this.techList[navIndexs].active = true;
  },
  methods: {
    //非空验证
    clickTech: function (item) {
      var _this = this;
      console.log(item);
      _this.$utils.setCookie("navIndex", item.id);
      location.href = item.href;
    },
  },
};
</script>
<style scoped>
.mmdiv {
  width: 1440px;
  margin: 0 auto;
}
/* 头部 */
.headerBox {
  background-color: #ffffff;
}
.headers {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-logo {
  display: flex;
  align-items: center;
}
.header-logo_box {
  display: flex;
  width: 171px;
  height: 48px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /* margin-right: 24px; */
}
.header-logo_box img {
  max-width: 100%;
}
.header-logo_text {
  font-family: "XinYeNianTi";
  font-size: 42px;
  color: #01c8f2;
  font-weight: 700;
}
/* 搜索框 */
.serch {
  font-size: 0;
  display: flex;
  align-items: center;
  background-color: #ddf9ff;
  border-radius: 20px;
  width: 600px;
  border: solid 1px #11cbf2;
  padding: 0px 17px;
}
.serch select {
  height: 38px;
  border-radius: 20px 0 0 20px;
  background-color: #ddf9ff;
  padding-right: 5px;
  color: #222327;
  font-size: 16px;
  cursor: pointer;
  margin-right: 7px;
}
.serch input {
  height: 20px;
  background-color: #ddf9ff;
  width: 480px;
  font-size: 16px;
  padding: 0 8px;
  border-left: 1px solid #11cbf2;
}
.serch input::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: #7b7e8a;
  font-size: 14px;
}
.serch input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #7b7e8a;
  font-size: 14px;
}
.serch input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #7b7e8a;
  font-size: 14px;
}
.serch input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #7b7e8a;
  font-size: 14px;
}
.serch .iconfont {
  font-size: 26px;
  color: #11cbf2;
  cursor: pointer;
}
.serchHot {
  margin-top: 8px;
}
.serchHot a {
  margin-left: 18px;
  font-size: 14px;
  color: #7b7e8a;
}
.serchHot-yellow {
  margin-left: 18px;
  color: #ff6800 !important;
  font-weight: 700;
}
</style>
