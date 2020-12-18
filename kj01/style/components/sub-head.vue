<template>
  <div class="subhead">
    <div class="mdiv subhead-top">
      <div class="subhead-up">
        <div class="logobox">
          <a href="/" class="sublogo">
            <img src="/style/images/logos/sublogo.png" alt="">
          </a>
          <label class="sublogo-label" v-text="name"></label>
        </div>
        <div class="navbox">
          <div class="searchbox">
            <input class="input-search" v-model="searchValue" placeholder="技术创新 疫情防控" type="text">
            <button class="btn-search" type="button" @click.stop="handleSearch">搜 索</button>
          </div>
        </div>
      </div>
    </div>
    <nav class="menus">
    <template v-for="(nav, ni) in navs">
      <li :class="{active: nav.active}" :key="ni"><a :href="nav.url"><span>{{nav.label}}</span></a></li>
    </template>
    </nav>
    <div class="mdiv" v-if="breadcrumb.length">
      <div class="breadcrumb">当前位置：<span class="breadcrumb__item"><a href="/">首页</a></span> <template v-for="(item, i) in breadcrumb">
        <span class="breadcrumb__item" :key="i"><a v-if="item.url" :href="item.url">{{item.label}}</a><template v-else>{{item.label}}</template></span>
      </template> </div>
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
      default: ''
    },
    'cmsUrl': {
      type: String,
      default: ''
    },
    'breadcrumb': {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  created: function () {
    this.searchtitle && (this.searchValue = this.searchtitle);
    this.navs[this.navIndex].active = 1;
    this.cmsUrl && (this.navs[4].url = this.cmsUrl)
  },
  data: function () {
    return {
      searchValue: '',
      navs: [
        {
          label: '首页',
          url: '/poindex.html'
        },
        {
          label: '政策汇',
          url: '/polist.html'
        },
        {
          label: '项目申报',
          url: '/declaration.html'
        },
        {
          label: '政策问答',
          url: '/answer/index.html'
        },
        // {
        //   label: '政策精要',
        //   url: 'https://kj01news.liyantech.cn/qykj/'
        // }
        {
          label: '政策精要',
          url: '/qykj.html'
        }
      ]
    }
  },
  methods: {
    handleSearch: function () {
      if(location.pathname === '/polist.html') {
        this.$emit('search', this.searchValue)
      } else {
        location.href = '/polist.html?title=' + this.searchValue
      }

    }
  }
}
</script>

<style>
.subhead {
  background: url(../images/poindex/bg_head.jpg) no-repeat top center;
  background-size: 100% 100px;
}
.subhead-up {
  height: 100px;
  padding-top: 16px;
}
.logobox {
  display: inline-block;
}
.sublogo {
  display: inline-block;
  vertical-align: middle;
}
.sublogo-label {
  display: inline-block;
  vertical-align: middle;
  font-family: 'XinYeNianTi';
  font-size: 42px;
  color: #FFF;
  line-height: 54px;
  letter-spacing: 2px;
}
.navbox {
  display: inline-block;
  vertical-align: middle;
  float: right;
  position: relative;
  margin-top: 8px;
}

.menus {
	height: 50px;
	background-color: #018fff;
	box-shadow: 0px 2px 0px 0px
    rgba(161, 161, 161, 0.3);
	vertical-align: middle;
  text-align: center;
  font-size: 0;
}
.menus li {
  display: inline-block;
  vertical-align: middle;
}
.menus li span {
	font-family: MicrosoftYaHei;
  display: inline-block;
  padding: 0 30px;
	font-size: 20px;
	color: #ffffff;
  line-height: 50px;
}
.menus li.active span, .menus li:hover span{
  background-color: #095fec;
  font-weight: bold;
}
.searchbox {
  display: inline-block;
  vertical-align: middle;
  height: 40px;
  border: 2px solid #072ac1;
  font-size: 0;
}

.input-search {
  display: inline-block;
  width: 348px;
  padding: 0 10px;
  line-height: 36px;
  vertical-align: middle;
}
.btn-search {
  background-color: #072ac1;
  display: inline-block;
  vertical-align: middle;
  width: 108px;
  cursor: pointer;
  font-size: 16px;
  line-height: 36px;
  color: #fff;
}
.breadcrumb {
  margin-top: 20px;
  font-size: 14px;
  line-height: 14px;
	color: #999999;
}
.breadcrumb__item {
	color: #343334;
  padding: 0 10px;
  height: 14px;
  display: inline-block;
  border-right: 1px solid #b0bde8;
}
.breadcrumb__item:last-child {
  border-right: 0;
}
.breadcrumb__item a {
	color: #999999;
}
</style>
