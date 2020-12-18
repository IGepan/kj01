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
    // 活动类型参与人数统计(鉴权)
    getActiveJoinNum: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/getActiveJoinNum', param);
    },
    // 活动首页-活动统计
    getActiveStatistics: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/getActiveStatistics', param);
    },
    //活动首页-服务机构，技术成果，政策资源统计
    getGraphStatistics: function (param) {
      return Http.post(httpUrl.baseUrl + '/graph/statistics', param);
    },
      /**
       * 获取政策精要列表
       */
      contentList: function (param) {
          return Http.post(httpUrl.baseUrl + '/wxApp/policy/selectByPage', param);
      },
      // /**
      //  * 获取cms平台动态列表-分页
      //  */
      // contentListByPage: function (param) {
      //     return Http.getNoToast(httpUrl.cmsUrl + '/api/front/content/pageList', param)
      // },
      /**
       * 获取平台动态列表-分页
       */
      contentListByPage: function (param) {
          return Http.post(httpUrl.baseUrl + '/content/selectByPage', param)
      },
      /**
       * 获取平台动态-详情
       */
      contentDetail: function (param) {
          return Http.get(httpUrl.baseUrl + '/content/detail', param);
      },
    // /**
    //  * 获取cms平台动态-详情
    //  */
    // contentDetail: function (param) {
    //     return Http.getNoToast(httpUrl.cmsUrl + '/api/front/content/get', param)
    // },
		/**
		 * 获取店铺列表
		 */
    selectShopByPage: function (param) {
      return Http.get(httpUrl.baseUrl + '/colcont/selectShopByPage', param)
    },
    /**
		 * 政策问答列表
		 */
    answerSelectByType: function (param) {
      return Http.post(httpUrl.assisUrl + '/faq/selectByType', param)
    },
    /**
		 * 申报助手列表
		 */
    helperSelectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/wxApp/assistant/selectByPage', param)
    },
    /**
		 * 技术成果列表
		 */
    goodsSelectbByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/goods/selectbByPage', param)
    },
    /**
		 * 技术市场需求列表
		 */
    demandSelectbByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/demand/selectbByPage', param)
    },
    /**
		 * 技术供应商
		 */
    shopSelectbByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/shop/selectByPage', param)
    },
    /**
		 * 活动中心
		 */
    selectIssuePage: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectIssuePage', param)
    },
    /**
		 * 品牌活动
		 */
    selectPortalPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/topic/selectPortalPage', param)
    },
  }
})
