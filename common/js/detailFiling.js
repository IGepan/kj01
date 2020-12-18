var baseUrlPath = location.origin
require([baseUrlPath + '/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'httpCom', 'dialog'], function ($, Vue, dic, httpVueLoader, httpOrderApi, httpCom, dialog) {
    Vue.component('ly-searchbox', httpVueLoader('/style/components/searchbox.vue'))
    new Vue({
      el: '#index_box',
      data: {
        detailInfo: {
          name: ''
        },
        httpCom: httpCom
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/orderHeader.vue'),
        'ly-footer': httpVueLoader('/style/components/main_footer.vue')
      },
      created: function () {
        this.getOrderInfo(this.$utils.getReqStr('userId'))
      },
      methods: {
        getOrderInfo: function (id) {
          var vm = this
          this.$httpCom.detailFiling({ userId: id }).then(function (res) {
            if (res.code == 'rest.success') {
              var result = res.result
              result.identityTypes = [
                {
                  display: "企业"
                },
                {
                  display: "科研究所"
                },
                {
                  display: "高校"
                },
                {
                  display: "行业组织"
                },
                {
                  display: "其他"
                }
              ]
              result.scales = [
                {
                  display: "20人以下"
                },
                {
                  display: "20-300人"
                },
                {
                  display: "300-1000人"
                },
                {
                  display: "1000人以上"
                }
              ]
              result.scaleTypes = [
                {
                  display: "大型企业"
                },
                {
                  display: "中型企业"
                },
                {
                  display: "小型企业"
                }
              ]
              switch (result.identityType) {
                case '01':
                  result.identityTypes[4].selected = true
                  break;
                case '02':
                  result.identityTypes[0].selected = true
                  break;
                case '03':
                  result.identityTypes[2].selected = true
                  break;
                case '04':
                  result.identityTypes[1].selected = true
                  break;
                case '05':
                  result.identityTypes[3].selected = true
                  break;
              }
              switch (result.scale) {
                case '01':
                  result.scales[0].selected = result.scaleTypes[2].selected = true
                  break;
                case '02':
                  result.scales[1].selected = result.scaleTypes[2].selected = true
                  break;
                case '03':
                  result.scales[2].selected = result.scaleTypes[1].selected = true
                  break;
                case '04':
                  result.scales[3].selected = result.scaleTypes[0].selected = true
                  break;
              }
              vm.$data.detailInfo = result
            }
          })
        }
      }
    })
  })
})
