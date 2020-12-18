require(['/common/js/require.config.js'], function () {
  require(['jquery', 'vue', 'httpStore', 'httpUrl', 'httpLogin', 'dic', 'jqValidate', 'httpVueLoader', 'seller', 'jqSelect', 'addpatentKey', 'httpCom'], function ($, Vue, httpStore, httpUrl, httpLogin, dic, jqValidate, httpVueLoader, seller, jqSelect, addpatentKey, httpCom) {

    Vue.component('vue-ueditor-wrap', VueUeditorWrap)
    window.vueDom = new Vue({
      el: '#store_box',
      data: {
        isConference: true,
        platform: '',
        activeIndex: 0,
        uploadHeader: {},
        isShowMap: false,
        isSubmitDisabled: false,
        uploadUrl: httpUrl.imgUploadUrl + "/file/resource/upload",
        fileUploadUrl: httpUrl.imgUploadUrl + "/file/upload",
        uploadData: {
          system: 'ts'
        },
        isAddAttr: false,
        copyFormData: {}, // 用于数据重置
        formData: {
          id: '',
          field: [], // 领域
          industry: [], // 行业
          saasId: '', // 'saasId'
          shopId: '', // 店铺Id
          goodsName: '', // 商品名称
          categoryId: '', // 类目id
          keyWord: '', // 关键字
          price: '', // 价格
          minPrice: '', // 价格区间下限
          maxPrice: '', // 价格区间上限
          payMode: ['001'], // 支付方式
          negotiableFlag:'',//面议
          stock: '',
          servicePromise: ['001', '002'], // 服务承诺
          transactionMode: '', // 转让方式
          additionalList: [], // 附加属性
          valueList: [], // 属性集合
          attachmentList: [],
          customValueList: [], // 自定义属性集合
          tagList: [], // 标签属性
          goodsIntroduce: '', // 商品介绍
          goodsSample: '', // 案例
          aptitude: '', // 资质
          minus_stock: '001',
        },
        afterSaleServiceList: [], // 售后服务
        controlType: dic.controlType,
        valueList: {}, // 动态表单数据
        industrySelectList: [], // 行业
        servicePromiseList: [], // 服务承诺
        fieldList: [], // 领域
        categoryList: [],
        industryList: [],
        mainPhotoList: [],
        // defaultImg: ['',
        //   {
        //     '82515756322918001': {
        //       id: "148733516278926088"
        //     },
        //     '82779184723660404': {
        //       id: "148733665306741513"
        //     },
        //     '82779184723660405': {
        //       id: "148733779882543882"
        //     },
        //     '82779184723660406': {
        //       id: "148733889878166283"
        //     },
        //     '82779184723660407': {
        //       id: "148734031918271244"
        //     },
        //     '82779310439534200': {
        //       id: "148732418445019911"
        //     },
        //     '82779310439534201': {
        //       id: "148732346151996166"
        //     },
        //     '84244636343734150': {
        //       id: "148795702498036523"
        //     },
        //     '84244636343734151': {
        //       id: "148795841346276140"
        //     }
        //   },
        //   {
        //     '82515756322918001': {
        //       id: "148735430827704879"
        //     },
        //     '82779184723660404': {
        //       id: "148735532803818032"
        //     },
        //     '82779184723660405': {
        //       id: "148735600072065585"
        //     },
        //     '82779184723660406': {
        //       id: "148735706578027058"
        //     },
        //     '82779184723660407': {
        //       id: "148735812995908147"
        //     },
        //     '82779310439534200': {
        //       id: "148735333687624238"
        //     },
        //     '82779310439534201': {
        //       id: "148734890643292717"
        //     },
        //     '84244636343734150': {
        //       id: "148796185950290484"
        //     },
        //     '84244636343734151': {
        //       id: "148796259887481397"
        //     }
        //   }
        // ],
        mainVideoList: [], // 主图视频
        goodsVideoList: [], // 商品视频
        techValList: [], // 技术视频
        matureList: [], // 成熟度证明材料
        secrecyList: [], // 资料附件
        videoList: [], // 视频附件
        dynamicFormList: [], // 动态表单
        valueHiddenList: {
          '83244102086299620': 1,
          '83244102086299621': 1
        }, // 动态表单值隐藏部分（软著信息权利获得方式处理）
        jquery: $,
        http: httpStore,
        minus_stock: [],
        customName: '', // 自定义属性名输入框
        keywordVal: '',
        httpCom: httpCom, // 关键字,
        protocol: false,
        isFixed: false,
        isPriceDisabled: false,
        ismmPriceDisabled: false,
        imgOption: {
          size: "470,380",
          prev: "shopLogo",
          url: this.httpUrl.imgUploadUrl + '/file/resource/uploadImg'
        },
        imgBtnTitle: '增加'
      },
      mixins: [seller, addpatentKey],
      components: {
        'ly-upload': httpVueLoader('/common/components/upload.vue'),
        'seller-left': httpVueLoader('/common/components/sellerLeft.vue'),
        'ly-toper': httpVueLoader('/style/components/toper.vue'),
        'ly-header': httpVueLoader('/common/components/header.vue'),
        'ly-select': httpVueLoader('/common/components/select.vue'),
        'ly-form-time': httpVueLoader('./components/technology/formTime.vue'),
        'ly-mulselect': httpVueLoader('./components/technology/mulSelect.vue'),
        'ly-code-mulselect': httpVueLoader('/common/components/mulCodeSelect.vue'),
        'ly-address-select': httpVueLoader('./components/technology/addressSelect.vue'),
        'ly-select-level': httpVueLoader('/common/components/selectLevel.vue'),
        'address-map': httpVueLoader('/common/components/addressMap.vue'),
        'img-uploader': httpVueLoader('/common/components/imgUploader.vue'),
        'ly-minifooter': httpVueLoader('/style/components/other_footer.vue')
      },
      computed: {
        keyWordList: function () {
          if (!this.formData.keyWord || this.formData.keyWord == '') {
            return [];
          } else {
            return this.formData.keyWord.split(",");
          }
        }
      },
      mounted: function () {
        var vm = this;
        this.platform = this.isConference ? '易智网' : '成渝城市群综合科技'
        this.copyFormData = JSON.parse(JSON.stringify(this.formData));
        vm.initData();
      },
      methods: {
        faceChange:function(e){
          if(this.formData.negotiableFlag){
            this.formData.price='0';
            this.formData.minPrice='';
            this.formData.maxPrice='';
            this.isPriceDisabled = true;
            this.ismmPriceDisabled = true
          }else{
            this.isPriceDisabled = false;
            this.ismmPriceDisabled = false
          }
        },
        scrollSSS: function () {
          var vm = this;
          setTimeout(function () {
            var tp = $('.setform').offset().top;
            var cc = $('.addexperience');
            function setActive (tp) {
              $('.setbar span').removeClass('active');
              for (var i = 0, l = cc.length;i < l;i++) {
                var m = cc.eq(i).offset().top - 48;
                if (i < l - 1) {
                  if (i === 0 && tp < m) {
                    $('.setbar span').eq(i).addClass('active');
                    break;
                  } else if (tp >= m && tp < cc.eq(i + 1).offset().top - 48) {
                    $('.setbar span').eq(i).addClass('active');
                    break;
                  }
                } else {
                  $('.setbar span').eq(i).addClass('active');
                }
              }
            }
            var $_scroll = function (wait, fn) {
              var tid = 0;
              var cur, last = new Date();
              return function () {
                cur = new Date();
                clearTimeout(tid);
                if (cur - last >= wait) {
                  fn();
                  last = cur;
                } else {
                  tid = setTimeout(fn, wait);
                }
              };
            };
            $(window).scroll($_scroll(100, function () {
              var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
              if (scrolltop >= tp) {
                if (!vm.isFixed) {
                  vm.$set(vm, 'isFixed', true);
                  $('.setform').css('padding-top', '48px');
                }
              } else {
                if (vm.isFixed) {
                  vm.$set(vm, 'isFixed', false);
                  $('.setform').css('padding-top', '0');
                }
              }
              !vm._isClick && setActive(scrolltop);
            }));
            $('.setbar span').each(function (i, d) {
              $(this).click(function () {
                $('.setbar span').removeClass('active');
                $(this).addClass('active');
                vm._isClick = true;
                var stp = $('.addexperience').eq(i).offset().top - 50;
                if (i === 0) {
                  stp -= 50;
                }
                $('body,html').animate({
                  scrollTop: stp
                }, 200, function () {
                  setTimeout(function () {
                    vm._isClick = false;
                  }, 120);
                });
              });
            });
            $('html,body').scrollTop(0);
          }, 60);
        },
				/**
				 * 初始化数据
				 */
        initData: function () {
          var vm = this;
          vm.categorySelectByVo();
          vm.categorytplSelect();
          // 编辑
          if (this.formData.id) {
            httpStore.goodsDetail({
              id: this.formData.id
            }).then(function (res) {
              vm.formData = $.extend(vm.formData, res.result);
              vm.formData.negotiableFlag = vm.formData.negotiableFlag==='1'?true:false;
              if(vm.formData.negotiableFlag){
                vm.isPriceDisabled = true;
                vm.ismmPriceDisabled = true
              }else{
                vm.isPriceDisabled = false;
                vm.ismmPriceDisabled = false
              }
              vm.formData.price = (vm.formData.skuList[0].price||vm.formData.skuList[0].price===0)?vm.formData.skuList[0].price:'';
              vm.formData.minPrice = (vm.formData.skuList[0].minPrice||vm.formData.skuList[0].minPrice===0)?vm.formData.skuList[0].minPrice:'';
              vm.formData.maxPrice = (vm.formData.skuList[0].maxPrice||vm.formData.skuList[0].maxPrice===0)?vm.formData.skuList[0].maxPrice:'';
              // 初始化动态表单值
              for (var it of vm.formData.valueList) {
                // 存在拼接数据
                if (vm.valueList[it.specId]) {
                  if (vm.valueList[it.specId] instanceof Array) {
                    vm.valueList[it.specId].push(it);
                  } else {
                    vm.valueList[it.specId] = [vm.valueList[it.specId], it.specValue];
                  }
                } else {
                  vm.valueList[it.specId] = it.specValue;
                }

              }


              // 初始化标签属性
              for (var it of vm.formData.tagList) {
                // 行业
                if (it.tagType === '01' || it.tagType === '03') {
                  vm.formData.industry.push({
                    tagId: it.tagId,
                    tagType: it.tagType,
                    name: it.tagName
                  });
                  // 领域
                } else if (it.tagType == '02' || it.tagType === '04') {
                  vm.formData.field.push({
                    tagId: it.tagId,
                    tagType: it.tagType,
                    name: it.tagName
                  });
                }
              }
              // 初始化附加属性
              var addressArray = [];
              vm.formData.payMode = [];
              for (var it of vm.formData.additionalList) {
                // 支付方式
                if (it.serviceType == dic.goods_service_type.pay_mode) {
                  vm.formData.payMode.push(it.serviceCode);
                  // 转让方式
                } else if (it.serviceType == dic.goods_service_type.transaction_mode) {
                  vm.formData.transactionMode = it.serviceCode;
                  // 售后
                } else if (it.serviceType == dic.goods_service_type.after_sale_service) {
                  vm.afterSaleServiceList.push(it.serviceCode);
                  // 服务承诺
                } else if (it.serviceType == dic.goods_service_type.service_promise && it.serviceCode !== '001' && it.serviceCode !== '002') {
                  vm.formData.servicePromise.push(it.serviceCode);
                  // 国家
                } else if (it.serviceType == dic.goods_service_type.administrative_division1) {
                  addressArray[0] = it.serviceCode;
                  // 省份
                } else if (it.serviceType == dic.goods_service_type.administrative_division2) {
                  addressArray[1] = it.serviceCode;
                  // 城市
                } else if (it.serviceType == dic.goods_service_type.administrative_division3) {
                  addressArray[2] = it.serviceCode;
                  // 区县
                } else if (it.serviceType == dic.goods_service_type.administrative_division4) {
                  addressArray[3] = it.serviceCode;
                } else if (it.serviceType === '010') {
                  // 库存计数
                  vm.formData.minus_stock = it.serviceCode
                }
              }
              vm.valueList['83244102086299620'] && (vm.valueHiddenList['83244102086299620'] = 0)
              vm.valueList['83244102086299621'] && (vm.valueHiddenList['83244102086299621'] = 0)

              vm.formData.stock = res.result.skuList[0].stock || ''
              // 初始化附件
              for (var it of vm.formData.attachmentList) {
                // 主图
                if (it.attachmentType == dic.attachmentType.main) {
                  vm.mainPhotoList.push({
                    id: it.fileInfoView.id,
                    url: it.fileInfoView.url,
                    attachmentType: it.attachmentType
                  })
                  $('#mainPhoto').text('')
                  // 主图视频
                } else if (it.attachmentType == dic.attachmentType.mainVideo) {
                  vm.mainVideoList.push({
                    id: it.fileInfoView.id,
                    url: it.fileInfoView.url,
                    name: it.fileInfoView.name,
                    attachmentType: it.attachmentType
                  })
                  // 技术视频
                } else if (it.attachmentType == dic.attachmentType.techVal) {
                  vm.techValList.push({
                    id: it.fileInfoView.id,
                    url: it.fileInfoView.url,
                    name: it.fileInfoView.name,
                    attachmentType: it.attachmentType
                  })
                  // 成熟度
                } else if (it.attachmentType == dic.attachmentType.mature) {
                  vm.matureList.push({
                    id: it.fileInfoView.id,
                    url: it.fileInfoView.url,
                    name: it.fileInfoView.name,
                    attachmentType: it.attachmentType
                  })
                  // 商品视频
                } else if (it.attachmentType == dic.attachmentType.goodsVideo) {
                  vm.goodsVideoList.push({
                    id: it.fileInfoView.id,
                    url: it.fileInfoView.url,
                    name: it.fileInfoView.name,
                    attachmentType: it.attachmentType
                  })
                  // 资料附件
                } else if (it.attachmentType == dic.attachmentType.secrecy) {
                  vm.secrecyList.push({
                    id: it.fileInfoView.id,
                    url: it.fileInfoView.url,
                    name: it.fileInfoView.name,
                    attachmentType: it.attachmentType
                  })
                  // 视频附件
                } else if (it.attachmentType == dic.attachmentType.video) {
                  vm.videoList.push({
                    id: it.fileInfoView.id,
                    url: it.fileInfoView.url,
                    name: it.fileInfoView.name,
                    attachmentType: it.attachmentType
                  })
                }
              }
              if (vm.isFw) {
                vm.initFwData();
              }
              setTimeout(function () {
                vm.$nextTick(function () {
                  if (vm.$refs.addressRef && vm.$refs.addressRef[0]) {
                    vm.$refs.addressRef[0].setValues(addressArray);
                  }
                  vm.$set(vm, 'afterSaleServiceList', vm.afterSaleServiceList)
                })
              }, 500)
            })
          } else {
            if (vm.isFw) {
              vm.initFwData();
            }
          }
        },
				/**
				 * 初始化服务数据
				 */
        initFwData: function () {
          var vm = this;
          httpStore.servicesSelect().then(function (res) {
            vm.fieldList = res.result;
            setTimeout(function () {
              vm.fieldSel = $("#field").mySelect({
                mult: true, //true为多选,false为单选
                option: vm.fieldList,
                onChange: function (vals) { //选择框值变化返回结果
                  vm.formData.field = vals;
                }
              })
              vm.fieldSel.setResult(vm.formData.field);
            }, 200)
          })
          vm.$httpCom.dict({
            code: 'service_promise',
          }).then(function (res) {
            vm.servicePromiseList = res.result;
          })
        },
        getStocks: function () {
          var vm = this;
          vm.$httpCom.dict({
            code: 'minus_stock',
          }).then(function (res) {
            vm.minus_stock = res.result;
          })
        },
				/**
				 * 获取成果类型
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
				 * 获取动态表单
				 */
        categorytplSelect: function () {
          var vm = this;
          httpStore.categorytplSelect({
            categoryId: this.activeCategoryId
          }).then(function (res) {
            vm.dynamicFormList = res.result;
            vm.scrollSSS();
          })
        },
				/**
				 * 图片上传回调
				 */
        imgUploadSuccess: function (successInfo, a, t, data) {
          if (typeof successInfo === 'object') {
            if (successInfo.exp.type === 'mainPhoto') {
              this.mainPhotoList.push(successInfo.data);
            } else if (successInfo.exp.type === 'mainVideo') {
              this.mainVideoList.push(successInfo.data);
            } else if (successInfo.exp.type === 'goodsVideo') {
              this.goodsVideoList.push(successInfo.data);
            } else if (successInfo.exp.type === 'techVal') {
              this.techValList.push(successInfo.data);
            } else if (successInfo.exp.type === 'mature') {
              this.matureList.push(successInfo.data);
            } else if (successInfo.exp.type === 'secrecy') {
              this.secrecyList.push(successInfo.data);
            } else if (successInfo.exp.type === 'video') {
              this.videoList.push(successInfo.data);
            }
          }

          // 特殊处理 主图
          if (data) {
            this.mainPhotoList.push({
              id: data.id,
              fileName: data.fileName,
              url: data.url
            });
          }
        },
				/**
				 * 添加关键字
				 */
        addKeywordClick: function () {
          var isAdd = true;
          for (var item of this.keyWordList) {
            if (item == this.keywordVal) {
              isAdd = false;
            }
          }
          if (!isAdd) {
            this.keywordVal = "";
            return;
          }
          if (this.formData.keyWord == '') {
            this.formData.keyWord = this.keywordVal;
          } else {
            this.formData.keyWord = this.formData.keyWord + ',' + this.keywordVal;
          }
          this.keywordVal = "";
        },
				/**
				 * 删除关键字
				 */
        delKeywordClick: function (index) {
          var newKwList = JSON.parse(JSON.stringify(this.keyWordList));
          newKwList.splice(index, 1);
          this.formData.keyWord = newKwList.join(',');
        },
				/**
				 * 删除专利图片
				 */
        delMainPhotoClick: function (index) {
          this.mainPhotoList.splice(index, 1);
        },
				/**
				 * 删除主视频
				 */
        delMainVideoClick: function (index) {
          this.mainVideoList.splice(index, 1);
        },
				/**
				 * 删除技术视频
				 */
        delTechValClick: function (index) {
          this.techValList.splice(index, 1);
        },
				/**
				 * 删除商品视频
				 */
        delGoodsVideoClick: function (index) {
          this.goodsVideoList.splice(index, 1);
        },
				/**
				 * 删除成熟度
				 */
        delMatureListClick: function (index) {
          this.matureList.splice(index, 1);
        },
				/**
				 * 删除资料附件
				 */
        delsecrecyListClick: function (index) {
          this.secrecyList.splice(index, 1);
        },
				/**
				 * 删除视频
				 */
        delvideoListClick: function (index) {
          this.videoList.splice(index, 1);
        },
				/**
				 * 删除自定义属性
				 */
        delCustomValueClick: function (index) {
          this.formData.customValueList.splice(index, 1);
        },
				/**
				 * 获取附件属性
				 */
        getAttachmentList: function (subData) {
          // 主图
          subData.attachmentList = [];
          // if (this.mainPhotoList.length) {
          for (var it in this.mainPhotoList) {
            if (this.mainPhotoList.hasOwnProperty(it)) {
              subData.attachmentList.push({
                fileId: this.mainPhotoList[it].id,
                attachmentType: dic.attachmentType.main,
                field1: it
              })
            }
          }
          // } else {
          //   var img = this.defaultImg[httpUrl.defaultImgType][subData.categoryId]
          //   subData.attachmentList.push({
          //     fileId: img.id,
          //     attachmentType: dic.attachmentType.main,
          //     field1: it
          //   })
          // }

          // 主图视频
          for (var it of this.mainVideoList) {
            subData.attachmentList.push({
              fileId: it.id,
              attachmentType: dic.attachmentType.mainVideo
            })
          }
          // 商品视频
          for (var it of this.goodsVideoList) {
            subData.attachmentList.push({
              fileId: it.id,
              attachmentType: dic.attachmentType.goodsVideo
            })
          }
          // 技术价值
          for (var it of this.techValList) {
            subData.attachmentList.push({
              fileId: it.id,
              attachmentType: dic.attachmentType.techVal
            })
          }
          // 成熟度
          for (var it of this.matureList) {
            subData.attachmentList.push({
              fileId: it.id,
              attachmentType: dic.attachmentType.mature
            })
          }
          // 资料附件
          for (var it of this.secrecyList) {
            subData.attachmentList.push({
              fileId: it.id,
              attachmentType: dic.attachmentType.secrecy
            })
          }
          // 视频附件
          for (var it of this.videoList) {
            subData.attachmentList.push({
              fileId: it.id,
              attachmentType: dic.attachmentType.video
            })
          }
        },
				/**
				 * 获取附加属性
				 */
        getAdditionalList: function (subData) {
          subData.additionalList = [];
          // this.afterSaleServiceList = [];
          // 支付方式
          subData.payMode.forEach(function (i) {
            subData.additionalList.push({
              serviceType: dic.goods_service_type.pay_mode,
              serviceCode: i
            })
          });
          // 服务承诺
          this.isFw && subData.servicePromise.forEach(function (i) {
            subData.additionalList.push({
              serviceType: dic.goods_service_type.service_promise,
              serviceCode: i
            });
          });
          // 转让方式
          subData.transactionMode != '' && subData.additionalList.push({
            serviceType: dic.goods_service_type.transaction_mode,
            serviceCode: subData.transactionMode
          });
          // 售后服务
          this.afterSaleServiceList.forEach(function (i) {
            subData.additionalList.push({
              serviceType: dic.goods_service_type.after_sale_service,
              serviceCode: i
            })
          });
          // 获取地址
          if (this.$refs.addressRef && this.$refs.addressRef[0]) {
            // 地区
            var addressArr = this.$refs.addressRef[0].getSelected();
            // 国家
            subData.additionalList.push({
              serviceType: dic.goods_service_type.administrative_division1,
              serviceCode: addressArr[0]
            })
            // 省
            subData.additionalList.push({
              serviceType: dic.goods_service_type.administrative_division2,
              serviceCode: addressArr[1]
            })
            // 城市
            subData.additionalList.push({
              serviceType: dic.goods_service_type.administrative_division3,
              serviceCode: addressArr[2]
            })
            // 区县
            subData.additionalList.push({
              serviceType: dic.goods_service_type.administrative_division4,
              serviceCode: addressArr[3]
            })
          }
          // 产品库存计数
          if (subData.categoryCode === '010' && subData.minus_stock) {
            subData.additionalList.push({
              serviceType: '010',
              serviceCode: subData.minus_stock
            })
            delete subData.minus_stock
          }
        },
				/**
				 * 获取标签属性
				 */
        getTagList: function (subData) {
          subData.tagList = [];
          // 行业
          if (subData.industry && subData.industry !== '') {
            for (var it of subData.industry) {
              subData.tagList.push(it)
            }
          }
          // 领域
          if (subData.field && subData.field !== '') {
            for (var it of subData.field) {
              subData.tagList.push(it)
            }
          }
        },
				/**
				 * 获取动态表单数据
				 */
        getValueList: function (subData) {
          subData.valueList = [];
          // 取动态属性
          for (var key in this.valueList) {
            if (this.valueList.hasOwnProperty(key)) {
              if (this.valueList[key] instanceof Array) {
                // 多选绑定的数据
                for (var it of this.valueList[key]) {
                  subData.valueList.push({
                    specId: key,
                    specValue: it
                  });
                }
              } else {
                // 直接绑定的数据
                subData.valueList.push({
                  specId: key,
                  specValue: this.valueList[key]
                });
              }
            }
          }
        },
				/**
				 * 自定义属性名点击
				 */
        customClick: function () {
          this.formData.customValueList.push({
            customSpecName: this.customName,
            customSpecValue: ''
          })
          this.isAddAttr = false;
        },
				/**
				 * 校验行业
				 */
        industryValid: function (v, o, callback) {
          var vm = this
          setTimeout(function () {
            if (vm.formData.industry.length == 0) {
              callback(o, '行业类型不能为空')
            } else {
              callback(o)
            }
          }, 1000)
        },
        goodsSampleValid: function (v, o, callback) {
          if (!this.isCd) {
            callback(o);
            return
          }
          if (!this.formData.goodsSample || this.formData.goodsSample === '') {
            callback(o, '使用要求不能为空')
          } else {
            callback(o);
          }
        },
				/**
				 * 校验服务
				 */
        fieldValid: function (v, o, callback) {
          if (this.formData.field.length == 0) {
            callback(o, '服务不能为空')
          } else {
            callback(o)
          }
        },
				/**
				 * 支付方式校验
				 */
        payModeValid: function (v, o, callback) {
          if (this.formData.payMode.length == 0) {
            callback(o, '请选择支付方式')
          } else {
            callback(o)
          }
        },
				/**
				 * 图片不能为空
				 */
        mainPhotoValid: function (v, o, callback) {
          var vm = this
          setTimeout(function () {
            if (vm.mainPhotoList.length == 0) {
              callback(o, '请上传图片')
            } else {
              callback(o)
            }
          }, 1000)
        },
				/**
				 * 校验价格
				 */
        priceValid: function (v, o, callback) {
          var $o = $(o)
          if (this.formData.price === '' && this.formData.minPrice === '' && this.formData.maxPrice === '') {
            this.isPriceDisabled = false
            this.ismmPriceDisabled = false
            callback(o, '价格不能为空')
            $o.siblings('input').removeAttr('style')
          } else if (this.formData.price) {
            this.isPriceDisabled = false
            this.ismmPriceDisabled = true
            callback(o)
          } else if (this.formData.minPrice && !this.formData.maxPrice) {
            this.isPriceDisabled = true
            this.ismmPriceDisabled = false
            callback(o, '价格区间上限不能为空')
            $o.siblings('input').removeAttr('style')
          } else if (!this.formData.minPrice && this.formData.maxPrice) {
            this.isPriceDisabled = true
            this.ismmPriceDisabled = false
            callback(o, '价格区间下限不能为空')
            $o.siblings('input').removeAttr('style')
          } else if (this.formData.minPrice && this.formData.maxPrice && Number(this.formData.minPrice) > Number(this.formData.maxPrice)) {
            callback(o, '价格区间上限不能小于价格区间下限')
            $o.siblings('input').removeAttr('style')
          } else {
            callback(o)
            $o.siblings('input').removeAttr('style')
          }
        },
				/**
				 * 校验简介
				 */
        goodsIntroduceValid: function (v, o, callback) {
          if (!this.formData.goodsIntroduce || this.formData.goodsIntroduce === '') {
            callback(o, '简介不能为空')
          } else {
            callback(o)
          }
        },
        /**
         * 校验库存
         */
        stockValid: function (v, o, callback) {
          if (!this.formData.stock || this.formData.stock === '') {
            callback(o, '库存不能为空')
          } else if(this.formData.stock<=0||this.formData.stock>999999){
            callback(o, '库存的范围：（0，999999）')
          }else {
            callback(o)
          }
        },
				/**
				 * 保存
				 */
        saveClick: function () {
          var subData = JSON.parse(JSON.stringify(this.formData))
          var vm = this;
          !vm.isSubmitDisabled && $('.valiform').validate('submitValidate', function (val) {
            if (val) {
              vm.isSubmitDisabled = true
              if (subData.customValueList.length < 1) {
                delete subData.customValueList
              }
              subData.negotiableFlag=subData.negotiableFlag?'1':'0';
              // 获取附件信息
              vm.getAttachmentList(subData);
              // 获取附加属性
              vm.getAdditionalList(subData);
              // 获取标签
              vm.getTagList(subData);

              // 获取动态表单数据
              vm.getValueList(subData);
              if (subData.id) {
                httpStore.goodsUpdate(subData).then(function (res) {
                  if (res.code == 'rest.success') {
                    vm.$dialog.showToast('保存成功');
                    vm.back();
                  }
                  vm.isSubmitDisabled = false
                }).catch(function () {
                  vm.isSubmitDisabled = false
                })
              } else {
                httpStore.goodsInsert(subData).then(function (res) {
                  if (res.code == 'rest.success') {
                    vm.$dialog.showToast('添加成功');
                    vm.back();
                  }
                  vm.isSubmitDisabled = false
                }).catch(function () {
                  vm.isSubmitDisabled = false
                })
              }
            } else {
              console.log("校验失败");
            }
          })
        },
        back: function () {
          setTimeout(function () {
            window.history.go(-1);
          }, 1500);
        },
				/**
				 * 提交
				 */
        submitClick: function () {
          var subData = JSON.parse(JSON.stringify(this.formData))
          var vm = this;
          !vm.isSubmitDisabled && $('.valiform').validate('submitValidate', function (val) {
            if (val && vm.protocol) {
              vm.isSubmitDisabled = true;
              subData.negotiableFlag=subData.negotiableFlag?'1':'0';
              // 获取附件信息
              vm.getAttachmentList(subData);
              // 获取附加属性
              vm.getAdditionalList(subData);
              // 获取标签
              vm.getTagList(subData);

              // 获取动态表单数据
              vm.getValueList(subData);
              httpStore.goodsSubmit(subData).then(function (res) {
                if (res.code == 'rest.success') {
                  vm.$dialog.showToast('提交成功');
                  vm.back();
                }
                vm.isSubmitDisabled = false
              }).catch(function () {
                vm.isSubmitDisabled = false
              })
            } else {
              val && !vm.protocol && vm.$dialog.showToast('请勾选发布协议！');
            }
          })
        },
				/**
				 * 地图点击后回调
				 */
        mapClick: function (mapInfo) {
          this.valueList[this.dynamicFormList[0].gd03CategoryTempleteDetailViews[0].specId] = mapInfo.address;
          // this.formData.location = mapInfo.address;
          // this.formData.longitude = mapInfo.lng;
          // this.formData.latitude = mapInfo.lat;
          this.isShowMap = false;
        },
				/**
				 * 动态表单单选改变
				 */
        valSelectChange: function (val) {
          if (val.replace(/(^\s*)|(\s*$)/g, "") === "原软件已登记") {
            this.valueHiddenList["83244102086299620"] = 0;
            this.valueHiddenList["83244102086299621"] = 1;
          } else if (val.replace(/(^\s*)|(\s*$)/g, "") === "原登记做过变更或补充") {
            this.valueHiddenList["83244102086299620"] = 1;
            this.valueHiddenList["83244102086299621"] = 0;
          } else {
            this.valueHiddenList["83244102086299620"] = 1;
            this.valueHiddenList["83244102086299621"] = 1;
          }
          this.valueList["83244102086299620"] = ''
          this.valueList["83244102086299621"] = ''
        },
        clearMsg: function (code) {
          this.$refs[code + 'Msg'] && (this.$refs[code + 'Msg'].innerText = '', this.$refs[code + 'El'].style = '')
        },
        handleIndustryInput: function (v) {
          v.length && this.clearMsg('industry')
        },
        handleServicesInput: function (v) {
          v.length && this.clearMsg('services')
        },
        handleOpenProtocol: function () {
          var vm = this
          this.$httpCom.protocol({
            protocolType: 4
          }).then(function (res) {
            if (res.result) {
              var options = {
                class: 'full',
                title: vm.platform+'服务平台供应发布规范',
                close: false,
                texts: '<div style="margin: 10px 20px;">' + res.result.protocolContact + '<div>',
                buttons: [
                  {
                    label: '确认阅读'
                  }
                ]
              }
              vm.$dialog.confirm2(options)
            }
          })
        }
      }
    });
  });
});
