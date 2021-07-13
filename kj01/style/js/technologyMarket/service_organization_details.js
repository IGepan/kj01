require(['/common/js/require.config.js'], function () {
  require([
    'jquery',
    'dic',
    'vue',
    'httpVueLoader',
    '/style/js/api/technologyMarket.js',
    'httpUrl',
    '/style/js/libs/scroll.js', '../../common/components/alert/index.js'],
    function ($, dic, Vue, httpVueLoader, indexApi, httpUrl, scroll, toast) {
      new Vue({
        el: '#index_box',
        data: {
          detail: {},
          techBrokerList: [],
          'total': 0, //总条数
          id: null,
          queryModel: {
            'pageParam': {
              'current': 1,
              'size': 8,
              'order': 'desc',
              'sort': 'id',
            },
            'payload': {
              industryType: null,
              agentType: null,
              honorLevel: null,
              creditLevel: null,
              capabilityLevel: null,
            },
          },
          favoriteFlag: 0,


          "value2": null,
          "colors": ['#99A9BF', '#F7BA2A', '#FF9900'], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
          "values": 3.2,
          "valuess": 4,
          "evaluation_pop_show": false,
          tabs: [
            {
              label: '机构介绍',
              selected: true
            },
            {
              label: '用户评价',
              selected: false
            }
          ],
          infos: {
            comment0: "0xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
            comment1: "1xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf"
          },

          "evaluationScore": '',
          "evaluationDes": '',
          "evaluationList": [],
          "averageValue": "",

        },
        components: {
          //插入头信息
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          //插入市场
          'tech_market_header': httpVueLoader(
            '/style/components/tech_market_header.vue'),

          //插入脚信息
          'web-footer': httpVueLoader('/style/components/web_footer.vue'),
        },

        watch: {
          // navIndex: function (v) {
          //     console.log(this.navIndex)
          // },
        },
        created: function () {
          // 技术成果列表查询
          this.initData();
          this.queryDetails();
          this.queryTechBrokerList();
          this.initFavorite();

          this.findPageQueryEvaluation();
          this.findqueryAverageScore(this.id);//查询平均分
        },
        methods: {

          // 查询平均分
          findqueryAverageScore: function (id) {
            var _this = this;

            indexApi.queryAverageScore(id).then(function (res) {
              console.log(res);
              if (!res.code) {
                toast.showToast(res.message);
                return;
              }
              _this.averageValue = res.data;
              console.log(_this.averageValue)
            });
          },

          // 点击评价
          evaluateEvent: function () {
            var _this = this;
            if (this.userInfo && this.userInfo.userName) {
              _this.evaluation_pop_show = true;
            } else {
              toast.showToast("请先登录")
              setTimeout(function () {
                window.location.href = '/common/login.html';
              }, 2000)
            }
          },

          // 评价
          keep_evaluation_pop: function () {

            var _this = this;


            if (_this.evaluationScore < 1 || !_this.$utils.validatesEmpty(_this.evaluationScore)) {
              // alert("请选择评分")
              toast.showToast("请选择评分");
              return;
            }
            if (!_this.$utils.validatesEmpty(_this.evaluationDes)) {
              // alert("评价为空")
              toast.showToast("评价为空");
              return;
            }

            var form = {
              "businessId": _this.id, // 业务Id
              "evaluationType": 2, //评价类型 1	评价技术经纪人  2	评价技术转移机构 3	评价投资机构
              "evaluationScore": _this.evaluationScore, // 评价分数
              "evaluationDes": _this.evaluationDes, //描述
            }


            indexApi.createEvaluation(form).then(function (res) {
              console.log(res);
              if (!res.code) {
                toast.showToast(res.message);
                return;
              }
              // alert("评价成功！")
              toast.showToast("评价成功！")
              _this.evaluation_pop_show = false;
            });
          },

          // 查询评价
          findPageQueryEvaluation: function () {
            var _this = this;
            var form = {
              "pageParam": {
                "current": 1,
                "order": "desc",
                "size": 10,
                "sort": "id"
              },
              "payload": _this.id
            };

            indexApi.pageQueryEvaluation(form).then(function (res) {
              console.log(res);
              if (!res.code) {
                toast.showToast(res.message);
                return;
              }
              _this.evaluationList = res.data.records;
            });

          },

          selecedTab: function (i) {
            this.tabs.forEach(function (tab, ti) {
              tab.selected = ti === i
            })
          },

          getImgPath(path) {
            return httpUrl.fileShowUrl + '/resource/' + path;
          },
          initData: function () {
            let d = new Date();
            let dy = d.getFullYear();
            let dm = d.getMonth();
            let dd = d.getDate();
            this.saasId = localStorage.getItem('saasId');
            this.id = this.$utils.getReqStr('id');
            this.$utils.getCookie(dic.locaKey.USER_INFO) &&
              (this.userInfo = JSON.parse(
                localStorage.getItem(dic.locaKey.USER_INFO)));
          },

          //初始化收藏按钮
          initFavorite: function () {
            var _this = this;
            if (this.userInfo && this.userInfo.userName) {
              var form =
              {
                'businessId': _this.id,
                'delFlag': 0,
                'favoriteType': 5,
              };

              indexApi.findZMFavoriteExistsByVO(form).then(function (res) {
                console.log(res);
                if (!res.code) {
                  toast.showToast(res.message);
                  return;
                }
                //  "favoriteFlag":0,//未收藏
                _this.favoriteFlag = res.data ? 1 : 0;
              });
            }

          },
          //收藏
          addFavorite: function () {
            var _this = this;
            if (this.userInfo && this.userInfo.userName) {
              var form =
              {
                'businessId': _this.id,
                'favoriteType': 5,
                'delFlag': _this.favoriteFlag,
              };

              indexApi.editZMFavorite(form).then(function (res) {
                console.log(res);
                if (!res.code) {
                  toast.showToast(res.message);
                  return;
                }
                //  "favoriteFlag":0,//未收藏
                _this.favoriteFlag = _this.favoriteFlag == 0 ? 1 : 0;
              });
            } else {
              window.location.href = '/common/login.html';
            }
          },
          queryDetails() {
            let _this = this;
            indexApi.queryTechOrganDetail(this.id).then(res => {
              if (!res.code) {
                vm.$dialog.showToast(res.message);
                return;
              }
              this.detail = res.data;
              console.log('查询服务机构详情', res.data);
            });
          },

          queryTechBrokerList() {
            let _this = this;
            this.queryModel.payload.organId = this.id;
            indexApi.selectPageZMTechBrokerVOTrans(this.queryModel).
              then(function (res) {
                if (!res.code) {
                  vm.$dialog.showToast(res.message);
                  return;
                }
                let data = res.data;
                _this.techBrokerList = data.records;
                _this.techBrokerList.forEach(el => {
                  el.zMTechBrokerAdditionalList.forEach(element => {
                    if (el.zMProjectAdditional == undefined) {
                      el.zMProjectAdditional = '';
                    }
                    el.zMProjectAdditional = element.additionalService_display +
                      ',';
                  });
                  if (el.zMProjectAdditional.length > 0) {
                    el.zMProjectAdditional = el.zMProjectAdditional.substr(
                      0,
                      el.zMProjectAdditional.length - 1);
                  }
                });
                _this.total = data.total;
              });
          },

        },
      });
    });
});
