// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/qykj.js', 'laydate', 'httpUrl'],
    function ($, Vue, httpVueLoader, indexApi, laydate, httpUrl) {
      new Vue({
        el: '#index_box',
        data: {
          saasId: '',
          breadcrumb: [
            {
              label: '资讯',
              url: '/qykj.html'
            },
            {
              label: '政策精要'
            }
          ],
          recommendList: [],
          searchForm: {
            pageNum: 1,
            pageSize: 10,
            policyFileType: ["07"],
            orderBy: "publishDate-desc"
          },
          pages: '',
          policyList: []
        },

        filters: {
          formatTime: function (v) {
            return v ? v.split(' ')[0] : ''
          },
          formatTime1: function (v, t) {
            if (v) {
              v = v.split(' ')[0];
              if(v.indexOf('.')!==-1){
                v = v.split('.')
              }else if(v.indexOf('-')!==-1){
                v = v.split('-')
              }
              v.splice(1, 0, '年')
              v.splice(3, 0, '月')
              v.push('日')
              return t ? ' ~ ' + v.join('') : v.join('')
            } else {
              return ''
            }
          },
        },
        components: {
          'ly-toper': httpVueLoader('/style/components/toper.vue'),
          'sub-head': httpVueLoader('/style/components/sub-head.vue'),
          'pages': httpVueLoader('/style/components/pages.vue'),
          'web-footer': httpVueLoader('/style/components/web_footer.vue')
        },
        created: function () {
          var title = this.$utils.getReqStr('title')
          title && (this.searchForm.title = title);
          var fileType = this.$utils.getReqStr('fileType')
          fileType && (this.searchForm.policyFileType = [fileType]);
          this.saasId = localStorage.getItem('saasId');
          this.getPList('008','recommendList');
          this.getSearchList('policyList')
        },
        methods: {

          getPList: function (id, dataKey) {
            var vm = this;
            indexApi.recommendList({
              columnId: id,
              saasId: this.saasId
            }).then(function (res) {
              res.result && res.result.forEach(function(item){
                item.itemUrl = '/podetail.html?id='+item.contentId
              })
              vm.$data[dataKey] = res.result || []
            })
          },

          getSearchList: function () {
            var vm = this;
            indexApi.selectPolicyByPage(this.searchForm).then(function (res) {
              res.result && res.result.list && res.result.list.forEach(function (item) {
                item.itemUrl = '/qykjDetail.html?id=' + item.id
              });
              vm.$data["policyList"] = res.result && res.result.list || []
              res.result.isview = res.result.navigatepageNums.indexOf(res.result.pages) === -1
              vm.$data.pages = res.result || ''
            })
          },
          bindPageChange: function (e) {
            this.$data.searchForm.pageNum = e;
            this.getSearchList()
          }
        }
      });
    })
});
