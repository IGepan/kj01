define([], function () {
  return {
    data: {
      keyName: {},
      disabled: true,
      // 专利
      zlKeyName: {
        subTitle: '专利',
        name: '专利名称：',
        mainPhoto: '专利图片：',
        mainVideo: '技术视频：',
        mature: ''
      },
      // 软件著作
      rzKeyName: {
        subTitle: '软件著作权',
        name: '软件著作权名称：',
        mainPhoto: '软著图片：',
        mainVideo: '技术视频：',
        mature: ''
      },
      zzKeyName: {
        subTitle: '著作权',
        name: '著作名称：',
        mainPhoto: '著作图片：',
        mainVideo: '技术视频：',
        mature: ''
      },
      sbKeyName: {
        subTitle: '商标权',
        name: '商标名称：',
        mainPhoto: '商标图片：',
        mainVideo: '技术视频：',
        mature: ''
      },
      jsKeyName: {
        subTitle: '新技术',
        name: '技术名称：',
        mainPhoto: '技术图片：',
        mainVideo: '技术视频：',
        mature: ''
      },
      fwKeyName: {
        subTitle: '服务',
        name: '服务名称：',
        mainPhoto: '服务图片：',
        mainVideo: '服务视频：',
        mature: '资料附件'
      },
      cpKeyName: {
        subTitle: '产品',
        name: '产品名称：',
        mainPhoto: '产品图片：',
        mainVideo: '产品视频：',
        mature: ''
      },
      cdKeyName: {
        subTitle: '场地',
        name: '资源名称：',
        mainPhoto: '场地图片：',
        mainVideo: '场地视频：',
        mature: ''
      },
      equipmentKeyName: {
        subTitle: '设备',
        name: '设备名称：',
        mainPhoto: '设备图片：',
        mainVideo: '设备视频：',
        mature: ''
      },
      activeCategoryId: '',
      isZl: false,
      isRz: false,
      isFw: false,
      isJs: false,
      isZz: false,
      isSb: false,
      isCp: false,
      isCd: false,
      isEquipment: false,
      // 全部
      allCategoryId: '82515756322918000',
      // 专利
      zlCategoryId: "82515756322918001",
      // 软著
      rzCategoryId: "82779184723660404",
      // 著作
      zzCategoryId: "82779184723660405",
      // 商标
      sbCategoryId: "82779184723660406",
      // 技术
      jsCategoryId: "82779184723660407",
      // 服务
      fwCategoryId: "82779310439534200",
      // 产品
      cpCategoryId: "82779310439534201",
      // 资源
      zyCategoryId: "84244636343734149",
      // 场地
      cdCategoryId: "84244636343734150",
      // 设备
      equipmentCategoryId: "84244636343734151"
    },
    created: function () {
      var vm = this;
      this.activeCategoryId = this.$utils.getReqStr('categoryId');
      var categoryId = this.$utils.getReqStr('categoryId');
      vm.formData.id = vm.$utils.getReqStr('id');
      // 技术全部
      if (categoryId == this.allCategoryId) {
        this.keyName = this.zlKeyName;
        this.isZl = true;
        if (!this.formData.id) {
          this.disabled = false;
          this.activeCategoryId = this.zlCategoryId;
          categoryId = this.zlCategoryId;
        }
      }
      // 资源全部
      if (categoryId == this.zyCategoryId) {
        this.keyName = this.cdKeyName;
        if (!this.formData.id) {
          this.disabled = false;
          this.activeCategoryId = this.cdCategoryId;
          categoryId = this.cdCategoryId;
        }
      }
      vm.formData.categoryId = categoryId;
      this.initCategory(categoryId);
    },
    mounted: function () {

    },
    methods: {
      initCategory: function (categoryId) {
        if (categoryId == this.zlCategoryId) {
          this.keyName = this.zlKeyName;
          this.isZl = true;
        } else if (categoryId == this.rzCategoryId) {
          this.keyName = this.rzKeyName;
          this.isRz = true;
        } else if (categoryId == this.zzCategoryId) {
          this.keyName = this.zzKeyName;
          this.isZz = true;
        } else if (categoryId == this.sbCategoryId) {
          this.keyName = this.sbKeyName;
          this.isSb = true;
        } else if (categoryId == this.jsCategoryId) {
          this.keyName = this.jsKeyName;
          this.isJs = true;
        } else if (categoryId == this.fwCategoryId) {
          this.keyName = this.fwKeyName;
          this.isFw = true;
        } else if (categoryId == this.cpCategoryId) {
          this.keyName = this.cpKeyName;
          this.isCp = true;
        } else if (categoryId == this.cdCategoryId) {
          this.keyName = this.cdKeyName;
          this.isCd = true;
        } else if (categoryId == this.equipmentCategoryId) {
          this.keyName = this.equipmentKeyName;
          this.isEquipment = true;
        }
      },
      categoryChange: function () {
        this.formData = JSON.parse(JSON.stringify(this.copyFormData));
        this.afterSaleServiceList = [];
        this.industrySelectList = [];
        this.servicePromiseList = [];
        this.fieldList = [];
        this.categoryList = [];
        this.industryList = [];
        this.mainPhotoList = [];
        this.mainVideoList = [];
        this.goodsVideoList = [];
        this.techValList = [];
        this.matureList = [];
        this.secrecyList = [];
        this.videoList = [];
        this.dynamicFormList = [];
        this.customName = '';
        this.keywordVal = '';
        var categoryId = this.activeCategoryId;
        this.formData.categoryId = categoryId;
        if (this.industrySel) {
          this.industrySel.setResult(this.formData.industry);
        }
        $('.valiform').validate('clear');
        this.isZl = false;
        this.isRz = false;
        this.isZz = false;
        this.isSb = false;
        this.isJs = false;
        this.isFw = false;
        this.isCp = false;
        this.isCd = false;
        this.isEquipment = false;
        this.initCategory(categoryId);
        this.categorySelectByVo();
        this.categorytplSelect();
      }
    },
  }
})
