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
                    //    this.search_transfer_table_list();
                },
                components: {
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'order-menu': httpVueLoader('/common/components/user_tech_menu_order.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
                },
                methods: {

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
                        _this.getTechTransferListPage(form);

                    },

                    // 查询列表
                    search_transfer_table_list: function () {
                        var _this = this;
                        // console.log(page)
                        var form = {
                            "current": _this.currentPage,
                            "size": _this.pageSize,
                            "order": "desc",
                            "sort": "id",
                        }
                        console.log(form)
                        // 技术成果列表查询
                        _this.getTechTransferListPage(form);
                    },

                    getTechTransferListPage: function (form) {
                        var _this = this;
                        userCenterApi.find_tech_transfer_list(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            var datalist = res.data;
                            console.log(datalist)

                            _this.tech_table_list = datalist.records;
                            _this.allTotal = datalist.total;
                        })
                    },



                },
            });
        });
});
