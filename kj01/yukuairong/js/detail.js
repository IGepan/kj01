require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'carousel', 'jqcloud', 'httpUrl', 'dialog', 'httpUser',], function ($, Vue, dic, httpVueLoader, carousel, jqcloud, httpUrl, dialog, httpUser) {
    new Vue({
      el: '#index_box',
      data: {
        list: '',
        http: httpUser,
        isopen: false,
        isopens: false,
        listmini: {},
        isgrant: 0,
        // 附加菜单
        apendMenu: [
          {
            label: '科技大数据分析',
            uri: httpUrl.bigData
          },
          {
            label: '关于我们',
            uri: httpUrl.cmsUrl
          }
        ],
        isDisable: false,
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/style/components/header.vue'),
        'ly-footer': httpVueLoader('/style/components/web_footer.vue')
      },
      created: function () {
        this.userInfo = JSON.parse(this.$utils.getCookie('USER_INFO'));
        var id = this.$utils.getReqStr('id')
        this.getDetailList(id);
      },
      mounted: function () {
      },
      methods: {
        exitClick: function () {
          this.$utils.delCookie('USER_INFO');
          localStorage.removeItem('USER_INFO');
          window.location.href = '/common/login.html';
        },
        filter: function (ob) {
          var o = {};
          for (var k in ob) {
            if (ob[k]) {
              o[k] = ob[k];
            }
          }
          return o;
        },
        getDetailList: function (id) {
          var $vm = this;
          this.$http.post(httpUrl.datacq + 'financial/finProduct/findProductById/' + id).then(function (res) {
            $vm.list = res.data
          })
        },
        viewInfos: function () {
          var $vm = this
          $vm.isopen = true
        },
        submitApplications: function () {
          var $vm = this
          var k = this.list
          var v = $('#protocol').is(":checked")
          if (v) {
            $vm.isgrant = 1
          }
          httpUser.loanInsert({ name: k.name, bankName: k.finName, productId: k.id, isgrant: $vm.isgrant }).then(function (res) {
            if (res.code === 'rest.success') {
              $vm.$dialog.showToast('提交成功');
              $vm.isopen = false
            }
          })
        },
        getloancheckApply: function () {
          var $vm = this
          $vm.isDisable = true
          setTimeout(function () {
            httpUser.loancheckApply().then(function (res) {
              if (res.result === true) {
                $vm.submitApplications()
              } else {
                $vm.$dialog.showToast('您不是企业身份或者身份未认证，请前往认证');
              }
            })
            $vm.isDisable = false
          }, 50)
        },
        agreementInfos: function () {
          var $vm = this
          this.getlistMini()
          $vm.isopens = true
        },
        getlistMini: function () {
          var $vm = this
          this.$http.post(httpUrl.datacq + 'financing/finDepart/listMini').then(function (res) {
            $vm.listmini = res.data
          })
        }
      },
    })
  })
})
