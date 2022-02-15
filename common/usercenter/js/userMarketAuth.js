// JavaScript Document

require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'dic', 'httpVueLoader', 'userCenter', 'httpUser', 'jqValidate', 'httpUrl', 'jqSelect', 'httpCom', './userCenterApi/userCenterMarketTechAPI.js'],
    function ($, Vue, dic, httpVueLoader, userCenter, httpUser, jqValidate, httpUrl, jqSelect, httpCom, userSchoolApi) {


      Vue.component('ly-select', httpVueLoader('/common/components/select.vue'));
      Vue.component('ly-radio', httpVueLoader('/common/components/radio.vue'));
      Vue.component('ly-address-select', httpVueLoader('/common/components/addressSelect.vue'));
      Vue.component('ly-upload', httpVueLoader('/common/components/upload.vue'));
      Vue.component('user-tech-menu', httpVueLoader('/common/components/userTechMenu.vue'));

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
          busUnread: '',



          checkipt: "",
          props: { multiple: true },



          "secondOptions": [],
          "thirdOptions": [],
          "thirdShow": false,
          "secondShow": false,
          "firstShow": false,
          "active": false,
          "textList": [],

          options: [{
            value: 'zhinan',
            label: '指南',


            children: [{
              value: 'shejiyuanze',
              label: '设计原则',
              children: [{
                value: 'yizhi',
                label: '一致'
              }, {
                value: 'fankui',
                label: '反馈'
              }, {
                value: 'xiaolv',
                label: '效率'
              }, {
                value: 'kekong',
                label: '可控'
              }]
            }, {
              value: 'daohang',
              label: '导航',
              children: [{
                value: 'cexiangdaohang',
                label: '侧向导航'
              }, {
                value: 'dingbudaohang',
                label: '顶部导航'
              }]
            }]
          }, {
            value: 'zujian',
            label: '组件',
            children: [{
              value: 'basic',
              label: 'Basic',
              children: [{
                value: 'layout',
                label: 'Layout 布局'
              }, {
                value: 'color',
                label: 'Color 色彩'
              }, {
                value: 'typography',
                label: 'Typography 字体'
              }, {
                value: 'icon',
                label: 'Icon 图标'
              }, {
                value: 'button',
                label: 'Button 按钮'
              }]
            }, {
              value: 'form',
              label: 'Form',
              children: [{
                value: 'switch',
                label: 'Switch 开关'
              }, {
                value: 'slider',
                label: 'Slider 滑块'
              }, {
                value: 'time-picker',
                label: 'TimePicker 时间选择器'
              }, {
                value: 'date-picker',
                label: 'DatePicker 日期选择器'
              }, {
                value: 'datetime-picker',
                label: 'DateTimePicker 日期时间选择器'
              }, {
                value: 'upload',
                label: 'Upload 上传'
              }, {
                value: 'rate',
                label: 'Rate 评分'
              }, {
                value: 'form',
                label: 'Form 表单'
              }]
            }, {
              value: 'data',
              label: 'Data',
              children: [{
                value: 'table',
                label: 'Table 表格'
              }, {
                value: 'tag',
                label: 'Tag 标签'
              }, {
                value: 'progress',
                label: 'Progress 进度条'
              }, {
                value: 'tree',
                label: 'Tree 树形控件'
              }, {
                value: 'pagination',
                label: 'Pagination 分页'
              }, {
                value: 'badge',
                label: 'Badge 标记'
              }]
            }]
          }, {
            value: 'ziyuan',
            label: '资源',
            children: [{
              value: 'axure',
              label: ' Components'
            }, {
              value: 'sketch',
              label: ' Templates'
            }, {
              value: 'jiaohu',
              label: '组件交互文档'
            }]
          }]
        },
        provide: {
          httpUser: httpUser,
          httpUrl: httpUrl
        },
        created: function () {
          this.userInfo = JSON.parse(this.$utils.getCookie('USER_INFO')) || {};
          this.getMessageApi();
          this.checkUserMarketPart('jishurenzheng');

        },
        components: {
          'ly-toper': httpVueLoader(this.$pathPrefix + '/style/components/toper.vue'),
          'header-bar': httpVueLoader('/common/components/header.vue'),
          'ly-page': httpVueLoader('/common/components/pages.vue'),
          'ly-minifooter': httpVueLoader('/style/components/other_footer.vue'),
          'user-tech-menu': httpVueLoader('/common/components/userTechMenu.vue')
        },
        methods: {
          // 打开菜单
          openMenuList: function () {
            // console.log("112")
            var _this = this;
            _this.firstShow = true;
            _this.secondShow = true;
            _this.thirdShow = false;
            _this.secondOptions = "";
            _this.thirdOptions = "";

            for (let i = 0; i < _this.options.length; i++) {
              const element = _this.options[i];
              _this.openFirstLevel(_this.options[0], 0)
            }

          },
          // 打开第一层目录
          openFirstLevel: function (item, index) {
            console.log(item)
            var _this = this;
            _this.thirdShow = false;
            _this.thirdOptions = "";
            _this.secondOptions = item.children
            _this.secondShow = true;

            _this.options.forEach(function (item, i) {
              // console.log(item)
              item.active = false;
              if (index === i) {
                item.active = true;
              }
            })
          },

          // 选择第三级目录
          openThirdLevel: function (item) {
            // console.log(item)
            var _this = this;
            if (_this.textList.indexOf(item.label) === -1) {
              _this.textList.push(item);
            } else {
              _this.textList.splice(_this.textList.indexOf(item.label), 1);
            }
            if (_this.textList.length == 6) {
              _this.firstShow = false;
              _this.secondShow = false;

              _this.$dialog.showToast("最多选择5项!");

              _this.textList.splice(5);
            }
            console.log(_this.textList)

          },
          // 移除单个
          removeSingle: function (index) {
            var _this = this;
            _this.textList.splice(index, 1);
            _this.firstShow = false;
            _this.secondShow = false;
            console.log(_this.textList)
          },
          // 关闭
          closeAllLevel: function () {
            var _this = this;
            _this.firstShow = false;
          },



          turnPageClassSign: function () {
            console.log(httpUrl.baseSchoolOutUrl + '/uc/myClass')
            var userPhone = localStorage.getItem("userPhone");
            if (null == userPhone && "" == userPhone || undefined == userPhone) {
              window.location.href = '/common/login.html';
            }
            userSchoolApi.turn_page_class_sign_1();
            window.open(httpUrl.baseSchoolOutUrl + "/uc/index");
          },



          // 点击事件
          checkUserMarketPart: function (pageName) {
            console.log(pageName)
            console.log(pageName)
          },

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
            for (var i = 0, l = ar.length; i < l; i++) {
              if (ar[i][key] === v) {
                return i;
              }
            }
            return -1;
          },
          removeAll: function (ob) {
            for (var i = this.sels.length - 1; i >= 0; i--) {
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
            for (var i = 0, l = this.list.length; i < l; i++) {
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
