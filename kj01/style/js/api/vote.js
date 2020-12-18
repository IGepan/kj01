/**
 * 投票等接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    // 分页取得我发布的活动(鉴权)
    selectByPage: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/selectByPage', param);
    },
    // 执行上/下架操作(鉴权)
    shelf: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/shelf', param);
    },
    // 删除活动(鉴权)
    delete: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/delete', param);
    },
    // 编辑活动(鉴权)
    update: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/update', param);
    },
    // 保存活动并提交(鉴权)
    updateSubmit: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/updateSubmit', param);
    },
    // 活动详情(鉴权)
    detail: function (param) {
      return Http.get(httpUrl.baseUrl + '/active/detail', param);
    },
    // 新增活动(鉴权)
    insert: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/insert', param);
    },
    // 保存活动并提交(鉴权)
    submit: function (param) {
      return Http.post(httpUrl.baseUrl + '/active/submit', param);
    }
  }
})
