// JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom', './userCenterApi/userCenterMarketTechAPI.js'],
        function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom, userCenterApi) {
            Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
            Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
            Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
            Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));
            // Vue.component('user-tech-menu', httpVueLoader('/common/components/userTechMenu.vue'));
            Vue.component('user-tech-menu', httpVueLoader('/common/components/buyerLeft.vue'));
            window.vueDom = new Vue({
                el: '#index_box',
                mixins: [userCenter],
                data: {
                    httpCom: httpCom,
                    jquery: $,
                    http: httpUser,
                    "techTableProjectList": [],//投递成果列表
                    "allTotal": 0, //总条数
                    "currentPage": 1,//当前页
                    "pageSize": 10,//每页显示条数

                    "techTableInvitatioList": [],//邀约列表
                    "allTotal_1": 0, //总条数
                    "currentPage_1": 1,//当前页
                    "pageSize_1": 10,//每页显示条数

                    "techTableEntrustList": [],//委托列表
                    "allTotal_2": 0, //总条数
                    "currentPage_2": 1,//当前页
                    "pageSize_2": 10,//每页显示条数
                     isSite:false,

                    tabs: [
                        {
                            label: '邀约交流',
                            selected: true
                        },
                        {
                            label: '投递成果',
                            selected: false
                        },
                        {
                            label: '委托成果/需求',
                            selected: false
                        }

                    ], infos: {
                        comment0: "0xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment1: "1xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf",
                        comment2: "1xxxxxxsadf视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材f视频材料视频材料视频材料视频材料fasdfsf"
                    }
                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl
                },
                created: function () {
                    // this.userInfo = JSON.parse(this.$utils.getCookie('USER_INFO')) || {};
                    // this.getMessageApi();
                    // this.checkUserMarketPart('jishurenzheng');
                    this.search_receive_project_list();
                    this.search_receive_invitation_list();
                    this.search_receive_Entrust_list();
                    var url = window.location.href
                    if (url.indexOf('/site/') > 0) {
                        this.isSite=true
                    }

                },
                components: {
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/newtoper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
                    'user-tech-menu': httpVueLoader('/common/components/buyerLeft.vue')
                    // 'user-tech-menu': httpVueLoader('/common/components/userTechMenu.vue')
                },
                methods: {
                    // ? 打开日志列表
                    openLogsList(item) {
                        window.location.href = this.$pathPrefix+'/common/usercenter/user_market_logs_list.html?type=1&id=' + item.id;
                    },


                    turnPageClassSign: function () {
                        console.log(httpUrl.baseSchoolOutUrl + '/uc/myClass')
                        var userPhone = localStorage.getItem("userPhone");
                        if (null == userPhone && "" == userPhone || undefined == userPhone) {
                            window.location.href = this.$pathPrefix+'/common/login.html';
                        }
                        userCenterApi.turn_page_class_sign_1();
                        window.open(httpUrl.baseSchoolOutUrl + "/uc/index");
                    },

                    // 翻页 成果
                    handleCurrentChange: function (page) {
                        var _this = this;
                        console.log(page)
                        var form = {
                            // "pageParam": {
                            "current": page,
                            "size": _this.pageSize,
                            "order": "desc",
                            "sort": "id",
                            "dictCode": "string",
                            // },
                            // "payload": {

                            // }
                        }
                        console.log(form)
                        // 技术成果列表查询
                        _this.getTechTreceiveProject(form);

                    },

                    // 翻页 邀约
                    handleCurrentChange_1: function (page) {
                        var _this = this;
                        console.log(page)
                        var form = {
                            // "pageParam": {
                            "current": page,
                            "size": _this.pageSize_1,
                            "order": "desc",
                            "sort": "id",
                            "dictCode": "string",
                            // },
                            // "payload": {

                            // }
                        }
                        console.log(form)
                        // 技术成果列表查询
                        _this.getTechReceiveInvitation(form);

                    },

                    // 翻页 邀约
                    handleCurrentChange_2: function (page) {
                        var _this = this;
                        console.log(page)
                        var form = {
                            // "pageParam": {
                            "current": page,
                            "size": _this.pageSize_2,
                            "order": "desc",
                            "sort": "id",
                            "dictCode": "string",
                        }
                        console.log(form)
                        // 技术成果列表查询
                        _this.search_receive_Entrust_list(form);

                    },

                    // 选项卡
                    selecedTab: function (i) {
                        this.tabs.forEach(function (tab, ti) {
                            tab.selected = ti === i
                        })
                    },


                    ///////////// 页面加载基础查询////////////////////

                    // 分页查询
                    search_receive_project_list: function () {
                        var _this = this;
                        // console.log(page)
                        var form = {
                            "current": _this.currentPage,
                            "size": _this.pageSize,
                            "order": "desc",
                            "sort": "id",
                            "dictCode": "string",
                            // "pageParam": {
                            // },
                            // "payload": {
                            // }
                        }
                        console.log(form)
                        //我发送的项目投递列表查询
                        _this.getTechTreceiveProject(form);

                    },


                    //我发送的项目投递列表查询
                    getTechTreceiveProject: function (form) {
                        var _this = this;
                        userCenterApi.find_my_send_project(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            console.log(datalist)

                            _this.techTableProjectList = datalist.records;
                            _this.allTotal = datalist.total;
                        })
                    },


                    // 分页查询
                    search_receive_invitation_list: function () {
                        var _this = this;
                        // console.log(page)
                        var form = {
                            // "pageParam": {
                            "current": _this.currentPage_1,
                            "size": _this.pageSize_1,
                            "order": "desc",
                            "sort": "id",
                            "dictCode": "string",
                            // },
                            // "payload": {
                            // }
                        }
                        console.log(form)
                        // 我发送的邀约信息
                        _this.getTechReceiveInvitation(form);
                    },

                    // 我发送的邀约信息列表查询
                    getTechReceiveInvitation: function (form) {
                        var _this = this;
                        userCenterApi.find_my_send_invitation(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            console.log(datalist)

                            _this.techTableInvitatioList = datalist.records;
                            _this.allTotal_1 = datalist.total;
                        })
                    },


                    // 分页查询
                    search_receive_Entrust_list: function () {
                        var _this = this;
                        var form = {
                            // "pageParam": {
                            "current": _this.currentPage_2,
                            "size": _this.pageSize_2,
                            "order": "desc",
                            "sort": "id",
                            "dictCode": "string",
                        }
                        console.log(form)
                        // 我接收的邀约信息
                        _this.getTechReceiveEntrust(form);
                    },

                    // 我接收的邀约信息列表查询
                    getTechReceiveEntrust: function (form) {
                        var _this = this;
                        userCenterApi.pageListMySendDelegation(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            console.log(datalist)

                            _this.techTableEntrustList = datalist.records;
                            _this.allTotal_2 = datalist.total;
                        })
                    },


                    /////////////////////////////////
                    // 邀约接受
                    handleAcccept(item) {
                        console.log(item);
                        var _this = this;
                        var id = item.id
                        userCenterApi.accept_create_order(id).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            _this.$dialog.showToast("接收成功");
                            _this.search_receive_project_list();
                            _this.search_receive_invitation_list();
                            this.search_receive_Entrust_list();
                        })

                    },

                    // 邀约拒绝
                    handleRefuseInvitatio(item) {
                        console.log(item)
                        var _this = this;
                        var id = item.id
                        userCenterApi.reject_request_order(id).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            _this.$dialog.showToast("拒绝成功");

                            _this.search_receive_project_list();
                            _this.search_receive_invitation_list();
                            this.search_receive_Entrust_list();

                        })
                    },


                    // 返回值
                    handleCommand(command) {
                        console.log(command)
                        var type = command.num
                        var id = command.command.id

                    },

                    // 点击j项目接受
                    HandleAcceptDelivery(index, item, num) {
                        console.log(2222)
                        return {
                            'command': item,
                            "index": index,
                            "num": num
                        }
                    },
                    // 点击项目拒绝
                    handleRefuseDelivery(index, item, num) {
                        console.log(1111)
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
