require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'jqValidate', 'httpVueLoader', 'seller', 'jqSelect', 'addpatentKey', 'httpCom', 'httpDemandApi'], function ($, Vue, httpStore, httpUrl, dic, jqValidate, httpVueLoader, seller, jqSelect, addpatentKey, httpCom, httpDemandApi) {

    window.vueDom = new Vue({
      el: '#store_box',
      data: {
        formData: {},
        searchData: {
          bidStatus: '',
          demandType: ''
        },
        options: {
          'demand_status': [],
          'demand_type': []
        },
        searchList: [],
        jquery: $,
        page: 1,
        pageSize: 20,
        totalPage: 1,
        http: httpStore,
        httpCom: httpCom
      },
      mixins: [seller, addpatentKey],
      components: {
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'ly-page': httpVueLoader('/common/components/pages.vue'),
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      created: function () {
        this.getOptions([
          { "code": "demand_type" },
          { 'code': 'bid_status' }
        ]);
        this.searchPage();
      },
      mounted: function () {
        var $this = this;
        var start = laydate.render({
          elem: '#timeStart',
          showBottom: true,
          format: 'yyyy-MM-dd HH:mm:ss',
          done: function (value, date, endDate) { //选择日期完毕的回调
            if (value !== '') {
              $this.searchData.createDateTo = value;
              date.month = date.month - 1;
              date.date = date.date + 1;
              end.config.min = date;
              end.config.elem[0].focus();
            }
          }
        });
        var end = laydate.render({
          elem: '#timeEnd',
          showBottom: true,
          format: 'yyyy-MM-dd HH:mm:ss',
          done: function (value, date, endDate) { //选择日期完毕的回调
            if (value !== '') {
              $this.searchData.createDateForm = value;
              date.month = date.month - 1;
              date.date = date.date - 1;
              start.config.max = date;
            }
          }
        });
      },
      methods: {
        getOptions: function (keys) {
          var vm = this
          httpCom.dictList({ dictInfos: keys }).then(function (res) {
            if (res.code === 'rest.success') {
              res.result.forEach(function (codes) {
                codes.dictIInfos.unshift({ id: '-1', value: '', display: "不限" })
                vm.options[codes.code] = codes.dictIInfos
              })
            }
          })
        },
        searchPage: function (page) {
          if (this.searchDisable) return;
          var $this = this;
          this.searchData.pageNum = page || this.page;
          this.searchData.pageSize = this.pageSize;
          this.searchDisable = true;
          httpDemandApi.myBidByPage($.extend({}, this.searchData)).then(function (res) {
            if (res.code === 'rest.success') {
              $this.searchList = res.result.list;
              $this.totalPage = res.result.pages;
            }
            $this.searchDisable = false;
          }).catch(function () {
            $this.searchDisable = false;
          });
        }
      }
    });
  });
});
