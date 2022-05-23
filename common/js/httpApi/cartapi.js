/**
 * 购物车模块
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    // 取得当前登录用户购物车中所有商品
    shopcarSelect: function (param) {
      var shops = {}
      return Http.get(httpUrl.baseUrl + '/shopcar/select', param)
    },
    // 从购物车中删除该商品
    shopcarDelete: function (param) {
      return Http.get(httpUrl.baseUrl + '/shopcar/delete', param)
    },
    // 从购物车中批量删除该商品
    shopcarDeleteBatch: function (param) {
      return Http.post(httpUrl.baseUrl + '/shopcar/deleteBatch', param)
    },
    // 改变sku在当前用户购物车中数量
    shopcarChangeNum: function (param) {
      return Http.get(httpUrl.baseUrl + '/shopcar/changeNum', param)
    },
    // 取得订单初始化信息
    getOrderInfo: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/creatOrderList', param)
    },
    // 条件取得数据字典
    dictSelect: function (param) {
      return Http.post(httpUrl.baseUrl + '/dict/select', param)
    },
    // 新增订单
    addOrder: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/insert', param)
    },
    // 新增订单
    getFormToken: function (param) {
      return Http.get(httpUrl.baseUrl + '/common/getFormToken', param)
    },
		/**
		 * 推荐
		 */
    popularList: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/popularList', param)
    },
		/**
		 * 立即购买
		 */
    buyNow: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/buyNow', param)
    },
    getQ: function (param) {
      return Http.post(httpUrl.baseUrl + '/v3/nativePay', param);
    },
    getResult: function (param) {
      return Http.post(httpUrl.baseUrl + '/payLog/select', param);
    },
    getUpdateStatus: function (param) {
      return Http.post(httpUrl.baseUrl + '/order/buyer/updateStatus', param);
    },
  }
})
