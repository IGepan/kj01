require(['/common/js/require.config.js'], function () {
    require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/technologySchool.js', 'httpUrl', '/style/js/libs/scroll.js', '../../common/components/alert/index.js'],
        function ($, dic, Vue, httpVueLoader, indexSchoolApi, httpUrl, scroll, toast) {
            new Vue({
                el: '#index_box',
                data: {
                    "techAchiList": [],//技术成果列表
                    "LearningContentList": [],
                    "allTotal": 0, //总条数
                    "currentPage": 1,//当前页
                    "pageSize": 8,//每页显示条数

                    // 筛选
                    "id": "",//经纪人id
                    "ZMTechBrokerVO": {},
                    "joinClass": false,
                    "baomingData": {},

                },
                components: {
                    //插入头信息
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    //插入市场
                    // 'market_header': httpVueLoader('/style/components/market_header.vue'),
                    'tech_school_header': httpVueLoader('/style/components/tech_school_header.vue'),

                    //插入脚信息
                    'web-footer': httpVueLoader('/style/components/web_footer.vue')
                },

                watch: {
                    // navIndex: function (v) {
                    //     console.log(this.navIndex)
                    // },
                },
                created: function () {
                    var id = this.$utils.getReqStr('id')
                    this.initData();
                    this.getTechAchiList(id);
                    this.getTechLearningContent(id);

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
                    getImgOutPath(path) {
                        return httpUrl.baseSchoolOutUrl + path;
                    },

                    handleOpen(key, keyPath) {
                        console.log(key, keyPath);
                    },
                    handleClose(key, keyPath) {
                        console.log(key, keyPath);
                    },


                    unfinishedCourseRegistration: function (id) {
                        var _this = this;
                        indexSchoolApi.unfinishedCourseRegistration(id).then(function (res) {
                            console.log('bao ming uuju', res.data)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            _this.baomingData = res.data
                            if (null == res.data) {
                                _this.joinClass = false;
                            } else {
                                _this.joinClass = true;
                            }

                        })
                    },

                    // 跳转学习视频
                    selectedHandleTable(key, keyPath) {
                        var _this = this;
                        console.log(keyPath[1].split(","));
                        var data = keyPath[1].split(",")

                        if (this.userInfo && this.userInfo.userName) {
                            var userPhone = localStorage.getItem("userPhone");
                            var url = httpUrl.baseSchoolOutUrl + "/uc/play/" + data[0] + "/" + data[1];
                            var password = "YVc1NFpXUjFZVmMxTkZwWFVqRlpWbU14VGtad1dGVnFSbHBXYlUxNFZHdGFkMWRHVm5GU2JIQlhZbFV4TkZaSGRHRmtNV1JIVm01R1UxZEhhRTlaVjNOM1pERlNjMVZ0Um1oU2JHOHlWbXhTUTFkSFNraFZiRkpWVm10Vk5WVkdaRWRYUlRWVlZXMUdWMDFWYkRSWlZtTXhUa1p3V0ZWcVJUMWhWelUwV2xkU01RPT1hVzU0WldSMQ==";
                            var query = "password=" + password + "&account=" + userPhone + "&ipForget=true&url=" + url;
                            window.open(httpUrl.baseSchoolOutUrl + "/user/ajax/login?" + query);
                            // indexSchoolApi.turn_page_class_sign_1();
                        } else {
                            toast.showToast("请先登录")
                            setTimeout(function () {
                                window.location.href = '/common/login.html';
                            }, 2000)
                        }


                        // var userPhone = localStorage.getItem("userPhone");


                        // var url = httpUrl.baseSchoolOutUrl + "/uc/play/" + data[0] + "/" + data[1];
                        // var password = "YVc1NFpXUjFZVmMxTkZwWFVqRlpWbU14VGtad1dGVnFSbHBXYlUxNFZHdGFkMWRHVm5GU2JIQlhZbFV4TkZaSGRHRmtNV1JIVm01R1UxZEhhRTlaVjNOM1pERlNjMVZ0Um1oU2JHOHlWbXhTUTFkSFNraFZiRkpWVm10Vk5WVkdaRWRYUlRWVlZXMUdWMDFWYkRSWlZtTXhUa1p3V0ZWcVJUMWhWelUwV2xkU01RPT1hVzU0WldSMQ==";
                        // var query = "password=" + password + "&account=" + userPhone + "&ipForget=true&url=" + url;
                        // window.open(httpUrl.baseSchoolOutUrl + "/user/ajax/login?" + query);
                        // indexSchoolApi.turn_page_class_sign_1();
                        // window.open(url);
                    },


                    // 学习内容 
                    getTechLearningContent: function (id) {
                        var _this = this;
                        var form = {
                            "courseId": id
                        }
                        indexSchoolApi.class_learing_content(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            _this.LearningContentList = datalist;
                        })
                    },

                    // 加入学习
                    class_training_join_act: function (id) {
                        var _this = this;

                        if (this.userInfo && this.userInfo.userName) {
                            var userPhone = localStorage.getItem("userPhone");
                            var form = {
                                "businessId": id,
                                "mobile": userPhone,
                                "businessTitle": _this.ZMTechBrokerVO.courseName,
                            }

                            indexSchoolApi.insertZMVerifyClass(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    _this.$dialog.showToast(res.message);
                                    return;
                                }
                                _this.joinClass = true;
                                _this.baomingData = { certificationFlag: 1 }
                                toast.showToast("报名成功！");
                            })
                        } else {
                            toast.showToast("请先登录")
                            setTimeout(function () {
                                window.location.href = '/common/login.html';
                            }, 2000)
                        }



                        // var userPhone = localStorage.getItem("userPhone");
                        // if (null == userPhone && "" == userPhone || undefined == userPhone) {
                        //     window.location.href = '/common/login.html';
                        // }
                        // var form = {
                        //     "businessId": id,
                        //     "mobile": userPhone,
                        //     "businessTitle": _this.ZMTechBrokerVO.courseName,
                        // }

                        // indexSchoolApi.insertZMVerifyClass(form).then(function (res) {
                        //     console.log(res)
                        //     if (!res.code) {
                        //         _this.$dialog.showToast(res.message);
                        //         return;
                        //     }
                        //     _this.joinClass = true;
                        //     _this.baomingData = { certificationFlag: 1 }
                        //     setTimeout(function () {
                        //         alert("报名成功！");
                        //     }, 2000)
                        // })

                    },

                    // 页面数据
                    getTechAchiList: function (id) {
                        var _this = this;
                        var form = {
                            "webClassId": id,
                        }

                        indexSchoolApi.class_training_details_list(form).then(function (res) {
                            console.log(res.data)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            _this.ZMTechBrokerVO = res.data;
                            console.log(_this.ZMTechBrokerVO);
                            _this.unfinishedCourseRegistration(res.data.courseId);
                        })
                    },

                },
            })
        })
})
