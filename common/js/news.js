require(['js/require.config'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'carousel', 'jqcloud', 'httpCms', 'httpUrl', 'httpIndex', 'dialog'], function ($, Vue, dic, httpVueLoader, carousel, jqcloud, httpCms, httpUrl, httpIndex, dialog) {
    new Vue({
      el: '#index_box',
      data: {
        httpUrl: httpUrl,
        userInfo: undefined
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-mianmenu': httpVueLoader('/style/components/mianmenu.vue'),
        'ly-footer': httpVueLoader('/style/components/main_footer.vue')
      },
      created: function () {
        var vm = this
        this.$utils.getCookie(dic.locaKey.USER_INFO) && (this.userInfo = JSON.parse(localStorage.getItem(dic.locaKey.USER_INFO)))
        this.$nextTick(function () {
          // 注册接收回调信息
          window.addEventListener("message", function (event) {
            vm.$refs.jsNewsIframe.height = event.data + 'px'
            console.log(vm, event)
          });
        })
      },
      mounted: function () { },
      methods: {
        exitClick: function () {
          this.$utils.delCookie('USER_INFO');
          this.$utils.delCookie('LOGIN_INFO');
          localStorage.removeItem('USER_INFO');
          localStorage.removeItem('saasId');
          window.location.href = '/common/login.html';
        },
        // 发送消息到Iframe 请求回调高度信息
        reinitIframe: function () {
          this.$refs.jsNewsIframe.contentWindow.postMessage(location.origin, vm.httpUrl.cmsUrl)
        }
      },
    })
  })
})
