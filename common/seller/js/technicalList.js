require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'dic', 'jqValidate', 'httpVueLoader', 'seller', 'jqSelect', 'addpatentKey', 'httpCom'], function ($, Vue, httpStore, httpUrl, dic, jqValidate, httpVueLoader, seller, jqSelect, addpatentKey, httpCom) {

    window.vueDom = new Vue({
      el: '#store_box',
      data: {
        activeIndex: 0,
        uploadHeader: {},
        fileUrl: httpUrl.baseUrl + '/order/downloadBill?orderId=',
        uploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
        uploadData: {
          system: 'ts'
        },
        formData: {
          pageNum: 1,
          pageSize: 5,
          categoryId: '', // 类目Id
          orderBy: '', // 排序字段
          goodsName: '', // 商品名称
          upperShelfflag: '', // 上架标识(字典表：yes_no)
          frozenFlag: '', // 冻结标识(字典表：yes_no)
          homePageFlag: '', // 首页标识(字典表：yes_no)
          roofFlag: '', // 置顶标识(字典表：yes_no)
          certificationFlag: '', // 审核结果(字典表：certification_status)
        },
        categoryList: [], // 筛选类目条件
        goodsList: [],
        chooseAllList: [],
        jquery: $,
        http: httpStore,
        code: '',
        categoryId: '',
        pages: 1,
        pageCount: 4,
        total: 0,
        httpCom: httpCom
      },
      mixins: [seller, addpatentKey],
      components: {
        'ly-upload': httpVueLoader('/common/components/upload.vue'),
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-toper': httpVueLoader(this.$pathPrefix+'/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'ly-select': httpVueLoader('/common/components/select.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      watch: {
        showed: function(val){
          return val.replace(/\;/g, '</br>');}
      },
      mounted: function () {
        var vm = this;
        vm.categoryId = this.$utils.getReqStr('categoryId');
        $(".choosesingle").on("click", function () {
          $(this).toggleClass("active");
        })
        $("#chooseall").on("click", function () {
          if (!$(this).find(".chooseall").hasClass("active")) {
            vm.chooseAllList = vm.goodsList;
            $(this).find(".chooseall").addClass("active")
            $(".sciencelist").find(".choosesingle").addClass("active");
          } else {
            vm.chooseAllList = [];
            $(this).find(".chooseall").removeClass("active")
            $(".sciencelist").find(".choosesingle").removeClass("active");
          }

        })
        $(".openclose").click(function () {
          if ($(".filter").hasClass("show")) {
            $(this).text("更多查询条件");
          } else {
            $(this).text("收起查询条件");
          }
          $(this).toggleClass("show");
          $(".filter").toggleClass("show");
        });
        this.initData();
      },
      methods: {
        formatPrice: function (flag, v, n, m) {
          if (flag == '2') {
            return '面议'
          }if(flag == "3"){
            return '查看价格详情'
          }else {
            if (typeof v !== 'undefined' ) {
              if (v >= 10000) {
                return  '￥'+((v / 10000).toFixed(2) + '万元');
              }else {
                return '￥'+ v + '元'
              }
            } else if (!v && !m ) {
              if (n >= 10000) {
                return  '￥'+((n / 10000).toFixed(2)+"万元");
              }else {
                return  '￥'+n+"元";
              }
            } else {
              if(n && m >= 10000){
                return '￥'+((n / 10000).toFixed(2) +'万元'+ '-' + (m / 10000).toFixed(2)+'万元');
              }else{
                return  '￥'+(n+"元" + '-' +m+'元')
              }

            }
          }
        },
        cutout(cellValue) {
          if (cellValue.indexOf(',') > 0) {
            return cellValue.replace(/\,/g, '</br>');
          }else {
            return cellValue;
          }

        },
        initData: function () {
          var vm = this;
          this.formData.categoryId = this.$utils.getReqStr('categoryId');
          this.code = this.$utils.getReqStr('code');
          vm.goodsSelectByPage();
          vm.categorySelectByVo();
        },
        cutout(Value) {
          return Value.replace(/\,/g, '</br>')
        },
				/**
				 * 取得当前店铺已有的所有资质证书(鉴权)
				 */
        categorySelectByVo: function () {
          var vm = this;
          httpStore.categorySelectByVo({
            id: this.$utils.getReqStr('categoryId')
          }).then(function (res) {
            vm.categoryList = res.result;
          })
        },
				/**
				 * 页码显示
				 */
        isShowPage: function (index) {
          var pageNum = this.formData.pageNum;
          var row = parseInt(pageNum / 2);
          if (row == 0 || row == 1) {
            if (1 <= index && index <= 4) {
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
				/**
				 * 是否更多
				 */
        isMore: function () {
          var pageNum = this.formData.pageNum;
          var row = parseInt(pageNum / 2);
          var index = row * 2 - 1;
          return !(index + 4 > this.pages);
        },
        resetClick: function () {
          this.formData.categoryId = ''; // 类目Id
          this.formData.orderBy = ''; // 排序字段
          this.formData.goodsName = ''; // 商品名称
          this.formData.upperShelfflag = ''; // 上架标识(字典表：yes_no)
          this.formData.frozenFlag = ''; // 冻结标识(字典表：yes_no)
          this.formData.homePageFlag = ''; // 首页标识(字典表：yes_no)
          this.formData.roofFlag = ''; // 置顶标识(字典表：yes_no)
          this.formData.certificationFlag = ''; // 审核结果(字典表：certification_status)
        },
				/**
				 * 分页
				 */
        pageClick: function (index) {
          if (index > 0 && index <= this.pages) {
            this.formData.pageNum = index;
            this.chooseAllList = [];
            $('#chooseall').find(".chooseall").removeClass("active")
            $(".sciencelist").find(".choosesingle").removeClass("active");
            this.goodsSelectByPage();
          }
        },
        goodsSelectByPage: function () {
          var vm = this;
          httpStore.goodsSelectByPage(this.formData).then(function (res) {
            if (res.code == 'rest.success') {
              vm.goodsList = res.result.list;
              vm.pages = res.result.pages;
              vm.total = res.result.total
            }
          })
        },
        upperClick: function (goods) {
          var vm = this;
          httpStore.goodsUp({
            id: goods.id,
            goodsName: goods.goodsName,
            version: goods.version
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.$dialog.showToast('上架成功');
              vm.goodsSelectByPage();
            }
          })
        },
        downClick: function (goods) {
          var vm = this;
          httpStore.goodsDown({
            id: goods.id,
            goodsName: goods.goodsName,
            version: goods.version
          }).then(function (res) {
            if (res.code == 'rest.success') {
              vm.$dialog.showToast('下架成功');
              vm.goodsSelectByPage();
            }
          })
        },
				/**
				 * 商品选中点击
				 */
        goodsChooseClick: function (goods) {
          this.$set(goods, 'active', !goods.active);
          if (goods.active) {
            this.chooseAllList.push(goods);
          } else {
            for (var key in this.chooseAllList) {
              if (this.chooseAllList[key].id == goods.id) {
                this.chooseAllList.splice(key, 1);
              }
            }
          }
        },
				/**
				 * 批量上架
				 */
        upAllClick: function () {
          var vm = this;
          if (this.chooseAllList.length) {
            httpStore.goodsUpBatch(this.chooseAllList).then(function (res) {
              if (res.code == 'rest.success') {
                vm.$dialog.showToast('上架成功');
                vm.chooseAllList = [];
                vm.goodsSelectByPage();
              }
            })
          } else {
            vm.$dialog.showToast("请选择商品");
          }
        },
				/**
				 * 批量下架
				 */
        downAllClick: function () {
          var vm = this;
          if (this.chooseAllList.length) {
            httpStore.goodsDownBatch(this.chooseAllList).then(function (res) {
              if (res.code == 'rest.success') {
                vm.$dialog.showToast('下架成功');
                vm.chooseAllList = [];
                vm.goodsSelectByPage();
              }
            })
          } else {
            vm.$dialog.showToast("请选择商品");
          }
        },
				/**
				 * 批量删除
				 */
        delAllClick: function () {
          var vm = this;
          if (this.chooseAllList.length) {
            httpStore.goodsDeleteBatch(this.chooseAllList).then(function (res) {
              if (res.code == 'rest.success') {
                var count = 0;
                var arr = [];
                for (var k in res.result) {
                  if (res.result[k].setResult === '0') {
                    arr.push(res.result[k].goodsName)
                  } else {
                    count++;
                  }
                }
                count === res.result.length ? vm.$dialog.showToast('删除成功') : vm.$dialog.showToast(arr.join(',') + '正在审核，无法删除')
                vm.goodsSelectByPage();
                vm.chooseAllList = [];
              }
            })
          } else {
            vm.$dialog.showToast("请选择商品");
          }
        },
				/**
				 * 批量展示
				 */
        showAllClick: function () {
          var vm = this;
          var inconformityGoods = []
          if (this.chooseAllList.length) {
            this.chooseAllList.forEach(function (goods) {
              if (goods.upperShelfflag === '0' || goods.certificationFlag !== '03') {
                inconformityGoods.push('<div>编号：' + goods.id + '</div>')
              }
            })
            if (!inconformityGoods.length) {
              httpStore.goodsSethomeBatch(this.chooseAllList).then(function (res) {
                if (res.code == 'rest.success') {
                  vm.$dialog.showToast('设置成功');
                  vm.chooseAllList = [];
                  vm.goodsSelectByPage();
                }
              })
            } else {
              var options = {
                title: '温馨提示',
                texts: inconformityGoods.join('') + '<div class="form-view_type centered">以上商品还未上架或未审核通过，请先处理</div>',
                buttons: [
                  {
                    label: '确认',
                    fun: function () {
                      return 1
                    }
                  }
                ]
              }
              this.$dialog.confirm2(options)
            }
          } else {
            vm.$dialog.showToast("请选择商品");
          }
        },
				/**
				 * 批量置顶
				 */
        topAllClick: function () {
          var vm = this;
          if (this.chooseAllList.length) {
            httpStore.goodsSetrootBatch(this.chooseAllList).then(function (res) {
              if (res.code == 'rest.success') {
                vm.$dialog.showToast('设置成功');
                vm.chooseAllList = [];
                vm.goodsSelectByPage();
              }
            })
          } else {
            vm.$dialog.showToast("请选择商品");
          }
        },
        handleValidateActive: function (e) {
          var vm = this
          httpStore.validateActive({}).then(function (res) {
            if (res.code == 'rest.success') {
              location.href = 'addpatent.html?code=' + vm.code + '&categoryId=' + vm.categoryId
            } else {
              var options = {
                title: '温馨提示',
                texts: '请先激活店铺！',
                buttons: ['现在就去', '稍后激活'],
                callback: function () {
                  location = vm.$pathPrefix+'/common/seller/activate.html?code=001.002.001.003'
                }
              }
              this.$dialog.confirm(options)
            }
          })
        }
      }
    });
  });
});
