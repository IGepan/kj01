// JavaScript Document
var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', '/common/js/httpApi/topic.js', 'jqValidate', 'dialog', 'httpUrl', 'laydate'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, activityApi, jqValidate, dialog, httpUrl, laydate) {
        window.vueDom = new Vue({
            el: '#index_box',
            mixins: [userCenter],
            data: {
                showFull: false,
                http: httpUser,
                m_more: false,
                index: -1,
                options: {},
                queryForm: {
                    pageNum: 1,	// 	第几页	是	[string]		查看
                    pageSize: 10,	// 	每页显示多少行	是	[string]		查看
                    id:'',
                    keyWord: '', // 关键字
                    isDone: '', // 活动状态(字典表：topic_status)
                    total: 0
                },
                tableList: [],
                pages: 1,
                pageCount: 4,
                detail:''
            },
            watch: {
            },
            created: function () {
                this.queryForm.id = this.$utils.getReqStr('id');
                this.initData();
            },
            components: {
                'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
                'header-bar': httpVueLoader('/common/components/header.vue'),
                'buyer-left': httpVueLoader('/common/components/conferenceLeft.vue'),
                'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
            },
            mounted: function () {
                var vm = this;
                document.addEventListener('click', function () {
                    vm.index = -1;
                });
            },
            methods: {
                showMore: function (i) {
                    this.index = i;
                },
                initData: function () {
                    this.getList()
                },
                getList: function () {
                    var vm = this
                        activityApi.learnSelectByPage(this.queryForm).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.detail=res.result;
                                vm.tableList = res.result.list;
                                vm.queryForm.total = res.result.list.total;
                                vm.pages = res.result.list.pages;
                            } else {
                                vm.tableList = [];
                                vm.queryForm.total = 0;
                                vm.pages = 0;
                            }
                        })
                },
                pageClick: function (index) {
                    if (index > 0 && index <= this.pages) {
                        this.queryForm.pageNum = index;
                        this.getList();
                    }
                },
                isShowPage: function (index) {
                    var pageNum = this.queryForm.pageNum;
                    var row = parseInt(pageNum / 2);
                    if (row == 0 || row == 1) {
                        if (1 <= index && index <= 4) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        if (row * 2 - 1 <= index && index <= row * 2 + 2) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                isMore: function () {
                    var pageNum = this.queryForm.pageNum;
                    var row = parseInt(pageNum / 2);
                    var index = row * 2 - 1;
                    return !(index + 4 > this.pages);
                },
                handleExportExcel: function () {
                    var vm = this
                    activityApi.exportExcel(this.queryForm)
                }
            }
        });
    });
});
