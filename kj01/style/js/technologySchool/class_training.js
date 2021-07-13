require(['/common/js/require.config.js'], function () {
    require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/technologySchool.js', 'httpUrl', '/style/js/libs/scroll.js', '../../common/components/alert/index.js'],
        function ($, dic, Vue, httpVueLoader, indexSchoolApi, httpUrl, scroll, toast) {
            new Vue({
                el: '#index_box',

                // style\js\api\technologySchool.js
                data: {
                    "total": 0, //总条数
                    'current': 1,//当前页
                    'size': 8,//每页显示条数

                    sortActive: 0,
                    sortList: [
                        { id: 'DESCsequence', name: '默认排序' },
                        { id: 'NEW', name: '发布时间' },
                        { id: 'FOLLOW', name: '人气' },
                    ],
                    classList: [],
                    courseList: [],
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

                    this.find_school_class_list();
                    this.find_school_course_list();
                },
                methods: {


                    turnPageNext: function (item) {
                        var id = item.courseId
                        console.log(item)
                        window.location = "/technologySchool/class_training_details.html?id=" + id
                    },


                    orderClick(id, index) {
                        var _this = this;

                        console.log(id, index);
                        this.sortActive = index;
                        // this.queryModel.pageParam.sort = id;

                        var form = {
                            "pageParam": {
                                "current": _this.current,
                                "size": _this.size
                            },
                            "payload": {
                                "order": id,
                                "subjectId": 326,
                                "picImg": ""
                            }
                        }

                        _this.findaPageList(form);

                    },

                    // 
                    find_school_class_list: function () {
                        var _this = this;
                        // 参数：subjectId：0，"current": 1,"order": "NEW","size": 9，mobile：用户手机号码
                        var form = {
                            "pageParam": {
                                "current": _this.current,
                                "size": _this.size,
                            },
                            "payload": {
                                "order": "DESCsequence",
                                "subjectId": 326
                            }
                        }

                        _this.findaPageList(form);
                    },


                    changePage: function (params) {
                        var _this = this;

                        console.log(params)
                        var form = {
                            "pageParam": {
                                "current": params,
                                "size": _this.size,
                            },
                            "payload": {
                                "order": "DESCsequence",
                                "subjectId": 326
                            }
                        }

                        _this.findaPageList(form);
                    },



                    findaPageList: function (form) {
                        var _this = this;

                        indexSchoolApi.tech_school_class_list(form).then(function (res) {
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            console.log(res)
                            _this.classList = res.data.records;
                            _this.total = res.data.total
                        })
                    },

                    getImgOutPath(path) {
                        return httpUrl.baseSchoolOutUrl + path;
                    },


                    find_school_course_list: function () {
                        var _this = this;
                        // 参数：subjectId：0，"current": 1,"order": "NEW","size": 9，mobile：用户手机号码
                        // var userPhone = localStorage.getItem("userPhone")
                        // if (null == userPhone && "" == userPhone || undefined == userPhone) {
                        //     window.location.href = '/common/login.html';
                        // }
                        var form = {
                            "pageParam": {
                                "current": _this.currentPage_1,
                                "size": _this.pageSize_1
                            },
                            "payload": {
                                "order": "DESCsequence",
                                "subjectId": 0
                            }
                        }
                        console.log(form)

                        indexSchoolApi.tech_school_course_list(form).then(function (res) {
                            _this.courseList = res.data.records
                            console.log(_this.courseList)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                        })

                    }
                },
            })
        })
})
