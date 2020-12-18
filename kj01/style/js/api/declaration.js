/**
 * 首页等接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    // 活动栏目的接口(鉴权)
    selectActiveByPage: function (param) {
      return Http.get(httpUrl.baseUrl + '/colcont/selectActiveByPage', param);
    },
    // 政策栏目的接口(鉴权)
    selectPolicyByPage: function (param) {
      return Http.get(httpUrl.baseUrl + '/colcont/selectPolicyByPage', param);
    },
    // 申报助手栏目
    selectDocumentByColumnCode: function (param) {
      return Http.get(httpUrl.baseUrl + '/colcont/selectDocumentByColumnCode', param)
    },
    // 条件取得数据字典
    getPolicyRelated: function (param) {
      return Http.post(httpUrl.baseUrl + '/wxApp/policy/related', param)
    },
    // 条件取得数据字典
    getPolicyRelated: function (param) {
      return Http.post(httpUrl.baseUrl + '/wxApp/policy/related', param)
    },
    // 统计
    getDocumentDtlById: function (param) {
      return Http.get(httpUrl.baseUrl + '/wxApp/policy/getDocumentDtlById', param)
    },
    // 统计
    wxappSave: function (param) {
      return Http.post(httpUrl.statisticsUrl + '/access/wxappSave', param)
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
    // 分页获取申报助手信息
    assistantSelectByPage: function(param) {
			return Http.post(httpUrl.baseUrl + '/wxApp/assistant/selectByPage',param)
    },
    //预览
      preview: function (param) {
          return Http.get(httpUrl.imgUploadUrl + '/file/preview', param)
      },
  }
})
