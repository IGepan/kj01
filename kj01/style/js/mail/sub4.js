// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl', 'validate','img_captcha','httpLogin'],
        function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl,validate,captcha,httpLogin) {
            new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    formData: {
                        pageSize: 20,
                        pageNum:1
                    },
                    footList:[],
                    show:false,
                    pages: ''
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
                    'ly-toper': httpVueLoader('/style/components/toper_mail.vue'),
                    'header-mail': httpVueLoader('/style/components/header_mail.vue'),
                    'index-head': httpVueLoader('/style/components/index_head.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'validate-dialog': httpVueLoader('/common/components/validateDialog.vue'),
                    'pages': httpVueLoader('/style/components/pages.vue')
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
                                vm.footList = res.result
                                vm.$data.pages = res.result.pageInfo || ''
                            }
                        })
                    },
                    handelRemove: function (id) {
                        var vm = this
                        var ids = new Array(id);
                        for (var i = 0; i < vm.footList.list.length; i++) {
                            for (var j = 0; j < vm.footList.list[i].datalist.length; j++) {
                                var data = vm.footList.list[i].datalist[j]
                                if (data.id === id) {
                                    vm.footList.list[i].datalist.splice(j, 1)
                                    if (vm.footList.list[i].datalist.length == 0) {
                                        vm.footList.list.splice(i, 1)
                                    }
                                }
                            }
                        }
                    },
                    handelMore: function () {
                        var vm = this
                        if (vm.footList.hasNextPage) {

                            indexApi.selectMailGoodsPrint(this.formData).then(function (res) {
                                if (res.code === 'rest.success') {
                                    for (var i = 0; i < res.result.list.length; i++) {
                                        if (vm.footList.list.length == 0) {
                                            vm.footList.list.push(res.result.list[i])
                                            return;
                                        }
                                        var group = res.result.list[i].date
                                        var last = vm.footList.list[vm.footList.list.length - 1].date
                                        if (group === last) {
                                            for (var j = 0; j < res.result.list[i].datalist.length; j++) {
                                                vm.footList.list[vm.footList.list.length - 1].datalist.push(res.result.list[i].datalist[j])
                                            }
                                        } else {
                                            vm.footList.list.push(res.result.list[i])
                                        }
                                    }
                                    vm.$data.pages = res.result.pageInfo || ''
                                    vm.footList.hasNextPage = res.result.hasNextPage

                                }
                            })
                        }

                    },
                    // 移入
                    mouseOver() {
                        this.show = true
                    },
                    // 移出
                    mouseLeave() {
                        this.show = false
                    },
                    bindPageChange: function (e) {
                        this.formData.pageNum = e
                        this.handelMore()
                    },
                }
            });
        })
});
