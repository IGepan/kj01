/**
 * 首页相关接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    //活动类型
    activityGetTree: function (param) {
      return Http.post(httpUrl.baseUrl + '/treeMapSaas/getTree', param);
    },
    //活动列表
    activityList: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectIssuePage', param);
    },
    //技术列表
    scienceList: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/selectbByPage', param);
    },
    //服务机构
    shopList: function (param) {
      return Http.post(httpUrl.baseUrl + '/shop/selectByPage', param);
    },
    //政策解读
    policyList: function (param) {
      return Http.post(httpUrl.baseUrl + '/wxApp/policy/selectByPage', param);
    },
    //新闻-平台动态
    newsList: function (param) {
      return Http.post(httpUrl.baseUrl + '/content/selectByPage', param);
    },
    //新闻-平台动态-详情
    newsDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/content/detail', param);
    },
    //服务分类
    mailServiceType: function () {
      return Http.get(httpUrl.baseUrl + '/mailServiceType/tree');
    },
    //分页查询商品列表
    selectMailGoods: function (param) {
      return Http.post(httpUrl.baseUrl + '/mailGoods/selectByPage', param);
    },
    //首页轮播图
    getBanner:function (param){
      return Http.get(httpUrl.baseUrl + '/saasInfoExt/selectBanners', param);
    }
  }
})
