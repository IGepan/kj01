/**
 * 公共模块
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    /**
     * 取得当前用户某菜单下所有下级菜单(鉴权)
     */
    menuTree: function (param) {
      return Http.get(httpUrl.baseUrl + '/menu/tree', param)
    },
    /**
     * 根据字典编码和分组信息获取数据字典
     */
    dict: function (param) {
      return Http.post(httpUrl.baseUrl + '/dict/select', param)
    },
    /**
     * 根据字典编码和分组信息获取数据字典多个
     */
    dictList: function (param) {
      return Http.post(httpUrl.baseUrl + '/dict/selectList', param)
    },
    /**
     * 文件上传
     */
    upload: function (param) {
      return Http.post(httpUrl.baseUrl + '/file/upload', param)
    },
    /**
     * 获取行业列表
     */
    industrySelect: function (param) {
      return Http.get(httpUrl.baseUrl + '/industry/select', param)
    },
    /**
     * 获取行业列表
     */
    selectByTypeId: function (param) {
      return Http.get(httpUrl.baseUrl + '/industry/selectByTypeId', param)
    },
    /**
     * 查询服务领域列表
     */
    servicesSelect: function (param) {
      return Http.get(httpUrl.baseUrl + '/services/select', param)
    },
		/**
		 * 取得热搜词汇
		 */
    hotKeySelectByVo: function (param) {
      return Http.post(httpUrl.baseUrl + '/hotKey/selectByVo', param);
    },
    /**
     * 取得用户信息
     */
    webCommonUser: function (param) {
      return Http.getNoToast(httpUrl.baseUrl + '/webCommon/user', param)
    },
    /**
     * 取得用户电话号码
     */
    webCommonUserPhone: function () {
      return Http.post(httpUrl.baseMarketUrl + '/certification/getUserInfo');
    },
    /**
     * 公用查询商品项目
     */
    searchList: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/selectbByPage', param)
    },
    /**
     * 取得当前访问站点所有可用的场景
     */
    sceneList: function (param) {
      return Http.post(httpUrl.baseUrl + '/scene/selectByList', param)
    },
    /**
     * 根据场景Id、通用项目值Id精确取得符合条件的领域
     */
    selectByScene: function (param) {
      return Http.post(httpUrl.baseUrl + '/services/selectByScene', param)
    },
    /**
     * 根据场景Id取得所有有效的项目，含通用项目和自定义项目，按照项目升序排列
     */
    selectItemList: function (param) {
      return Http.get(httpUrl.baseUrl + '/scene/selectItemList', param)
    },
    /**
     * 根据已选服务领域获取系统推荐的三套方案
     */
    selectMaxScorePlan: function (param) {
      return Http.post(httpUrl.baseUrl + '/diagnosis/selectMaxScorePlan', param)
    },
    /**
     * 根据已选服务领域获取系统推荐的价格最低方案
     */
    selectMinPricePlan: function (param) {
      return Http.post(httpUrl.baseUrl + '/diagnosis/selectMinPricePlan', param)
    },
    /**
     * 根据已选服务领域获取系统推荐的销量最高方案
     */
    selectMaxSalePlan: function (param) {
      return Http.post(httpUrl.baseUrl + '/diagnosis/selectMaxSalePlan', param)
    },
    /**
     * 根据已选服务领域统计本站及下级站点商品类目等于服务且服务领域属于已选服务领域范围内的有效服务商总数
     */
    statisticsFacilitator: function (param) {
      return Http.post(httpUrl.baseUrl + '/diagnosis/statisticsFacilitator', param)
    },
    /**
     * 将当前选中方案下商品ds传入服务器，保存至DB
     */
    planInsert: function (param) {
      return Http.post(httpUrl.baseUrl + '/plan/insert', param)
    },
    /**
     * 立即购买
     */
    buyNow: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/buyNow', param)
    },
    /**
     * 需求诊断获取多个商品信息
     */
    detailInfos: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/detailInfos', param)
    },
    /**
     * 店铺搜索
     */
    shopByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/shop/selectByPage', param)
    },
    /**
     * 备案信息
     */
    detailFiling: function (param) {
      return Http.get(httpUrl.baseUrl + '/shop/detailFiling', param)
    },
    /**
     * 下载备案信息
     */
    downdetailFiling: function () {
      return Http.blobFile(httpUrl.baseUrl + '/shop/downloadFiling')
    },
    /**
     * 下载备案信息
     */
    demandByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/selectbByPage', param)
    },
    // 公共订单
    commonOrder: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/detail', param)
    },
    /**
		 * 访问统计
		 */
    accessSave: function (param) {
      return Http.post(httpUrl.statisticsUrl + '/access/save', param);
    },
    /**
		 * 政策
		 */
    policy: function (param) {
      return Http.post(httpUrl.baseUrl + '/wxApp/policy/selectByPage', param);
    },
    /**
		 * 活动
		 */
    activity: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectIssuePage', param);
    },
    /**
     * 获取政策精要列表
     */
    contentList: function (param) {
      return Http.post(httpUrl.baseUrl + '/wxApp/policy/selectByPage', param);
    },
		/**
		 * 取得该站点最新服务协议
		 */
    protocol: function (param) {
      return Http.post(httpUrl.baseUrl + '/protocol/selectLatest', param)
    },
		/**
		 * 成为买家
		 */
    becomeBuyer: function (param) {
      return Http.post(httpUrl.baseUrl + '/user/becomeBuyer', param)
    },
		/**
		 * 收藏商品(鉴权)
		 * storeId: 商品id或店铺id
		 * type：收藏类型01：商品 02：店铺(字典表：
		 */
    selected: function (param) {
      return Http.post(httpUrl.baseUrl + '/collection/selected', param)
    },
		/**
		 * 取消商品收藏(鉴权)
		 * goodsId: 商品ID
		 */
    cancel: function (param) {
      return Http.get(httpUrl.baseUrl + '/collection/cancel', param)
    },
    //服务分类
    mailServiceType: function () {
      return Http.get(httpUrl.baseUrl + '/mailServiceType/tree');
    },
    //商城统计,基本信息
    mailSiteDetail: function () {
      return Http.get(httpUrl.baseUrl + '/mailSite/selectMailSite');
    },
    //获取网站的公共信息
    publicDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/saasInfoExt/detail', param);
    },
  }
})
