<template>
  <div >
    <div
      class="wbg"
      :class="{borderBottom: bottomBorder}"
    >
      <div class="mdiv">
        <div >
<!--          <div class="logobox">-->
<!--            <a-->
<!--              href="/aindex.html"-->
<!--              class="sublogo"-->
<!--            >-->
<!--              <img-->
<!--                src="/style/images/logos/bsublogo.png"-->
<!--                alt=""-->
<!--              >-->
<!--            </a>-->
<!--            <label-->
<!--              class="sublogo-label"-->
<!--              v-text="name"-->
<!--            ></label>-->
<!--          </div>-->
          <div>
<!--            <nav class="menus">-->
<!--              <template v-for="(nav, ni) in navs">-->
<!--                <li-->
<!--                  :class="{active: nav.active}"-->
<!--                  :key="ni"-->
<!--                ><a :href="nav.url">{{nav.label}}</a></li>-->
<!--              </template>-->
<!--            </nav>-->
            <div class="searchbox-1">
              <input
                class="input-search-1"
                v-model="searchValue"
                placeholder="搜索感兴趣的活动"
                type="text"
              >
              <button
                class="btn-search-1"
                type="button"
                @click.stop="handleSearch"
              ><i class="iconfont icon-fangdajing"></i></button>
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
.btn-search-1 .iconfont.icon-fangdajing{font-size: 28px!important;color: #0096ff}
.searchbox-1 {
  display: inline-block;
  vertical-align: middle;
  height: 35px;
  border: 1px solid #0096ff;
  font-size: 0;
  border-radius: 18px;
  overflow: hidden;
}

.input-search-1 {
  display: inline-block;
  width: 280px;
  border: 1px;
  padding: 0 10px;
  line-height: 35px;
  vertical-align: middle;
}
.btn-search-1 {
  background-color:#FFFFff;
  display: inline-block;
  vertical-align: middle;
  width: 48px;
  border: 1px;
  cursor: pointer;
  font-size: 16px;
  line-height: 35px;
  color: #fff;
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
