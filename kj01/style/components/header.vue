<template>
  <div class="template-head">
    <div
      class="headerBox"
      :class="{'headerBox_line': bottomBorder}"
    >
      <div class="mdiv">
        <div class="headers">
          <div class="header-logo"><a
              href="/"
              class="header-logo_sublogo"
            ><img
                src="/style/images/logos/bsublogo.png"
                alt=""
              ></a> <span class="header-label">{{name}}</span></div>
          <div
            class="searchBox"
            :class="{foucs: isfoucs}"
          >
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
              @focus="isfoucs = true"
              @blur="isfoucs = false"
              v-model="searchData.title"
              placeholder="搜索感兴趣的服务"
            >
            <span
              class="iconfont icon-fangdajing"
              @click.stop="handleSearch"
            ></span>
          </div>
          <div class="button">
            <button @click.stop="handleToUrl">我有需求发布</button>
          </div>
        </div>
      </div>
    </div>
    <div class="navBox">
      <div class="mdiv">
        <ul class="nav">
          <template v-for="(nav, ni) in navs">
            <li
              :class="{active: nav.active}"
              :key="ni"
            >
              <a :href="nav.url">{{nav.label}}</a>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div
      class="placeBox"
      v-if="breadcrumb.length"
    >
      <div class="mdiv">
        <div class="breadcrumb">当前位置：<span class="breadcrumb__item"><a href="/">首页</a></span><template v-for="(item, i) in breadcrumb">
            <span
              class="breadcrumb__item"
              :key="'breadcrumb_' + i"
            ><a
                v-if="item.url"
                :href="item.url"
              >{{item.label}}</a><template v-else>{{item.label}}</template></span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  props: {
    'searchtitle': {
      type: String,
      default: ''
    },
    'navIndex': {
      type: [String, Number],
      default: 0
    },
    'name': {
      type: String,
      default: '服务'
    },
    'subNavIndex': {
      type: [String, Number],
      default: 0
    },
    'bottomBorder': {
      type: Boolean,
      default: false
    },
    'breadcrumb': {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
    navIndex: function (v) {
      this.navs.forEach(function (item, i) {
        item.active = v === i
      })
    }
  },
  created: function () {
    this.searchtitle && (this.searchValue = this.searchtitle)
    this.$utils.getCookie('USER_INFO') && (this.userInfo = JSON.parse(localStorage.getItem('USER_INFO')))
    this.navs[this.navIndex].active = 1
    this.navIndex === 5 && (this.navs[this.navIndex].subNavs[this.subNavIndex].active = 1)
  },
  data: function () {
    return {
      navs: [
        {
          label: '首页',
          url: '/service'
        },
        {
          label: '科技交易',
          url: '/service/resource_list.html?stype=003'
        },
        {
          label: '科技金融',
          url: '/service/resource_list.html?stype=004'
        },
        {
          label: '研发设计',
          url: '/service/resource_list.html?stype=010'
        },
        {
          label: '检验检测',
          url: '/service/resource_list.html?stype=009'
        },
        {
          label: '知识产权',
          url: '/service/resource_list.html?stype=002'
        },
        {
          label: '政策咨询',
          url: '/service/resource_list.html?stype=002'
        }
      ],
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
      isfoucs: false
    }
  },
  methods: {
    handleSearch: function () {
      location.href = this.searchData.url + this.searchData.title
    },
    handleToUrl: function () {
      if (this.userInfo && this.userInfo.userName) {
        if (this.userInfo.userTypes && this.userInfo.userTypes.indexOf('001') === -1) {
          this.$parent.$refs.lytoper.openBuyerConfirm()
        } else {
          this.$utils.openNewTable('/common/buyer/demand/add.html?code=001.001.002.002')
        }
      } else {
        window.location.href = '/common/login.html';
      }
    }
  }
}
</script>

<style>
/* 导航栏组件 */
.headerBox {
  background-color: #ffffff;
}
.headers {
  display: flex;
  align-items: center;
  padding: 11px;
  width: 100%;
}
.header-logo {
  display: flex;
}
.header-logo_sublogo {
  margin-right: 28px;
}
.header-label {
  font-size: 30px;
  color: #0096ff;
  border-left: 1px solid #c3d7e5;
  padding: 7px 0px 7px 20px;
}
/* 搜索 */
.searchBox {
  display: flex;
  align-content: flex-start;
  align-items: center;
  border: solid 1px #0096ff;
  padding: 10px;
  font-size: 12px;
  color: #9496a5;
  width: 420px;
  height: 40px;
  margin-left: 182px;
}
.searchBox.foucs {
  border-color: #fe900c;
}
.searchBox select {
  color: #9496a5;
  cursor: pointer;
  padding-right: 8px;
  margin-right: 4px;
}
.searchBox input {
  flex: 1;
  padding-left: 10px;
  border-left: solid 1px #eeeff6;
}
.searchBox .iconfont {
  font-size: 24px;
  margin-right: 8px;
  cursor: pointer;
}
.searchBox.foucs .iconfont {
  color: #fe900c;
}
.searchBox select option,
.searchBox input::-webkit-input-placeholder {
  color: #9496a5;
}
/* 发布需求 */
.headers .button button {
  background-color: #0096ff;
  font-size: 18px;
  line-height: 40px;
  color: #ffffff;
  cursor: pointer;
  padding: 0 21px;
  margin-left: 20px;
}
/* 导航栏 */
.navBox {
  background-color: #0096ff;
}
.navBox .nav {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 50px;
}
.navBox .nav li {
  padding: 0 16px;
}
.navBox .nav .active,
.navBox .nav li:hover {
  background-color: #0060d6;
  font-weight: 700;
}
.navBox .nav li a {
  color: #ffffff;
}
/* 当前位置 */
.placeBox .breadcrumb {
  margin-top: 20px;
  font-size: 14px;
  line-height: 14px;
  color: #999999;
}
.placeBox .breadcrumb__item {
  color: #343334;
  padding: 0 10px;
  height: 14px;
  display: inline-block;
  border-right: 1px solid #b0bde8;
}
.placeBox .breadcrumb__item a {
  color: #999999;
}
.placeBox .breadcrumb__item:last-child {
  border-right: 0;
}
</style>
