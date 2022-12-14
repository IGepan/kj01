require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'httpVueLoader', 'seller'], function ($, Vue, httpStore, httpUrl, dic, httpVueLoader, seller) {
    new Vue({
      el: '#store_box',
      data: {
        protocol: '',
        disabled: false,
        http: httpStore,
        webInfo:''
      },
      mixins: [seller],
      components: {
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        var vm = this;
        httpStore.protocol({
          protocolType: '3'
        }).then(function (res) {
          if (res.result && res.result.protocolContact != '') {
            vm.protocol = res.result.protocolContact;
          } else {
            vm.disabled = true;
          }
        })
      },
      mounted: function () {
          this.getPublicDetail()
      },
      methods: {
        getPublicDetail(){
          let vm=this;
          this.$httpCom.publicDetail().then(function(res) {
            if (res.code === "rest.success") {
              vm.webInfo = res.result;
              vm.monitorSetItem('webInfo', JSON.stringify(vm.webInfo));
            }
          });
        },
        agreementClick: function () {
          var vm = this;
          if (!this.disabled) {
            this.http.shopInsert().then(function (resp) {
              if (resp.code === 'rest.success') {
                vm.$httpCom.webCommonUser().then(function (res) {
                  if (res.code === 'rest.success') {
                    vm.$utils.delCookie('USER_INFO');
                    vm.$utils.setCookie('USER_INFO', res.result);
                    localStorage.setItem('saasId', res.result.saasId);
                    res.result.userTypes && localStorage.setItem('AUTHORITY', JSON.stringify(res.result.userTypes));
                    window.location.href = 'http://' + window.location.host + vm.$pathPrefix+'/common/seller/consent_agreement.html'
                  }
                })
              }
            })
          }
        }
      }
    });
  });
});
