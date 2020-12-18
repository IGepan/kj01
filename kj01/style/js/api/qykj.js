/**
 * 首页等接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    // 活动栏目的接口(鉴权)
    selectPolicyByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/wxApp/policy/selectByPage', param);
    },
      // 政策栏目的接口(鉴权)
      recommendList: function (param) {
          return Http.get(httpUrl.baseUrl + '/colcont/selectPolicyByPage', param);
      },
    // 条件取得数据字典
    dictSelect: function (param) {
      return Http.post(httpUrl.baseUrl + '/dict/select', param)
    },
    // 条件取得数据字典
    getPolicyDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/wxApp/policy/detail', param)
    },
    // 条件取得数据字典
    getPolicyRelated: function (param) {
      return Http.post(httpUrl.baseUrl + '/wxApp/policy/related', param)
    },
    // 条件取得数据字典
    getPolicyQRCodeById: function (param) {
      return Http.get(httpUrl.baseUrl + '/wxApp/policy/getPolicyQRCodeById', param)
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
    }
  }
})
