require(['/common/js/require.config.js'], function () {
  require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/technologyMarket.js', 'httpUrl', '/style/js/libs/scroll.js', '../../common/components/alert/index.js'],
    function ($, dic, Vue, httpVueLoader, indexApi, httpUrl, scroll, toast) {
      new Vue({
        el: '#index_box',
        data: {
          "techAchiList": [],//技术成果列表
          "techRequireList": [],//技术需求列表
          "techManagerList": [],//技术经理人列表
          "zMResourceStatistics": {},
        },
        components: {
          //插入头信息
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          //插入市场
          'tech_market_header': httpVueLoader('/style/components/tech_market_header.vue'),

          //插入脚信息
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          // 技术成果列表查询
          this.getTechAchiList();

          // 技术需求列表查询
          this.getTechRequireList();

          // 技术经理人
          this.getTechManagerList();
          //技术成果丶技术需求丶技术经纪人丶技术转移机构数量统计
          this.resourceStatistics();
        },
        methods: {
          Pricre: function (v) {

            if (typeof v !== 'undefined') {

              if (v >= 10000) {
                return (v / 10000).toFixed(2) + '万元';
              } else {
                return v + '元'
              }
            }

          },
          resourceStatistics: function () {
            var _this = this;
            indexApi.resourceStatistics().then(function (res) {
              console.log(res);
              if (res.code === true) {
                _this.zMResourceStatistics = res.data;
              }
            })
          },

          getImgPath(path) {
            return httpUrl.fileShowUrl + '/resource/' + path;
          },

          // 技术成果列表查询
          getTechAchiList: function () {
            var _this = this;
            var form = {
              "pageParam": {
                "current": 1,
                "order": "desc",
                "size": 4,
                "sort": "id"
              },
              "payload": {
                "certificationFlag": 2,
              }
            }
            console.log(form)
            indexApi.tech_achi_list(form).then(function (res) {
              if (res.code === true) {
                _this.techAchiList = res.data.records
                // vm.initScroll();
                console.log("技术成果列表查询：", _this.techAchiList)
              }
            })
          },
          // 技术需求列表
          getTechRequireList: function () {
            var _this = this;
            var form = {
              "pageParam": {
                "current": 1,
                "order": "desc",
                "size": 8,
                "sort": "id"
              },
              "payload": {
                "certificationFlag": 2,
              }
            }
            console.log(form)
            indexApi.tech_require_list(form).then(function (res) {
              console.log(res)
              if (!res.code) {
                vm.$dialog.showToast(res.message);
                return;
              }
              _this.techRequireList = res.data.records
              // vm.initScroll();
              console.log(_this.techRequireList)
            })
          },

          // 技术经理人列表
          getTechManagerList: function () {
            var _this = this;
            var form = {
              "pageParam": {
                "current": 1,
                "order": "desc",
                "size": 4,
                "sort": "create_time"
              },
              "payload": {
                "certificationFlag": 2,
              }
            }
            indexApi.selectPageZMTechBrokerVOTrans(form).then(function (res) {
              console.log("技术经纪人列表查询：", res)
              if (!res.code) {
                vm.$dialog.showToast(res.message);
                return;
              }
              var data = res.data;
              _this.techManagerList = data.records;
              console.log(_this.techManagerList);
              _this.allTotal = data.total;

              _this.techManagerList.forEach(el => {
                el.zMTechBrokerAdditionalList.forEach(element => {
                  if (el.zMProjectAdditional == undefined) {
                    el.zMProjectAdditional = "";
                  }
                  el.zMProjectAdditional = element.additionalService_display + ","
                });
                if (el.zMProjectAdditional.length > 0) {
                  el.zMProjectAdditional = el.zMProjectAdditional.substr(0, el.zMProjectAdditional.length - 1);
                }
              });
            })
          },
          //技术经理人学院
          handleSchool: function () {
            var userPhone = localStorage.getItem("userPhone");
            if (null == userPhone && "" == userPhone || undefined == userPhone) {
              // window.location.href = '/common/login.html';
              return window.location.href = httpUrl.baseSchoolOutUrl
            }
            var url = httpUrl.baseSchoolOutUrl ;
            var password = "YVc1NFpXUjFZVmMxTkZwWFVqRlpWbU14VGtad1dGVnFSbHBXYlUxNFZHdGFkMWRHVm5GU2JIQlhZbFV4TkZaSGRHRmtNV1JIVm01R1UxZEhhRTlaVjNOM1pERlNjMVZ0Um1oU2JHOHlWbXhTUTFkSFNraFZiRkpWVm10Vk5WVkdaRWRYUlRWVlZXMUdWMDFWYkRSWlZtTXhUa1p3V0ZWcVJUMWhWelUwV2xkU01RPT1hVzU0WldSMQ==";
            var query = "password=" + password + "&account=" + userPhone + "&ipForget=true&url=" + url;
            // window.open();
            return window.location.href = (httpUrl.baseSchoolOutUrl + "/user/ajax/login?" + query);
          },
        },
      })
    })
})
