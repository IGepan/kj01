// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'dic', 'httpVueLoader', '/style/js/api/mail.js', '/common/js/libs/owl.carousel.2.2.1/owl.carousel.min.js', 'httpUrl', 'validate','img_captcha','httpLogin'],
        function ($, Vue, dic, httpVueLoader, indexApi, owlCarousel, httpUrl,validate,captcha,httpLogin) {
            new Vue({
                el: '#index_box',
                data: {
                    saasId: '',
                    formData: {
                        id:''
                    },
                    detail:[],
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

                    var id = this.$utils.getReqStr('id')
                    //买家热门问题
                    this.formData.id=id
                    this.selectDetail();
                },
                methods: {
                    selectDetail: function () {
                        var vm = this
                        indexApi.mailHelpSelectDetail(this.formData).then(function (res) {
                            if (res.code === 'rest.success') {
                                vm.detail = res.result
                            }
                        })
                    },
                }
            });
        })
});
