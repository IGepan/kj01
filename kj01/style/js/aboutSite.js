// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js','/style/js/libs/swiper-5.4.1/js/swiper.min.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl', 'validate', 'img_captcha', 'httpLogin'],
        function ($, Vue, dic, httpVueLoader,indexApi,Swiper,  owlCarousel, httpUrl, validate, captcha, httpLogin) {
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
                    var swiperEntity = new Swiper('.slideTxtBox', {
                        slidesPerView: 1,
                         // spaceBetween: 20,
                        loop: true, // 循环模式选项
                        autoplay:false, // 可选选项，自动滑动
                        paginationClickable: true,
                        delay: 4000,// 3秒切换一次
                        // initialSlide: 2, // 设定初始化时slide的索引。Swiper默认初始化时显示第一个slide，有时想初始化时直接显示其他slide，可以做此设置。
                        navigation: {
                            nextEl: '.item-next',
                            prevEl: '.item-prev',
                        },
                    })
                    $('.slideTxtBox').mouseenter(function () {
                        // 鼠标悬停停止播放
                        swiperEntity.autoplay.stop();
                    })
                    $('.slideTxtBox').mouseleave(function () {
                        // 鼠标移除开启自动播放
                        swiperEntity.autoplay.start();
                    })
                },
                components: {
                    'ly-toper': httpVueLoader('/style/components/newtoper.vue'),
                    'index-head': httpVueLoader('/style/components/index_head2.vue'),
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
                methods: {
                    toTop() {

                        let top = document.documentElement.scrollTop || document.body.scrollTop;
                        // 实现滚动效果
                        const timeTop = setInterval(() => {
                            document.body.scrollTop = document.documentElement.scrollTop = top -= 50;
                            if (top <= 0) {
                                clearInterval(timeTop);
                            }
                        }, 10);
                    },
                    handleE:function () {
                        this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO))
                        if (!this.userInfo.userId) {
                            window.location.href = "/common/login.html?back=/expert.html";
                        } else {
                            window.location.href = "/expert.html";
                        }
                    },
                    handleM:function () {
                        this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO))
                        if (!this.userInfo.userId) {
                            window.location.href = "/common/login.html?back=/mechanism.html";
                        } else {
                            window.location.href = "/mechanism.html";
                        }
                    },
                    fwsClick2: function () {
                        if (this.userInfo.userTypes) {
                            for (var it of this.userInfo.userTypes) {
                                if (it === "002") {
                                    this.isSeller = true;
                                }
                            }
                        }

                        if (!this.userInfo.userId) {
                            window.location.href = "/common/login.html";
                            return;
                        }
                        if (this.isSeller) {
                            window.location.href = "/common/seller/index.html";
                        } else {
                            window.location.href = "/common/seller/store_agreement.html";
                        }
                    },
                },

            });
        })
});
