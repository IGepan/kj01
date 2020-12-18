require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'httpVueLoader', 'seller', 'httpCom', 'fileSaver'], function ($, Vue, httpStore, httpUrl, dic, httpVueLoader, seller, httpCom, fileSaver) {

    new Vue({
      el: '#store_box',
      data: {
        activateinfo: {},
        http: httpStore,
        httpUrl: httpUrl,
        httpCom: httpCom
      },
      mixins: [seller],
      components: {
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {

      },
      mounted: function () {
        this.shopSelectActivateinfo();
      },
      methods: {
        shopSelectActivateinfo: function () {
          var vm = this;
          httpStore.shopSelectActivateinfo().then(function (res) {
            vm.activateinfo = res.result;
          })
        },
        fileSaveAs: function (e) {
          e.preventDefault()
          e.stopPropagation()
          this.$httpCom.downdetailFiling({}).then(function (res) {
            saveAs(res, '备案信息表.pdf', { type: 'application/pdf;charset=utf-8' })
          })
        },
				/**
				 * 店铺激活
				 */
        activeClick: function () {
          if (!this.isActive) {
            var vm = this;
            httpStore.shopActivate().then(function (res) {
              if (res.code == 'rest.success') {
                vm.$dialog.showToast('激活成功');
                vm.shopSelectActivateinfo();
              }
            })
          }
        },
				/**
				 * 店铺资料完善
				 */
        goShopInfoClick: function () {
          if (this.activateinfo.shopCompleteFlag == '0') {
            window.location.href = 'store_set.html'
          }
        },
				/**
				 * 用户资料完善
				 */
        goUserInfoClick: function () {
          if (this.activateinfo.userCompleteFlag == '0') {
            window.location.href = '/common/usercenter/user_information.html?code=001.003.001.001'
          }
        },
				/**
				 * 身份认证
				 */
        goUserAuthClick: function () {
          if (this.activateinfo.certificationFlag !== '04') {
            window.location.href = '../usercenter/user_auth.html?code=001.003.001.002'
          }
        }
      },
      computed: {
        isActive: function () {
          return this.activateinfo.activeFlag === '1'
        },
        isDisabled: function () {
          return this.activateinfo.shopCompleteFlag === '1' && this.activateinfo.userCompleteFlag === '1' && this.activateinfo.certificationFlag === '04'
        }
      },
    });
  });
});
