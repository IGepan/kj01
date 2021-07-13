// JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom', './userCenterApi/userCenterMarketTechAPI.js'],
        function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom, userCenterApi) {
            Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
            Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
            Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
            Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));

            window.vueDom = new Vue({
                el: '#index_box',
                mixins: [userCenter],
                data: {
                    httpCom: httpCom,
                    jquery: $,
                    http: httpUser,
                    // list: [],
                    // activeIndex: 0,
                    // isAll: false,
                    // userInfo: {},
                    // page: 1,
                    // pageSize: 20,
                    // totalPage: 1,
                    // sels: [],
                    // sysUnread: '',
                    // busUnread: ''
                    tech_table_require_list: [],
                    "techAchiList": [],//技术成果列表
                    "allTotal": 0, //总条数
                    "currentPage": 1,//当前页
                    "pageSize": 4,//每页显示条数


                    "matchDate0": [],
                    "formList0": {
                        "pageParam": {
                            "current": 1,
                            "order": "desc",
                            "size": 5,
                            "sort": "id"
                        },
                        "payload": 0
                    },

                    "formList1": {
                        "pageParam": {
                            "current": 1,
                            "order": "desc",
                            "size": 5,
                            "sort": "id"
                        },
                        "payload": 0
                    },

                    "matchShow": false,
                    "matchDate1": [],
                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl
                },
                created: function () {
                    // this.userInfo = JSON.parse(this.$utils.getCookie('USER_INFO')) || {};
                    // this.getMessageApi();
                    // this.checkUserMarketPart('jishurenzheng');
                    this.find_tech_list_page();
                },
                components: {

                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
                },
                methods: {



                    turnPageClassSign: function () {
                        console.log(httpUrl.baseSchoolOutUrl + '/uc/myClass')
                        var userPhone = localStorage.getItem("userPhone");
                        if (null == userPhone && "" == userPhone || undefined == userPhone) {
                            window.location.href = '/common/login.html';
                        }
                        userCenterApi.turn_page_class_sign_1();
                        window.open(httpUrl.baseSchoolOutUrl + "/uc/index");
                    },

                    changePageView: function (item) {
                        console.log(item)
                        // alert(item.id)
                        window.open("/technologyMarket/tech_requirements_details.html?id=" + item.id);
                    },



                    // 翻页
                    handleCurrentChange: function (page) {
                        var _this = this;
                        console.log(page)
                        var form = {
                            "pageParam": {
                                "current": page,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {

                            }
                        }
                        console.log(form)
                        // 技术成果列表查询
                        _this.getTechAchiListPage(form);
                    },


                    find_tech_list_page: function () {
                        var _this = this;

                        var form = {
                            "pageParam": {
                                "current": _this.currentPage,
                                "size": _this.pageSize,
                                "order": "desc",
                                "sort": "id",
                            },
                            "payload": {
                                // "achievementBelong": 0,
                                // "achievementMaturity": 0,
                                // "budget": 0,
                                // "businessPlanProportion": 0,
                                // "certificationFlag": 0,
                                // "city": "string",
                                // "cooperationMode": 0,
                                // "createUserId": 0,
                                // "delFlag": 0,
                                // "district": "string",
                                // "id": 0,
                                // "platformOrder": 0,
                                // "projectIndustryType": 0,
                                // "projectType": 0,
                                // "province": "string",
                                // "readCount": 0,
                                // "saasId": 0,
                                // "status": "string",
                                // "title": "string",
                                // "topMark": 0,
                                // "updateUserId": 0,
                                // "version": 0
                            }
                        }

                        _this.getTechAchiListPage(form);
                    },

                    // 技术成果列表查询
                    getTechAchiListPage: function (form) {
                        var _this = this;
                        userCenterApi.find_technology_require_pages(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            _this.tech_table_require_list = datalist.records;
                            _this.allTotal = datalist.total;
                        })
                    },


                    getImgPath(path) {
                        return httpUrl.fileShowUrl + '/resource/' + path;
                    },

                    // 跳转 
                    handleMatchView: function (id, type) {
                        console.log(type)
                        if (type == 0) {
                            window.open("/technologyMarket/technical_manager_details.html?id=" + id);
                        } else if (type == 1) {
                            window.open("/technologyMarket/tech_achievements_details.html?id=" + id);
                        }

                    },

                    // 查询匹配的技术经纪人信息 通过需求id或成果id
                    getBrokerListPage: function (id) {
                        var _this = this;
                        _this.formList0.payload = id;
                        userCenterApi.queryMatchInfoBroker(_this.formList0).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            console.log(datalist.records)

                            _this.matchDate0 = datalist.records;
                        })
                    },


                    // 查询匹配的技术成果需求信息 通过技术经纪人id或成果id
                    getProjectListPage: function (id) {
                        var _this = this;

                        _this.formList1.payload = id;
                        userCenterApi.queryMatchInfoProject(_this.formList1).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            console.log(datalist.records)

                            _this.matchDate1 = datalist.records;
                        })
                    },




                    ////////////////////////

                    // 返回值
                    handleCommand(command) {
                        var _this = this;
                        console.log(command)
                        var type = command.num
                        var id = command.command.id
                        if (type == 0) {
                            window.location.href = "/common/usercenter/user_market_tech_require_form.html?id=" + id + "&type=" + type;
                        } else if (type == 1) {
                            window.open("/technologyMarket/tech_requirements_details.html?id=" + id);
                        } else if (type == 2) {
                            _this.getBrokerListPage(id);
                            _this.getProjectListPage(id);
                            _this.matchShow = true;
                        }
                    },

                    // 点击编辑
                    HandleButtonEdit(index, item, num) {
                        console.log(2222)
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },
                    // 点击查看
                    handleButtonView(index, item, num) {
                        console.log(1111)
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },

                    // 匹配
                    HandleButtonMatching(index, item, num) {
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },

                },
            });
        });
});
