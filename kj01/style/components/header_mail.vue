<template>
  <header id="page-header">
    <div class="container">
      <div class="row align-items-center justify-content-between">
        <div class="col">
          <a class="logo" href="/"><img class="img-fluid" src="images/logo-1.png" alt=""></a>
        </div>
        <div class="col-5" style="margin-top: 30px">
          <div class="input-group search-top">
            <el-select v-model="type">
              <el-option class="el-same"
                         v-for="item in mailServiceTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
            <input type="text" v-model="title" class="form-control" aria-label="" placeholder="请输入关键字">
            <button class="btn btn-link btn-search" @click="handelSearch()"><i class="iconfont icon-search"></i>
            </button>
          </div>
          <div class="hot-box">
            <span>热门搜索：</span>
            <a>专利</a>
            <a>商标</a>
            <a>专项项目</a>
          </div>
        </div>

        <div class="col-3">
          <div class="shopping-cart fl" @click="goCart">
            <i class="iconfont icon-cart"></i>
            购物车
          </div>
          <div>
            <div class="shop-box fr" v-if="isSeller==false" @click="fwsClick">
              我要开店
            </div>
            <div class="shop-box fr" v-else style="display: none"></div>
          </div>

        </div>

      </div>
    </div>
  </header>
</template>

<script>
module.exports = {
  props: ["hidenuser", "topClass", "codeUrl", "codeTitle"],
  data: function () {
    return {
      toper: "header_mail", //组件引用判断
      title: '',
      type: '',
      mailServiceTypeList: [],
      mailSite: {},
      eActive: false,
      userInfo: {},
      isSeller: false,
      isShow: false,
      logined: false,
      urlType: false,
      urlIsType: false,
      urlIsCheckSeller: false,
      urlIsCheckBuyer: false,
      menuInfo: {
        cartCount: 0,
        messageCount: 0
      }
    };
  },
  created: function () {
    this.title = this.$utils.getReqStr('title') || '';
    // this.type = this.$utils.getReqStr('type')||'';
    this.getType()
    this.mailSiteDetail()
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
      "/activity/",
      "/activityTopic/",
      "/common/servicetrade/",
      "/demand"
    ].some(function (text) {
      return (
          pathname.indexOf(text) !== -1 &&
          pathname.indexOf("demanddetail") === -1 &&
          pathname.indexOf("demand_list") === -1
      );
    });
    this.urlIsCheckSeller = ["/common/seller/"].some(function (text) {
      return (
          pathname.indexOf(text) !== -1 &&
          pathname.indexOf("demanddetail") === -1 &&
          pathname.indexOf("demand_list") === -1
      );
    });
    this.urlIsCheckBuyer = [
      "/common/usercenter",
      "/common/buyer",
      "/activity/",
      "/activityTopic/",
      "/common/servicetrade/",
      "/demand"
    ].some(function (text) {
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
            console.log(2);
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
    msgChlick: function () {
      if (!this.userInfo.userId) {
        window.location.href = "/common/login.html";
        return;
      } else {
        window.location.href = "/common/usercenter/user_message.html";
      }
    },
    isHomePage: function (e) {
      if (location.pathname === "/" || location.pathname === "/index.html") {
        e.preventDefault();
      }
    },
    getWebInfo: function () {
      var vm = this;
      this.$httpCom.webCommonUser().then(function (res) {
        if (res.code === "rest.success") {
          vm.userInfo = res.result;
          if (vm.urlIsType && !vm.userInfo.userId) {
            console.log("没有登录");
            window.location.href = "/common/login.html";
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
    clearUnreadMsg: function () {
      this.menuInfo.messageCount = 0;
    },
    //获取未读消息数量
    getUnreadMsgCount: function () {
      var $this = this;
      this.$http
          .get(httpUrl.baseUrl + "/im/getUnreadMsgCount")
          .then(function (res) {
            $this.menuInfo.messageCount = res.result;
          });
    },
    updateCartInfo: function () {
      //获取消息，购物车的消息通知数字
      var $this = this;
      this.$http.get(httpUrl.baseUrl + "/shopcar/total").then(function (res) {
        var count = parseInt(res.result);
        //最大显示99
        if (count > 99) {
          count = 99;
        }
        $this.menuInfo.cartCount = count;
      });
    },
    action: function (type) {
      if (!this.userInfo.userId) {
        window.location.href = "/common/login.html";
      } else {

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
      }
    },
    initSeller: function () {
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
    login: function () {
      window.location.href = "/common/login.html";
    },
    msgChlick: function () {
      if (!this.userInfo.userId) {
        window.location.href = "/common/login.html";
        return;
      } else {
        window.location.href = "/common/usercenter/user_message.html";
      }
    },
    getProtocol: function (type) {
      var vm = this;
      var protocolType = vm.protocol[type].protocolType;
      vm.$httpCom
          .protocol({
            protocolType: protocolType
          })
          .then(function (res) {
            if (res.result) {
              vm.protocol[type].content = res.result.protocolContact;
              vm.openProtocolConfirm(type);
            }
          });
    },
    openProtocolConfirm: function (type) {
      var vm = this;
      var protocol = vm.protocol[type];
      var options = {
        class: "full",
        title: protocol.title,
        texts: protocol.content,
        buttons: [
          {
            label: "确认阅读",
            fun: function () {
              jQuery("#protocol")[0].checked = true;
              return 1;
            }
          }
        ]
      };
      vm.$dialog.confirm2(options);
    },
    openSellerConfirm: function () {
      var vm = this;
      var options = {
        title: "温馨提示",
        texts:
            '<p style="padding: 0 20px;">你没有该站点卖家身份，请开通卖家身份?<p>',
        width: "500px",
        buttons: [
          {
            label: "放弃",
            fun: function () {
              location.href = "/index.html";
              return 1;
            }
          },
          {
            label: "现在就去",
            fun: function () {
              location.href = "/common/seller/store_agreement.html";
              return 1;
            }
          }
        ]
      };
      this.$dialog.confirm2(options);
    },
    openBuyerConfirm: function () {
      var vm = this;
      var options = {
        title: "买家身份确认",
        texts:
            '<p style="padding: 0 20px;">你没有该站点买家身份，如继续操作，则需同意成为该站点买家?<p><div style="text-align: center;padding-bottom: 20px;"><label for="protocol"><input id="protocol" type="checkbox"><span>我已阅读并同意<a id="protocolView"> <span style="color: blue">《注册协议》</span> <span style="color: blue">《隐私保护协议》</span></a></span></label></div>',
        width: "500px",
        buttons: [
          {
            label: "取消",
            fun: function () {
              location.href = "/index.html";
              return 1;
            }
          },
          {
            label: "同意",
            fun: function () {
              if ($("#protocol").is(":checked")) {
                vm.$httpCom
                    .becomeBuyer({protocolReadFlag: 1})
                    .then(function (res) {
                      if (res.code === "rest.success") {
                        // 延迟请求 避免数据库写入延迟导致的数据无法查询
                        setTimeout(function () {
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
        closeCallback: function () {
          location.href = "/index.html";
          return 1;
        }
      };
      this.$dialog.confirm2(options);
      jQuery("#protocolView").on("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var type = e.target.innerText === "《注册协议》" ? 0 : 1;
        vm.protocol[type].content
            ? vm.openProtocolConfirm(type)
            : vm.getProtocol(type);
      });
    },
    yhzxClick: function () {
      if (!this.userInfo.userId) {
        window.location.href = "/common/login.html";
        return;
      } else if (
          this.userInfo.userTypes &&
          this.userInfo.userTypes.indexOf("001") !== -1
      ) {
        window.location.href = "/common/buyer/index.html";
      } else {
        this.urlType = "/common/buyer/index.html";
        this.openBuyerConfirm();
      }
    },
    fwsClick: function () {
      if (!this.userInfo.userId) {
        window.location.href = "/common/login.html";
        return;
      }
      if (this.isSeller) {
        window.location.href = "/common/seller/index.html";
      } else {
        window.location.href = "/common/seller/store_agreement.html";
      }
    },
    exitClick: function () {
      this.$utils.delCookie("USER_INFO");
      this.$utils.delCookie("LOGIN_INFO");
      localStorage.removeItem("USER_INFO");
      localStorage.removeItem("saasId");
      window.location.href = "/common/login.html";
    },
    accessSave: function () {
      var data = {};
      if (this.userInfo && this.userInfo.userId) {
        data["userId"] = this.userInfo.userId;
        data["userName"] = this.userInfo.userName;
      }
      this.$httpCom.accessSave(data);
    }
    , mouseOver() {
      //改变样式
      this.active = 'display:block';
    },
    mouseLeave() {
      //清空样式
      this.active = 'display:none';
    },
    handelSearch: function () {
      var vm = this;
      location.href = '/mall/sub1.html?title=' + vm.title + '&type=' + vm.type
      // if(this.props.value==this.searchForm.type.name){
      //   this.eActive=index
      // }


    },
    fwsClick: function () {
      if (!this.userInfo.userId) {
        window.location.href = "/common/login.html";
        return;
      }
      if (this.isSeller) {
        window.location.href = "/common/seller/index.html";
      } else {
        window.location.href = "/common/seller/store_agreement.html";
      }
    },
    getMailSiteDetail: function () {
      var vm = this
      vm.$httpCom.mailSiteDetail().then(function (res) {
        if (res.code === 'rest.success') {
          vm.mailSite = res.result
        }
      })
    },
    goCart: function () {
      location.href = '/common/servicetrade/shopping_cart.html'
    },
    getType: function () {
      var vm = this;
      this.$httpCom.mailServiceType().then(function (res) {
        if (res.code === 'rest.success') {
          vm.mailServiceTypeList = res.result
        }
      })
    },
    mailSiteDetail: function () {
      var vm = this;
      this.$httpCom.mailSiteDetail().then(function (res) {
        if (res.code === 'rest.success') {
          vm.mailSite = res.result
        }
      })
    }
  }
};
</script>
