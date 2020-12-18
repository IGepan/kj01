// JavaScript Document
require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpVueLoader', '/style/js/api/declaration.js', 'fileSaver', 'laydate', 'httpUrl'], 
    function ($, Vue, httpVueLoader, indexApi, fileSaver, laydate, httpUrl) {
    new Vue({
      el: '#index_box',
      data: {
        cmsUrl: httpUrl.cmsUrl,
        saasId: '',
        breadcrumb: [
          {
            label: '资讯',
            url: '/poindex.html'
          },
          {
            label: '项目申报'
          }
        ],
        activeList: [],
        policyList: [
          {
            title: '中国开拓自贸区发展新空间标题占两行位置两行位置的标.',
            summary: '2013年至今，自贸区的探索逐步推进，与“一带一路”倡议遥相呼应，成为中国在全球贸易保护主义自贸区的探索逐步推进，自贸区的探索逐步推进，与“一带一路”倡议遥相呼应',
            publishDate: '2019-05-06'
          }
        ],
        viewType: 0,
        policyGuideList: [],
        declarationList: []
      },
      filters: {
        formatTime: function (v) {
          return v ? v.split(' ')[0] : ''
        }
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'sub-head': httpVueLoader('/style/components/sub-head.vue'),
        'scroll': httpVueLoader('/style/components/scroll.vue'),
        'user-heads': httpVueLoader('/style/components/user-heads.vue'),
        'web-footer': httpVueLoader('/style/components/web_footer.vue')
      },
      created: function () {
        var id = this.$utils.getReqStr('id')
        this.saasId = localStorage.getItem('saasId');
        
        this.getAList('012', 'activeList')
        this.getPList('013', 'policyList')
        this.getPList('015', 'policyGuideList')
        // this.getDList('014', 'declarationList')
        this.getAssistant()
      },
      mounted: function () {
      },
      methods: {
        getAttributeData: function (el, keys) {
          var dataset = {}
          if (el.dataset) {
            dataset = el.dataset
          } else {
            keys.forEach(function (tkey) {
              dataset[tkey] = el.getAttribute('data-' + tkey);
            })
          }
          return dataset
        },
        getAList: function (id, dataKey) {
          var vm = this;
          indexApi.selectActiveByPage({
            columnId: id,
            saasId: this.saasId
          }).then(function (res) {
            res.result.length &&  res.result.forEach(function(item, i){
              item.poster && (item.imgUrl = item.poster.url || '')
              item.itemUrl = '/adetail.html?id=' + item.contentId
            });
            vm.$data[dataKey] = res.result
          })
        },
        getPList: function (id, dataKey) {
          var vm = this;
          indexApi.selectPolicyByPage({
            columnId: id,
            saasId: this.saasId
          }).then(function (res) {
            res.result && res.result.forEach(function(item){
              item.itemUrl = '/podetail.html?id='+item.contentId
              item.policyFileType = item.policyFileType && item.policyFileType.split(',')[0]
              item.policyFileTypeDisplay = item.policyFileTypeDisplay && item.policyFileTypeDisplay[0]
            })
            vm.$data[dataKey] = res.result || []
          })
        },
        getAssistant: function () {
          var vm = this;
          indexApi.assistantSelectByPage({ pageNum: 1, pageSize: 4 }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.list.length && res.result.list.forEach(function(item){
                item.itemUrl = '/declarationHelper/detail.html?id='+item.id
              })
              vm.$data.declarationList = res.result.list
            }
          })
        },
        // getDList: function (id, dataKey) {
        //   var vm = this;
        //   indexApi.selectDocumentByColumnCode({
        //     columnId: id,
        //     saasId: this.saasId
        //   }).then(function (res) {
        //     res.result && res.result.forEach(function(item){
        //       item.itemUrl = '/ddetail.html?id='+item.id
        //     })
        //     vm.$data[dataKey] = res.result || []
        //   })
        // },
        handleShowTips: function () {
          this.$dialog.showToast('敬请期待');
        },
        handleSetViewType: function (i) {
          this.viewType = i
        },
        handleViewHelper: function () {
          location.href = '/declarationHelper/list.html'
        },
        handleAnswer: function (e){
          location.href = '/answer/index.html'
        }
      }
    });
  })
});
