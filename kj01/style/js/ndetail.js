// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/polist.js', 'laydate', 'httpUrl'], 
    function ($, Vue, httpVueLoader, indexApi, laydate, httpUrl) {
    new Vue({
      el: '#index_box',
      data: {
        saasId: '',
        breadcrumb: [
          {
            label: '资讯',
            url: '/poindex.html'
          },
          {
            label: '科技动态',
            url: '/news.html'
          },
          {
            label: '详情'
          }
        ]
      },
      filters: {
        formatTime: function (v) {
          return v ? v.split(' ')[0] : ''
        }
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'sub-head': httpVueLoader('/style/components/sub-head.vue'),
        'web-footer': httpVueLoader('/style/components/web_footer.vue')
      },
      created: function () {},
      methods: {
        handleShareToWeixin: function () {
          var vm = this;
          var options = {
            title: '二维码',
            width: '400px',
            texts: '<div style="text-align: center;padding: 10px;"><img src="'+ httpUrl.baseUrl + '/wxApp/policy/getPolicyQRCodeById?id='+ this.detail.id +'" alt="" srcset=""></div>',
            buttons: []
          };
            vm.$dialog.confirm2(options)
          // indexApi.getPolicyQRCodeById({id: this.detail.id}).then(function (res) {
          //   console.log(res)
            
          // })
        },
        handleShareToQQ: function () {
          var url = "https://connect.qq.com/widget/shareqq/index.html";
          var title = '精品政策-易智网';
          var summary = this.detail.title;
          var desc = this.detail.title;
          var fullUrl = [url, '?url=', encodeURIComponent(document.location.href), '&title=',  title, '&summary=', summary, '&desc=', desc].join('');
          window.open(fullUrl)
        }
      }
    });
  })
});
