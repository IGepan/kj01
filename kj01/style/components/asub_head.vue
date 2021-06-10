<template>
  <div class="subhead">
    <div
      class="wbg"
      :class="{borderBottom: bottomBorder}"
    >
      <div class="mdiv">
        <div class="subhead-up">
          <div class="logobox">
            <a
              href="/aindex.html"
              class="sublogo"
            >
              <img
                src="/style/images/logos/bsublogo.png"
                alt=""
              >
            </a>
            <label
              class="sublogo-label"
              v-text="name"
            ></label>
          </div>
          <div class="navbox">
            <nav class="menus">
              <template v-for="(nav, ni) in navs">
                <li
                  :class="{active: nav.active}"
                  :key="ni"
                ><a :href="nav.url">{{nav.label}}</a></li>
              </template>
            </nav>
            <div class="searchbox">
<!--              <input-->
<!--                class="input-search"-->
<!--                v-model="searchValue"-->
<!--                placeholder="搜索感兴趣的活动"-->
<!--                type="text"-->
<!--              >-->
<!--              <button-->
<!--                class="btn-search"-->
<!--                type="button"-->
<!--                @click.stop="handleSearch"-->
<!--              >全 站 搜 索</button>-->
              <input type="text" class="input-search" placeholder="请输入关键词搜索" v-model="searchKey">
              <button class="btn-search" type="button" @click="searchFull">全 站 搜 索</button>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div
      v-if="breadcrumb.length"
      class="mdiv breadcrumb"
    >当前位置：<span class="breadcrumb__item"><a href="/">首页</a></span> <template v-for="(item, i) in breadcrumb">
        <span
          class="breadcrumb__item"
          :key="i"
        ><a
            v-if="item.url"
            :href="item.url"
          >{{item.label}}</a><template v-else>{{item.label}}</template></span>
      </template> </div>
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
      default: '活动'
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
  },
  data: function () {
    return {
      searchKey: '',
      searchValue: '',
      navs: [
        {
          label: '首页',
          url: '/'
        },
        {
          label: '企业学堂',
          url: '/alist.html?type=218340665862391473'
        },
        {
          label: '品牌活动',
          url: '/atList.html'
        },
        {
          label: '主题活动',
          url: '/alist.html?type=218340665912723126'
        }
      ]
    }
  },
  methods: {
    //全站搜索
    searchFull: function () {
      location.href = '/search/?title=' + this.searchKey
      // this.$dialog.showToast('敬请期待！')
      // this.$emit('search-full', this.getData())
    },
    handleSearch: function () {
      if (location.pathname === '/alist.html') {
        this.$emit('search', this.searchValue)
      } else {
        location.href = '/alist.html?title=' + this.searchValue
      }
    }
  }
}
</script>

<style>
.subhead {
  /* background: url(../images/poindex/bg_head.jpg) no-repeat center center; */
  min-height: 80px;
}
.wbg {
  background-color: #fff;
}
.subhead-up {
  height: 74px;
  padding-top: 10px;
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
  font-weight: bold;
  line-height: 54px;
  color: #0096ff;
}
.navbox {
  display: inline-block;
  vertical-align: middle;
  float: right;
  position: relative;
  margin-top: 8px;
}
.menus {
  display: inline-block;
  vertical-align: middle;
}
.menus li {
  display: inline-block;
  vertical-align: middle;
}
.menus li a {
  display: inline-block;
  font-size: 18px;
  padding: 0 20px;
  line-height: 36px;
  color: #343334;
}
.menus li.active a,
.menus li:hover a {
  height: 36px;
  background-color: #0096ff;
  color: #fff;
  border-radius: 18px;
  font-weight: bold;
}
.searchbox {
  display: inline-block;
  vertical-align: middle;
  height: 39px;
  border: 2px solid #0096ff;
  font-size: 0;
  border-radius: 18px;
  overflow: hidden;
}

.input-search {
  display: inline-block;
  width: 180px;
  border: 1px;
  padding: 0 10px;
  line-height: 37px;
  vertical-align: middle;
}
.btn-search {
  background-color: #0096ff;
  display: inline-block;
  vertical-align: middle;
  width: 108px;
  border: 1px;
  cursor: pointer;
  font-size: 16px;
  line-height: 38px;
  color: #fff;
  margin-top: -1px;
}
.breadcrumb {
  font-size: 14px;
  line-height: 14px;
  padding: 16px 0px;
  height: 52px;
  color: #9496a5;
}
.breadcrumb__item {
  color: #343334;
  padding: 0 10px;
  height: 14px;
  display: inline-block;
  border-right: 1px solid #9496a5;
}
.breadcrumb__item:last-child {
  border-right: 0;
}
.breadcrumb__item a {
  color: #9496a5;
}
.borderBottom {
  border-bottom: 2px solid #008ef2;
  width: 100%;
  height: 80px;
}
</style>
