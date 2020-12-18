require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'carousel', 'jqcloud', 'httpUrl', 'dialog'], function ($, Vue, dic, httpVueLoader, carousel, jqcloud, httpUrl, dialog) {
    new Vue({
      el: '#index_box',
      data: {
        list: [],
        formData: {
          channelType: 'WEB', //渠道，默认传WEB
          pageNum: 1, //页码
          pageSize: 8, //条数
          productTypeId: '',//产品类型id，从下面第3个接口列表获取，多个逗号隔开，用做筛选，不传默认查全部
          moneyStart: '',//贷款额度
          monthStart: '',//贷款期限
          rSort: '', //根据利率排序，从小到大传ASC，从大到小传DESC
          mSort: 'DESC',//根据额度排序，从小到大传ASC，从大到小传DESC
          mtimenumSort: '',//根据期限排序，从小到大传ASC，从大到小传DESC
          sysOrganizeId: '',//机构id，从下面第4个接口列表获取，多个逗号隔开，用做筛选，不传默认查全部
          total: 0,
          pages: 0,
        },
        filters: [
          {
            value: true,
            label: '额度排序',
            seleced: true
          },
          {
            value: false,
            label: '利率排序'
          },
          {
            value: false,
            label: '期限排序',
          }
        ],
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
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/style/components/header.vue'),
        'ly-footer': httpVueLoader('/style/components/web_footer.vue')
      },
      created: function () {
        this.userInfo = JSON.parse(this.$utils.getCookie('USER_INFO'));
        this.finProduct();
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
        finProduct: function () {
          var $vm = this;
          this.$http.post(httpUrl.datacq + 'financial/finProduct/list', this.filter(this.formData)).then(function (res) {
            if (res.code === '20000') {
              $vm.list = res.data.list
              $vm.formData.total = res.data.total
              $vm.formData.pages = Math.ceil(res.data.total / res.data.pageSize)
            } else {
              $vm.formData.total = 0
            }
          })
        },
        handleFilter: function (i) {
          if (this.filters[i].seleced) {
            if (!this.filters[i].value) {
              this.filters[i].value = true
            } else {
              this.filters[i].value = false
            }
          } else {
            this.filters = this.filters.map(function (item, index) {
              if (index === i) {
                item.seleced = true
                item.value = true
              } else {
                item.seleced = false
                item.value = false
              }
              return item
            })
          }
          if (i === 0) {
            this.formData.mSort = this.filters[i].value ? 'DESC' : 'ASC'
            this.formData.rSort = ''
            this.formData.mtimenumSort = ''
          }
          if (i === 1) {
            this.formData.rSort = this.filters[i].value ? 'ASC' : 'DESC'
            this.formData.mtimenumSort = ''
            this.formData.mSort = ''
          }
          if (i === 2) {
            this.formData.mtimenumSort = this.filters[i].value ? 'DESC' : 'ASC'
            this.formData.mSort = ''
            this.formData.rSort = ''
          }
          this.finProduct()
        },
        pageClick: function (e) {
          var index;
          if (typeof e === 'object') {
            index = Number(e.target.value);
          } else {
            index = e;
          }
          if (index > 0 && index <= this.formData.pages) {
            this.formData.pageNum = index;
            this.finProduct();
          }
        },
        isShowPage: function (index) {
          var pageNum = this.formData.pageNum;
          var row = parseInt(pageNum / 2);
          if (row == 0 || row == 1) {
            if (1 <= index && index <= 6) {
              return true;
            } else {
              return false;
            }
          } else {
            if (row * 2 - 1 <= index && index <= row * 2 + 2) {
              return true;
            } else {
              return false;
            }
          }
        },
      },
    })
  })
})
