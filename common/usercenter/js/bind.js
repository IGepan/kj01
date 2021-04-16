// JavaScript Document

require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'img_captcha', 'httpVueLoader', 'userCenter', 'httpUser', 'httpStore', 'httpUrl', 'httpCom'], function ($, Vue, dic, captcha, httpVueLoader, userCenter, httpUser, httpStore, httpUrl, httpCom) {

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
        dic: dic
      },
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'auth-left': httpVueLoader('/common/components/authLeft.vue'),
        'phone': httpVueLoader('./components/phone.vue'),
        'email': httpVueLoader('./components/email.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.code = this.$utils.getReqStr('code')
      }
    });
  });
});
