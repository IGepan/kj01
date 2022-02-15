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
                    "resultDes": "",
                    "id": "",
                    "techTableTransferList": [],//技术成果列表
                    "allTotal": 0, //总条数
                    "currentPage": 1,//当前页
                    "pageSize": 4,//每页显示条数
                    "price": "",
                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl
                },
                created: function () {
                    this.initData();
                    // this.userInfo = JSON.parse(this.$utils.getCookie('USER_INFO')) || {};
                    // this.getMessageApi();
                    // this.checkUserMarketPart('jishurenzheng');
                    // this.search_transfer_table_list();
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
                            window.location.href =this.$pathPrefix+'/common/login.html';
                        }
                        userCenterApi.turn_page_class_sign_1();
                        window.open(httpUrl.baseSchoolOutUrl + "/uc/index");
                    },

                    initData: function () {
                        let d = new Date()
                        let dy = d.getFullYear()
                        let dm = d.getMonth()
                        let dd = d.getDate()
                        this.saasId = localStorage.getItem('saasId');
                        var id = this.$utils.getReqStr('id');
                        this.id = id;
                        this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)));
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



                    handleEnd: function () {
                        var _this = this;
                        if ("" == _this.price || null == _this.price) {
                            _this.$dialog.showToast("请输入价格");
                            return;
                        }

                        if ("" == _this.resultDes || null == _this.resultDes) {
                            _this.$dialog.showToast("请填写完成描述");
                            return;
                        }

                        var form = {
                            "id": _this.id,
                            "resultDes": _this.resultDes,
                            "price": _this.price
                        };

                        userCenterApi.finishOrder(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            _this.$dialog.showToast("申请完成，请等待审核");
                            window.location.href =this.$pathPrefix+  "/common/usercenter/user_market_business_order.html";
                        })
                    },
                },
            });
        });
});
