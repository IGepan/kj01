<template>
  <div class="toper">
    <div class="mmdiv">
      <div class="toper-left">
        <div class="">返回<a href="/index.html"><span class="cut">[易智网]</span></a></div>
        <div class="">Hi~<span v-if='userInfo && userInfo.userName'></span>，欢迎来到<a :href="$pathPrefix+'/index.html'">{{webInfo.saasName}}</a>！</div>
      </div>
        <div class="toper-right" v-if="userInfo && userInfo.userId">
            <div
                    class="usermin"
                    v-if='userInfo && userInfo.userName'
            >
                <span v-text="userInfo.userName"></span>
                <a
                        v-show="userInfo && userInfo.userId"
                        @click="exitClick"
                        class="logout"
                >[退出]</a>
            </div>
            <div class="links">
                <a
                        v-if='userInfo && !userInfo.userName'
                        :href=$pathPrefix+"/common/reg.html"
                >免费注册</a>
                <a
                        v-if='userInfo && userInfo.userName'
                        @click="msgChlick"
                >消息</a>
                <a
                        v-if='userInfo && userInfo.userName'
                        :href=$pathPrefix+"/common/buyer/collect/goods/?categoryId=82779310439534201&code=001.001.003.001"
                >收藏</a>
                <a
                        v-if='userInfo && userInfo.userName'
                        @click="yhzxClick"
                >用户中心</a>
                <a
                        v-if='userInfo && userInfo.userName'
                        @click="fwsClick"
                >{{isSeller ? '卖家中心': '服务商入驻'}}</a>
            </div>
            <div class="official-account"><span class="show">关注易智网</span>
                <span class="avater">
            <img
                    src="/style/images/index/qrcode.jpg"
                    alt=""
            ><span class="avater-text">易智网</span>
          </span></div>
            <div class="official-account"><span class="show">小程序</span><span class="avater">
            <img
                    src="/style/images/footerCode1.jpg"
                    alt=""
            ><span class="avater-text">易智项目通</span>
            <img
                    src="/style/images/footerCode2.jpg"
                    alt=""
            ><span class="avater-text">易智活动通</span>
          </span></div>
        </div>
        <div class="toper-right" v-else>
            <div class="loginbox">
                <a :href="$pathPrefix+'/common/login.html'">登录</a>
                <a :href="$pathPrefix+'/common/reg.html'">注册</a>
            </div>
            <div class="service-box"><a :href="$pathPrefix+'/common/login.html'">服务商入驻</a></div>
            <div class="official-account"><span class="show">关于易智网</span>
                <span class="avater">
            <img
                    src="/style/images/index/qrcode.jpg"
                    alt=""
            ><span class="avater-text">易智网</span>
          </span>
            </div>
        </div>
    </div>
    <chat-im :userinfo="userInfo"></chat-im>
  </div>
</template>

<script>
module.exports = {
  props: ["hidenuser", "topClass", "codeUrl", "codeTitle"],
  data: function() {
    return {
      toper: "toper", //组件引用判断
      url: this.$pathPrefix+"/common/login.html",
      userInfo: {},
      isSeller: false,
      logined: false,
      urlType: false,
      urlIsType: false,
      urlIsCheckSeller: false,
      urlIsCheckBuyer: false,
      menuInfo: {
        cartCount: 0,
        messageCount: 0
      }, //悬浮菜单项
      protocol: [
        {
          title: "注册协议",
          protocolType: 1,
          content: ""
        },
        {
          title: "隐私保护协议",
          protocolType: 5,
          content: ""
        }
      ],
        webInfo:''
    };
  },
  created: function() {
      this.getPublicDetail()
      //百度统计
      if(location.host.indexOf('liyantech')<0){
          var _hmt = _hmt || [];
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?021c67d64bfbb621d1ad064cff9409df";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
      }
    var vm = this;
    var pathname = location.pathname;
    var saasid = localStorage.getItem("saasId");
    // 当前用户信息
    var auser = JSON.parse(localStorage.getItem("USER_INFO"));
    // cookie用户信息
    var userInfo = (this.userInfo = JSON.parse(
      vm.$utils.getCookie("USER_INFO")
    ));
    this.urlIsType = [
      "/common/seller/",
      "/common/buyer",
      "/common/usercenter/",
      "/common/activity/",
      "/common/activityTopic/",
      "/common/servicetrade/",
      "/demand"
    ].some(function(text) {
      return (
        pathname.indexOf(text) !== -1 &&
        pathname.indexOf("demanddetail") === -1 &&
        pathname.indexOf("demand_list") === -1
      );
    });
    this.urlIsCheckSeller = ["/common/seller/"].some(function(text) {
      return (
        pathname.indexOf(text) !== -1 &&
        pathname.indexOf("demanddetail") === -1 &&
        pathname.indexOf("demand_list") === -1
      );
    });
    this.urlIsCheckBuyer = [
      "/common/usercenter",
      "/common/buyer",
      "/common/activity/",
      "/common/activityTopic/",
      "/common/servicetrade/",
      "/demand"
    ].some(function(text) {
      return (
        pathname.indexOf(text) !== -1 &&
        pathname.indexOf("demanddetail") === -1 &&
        pathname.indexOf("demand_list") === -1
      );
    });
    // 用户ID  站点ID 没有站点ID  发生变化都要重新获取用户信息
    if (
      !saasid ||
      !auser ||
      !userInfo ||
      userInfo.saasId !== auser.saasId ||
      userInfo.userId !== auser.userId
      // userInfo.userTypes !==auser.userTypes
    ) {
      this.getWebInfo();
    } else if (this.urlIsType) {
      if (!userInfo) {
        this.getWebInfo();
      } else {
        if (
          (this.urlIsCheckSeller &&
            userInfo["userTypes"] &&
            userInfo["userTypes"].indexOf("002") !== -1) ||
          (this.urlIsCheckBuyer &&
            userInfo["userTypes"] &&
            userInfo["userTypes"].indexOf("001") !== -1)
        ) {
          userInfo && userInfo.userId && this.initSeller();
          this.accessSave();
        } else {
          if (this.urlIsCheckSeller) {
            // this.openSellerConfirm()
          } else {
            // console.log(2);
            this.openBuyerConfirm();
          }
        }
      }
    } else {
      userInfo && userInfo.userId && this.initSeller();
      this.accessSave();
    }
  },
  methods: {
      getPublicDetail(){
          let vm=this;
          this.$httpCom.publicDetail().then(function(res) {
              if (res.code === "rest.success") {
                  vm.webInfo = res.result;
                  vm.monitorSetItem('webInfo', JSON.stringify(vm.webInfo));
              }
          });
      },
    isHomePage: function(e) {
      if (location.pathname === "/" || location.pathname === "/index.html") {
        e.preventDefault();
      }
    },
    getWebInfo: function() {
      var vm = this;
      this.$httpCom.webCommonUser().then(function(res) {
        if (res.code === "rest.success") {
          vm.userInfo = res.result;
          if (vm.urlIsType && !vm.userInfo.userId) {
            console.log("没有登录");
            window.location.href = this.$pathPrefix+"/common/login.html";
          } else {
            if (vm.userInfo.userId) {
              vm.initSeller();
            } else {
              if (vm.urlIsCheckSeller) {
                // this.openSellerConfirm()
              } else {
                // vm.openBuyerConfirm()
              }
            }
            vm.accessSave();
            vm.$utils.delCookie("USER_INFO");
            vm.$utils.setCookie("USER_INFO", res.result);
            localStorage.setItem("saasId", res.result.saasId);
            localStorage.setItem("USER_INFO", JSON.stringify(res.result));
            // vm.urlType ? (location.href = vm.urlType) : location.reload(true);
            vm.urlType = false;
          }
        }
      });
    },
    clearUnreadMsg: function() {
      this.menuInfo.messageCount = 0;
    },
    //获取未读消息数量
    getUnreadMsgCount: function() {
      var $this = this;
      this.$http
        .get(httpUrl.baseUrl + "/im/getUnreadMsgCount")
        .then(function(res) {
          $this.menuInfo.messageCount = res.result;
        });
    },
    updateCartInfo: function() {
      //获取消息，购物车的消息通知数字
      var $this = this;
      this.$http.get(httpUrl.baseUrl + "/shopcar/total").then(function(res) {
        var count = parseInt(res.result);
        //最大显示99
        if (count > 99) {
          count = 99;
        }
        $this.menuInfo.cartCount = count;
      });
    },
    action: function(type) {
      switch (type) {
        case "message":
          this.$root.$chat_history.showDlg();
          break;
        case "server":
          window.open(
            "http://www.kj01.cn/service.htm?arg=10113491&style=4&kflist=off&kf=edwinzuo&zdkf_type=1&lnk_overflow=0&callback_id6ds=10152438&language=zh-cn&charset=gbk&referer={hz6d_referer}&keyword=http%3A%2F%2Fwww.kjy01.com%2Findex.html&tfrom=1&tpl=crystal_blue",
            "_blank",
            "height=600,width=800,top=50,left=200,status=yes,toolbar=no,menubar=no,resizable=no,scrollbars=no,location=no,titlebar=no"
          );
          break;
        case "help":
          $dialog.showToast("开发中……");
          break;
        case "top":
          window.scrollTo(0, 0);
          break;
        case "cart":
          if (
            this.userInfo.userTypes &&
            this.userInfo.userTypes.indexOf("001") !== -1
          ) {
            this.$utils.openNewTable("/common/servicetrade/shopping_cart.html");
          } else {
            this.urlType = "/common/servicetrade/shopping_cart.html";
            this.openBuyerConfirm();
          }
          break;
      }
    },
    initSeller: function() {
      this.updateCartInfo();
      this.getUnreadMsgCount();
      if (this.userInfo.userTypes) {
        for (var it of this.userInfo.userTypes) {
          if (it === "002") {
            this.isSeller = true;
          }
        }
      }
    },
    msgChlick: function() {
      if (!this.userInfo.userId) {
        window.location.href = this.$pathPrefix+"/common/login.html";
        return;
      } else {
        window.location.href = this.$pathPrefix+"/common/usercenter/user_message.html";
      }
    },
    getProtocol: function(type) {
      var vm = this;
      var protocolType = vm.protocol[type].protocolType;
      vm.$httpCom
        .protocol({
          protocolType: protocolType
        })
        .then(function(res) {
          if (res.result) {
            vm.protocol[type].content = res.result.protocolContact;
            vm.openProtocolConfirm(type);
          }
        });
    },
    openProtocolConfirm: function(type) {
      var vm = this;
      var protocol = vm.protocol[type];
      var options = {
        class: "full",
        title: protocol.title,
        texts: protocol.content,
        buttons: [
          {
            label: "确认阅读",
            fun: function() {
              jQuery("#protocol")[0].checked = true;
              return 1;
            }
          }
        ]
      };
      vm.$dialog.confirm2(options);
    },
    openSellerConfirm: function() {
      var vm = this;
      var options = {
        title: "温馨提示",
        texts:
          '<p style="padding: 0 20px;">你没有该站点卖家身份，请开通卖家身份?<p>',
        width: "500px",
        buttons: [
          {
            label: "放弃",
            fun: function() {
              location.href = vm.$pathPrefix+"/index.html";
              return 1;
            }
          },
          {
            label: "现在就去",
            fun: function() {
              location.href = this.$pathPrefix+"/common/seller/store_agreement.html";
              return 1;
            }
          }
        ]
      };
      this.$dialog.confirm2(options);
    },
    openBuyerConfirm: function() {
      var vm = this;
      var options = {
        title: "买家身份确认",
        texts:
          '<p style="padding: 0 20px;">你没有该站点买家身份，如继续操作，则需同意成为该站点买家?<p><div style="text-align: center;padding-bottom: 20px;"><label for="protocol"><input id="protocol" type="checkbox"><span>我已阅读并同意<a id="protocolView"> <span style="color: blue">《注册协议》</span> <span style="color: blue">《隐私保护协议》</span></a></span></label></div>',
        width: "500px",
        buttons: [
          {
            label: "取消",
            fun: function() {
              location.href = vm.$pathPrefix+"/index.html";
              return 1;
            }
          },
          {
            label: "同意",
            fun: function() {
              if ($("#protocol").is(":checked")) {
                vm.$httpCom
                  .becomeBuyer({ protocolReadFlag: 1 })
                  .then(function(res) {
                    if (res.code === "rest.success") {
                      // 延迟请求 避免数据库写入延迟导致的数据无法查询
                      setTimeout(function() {
                        vm.getWebInfo();
                      }, 300);
                    } else {
                      vm.$dialog.showToast(res.desc);
                    }
                  });
                return 1;
              } else {
                vm.$dialog.showToast("请先选择相关协议！");
                return 0;
              }
            }
          }
        ],
        closeCallback: function() {
          location.href = vm.$pathPrefix+"/index.html";
          return 1;
        }
      };
      this.$dialog.confirm2(options);
      jQuery("#protocolView").on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        var type = e.target.innerText === "《注册协议》" ? 0 : 1;
        vm.protocol[type].content
          ? vm.openProtocolConfirm(type)
          : vm.getProtocol(type);
      });
    },
    yhzxClick: function() {
      if (!this.userInfo.userId) {
        window.location.href = this.$pathPrefix+"/common/login.html";
        return;
      } else if (this.userInfo.userTypes &&this.userInfo.userTypes.indexOf("001") !== -1) {
        window.location.href = this.$pathPrefix+"/common/buyer/index.html";
      } else {
        this.urlType = this.$pathPrefix+"/common/buyer/index.html";
        this.openBuyerConfirm();
      }
    },
    fwsClick: function() {
      if (!this.userInfo.userId) {
        window.location.href = this.$pathPrefix+"/common/login.html";
        return;
      }
      if (this.isSeller) {
        window.location.href = this.$pathPrefix+"/common/seller/index.html";
      } else {
        window.location.href = this.$pathPrefix+"/common/seller/store_agreement.html";
      }
    },
    exitClick: function() {
      this.$utils.delCookie("USER_INFO");
      this.$utils.delCookie("LOGIN_INFO");
      localStorage.removeItem("USER_INFO");
      localStorage.removeItem("saasId");
      window.location.href = this.$pathPrefix+"/common/login.html";
    },
    accessSave: function() {
      var data = {};
      if (this.userInfo && this.userInfo.userId) {
        data["userId"] = this.userInfo.userId;
        data["userName"] = this.userInfo.userName;
      }
      this.$httpCom.accessSave(data);
    }
  }
};
</script>
<style scoped>
.toper {
  height: 40px;
  line-height: 40px;
  background-color: #e9e8f0;
  color: #6a6e7d;
}
.toper .mmdiv{
    display:flex;
    justify-content: space-between;
    align-items: center;
    width:1200px;
    margin:0 auto;
}
.toper-left {
  display: flex;
  height: 40px;
}
.toper-left a{
  color:#ee661c;
}
.toper-left .icon-dingwei {
  color: #777777;
  margin-right: 5px;
}
.toper-left .cut {
  margin-left: 5px;
  margin-right: 30px;
  cursor: pointer;
}
.toper-left .cut:hover {
  color: #ee661c;
}
.toper-right {
  display: flex;
}
.toper-right div {
  margin-left: 20px;
}
.loginbox a {
  display: inline-block;
  margin-right: 5px;
  color: #6a6e7d;
}
.loginbox a:hover {
  color: #ee661c;
}
.loginbox a:hover::after {
  color: #6a6e7d;
}
.loginbox a:last-child {
  margin-right: 0;
}
.service-box a{
    color: #6a6e7d;
}
.service-box a:hover{
    color: #ee661c;
}
.official-account {
  position: relative;
  cursor: pointer;
}
.official-account .avater {
  display: block;
  position: absolute;
  right: -140px;
  top: 5px;
  padding: 5px;
  width: 134px;
  opacity: 0;
  background-color: #ffffff;
  box-shadow: 0px 0px 16px 0px rgba(5, 14, 64, 0.15);
  border: solid 1px #e6e7f1;
  animation: 0.3s ease-in;
  text-align: center;
  z-index: 999;
  pointer-events: none;
}
.official-account .show:hover + .avater {
  opacity: 1;
}
.official-account .avater img {
  max-width: 100%;
}
.official-account .avater::before {
  content: "";
  display: block;
  position: absolute;
  background-color: white;
  width: 10px;
  height: 10px;
  top: 10px;
  left: -5px;
  transform: rotateZ(45deg);
}
.avater-text {
  display: inline-block;
  font-size: 14px;
  color: #018fff;
  font-weight: bold;
  line-height: 12px;
  text-align: center;
  padding: 5px 0;
  margin-bottom: 5px;
}
.avater-text:last-child {
  margin-bottom: 0;
}
.toper .links{
    margin-left:0;
}
.toper .links a {
  border-right: 1px solid rgb(106, 110, 125);
}
.c-hover-menu {
  position: fixed;
  right: 0;
  top: 50%;
  margin-top: -170px;
  z-index: 99;
}
.c-hover-item {
  background: rgba(0, 0, 0, 0.75);
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  text-align: center;
  margin: 1px 0;
  padding: 8px 5px;
  cursor: pointer;
  user-select: none;
  color:#ffffff;
}
.c-hover-icon {
  position: relative;
}
.c-hover-item:hover {
  background: rgba(0, 0, 0, 0.65);
}
.c-hover-item > div {
  line-height: 20px;
}
.c-hover-item .iconfont-template {
  font-size: 18px;
}
.c-hover-count {
  position: absolute;
  background: #fe0000;
  display: inline-block;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  width: 16px;
  height: 16px;
  line-height: 15px;
  right: 0;
  top: -3px;
}
.c-hover-item span {
  font-size: 12px;
}
</style>
