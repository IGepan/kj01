// JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom', './userCenterApi/userCenterMarketTechAPI.js'],
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
                    httpCom: httpCom,
                    techLogList: [],
                    allTotal: 0,
                    id: "",
                    query: {
                        "current": 1,
                        "order": "desc",
                        "size": 9,
                        "sort": "id"
                    },

                    logTitle: "",
                    logShowType: "",
                    dialogTableVisible: false,
                    DialogVisible: false,
                    textarea: "",
                    details: "",
                    pageId: "",
                    btnShow: true,
                },
                provide: {
                    httpUser: httpUser,
                    httpUrl: httpUrl
                },
                created: function () {
                    this.pageId = window.location.href.split("id=")[1];
                    this.getTechLogList(this.pageId);
                    console.log(window.location.href.indexOf('type='))
                    if (window.location.href.indexOf('type=') > -1) {
                        this.btnShow = false;
                    }
                },
                components: {
                    'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
                    'header-bar': httpVueLoader('/common/components/header.vue'),
                    'ly-page': httpVueLoader('/common/components/pages.vue'),
                    'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
                    'user-tech-menu': httpVueLoader('/common/components/userTechMenu.vue')
                },
                methods: {
                    //翻页
                    handleCurrentChange() {
                        let _this = this;
                    },
                    //查看详情
                    handleView(item, type) {
                        let _this = this;
                        _this.logTitle = "查看详情";
                        _this.dialogTableVisible = true;
                        _this.logShowType = type;
                        _this.details = item;
                    },
                    //删除日志
                    changeAcccept(item, type) {
                        let _this = this;
                        console.log(item);
                        //
                        // _this.logTitle = "修改日志";
                        _this.DialogVisible = true;
                        _this.logShowType = type;
                        _this.details = item;
                        // _this.textarea = item.logText;

                    },
                    //删除日志
                    handleClose() {
                        let _this = this;
                        userCenterApi.deleteTechBrokerBind(_this.details.id).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$message({
                                    message: res.message,
                                    type: 'warning'
                                });
                                return;
                            }
                            _this.$message({
                                message: "删除成功",
                                type: 'success'
                            });
                            _this.DialogVisible = false;
                            console.log(window.location.href.split("=")[1])
                            _this.getTechLogList(window.location.href.split("=")[1]);
                        })
                    },

                    //提交修改内容
                    commitLog() {
                        let _this = this;
                        let form = {
                            "logText": _this.textarea,
                            "id": _this.details.id,
                            "requestId": window.location.href.split("=")[1],
                        }
                        userCenterApi.zMBusinessLogRest(form).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$message({
                                    message: res.message,
                                    type: 'warning'
                                });
                                return;
                            }
                            _this.$message({
                                message: "修改成功",
                                type: 'success'
                            });
                            _this.dialogTableVisible = false;
                            _this.getTechLogList(window.location.href.split("=")[1]);
                        })
                    },

                    getTechLogList(id) {
                        let _this = this;
                        userCenterApi.zMLogQueryPageRest(id, _this.query).then(function (res) {
                            console.log(res)
                            if (!res.code) {
                                _this.$dialog.showToast(res.message);
                                return;
                            }
                            let datalist = res.data;
                            _this.techLogList = datalist.records;
                            _this.allTotal = datalist.total;
                        })
                    }
                },
            });
        });
});
