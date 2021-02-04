<template>
  <div class="headerBox">
    <div class="mmdiv">
      <div class="headers">
        <div class="header-logo">
          <a
            href="/market/index.html"
            class="header-logo_box"
          ><img
              src="/style/images/logos/bsublogo.png"
              alt=""
            ></a>
          <span
            class="header-logo_text"
            v-text="name"
          ></span>
        </div>
        <div class="serchBox">
          <div class="serch">
            <select v-model="searchData.url">
              <template v-for="type in searchTypes">
                <option
                  :key="type.label"
                  :value="type.url"
                >{{type.label}}</option>
              </template>
            </select>
            <input
              type="text"
              placeholder="请输入关键词搜索"
              v-model="searchData.title"
            >
            <span class="iconfont icon-fangdajing" @click.stop="handleSearch"></span>
          </div>
          <div class="serchHot">
            <span class="serchHot-yellow">HOT</span>
            <a v-for="(hot,index) in hotData" :key="index" v-text="hot.lable" @click="handleserchHot(hot.lable)"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  props: {
    name: {
      type: String,
      default: "技术市场"
    },
  },
  data: function() {
    return {
      searchTypes: [
        {
          label: '服务机构',
          url: '/service/organization_list.html?title='
        },
        {
          label: '服务资源',
          url: '/service/resource_list.html?title='
        },
        {
          label: '技术成果',
          url: '/service/results_list.html?title='
        },
        {
          label: '企业需求',
          url: '/service/demand_list.html?title='
        }
      ],
      searchData: {
        url: '/service/resource_list.html?title=',
        title: ''
      },
      hotData: [
       {
        lable:'成果转化',
        id: 1
       },
       {
        lable:'知识产权',
        id: 2
       },
       {
        lable:'自动化',
        id: 3
       },
       {
        lable:'驱动控制',
        id: 4
       },
      ],
    };
  },
  created: function () {
    var urls = ['', '/service/organization_list.html', '/service/resource_list.html', '/service/results_list.html', '/service/demand_list.html']
    var isEmit = 0
    isEmit = urls.indexOf(location.pathname)
    isEmit !== -1 && (this.searchData.url = urls[isEmit] + '?title=')
  },
  methods: {
    handleserchHot: function (params) {
     location.href = this.searchData.url + params
    },
    handleSearch: function () {
      if (this.searchData.url === location.pathname) {
        this.$emit('search', this.searchData.title)
      } else {
        location.href = this.searchData.url + this.searchData.title
      }
    },
  }
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
  font-family: 'XinYeNianTi'; 
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
