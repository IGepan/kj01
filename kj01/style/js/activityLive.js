// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'dic', 'vue', 'httpVueLoader', '/style/js/api/aindex.js', '/common/js/httpApi/activity.js', 'fileSaver', 'httpUrl','jqValidate'],
        function ($, dic, Vue, httpVueLoader, indexApi, activityApi, fileSaver, httpUrl,jqValidate) {
            new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    breadcrumb: [
                        // {
                        //     url: '/aindex.html',
                        //     label: '活动'
                        // },
                        {
                            url: '/alist.html',
                            label: '活动列表'
                        },
                        {
                            label: '详情',
                            url: ''
                        },
                        {
                            label: '直播'
                        }
                    ],
                    detail: '',
                    userInfo:''
                },
                filters: {
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/newtoper.vue'),
                    'sub-head': httpVueLoader('/style/components/asub_head.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue')
                },

                created: function () {
                    this.initData()
                },
                mounted: function () {
                },
                methods: {
                    //下载签到二维码
                    handleGetWxSignCode: function (id) {
                        var id = this.$utils.getReqStr('id')
                        activityApi.getWxSignCode({ id: id }).then(function (res) {
                            saveAs(res, '签到' + id + '.jpg', { type: 'image/jpeg;charset=utf-8' })
                        })
                    },
                    initData: function () {
                        // this.saasId = localStorage.getItem('saasId');
                        var id = this.$utils.getReqStr('id')
                        this.breadcrumb[1].url = '/adetail.html?id=' + id
                        this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
                        if (this.userInfo && this.userInfo.userName) {
                            this.getDetailInfo(id);
                        } else {
                            window.location.href = '/common/login.html';
                        }
                    },
                    getDetailInfo: function (id) {
                        var vm = this;
                        indexApi.getLiveDetail({ id: id}).then(function (res) {
                            if(res.code==='rest.success'){
                                vm.detail = res.result ? res.result : {}
                                if(vm.detail){
                                    vm.detail.pullStreamUrl=vm.detail.pullStreamUrl+'?name='+vm.userInfo.userName+'&email='+vm.userInfo.userId+'@qq.com';
                                    vm.detail.pullStreamUrl=vm.detail.recordId?res.result.pullStreamUrl+'&rid='+vm.detail.recordId:vm.detail.pullStreamUrl;
                                }
                            }
                        })
                    },
                }
            });
        })
});
