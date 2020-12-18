// JavaScript Document

require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'img_captcha', 'httpVueLoader', 'userCenter', 'httpUser', 'httpStore', 'httpUrl', 'httpCom','fileSaver','httpOrderApi'], function ($, Vue, dic, captcha, httpVueLoader, userCenter, httpUser, httpStore, httpUrl, httpCom,fileSaver,httpOrderApi) {
        window.vueDom = new Vue({
            el: '#index_box',
            data: {
                httpCom: httpCom,
                jquery: $,
                http: httpUser,
                fileUrl: httpUrl.baseUrl + '/exam/downloadCertificate?id=',
                queryForm: {
                    pageNum: 1,	// 	第几页	是	[string]		查看
                    pageSize: 10,	// 	每页显示多少行	是	[string]		查看
                    examResult: '', // 是否通过
                    total: 0
                },
                tableList: [],
                pages: 1,
                pageCount: 4
            },
            provide: {
                api: httpStore,
                httpUrl: httpUrl,
                dic: dic
            },
            components: {
                'ly-toper': httpVueLoader('/style/components/toper.vue'),
                'header-bar': httpVueLoader('/common/components/header.vue'),
                'auth-left': httpVueLoader('/common/components/authLeft.vue'),
                'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
            },
            created: function () {
                this.code = this.$utils.getReqStr('code');
                this.getList()
            },
            methods:{
                getList:function(){
                    var vm = this
                    httpUser.examSelectByPage(this.queryForm).then(function (res) {
                        if (res.code === 'rest.success') {
                            vm.detail=res.result;
                            vm.tableList = res.result.list;
                            vm.queryForm.total = res.result.total;
                            vm.pages = res.result.pages;
                        } else {
                            vm.tableList = [];
                            vm.queryForm.total = 0;
                            vm.pages = 0;
                        }
                    })
                },
                savefile: function (e) {
                    httpOrderApi.getFileBlob(e.target.href).then(function (res) {
                        saveAs(res, e.target.getAttribute('data-name') + '.pdf', { type: 'application/pdf;charset=utf-8' })
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
            }
        });
    });
});
