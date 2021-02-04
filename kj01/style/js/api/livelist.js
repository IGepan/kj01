/**
 * 首页等接口
 */
define(['jquery', 'httpUrl', 'http'], function ($, httpUrl, Http) {
  return {
    // 活动首页-火热进行
    selectUnderway: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectUnderway', param);
    },
    // 活动首页-活动回顾
    selectReview: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectReview', param);
    },
    // 活动首页-优秀主办方
    selectExcellentSponsor: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectExcellentSponsor', param);
    },
    // 活动首页-人气榜单
    selectPopularity: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectPopularity', param);
    },
    // 活动首页-专题精选
    selectTopic: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectTopic', param);
    },
    // 活动首页-活动统计
    getActiveStatistics: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/getActiveStatistics', param);
    },
     //活动首页-服务机构，技术成果，政策资源统计
     getGraphStatistics: function (param) {
      return Http.post(httpUrl.baseUrl + '/graph/statistics', param);
    },
    // 活动列表-门户
    selectIssuePage: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectIssuePage', param);
    },
    // 活动详情-门户
    selectIssueDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/selectIssueDetail', param);
    },
    // 活动评价列表-门户
    getActiveEvaluateListByPage: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/getActiveEvaluateListByPage', param);
    },
    // 活动推荐-门户
    getRecommendActiveById: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/getRecommendActiveById', param);
    },
    // 活动月历-门户
    selectIssueMonth: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/selectIssueMonth', param);
    },
    // 当天活动-门户
    selectIssueToday: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectIssueToday', param);
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
    // 获取通用多级树(鉴权)
    getTree: function (param) {
      return Http.post(httpUrl.baseUrl + '/treeMap/getTree', param);
    },
    // 评价项目
    activeEvaluate: function (param) {
      return Http.post(httpUrl.baseUrl + '/wxApp/active/activeEvaluate', param);
    },
    // 获取报名信息
    getUserLastEnrollInfoByActiveId: function (param) {
      return Http.get(httpUrl.baseUrl + '/wxApp/active/getUserLastEnrollInfoByActiveId', param);
    },
    // 提交报名
    groupEnrollSubmit: function (param) {
      return Http.post(httpUrl.baseUrl + '/wxApp/active/groupEnrollSubmit', param);
    },
    // 公司名称
    enterpriseTopList: function (param) {
      return Http.get(httpUrl.companyApi + '/yzw/api/enterprise/topList', param, { 'ak': 'b8a24b9b57880f1623f794db363eb10b' });
    },
    //直播页面的详情
    getLiveDetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/getActiveLive', param);
    },
    //小程序直播页面,通过手机号获取token
    getVedioToken: function (param) {
      return Http.get(httpUrl.baseUrl + '/common/getVedioToken', param);
    },
    //小程序直播页面,验证token
    validateVedio: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/validateVedio', param);
    }
  }
})
