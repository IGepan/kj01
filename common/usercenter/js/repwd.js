// JavaScript Document

require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'img_captcha', 'httpVueLoader', 'base64', 'httpUser', 'httpStore', 'httpUrl', 'httpCom'], function ($, Vue, dic, captcha, httpVueLoader, base64, httpUser, httpStore, httpUrl, httpCom) {

    Vue.component('validate-dialog', httpVueLoader('/common/components/validateDialog.vue'))
    window.vueDom = new Vue({
      el: '#index_box',
      data: {
        httpCom: httpCom,
        jquery: $,
        http: httpUser
      },
      provide: {
        api: httpStore,
        httpUrl: httpUrl,
        jquery: $,
        dic: dic
      },
      mounted: function () {
        var vm = this;
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/newtoper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'auth-left': httpVueLoader('/common/components/authLeft.vue'),
        'repassword': httpVueLoader('./components/password.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      }
    });
  });
});
