/**
 * 政策问答接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
 return {
  // 获取分类下的所有问题及访问量
  selectByType: function (param) {
   return Http.post(httpUrl.assisUrl + '/faq/selectByType', param)
  },
  //获取所有分类下的部分问题
  selectByPage: function (param) {
   return Http.post(httpUrl.assisUrl + '/faq/selectByPage', param)
  },
  //通过id获取faq信息
  getFaqById: function (param) {
   return Http.get(httpUrl.assisUrl + '/faq/getFaqById', param)
  },
  // 智能回答
  getQuestionRecordAnswer: function (param) {
    console.log(param)
    return Http.post(httpUrl.baseUrl + '/questionRecord/getAnswer', param)
  },   
 }
})