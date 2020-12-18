// JavaScript Document

require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom'], function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom) {


    Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
    Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
    Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
    Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));

    window.vueDom = new Vue({
      el: '#index_box',
      mixins: [userCenter],
      data: {
        httpCom: httpCom,
        jquery: $,
        http: httpUser,
        list: [],
        activeIndex: 0,
        isAll: false,
        userInfo: {},
        page: 1,
        pageSize: 20,
        totalPage: 1,
        sels: [],
        sysUnread: '',
        busUnread: ''
      },
      provide: {
        httpUser: httpUser,
        httpUrl: httpUrl
      },
      created: function () {
        this.userInfo = JSON.parse(this.$utils.getCookie('USER_INFO')) || {};
        this.getMessageApi();
      },
      components: {
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'header-bar': httpVueLoader('/common/components/header.vue'),
        'ly-page': httpVueLoader('/common/components/pages.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      methods: {
        selAll: function () {
          var $this = this, ob = [];
          this.isAll = !this.isAll;
          this.list.forEach(function (d) {
            if (!d.picked) {
              ob.push(d);
            }
            $this.$set(d, 'picked', $this.isAll);
          });
          this.isAll ? this.sels = this.sels.concat(ob) : this.removeAll(this.list);
        },
        getInfo: function (i) {
          if (i === this.activeIndex) return;
          this.activeIndex = i;
        },
        indexOf: function (ar, v, key) {
          for (var i = 0, l = ar.length;i < l;i++) {
            if (ar[i][key] === v) {
              return i;
            }
          }
          return -1;
        },
        removeAll: function (ob) {
          for (var i = this.sels.length - 1;i >= 0;i--) {
            if (this.indexOf(ob, this.sels[i].id, 'id') > -1) {
              this.sels.splice(i, 1);
            }
          }
        },
        addSel: function (k) {
          if (this.indexOf(this.sels, k.id, 'id') === -1) {
            this.sels.push(k);
          }
        },
        removeSel: function (k) {
          var index = this.indexOf(this.sels, k.id, 'id');
          index > -1 && this.sels.splice(index, 1);
        },
        updateIsAll: function () {
          for (var i = 0, l = this.list.length;i < l;i++) {
            if (!this.list[i].picked) {
              return false;
            }
          }
          return true;
        },
        pick: function (k) {
          !k.picked ? this.addSel(k) : this.removeSel(k);
          if (k.readFlag === '0') {
            this.readMessageApi(k.msgContentDtlId);
          }
          this.$set(k, 'picked', !k.picked);
          this.$set(k, 'readFlag', '1');
          this.isAll = k.picked ? this.updateIsAll() : false;
        },
        expand: function (k) {
          k.expanded = !k.expanded;
        },
        setReaded: function () {
          if (this.sels.length < 1) {
            $dialog.showToast('请先选择');
          } else {
            var ids = [];
            this.sels.forEach(function (d) {
              if (d.readFlag === '0') {
                ids.push(d.msgContentDtlId);
              }
            });
            ids.length && this.readMessageApi(ids.join(','));
          }
        },
        delAll: function () {
          if (this.sels.length < 1) {
            $dialog.showToast('请先选择');
          } else {
            var ids = [];
            this.sels.forEach(function (d) {
              ids.push(d.id);
            });
            this.delMessageApi(ids.join(','));
          }
        },
        updateSel: function () {
          var $this = this;
          var n = 0;
          this.list.forEach(function (d) {
            if ($this.indexOf($this.sels, d.id, 'id') > -1) {
              n++;
              $this.$set(d, 'picked', true);
            }
          });
          if (this.list.length > 0) {
            this.isAll = n === this.list.length;
          }
        },
        getMessageApi: function (page) {
          var $this = this;
          page = page || this.page;
          this.$http.post(httpUrl.baseUrl + '/msg/selectByPage', { userId: this.userInfo.userId, pageNum: page, pageSize: this.pageSize }).then(function (res) {
            if (res.code === 'rest.success') {
              $this.list = res.result.list;
              $this.totalPage = res.result.pages;
              $this.list.length > 0 && $this.$nextTick(function () {
                $this.$refs.txt.forEach(function (d, i) {
                  if (d.offsetHeight > 38) {
                    $this.$set($this.list[i], 'isExpand', true);
                    $this.$set($this.list[i], 'expanded', true);
                  }
                  $this.$set($this.list[i], 'isHidden', true);
                });
              });
              $this.updateSel();
            }
          });
          $this.noReadMessageApi();
        },
        noReadMessageApi: function () {
          var $this = this;
          this.$http.post(httpUrl.baseUrl + '/msg/lastSta', { userId: this.userInfo.userId }).then(function (res) {
            if (res.code === 'rest.success') {
              $this.sysUnread = res.result.notReadCount;
            }
          });
        },
        readMessageApi: function (ids) {
          var $this = this;
          this.$http.get(httpUrl.baseUrl + '/msg/setReadedBatchByIds', { ids: ids }).then(function (res) {
            $this.noReadMessageApi();
            $this.getMessageApi();
          });
        },
        delMessageApi: function (ids) {
          var $this = this;
          this.$http.get(httpUrl.baseUrl + '/msg/deleteBatchByIds', { ids: ids }).then(function (res) {
            $this.getMessageApi();
          });
        },
        delMess: function (k) {
          this.delMessageApi(k.id);
        }
      },
    });
  });
});
