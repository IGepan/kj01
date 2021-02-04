/**
 * 政策解读详情
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    // 活动列表-门户
    selectIssuePage: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectIssuePage', param);
    },
    // 系列活动列表-门户
    selectPortalPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/topic/selectPortalPage', param);
    },
    // 系列活动详情-门户
    selectPortalDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/topic/selectPortalDetail', param);
    },
    // 首页-系列活动-ta举办的活动
    selectPortalIssuerActive: function (param) {
      return Http.get(httpUrl.baseUrl + '/topic/selectPortalIssuerActive', param);
    },
    // 首页-系列活动推荐
    selectPortalRecommend: function (param) {
      return Http.get(httpUrl.baseUrl + '/topic/selectPortalRecommend', param);
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
       * 品牌活动---相关活动
       * @param param
       * @returns {*}
       */
      selectRelatedActive: function (param) {
          return Http.get(httpUrl.baseUrl + '/topic/selectRelatedActive', param);
      },
  }
})
