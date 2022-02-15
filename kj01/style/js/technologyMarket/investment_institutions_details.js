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
          'detail': {},
          'id': '',
          'favoriteFlag': 0,//未收藏

          "evaluationScore": null,
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
          var aUrl=window.location.href
          var str = aUrl.split("/").pop().replace(/(^content)|(\.\S+$)/g,"");
          // 技术成果列表查询
          this.initData();
          if(this.id==null){
            this.queryDetails(str);
            this.findqueryAverageScore(str);
          }
          if(this.id!=null){
            this.queryDetails(this.id);
            this.findqueryAverageScore(this.id);//查询平均分
          }
          this.initFavorite();
          this.findPageQueryEvaluation();//查询评价
        },
        methods: {

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
              "evaluationType": 3, //评价类型 1	评价技术经纪人  2	评价技术转移机构 3	评价投资机构
              "evaluationScore": _this.evaluationScore, // 评价分数
              "evaluationDes": _this.evaluationDes, //描述
            }

            indexApi.createEvaluation(form).then(function (res) {
              console.log(res);
              if (!res.code) {
                toast.showToast("评价失败!");
                return;
              }
              toast.showToast("评价成功!");
              _this.evaluation_pop_show = false;
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
            var id = this.$utils.getReqStr('id');
            var aUrl=window.location.href
            var str = aUrl.split("/").pop().replace(/(^investmentStatic)|(\.\S+$)/g,"");
            if(id!=null){
              this.id = id;
            }
            if(id==null){
              this.id = str;
            }
            this.$utils.getCookie(dic.locaKey.USER_INFO) &&
              (this.userInfo = JSON.parse(
                localStorage.getItem(dic.locaKey.USER_INFO)));
          },

          linkProject: function () {
            var _this = this;
            if (this.userInfo && this.userInfo.userName) {
              window.location.href = '/technologyMarket/investment_institutions_projects.html?id=' +
                _this.id;
            } else {
              window.location.href = '/common/login.html';
            }
          },

          //初始化收藏按钮
          initFavorite: function () {
            var _this = this;
            if (this.userInfo && this.userInfo.userName) {
              var form =
              {
                'businessId': _this.id,
                'delFlag': 0,
                'favoriteType': 3,
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
                'favoriteType': 3,
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

          // 技术成果列表查询
          queryDetails: function (id) {
            let _this = this;
            indexApi.queryInvestmentDetails(id).then(function (res) {
              console.log('查询投资机构详情', res);
              if (!res.code) {
                toast.showToast(res.message);
                return;
              }
              var textNameList = [];
              if (_this.$utils.validatesEmpty(res.data.industryType) && res.data.industryType.length > 0) {
                res.data.industryType.forEach(element => {
                  textNameList.push(element.name);
                });
              }
              res.data.industryType = textNameList.toString();

              _this.detail = res.data;


            });
          },

        },
      });
    });
});
