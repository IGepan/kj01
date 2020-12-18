<template>
  <div class="bannerBox">
    <div class="mdiv">
      <div class="banner-search">
        <ul class="listUp">
          <template v-for="(nav, ni) in navs">
            <li
              @click.stop="handleSelectType(ni)"
              :class="{active: nav.active}"
              :key="ni"
            >{{nav.label}}</li>
          </template>
        </ul>
        <div class="searchbox-max">
          <input
            type="text"
            v-model="searchValue"
            placeholder="请输入想搜索的内容"
          >
          <button
            @click.stop="handleSearch"
            type="button"
          >搜&nbsp;&nbsp;索</button>
        </div>
        <ul class="listDown">
          <template v-for="(word, wi) in keyWords">
            <li :key="wi"><a :href="word.url">{{word.label}}</a></li>
          </template>
        </ul>
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
      type: Number,
      default: 0
    }
  },
  watch: {
    navIndex: function (v) {
      typeof v !== undefined && this.selectSearchType(v)
    }
  },
  created: function () {
    this.searchtitle && (this.searchValue = this.searchtitle)
  },
  data: function () {
    return {
      searchValue: '',
      navs: [
        {
          label: '科技企业',
          url: '/resources/enterprise_list.html?title=',
          active: true
        },
        {
          label: '研发机构',
          url: '/resources/organization_list.html?title=',
          active: false
        },
        {
          label: '科技人才',
          url: '/resources/talents_list.html?title=',
          active: false
        },
        {
          label: '仪器设备',
          url: '/resources/equipment_list.html?title=',
          active: false
        },
        {
          label: '专利成果',
          url: '/resources/patent_list.html?title=',
          active: false
        },
        {
          label: '文献',
          url: '/resources/literature_list.html?title=',
          active: false
        }
      ],
      selectTypeIndex: 0,
      keyWords: []
    }
  },
  methods: {
    selectSearchType: function (v) {
      this.navs.forEach(function (item, i) {
        item.active = v === i
      })
    },
    handleSelectType: function (i) {
      this.selectTypeIndex = i;
      console.log(i)
      this.selectSearchType(i)
    },
    handleSearch: function () {
      var type = this.navs[this.selectTypeIndex];
      if (location.pathname === '/alist.html') {
        this.$emit('search', this.searchValue)
      } else {
        location.href = type.url + this.searchValue
      }
    }
  }
}
</script>

<style>
.bannerBox {
  background: url(../images/resource/bannerBg.png) no-repeat center center;
  height: 270px;
}
.bannerBox .mdiv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.banner-search {
  width: 720px;
}
.listUp {
  display: flex;
  margin-top: 103px;
  background-color: rgba(0, 0, 0, 0.2);
}
.listUp li {
  padding: 7px 10px;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
}
.listUp .active,
.listUp li:hover {
  background-color: #ff8a00;
}
.searchbox-max {
  margin-top: 0;
  display: flex;
  height: 60px;
}
.searchbox-max input {
  flex-grow: 8;
  padding-left: 10px;
}
.searchbox-max button {
  flex-grow: 1;
  background-color: #ff8a00;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
}
.listDown {
  display: flex;
}
.listDown li {
  font-size: 14px;
  margin-right: 16px;
  margin-top: 11px;
  cursor: pointer;
}
.listDown li a {
  color: #b9ccf4;
}
.listDown .active a,
.listDown li:hover a {
  color: #ffaa45;
}
</style>
