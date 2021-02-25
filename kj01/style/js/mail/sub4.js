// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl', 'validate','img_captcha','httpLogin'],
        function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl,validate,captcha,httpLogin) {
            new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    formData: {
                        pageSize: 3,
                        pageNum:1
                    },
                    footList:[],
                },
                filters: {
                    formatPrice2: function (flag, v, n, m) {
                        if(flag === '1') {
                            return '面议'
                        } else {
                            if(typeof v !== 'undefined') {
                                return (v / 10000).toFixed(2)
                            } else if(!v && !m) {
                                return (n / 10000).toFixed(2)
                            } else {
                                return (n / 10000).toFixed(2) + '-' + (m / 10000).toFixed(2)
                            }
                        }
                    },
                },
                mounted: function () {
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper.vue'),
                    'index-head': httpVueLoader('/style/components/index_head.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'validate-dialog': httpVueLoader('/common/components/validateDialog.vue'),
                },
                created: function () {
                    //查询足迹
                    this.selectByPage();
                },
                methods: {
                    selectByPage: function () {
                        var vm = this
                        indexApi.selectMailGoodsPrint(this.formData).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.footList=res.result
                            }
                        })
                    },
                    handelRemove: function (id) {
                        var vm = this
                        var ids=new Array(id);
                        indexApi.deleteGoodsPrint({id:ids}).then(function (res) {
                            if (res.code === 'rest.success') {
                                //TODO 移除动画
                            }
                        })
                    },
                    handelMore:function (){
                        var vm = this
                        if (vm.footList.hasNextPage){
                            this.formData.pageNum=++this.formData.pageNum
                            indexApi.selectMailGoodsPrint(this.formData).then(function (res) {
                                if (res.code === 'rest.success') {
                                    //TODO 优化 时间相同的合并
                                    for (var i = 0; i < res.result.list.length; i++) {
                                        vm.footList.list.push(res.result.list[i])
                                    }
                                    vm.footList.hasNextPage = res.result.hasNextPage

                                }
                            })
                        }

                    }
                }
            });
        })
});
