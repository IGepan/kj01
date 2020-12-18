// JavaScript Document
require(['/common/js/require.config.js'], function () {
    require(['jquery', 'vue', 'httpUrl'], function ($, Vue, httpUrl, wxApi) {
        document.title = '立即申报';
        new Vue({
            el: '#index_box',
            data: {
                url: '',
            },
            filters: {},
            mounted: function () {},
            created: function () {
                this.url = this.$utils.getReqStr('url');
            },
            methods: {

            }
        });
    })
});
