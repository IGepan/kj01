/**
 * 申报助手接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
 return {
  // 分页获取申报助手信息
  assistantSelectByPage: function (param) {
   return Http.post(httpUrl.baseUrl + '/wxApp/assistant/selectByPage', param)
  },
  assistantDetail: function (param) {
   return Http.get(httpUrl.baseUrl + '/wxApp/assistant/detail', param)
  }
 }
})
