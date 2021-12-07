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
          'zMDemandAdditionalList': [],
          'zMDemandKeywordsList': [],
          'detail': {},
          'id': '',
          'favoriteFlag': 0,//未收藏
          tabs: [
            {
              label: '技术描述',
              selected: true,
            },
            {
              label: '技术指标',
              selected: false,
            },
            {
              label: '其他描述',
              selected: false,
            },
          ],
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
          this.initData();
          // 技术成果列表查询
          this.queryDetails();
          this.initFavorite();
        },
        methods: {
          initData: function () {
            let d = new Date();
            let dy = d.getFullYear();
            let dm = d.getMonth();
            let dd = d.getDate();
            this.saasId = localStorage.getItem('saasId');
            var id = this.$utils.getReqStr('id');
            var aUrl=window.location.href
            var str = aUrl.split("/").pop().replace(/(^requireStatic)|(\.\S+$)/g,"");
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
          Pricre: function (v) {

            if (typeof v !== 'undefined') {

              if (v >= 10000) {
                return (v / 10000).toFixed(2) + '万元';
              } else {
                return v + '元'
              }
            }

          },
          sendProject: function () {
            var vm = this;
            if (this.userInfo && this.userInfo.userName) {
              window.location.href = '/technologyMarket/technical_requirements.html?id=' +
                vm.id;
            } else {
              window.location.href = '/common/login.html';
            }
          },
          selecedTab: function (i) {
            this.tabs.forEach(function (tab, ti) {
              tab.selected = ti === i;
            });
          },
          queryDetails: function () {
            var _this = this;
            var form = {
              'id': this.id,
            };
            indexApi.queryDetails(form).then(function (res) {
              console.log(res);
              if (!res.code) {
                vm.$dialog.showToast(res.message);
                return;
              }
              _this.detail = res.data;
              _this.allTotal = data.total;
              _this.detail.zMProjectAdditional = '';
              _this.detail.zMDemandAdditionalList.forEach(element => {
                _this.detail.zMProjectAdditional += element.additionalService +
                  ',';
              });

            });
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
                  this.$dialog.showToast(res.message);
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
                  this.$dialog.showToast(res.message);
                  return;
                }
                //  "favoriteFlag":0,//未收藏
                _this.favoriteFlag = _this.favoriteFlag == 0 ? 1 : 0;
              });
            } else {
              window.location.href = '/common/login.html';
            }
          },

        },
      });
    });
});
