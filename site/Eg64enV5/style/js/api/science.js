/**
 * 首页模块
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    /**
     * 获取页面板块栏目店铺
     */
    selectShopByPage: function (param) {
      return Http.get(httpUrl.baseUrl + '/colcont/selectShopByPage', param);
    },
    /**
     * 获取页面板块栏目商品
     */
    selectGoodsByPage: function (param) {
      return Http.get(httpUrl.baseUrl + '/colcont/selectGoodsByPage', param);
    },
    /**
     * 获取页面板块栏目需求
     */
    selectDemandByPage: function (param) {
      return Http.get(httpUrl.baseUrl + '/colcont/selectDemandByPage', param);
    },
    // 服务统计
    statistics: function (param) {
      return Http.post(httpUrl.baseUrl + '/graph/statistics', param);
    },
    // 渝快融
    selectpByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/selectpByPage', param);
    },
    // 渝快融
    getykrlist: function (param) {
      return Http.post(httpUrl.datacq + 'financial/finProduct/list', param);
    },
    // 获取技术成果类目
    selectAchievement: function (param) {
      return Http.get(httpUrl.baseUrl + '/category/selectAchievement', param);
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
    //分页查询商品列表
    selectMailGoods: function (param) {
      return Http.post(httpUrl.baseUrl + '/mailGoods/selectByPage', param);
    },
  }
})
