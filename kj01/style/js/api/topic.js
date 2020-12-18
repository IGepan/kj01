/**
 * 活动发布等接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    // 分页取得我发布的专题(鉴权)
    selectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/topic/selectByPage', param);
    },
    // 执行上/下架操作(鉴权)
    shelf: function (param) {
      return Http.post(httpUrl.baseUrl + '/topic/shelf', param);
    },
    // 删除专题(鉴权)
    delete: function (param) {
      return Http.post(httpUrl.baseUrl + '/topic/delete', param);
    },
    // 活动详情(鉴权)
    detail: function (param) {
      return Http.get(httpUrl.baseUrl + '/topic/detail', param);
    },
    // 编辑活动(鉴权)
    update: function (param) {
      return Http.post(httpUrl.baseUrl + '/topic/update', param);
    },
    // 新增活动(鉴权)
    insert: function (param) {
      return Http.post(httpUrl.baseUrl + '/topic/insert', param);
    },
    // 保存活动并提交(鉴权)
    submit: function (param) {
      return Http.post(httpUrl.baseUrl + '/topic/submit', param);
    },
    // 判断是否活动(鉴权)
    isActiveLock: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/isActiveLock', param);
    },
    //获取系列活动下的学习名单列表（鉴权）
    learnSelectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/topic/selectEnrollPage', param);
    }
  }
})
