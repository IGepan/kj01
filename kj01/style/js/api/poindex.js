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
    // 活动栏目的接口(鉴权)
    selectPolicyByPage1: function (param) {
      return Http.post(httpUrl.baseUrl + '/wxApp/policy/selectByPage', param);
    },
    // 活动类型参与人数统计(鉴权)
    getActiveJoinNum: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/getActiveJoinNum', param);
    },
    // 活动类型参与人数统计(鉴权)
    getWebPolicyStatistics: function (param) {
      return Http.get(httpUrl.baseUrl + '/policy/getWebPolicyStatistics', param);
    },
		/**
		 * 获取政策精要列表
		 */
        contentList: function (param) {
            return Http.post(httpUrl.baseUrl + '/wxApp/policy/selectByPage', param);
        },
    // 分页获取申报助手信息
    assistantSelectByPage: function(param) {
			return Http.post(httpUrl.baseUrl + '/wxApp/assistant/selectByPage',param)
    },
      // 分页获取政策答人信息
      policyResSelectByPage: function(param) {
          return Http.post(httpUrl.assisUrl + '/faq/selectByPage',param)
      },
  }
})
