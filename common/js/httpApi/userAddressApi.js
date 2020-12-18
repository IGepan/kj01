/**
 * 用户地址管理模块
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
  return {
    // 取得当前用户所有有效联系人
    selectByUserId: function (param) {
      return Http.get(httpUrl.baseUrl + '/contacts/selectByUserId', param)
    },
    // 修改委托人信息
    addressUpdate: function (param) {
      return Http.post(httpUrl.baseUrl + '/contacts/update', param)
    },
    // 委托人详细信息，返回版本号
    addressdetail: function (param) {
      return Http.get(httpUrl.baseUrl + '/contacts/detail', param)
    },
    // 设为默认地址
    addressSetDefault: function (param) {
      return Http.post(httpUrl.baseUrl + '/contacts/setdefault', param)
    },
    // 删除委托人信息
    addressDelete: function (param) {
      return Http.post(httpUrl.baseUrl + '/contacts/delete', param)
    },
    addressInsert: function (param) {
      return Http.post(httpUrl.baseUrl + '/contacts/insert', param)
    },
  }
})
