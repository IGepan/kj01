<template>
  <div class="template-head">
    <div
      class="headerBox"
      :class="{'headerBox_line': bottomBorder}"
    >
      <div class="mdiv">
        <div class="headers">
          <div class="header-logo"><a
              href="/resources/"
              class="header-logo_sublogo"
            ><img
                src="/style/images/logos/bsublogo.png"
                alt=""
              ></a> <span class="header-label">{{name}}</span></div>
          <div class="navBox">
            <ul class="nav">
              <template v-for="(nav, ni) in navs">
                <li
                  :class="{active: nav.active}"
                  :key="ni"
                >
                  <template v-if="nav.sub">
                    <ul class="sc-select">
                      <template v-for="(snav, sni) in nav.subNavs">
                        <li
                          :key="'sub_' + sni"
                          :class="{active: snav.active}"
                        ><a :href="snav.url">{{snav.label}}</a></li>
                      </template>
                    </ul>
                  </template>
                  <a :href="nav.url">{{nav.label}}</a>
                </li>
              </template>
            </ul>
            <!-- div添加hide隐藏input输入框 -->
            <div
              class="header-search"
              @mouseover.stop="handleSetHide"
              @mouseout.stop="handleSetHide"
              :class="{'hide': isHideSearch}"
            ><input
                placeholder="搜索感兴趣的资源"
                type="text"
                v-model="searchValue"
                class="input-search"
              ><span
                class="iconfont icon-fangdajing"
                @click.stop="handleSearch"
              ></span></div>
          </div>
        </div>
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
      default: '创新资源'
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
    this.navs[this.navIndex].active = 1
    this.navIndex === 5 && (this.navs[this.navIndex].subNavs[this.subNavIndex].active = 1)
  },
  data: function () {
    return {
      searchValue: '',
      navs: [
        {
          label: '首页',
          url: '/'
        },
        {
          label: '科技企业',
          url: '/resources/enterprise_list.html'
        },
        {
          label: '研发机构',
          url: '/resources/organization_list.html'
        },
        {
          label: '科技人才',
          url: '/resources/talents_list.html'
        },
        {
          label: '仪器设备',
          url: '/resources/equipment_list.html'
        },
        {
          label: '专利成果',
          url: '/resources/patent_list.html'
        }
      ],
      isHideSearch: true
    }
  },
  methods: {
    handleSearch: function () {
      // if (location.pathname === '/alist.html') {
      //   this.$emit('search', this.searchValue)
      // } else {
      //   location.href = '/alist.html?title=' + this.searchValue
      // }
    },
    handleSetHide: function () {
      this.isHideSearch = !this.isHideSearch
    }
  }
}
</script>

<style scoped>
.headerBox {
  background-color: #ffffff;
}
.headers {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px;
}
.header-logo {
  display: flex;
}
.header-logo_sublogo {
  /* margin-right: 28px; */
}
.header-label {
  font-family: 'XinYeNianTi'; 
  font-size: 42px;
  color: #0096ff;
}
.navBox {
  display: flex;
  align-items: center;
}
.nav {
  display: flex;
  margin-right: 10px;
  position: relative;
  align-items: stretch;
}
.navBox .nav li > a {
  padding: 6px 17px;
  display: inline-flex;
  color: #343334;
  font-size: 18px;
}
.navBox .nav li {
  position: relative;
}
.navBox .nav > .active a,
.navBox .nav > li > a:hover,
.navBox .nav > li > .sc-select:hover + a {
  background-color: #0096ff;
  border-radius: 18px;
  font-weight: bold;
  color: #ffffff;
}
.sc-select {
  display: none;
  position: absolute;
  font-size: 18px;
  left: -17px;
  width: 140px;
  top: 50px;
  padding: 15px 20px;
  z-index: 10;
  color: #030001;
  background-color: #ffffff;
  box-shadow: 4px 6px 26px 0px rgba(0, 0, 0, 0.22);
}
.sc-select::before,
.sc-select:after {
  position: absolute;
  content: '';
  left: 50%;
  transform: translateX(-50%);
  border-top: 15px transparent dashed;
  border-left: 15px transparent dashed;
  border-right: 15px transparent dashed;
  border-bottom: 15px #ffffff solid;
}
.sc-select:before {
  top: -29px;
  border-bottom: 15px #ffffff solid;
}
.sc-select:after {
  top: -29px;
  border-bottom: 15px #ffffff solid;
}
.navBox .sc-select li a {
  background-color: #fff !important;
  color: #343334 !important;
  font-weight: normal !important;
  display: inline-block;
  width: 100%;
  text-align: center;
  padding: 10px 10px;
}
.navBox .sc-select li {
  border-bottom: 1px solid #c3d7e5;
}
.navBox .sc-select li:last-child {
  border-bottom: 0;
}
.navBox .sc-select li.active a {
  color: #ff8a00 !important;
}
.navBox .sc-select a:hover {
  color: #ff8a00 !important;
}
.nav li:hover > .sc-select {
  display: block;
}
.header-search {
  display: flex;
  font-size: 0;
  align-items: center;
  justify-content: center;
  position: relative;
}
.header-search:hover input{
  display: block;
  position: absolute;
  right: 40px;
}
.header-search input {
  width: 180px;
  height: 40px;
  padding: 0 5px;
  background-color: #eeeff6;
  display: none;
}
.header-search span {
  display: inline-flex;
  font-size: 24px;
  color: #999999;
  width: 40px;
  height: 40px;
  background-color: #eeeff6;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.headerBox_line {
  border-bottom: solid 2px #008ef2;
}
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
