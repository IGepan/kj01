// JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom', 'ELEMENT', './userCenterApi/userCenterMarketTechAPI.js'],
        function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom, ELEMENT, userCenterApi) {


            Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
            Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
            Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
            Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));
            Vue.component('user-tech-menu', httpVueLoader('/common/components/userTechMenu.vue'));

            window.vueDom = new Vue({
                el: '#index_box',
                mixins: [userCenter],
                data: {
                    httpCom: httpCom,
                    jquery: $,
                    http: httpUser,
                    "techAchiList": [],//技术成果列表
                    "allTotal": 0, //总条数
                    "currentPage": 1,//当前页
                    "pageSize": 4,//每页显示条数

                    tech_table_list: [],//table

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
                    this.find_tech_list_page();
                    //   this.Ctor = new Ctor().$mount('#index_box');

                    // this.userInfo = JSON.parse(this.$utils.getCookie('USER_INFO')) || {};
                    // this.getMessageApi();
                    // this.checkUserMarketPart('jishurenzheng');
                },
                components: {
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
                    'user-tech-menu': httpVueLoader('/common/components/userTechMenu.vue'),
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
                    formatter(row, column) {
                        return row.address;
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
                            "payload": {}
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
                            "payload": {}
                        }

                        _this.getTechAchiListPage(form);
                    },

                    handleEdit: function (form) {
                    },

                    // 技术成果列表查询
                    getTechAchiListPage: function (form) {
                        var _this = this;
                        userCenterApi.find_technology_pages(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            console.log(datalist.records)

                            _this.tech_table_list = datalist.records;
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
                            var url = window.location.href
                            if (url.indexOf('/site/') > 0) {
                                window.open(this.$pathPrefix+"/requirementDetail.html?id=" + id);
                            }else {
                                window.open("/technologyMarket/tech_requirements_details.html?id=" + id);
                            }

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
                    getDemandListPage: function (id) {
                        var _this = this;

                        _this.formList1.payload = id;
                        userCenterApi.queryMatchInfoDemand(_this.formList1).then(function (res) {
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


                    changePageView: function (item) {
                        console.log(item)
                        // alert(item.id)
                        var url = window.location.href
                        if (url.indexOf('/site/') > 0) {
                            window.open(this.$pathPrefix+"/scienceDetail.html?id=" + item.id);
                        }else {
                            window.open("/technologyMarket/tech_achievements_details.html?id=" + item.id);
                        }

                    },


                    handleDelete(item, id) {

                        console.log(item)
                        console.log(id)
                        // return {
                        //     'command': item,
                        //     'id': id
                        // }
                    },

                    ////////////////////////

                    // 返回值
                    handleCommand(command) {
                        var _this = this;
                        console.log(command)
                        var type = command.num
                        var id = command.command.id
                        if (type == 0) {
                            window.location.href =this.$pathPrefix+"/common/usercenter/user_market_tech_achi_form.html?id=" + id + "&type=" + type;
                        } else if (type == 1) {
                            console.log(2222)
                            var url = window.location.href
                            if (url.indexOf('/site/') > 0) {
                                window.open(this.$pathPrefix+"/scienceDetail.html?id=" + id);
                            }else {
                                window.open("/technologyMarket/tech_achievements_details.html?id=" + id);
                            }

                        } else if (type == 2) {
                            window.location.href = this.$pathPrefix+"/common/usercenter/user_market_tech_patent_list.html?id=" + id;
                        } else if (type == 3) {
                            window.location.href = this.$pathPrefix+ "/common/usercenter/user_market_tech_achi_trans_form.html?proId=" + id;
                        } else if (type == 4) {
                            _this.matchShow = true;
                            _this.getBrokerListPage(id);
                            _this.getDemandListPage(id);
                        } else if (type == 5) {
                            var form = {
                                "flag": command.index,
                                "id": command.command
                            }
                            userCenterApi.techShelves(form).then(function (res) {
                                console.log(res)
                                if (!res.code) {
                                    _this.$dialog.showToast(res.message);
                                    return;
                                }
                                _this.$dialog.showToast(command.index == 0 ? "上架成功！" : "下架成功！");
                                _this.find_tech_list_page();
                            })

                        }
                    },

                    // 点击编辑
                    HandleButtonEdit(index, item, num) {
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },
                    // 点击查看
                    handleButtonView(index, item, num) {
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },
                    // 专利信息
                    handleButtonPantent(index, item, num) {
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },

                    // 成果转化
                    handleAchiTrans(index, item, num) {
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
                    // 上架下架
                    HandleButtonDeflag(deflag, id, num) {
                        return {
                            'command': id,
                            "index": deflag,
                            "num": num
                        }
                    },

                },
            });
        });
});
