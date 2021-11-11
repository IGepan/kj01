// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js',
            'httpUrl', 'validate', 'img_captcha', 'httpLogin','/common/js/libs/jquery.SuperSlide.2.1.3.js'],
        function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl, validate, captcha, httpLogin,slide) {
            new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    mailSite: {},
                    goodList: [],
                    searchForm: {
                        pageSize: 10,
                        type: '',
                        price: '',
                        sort: ''
                    },
                    dicOptsSet: [
                        {
                            code: 'price',
                            label: '服务价格',
                            operationType: 'select',
                            childIndex: -1,
                            valueKey: 'price',
                            valueType: 'string',
                            isMoreShow: 0,
                            isMore: 0,
                            isTop: 0
                        },
                    ],
                    filters: [
                        {
                            value: false,
                            label: '价格排序',
                            seleced: true
                        },
                        // {
                        //     value: false,
                        //     label: '时间排序'
                        // },
                        {
                            value: false,
                            label: '综合排序'
                        }
                    ],
                    options: {
                        selectOpts: [],
                        searchOpts: [],
                        mailServiceTypeList: [],
                    },
                    title: '',
                    pages: '',
                    nameList: [],
                    result: [],
                    // 服务筛选临时缓存数组
                    ser: [],
                    // 价格筛选临时缓存数组
                    pr: [],
                    active: false,
                    activeAll: true,
                    activePriceAll:true,
                    parentId:null

                },
                mounted: function () {
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/toper_mail.vue'),
                    'index-head': httpVueLoader('/style/components/index_head.vue'),
                    'web-footer': httpVueLoader('/style/components/web_footer.vue'),
                    'header-mail': httpVueLoader('/style/components/header_mail.vue'),
                    'validate-dialog': httpVueLoader('/common/components/validateDialog.vue'),
                    'pages': httpVueLoader('/style/components/pages.vue')

                },
                created: function () {
                    var title = this.$utils.getReqStr('title');
                    // 从url获取type的值
                    var type = this.$utils.getReqStr('type');
                    this.searchForm.title = title;
                    this.searchForm.type = type;
                    this.searchForm.orderBy = 'choosePriceTag asc,minPrice asc,price asc';
                    // cookie用户信息
                    this.userInfo = JSON.parse(
                        this.$utils.getCookie("USER_INFO")
                    );
                },
                mounted: function () {
                    $(".slideTxtBox").slide({
                        titCell: ".hd ul",
                        mainCell: ".bd ul",
                        effect: 'leftLoop',
                        autoPlay: false,
                        autoPage:"<li><a></a></li>",
                        vis: 1,});
                },
                methods: {}

            });
        })
});
