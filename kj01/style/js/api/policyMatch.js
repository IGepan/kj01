/**
 * 政策速配/智配接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
   // 智能回答
   getPolicyNoticeList: function (param) {
     return Http.post(httpUrl.baseUrl + '/policyNoticeLog/extension', param)
   },   
  }
 })