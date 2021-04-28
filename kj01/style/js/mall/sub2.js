// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl', 'validate','img_captcha','httpLogin'],
        function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl,validate,captcha,httpLogin) {
            new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    formBuyData: {
                        pageSize: '21',
                        type:'1',
                        pageNum: 1
                    },
                    formSellData: {
                        pageSize: '20',
                        type:'2',
                        pageNum: 1
                    },
                    helpListBuy:[],
                    helpListSell:[],
                    sumEv: 0,
                    total: 0,
                    pages: 1,
                    sumEvSell: 0,
                    totalSell: 0,
                    pagesSell: 1,
                },
                filters: {

                },
                mounted: function () {
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper_mail.vue'),
                    'header-mail': httpVueLoader('/style/components/header_mail.vue'),
                    'index-head': httpVueLoader('/style/components/index_head.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'validate-dialog': httpVueLoader('/common/components/validateDialog.vue'),
                },
                created: function () {
                    //买家热门问题
                    this.selectBuyByPage();
                    //卖家热门问题
                    this.selectSellByPage();
                },
                methods: {
                    selectBuyByPage: function () {
                        var vm = this
                        indexApi.mailHelpSelectByPage(this.formBuyData).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.helpListBuy = res.result.list
                                vm.pages = res.result.pages;
                                vm.sumEv = res.result.total
                            }
                        })
                    },
                    selectSellByPage: function () {
                        var vm = this
                        indexApi.mailHelpSelectByPage(this.formSellData).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.helpListSell = res.result.list
                                vm.pagesSell = res.result.pages;
                                vm.sumEvSell = res.result.total
                            }
                        })
                    },
                    pageClick: function (index) {
                        if (index > 0 && index <= this.pages) {
                            this.formBuyData.pageNum = index;
                            this.selectBuyByPage();
                        }
                    },
                    isShowPage: function (index) {
                        var pageNum = this.formBuyData.pageNum;
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
                        var pageNum = this.formBuyData.pageNum;
                        var row = parseInt(pageNum / 2);
                        var index = row * 2 - 1;
                        return !(index + 4 > this.pages);
                    },
                    pageClickSell: function (index) {
                        if (index > 0 && index <= this.pagesSell) {
                            this.formSellData.pageNum = index;
                            this.selectBuyByPage();
                        }
                    },
                    isShowPageSell: function (index) {
                        var pageNum = this.formSellData.pageNum;
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
                    isMoreSell: function () {
                        var pageNum = this.formSellData.pageNum;
                        var row = parseInt(pageNum / 2);
                        var index = row * 2 - 1;
                        return !(index + 4 > this.pagesSell);
                    },

                }
            });
        })
});
