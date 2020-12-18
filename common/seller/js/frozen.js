require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'httpVueLoader', 'seller', 'httpCom'], function ($, Vue, httpStore, httpUrl, dic, httpVueLoader, seller, httpCom) {

    new Vue({
      el: '#store_box',
      data: {
        activateinfo: {},
        http: httpStore,
        httpCom: httpCom,
        isDisabled: false
      },
      httpUrl: httpUrl,
      mixins: [seller],
      components: {
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.shopSelectActivateinfo();
      },
      methods: {
        shopSelectActivateinfo: function () {
          var vm = this;
          httpStore.initFrozen().then(function (res) {
            if (res.result) {
              vm.activateinfo = res.result;
            } else {
              location.href = 'index.html'
            }

          })
        },
				/**
				 * 店铺激活
				 */
        activeClick: function () {
          if (!this.isActive) {
            var vm = this;
            vm.isDisabled = true
            httpStore.applyFrozen(vm.activateinfo).then(function (res) {
              if (res.code == 'rest.success') {
                var options = {
                  title: '温馨提示',
                  texts: '您的申请已经提交,请等待管理员审核。',
                  buttons: ['确认'],
                  callback: function () {
                    location.href = 'index.html'
                  }
                }
                vm.$dialog.alert(options)
              } else {
                vm.isDisabled = false
              }
            }).catch(function () {
              $this.isDisabled = false
              $dialog.showToast('申请失败，请重试');
            })
          }
        }
      }
    });
  });
});
