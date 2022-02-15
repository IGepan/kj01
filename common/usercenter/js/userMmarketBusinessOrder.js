// JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom',
            './userCenterApi/userCenterMarketTechAPI.js'],
        function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom, userCenterApi) {

            Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
            Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
            Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
            Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));
            Vue.component('user-tech-menu', httpVueLoader('/common/components/userTechMenu.vue'));

            window.vueDom = new Vue({
                el: '#index_box',
                mixins: [userCenter],
                data: {
                    "tech_table_list": [],
                    httpCom: httpCom,
                    jquery: $,
                    http: httpUser,

                    "techTableTransferList": [],//技术成果列表
                    "allTotal": 0, //总条数
                    "currentPage": 1,//当前页
                    "pageSize": 4,//每页显示条数
                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl
                },
                created: function () {
                    // this.userInfo = JSON.parse(this.$utils.getCookie('USER_INFO')) || {};
                    // this.getMessageApi();
                    // this.checkUserMarketPart('jishurenzheng');
                    this.search_transfer_table_list();
                },
                components: {
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
                    'user-tech-menu': httpVueLoader('/common/components/userTechMenu.vue')
                },
                methods: {


                    turnPageClassSign: function () {
                        console.log(httpUrl.baseSchoolOutUrl + '/uc/myClass')
                        var userPhone = localStorage.getItem("userPhone");
                        if (null == userPhone && "" == userPhone || undefined == userPhone) {
                            window.location.href =this.$pathPrefix+ '/common/login.html';
                        }
                        userCenterApi.turn_page_class_sign_1();
                        window.open(httpUrl.baseSchoolOutUrl + "/uc/index");
                    },


                    // // 翻页
                    // handleCurrentChange: function (page) {
                    //     var _this = this;
                    //     console.log(page)
                    //     var form = {
                    //         "pageParam": {
                    //             "current": page,
                    //             "size": _this.pageSize,
                    //             "order": "desc",
                    //             "sort": "id",
                    //         },
                    //         "payload": {

                    //         }
                    //     }
                    //     console.log(form)
                    //     // 技术成果列表查询
                    //     _this.getTechTransferListPage(form);

                    // },

                    // 查询列表
                    search_transfer_table_list: function () {
                        var _this = this;
                        // console.log(page)
                        var form = {
                            "current": _this.currentPage,
                            "size": _this.pageSize,
                            "dictCode": "",
                            "order": "desc",
                            "sort": "id"
                        };
                        console.log(form)
                        var _this = this;
                        userCenterApi.pageOrderInfo(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            console.log(datalist)
                            _this.tech_table_list = datalist.records;
                            _this.tech_table_list.forEach(element => {
                                element.certificationFlag_display = "";
                                if (element.certificationFlag == 1) {
                                    element.certificationFlag_display = "待审核";
                                } else if (element.certificationFlag == 2) {
                                    element.certificationFlag_display = "通过";
                                } else if (element.certificationFlag == 3) {
                                    element.certificationFlag_display = "不通过";
                                } else {
                                    element.certificationFlag_display = "进行中";
                                }
                            });

                            _this.allTotal = datalist.total;
                        })
                    },
                    handleEnd: function (index, row) {
                        var _this = this;
                        var id = row.id;
                        window.location.href =this.$pathPrefix+ "/common/usercenter/user_market_business_order_over.html?id=" + id;
                    },
                },
            });
        });
});
