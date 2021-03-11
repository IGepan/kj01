/**
 * 店铺商店接口模块
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
		/**
		 * 店铺综合统计
		 * shopCode: 店铺短码，url中解析
		 */
    statistics: function (param) {
      return Http.get(httpUrl.baseUrl + '/shop/statistics', param)
    },
		/**
		 * 取得店铺首页基础信息
		 * shopCode: 店铺短码，url中解析
		 */
    indexInfo: function (param) {
      return Http.get(httpUrl.baseUrl + '/shop/indexInfo', param)
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
		/**
		 * 取得店铺最新商品
		 * shopCode: 店铺短码
		 * pageSize：取多少条
		 */
    latestGoods: function (param) {
      return Http.post(httpUrl.baseUrl + '/shop/latestGoods', param)
    },
		/**
		 * 取得关注当前店铺的用户
		 * shopCode: 店铺短码
		 * pageSize：取多少条
		 */
    whoConcernList: function (param) {
      return Http.post(httpUrl.baseUrl + '/collection/whoConcern', param)
    },
		/**
		 * 分页取得商品
		 */
    selectpByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/selectpByPage', param)
    },
      /**
       * 易智商城店铺商品列表
       * @param param
       * @returns {*|void}
       */
    selectByMailShopPage: function (param) {
        return Http.post(httpUrl.baseUrl + '/mailGoods/selectByShopPage', param)
    },
		/**
		 * 根据模板主键取得模板可动态变更属性及【用户已经设定的默认值】(鉴权)
		 */
    categorySelectByVo: function (param) {
      return Http.get(httpUrl.baseUrl + '/category/selectByVo', param)
    },
		/**
		 * 筛选指定店铺同类机构
		 * shopCode: 店铺短码
		 */
    similar: function (param) {
      return Http.post(httpUrl.baseUrl + '/shop/similar', param)
    },
		/**
		 * 筛选当前店铺所有资质，资质图片选择一张，最开始传的那张
		 * shopCode: 店铺短码
		 */
    selectFst: function (param) {
      return Http.get(httpUrl.baseUrl + '/certificate/selectFst', param)
    },
    // 当前店铺成交明细
    orderSelectpByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/selectpByPage', param)
    },
    // 店铺评论
    commentSelectpByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/evaluate/shop/selectpByPage', param)
    },
    // 店铺激活判断
    shopAccess: function (param) {
      return Http.post(httpUrl.baseUrl + '/shop/access', param)
    },
    // 取得商品详情	get
    goodsDetailInfo: function (param) {
      return Http.get(httpUrl.baseUrl + '/goods/detailInfo', param)
    },
    // 判断当前商品是否是本级站点或及本级下级站点的商品	get
    saasIsLower: function (param) {
      return Http.get(httpUrl.baseUrl + '/saas/isLower', param)
    },
    // 添加商品进购物车	post
    shopcarAdd: function (param) {
      return Http.post(httpUrl.baseUrl + '/shopcar/add', param)
    },
    // 文件下载	get
    fileDownload: function (param) {
      return Http.get(httpUrl.baseUrl + '/file/download', param)
    },
    // 分页取得商品评论	post
    evaluateSelectpByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/evaluate/goods/selectpByPage', param)
    },
    // 指定商品评分统计	get
    evaluateStatistics: function (param) {
      return Http.get(httpUrl.baseUrl + '/evaluate/goods/statistics', param)
    },
    // 服务商推荐
    goodsSimilarByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/similarByPage', param)
    },
    // 店铺实时数据
    visitselectShopNum: function (param) {
      return Http.get(httpUrl.baseUrl + '/visit/selectShopNum', param)
    },
  //    保存足迹
  saveFootprint: function (param) {
      return Http.post(httpUrl.baseUrl + '/mailGoodsPrint/save', param)
  },
  }
})
