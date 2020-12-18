/**
 * 政策解读详情
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    // 通过文件Id获取政策解读详情
    getDetailById: function (param) {
      return Http.get(httpUrl.baseUrl + '/annotation/selectAnnotationByFileId', param);
    }
  }
})
