require(['/common/js/require.config.js'], function () {
  require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/technologySchool.js', 'httpUrl', '/style/js/libs/scroll.js', '../../common/components/alert/index.js'],
    function ($, dic, Vue, httpVueLoader, indexSchoolApi, httpUrl, scroll, toast) {
      new Vue({
        el: '#index_box',

        // style\js\api\technologySchool.js
        data: {
          "allTotal": 0, //总条数
          "currentPage": 1,//当前页
          "pageSize": 8,//每页显示条数
          examList: [],

          sortActive: 0,
          sortList: [
            { id: 'DESCsortNum', name: '默认排序' },
            { id: 'NEW', name: '发布时间' },
            { id: 'FOLLOW', name: '人气' },
          ],
        },
        components: {
          //插入头信息
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          //插入市场
          'market_header': httpVueLoader('/style/components/market_header.vue'),
          'tech_school_header': httpVueLoader('/style/components/tech_school_header.vue'),

          //插入脚信息
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          this.initData();
          this.find_school_exam_list();
        },
        methods: {

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

          orderClick(id, index) {
            var _this = this;

            console.log(id, index);
            this.sortActive = index;
            // this.queryModel.pageParam.sort = id;

            var form = {
              "pageParam": {
                "current": _this.currentPage,
                "size": _this.pageSize
              },
              "payload": {
                "order": id,
                "subjectId": 0,
                "picImg": ""
              }
            }

            _this.findaPageList(form);

          },


          // 跳转详情
          turnPageNextCourse: function (item) {
            var _this = this;
            console.log(item)


            if (this.userInfo && this.userInfo.userName) {
              var firstId = item.id;
              console.log(firstId)
              var userPhone = localStorage.getItem("userPhone");
              var url = httpUrl.baseSchoolOutUrl + "/exam/examInfo/" + firstId;
              var password = "YVc1NFpXUjFZVmMxTkZwWFVqRlpWbU14VGtad1dGVnFSbHBXYlUxNFZHdGFkMWRHVm5GU2JIQlhZbFV4TkZaSGRHRmtNV1JIVm01R1UxZEhhRTlaVjNOM1pERlNjMVZ0Um1oU2JHOHlWbXhTUTFkSFNraFZiRkpWVm10Vk5WVkdaRWRYUlRWVlZXMUdWMDFWYkRSWlZtTXhUa1p3V0ZWcVJUMWhWelUwV2xkU01RPT1hVzU0WldSMQ==";
              var query = "password=" + password + "&account=" + userPhone + "&ipForget=true&url=" + url;
              window.open(httpUrl.baseSchoolOutUrl + "/user/ajax/login?" + query);
            } else {
              toast.showToast("请先登录")
              setTimeout(function () {
                window.location.href = '/common/login.html';
              }, 2000)
            }

            // var firstId = item.id;
            // console.log(firstId)
            // var userPhone = localStorage.getItem("userPhone");
            // var url = httpUrl.baseSchoolOutUrl + "/exam/examInfo/" + firstId;
            // var password = "YVc1NFpXUjFZVmMxTkZwWFVqRlpWbU14VGtad1dGVnFSbHBXYlUxNFZHdGFkMWRHVm5GU2JIQlhZbFV4TkZaSGRHRmtNV1JIVm01R1UxZEhhRTlaVjNOM1pERlNjMVZ0Um1oU2JHOHlWbXhTUTFkSFNraFZiRkpWVm10Vk5WVkdaRWRYUlRWVlZXMUdWMDFWYkRSWlZtTXhUa1p3V0ZWcVJUMWhWelUwV2xkU01RPT1hVzU0WldSMQ==";
            // var query = "password=" + password + "&account=" + userPhone + "&ipForget=true&url=" + url;
            // window.open(httpUrl.baseSchoolOutUrl + "/user/ajax/login?" + query);
          },


          getImgOutPath(path) {
            return httpUrl.baseSchoolOutUrl + path;
          },


          changePage: function (params) {
            var _this = this;

            console.log(params)
            var form = {
              "pageParam": {
                "current": params,
                "size": _this.pageSize
              },
              "payload": {
                "order": "DESCsortNum",
                "subjectId": 0,
                "picImg": ""
              }
            }

            _this.findaPageList(form);
          },


          find_school_exam_list: function () {
            var _this = this;

            var form = {
              "pageParam": {
                "current": _this.currentPage,
                "size": _this.pageSize
              },
              "payload": {
                "order": "DESCsortNum",
                "subjectId": 0,
                "picImg": ""
              }
            }
            _this.findaPageList(form);

          },

          findaPageList: function (params) {
            var _this = this;
            indexSchoolApi.tech_school_exam_list(params).then(function (res) {
              if (!res.code) {
                _this.$dialog.showToast(res.message);
                return;
              }
              _this.examList = res.data.records
              _this.allTotal = res.data.total
              console.log(_this.examList);
            })

          },

        },
      })
    })
})
