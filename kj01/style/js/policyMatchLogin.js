require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpUser'],
    function ($, Vue, dic, httpVueLoader,  httpUser) {
      new Vue({
        el: '#matchLogin_box',
				components: {
					'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue'),
          'policymatch-head': httpVueLoader('/style/components/policyMatch_head.vue'),
				},        
				data() {
          return {
            companyList: [],
            userInfo: {},
          }
        },
        created() {
          var _this = this;
          this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
          httpUser.detail().then(function (res) {
            _this.companyList.push({name: res.result.organizationName, isCheck: true})
          });
        }
      })
    })
});
