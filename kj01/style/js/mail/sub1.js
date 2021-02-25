// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl', 'validate','img_captcha','httpLogin'],
        function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl,validate,captcha,httpLogin) {
            new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    mailSite: {},
                    mailServiceTypeList: [],
                    incubationTypeList: [],
                    designTypeList: [],
                    checkTypeList:[],
                    propertyTypeList:[],
                    technologyTypeList:[],
                    transferTypeList:[],
                    incubationType: {},
                    designType: [],
                    checkType:[],
                    propertyType:[],
                    technologyType:[],
                    transferType:[],
                    indexBanner: [],
                    //精选服务
                    chooseGoods: [],
                    goodFormData: {
                        chosenFlag: '',
                        pageSize: '',
                        type:''
                    },
                    contentErrorMsg: '',
                    phoneErrorMsg: '',
                    vercodeErrorMsg: '',
                    select: false,
                    isPhoneError: false,
                    isShowDialog: false,
                    isSubmitDisabled: false,
                    form: {
                        phone: '',
                        content:'',
                        token: '',
                        code: '',
                    },
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
                },
                methods: {
                }
            });
        })
});
