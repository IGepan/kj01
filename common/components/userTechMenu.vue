<template>
  <div>
    <ul>
      <li v-for="(item, index) in urlData" :key="index" v-if="isNotSite==false">
        <a :href="item.url" :class="item.active ? 'active' : ''" target="_blank" v-if="item.target">
          <i :class="item.icon"></i>
          {{ item.name }}
        </a>
        <a v-else :href="item.url" :class="item.active ? 'active' : ''">
          <i :class="item.icon"></i>
          {{ item.name }}
        </a>
      </li>
      <li v-for="(item, index) in urlData" :key="index" v-else>
        <a :href="$pathPrefix+item.url" :class="item.active ? 'active' : ''" target="_blank" v-if="item.target">
          <i :class="item.icon"></i>
          {{ item.name }}
        </a>
        <a v-else :href="$pathPrefix+item.url" :class="item.active ? 'active' : ''">
          <i :class="item.icon"></i>
          {{ item.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      isNotSite:false,
      urlData: [
        {
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
        },
      ],
    };
  },
  methods: { //检查是否分站点
    checkSite: function () {
      var url = window.location.href
      var vm = this;
      if (url.indexOf('/site/') > 0) {
        vm.isNotSite=true
    }
    },
  },
  props: ["type"],
  mounted() {
    this.checkSite();
    // console.log("this.type", this.type);
    this.urlData.forEach((element) => {
      if (this.type == element.index) {
        element.active = true;
      }
    });

    var ID = this.$utils.getReqStr('classId');
      if(ID){
        this.urlData[6].name='培训报名'
      }else {
        this.urlData[6].name='报名信息管理'
      }
    }
};
</script>

<style></style>
