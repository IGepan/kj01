require(['/common/js/require.config.js'], function () {
  require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/technologySchool.js', 'httpUrl', '/style/js/libs/scroll.js', '../../common/components/alert/index.js'],
    function ($, dic, Vue, httpVueLoader, indexSchoolApi, httpUrl, scroll, toast) {
      new Vue({
        el: '#index_box',

        // style\js\api\technologySchool.js
        data: {
          "allTotal": 0, //总条数
          "currentPage": 1,//当前页
          "pageSize": 4,//每页显示条数
          "currentPage_1": 1,//每页显示条数
          "pageSize_1": 8,//每页显示条数
          classList: [],
          courseList: [],
        },
        components: {
          //插入头信息
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          //插入市场
          'market_header': httpVueLoader('/style/components/market_header.vue'),
          'tech_school_header': httpVueLoader('/style/components/tech_school_header.vue'),
          'tech_market_header': httpVueLoader('/style/components/tech_market_header.vue'),
          //插入脚信息
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          this.initData();
          this.find_school_class_list();
          this.find_school_course_list();
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

          // 跳转详情
          turnPageNext: function (item) {
            var id = item.courseId
            console.log(item)
            window.location.href = "/technologySchool/class_training_details.html?id=" + id
          },


          // 跳转详情
          turnPageNextCourse: function (item) {
            var _this = this;

            if (this.userInfo && this.userInfo.userName) {
              var firstId = item.courseId;
              console.log(firstId)
              var userPhone = localStorage.getItem("userPhone");

              var url = httpUrl.baseSchoolOutUrl + "/front/couinfo/" + firstId;
              var password = "YVc1NFpXUjFZVmMxTkZwWFVqRlpWbU14VGtad1dGVnFSbHBXYlUxNFZHdGFkMWRHVm5GU2JIQlhZbFV4TkZaSGRHRmtNV1JIVm01R1UxZEhhRTlaVjNOM1pERlNjMVZ0Um1oU2JHOHlWbXhTUTFkSFNraFZiRkpWVm10Vk5WVkdaRWRYUlRWVlZXMUdWMDFWYkRSWlZtTXhUa1p3V0ZWcVJUMWhWelUwV2xkU01RPT1hVzU0WldSMQ==";
              var query = "password=" + password + "&account=" + userPhone + "&ipForget=true&url=" + url;
              window.open(httpUrl.baseSchoolOutUrl + "/user/ajax/login?" + query);
            } else {
              toast.showToast("请先登录")
              setTimeout(function () {
                window.location.href = '/common/login.html';
              }, 2000)
            }


            // console.log(item)

            // if (null == userPhone && "" == userPhone || undefined == userPhone) {
            //   window.location.href = '/common/login.html';
            // }
            // var firstId = item.courseId;
            // console.log(firstId)
            // var userPhone = localStorage.getItem("userPhone");

            // var url = httpUrl.baseSchoolOutUrl + "/front/couinfo/" + firstId;
            // var password = "YVc1NFpXUjFZVmMxTkZwWFVqRlpWbU14VGtad1dGVnFSbHBXYlUxNFZHdGFkMWRHVm5GU2JIQlhZbFV4TkZaSGRHRmtNV1JIVm01R1UxZEhhRTlaVjNOM1pERlNjMVZ0Um1oU2JHOHlWbXhTUTFkSFNraFZiRkpWVm10Vk5WVkdaRWRYUlRWVlZXMUdWMDFWYkRSWlZtTXhUa1p3V0ZWcVJUMWhWelUwV2xkU01RPT1hVzU0WldSMQ==";
            // var query = "password=" + password + "&account=" + userPhone + "&ipForget=true&url=" + url;
            // window.open(httpUrl.baseSchoolOutUrl + "/user/ajax/login?" + query);
          },

          handleAuthentication: function () {
            if (this.userInfo && this.userInfo.userName) {
              window.location.href='/common/usercenter/user_market_auth_form.html'
            }else {
                window.location.href = '/common/login.html';
            }
         },

          // 
          find_school_class_list: function () {
            var _this = this;
            var form = {
              "pageParam": {
                "current": _this.currentPage,
                "size": _this.pageSize
              },
              "payload": {
                "order": "NEW",
                "subjectId": 326
              }
            }

            console.log(form)
            indexSchoolApi.tech_school_class_list(form).then(function (res) {
              if (!res.code) {
                _this.$dialog.showToast(res.message);
                return;
              }
              console.log(res.data.records)

              _this.classList = res.data.records;
            })
          },

          getImgOutPath(path) {
            return httpUrl.baseSchoolOutUrl + path;
          },
          find_school_course_list: function () {
            var _this = this;
            var form = {
              "pageParam": {
                "current": _this.currentPage_1,
                "size": _this.pageSize_1
              },
              "payload": {
                "order": "NEW",
                "subjectId": 0
              }
            }
            indexSchoolApi.tech_school_course_list(form).then(function (res) {

              if (!res.code) {
                _this.$dialog.showToast(res.message);
                return;
              }
              _this.courseList = res.data.records
              console.log(_this.courseList)
            })

          }
        },
      })
    })
})
