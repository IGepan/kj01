/**
 * 技术市场接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
 return {
  // 二级级联
  industryselect: function (param) {
   return Http.get(httpUrl.baseUrl + '/industry/select', param);
  },
  // 市场动态--最近成交
  orderselectpByPage: function (param) {
   return Http.post(httpUrl.baseUrl + '/order/selectpByPage', param);
  },
  // 市场动态--最新发布
  goodsselectbByPage: function (param) {
   return Http.post(httpUrl.baseUrl + '/goods/selectbByPage', param);
  },
  selectAchievement: function (param) {
   return Http.get(httpUrl.baseUrl + '/category/selectAchievement', param);
  },
  // 需求列表
  demandselectbByPage: function (param) {
   return Http.post(httpUrl.baseUrl + '/demand/selectbByPage', param);
  },
  // 店铺
  shopselectByPage: function (param) {
   return Http.post(httpUrl.baseUrl + '/shop/selectByPage', param);
  },
  statistics: function (param) {
   return Http.post(httpUrl.baseUrl + '/graph/statistics', param);
  },
  //获取培训通知列表
  trainingSelectByPage: function (param) {
   return Http.post(httpUrl.baseUrl + '/topic/selectPortalPage', param);
  },
  //技术经纪人认定体系
  tabs1SelectByPage: function (param) {
   return Http.post(httpUrl.baseUrl + '/content/selectByPage', param);
  },
 }
})
