// JavaScript Document

require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom) {


    Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
    Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
    Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
    Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));

    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        httpCom: httpCom,
        jquery: $,
        http: httpUser
      },
      provide: {
        httpUser: httpUser,
        httpUrl: httpUrl
      },
      mounted: function () {
        var vm = this;
        httpUser.detailEnterpriseAuthen().then(function (res) {
          if (res.result.identityType === '01' || !res.result.identityType) {
            vm.activeTabsIndex = 0;
          } else {
            vm.activeTabsIndex = 1;
          }
        })
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'auth-left': httpVueLoader('/common/components/authLeft.vue'),
        'auth-personal': httpVueLoader('./components/authPersonal.vue'),
        'auth-company': httpVueLoader('./components/authCompany.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      methods: {
        expireDateValid: function (v, o, callback) {
          this.$refs.auth.expireDateValid(v, o, callback);
        },
        imgUploadSuccess: function (id, url, type) {
          this.$refs.auth.imgUploadSuccess(id, url, type);
        },
        businessValid: function (v, o, callback) {
          this.$refs.auth.businessValid(v, o, callback);
        },
        addressValid: function (v, o, callback) {
          this.$refs.auth.addressValid(v, o, callback);
        },
        certificatImgsValid: function (v, o, callback) {
          this.$refs.auth.certificatImgsValid(v, o, callback);
        }
      },
    });
  });
});
